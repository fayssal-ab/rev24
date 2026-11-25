import { ok, fail, BUILTINS, ALIASES, type CmdFn, type CmdRes, type Shell, type Ask } from '../shell';
import { lookup, dirname, basename, dir, file, link, walk, type FNode } from '../vfs';
import { KERNEL, HOSTNAME, TARGETS, RUNLEVEL_TARGET, grubCfg, type Service, type Pkg } from '../system';
import { COMMANDS } from '../commands';
import { MAN } from '../man';

const now = () => new Date();
const DAYS = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'];
const MONS = ['janv.', 'févr.', 'mars', 'avril', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
const pad = (n: number) => String(n).padStart(2, '0');
const hms = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
const jdate = (ts: number) => {
  const d = new Date(ts);
  return `${MONS[d.getMonth()]} ${pad(d.getDate())} ${hms(d)}`;
};

// ---------------- systemd ----------------
function unitName(n: string): string {
  return /\.(service|target|socket|timer|mount)$/.test(n) ? n : `${n}.service`;
}
function svcOf(sh: Shell, n: string): Service | undefined {
  return sh.state.services[unitName(n).replace(/\.service$/, '')];
}

function wantsLink(sh: Shell, s: Service, on: boolean): string {
  const wantsDir = `/etc/systemd/system/${s.wantedBy}.wants`;
  let d = lookup(sh.state.root, wantsDir);
  const sys = lookup(sh.state.root, '/etc/systemd/system')!;
  const unitPath = s.custom ? `/etc/systemd/system/${s.name}.service` : `/usr/lib/systemd/system/${s.name}.service`;
  if (on) {
    if (!d) {
      d = dir();
      sys.kids![`${s.wantedBy}.wants`] = d;
    }
    d.kids![`${s.name}.service`] = link(unitPath);
    return `Created symlink ${wantsDir}/${s.name}.service → ${unitPath}.\n`;
  }
  if (d?.kids?.[`${s.name}.service`]) {
    delete d.kids[`${s.name}.service`];
    return `Removed "${wantsDir}/${s.name}.service".\n`;
  }
  return '';
}

function startSvc(sh: Shell, s: Service): string | null {
  if (s.custom) {
    const exe = s.execStart.split(/\s+/)[0];
    const n = lookup(sh.state.root, exe);
    if (!n || n.t !== 'f') {
      s.active = 'failed';
      sh.log(`${s.name}.service`, `${s.name}.service: Failed to locate executable ${exe}: No such file or directory`, 3);
      sh.log(`${s.name}.service`, `${s.name}.service: Failed at step EXEC spawning ${exe}: No such file or directory`, 3);
      return `Job for ${s.name}.service failed because the control process exited with error code.\nSee "systemctl status ${s.name}.service" and "journalctl -xeu ${s.name}.service" for details.`;
    }
    if (!(n.mode & 0o111)) {
      s.active = 'failed';
      sh.log(`${s.name}.service`, `${s.name}.service: Failed at step EXEC spawning ${exe}: Permission denied`, 3);
      return `Job for ${s.name}.service failed because the control process exited with error code.\nSee "systemctl status ${s.name}.service" and "journalctl -xeu ${s.name}.service" for details.`;
    }
  }
  if (s.name === 'kdump') {
    s.active = 'failed';
    sh.log('kdump.service', 'kdump: No memory reserved for crash kernel', 3);
    return 'Job for kdump.service failed because the control process exited with error code.\nSee "systemctl status kdump.service" and "journalctl -xeu kdump.service" for details.';
  }
  s.active = 'active';
  s.pid = sh.state.nextPid++;
  sh.log('systemd', `Started ${s.desc}.`);
  return null;
}

function statusText(sh: Shell, s: Service): string {
  const masked = s.enabled === 'masked';
  const path = s.custom ? `/etc/systemd/system/${s.name}.service` : `/usr/lib/systemd/system/${s.name}.service`;
  const dot = s.active === 'active' ? '●' : s.active === 'failed' ? '×' : '○';
  const since = new Date(sh.state.bootTime + 5000);
  const sinceS = `${DAYS[since.getDay()]} ${since.toISOString().slice(0, 10)} ${hms(since)} +01`;
  const loaded = masked ? `masked (Reason: Unit ${s.name}.service is masked.)` : `loaded (${path}; ${s.enabled}; preset: ${['sshd', 'crond', 'firewalld', 'chronyd', 'NetworkManager', 'rsyslog', 'auditd', 'kdump', 'tuned'].includes(s.name) ? 'enabled' : 'disabled'})`;
  const active = s.active === 'active' ? `active (running) since ${sinceS}` : s.active === 'failed' ? `failed (Result: exit-code) since ${sinceS}` : 'inactive (dead)';
  let t = `${dot} ${s.name}.service - ${s.desc}\n     Loaded: ${loaded}\n     Active: ${active}\n`;
  if (s.active === 'active') t += `   Main PID: ${s.pid} (${basename(s.execStart.split(' ')[0])})\n      Tasks: 1 (limit: 22950)\n     Memory: 2.1M\n        CPU: 32ms\n     CGroup: /system.slice/${s.name}.service\n             └─${s.pid} ${s.execStart}\n`;
  const logs = sh.state.journal.filter((e) => e.unit === `${s.name}.service`).slice(-5);
  if (logs.length) t += '\n' + logs.map((e) => `${jdate(e.ts)} ${HOSTNAME} ${s.name}[${s.pid ?? 1}]: ${e.msg}`).join('\n') + '\n';
  return t;
}

function defaultTarget(sh: Shell): string {
  const l = lookup(sh.state.root, '/etc/systemd/system/default.target', false);
  return l?.t === 'l' ? basename(l.target!) : 'graphical.target';
}

export const systemctl: CmdFn = ({ args, sh }) => {
  const flags = args.filter((a) => a.startsWith('-'));
  const pos = args.filter((a) => !a.startsWith('-'));
  const type = (flags.find((f) => f.startsWith('--type=')) ?? (args.includes('--type') || args.includes('-t') ? '--type=' + args[args.indexOf(args.includes('-t') ? '-t' : '--type') + 1] : '')).split('=')[1];
  if (type) pos.splice(pos.indexOf(type), pos.indexOf(type) >= 0 ? 1 : 0);
  const verb = pos[0] ?? 'list-units';
  const units = pos.slice(1);
  if (flags.includes('--version')) return ok('systemd 252 (252-32.el9_4)\n+PAM +AUDIT +SELINUX -APPARMOR +IMA +SMACK +SECCOMP +GCRYPT +GNUTLS +OPENSSL +ACL +BLKID +CURL +ELFUTILS -FIDO2 +IDN2 -IDN -IPTC +KMOD +LIBCRYPTSETUP +LIBFDISK +PCRE2 -PWQUALITY +P11KIT -QRENCODE +TPM2 +BZIP2 +LZ4 +XZ +ZLIB +ZSTD -BPF_FRAMEWORK +XKBCOMMON +UTMP +SYSVINIT default-hierarchy=unified\n');
  const needRoot = ['start', 'stop', 'restart', 'reload', 'enable', 'disable', 'mask', 'unmask', 'set-default', 'isolate', 'daemon-reload', 'kill', 'reboot', 'poweroff'];
  if (needRoot.includes(verb) && !sh.isRoot) {
    if (verb === 'daemon-reload' || verb === 'set-default' || verb === 'isolate') return fail(`Failed to ${verb}: Interactive authentication required.`, 1);
    return fail(`Failed to ${verb} ${unitName(units[0] ?? '')}: Interactive authentication required.\nSee system logs and 'systemctl status ${unitName(units[0] ?? '')}' for details.`, 1);
  }
  const notFound = (u: string, v = verb) => fail(v === 'status' ? `Unit ${unitName(u)} could not be found.` : `Failed to ${v} ${unitName(u)}: Unit ${unitName(u)} not found.`, v === 'status' ? 4 : 5);
  switch (verb) {
    case 'status': {
      if (!units.length) return ok(`● ${HOSTNAME}\n    State: ${Object.values(sh.state.services).some((s) => s.active === 'failed') ? 'degraded' : 'running'}\n    Units: 312 loaded (incl. loaded aliases)\n     Jobs: 0 queued\n   Failed: ${Object.values(sh.state.services).filter((s) => s.active === 'failed').length} units\n    Since: ${new Date(sh.state.bootTime).toString()}\n  systemd: 252-32.el9_4\n`);
      let out = '';
      let code = 0;
      for (const u of units) {
        if (u.endsWith('.target')) {
          const t = TARGETS[u];
          if (!t) return notFound(u);
          const active = u === sh.state.currentTarget || (t.active && !(sh.state.currentTarget === 'multi-user.target' && u === 'graphical.target'));
          out += `${active ? '●' : '○'} ${u} - ${t.desc}\n     Loaded: loaded (/usr/lib/systemd/system/${u}; ${u === defaultTarget(sh) ? 'indirect' : 'static'})\n     Active: ${active ? 'active' : 'inactive (dead)'}\n`;
          continue;
        }
        const s = svcOf(sh, u);
        if (!s) return notFound(u);
        out += statusText(sh, s);
        if (s.active !== 'active') code = 3;
      }
      return { out, err: '', code };
    }
    case 'start':
    case 'restart':
    case 'reload':
    case 'stop': {
      let err = '';
      for (const u of units) {
        if (u.endsWith('.target')) continue;
        const s = svcOf(sh, u);
        if (!s) return notFound(u);
        if (s.enabled === 'masked' && verb !== 'stop') {
          err += `Failed to ${verb} ${s.name}.service: Unit ${s.name}.service is masked.\n`;
          continue;
        }
        if (verb === 'stop') {
          if (s.active === 'active') sh.log('systemd', `Stopped ${s.desc}.`);
          s.active = 'inactive';
          s.pid = undefined;
        } else if (verb === 'reload') {
          if (s.active !== 'active') err += `Job for ${s.name}.service invalid.\n`;
          else if (!s.reload) err += `Failed to reload ${s.name}.service: Job type reload is not applicable for unit ${s.name}.service.\n`;
          else sh.log('systemd', `Reloaded ${s.desc}.`);
        } else {
          if (verb === 'restart' && s.active === 'active') sh.log('systemd', `Stopped ${s.desc}.`);
          const e = startSvc(sh, s);
          if (e) err += e + '\n';
        }
      }
      return { out: '', err, code: err ? 1 : 0 };
    }
    case 'enable':
    case 'disable': {
      const now2 = flags.includes('--now');
      let out = '';
      let err = '';
      for (const u of units) {
        const s = svcOf(sh, u);
        if (!s) return notFound(u);
        if (s.enabled === 'masked') {
          err += `Failed to ${verb} unit: Unit file /etc/systemd/system/${s.name}.service is masked.\n`;
          continue;
        }
        if (s.enabled === 'static') {
          out += `The unit files have no installation config (WantedBy=, RequiredBy=, Also=,\nAlias= settings in the [Install] section, and DefaultInstance= for template\nunits). This means they are not meant to be enabled or disabled using systemctl.\n`;
          continue;
        }
        if (verb === 'enable') {
          if (s.enabled !== 'enabled') out += wantsLink(sh, s, true);
          s.enabled = 'enabled';
          if (now2 && s.active !== 'active') {
            const e = startSvc(sh, s);
            if (e) err += e + '\n';
          }
        } else {
          if (s.enabled === 'enabled') out += wantsLink(sh, s, false);
          s.enabled = 'disabled';
          if (now2) s.active = 'inactive';
        }
      }
      return { out: '', err: out + err, code: err ? 1 : 0 };
    }
    case 'mask':
    case 'unmask': {
      let out = '';
      for (const u of units) {
        const s = svcOf(sh, u);
        if (!s) return notFound(u);
        const sys = lookup(sh.state.root, '/etc/systemd/system')!;
        if (verb === 'mask') {
          if (s.enabled !== 'masked') {
            s.unmaskTo = s.enabled;
            if (s.enabled === 'enabled') wantsLink(sh, s, false);
            s.enabled = 'masked';
            sys.kids![`${s.name}.service`] = link('/dev/null');
            out += `Created symlink /etc/systemd/system/${s.name}.service → /dev/null.\n`;
          }
        } else if (s.enabled === 'masked') {
          s.enabled = s.unmaskTo === 'enabled' ? 'disabled' : s.unmaskTo ?? 'disabled';
          delete sys.kids![`${s.name}.service`];
          out += `Removed "/etc/systemd/system/${s.name}.service".\n`;
        }
      }
      return { out: '', err: out, code: 0 };
    }
    case 'is-active': {
      let out = '';
      let code = 0;
      for (const u of units) {
        if (u.endsWith('.target')) {
          const a = TARGETS[u]?.active && !(sh.state.currentTarget === 'multi-user.target' && u === 'graphical.target');
          out += (a ? 'active' : 'inactive') + '\n';
          if (!a) code = 3;
          continue;
        }
        const s = svcOf(sh, u);
        const st = s ? s.active : 'inactive';
        out += st + '\n';
        if (st !== 'active') code = 3;
      }
      return { out, err: '', code };
    }
    case 'is-enabled': {
      let out = '';
      let code = 0;
      for (const u of units) {
        const s = svcOf(sh, u);
        if (!s) {
          if (u.endsWith('.target') && TARGETS[u]) {
            out += 'static\n';
            continue;
          }
          return fail(`Failed to get unit file state for ${unitName(u)}: No such file or directory`, 1);
        }
        out += s.enabled + '\n';
        if (s.enabled !== 'enabled' && s.enabled !== 'static') code = 1;
      }
      return { out, err: '', code };
    }
    case 'is-failed': {
      const s = svcOf(sh, units[0] ?? '');
      return { out: (s?.active === 'failed' ? 'failed' : s?.active ?? 'inactive') + '\n', err: '', code: s?.active === 'failed' ? 0 : 1 };
    }
    case 'get-default':
      return ok(defaultTarget(sh) + '\n');
    case 'set-default': {
      const t = units[0];
      if (!t || !TARGETS[t.endsWith('.target') ? t : `${t}.target`]) return fail(`Failed to set default target: Unit file ${t ?? ''} does not exist.`, 1);
      const tt = t.endsWith('.target') ? t : `${t}.target`;
      const sys = lookup(sh.state.root, '/etc/systemd/system')!;
      sys.kids!['default.target'] = link(`/usr/lib/systemd/system/${tt}`);
      return { out: '', err: `Removed "/etc/systemd/system/default.target".\nCreated symlink /etc/systemd/system/default.target → /usr/lib/systemd/system/${tt}.\n`, code: 0 };
    }
    case 'isolate': {
      const t = units[0];
      const tt = t?.endsWith('.target') ? t : `${t}.target`;
      if (!t || !TARGETS[tt]) return fail(`Failed to start ${tt}: Unit ${tt} not found.`, 5);
      if (tt === 'poweroff.target' || tt === 'reboot.target') return reboot({ argv: ['reboot'], args: [], stdin: null, sh });
      sh.state.currentTarget = tt;
      if (tt === 'multi-user.target' && sh.state.services.gdm) sh.state.services.gdm.active = 'inactive';
      if (tt === 'graphical.target' && sh.state.services.gdm) sh.state.services.gdm.active = 'active';
      if (tt === 'rescue.target' || tt === 'emergency.target') {
        for (const s of Object.values(sh.state.services)) if (s.name !== 'systemd-journald') s.active = 'inactive';
        return ok(`(simulé) Passage en ${tt} : la plupart des services sont arrêtés. Revenez avec « systemctl isolate ${defaultTarget(sh)} ».\n`);
      }
      return ok();
    }
    case 'list-units':
    case 'list-unit-files': {
      const all = flags.includes('--all') || flags.includes('-a');
      const failed = flags.includes('--failed') || flags.some((f) => f === '--state=failed');
      if (verb === 'list-unit-files') {
        const rows: string[] = [];
        if (!type || type === 'service') for (const s of Object.values(sh.state.services).sort((a, b) => a.name.localeCompare(b.name))) rows.push(`${(s.name + '.service').padEnd(38)} ${s.enabled.padEnd(15)} ${['sshd', 'crond', 'firewalld', 'chronyd'].includes(s.name) ? 'enabled' : 'disabled'}`);
        if (!type || type === 'target') for (const t of Object.keys(TARGETS).sort()) rows.push(`${t.padEnd(38)} ${(t === defaultTarget(sh) ? 'indirect' : 'static').padEnd(15)} -`);
        return ok(`UNIT FILE                              STATE           PRESET\n${rows.join('\n')}\n\n${rows.length} unit files listed.\n`);
      }
      const rows: string[] = [];
      if (!type || type === 'service') {
        for (const s of Object.values(sh.state.services).sort((a, b) => a.name.localeCompare(b.name))) {
          if (failed && s.active !== 'failed') continue;
          if (!all && !failed && s.active === 'inactive') continue;
          const sub = s.active === 'active' ? 'running' : s.active === 'failed' ? 'failed' : 'dead';
          rows.push(`${s.active === 'failed' ? '●' : ' '} ${(s.name + '.service').padEnd(32)} ${s.enabled === 'masked' ? 'masked' : 'loaded'} ${s.active.padEnd(8)} ${sub.padEnd(7)} ${s.desc}`);
        }
      }
      if ((!type || type === 'target') && !failed) {
        for (const [t, v] of Object.entries(TARGETS)) {
          const active = v.active && !(sh.state.currentTarget === 'multi-user.target' && t === 'graphical.target');
          if (!all && !active) continue;
          rows.push(`  ${t.padEnd(32)} loaded ${(active ? 'active' : 'inactive').padEnd(8)} ${(active ? 'active' : 'dead').padEnd(7)} ${v.desc}`);
        }
      }
      return ok(`  UNIT                             LOAD   ACTIVE   SUB     DESCRIPTION\n${rows.join('\n')}${rows.length ? '\n' : ''}\nLOAD   = Reflects whether the unit definition was properly loaded.\nACTIVE = The high-level unit activation state, i.e. generalization of SUB.\nSUB    = The low-level unit activation state, values depend on unit type.\n${rows.length} loaded units listed.${all ? '' : " Pass --all to see loaded but inactive units, too."}\n`);
    }
    case 'daemon-reload': {
      const sys = lookup(sh.state.root, '/etc/systemd/system')!;
      for (const [k, n] of Object.entries(sys.kids!)) {
        if (!k.endsWith('.service') || n.t !== 'f') continue;
        const txt = n.data ?? '';
        const get = (key: string) => new RegExp(`^${key}\\s*=\\s*(.*)$`, 'm').exec(txt)?.[1]?.trim();
        const name = k.replace(/\.service$/, '');
        const prev = sh.state.services[name];
        sh.state.services[name] = {
          name,
          desc: get('Description') ?? name,
          active: prev?.active ?? 'inactive',
          enabled: prev?.enabled ?? (get('WantedBy') ? 'disabled' : 'static'),
          execStart: get('ExecStart') ?? '',
          wantedBy: get('WantedBy') ?? 'multi-user.target',
          custom: true,
          pid: prev?.pid,
          reload: false
        };
      }
      return ok();
    }
    case 'kill': {
      const s = svcOf(sh, units[0] ?? '');
      if (!s) return notFound(units[0] ?? '');
      s.active = 'inactive';
      return ok();
    }
    case 'reboot':
    case 'poweroff':
      return reboot({ argv: [verb], args: [], stdin: null, sh });
    case 'cat': {
      const s = svcOf(sh, units[0] ?? '');
      if (!s) return notFound(units[0] ?? '');
      const p = s.custom ? `/etc/systemd/system/${s.name}.service` : `/usr/lib/systemd/system/${s.name}.service`;
      return ok(`# ${p}\n${lookup(sh.state.root, p)?.data ?? ''}`);
    }
    default:
      return fail(`Unknown command verb ${verb}.`, 1);
  }
};

const PRIO: Record<string, number> = { emerg: 0, alert: 1, crit: 2, err: 3, warning: 4, notice: 5, info: 6, debug: 7 };

export const journalctl: CmdFn = ({ args, sh }) => {
  let unit: string | null = null;
  let prio = 7;
  let n: number | null = null;
  let boot: number | null = null;
  let since: number | null = null;
  let output = 'short';
  let follow = false;
  let reverse = false;
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '-u' || a === '--unit') unit = args[++i];
    else if (a.startsWith('--unit=')) unit = a.slice(7);
    else if (a === '-p' || a === '--priority') {
      const v = args[++i];
      prio = PRIO[v] ?? +v;
    } else if (a.startsWith('--priority=')) prio = PRIO[a.slice(11)] ?? +a.slice(11);
    else if (a === '-n' || a === '--lines') n = +args[++i];
    else if (/^-n\d+$/.test(a)) n = +a.slice(2);
    else if (a === '-b' || a === '--boot') {
      boot = 0;
      if (args[i + 1] && /^-?\d+$/.test(args[i + 1])) boot = +args[++i];
    } else if (a === '--since' || a === '-S') {
      const v = args[++i] ?? '';
      if (v === 'today') {
        const d = now();
        d.setHours(0, 0, 0, 0);
        since = d.getTime();
      } else if (v === 'yesterday') since = Date.now() - 86400000;
      else if (/(\d+)\s*(hour|min|day)/.test(v)) {
        const m = /(\d+)\s*(hour|min|day)/.exec(v)!;
        since = Date.now() - +m[1] * (m[2] === 'hour' ? 3600000 : m[2] === 'min' ? 60000 : 86400000);
      } else since = Date.parse(v.replace(' ', 'T')) || null;
    } else if (a === '-o' || a === '--output') output = args[++i];
    else if (a.startsWith('--output=')) output = a.slice(9);
    else if (a === '-f' || a === '--follow') follow = true;
    else if (a === '-r' || a === '--reverse') reverse = true;
    else if (a === '-e') n = n ?? 1000;
  }
  const privileged = sh.isRoot || sh.userGids(sh.user).some((g) => ['adm', 'wheel', 'systemd-journal'].includes(sh.groupName(g)));
  if (!privileged) return ok("Hint: You are currently not seeing messages from other users and the system.\n      Users in groups 'adm', 'systemd-journal', 'wheel' can see all messages.\n      Pass -q to turn off this notice.\n-- No entries --\n");
  let entries = sh.state.journal.filter((e) => e.prio <= prio);
  if (unit) {
    const u = unit.replace(/\.service$/, '');
    entries = entries.filter((e) => e.unit.replace(/\.service$/, '') === u);
  }
  if (boot !== null) entries = entries.filter((e) => e.boot === boot);
  if (since !== null) entries = entries.filter((e) => e.ts >= since!);
  if (n !== null) entries = entries.slice(-n);
  if (follow && n === null) entries = entries.slice(-10);
  if (reverse) entries = [...entries].reverse();
  const fmt = (e: (typeof entries)[0]) => {
    const proc = e.unit.replace(/\.service$/, '');
    if (output === 'cat') return e.msg;
    if (output === 'json') return JSON.stringify({ __REALTIME_TIMESTAMP: String(e.ts * 1000), PRIORITY: String(e.prio), _SYSTEMD_UNIT: e.unit, SYSLOG_IDENTIFIER: proc, MESSAGE: e.msg, _HOSTNAME: HOSTNAME });
    if (output === 'json-pretty') return JSON.stringify({ __REALTIME_TIMESTAMP: String(e.ts * 1000), PRIORITY: String(e.prio), _SYSTEMD_UNIT: e.unit, SYSLOG_IDENTIFIER: proc, MESSAGE: e.msg, _HOSTNAME: HOSTNAME }, null, '\t');
    if (output === 'verbose') return `${new Date(e.ts).toString()}\n    PRIORITY=${e.prio}\n    _SYSTEMD_UNIT=${e.unit}\n    SYSLOG_IDENTIFIER=${proc}\n    MESSAGE=${e.msg}\n    _HOSTNAME=${HOSTNAME}`;
    return `${jdate(e.ts)} ${HOSTNAME} ${proc}${proc === 'kernel' ? '' : `[${700 + (proc.length * 31) % 300}]`}: ${e.msg}`;
  };
  const head = output === 'short' && !follow ? `-- Logs begin at ${new Date(sh.state.bootTime - 86400000).toString().slice(0, 24)}. --\n` : '';
  if (!entries.length) return ok(head + '-- No entries --\n');
  return ok(head + entries.map(fmt).join('\n') + '\n' + (follow ? '(suivi simulé : journalctl -f affiche les nouveaux messages en temps réel ; Ctrl+C pour quitter)\n' : ''));
};

