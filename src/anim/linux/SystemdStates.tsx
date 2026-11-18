import { useState } from 'react';
import { motion } from 'framer-motion';
import { useL } from '../../hooks/useT';
import { L } from '../../components/Text';
import { SYSTEMD } from '../../i18n/animLinux';
import { AnimCard } from '../Stepper';

export default function SystemdStates() {
  const tl = useL();
  const [active, setActive] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [masked, setMasked] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [cur, setCur] = useState('graphical.target');
  const [def, setDef] = useState('graphical.target');
  const act = (cmd: string) => {
    let out = '';
    if (cmd === 'start') {
      if (masked) out = 'Failed to start httpd.service: Unit httpd.service is masked.';
      else setActive(true);
    }
    if (cmd === 'stop') setActive(false);
    if (cmd === 'enable') {
      if (masked) out = 'Failed to enable unit: Unit file /etc/systemd/system/httpd.service is masked.';
      else {
        if (!enabled) out = 'Created symlink /etc/systemd/system/multi-user.target.wants/httpd.service → /usr/lib/systemd/system/httpd.service.';
        setEnabled(true);
      }
    }
    if (cmd === 'enable --now') {
      if (masked) out = 'Failed to enable unit: Unit file is masked.';
      else {
        setEnabled(true);
        setActive(true);
      }
    }
    if (cmd === 'disable') {
      if (enabled) out = 'Removed "/etc/systemd/system/multi-user.target.wants/httpd.service".';
      setEnabled(false);
    }
    if (cmd === 'mask') {
      setMasked(true);
      setEnabled(false);
      out = 'Created symlink /etc/systemd/system/httpd.service → /dev/null.';
    }
    if (cmd === 'unmask') {
      setMasked(false);
      out = 'Removed "/etc/systemd/system/httpd.service".';
    }
    setLog((l) => [...l.slice(-3), `# systemctl ${cmd} httpd${out ? '\n' + out : ''}`]);
  };
  const reboot = () => {
    setActive(enabled && !masked);
    setCur(def);
    setLog((l) => [...l.slice(-3), '# reboot']);
  };
  const Pill = ({ on, a, b }: { on: boolean; a: string; b: string }) => (
    <motion.span layout className={`rounded-full px-3 py-1 text-xs font-semibold ${on ? 'bg-ok/20 text-ok' : 'bg-surface2 text-muted'}`}>
      {on ? a : b}
    </motion.span>
  );
  return (
    <AnimCard title={tl(SYSTEMD.title)}>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-line p-3">
          <div className="mb-1 text-xs text-muted">{tl(SYSTEMD.now)}</div>
          <div className="flex items-center gap-2">
            <motion.span className="h-4 w-4 rounded-full" animate={{ backgroundColor: active ? 'rgb(var(--ok))' : 'rgb(var(--line))', scale: active ? [1, 1.25, 1] : 1 }} transition={{ repeat: active ? Infinity : 0, duration: 1.6 }} />
            <span className="font-mono text-sm">httpd.service</span>
            <Pill on={active} a={`active · ${tl(SYSTEMD.running)}`} b={`inactive · ${tl(SYSTEMD.stopped)}`} />
          </div>
        </div>
        <div className="rounded-xl border border-line p-3">
          <div className="mb-1 text-xs text-muted">{tl(SYSTEMD.boot)}</div>
          {masked ? <span className="rounded-full bg-bad/20 px-3 py-1 text-xs font-semibold text-bad">masked — {tl(SYSTEMD.maskedTxt)}</span> : <Pill on={enabled} a={`enabled · ${tl(SYSTEMD.willStart)}`} b={`disabled · ${tl(SYSTEMD.wontStart)}`} />}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {['start', 'stop', 'enable', 'disable', 'enable --now', 'mask', 'unmask'].map((c) => (
          <button key={c} className="btn-ghost btn-sm font-mono" onClick={() => act(c)}>
            {c}
          </button>
        ))}
        <button className="btn-primary btn-sm" onClick={reboot}>
          ⟳ {tl(SYSTEMD.reboot)}
        </button>
      </div>
      <pre className="term mt-3 min-h-[70px] overflow-x-auto whitespace-pre-wrap rounded-xl bg-[#0b1020] p-3 text-[12px] text-slate-300">{log.join('\n')}</pre>
      <div className="mt-2 text-sm">
        <L v={SYSTEMD.lesson} md />
      </div>
      <h4 className="mt-4 font-semibold">{tl(SYSTEMD.targets)}</h4>
      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-xl border border-line p-2">
          <div className="text-xs text-muted">{tl(SYSTEMD.current)}</div>
          <motion.div key={cur} initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="font-mono text-accent">
            {cur}
          </motion.div>
        </div>
        <div className="rounded-xl border border-line p-2">
          <div className="text-xs text-muted">{tl(SYSTEMD.def)}</div>
          <motion.div key={def} initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="font-mono text-accent2">
            {def}
          </motion.div>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {['multi-user.target', 'graphical.target'].map((tg) => (
          <span key={tg} className="flex gap-1">
            <button className="btn-ghost btn-sm font-mono" onClick={() => { setDef(tg); setLog((l) => [...l.slice(-3), `# systemctl set-default ${tg}`]); }}>
              set-default {tg.split('.')[0]}
            </button>
            <button className="btn-ghost btn-sm font-mono" onClick={() => { setCur(tg); setLog((l) => [...l.slice(-3), `# systemctl isolate ${tg}`]); }}>
              isolate {tg.split('.')[0]}
            </button>
          </span>
        ))}
      </div>
      <div className="mt-2 text-sm">
        <L v={SYSTEMD.targetLesson} md />
      </div>
    </AnimCard>
  );
}
