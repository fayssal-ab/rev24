import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { PageTitle, Loading } from '../components/Layout';
import { useStore } from '../store/store';
import { useT, useL } from '../hooks/useT';
import { MODULES, type ModuleContent } from '../lib/content';
import { useAllModules } from '../hooks/useModule';
import { pickWeighted, checkAnswer, type Response } from '../lib/quiz';
import { createPlan, markDone, replan, currentBlock, remainingSessions, type Block, type ChapterInfo, type Rev24Plan, type Goal } from '../lib/planner';
import { chapterMastery } from '../lib/mastery';
import { QuestionCard } from '../components/QuestionCard';
import { QuizRunner } from '../components/QuizRunner';
import { ExamRunner } from './ExamPage';
import { Icon } from '../components/Icon';
import { L } from '../components/Text';
import { Bar } from '../components/Ring';
import { confetti } from '../components/confetti';
import type { Question } from '../lib/schema';

const pad = (n: number) => String(n).padStart(2, '0');
function hm(ts: number) {
  const d = new Date(ts);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function dur(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  return `${h > 0 ? h + ':' : ''}${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
}

function chapterInfos(contents: ModuleContent[]): ChapterInfo[] {
  return contents.flatMap((c) =>
    c.chapters.map((ch) => ({
      module: c.module.id,
      chapter: ch.id,
      weight: c.module.weights[ch.id] ?? 1,
      parts: Math.max(1, ch.sections.filter((s) => s.type === 'heading').length),
      hasMission: c.missions.some((m) => m.chapter === ch.id),
      hasExercise: c.exercises.some((e) => e.chapter === ch.id)
    }))
  );
}

function softBeep() {
  try {
    const ctx = new AudioContext();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = 660;
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 1.3);
  } catch {
    /* audio unavailable */
  }
}

// ---------------- setup + diagnostic ----------------
function Setup({ contents, onPlan }: { contents: ModuleContent[]; onPlan: (p: Rev24Plan) => void }) {
  const { t } = useT();
  const tl = useL();
  const st = useStore();
  const [mods, setMods] = useState<string[]>(MODULES.map((m) => m.id));
  const def = useMemo(() => {
    const d = new Date(Date.now() + 24 * 3600_000);
    d.setMinutes(0, 0, 0);
    const off = d.getTimezoneOffset();
    return new Date(d.getTime() - off * 60000).toISOString().slice(0, 16);
  }, []);
  const [exam, setExam] = useState(def);
  const [diag, setDiag] = useState<Question[] | null>(null);
  const [resp, setResp] = useState<Record<string, Response | undefined>>({});
  const [i, setI] = useState(0);
  const [err, setErr] = useState('');
  const sel = contents.filter((c) => mods.includes(c.module.id));
  const startDiag = () => {
    if (new Date(exam).getTime() <= Date.now()) return setErr(t('r24.tooLate'));
    setErr('');
    const pool = sel.flatMap((c) => c.questions.filter((q) => q.kind !== 'order'));
    const weights = Object.fromEntries(sel.flatMap((c) => Object.entries(c.module.weights)));
    setDiag(pickWeighted(pool, weights, 15));
  };
  const finish = () => {
    const per: Record<string, { ok: number; total: number }> = {};
    for (const q of diag!) {
      const k = `${q.module}/${q.chapter}`;
      per[k] ??= { ok: 0, total: 0 };
      per[k].total++;
      const r = resp[q.id];
      const good = r !== undefined && checkAnswer(q, r);
      if (good) per[k].ok++;
      st.answer(q.id, good, 5);
    }
    const levels: Record<string, number> = {};
    for (const c of sel)
      for (const ch of c.chapters) {
        const k = `${c.module.id}/${ch.id}`;
        const m = chapterMastery(c, ch.id, st) / 100;
        levels[k] = per[k] ? 0.6 * (per[k].ok / per[k].total) + 0.4 * m : m;
      }
    onPlan(createPlan(mods, new Date(exam).getTime(), chapterInfos(sel), levels));
  };

  if (diag) {
    const q = diag[i];
    return (
      <div className="space-y-3" data-testid="r24-diagnostic">
        <h2 className="h2">
          {t('r24.diagnostic')} · {i + 1}/{diag.length}
        </h2>
        <Bar value={((i + 1) / diag.length) * 100} />
        <QuestionCard key={q.id} q={q} examMode initialResponse={resp[q.id]} onChange={(r) => setResp((x) => ({ ...x, [q.id]: r }))} />
        <div className="flex gap-2">
          {i < diag.length - 1 ? (
            <button className="btn-primary flex-1" onClick={() => setI(i + 1)} data-testid="diag-next">
              {t('common.next')} <Icon name="right" size={16} />
            </button>
          ) : (
            <button className="btn-primary flex-1" onClick={finish} data-testid="diag-finish">
              <Icon name="check" size={16} /> {t('r24.genPlan')}
            </button>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="card space-y-4 p-5" data-testid="r24-setup">
      <p>{t('r24.intro')}</p>
      <fieldset>
        <legend className="mb-2 text-sm font-semibold">{t('r24.modules')}</legend>
        <div className="flex flex-wrap gap-2">
          {MODULES.map((m) => (
            <label key={m.id} className={`chip cursor-pointer !px-3 !py-2 !text-sm ${mods.includes(m.id) ? '!border-accent !text-fg' : ''}`}>
              <input type="checkbox" className="accent-[rgb(var(--accent))]" checked={mods.includes(m.id)} onChange={(e) => setMods(e.target.checked ? [...mods, m.id] : mods.filter((x) => x !== m.id))} />
              {tl(m.title)}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="block text-sm">
        <span className="mb-1 block font-semibold">{t('r24.examTime')}</span>
        <input type="datetime-local" className="input" value={exam} onChange={(e) => setExam(e.target.value)} data-testid="r24-exam-time" />
      </label>
      {err && <p className="text-sm text-bad">{err}</p>}
      <button className="btn-primary w-full" disabled={!mods.length} onClick={startDiag} data-testid="r24-start">
        <Icon name="play" size={16} /> {t('r24.startDiag')}
      </button>
    </div>
  );
}

// ---------------- running plan ----------------
function blockLabel(b: Block, t: ReturnType<typeof useT>['t']): string {
  switch (b.kind) {
    case 'sleep':
      return t('r24.sleep');
    case 'meal':
      return t('r24.meal');
    case 'break':
      return t('r24.break');
    case 'longBreak':
      return t('r24.longBreak');
    case 'checkpoint':
      return t('r24.checkpoint');
    case 'review':
      return t('r24.review');
    case 'final':
      return t('r24.final');
    default:
      return t('r24.study');
  }
}
const KIND_ICON: Record<Block['kind'], string> = { study: 'book', break: 'coffee', longBreak: 'coffee', sleep: 'bed', meal: 'food', checkpoint: 'flag', review: 'cards', final: 'target' };

function GoalText({ g, contents }: { g: Goal; contents: ModuleContent[] }) {
  const { t } = useT();
  const tl = useL();
  const c = contents.find((x) => x.module.id === g.module);
  const ch = c?.chapters.find((x) => x.id === g.chapter);
  if (!c || !ch) return null;
  const heads = ch.sections.filter((s) => s.type === 'heading');
  const h = heads[g.part % Math.max(1, heads.length)];
  return (
    <span>
      {t('r24.study')} : <strong>{tl(ch.title)}</strong>
      {h && h.type === 'heading' && <> — {tl(h.body)}</>} (10 {t('common.minutes')}) → {g.qcm} {t('r24.quiz')}
      {g.extra && <> → 1 {g.extra === 'mission' ? t('r24.mission') : t('r24.exercise')}</>}
    </span>
  );
}

function Pomodoro({ block }: { block: Block }) {
  const { t } = useT();
  const [end, setEnd] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const [sound, setSound] = useState(true);
  const fired = useRef(false);
  useEffect(() => {
    if (!end) return;
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, [end]);
  useEffect(() => {
    if (end && now >= end && !fired.current) {
      fired.current = true;
      if (sound) softBeep();
      if ('Notification' in window && Notification.permission === 'granted') new Notification('Rev24', { body: '⏰ Pomodoro !' });
    }
  }, [now, end, sound]);
  const len = block.end - block.start;
  const left = end ? Math.max(0, end - now) : len;
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="font-mono text-2xl font-bold tabular-nums" aria-label={t('r24.timer')}>
        {dur(left)}
      </span>
      {!end ? (
        <button
          className="btn-ghost btn-sm"
          onClick={() => {
            fired.current = false;
            setEnd(Date.now() + len);
            setNow(Date.now());
          }}
        >
          <Icon name="play" size={14} /> {t('r24.startPomodoro')}
        </button>
      ) : (
        <button className="btn-ghost btn-sm" onClick={() => setEnd(null)}>
          <Icon name="reset" size={14} />
        </button>
      )}
      <label className="flex items-center gap-1 text-xs text-muted">
        <input type="checkbox" checked={sound} onChange={(e) => setSound(e.target.checked)} /> {t('r24.sound')}
      </label>
    </div>
  );
}

function CurrentBlock({ plan, b, contents, onUpdate }: { plan: Rev24Plan; b: Block; contents: ModuleContent[]; onUpdate: (p: Rev24Plan) => void }) {
  const { t } = useT();
  const tl = useL();
  const finishRev24 = useStore((s) => s.finishRev24);
  const [active, setActive] = useState<null | 'checkpoint' | 'final'>(null);
  const reduce = useReducedMotion();
  const sel = contents.filter((c) => plan.modules.includes(c.module.id));
  const done = (score?: { ok: number; total: number }) => onUpdate(markDone(plan, b.id, score));

  if (active === 'checkpoint') {
    const studied = plan.blocks.filter((x) => x.kind === 'study' && x.done && x.goal).map((x) => `${x.goal!.module}/${x.goal!.chapter}`);
    const pool = sel.flatMap((c) => c.questions).filter((q) => !studied.length || studied.includes(`${q.module}/${q.chapter}`));
    const qs = pickWeighted(pool.length >= 10 ? pool : sel.flatMap((c) => c.questions), {}, 10);
    return (
      <div className="space-y-2">
        <h3 className="font-semibold">{t('r24.checkpoint')}</h3>
        <QuizRunner
          questions={qs}
          onFinish={(ok, total, wrongIds) => {
            const inject: Goal[] = [...new Set(qs.filter((q) => wrongIds.includes(q.id)).map((q) => `${q.module}/${q.chapter}`))].map((k) => {
              const [module, chapter] = k.split('/');
              return { module, chapter, part: 0, qcm: 8, extra: null };
            });
            const p = markDone(plan, b.id, { ok, total });
            onUpdate(inject.length ? replan(p, Date.now(), { inject }) : p);
            setActive(null);
          }}
        />
      </div>
    );
  }
  if (active === 'final') {
    const pool = sel.flatMap((c) => c.questions);
    const weights = Object.fromEntries(sel.flatMap((c) => Object.entries(c.module.weights)));
    const titles = Object.fromEntries(sel.flatMap((c) => c.chapters.map((ch) => [ch.id, ch.title])));
    return (
      <ExamRunner
        pool={pool}
        weights={weights}
        module={plan.modules.join('+')}
        titles={titles}
        onDone={(note, perChapter, wrong) => {
          const traps = wrong.slice(0, 10).map((q) => `${tl(q.prompt).replace(/\*\*|`/g, '').slice(0, 90)} → ${tl(q.explanation).replace(/\*\*|`/g, '').slice(0, 140)}`);
          const p = markDone({ ...plan, report: { note, perChapter, traps } }, b.id, { ok: Math.round((note / 20) * 30), total: 30 });
          onUpdate(p);
        }}
      />
    );
  }

  const isNow = b.start <= Date.now();
  const g = b.goal;
  const c = g ? contents.find((x) => x.module.id === g.module) : undefined;
  const ch = c?.chapters.find((x) => x.id === g?.chapter);
  const n = g ? remainingSessions(plan, g.module, g.chapter) : 0;
  return (
    <motion.div layout initial={reduce ? false : { scale: 0.97, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card border-accent p-4 shadow-lg" data-testid="r24-current">
      <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wide text-accent">
        <Icon name={KIND_ICON[b.kind]} size={14} /> {isNow ? t('r24.current') : t('r24.upcoming')} · {hm(b.start)}–{hm(b.end)}
      </div>
      <div className="text-lg font-semibold">{b.kind === 'study' && g ? <GoalText g={g} contents={contents} /> : blockLabel(b, t)}</div>
      {b.kind === 'sleep' && <p className="mt-2 text-sm text-muted">{t('r24.sleep.why')}</p>}
      {b.kind === 'review' && <p className="mt-2 text-sm text-muted">{t('r24.lastHours')}</p>}
      {g && n > 1 && <p className="mt-2 text-sm">{t('r24.motivation', { n })}</p>}
      {(b.kind === 'study' || b.kind === 'checkpoint' || b.kind === 'review') && (
        <div className="mt-3">
          <Pomodoro block={b} />
        </div>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        {b.kind === 'study' && g && ch && (
          <>
            <Link to={`/m/${g.module}/c/${g.chapter}`} className="btn-ghost btn-sm">
              <Icon name="book" size={14} /> {t('nav.course')}
            </Link>
            <Link to={`/m/${g.module}/qcm?chapter=${g.chapter}`} className="btn-ghost btn-sm">
              <Icon name="quiz" size={14} /> {g.qcm} {t('r24.quiz')}
            </Link>
            {g.extra === 'mission' && (
              <Link to={`/terminal`} className="btn-ghost btn-sm">
                <Icon name="terminal" size={14} /> {t('r24.mission')}
              </Link>
            )}
            {g.extra === 'exercise' && (
              <Link to={`/m/${g.module}/exercices`} className="btn-ghost btn-sm">
                <Icon name="dumbbell" size={14} /> {t('r24.exercise')}
              </Link>
            )}
          </>
        )}
        {b.kind === 'review' &&
          plan.modules.map((m) => (
            <span key={m} className="flex gap-2">
              <Link to={`/m/${m}/fiche`} className="btn-ghost btn-sm">
                <Icon name="print" size={14} /> {t('nav.sheet')} {m}
              </Link>
              <Link to={`/m/${m}/flashcards`} className="btn-ghost btn-sm">
                <Icon name="cards" size={14} /> {t('nav.flashcards')}
              </Link>
            </span>
          ))}
        {b.kind === 'checkpoint' && (
          <button className="btn-primary btn-sm" onClick={() => setActive('checkpoint')}>
            <Icon name="flag" size={14} /> {t('r24.go')}
          </button>
        )}
        {b.kind === 'final' && (
          <button className="btn-primary btn-sm" onClick={() => setActive('final')}>
            <Icon name="target" size={14} /> {t('r24.go')}
          </button>
        )}
      </div>
      <div className="mt-4 flex gap-2">
        {b.kind !== 'final' && b.kind !== 'checkpoint' && (
          <button
            className="btn-primary flex-1"
            onClick={() => {
              done();
              const remaining = plan.blocks.filter((x) => !x.done && x.id !== b.id && x.kind !== 'sleep' && x.kind !== 'meal');
              if (!remaining.length) {
                finishRev24();
                confetti();
              }
            }}
            data-testid="r24-done"
          >
            <Icon name="check" size={16} /> {t('r24.done')}
          </button>
        )}
        {!b.fixed && b.kind !== 'checkpoint' && (
          <button className="btn-ghost flex-1" onClick={() => onUpdate(replan(plan, Math.max(Date.now(), b.start), { extraMinutes: 15 }))} data-testid="r24-more">
            <Icon name="clock" size={16} /> {t('r24.more')}
          </button>
        )}
      </div>
    </motion.div>
  );
}

function Report({ plan, contents }: { plan: Rev24Plan; contents: ModuleContent[] }) {
  const { t } = useT();
  const tl = useL();
  const r = plan.report!;
  const title = (id: string) => {
    for (const c of contents) {
      const ch = c.chapters.find((x) => x.id === id);
      if (ch) return tl(ch.title);
    }
    return id;
  };
  const trapsFromCourse = contents
    .filter((c) => plan.modules.includes(c.module.id))
    .flatMap((c) => c.chapters.flatMap((ch) => ch.sections.filter((s) => s.type === 'callout' && s.kind === 'trap').map((s) => (s.type === 'callout' ? { w: c.module.weights[ch.id] ?? 1, v: s.body } : null))))
    .filter(Boolean) as { w: number; v: { fr: string; dar: string; en: string } }[];
  const traps = [...r.traps, ...trapsFromCourse.sort((a, b) => b.w - a.w).map((x) => tl(x.v))].slice(0, 10);
  return (
    <section className="card space-y-4 p-5" data-testid="r24-report">
      <h2 className="h2">{t('r24.report')}</h2>
      <div className={`text-5xl font-extrabold ${r.note >= 10 ? 'text-ok' : 'text-bad'}`}>{String(r.note).replace('.', ',')}/20</div>
      <div>
        <h3 className="mb-2 font-semibold">{t('r24.heatmap')}</h3>
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
          {Object.entries(r.perChapter).map(([c, v]) => {
            const p = v.ok / v.total;
            return (
              <div key={c} className="rounded-lg p-2 text-xs" style={{ background: `rgb(var(--${p >= 0.7 ? 'ok' : p >= 0.4 ? 'warn' : 'bad'}) / 0.25)` }}>
                <div className="truncate font-semibold">{title(c)}</div>
                <div className="font-mono">
                  {v.ok}/{v.total}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <h3 className="mb-2 font-semibold">{t('r24.traps')}</h3>
        <ol className="list-decimal space-y-1 pl-5 text-sm">
          {traps.map((x, i) => (
            <li key={i}>
              <L v={x} inlineOnly />
            </li>
          ))}
        </ol>
      </div>
      <p className="text-sm">{t('r24.motivation0')}</p>
    </section>
  );
}

export default function Rev24Page() {
  const { t } = useT();
  const plan = useStore((s) => s.rev24);
  const setPlan = useStore((s) => s.setRev24);
  const contents = useAllModules(MODULES.map((m) => m.id));
  const [now, setNow] = useState(Date.now());
  const reduce = useReducedMotion();
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  if (!contents) return <Loading />;
  if (!plan)
    return (
      <div className="space-y-4">
        <PageTitle back="/" title={t('r24.title')} />
        <Setup contents={contents} onPlan={setPlan} />
      </div>
    );
  const cur = currentBlock(plan, now);
  const left = plan.exam - now;
  const visible = plan.blocks.filter((b) => b.end > now - 3 * 3600_000);
  return (
    <div className="space-y-4" data-testid="r24-plan">
      <PageTitle back="/" title={t('r24.title')} />
      <section className="rounded-3xl border border-line bg-gradient-to-br from-accent/20 to-accent2/10 p-5 text-center">
        <motion.div key={Math.floor(left / 60000)} initial={reduce ? false : { scale: 1.04, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} className="font-mono text-5xl font-extrabold tabular-nums sm:text-6xl" aria-live="off">
          {dur(left)}
        </motion.div>
        <div className="text-sm text-muted">{t('r24.countdown')}</div>
      </section>
      {plan.report && <Report plan={plan} contents={contents} />}
      <AnimatePresence mode="wait">{cur && !plan.report && <CurrentBlock key={cur.id} plan={plan} b={cur} contents={contents} onUpdate={setPlan} />}</AnimatePresence>
      <section>
        <h2 className="h2 mb-2">{t('r24.plan')}</h2>
        <ol className="relative space-y-1 border-l-2 border-line pl-4">
          {visible.map((b) => {
            const isCur = cur?.id === b.id;
            return (
              <li key={b.id} className={`relative rounded-lg px-2 py-1.5 text-sm ${isCur ? 'bg-accent/15' : ''} ${b.done ? 'opacity-50' : ''}`} data-kind={b.kind}>
                <span className={`absolute -left-[23px] top-2.5 h-3 w-3 rounded-full border-2 border-bg ${b.done ? 'bg-ok' : isCur ? 'bg-accent' : b.kind === 'sleep' ? 'bg-accent2' : 'bg-line'}`} />
                <span className="font-mono text-xs text-muted">{hm(b.start)}</span>{' '}
                <Icon name={KIND_ICON[b.kind]} size={14} className="inline align-[-2px]" /> {b.kind === 'study' && b.goal ? <GoalText g={b.goal} contents={contents} /> : blockLabel(b, t)}
                {b.kind === 'sleep' && <Icon name="lock" size={12} className="ml-1 inline text-muted" />}
                {b.score && (
                  <span className="ml-1 font-mono text-xs">
                    ({b.score.ok}/{b.score.total})
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </section>
      <div className="flex flex-wrap gap-2">
        {'Notification' in window && Notification.permission === 'default' && (
          <button className="btn-ghost btn-sm" onClick={() => Notification.requestPermission()}>
            <Icon name="bell" size={14} /> {t('r24.notify')}
          </button>
        )}
        <button className="btn-ghost btn-sm text-bad" onClick={() => window.confirm(t('r24.abandonConfirm')) && setPlan(null)} data-testid="r24-abandon">
          <Icon name="trash" size={14} /> {t('r24.abandon')}
        </button>
      </div>
    </div>
  );
}