export const systemdAnalyze: CmdFn = ({ args }) => {
  const v = args[0] ?? 'time';
  if (v === 'blame') return ok('  8.214s kdump.service\n  4.120s NetworkManager-wait-online.service\n  2.931s firewalld.service\n  1.402s tuned.service\n  1.201s gdm.service\n   812ms sshd.service\n   604ms systemd-journald.service\n   512ms chronyd.service\n   389ms crond.service\n');
  if (v === 'critical-chain') return ok('The time when unit became active or started is printed after the "@" character.\nThe time the unit took to start is printed after the "+" character.\n\ngraphical.target @14.802s\n└─multi-user.target @14.801s\n  └─kdump.service @6.586s +8.214s\n    └─network-online.target @6.584s\n      └─NetworkManager-wait-online.service @2.463s +4.120s\n        └─NetworkManager.service @2.401s +60ms\n          └─basic.target @2.395s\n            └─sysinit.target @2.392s\n');
  return ok('Startup finished in 1.923s (kernel) + 3.112s (initrd) + 14.802s (userspace) = 19.838s \ngraphical.target reached after 14.802s in userspace.\n');
};

// ---------------- rpm / dnf ----------------
const nevra = (p: Pkg) => `${p.name}-${p.version}-${p.release}.${p.arch}`;

