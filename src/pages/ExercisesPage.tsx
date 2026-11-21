import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useModuleContent } from '../hooks/useModule';
import { Loading, PageTitle, useModuleParam } from '../components/Layout';
import { useStore } from '../store/store';
import { useT, useL } from '../hooks/useT';
import { L, Code, Tex, guessLang } from '../components/Text';
import { Icon } from '../components/Icon';
import type { Exercise } from '../lib/schema';

function ExerciseCard({ e, initialOpen = false }: { e: Exercise; initialOpen?: boolean }) {
  const { t } = useT();
  const [open, setOpen] = useState(initialOpen);
  const ref = useRef<HTMLLIElement>(null);
  useEffect(() => {
    if (initialOpen) ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [initialOpen]);
  const [hints, setHints] = useState(0);
  const [sol, setSol] = useState(false);
  const status = useStore((s) => s.exercises[e.id]);
  const setEx = useStore((s) => s.setExercise);
  return (
    <li ref={ref} className="card scroll-mt-32 overflow-hidden" data-testid={`exercise-${e.id}`}>
      <button className="flex w-full items-center gap-3 p-4 text-left" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${status === 'ok' ? 'bg-ok/15 text-ok' : status === 'ko' ? 'bg-bad/15 text-bad' : 'bg-surface2 text-muted'}`}>
          <Icon name={status === 'ok' ? 'check' : status === 'ko' ? 'reset' : 'dumbbell'} size={18} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold">
            <L v={e.title} />
          </span>
          <span className="text-xs text-muted">
            {e.difficulty === 3 ? t('common.hard') : t('common.medium')}
            {status && ` · ${status === 'ok' ? t('ex.status.ok') : t('ex.status.ko')}`}
          </span>
        </span>
        <Icon name={open ? 'up' : 'down'} className="text-muted" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="space-y-4 border-t border-line p-4">
              <L v={e.statement} md />
              {e.data && (
                <div>
                  <div className="mb-1 text-xs font-semibold uppercase text-muted">{t('ex.data')}</div>
                  <Code code={e.data} lang={e.module === 'data' ? 'text' : 'bash'} />
                </div>
              )}
              {e.missionId && (
                <Link to={`/terminal?mission=${e.missionId}`} className="btn-ghost btn-sm">
                  <Icon name="terminal" size={14} /> {t('ex.openMission')}
                </Link>
              )}
              <div className="space-y-2">
                {e.hints.slice(0, hints).map((h, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="rounded-xl border border-accent2/40 bg-accent2/10 p-3 text-sm">
                    <span className="font-semibold">
                      {t('ex.hint')} {i + 1} :{' '}
                    </span>
                    <L v={h} />
                  </motion.div>
                ))}
                <div className="flex flex-wrap gap-2">
                  {hints < e.hints.length && !sol && (
                    <button className="btn-ghost btn-sm" onClick={() => setHints(hints + 1)}>
                      <Icon name="bulb" size={14} /> {t('ex.showHint')} ({hints + 1}/{e.hints.length})
                    </button>
                  )}
                  {!sol && (
                    <button className="btn-ghost btn-sm" onClick={() => setSol(true)} data-testid="show-solution">
                      <Icon name="list" size={14} /> {t('ex.showSolution')}
                    </button>
                  )}
                </div>
              </div>
              {sol && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                  <ol className="space-y-3">
                    {e.solutionSteps.map((s, i) => (
                      <motion.li key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }} className="relative border-l-2 border-accent pl-4">
                        <span className="absolute -left-[9px] top-0 grid h-4 w-4 place-items-center rounded-full bg-accent text-[9px] font-bold text-bg">{i + 1}</span>
                        <div className="font-semibold">
                          <L v={s.title} />
                        </div>
                        <L v={s.body} md />
                        {s.code && <Code code={s.code} lang={guessLang(s.code, e.module === 'data' ? 'python' : 'bash')} className="mt-2" />}
                        {s.tex && <Tex tex={s.tex} block />}
                      </motion.li>
                    ))}
                  </ol>
                  <div className="rounded-xl border border-ok/50 bg-ok/10 p-3">
                    <div className="text-xs font-semibold uppercase text-ok">{t('ex.final')}</div>
                    <L v={e.finalAnswer} md />
                  </div>
                  <div className="rounded-xl border border-bad/40 bg-bad/5 p-3">
                    <div className="mb-1 text-xs font-semibold uppercase text-bad">{t('ex.mistakes')}</div>
                    <ul className="list-disc space-y-1 pl-5 text-sm">
                      {e.commonMistakes.map((m, i) => (
                        <li key={i}>
                          <L v={m} />
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn-primary flex-1" onClick={() => setEx(e.id, true)}>
                      <Icon name="check" size={16} /> {t('ex.success')}
                    </button>
                    <button className="btn-ghost flex-1" onClick={() => setEx(e.id, false)}>
                      <Icon name="x" size={16} /> {t('ex.fail')}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export default function ExercisesPage() {
  const id = useModuleParam();
  const { data } = useModuleContent(id);
  const { t } = useT();
  const tl = useL();
  const [params] = useSearchParams();
  const [chapter, setChapter] = useState(params.get('chapter') ?? 'all');
  const openId = params.get('open');
  if (!data) return <Loading />;
  const list = data.exercises.filter((e) => chapter === 'all' || e.chapter === chapter);
  return (
    <div className="space-y-4">
      <PageTitle eyebrow={tl(data.module.title)} title={t('ex.title')} sub={`${data.exercises.length} ${t('module.exercises')}`} />
      <select className="input" value={chapter} onChange={(e) => setChapter(e.target.value)} aria-label={t('qcm.filterChapter')}>
        <option value="all">{t('common.all')}</option>
        {data.chapters.map((c) => (
          <option key={c.id} value={c.id}>
            {tl(c.title)}
          </option>
        ))}
      </select>
      <ul className="space-y-2">
        {list.map((e) => (
          <ExerciseCard key={e.id} e={e} initialOpen={e.id === openId} />
        ))}
      </ul>
    </div>
  );
}
