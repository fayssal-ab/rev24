import type { Mission, MissionCheck } from '../lib/schema';
import { Shell } from './shell';
import { lookup } from './vfs';
import { verifyPassword } from './accounts';

/** Evaluate one mission objective against the current virtual system. */
export function checkObjective(sh: Shell, c: MissionCheck): boolean {
  switch (c.type) {
    case 'userExists': {
      const u = sh.getUser(c.user);
      if (!u) return false;
      if (c.uid !== undefined && u.uid !== c.uid) return false;
      if (c.gid !== undefined && sh.groupName(u.gid) !== c.gid) return false;
      if (c.home !== undefined && u.home !== c.home) return false;
      if (c.shell !== undefined && u.shell !== c.shell) return false;
      if (c.comment !== undefined && u.gecos !== c.comment) return false;
      return true;
    }
    case 'userAbsent':
      return !sh.getUser(c.user);
    case 'groupExists': {
      const g = sh.getGroup(c.group);
      return !!g && g.name === c.group && (c.gid === undefined || g.gid === c.gid);
    }
    case 'groupAbsent':
      return !sh.groups().some((g) => g.name === c.group);
    case 'inGroup': {
      const g = sh.groups().find((x) => x.name === c.group);
      const u = sh.getUser(c.user);
      const isIn = !!g && !!u && (g.members.includes(c.user) || u.gid === g.gid);
      return c.not ? !isIn : isIn;
    }
    case 'pathExists': {
      const n = lookup(sh.state.root, c.path);
      const ok = !!n && (!c.kind || (c.kind === 'dir' ? n.t === 'd' : n.t === 'f'));
      return c.not ? !n : ok;
    }
    case 'owner': {
      const n = lookup(sh.state.root, c.path);
      if (!n) return false;
      if (c.user && sh.userName(n.uid) !== c.user) return false;
      if (c.group && sh.groupName(n.gid) !== c.group) return false;
      return true;
    }
    case 'mode': {
      const n = lookup(sh.state.root, c.path);
      return !!n && (n.mode & 0o7777).toString(8) === c.mode.replace(/^0+(?=\d{3})/, '');
    }
    case 'fileContains': {
      const n = lookup(sh.state.root, c.path);
      const has = !!n && (n.data ?? '').includes(c.text);
      return c.not ? !has : has;
    }
    case 'passwordLocked': {
      const s = sh.shadow().find((x) => x.name === c.user);
      return !!s && s.hash.startsWith('!') === c.locked;
    }
    case 'shadowField': {
      const s = sh.shadow().find((x) => x.name === c.user);
      if (!s) return false;
      const v = s[c.field];
      if (c.field === 'expire' && /^\d{4}-/.test(c.value)) return v !== '' && new Date(+v * 86400000).toISOString().slice(0, 10) === c.value;
      return v === c.value;
    }
    case 'serviceState': {
      const s = sh.state.services[c.service.replace(/\.service$/, '')];
      if (!s) return false;
      if (c.active !== undefined && (s.active === 'active') !== c.active) return false;
      if (c.enabled !== undefined && (s.enabled === 'enabled') !== c.enabled) return false;
      if (c.masked !== undefined && (s.enabled === 'masked') !== c.masked) return false;
      return true;
    }
    case 'defaultTarget': {
      const l = lookup(sh.state.root, '/etc/systemd/system/default.target', false);
      return !!l && l.t === 'l' && l.target!.endsWith('/' + c.target);
    }
    case 'packageInstalled':
      return !!sh.state.installed[c.name] === c.installed;
    case 'currentUser':
      return sh.user === c.user;
    case 'password': {
      const s = sh.shadow().find((x) => x.name === c.user);
      return !!s && verifyPassword(s.hash, c.password);
    }
    case 'flag':
      return !!sh.flags[c.flag];
    case 'fileLine': {
      const l = sh.readRaw(c.path).split('\n').find((x) => x.split(':')[0] === c.user);
      return !!l && l.split(':')[c.field] === c.value;
    }
    default:
      return false; // SQL*Plus checks are evaluated by the SQL*Plus simulator
  }
}

/** Fresh shell prepared for a mission (setup commands run silently as root). */
export function missionShell(m: Mission): Shell {
  const sh = new Shell('root');
  for (const cmd of m.setup) {
    sh.input(cmd);
    while (sh.pending) sh.input('');
    sh.editor = null;
  }
  sh.history = [];
  if (m.rdbreak) sh.enterRdBreak();
  else if (m.startUser !== 'root') {
    sh.sessions = [];
    sh.pushSession(m.startUser, true);
  }
  return sh;
}

export function evaluateMission(sh: Shell, m: Mission): boolean[] {
  return m.objectives.map((o) => checkObjective(sh, o.check));
}

/** Run the reference solution and check that every objective passes (used by content:check and tests). */
export function solveMission(m: Mission): { ok: boolean; results: boolean[]; transcript: string } {
  const sh = missionShell(m);
  let transcript = '';
  for (const l of m.solution) {
    transcript += sh.prompt() + l + '\n';
    transcript += sh.input(l).map((c) => c.text).join('');
  }
  const results = evaluateMission(sh, m);
  return { ok: results.every(Boolean), results, transcript };
}