function pkgFromRpmFile(sh: Shell, path: string): Pkg | null {
  const b = basename(path).replace(/\.rpm$/, '');
  const all = { ...sh.state.repo, ...sh.state.installed };
  return Object.values(all).find((p) => b.startsWith(p.name + '-' + p.version)) ?? null;
}

function ownerOf(sh: Shell, path: string): Pkg | null {
  const abs = path.replace(/^\/(bin|sbin|lib|lib64)\//, (_, d) => `/usr/${d}/`);
  for (const p of Object.values(sh.state.installed)) if (p.files.includes(abs) || p.files.includes(path) || p.config.includes(path)) return p;
  if (abs.startsWith('/usr/bin/') || abs.startsWith('/usr/sbin/')) {
    const n = lookup(sh.state.root, abs);
    if (n) return sh.state.installed['coreutils'];
  }
  return null;
}

function infoBlock(p: Pkg, installed: boolean): string {
  return `Name        : ${p.name}\n${p.epoch ? `Epoch       : ${p.epoch}\n` : ''}Version     : ${p.version}\nRelease     : ${p.release}\nArchitecture: ${p.arch}\n${installed ? `Install Date: ${new Date(Date.now() - 5 * 86400000).toUTCString()}\n` : ''}Group       : Unspecified\nSize        : ${p.size * 1024}\nLicense     : ${p.license ?? 'GPLv2+'}\nSignature   : RSA/SHA256, Mon 15 Apr 2024, Key ID 199e2f91fd431d51\nSource RPM  : ${p.name}-${p.version}-${p.release}.src.rpm\nBuild Host  : x86-vm-07.build.eng.bos.redhat.com\nPackager    : Red Hat, Inc. <http://bugzilla.redhat.com/bugzilla>\nVendor      : Red Hat, Inc.\nURL         : ${p.url ?? 'https://www.redhat.com'}\nSummary     : ${p.summary}\nDescription :\n${p.summary}.\n`;
}

function missingDeps(sh: Shell, p: Pkg, alsoInstalling: string[] = []): string[] {
  return p.requires.filter((r) => !sh.state.installed[r] && !alsoInstalling.includes(r));
}

function installPkg(sh: Shell, p: Pkg) {
  sh.state.installed[p.name] = { ...p };
  for (const f of p.files) {
    if (lookup(sh.state.root, f)) continue;
    const parent = lookup(sh.state.root, dirname(f));
    if (!parent || parent.t !== 'd') continue;
    parent.kids![basename(f)] = f.endsWith('html') ? dir() : { ...file('\u007fELF (binaire simulé)', 0, 0, 0o755), sz: 40000 };
  }
  if (p.name === 'httpd') {
    const v = lookup(sh.state.root, '/var')!;
    v.kids!.www = dir(0, 0, 0o755, { html: dir(), 'cgi-bin': dir() });
    const etc = lookup(sh.state.root, '/etc')!;
    etc.kids!.httpd = dir(0, 0, 0o755, { conf: dir(0, 0, 0o755, { 'httpd.conf': file('ServerRoot "/etc/httpd"\nListen 80\nDocumentRoot "/var/www/html"\n') }), 'conf.d': dir() });
    sh.state.services.httpd = { name: 'httpd', desc: 'The Apache HTTP Server', active: 'inactive', enabled: 'disabled', execStart: '/usr/sbin/httpd $OPTIONS -DFOREGROUND', wantedBy: 'multi-user.target', pkg: 'httpd', reload: true };
    lookup(sh.state.root, '/usr/lib/systemd/system')!.kids!['httpd.service'] = file('[Unit]\nDescription=The Apache HTTP Server\n\n[Service]\nExecStart=/usr/sbin/httpd $OPTIONS -DFOREGROUND\n\n[Install]\nWantedBy=multi-user.target\n');
  }
  if (p.name === 'mariadb-server') sh.state.services.mariadb = { name: 'mariadb', desc: 'MariaDB 10.5 database server', active: 'inactive', enabled: 'disabled', execStart: '/usr/libexec/mariadbd --basedir=/usr', wantedBy: 'multi-user.target', pkg: 'mariadb-server' };
  sh.log('dnf', `Installed: ${nevra(p)}`);
}

function removePkg(sh: Shell, name: string) {
  const p = sh.state.installed[name];
  if (!p) return;
  delete sh.state.installed[name];
  for (const f of p.files) {
    if (f === '/var/www/html') continue;
    const parent = lookup(sh.state.root, dirname(f));
    if (parent?.kids?.[basename(f)]) delete parent.kids[basename(f)];
  }
  if (name === 'httpd') delete sh.state.services.httpd;
  if (name === 'mariadb-server') delete sh.state.services.mariadb;
}

const RPM_LOCK = "erreur : impossible d'ouvrir le verrou de transaction sur /var/lib/rpm/.rpm.lock\n  (Permission non accordée)";

export const rpm: CmdFn = ({ args, sh }) => {
  const shortFlags = args.filter((a) => /^-[a-zA-Z]+$/.test(a)).join('').replace(/-/g, '');
  const long = args.filter((a) => a.startsWith('--'));
  const pos = args.filter((a) => !a.startsWith('-'));
  const has = (c: string) => shortFlags.includes(c);
  const nodeps = long.includes('--nodeps');
  if (has('K') || long.includes('--checksig')) {
    let out = '';
    for (const f of pos) {
      if (!sh.node(f)) return fail(`erreur : ${f}: open failed: Aucun fichier ou dossier de ce type`);
      out += `${f}: digests signatures OK\n`;
    }
    return ok(out);
  }
  if (has('q')) {
    const fromFile = has('p');
    if (has('a')) {
      const list = Object.values(sh.state.installed).map(nevra).sort();
      const pat = pos[0];
      return ok(list.filter((x) => !pat || x.startsWith(pat)).join('\n') + '\n');
    }
    if (has('f')) {
      let out = '';
      let err = '';
      for (const f of pos) {
        const abs = sh.abs(f);
        if (!lookup(sh.state.root, abs)) {
          err += `erreur : le fichier ${f}: Aucun fichier ou dossier de ce type\n`;
          continue;
        }
        const p = ownerOf(sh, abs);
        if (p) out += nevra(p) + '\n';
        else out += `le fichier ${abs} n'appartient à aucun paquetage\n`;
      }
      return { out, err, code: err ? 1 : 0 };
    }
    if (!pos.length) return fail("rpm : aucun argument n'a été fourni pour la requête", 1);
    let out = '';
    let code = 0;
    for (const name of pos) {
      let p: Pkg | null | undefined;
      if (fromFile) {
        if (!sh.node(name)) {
          out += `erreur : open of ${name} failed: Aucun fichier ou dossier de ce type\n`;
          code = 1;
          continue;
        }
        p = pkgFromRpmFile(sh, name);
      } else p = sh.state.installed[name] ?? Object.values(sh.state.installed).find((x) => nevra(x) === name);
      if (!p) {
        out += `le paquet ${name} n'est pas installé\n`;
        code = 1;
        continue;
      }
      if (has('i')) out += infoBlock(p, !fromFile);
      else if (has('l')) out += (p.files.length ? p.files : [`/usr/share/doc/${p.name}`]).join('\n') + '\n';
      else if (has('c')) out += p.config.length ? p.config.join('\n') + '\n' : '';
      else if (has('d')) out += `/usr/share/doc/${p.name}/README\n/usr/share/man/man1/${p.name}.1.gz\n`;
      else if (long.includes('--requires') || has('R')) out += [...p.requires, 'libc.so.6()(64bit)', 'rtld(GNU_HASH)'].join('\n') + '\n';
      else out += nevra(p) + '\n';
    }
    return { out, err: '', code };
  }
  if (has('V')) {
    const name = pos[0];
    const p = has('a') ? null : sh.state.installed[name];
    if (!has('a') && !p) return fail(`le paquet ${name} n'est pas installé`, 1);
    const pkgs = p ? [p] : Object.values(sh.state.installed);
    let out = '';
    for (const pk of pkgs)
      for (const c of pk.config) {
        const n = lookup(sh.state.root, c);
        if (!n) out += `manquant   c ${c}\n`;
        else if (sh.pristine[c] !== undefined && sh.pristine[c] !== n.data) out += `S.5....T.  c ${c}\n`;
      }
    return { out, err: '', code: out ? 1 : 0 };
  }
  if (has('i') || has('U') || has('F')) {
    if (!sh.isRoot) return fail(RPM_LOCK, 1);
    if (!pos.length) return fail("rpm : aucun paquet n'a été fourni pour l'installation", 1);
    const pkgs: Pkg[] = [];
    for (const f of pos) {
      if (!sh.node(f)) return fail(`erreur : open of ${f} failed: Aucun fichier ou dossier de ce type`, 1);
      const p = pkgFromRpmFile(sh, f);
      if (!p) return fail(`erreur : ${f}: n'est pas un paquet rpm (ou un manifeste de paquets)`, 1);
      if (sh.state.installed[p.name] && !has('U')) return fail(`\tle paquet ${nevra(p)} est déjà installé`, 1);
      pkgs.push(p);
    }
    if (!nodeps) {
      const names = pkgs.map((p) => p.name);
      const miss = pkgs.flatMap((p) => missingDeps(sh, p, names).map((d) => `\t${d === 'qt5-qtbase' ? 'libQt5Core.so.5()(64bit)' : d} est nécessaire pour ${p.epoch ? `${p.name}-${p.epoch}:${p.version}-${p.release}.${p.arch}` : nevra(p)}`));
      if (miss.length) return fail(`erreur : Dépendances requises :\n${miss.join('\n')}`, 1);
    }
    let out = has('v') || has('h') ? 'Vérification…                       ################################# [100%]\nPréparation…                        ################################# [100%]\nMise à jour / installation…\n' : '';
    pkgs.forEach((p, i) => {
      installPkg(sh, p);
      if (has('v') || has('h')) out += `   ${i + 1}:${p.name}-${p.version}-${p.release}`.padEnd(38) + '################################# [100%]\n';
    });
    return ok(out);
  }
  if (has('e')) {
    if (!sh.isRoot) return fail(RPM_LOCK, 1);
    let err = '';
    for (const name of pos) {
      if (!sh.state.installed[name]) {
        err += `erreur : le paquet ${name} n'est pas installé\n`;
        continue;
      }
      const users = Object.values(sh.state.installed).filter((x) => x.requires.includes(name));
      if (users.length && !nodeps) {
        err += `erreur : Dépendances requises :\n${users.map((u) => `\t${name} est nécessaire pour (installé) ${nevra(u)}`).join('\n')}\n`;
        continue;
      }
      removePkg(sh, name);
    }
    return { out: '', err, code: err ? 1 : 0 };
  }
  return fail("rpm : aucune opération n'a été spécifiée\nUtilisation : rpm [-qa] [-qi|-ql|-qf|-qc PAQUET] [-ivh|-Uvh|-e] ...", 1);
};

// ---- dnf ----
function parseRepos(sh: Shell): { id: string; name: string; enabled: boolean; baseurl: string; file: string }[] {
  const d = lookup(sh.state.root, '/etc/yum.repos.d');
  const out: { id: string; name: string; enabled: boolean; baseurl: string; file: string }[] = [];
  for (const [fname, n] of Object.entries(d?.kids ?? {})) {
    if (!fname.endsWith('.repo') || n.t !== 'f') continue;
    let cur: (typeof out)[0] | null = null;
    for (const raw of (n.data ?? '').split('\n')) {
      const l = raw.trim();
      const sec = /^\[(.+)\]$/.exec(l);
      if (sec) {
        cur = { id: sec[1], name: sec[1], enabled: true, baseurl: '', file: fname };
        out.push(cur);
        continue;
      }
      const kv = /^(\w+)\s*=\s*(.*)$/.exec(l);
      if (kv && cur) {
        if (kv[1] === 'name') cur.name = kv[2];
        if (kv[1] === 'enabled') cur.enabled = kv[2] === '1';
        if (kv[1] === 'baseurl') cur.baseurl = kv[2];
      }
    }
  }
  return out;
}

/** Packages available from enabled repositories (remote + local file:// repos created with createrepo). */
function available(sh: Shell): Record<string, Pkg> {
  const repos = parseRepos(sh).filter((r) => r.enabled);
  const out: Record<string, Pkg> = {};
  for (const p of Object.values(sh.state.repo)) if (repos.some((r) => r.id === p.repo)) out[p.name] = p;
  for (const r of repos) {
    if (!r.baseurl.startsWith('file://')) continue;
    const path = r.baseurl.replace('file://', '');
    const d = lookup(sh.state.root, path);
    if (!d || d.t !== 'd' || !d.kids!.repodata) continue;
    for (const f of Object.keys(d.kids!)) {
      if (!f.endsWith('.rpm')) continue;
      const p = pkgFromRpmFile(sh, f);
      if (p && !out[p.name]) out[p.name] = { ...p, repo: r.id };
    }
  }
  return out;
}

function resolve(sh: Shell, names: string[], avail: Record<string, Pkg>): { order: Pkg[]; missing: string[]; deps: string[] } {
  const order: Pkg[] = [];
  const seen = new Set<string>();
  const missing: string[] = [];
  const deps: string[] = [];
  const visit = (n: string, isDep: boolean) => {
    if (seen.has(n) || sh.state.installed[n]) return;
    seen.add(n);
    const p = avail[n];
    if (!p) {
      missing.push(n);
      return;
    }
    for (const r of p.requires) visit(r, true);
    order.push(p);
    if (isDep) deps.push(n);
  };
  for (const n of names) visit(n, false);
  return { order, missing, deps };
}

function txTable(title: string, pkgs: Pkg[], deps: string[], verb: string): string {
  const row = (p: Pkg) => ` ${p.name.padEnd(26)} ${p.arch.padEnd(8)} ${`${p.epoch ? p.epoch + ':' : ''}${p.version}-${p.release}`.padEnd(24)} ${(p.repo ?? '@System').padEnd(34)} ${(p.size / 1024).toFixed(1)} M`;
  const main = pkgs.filter((p) => !deps.includes(p.name));
  const dep = pkgs.filter((p) => deps.includes(p.name));
  let s = `${'='.repeat(110)}\n ${'Paquet'.padEnd(26)} ${'Architecture'.padEnd(8)} ${'Version'.padEnd(24)} ${'Dépôt'.padEnd(34)} Taille\n${'='.repeat(110)}\n${title} :\n${main.map(row).join('\n')}\n`;
  if (dep.length) s += `Installation des dépendances :\n${dep.map(row).join('\n')}\n`;
  s += `\nRésumé de la transaction\n${'='.repeat(110)}\n${verb}  ${pkgs.length} Paquet${pkgs.length > 1 ? 's' : ''}\n\n`;
  return s;
}

const NEED_ROOT_DNF = "Erreur : Cette commande doit être exécutée avec les privilèges superutilisateur (sous l'utilisateur root sur la plupart des systèmes).";
const PROTECTED = ['dnf', 'systemd', 'kernel-core', 'sudo', 'bash', 'glibc', 'rpm', 'setup', 'coreutils'];

function confirm(yes: boolean, body: string, run: () => CmdRes): CmdRes {
  if (yes) {
    const r = run();
    return { ...r, out: body + 'Voulez-vous continuer ? [o/N] : o\n' + r.out };
  }
  return {
    out: body,
    err: '',
    code: 0,
    ask: {
      prompt: 'Voulez-vous continuer ? [o/N] : ',
      hidden: false,
      next: (a) => (/^(o|oui|y|yes)$/i.test(a.trim()) ? run() : fail('Opération annulée.', 1))
    }
  };
}

function record(sh: Shell, cmd: string, action: string, pkgs: { name: string; action: 'Install' | 'Removed' | 'Upgrade' | 'Dep-Install' }[]) {
  sh.state.dnfHistory.push({ id: sh.state.dnfHistory.length + 1, cmd, date: Date.now(), action, pkgs });
}

export const dnf: CmdFn = ({ args, argv, sh }) => {
  const yes = args.includes('-y') || args.includes('--assumeyes');
  const pos = args.filter((a) => !a.startsWith('-'));
  const verb = pos[0] ?? '';
  const rest = pos.slice(1);
  const prog = argv[0].includes('yum') ? 'yum' : 'dnf';
  const cmdline = args.join(' ');
  const header = 'Mise à jour des référentiels de gestion des abonnements.\nDernière vérification de l’expiration des métadonnées effectuée il y a 0:12:05 le mer. 18 nov. 2026 13:04:11.\n';
  switch (verb) {
    case 'install':
    case 'reinstall': {
      if (!sh.isRoot) return fail(NEED_ROOT_DNF, 1);
      const downloadOnly = args.includes('--downloadonly');
      const ddArg = args.find((a) => a.startsWith('--downloaddir'));
      const ddir = ddArg ? (ddArg.includes('=') ? ddArg.split('=')[1] : args[args.indexOf(ddArg) + 1]) : '/var/cache/dnf/packages';
      const names = rest.filter((r) => r !== ddir);
      if (!names.length) return fail('Erreur : Besoin d’un nom de paquet ou d’un fichier.', 1);
      const avail = available(sh);
      // local rpm files
      for (const n of names) {
        if (n.endsWith('.rpm')) {
          const p = pkgFromRpmFile(sh, n);
          if (p) avail[p.name] = { ...p, repo: '@commandline' };
        }
      }
      const resolvedNames = names.map((n) => (n.endsWith('.rpm') ? pkgFromRpmFile(sh, n)?.name ?? n : n));
      const already = resolvedNames.filter((n) => sh.state.installed[n]);
      const todo = resolvedNames.filter((n) => !sh.state.installed[n]);
      const { order, missing, deps } = resolve(sh, todo, avail);
      let out = header;
      for (const a of already) out += `Le paquet ${nevra(sh.state.installed[a])} est déjà installé.\n`;
      if (missing.length) return { out, err: missing.map((m) => `Aucune correspondance pour le paramètre: ${m}`).join('\n') + `\nErreur : Impossible de trouver une correspondance: ${missing.join(' ')}\n`, code: 1 };
      if (!order.length && !downloadOnly) return ok(out + 'Dépendances résolues.\nRien à faire.\nTerminé !\n');
      out += 'Dépendances résolues.\n' + txTable('Installation', order, deps, 'Installer');
      if (downloadOnly) {
        const toDl = order.length ? order : resolvedNames.map((n) => sh.state.installed[n] ?? avail[n]).filter(Boolean);
        return confirm(yes, out + `DNF va uniquement télécharger les paquets pour la transaction.\n`, () => {
          let d = lookup(sh.state.root, sh.abs(ddir));
          if (!d) {
            sh.exec(['mkdir', '-p', ddir], null);
            d = lookup(sh.state.root, sh.abs(ddir));
          }
          if (!d || d.t !== 'd') return fail(`Erreur : impossible de créer ${ddir}`);
          let o = 'Téléchargement des paquets :\n';
          for (const p of toDl) {
            d.kids![`${nevra(p)}.rpm`] = { ...file('(paquet rpm simulé)'), sz: p.size * 1024 };
            o += `(${toDl.indexOf(p) + 1}/${toDl.length}): ${nevra(p)}.rpm`.padEnd(70) + `${(p.size / 1024).toFixed(1)} MB/s | ${(p.size / 1024).toFixed(1)} MB     00:00\n`;
          }
          return ok(o + `Terminé !\nLe téléchargement est terminé, les paquets sont dans ${ddir}\n`);
        });
      }
      return confirm(yes, out, () => {
        let o = 'Téléchargement des paquets :\nVérification de la transaction\nLa vérification de la transaction a réussi.\nLancement de la transaction de test\nTransaction de test réussie.\nExécution de la transaction\n';
        order.forEach((p, i) => {
          installPkg(sh, p);
          o += `  Installation         : ${nevra(p)}`.padEnd(80) + `${i + 1}/${order.length}\n`;
        });
        o += `\nInstallé:\n  ${order.map(nevra).join('\n  ')}\n\nTerminé !\n`;
        record(sh, `${prog} ${cmdline}`, 'Install', order.map((p) => ({ name: p.name, action: deps.includes(p.name) ? 'Dep-Install' : 'Install' })));
        return ok(o);
      });
    }
    case 'remove':
    case 'erase': {
      if (!sh.isRoot) return fail(NEED_ROOT_DNF, 1);
      const targets = rest.filter((n) => sh.state.installed[n]);
      const notInst = rest.filter((n) => !sh.state.installed[n]);
      if (notInst.length && !targets.length) return { out: header, err: `Aucune correspondance pour le paramètre: ${notInst.join(' ')}\nAucun paquet marqué pour suppression.\n`, code: 1 };
      // dependents
      const toRemove = new Set(targets);
      let changed = true;
      while (changed) {
        changed = false;
        for (const p of Object.values(sh.state.installed)) if (!toRemove.has(p.name) && p.requires.some((r) => toRemove.has(r))) {
          toRemove.add(p.name);
          changed = true;
        }
      }
      const prot = [...toRemove].filter((n) => PROTECTED.includes(n));
      if (prot.length) return fail(`Erreur : \n Problème : L'opération entraînerait la suppression des paquets protégés suivants : ${prot.join(', ')}`, 1);
      const pkgs = [...toRemove].map((n) => sh.state.installed[n]);
      // also unused deps (clean_requirements_on_remove)
      const deps = pkgs.flatMap((p) => p.requires).filter((d, i, a) => a.indexOf(d) === i && sh.state.installed[d] && !toRemove.has(d) && !Object.values(sh.state.installed).some((o) => !toRemove.has(o.name) && o.name !== d && o.requires.includes(d)) && !PROTECTED.includes(d));
      const all = [...pkgs, ...deps.map((d) => sh.state.installed[d])];
      const out = header + 'Dépendances résolues.\n' + txTable('Suppression', all, deps, 'Supprimer');
      return confirm(yes, out, () => {
        for (const p of all) removePkg(sh, p.name);
        record(sh, `${prog} ${cmdline}`, 'Removed', all.map((p) => ({ name: p.name, action: 'Removed' })));
        return ok(`Exécution de la transaction\n${all.map((p, i) => `  Suppression          : ${nevra(p)}`.padEnd(80) + `${i + 1}/${all.length}`).join('\n')}\n\nSupprimé:\n  ${all.map(nevra).join('\n  ')}\n\nTerminé !\n`);
      });
    }
    case 'info': {
      const name = rest[0];
      if (!name) return fail('Erreur : indiquez un paquet.', 1);
      const inst = sh.state.installed[name];
      const av = available(sh)[name];
      if (!inst && !av) return fail(`${header}Erreur : Aucun paquet correspondant à lister`, 1);
      let out = header;
      if (inst) out += 'Paquets installés\n' + infoBlock(inst, true).replace(/^Name/, 'Nom').replace('\nVersion', '\nVersion').replace(/\n$/, '\n') + `Dépôt       : @System\n\n`;
      if (av && !inst) out += 'Paquets disponibles\n' + infoBlock(av, false) + `Dépôt       : ${av.repo}\n`;
      return ok(out);
    }
    case 'provides':
    case 'whatprovides': {
      const f = rest[0];
      if (!f) return fail('Erreur : indiquez un fichier.', 1);
      const all = [...Object.values(sh.state.installed).map((p) => ({ p, repo: '@System' })), ...Object.values(sh.state.repo).filter((p) => !sh.state.installed[p.name]).map((p) => ({ p, repo: p.repo! }))];
      const hits = all.filter(({ p }) => p.files.includes(f) || p.config.includes(f) || p.files.some((x) => basename(x) === f || (f.includes('*') && x.includes(f.replace(/\*/g, '')))));
      if (!hits.length) return fail(`${header}Erreur : Aucune correspondance trouvée. Si vous recherchez un binaire, essayez de préfixer avec */bin/ ou */sbin/`, 1);
      return ok(header + hits.map(({ p, repo }) => `${p.epoch ? p.name + '-' + p.epoch + ':' + p.version : p.name + '-' + p.version}-${p.release}.${p.arch} : ${p.summary}\nDépôt        : ${repo}\nCorrespondance trouvée dans :\nNom de fichier : ${p.files.find((x) => x === f || basename(x) === f) ?? f}\n`).join('\n'));
    }
    case 'check-update': {
      const ups = ['kernel', 'kernel-core', 'firefox', 'openssl', 'sudo'].filter((n) => sh.state.installed[n] && !sh.state.installed[n].release.endsWith('.1upd'));
      if (!ups.length) return ok(header);
      return { out: header + '\n' + ups.map((n) => `${(n + '.' + sh.state.installed[n].arch).padEnd(40)} ${(sh.state.installed[n].version + '-' + sh.state.installed[n].release + '.1upd').padEnd(28)} rhel-9-for-x86_64-baseos-rpms`).join('\n') + '\n', err: '', code: 100 };
    }
    case 'update':
    case 'upgrade': {
      if (!sh.isRoot) return fail(NEED_ROOT_DNF, 1);
      const ups = ['kernel', 'kernel-core', 'firefox', 'openssl', 'sudo'].filter((n) => sh.state.installed[n] && !sh.state.installed[n].release.endsWith('.1upd') && (!rest.length || rest.includes(n)));
      if (!ups.length) return ok(header + 'Dépendances résolues.\nRien à faire.\nTerminé !\n');
      const pkgs = ups.map((n) => ({ ...sh.state.installed[n], release: sh.state.installed[n].release + '.1upd' }));
      return confirm(yes, header + 'Dépendances résolues.\n' + txTable('Mise à jour', pkgs, [], 'Mettre à niveau'), () => {
        for (const p of pkgs) sh.state.installed[p.name] = p;
        record(sh, `${prog} ${cmdline}`, 'Upgrade', pkgs.map((p) => ({ name: p.name, action: 'Upgrade' })));
        return ok(`Mis à niveau:\n  ${pkgs.map(nevra).join('\n  ')}\n\nTerminé !\n`);
      });
    }
    case 'history': {
      const sub = rest[0];
      const H = sh.state.dnfHistory;
      if (!sub || sub === 'list') {
        const rows = [...H].reverse().map((t) => `${String(t.id).padStart(3)} | ${(t.cmd || 'install @^graphical-server-environment').slice(0, 38).padEnd(38)} | ${new Date(t.date).toISOString().slice(0, 16).replace('T', ' ')} | ${t.action.padEnd(14)} | ${String(t.pkgs.length).padStart(5)}`);
        return ok(`ID     | Ligne de commande                      | Date et heure    | Action(s)      | Modifié\n${'-'.repeat(95)}\n${rows.join('\n')}\n`);
      }
      const id = sub === 'info' || sub === 'undo' ? +(rest[1] ?? H.length) : NaN;
      const t = H.find((x) => x.id === id);
      if (!t) return fail(`Erreur : Aucune transaction ${rest[1] ?? ''} trouvée.`, 1);
      if (sub === 'info') return ok(`ID de transaction : ${t.id}\nHorodatage de début : ${new Date(t.date).toString()}\nUtilisateur : root <root>\nCode retour : Succès\nLigne de commande : ${t.cmd}\nTransaction effectuée avec :\n    Installé     dnf-4.14.0-9.el9.noarch @System\nPaquets modifiés :\n${t.pkgs.map((p) => `    ${p.action.padEnd(12)} ${p.name}`).join('\n')}\n`);
      if (sub === 'undo') {
        if (!sh.isRoot) return fail(NEED_ROOT_DNF, 1);
        const inst = t.pkgs.filter((p) => p.action === 'Install' || p.action === 'Dep-Install').map((p) => p.name);
        const rem = t.pkgs.filter((p) => p.action === 'Removed').map((p) => p.name);
        return confirm(yes, `Annulation de la transaction ${t.id}, depuis ${new Date(t.date).toString()}\n`, () => {
          for (const n of inst) removePkg(sh, n);
          const avail = { ...sh.state.repo, ...available(sh) };
          for (const n of rem) if (avail[n]) installPkg(sh, avail[n]);
          record(sh, `${prog} history undo ${t.id}`, inst.length ? 'Removed' : 'Install', [...inst.map((n) => ({ name: n, action: 'Removed' as const })), ...rem.map((n) => ({ name: n, action: 'Install' as const }))]);
          return ok(`${inst.length ? `Supprimé:\n  ${inst.join('\n  ')}\n` : ''}${rem.length ? `Installé:\n  ${rem.join('\n  ')}\n` : ''}\nTerminé !\n`);
        });
      }
      return fail(`Erreur : sous-commande history inconnue : ${sub}`, 1);
    }
    case 'group':
    case 'groups': {
      const sub = rest[0] ?? 'summary';
      const gname = rest.slice(1).join(' ').replace(/^"|"$/g, '');
      const G = sh.state.groups;
      if (sub === 'list') {
        const inst = Object.entries(G).filter(([, g]) => g.installed).map(([k]) => k);
        const av = Object.entries(G).filter(([, g]) => !g.installed).map(([k]) => k);
        return ok(header + `Groupes d’environnements disponibles :\n   Serveur\n   Installation minimale\n   Poste de travail\n   Système d’exploitation personnalisé\n   Hôte de virtualisation\nGroupes d’environnements installés :\n   Serveur avec interface graphique\n${inst.length ? `Groupes installés :\n   ${inst.join('\n   ')}\n` : ''}Groupes disponibles :\n   ${av.join('\n   ')}\n`);
      }
      const g = G[gname];
      if ((sub === 'info' || sub === 'install' || sub === 'remove') && !g) return fail(`${header}Attention : Le groupe ${gname} n’existe pas.\nErreur : Rien à faire.`, 1);
      if (sub === 'info') return ok(header + `\nGroupe : ${gname}\n Description : ${g.desc}\n Paquets par défaut :\n   ${g.pkgs.join('\n   ')}\n`);
      if (sub === 'install') {
        if (!sh.isRoot) return fail(NEED_ROOT_DNF, 1);
        const { order, deps } = resolve(sh, g.pkgs, { ...available(sh) });
        return confirm(yes, header + 'Dépendances résolues.\n' + txTable('Installation des groupes', order, deps, 'Installer'), () => {
          for (const p of order) installPkg(sh, p);
          g.installed = true;
          record(sh, `${prog} ${cmdline}`, 'Install', order.map((p) => ({ name: p.name, action: 'Install' })));
          return ok(`Installé:\n  ${order.map(nevra).join('\n  ')}\n\nTerminé !\n`);
        });
      }
      if (sub === 'remove') {
        if (!sh.isRoot) return fail(NEED_ROOT_DNF, 1);
        const pkgs = g.pkgs.filter((n) => sh.state.installed[n]).map((n) => sh.state.installed[n]);
        return confirm(yes, header + 'Dépendances résolues.\n' + txTable('Suppression', pkgs, [], 'Supprimer'), () => {
          for (const p of pkgs) removePkg(sh, p.name);
          g.installed = false;
          record(sh, `${prog} ${cmdline}`, 'Removed', pkgs.map((p) => ({ name: p.name, action: 'Removed' })));
          return ok(`Supprimé:\n  ${pkgs.map(nevra).join('\n  ')}\n\nTerminé !\n`);
        });
      }
      return ok(header + `Groupes disponibles : ${Object.keys(G).length}\n`);
    }
    case 'repolist': {
      const all = args.includes('--all');
      const repos = parseRepos(sh).filter((r) => all || r.enabled);
      return ok(header + `id du dépôt                                       nom du dépôt${all ? '                                  état' : ''}\n` + repos.map((r) => `${r.id.padEnd(50)}${r.name}${all ? (r.enabled ? '   activé' : '   désactivé') : ''}`).join('\n') + '\n');
    }
    case 'list': {
      const what = rest[0] ?? 'all';
      let out = header;
      if (what === 'installed' || what === 'all') out += 'Paquets installés\n' + Object.values(sh.state.installed).sort((a, b) => a.name.localeCompare(b.name)).map((p) => `${(p.name + '.' + p.arch).padEnd(40)} ${(p.version + '-' + p.release).padEnd(28)} @anaconda`).join('\n') + '\n';
      if (what === 'available' || what === 'all') out += 'Paquets disponibles\n' + Object.values(available(sh)).filter((p) => !sh.state.installed[p.name]).map((p) => `${(p.name + '.' + p.arch).padEnd(40)} ${(p.version + '-' + p.release).padEnd(28)} ${p.repo}`).join('\n') + '\n';
      return ok(out);
    }
    case 'search': {
      const k = (rest[0] ?? '').toLowerCase();
      const hits = Object.values({ ...available(sh), ...sh.state.installed }).filter((p) => p.name.includes(k) || p.summary.toLowerCase().includes(k));
      return ok(header + `========================= Nom correspond exactement à : ${k} =========================\n` + hits.map((p) => `${p.name}.${p.arch} : ${p.summary}`).join('\n') + '\n');
    }
    case 'clean':
      return ok('Mise à jour des référentiels de gestion des abonnements.\n42 fichiers supprimés\n');
    case 'makecache':
      return ok(header + 'Cache des métadonnées créé.\n');
    case '':
      return fail(`Utilisation : ${prog} [options] COMMANDE\n\nListe des commandes principales :\n  install  remove  update  check-update  info  provides  history  group  repolist  list  search  clean`, 1);
    default:
      return fail(`Aucune commande de ce type : ${verb}. Veuillez utiliser /usr/bin/${prog} --help`, 1);
  }
};

export const yumConfigManager: CmdFn = ({ args, sh }) => {
  if (!sh.isRoot) return fail("Erreur : Cette commande doit être exécutée en tant que root.", 1);
  const en = args.indexOf('--enable');
  const dis = args.indexOf('--disable');
  const add = args.findIndex((a) => a.startsWith('--add-repo'));
  if (add >= 0) {
    const url = args[add].includes('=') ? args[add].split('=')[1] : args[add + 1];
    const id = url.replace(/^\w+:\/\//, '').replace(/[/:]/g, '_').replace(/_+$/, '');
    sh.writeRaw(`/etc/yum.repos.d/${id}.repo`, `[${id}]\nname=created by dnf config-manager from ${url}\nbaseurl=${url}\nenabled=1\n`);
    return ok(`Ajout du dépôt depuis : ${url}\n`);
  }
  const idx = en >= 0 ? en : dis;
  if (idx < 0) return fail('yum-config-manager : utilisez --enable REPO, --disable REPO ou --add-repo URL', 1);
  const repoId = args[idx + 1];
  const repos = parseRepos(sh).filter((r) => r.id === repoId || (repoId?.includes('*') && new RegExp('^' + repoId.replace(/\*/g, '.*') + '$').test(r.id)));
  if (!repos.length) return fail(`Erreur : Aucun dépôt correspondant à modifier : ${repoId}.`, 1);
  for (const r of repos) {
    const path = `/etc/yum.repos.d/${r.file}`;
    const data = sh.readRaw(path);
    const lines = data.split('\n');
    let inSec = false;
    let done = false;
    for (let i = 0; i < lines.length; i++) {
      const sec = /^\[(.+)\]$/.exec(lines[i].trim());
      if (sec) {
        if (inSec && !done) {
          lines.splice(i, 0, `enabled = ${en >= 0 ? 1 : 0}`);
          done = true;
        }
        inSec = sec[1] === r.id;
        continue;
      }
      if (inSec && /^enabled\s*=/.test(lines[i].trim())) {
        lines[i] = `enabled = ${en >= 0 ? 1 : 0}`;
        done = true;
      }
    }
    if (!done) lines.push(`enabled = ${en >= 0 ? 1 : 0}`);
    sh.writeRaw(path, lines.join('\n'));
  }
  return ok();
};

export const createrepo: CmdFn = ({ args, sh }) => {
  if (!sh.state.installed['createrepo_c']) return fail('bash: createrepo : commande introuvable\n(astuce : dnf install createrepo_c)', 127);
  const d = args.find((a) => !a.startsWith('-'));
  if (!d) return fail('Usage: createrepo [options] <directory_to_index>', 1);
  const n = sh.node(d);
  if (!n || n.t !== 'd') return fail(`Directory ${d} must exist`, 1);
  const w = sh.canWriteDir(sh.abs(d));
  if (w) return fail(`Cannot create ${d}/repodata: Permission denied`, 1);
  const rpms = Object.keys(n.kids!).filter((k) => k.endsWith('.rpm'));
  n.kids!.repodata = dir(0, 0, 0o755, { 'repomd.xml': file('<?xml version="1.0" encoding="UTF-8"?>\n<repomd/>\n'), 'primary.xml.gz': file(''), 'filelists.xml.gz': file('') });
  return ok(`Directory walk started\nDirectory walk done - ${rpms.length} packages\nTemporary output repo path: ${d}/.repodata/\nPreparing sqlite DBs\nPool started (with 5 workers)\nPool finished\n`);
};

// ---------------- GRUB ----------------
export const grub2Mkconfig: CmdFn = ({ args, sh }) => {
  if (!sh.isRoot) return fail('/usr/sbin/grub2-mkconfig: line 266: /boot/grub2/grub.cfg.new: Permission non accordée', 1);
  const oIdx = args.indexOf('-o');
  const out = oIdx >= 0 ? args[oIdx + 1] : args.find((a) => a.startsWith('--output='))?.split('=')[1];
  const cfg = grubCfg(sh.readRaw('/etc/default/grub'), sh.readRaw('/etc/grub.d/40_custom'), !!lookup(sh.state.root, '/boot/grub2/user.cfg'));
  const msg = `Generating grub configuration file ...\nAdding boot menu entry for UEFI Firmware Settings ...\ndone\n`;
  if (!out) return { out: cfg, err: msg, code: 0 };
  if (sh.abs(out) === '/boot/efi/EFI/redhat/grub.cfg') return fail("Running `grub2-mkconfig -o /boot/efi/EFI/redhat/grub.cfg' will overwrite the GRUB wrapper.\nPlease run `grub2-mkconfig -o /boot/grub2/grub.cfg' instead to update grub.cfg.\nGRUB configuration file was not updated.", 1);
  const parent = lookup(sh.state.root, dirname(sh.abs(out)));
  if (!parent) return fail(`grub2-mkconfig: ${dirname(out)}: Aucun fichier ou dossier de ce type`, 1);
  sh.writeRaw(sh.abs(out), cfg, 0o600);
  return { out: '', err: msg, code: 0 };
};

export const grub2Setpassword: CmdFn = ({ sh }) => {
  if (!sh.isRoot) return fail('grub2-setpassword: Permission non accordée', 1);
  return {
    out: '',
    err: '',
    code: 0,
    ask: {
      prompt: 'Enter password: ',
      hidden: true,
      next: (p1) => ({
        out: '\n',
        err: '',
        code: 0,
        ask: {
          prompt: 'Confirm password: ',
          hidden: true,
          next: (p2) => {
            if (p1 !== p2) return fail('\nSorry, passwords do not match.', 1);
            let h = '';
            for (let i = 0; i < 128; i++) h += ((p1.charCodeAt(i % p1.length) * (i + 7)) % 16).toString(16);
            sh.writeRaw('/boot/grub2/user.cfg', `GRUB2_PASSWORD=grub.pbkdf2.sha512.10000.${h.slice(0, 128)}.${h.slice(0, 128)}\n`, 0o600);
            return ok('\n');
          }
        }
      })
    }
  };
};

// ---------------- power ----------------
export const reboot: CmdFn = ({ argv, sh }) => {
  if (!sh.isRoot) return fail('Call to Reboot failed: Interactive authentication required.', 1);
  const off = /poweroff|halt|shutdown/.test(argv[0]);
  // boot again
  sh.state.bootTime = Date.now();
  for (const e of sh.state.journal) if (e.boot === 0) e.boot = -1;
  else e.boot -= 1;
  const def = defaultTarget(sh);
  sh.state.currentTarget = def;
  for (const s of Object.values(sh.state.services)) {
    if (s.name === 'systemd-journald') continue;
    s.active = s.enabled === 'enabled' ? 'active' : 'inactive';
    if (s.name === 'gdm') s.active = def === 'graphical.target' ? 'active' : 'inactive';
    if (s.name === 'kdump' && s.enabled === 'enabled') s.active = 'failed';
    if (s.custom && s.enabled === 'enabled') startSvc(sh, s);
  }
  sh.log('kernel', `Linux version ${KERNEL}`);
  sh.log('systemd', `Reached target ${TARGETS[def]?.desc ?? def}.`);
  // /tmp is emptied at boot
  const tmp = lookup(sh.state.root, '/tmp')!;
  const kept = Object.keys(tmp.kids!).length;
  tmp.kids = {};
  sh.sessions = sh.sessions.slice(0, 1);
  const u = sh.sessions[0].user;
  sh.sessions[0].cwd = sh.getUser(u)?.home ?? '/';
  return ok(`${off ? 'Le système va s’arrêter…' : 'Redémarrage du système…'} (simulé)\n[  OK  ] Stopped target ${TARGETS[sh.state.currentTarget]?.desc}.\n${off ? '' : `\nGRUB → ${KERNEL} → systemd (PID 1) → ${def}\n${kept ? `(/tmp vidé : ${kept} élément(s) supprimé(s))\n` : ''}\nRed Hat Enterprise Linux 9.4 (Plow)\nKernel ${KERNEL} on an x86_64\n\n${HOSTNAME} login: ${u} (reconnexion automatique)\n`}`);
};

export const runlevel: CmdFn = ({ sh }) => ok(`N ${sh.state.currentTarget === 'graphical.target' ? 5 : sh.state.currentTarget === 'rescue.target' ? 1 : 3}\n`);
export const telinit: CmdFn = ({ args, sh }) => {
  const t = RUNLEVEL_TARGET[args[0] ?? ''];
  if (!t) return fail('telinit: niveau inconnu');
  return systemctl({ argv: ['systemctl'], args: ['isolate', t], stdin: null, sh });
};

// ---------------- misc ----------------
export const uname: CmdFn = ({ args }) => {
  const f = args.join('');
  if (f.includes('a')) return ok(`Linux ${HOSTNAME} ${KERNEL} #1 SMP PREEMPT_DYNAMIC Thu Apr 4 20:45:21 EDT 2024 x86_64 x86_64 x86_64 GNU/Linux\n`);
  const parts: string[] = [];
  if (!f || f.includes('s')) parts.push('Linux');
  if (f.includes('n')) parts.push(HOSTNAME);
  if (f.includes('r')) parts.push(KERNEL);
  if (f.includes('m')) parts.push('x86_64');
  if (f.includes('o')) parts.push('GNU/Linux');
  return ok(parts.join(' ') + '\n');
};

export const hostname: CmdFn = ({ args, sh }) => {
  if (args[0] && !args[0].startsWith('-')) return sh.isRoot ? ok() : fail("hostname: you must be root to change the host name");
  if (args.includes('-I')) return ok('192.168.56.10 10.0.2.15\n');
  return ok(HOSTNAME + '\n');
};

export const tty: CmdFn = ({ sh }) => ok(`/dev/pts/${sh.sessions.length - 1}\n`);

export const date: CmdFn = ({ args }) => {
  const d = now();
  if (args[0]?.startsWith('+')) {
    const f = args[0].slice(1);
    return ok(f.replace(/%Y/g, String(d.getFullYear())).replace(/%m/g, pad(d.getMonth() + 1)).replace(/%d/g, pad(d.getDate())).replace(/%H/g, pad(d.getHours())).replace(/%M/g, pad(d.getMinutes())).replace(/%S/g, pad(d.getSeconds())).replace(/%F/g, d.toISOString().slice(0, 10)).replace(/%T/g, hms(d)) + '\n');
  }
  const fullDays = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  const fullMon = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  return ok(`${fullDays[d.getDay()]} ${d.getDate()} ${fullMon[d.getMonth()]} ${d.getFullYear()}, ${hms(d)} (UTC+0100)\n`);
};

export const cal: CmdFn = () => {
  const d = now();
  const y = d.getFullYear();
  const m = d.getMonth();
  const fullMon = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  const title = `${fullMon[m]} ${y}`;
  let s = title.padStart(10 + Math.ceil(title.length / 2)) + '\nlu ma me je ve sa di\n';
  const first = (new Date(y, m, 1).getDay() + 6) % 7;
  const days = new Date(y, m + 1, 0).getDate();
  let line = '   '.repeat(first);
  for (let i = 1; i <= days; i++) {
    line += String(i).padStart(2) + ' ';
    if ((first + i) % 7 === 0) {
      s += line.trimEnd() + '\n';
      line = '';
    }
  }
  if (line) s += line.trimEnd() + '\n';
  return ok(s);
};

export const uptime: CmdFn = ({ sh, args }) => {
  const up = Math.floor((Date.now() - sh.state.bootTime) / 60000);
  if (args.includes('-p')) return ok(`up ${Math.floor(up / 60)} hours, ${up % 60} minutes\n`);
  const d = now();
  return ok(` ${hms(d)} up ${Math.floor(up / 60)}:${pad(up % 60)},  2 users,  load average: 0,08, 0,03, 0,01\n`);
};

export const history: CmdFn = ({ args, sh }) => {
  if (args[0] === '-c') {
    sh.history = [];
    return ok();
  }
  const n = args[0] ? +args[0] : sh.history.length;
  const start = Math.max(0, sh.history.length - n);
  return ok(sh.history.slice(start).map((h, i) => `${String(start + i + 1).padStart(5)}  ${h}`).join('\n') + '\n');
};

export const clear: CmdFn = () => ({ out: '', err: '', code: 0, clear: true });

export const typeCmd: CmdFn = ({ args, sh }) => {
  let out = '';
  let err = '';
  for (const a of args.filter((x) => !x.startsWith('-'))) {
    if (ALIASES[a]) out += `${a} est un alias vers « ${ALIASES[a]} »\n`;
    else if (BUILTINS.has(a)) out += `${a} est une primitive du shell\n`;
    else {
      const p = sh.which(a);
      if (p) out += `${a} est ${p}\n`;
      else err += `bash: type: ${a} : non trouvé\n`;
    }
  }
  return { out, err, code: err ? 1 : 0 };
};

export const which: CmdFn = ({ args, sh }) => {
  let out = '';
  let err = '';
  for (const a of args) {
    const p = sh.which(a);
    if (ALIASES[a]) out += `alias ${a}='${ALIASES[a]}'\n\t${p ?? ''}\n`;
    else if (p) out += p + '\n';
    else err += `/usr/bin/which: no ${a} in (${sh.session.env.PATH.replace(/:/g, ':')})\n`;
  }
  return { out, err, code: err ? 1 : 0 };
};

export const whereis: CmdFn = ({ args, sh }) => ok(args.map((a) => {
  const p = sh.which(a);
  const sec = MAN[a]?.section ?? 1;
  return `${a}:${p ? ' ' + p : ''}${MAN[a] ? ` /usr/share/man/man${sec}/${a}.${sec}.gz` : ''}${a === 'passwd' ? ' /etc/passwd /usr/share/man/man5/passwd.5.gz' : ''}`;
}).join('\n') + '\n');

export const man: CmdFn = ({ args }) => {
  if (args[0] === '-k') return apropos({ argv: ['apropos'], args: args.slice(1), stdin: null, sh: null as unknown as Shell });
  let section: number | null = null;
  let name = args[0];
  if (/^\d$/.test(args[0] ?? '')) {
    section = +args[0];
    name = args[1];
  }
  if (!name) return fail('Quelle page de manuel voulez-vous ?\nPar exemple, essayez « man man ».', 1);
  if (name === 'passwd' && section === 5) return ok(MAN_PASSWD5);
  if (name === 'shadow' && section === 5) return ok(MAN_SHADOW5);
  const m = MAN[name];
  if (!m || (section && m.section !== section && !(name === 'passwd' && section === 1))) return fail(`Il n'y a pas de page de manuel pour ${name}${section ? ` dans la section ${section}` : ''}.`, 16);
  return ok(`${name.toUpperCase()}(${m.section})                    Manuel de l'utilisateur Linux                   ${name.toUpperCase()}(${m.section})\n\nNOM\n       ${name} - ${m.desc}\n\nSYNOPSIS\n       ${m.synopsis}\n\nDESCRIPTION (résumé)\n${m.options.map((o) => `       ${o}`).join('\n')}\n\n(résumé du simulateur — dans le vrai man : /mot pour chercher, n suivant, q pour quitter)\n`);
};

const MAN_PASSWD5 = `PASSWD(5)                Formats de fichier                PASSWD(5)\n\nNOM\n       passwd - fichier des mots de passe\n\nDESCRIPTION\n       /etc/passwd contient une ligne par compte, 7 champs séparés par « : »\n         login:x:UID:GID:commentaire(GECOS):répertoire_personnel:shell\n       Le « x » indique que le mot de passe chiffré est dans /etc/shadow.\n       Le fichier est lisible par tous (644).\n\nVOIR AUSSI\n       passwd(1), shadow(5), group(5)\n`;
const MAN_SHADOW5 = `SHADOW(5)                Formats de fichier                SHADOW(5)\n\nNOM\n       shadow - fichier des mots de passe cachés\n\nDESCRIPTION\n       login:mdp_chiffré:dernier_changement:min:max:avertissement:inactivité:expiration:réservé\n       « !! » ou « ! » en tête du mot de passe = compte verrouillé / sans mot de passe.\n       $6$ = SHA-512. Lisible uniquement par root.\n`;

export const apropos: CmdFn = ({ args }) => {
  const k = (args[0] ?? '').toLowerCase();
  if (!k) return fail('apropos what?', 1);
  const hits = Object.entries(MAN).filter(([n, m]) => n.includes(k) || m.desc.toLowerCase().includes(k));
  if (!hits.length) return fail(`${k} : rien d'approprié.`, 16);
  return ok(hits.map(([n, m]) => `${`${n} (${m.section})`.padEnd(22)} - ${m.desc}`).join('\n') + '\n');
};

export const mandb: CmdFn = ({ sh }) => (sh.isRoot ? ok('Purge des anciennes entrées de la base de données dans /usr/share/man...\nTraitement des pages de manuel de /usr/share/man...\n0 sous-répertoires man contenaient des pages de manuel plus récentes.\n0 pages de manuel ont été ajoutées.\n') : fail("mandb: impossible d'écrire dans /var/cache/man/index.db : Permission non accordée", 1));

export const ps: CmdFn = ({ sh }) => {
  const rows: string[] = ['root           1  0.0  0.4 172848 16624 ?        Ss   13:01   0:02 /usr/lib/systemd/systemd rhgb --switched-root --system --deserialize 31', 'root           2  0.0  0.0      0     0 ?        S    13:01   0:00 [kthreadd]'];
  for (const s of Object.values(sh.state.services)) if (s.active === 'active') rows.push(`${(s.name === 'chronyd' ? 'chrony' : 'root').padEnd(10)} ${String(s.pid ?? 800).padStart(5)}  0.0  0.2  ${String(20000 + (s.pid ?? 0) * 7).padStart(6)}  ${String(4000 + (s.pid ?? 0)).padStart(5)} ?        Ss   13:01   0:00 ${s.execStart}`);
  rows.push(`${sh.user.padEnd(10)}  ${String(3000 + sh.sessions.length).padStart(4)}  0.0  0.1 224088  5340 pts/0    Ss   13:05   0:00 -bash`);
  rows.push(`${sh.user.padEnd(10)}  ${String(4100 + sh.history.length).padStart(4)}  0.0  0.0 225600  3520 pts/0    R+   ${hms(now()).slice(0, 5)}   0:00 ps aux`);
  return ok('USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND\n' + rows.join('\n') + '\n');
};

export const firewallCmd: CmdFn = ({ args, sh }) => {
  if (!sh.isRoot && !args.includes('--state') && !args.includes('--list-services')) return fail('Authorization failed.\n    Make sure polkit agent is running or run the application as superuser.', 1);
  if (args.includes('--state')) return sh.state.services.firewalld?.active === 'active' ? ok('running\n') : fail('not running', 252);
  if (sh.state.services.firewalld?.active !== 'active') return fail('FirewallD is not running', 252);
  if (args.includes('--list-services')) return ok(sh.fw.join(' ') + '\n');
  if (args.includes('--list-all')) return ok(`public (active)\n  target: default\n  interfaces: ens160\n  services: ${sh.fw.join(' ')}\n  ports: \n  protocols: \n  masquerade: no\n`);
  const add = args.find((a) => a.startsWith('--add-service='));
  if (add) {
    const s = add.split('=')[1];
    if (sh.fw.includes(s)) return ok(`Warning: ALREADY_ENABLED: ${s}\nsuccess\n`);
    sh.fw.push(s);
    return ok('success\n');
  }
  const rem = args.find((a) => a.startsWith('--remove-service='));
  if (rem) {
    sh.fw = sh.fw.filter((x) => x !== rem.split('=')[1]);
    return ok('success\n');
  }
  if (args.includes('--reload')) return ok('success\n');
  return fail('usage: firewall-cmd [--state | --list-services | --list-all | --add-service=SERVICE [--permanent] | --reload]', 2);
};

export const test: CmdFn = ({ argv, args, sh }) => {
  let a = argv[0] === '[' ? args.slice(0, -1) : args;
  if (argv[0] === '[' && args[args.length - 1] !== ']') return fail("bash: [: « ] » manquant", 2);
  let neg = false;
  if (a[0] === '!') {
    neg = true;
    a = a.slice(1);
  }
  let r = false;
  if (a.length === 2) {
    const n = sh.node(a[1]);
    const op = a[0];
    if (op === '-d') r = !!n && n.t === 'd';
    else if (op === '-f') r = !!n && n.t === 'f';
    else if (op === '-e') r = !!n;
    else if (op === '-r') r = !!n && sh.checkAccess(sh.abs(a[1]), 'r') === null;
    else if (op === '-w') r = !!n && sh.checkAccess(sh.abs(a[1]), 'w') === null;
    else if (op === '-x') r = !!n && sh.checkAccess(sh.abs(a[1]), 'x') === null;
    else if (op === '-s') r = !!n && n.t === 'f' && (n.data ?? '').length > 0;
    else if (op === '-z') r = a[1] === '';
    else if (op === '-n') r = a[1] !== '';
  } else if (a.length === 3) {
    const [x, op, y] = a;
    if (op === '=' || op === '==') r = x === y;
    else if (op === '!=') r = x !== y;
    else if (op === '-eq') r = +x === +y;
    else if (op === '-ne') r = +x !== +y;
    else if (op === '-gt') r = +x > +y;
    else if (op === '-lt') r = +x < +y;
    else if (op === '-ge') r = +x >= +y;
    else if (op === '-le') r = +x <= +y;
  } else if (a.length === 1) r = a[0] !== '';
  return { out: '', err: '', code: r !== neg ? 0 : 1 };
};

export const env: CmdFn = ({ sh }) => ok(Object.entries({ ...sh.session.env, PWD: sh.session.cwd }).filter(([k]) => !k.startsWith('__')).map(([k, v]) => `${k}=${v}`).join('\n') + '\n');
export const exportCmd: CmdFn = ({ args, sh }) => {
  for (const a of args) {
    const [k, ...v] = a.split('=');
    if (v.length) sh.session.env[k] = v.join('=');
  }
  return ok();
};
export const free: CmdFn = ({ args }) =>
  ok(args.includes('-h') ? '               total       utilisé      libre     partagé tamp/cache   disponible\nMem:           3,7Gi       1,2Gi       1,3Gi        18Mi       1,2Gi       2,4Gi\nSwap:          4,0Gi          0B       4,0Gi\n' : '               total       utilisé      libre     partagé tamp/cache   disponible\nMem:         3843812     1289400     1325404       18432     1229008     2533980\nSwap:        4194300           0     4194300\n');
export const lsblk: CmdFn = () =>
  ok('NAME          MAJ:MIN RM  SIZE RO TYPE MOUNTPOINTS\nsda             8:0    0  100G  0 disk \n├─sda1          8:1    0    1G  0 part /boot/efi\n├─sda2          8:2    0    1G  0 part /boot\n└─sda3          8:3    0   98G  0 part \n  ├─rhel-root 253:0    0   20G  0 lvm  /\n  ├─rhel-swap 253:1    0    4G  0 lvm  [SWAP]\n  ├─rhel-home 253:2    0   50G  0 lvm  /home\n  └─rhel-var  253:3    0   24G  0 lvm  /var\nsr0            11:0    1 10,2G  0 rom  \n');
export const mount: CmdFn = ({ args }) => {
  if (!args.length) return ok('/dev/mapper/rhel-root on / type xfs (rw,relatime,seclabel)\n/dev/sda2 on /boot type xfs (rw,relatime,seclabel)\n/dev/sda1 on /boot/efi type vfat (rw,relatime,fmask=0077,dmask=0077)\n/dev/mapper/rhel-home on /home type xfs (rw,relatime,seclabel)\n/dev/mapper/rhel-var on /var type xfs (rw,relatime,seclabel)\n');
  return fail('mount: (simulé) seul « mount » sans argument est disponible ici ; « mount -o remount,rw /sysroot » se fait dans le mode rd.break.', 1);
};
export const trueCmd: CmdFn = () => ok();
export const falseCmd: CmdFn = () => ({ out: '', err: '', code: 1 });
export const sleep: CmdFn = () => ok();
export const help: CmdFn = () =>
  ok(`Terminal RHEL 9 simulé — commandes disponibles :\n  ${Object.keys(COMMANDS).sort().join(' ')}\n\nComptes : root / redhat · etudiant / etudiant\nAstuces : ↑/↓ historique · Tab complétion · Ctrl+L effacer · Ctrl+C annuler\n`);
export const kill: CmdFn = () => ok();
export const restorecon: CmdFn = () => ok();
export const loadPolicy: CmdFn = () => ok();


export type { CmdRes, Ask, FNode };
export { walk };
