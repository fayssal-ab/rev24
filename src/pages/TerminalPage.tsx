import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shell } from '../terminal/shell';
import { missionShell, evaluateMission } from '../terminal/missions';
import { TerminalView } from '../components/TerminalView';
import { PageTitle, Loading } from '../components/Layout';
import { useModuleContent } from '../hooks/useModule';
import { useStore } from '../store/store';
import { useT, useL } from '../hooks/useT';
import { L, Code } from '../components/Text';
import { Icon } from '../components/Icon';
import { confetti } from '../components/confetti';
import type { Mission } from '../lib/schema';

function MissionPanel({ m, onExit }: { m: Mission; onExit: () => void }) {
  const { t } = useT();
  const done = useStore((s) => s.missions[m.id]);
  const complete = useStore((s) => s.completeMission);
  const [shell, setShell] = useState(() => missionShell(m));
  const [results, setResults] = useState<boolean[]>(() => evaluateMission(shell, m));
  const [showSol, setShowSol] = useState(false);
  const refresh = () => {
    const r = evaluateMission(shell, m);
    setResults(r);
    if (r.every(Boolean) && !useStore.getState().missions[m.id]) {
      complete(m.id);
      confetti();
    }
  };
  const all = results.every(Boolean);
  return (
    <div className="space-y-3" data-testid="mission">
      <button className="btn-ghost btn-sm" onClick={onExit}>
        <Icon name="left" size={14} /> {t('term.missions')}
      </button>
      <div className="card p-4">
        <h2 className="h2">
          <L v={m.title} />
        </h2>
        <div className="mt-2 text-sm">
          <L v={m.goal} md />
        </div>
        {m.tp5.length > 0 && (
          <p className="mt-2 text-xs text-muted">
            {t('term.tp5')} : {m.tp5.join(', ')}
          </p>
        )}
        <h3 className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted">{t('term.objectives')}</h3>
        <ul className="mt-1 space-y-1" data-testid="objectives">
          {m.objectives.map((o, i) => (
            <motion.li key={i} animate={results[i] ? { scale: [1, 1.04, 1] } : {}} className={`flex items-start gap-2 text-sm ${results[i] ? 'text-ok' : ''}`} data-ok={results[i] ? 'true' : 'false'}>
              <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border ${results[i] ? 'border-ok bg-ok text-bg' : 'border-line'}`}>{results[i] && <Icon name="check" size={14} />}</span>
              <L v={o.label} />
            </motion.li>
          ))}
        </ul>
        {(all || done) && (
          <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-3 flex items-center gap-2 font-semibold text-ok" data-testid="mission-done">
            <Icon name="checkCircle" size={18} />
            {t('term.missionDone')}
          </motion.p>
        )}
      </div>
      <TerminalView shell={shell} onCommand={refresh} banner={m.rdbreak ? "[  OK  ] Reached target Initrd Default Target.\nEntering emergency mode (rd.break)…\n\n" : undefined} className="h-[52vh]" />
      <div className="flex flex-wrap gap-2">
        <button
          className="btn-ghost btn-sm"
          onClick={() => {
            const s = missionShell(m);
            setShell(s);
            setResults(evaluateMission(s, m));
          }}
        >
          <Icon name="reset" size={14} /> {t('common.reset')}
        </button>
        <button className="btn-ghost btn-sm" onClick={() => setShowSol(!showSol)}>
          <Icon name="bulb" size={14} /> {t('term.solution')}
        </button>
      </div>
      {showSol && <Code code={m.solution.join('\n')} lang="bash" />}
    </div>
  );
}

export default function TerminalPage() {
  const { t } = useT();
  const tl = useL();
  const [params, setParams] = useSearchParams();
  const { data } = useModuleContent('linux');
  const doneMap = useStore((s) => s.missions);
  const missionId = params.get('mission');
  const [free, setFree] = useState(() => new Shell('etudiant'));
  const [chapter, setChapter] = useState('all');
  useEffect(() => {
    useStore.getState().setLastModule('linux');
  }, []);
  const mission = useMemo(() => data?.missions.find((m) => m.id === missionId), [data, missionId]);
  if (missionId && !data) return <Loading />;
  if (mission) return <MissionPanel key={mission.id} m={mission} onExit={() => setParams({})} />;
  const list = (data?.missions ?? []).filter((m) => chapter === 'all' || m.chapter === chapter);
  return (
    <div className="space-y-4">
      <PageTitle back="/" title={t('term.title')} sub={t('term.accounts')} />
      <TerminalView shell={free} banner={`Red Hat Enterprise Linux 9.4 (Plow)\nKernel 5.14.0-427.13.1.el9_4.x86_64 on an x86_64\n\n${t('term.help')}\n\n`} className="h-[55vh]" />
      <button className="btn-ghost btn-sm" onClick={() => setFree(new Shell('etudiant'))} data-testid="terminal-reset">
        <Icon name="reset" size={14} /> {t('term.reset')}
      </button>
      <section>
        <h2 className="h2 mb-2">{t('term.missions')}</h2>
        {data && (
          <select className="input mb-2" value={chapter} onChange={(e) => setChapter(e.target.value)} aria-label={t('qcm.filterChapter')}>
            <option value="all">{t('common.all')}</option>
            {data.chapters.filter((c) => data.missions.some((m) => m.chapter === c.id)).map((c) => (
              <option key={c.id} value={c.id}>
                {tl(c.title)}
              </option>
            ))}
          </select>
        )}
        <ul className="grid grid-cols-[minmax(0,1fr)] gap-2 sm:grid-cols-2">
          {list.map((m) => (
            <li key={m.id}>
              <button onClick={() => setParams({ mission: m.id })} className="card flex w-full items-center gap-3 p-3 text-left hover:border-accent" data-testid={`mission-${m.id}`}>
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${doneMap[m.id] ? 'bg-ok/20 text-ok' : 'bg-[#0b1020] text-emerald-300'}`}>
                  <Icon name={doneMap[m.id] ? 'check' : 'terminal'} size={18} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">
                    <L v={m.title} />
                  </span>
                  <span className="text-xs text-muted">
                    {m.objectives.length} {t('term.objectives').toLowerCase()}
                    {m.tp5.length > 0 && ` · TP5 Q${m.tp5[0]}${m.tp5.length > 1 ? '–' + m.tp5[m.tp5.length - 1] : ''}`}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
