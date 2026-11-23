import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useModuleContent } from '../hooks/useModule';
import { Loading, PageTitle, useModuleParam } from '../components/Layout';
import { useStore } from '../store/store';
import { useT, useL } from '../hooks/useT';
import { pickWeighted, gradeExam, checkAnswer, xpFor, type Response } from '../lib/quiz';
import { QuestionCard, Feedback } from '../components/QuestionCard';
import { L } from '../components/Text';
import { Icon } from '../components/Icon';
import { Bar } from '../components/Ring';
import { confetti } from '../components/confetti';
import type { Question, L10n, Module, Exercise } from '../lib/schema';
import { L as Txt, Code, Tex } from '../components/Text';
import { chapterMastery } from '../lib/mastery';
import type { ModuleContent } from '../lib/content';

/** French-style honours from a grade /20. */
export function mentionKey(note: number) {
  return note >= 16 ? 'exam.mention.tb' : note >= 14 ? 'exam.mention.b' : note >= 12 ? 'exam.mention.ab' : note >= 10 ? 'exam.mention.p' : 'exam.mention.i';
}

/** Big circular gauge for the grade. */
function NoteRing({ note }: { note: number }) {
  const pct = note / 20;
  const c = 2 * Math.PI * 52;
  const col = note >= 14 ? 'var(--ok)' : note >= 10 ? 'var(--warn)' : 'var(--bad)';
  return (
    <svg viewBox="0 0 120 120" className="h-40 w-40">
      <circle cx={60} cy={60} r={52} fill="none" stroke="rgb(var(--surface2))" strokeWidth={10} />
      {pct > 0 && <circle cx={60} cy={60} r={52} fill="none" stroke={`rgb(${col})`} strokeWidth={10} strokeLinecap="round" strokeDasharray={`${c * pct} ${c}`} transform="rotate(-90 60 60)" style={{ transition: 'stroke-dasharray 1s ease' }} />}
      <text x={60} y={60} textAnchor="middle" fontSize="26" fontWeight={900} fill="rgb(var(--fg))">
        {String(note).replace('.', ',')}
      </text>
      <text x={60} y={80} textAnchor="middle" fontSize="12" fill="rgb(var(--muted))">
        /20
      </text>
    </svg>
  );
}

/** Sparkline of the last grades of a module. */
function NotesLine({ notes }: { notes: number[] }) {
  if (notes.length < 2) return null;
  const w = 260;
  const h = 70;
  const pts = notes.map((n, i) => [10 + (i * (w - 20)) / (notes.length - 1), h - 8 - (n / 20) * (h - 16)] as const);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-[320px]">
      <line x1={10} x2={w - 10} y1={h - 8 - (10 / 20) * (h - 16)} y2={h - 8 - (10 / 20) * (h - 16)} stroke="rgb(var(--line))" strokeDasharray="3 3" />
      <polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke="rgb(var(--accent))" strokeWidth={2.5} strokeLinejoin="round" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === pts.length - 1 ? 4.5 : 3} fill={i === pts.length - 1 ? 'rgb(var(--accent))' : 'rgb(var(--surface))'} stroke="rgb(var(--accent))" strokeWidth={1.5} />
      ))}
    </svg>
  );
}

export const EXAM_SIZE = 30;
export const EXAM_MINUTES = 45;

export function ExamRunner({ pool, weights, module, onDone, onRetry, onAgain, size = EXAM_SIZE, minutes = EXAM_MINUTES, titles = {} }: { pool: Question[]; weights: Record<string, number>; module: string; titles?: Record<string, L10n>; onDone?: (note: number, perChapter: Record<string, { ok: number; total: number }>, wrong: Question[]) => void; onRetry?: (wrong: Question[]) => void; onAgain?: () => void; size?: number; minutes?: number }) {
  const { t } = useT();
  const tl = useL();
  const st = useStore();
  const [qs] = useState(() => pickWeighted(pool, weights, Math.min(size, pool.length)));
  const [resp, setResp] = useState<Record<string, Response | undefined>>({});
  const [i, setI] = useState(0);
  const [end] = useState(() => Date.now() + minutes * 60_000);
  const [now, setNow] = useState(Date.now());
  const [result, setResult] = useState<ReturnType<typeof gradeExam> | null>(null);
  useEffect(() => {
    if (result) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [result]);
  const submit = () => {
    const g = gradeExam(qs, resp);
    for (const q of qs) {
      const r = resp[q.id];
      st.answer(q.id, r !== undefined && checkAnswer(q, r), xpFor(q));
    }
    st.addExam({ module, date: Date.now(), note: g.note, ok: g.ok, total: g.total, perChapter: g.perChapter });
    if (g.note >= 12) confetti();
    setResult(g);
    onDone?.(g.note, g.perChapter, qs.filter((q) => !(resp[q.id] !== undefined && checkAnswer(q, resp[q.id]!))));
  };
  const left = Math.max(0, end - now);
  useEffect(() => {
    if (!result && left === 0) submit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left]);
  const chapters = useMemo(() => [...new Set(qs.map((q) => q.chapter))], [qs]);

  if (result) {
    const wrong = qs.filter((q) => !(resp[q.id] !== undefined && checkAnswer(q, resp[q.id]!)));
    const tagStats = new Map<string, { wrong: number; total: number }>();
    for (const q of qs)
      for (const tag of q.tags.filter((x) => x !== 'annale')) {
        const e = tagStats.get(tag) ?? { wrong: 0, total: 0 };
        e.total++;
        if (wrong.includes(q)) e.wrong++;
        tagStats.set(tag, e);
      }
    const weak = [...tagStats.entries()].filter(([, v]) => v.wrong > 0).sort((a, b) => b[1].wrong / b[1].total - a[1].wrong / a[1].total || b[1].wrong - a[1].wrong).slice(0, 8);
    const notes = st.exams.filter((e) => e.module === module).slice(-10).map((e) => e.note);
    return (
      <div className="space-y-4" data-testid="exam-result">
        <div className="card grid items-center gap-6 p-6 sm:grid-cols-[auto_minmax(0,1fr)]">
          <div className="mx-auto">
            <NoteRing note={result.note} />
          </div>
          <div className="space-y-3 text-center sm:text-left">
            <div>
              <div className="text-sm text-muted">{t('exam.note')}</div>
              <div className={`font-display text-3xl font-black ${result.note >= 10 ? 'text-ok' : 'text-bad'}`}>{t(mentionKey(result.note))}</div>
              <div className="text-sm text-muted">
                {result.ok}/{result.total}
              </div>
            </div>
            {notes.length > 1 && (
              <div>
                <div className="mb-1 text-xs font-bold uppercase tracking-wide text-muted">{t('exam.progress')}</div>
                <NotesLine notes={notes} />
              </div>
            )}
            <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
              {wrong.length > 0 && onRetry && (
                <button className="btn-primary" onClick={() => onRetry(wrong)} data-testid="exam-retry">
                  <Icon name="reset" size={16} /> {t('exam.retry')} ({wrong.length})
                </button>
              )}
              {onAgain && (
                <button className="btn-ghost" onClick={onAgain}>
                  <Icon name="play" size={16} /> {t('exam.again')}
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="card p-4">
          <h2 className="mb-2 font-semibold">{t('exam.weak')}</h2>
          {weak.length === 0 ? (
            <p className="text-sm text-ok">{t('exam.weakNone')}</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {weak.map(([tag, v]) => (
                <span key={tag} className="inline-flex items-center gap-2 rounded-lg border border-bad/30 bg-bad/5 px-2.5 py-1 text-sm">
                  <span className="font-mono font-semibold">{tag}</span>
                  <span className="font-mono text-xs text-bad">
                    {v.wrong}/{v.total}
                  </span>
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="card p-4">
          <h2 className="mb-2 font-semibold">{t('exam.heatmap')}</h2>
          <ul className="space-y-2">
            {chapters.map((c) => {
              const v = result.perChapter[c];
              const pct = (v.ok / v.total) * 100;
              return (
                <li key={c} className="grid grid-cols-[1fr_auto] items-center gap-2 text-sm">
                  <span className="truncate">{titles[c] ? tl(titles[c]) : c}</span>
                  <span className="font-mono text-xs">
                    {v.ok}/{v.total}
                  </span>
                  <div className="col-span-2 h-2 rounded-full" style={{ background: `linear-gradient(90deg, rgb(var(--${pct >= 60 ? 'ok' : pct >= 40 ? 'warn' : 'bad'})) ${pct}%, rgb(var(--surface2)) ${pct}%)` }} />
                </li>
              );
            })}
          </ul>
          {result.toReview.length > 0 && (
            <p className="mt-3 text-sm">
              <strong>{t('exam.review')} :</strong> {result.toReview.map((c) => (
                <Link key={c} to={`/m/${module}/c/${c}`} className="chip mr-1 !text-xs hover:text-fg">
                  {titles[c] ? tl(titles[c]) : c}
                </Link>
              ))}
            </p>
          )}
        </div>
        <h2 className="h2">{t('exam.correction')}</h2>
        <ol className="space-y-3">
          {qs.map((q, k) => {
            const r = resp[q.id];
            const good = r !== undefined && checkAnswer(q, r);
            return (
              <li key={q.id} className={`card p-4 ${good ? 'border-ok/60' : 'border-bad/60'}`}>
                <div className="mb-1 text-xs text-muted">
                  {k + 1}.
                </div>
                <L v={q.prompt} md />
                <div className="mt-1 text-sm">
                  <span className="text-muted">{t('qcm.yourAnswer')} : </span>
                  {r === undefined ? t('exam.noAnswer') : Array.isArray(r) ? r.map((x) => tl(q.options?.find((o) => o.id === x)?.text) || x).join(' · ') : q.options ? tl(q.options.find((o) => o.id === r)?.text) : String(r)}
                </div>
                <Feedback q={q} ok={good} response={r ?? ''} />
              </li>
            );
          })}
        </ol>
      </div>
    );
  }

  const q = qs[i];
  const mm = Math.floor(left / 60000);
  const ss = Math.floor((left % 60000) / 1000);
  const answered = Object.values(resp).filter((x) => x !== undefined).length;
  return (
    <div className="space-y-3" data-testid="exam-running">
      <div className="sticky top-[72px] lg:top-[88px] z-10 -mx-4 flex items-center gap-3 bg-bg/90 px-4 py-2 backdrop-blur">
        <span className={`font-mono text-lg font-bold tabular-nums ${left < 5 * 60000 ? 'text-bad' : ''}`} aria-label={t('exam.timeLeft')}>
          {String(mm).padStart(2, '0')}:{String(ss).padStart(2, '0')}
        </span>
        <Bar value={(answered / qs.length) * 100} />
        <span className="shrink-0 text-xs text-muted">
          {answered}/{qs.length} {t('exam.answered')}
        </span>
      </div>
      <QuestionCard key={q.id} q={q} examMode initialResponse={resp[q.id]} onChange={(r) => setResp((x) => ({ ...x, [q.id]: r }))} index={i} total={qs.length} />
      <div className="flex gap-2">
        <button className="btn-ghost flex-1" disabled={i === 0} onClick={() => setI(i - 1)}>
          <Icon name="left" size={16} /> {t('common.prev')}
        </button>
        {i < qs.length - 1 ? (
          <button className="btn-primary flex-1" onClick={() => setI(i + 1)} data-testid="exam-next">
            {t('common.next')} <Icon name="right" size={16} />
          </button>
        ) : (
          <button className="btn-primary flex-1" onClick={() => window.confirm(t('exam.confirm')) && submit()} data-testid="exam-submit">
            <Icon name="flag" size={16} /> {t('exam.submit')}
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-1">
        {qs.map((x, k) => (
          <button key={x.id} onClick={() => setI(k)} className={`h-8 w-8 rounded-lg text-xs font-mono ${k === i ? 'bg-accent text-bg' : resp[x.id] !== undefined ? 'bg-accent/20' : 'bg-surface2 text-muted'}`} aria-label={`${k + 1}`}>
            {k + 1}
          </button>
        ))}
      </div>
      <button className="btn-ghost btn-sm" onClick={() => window.confirm(t('exam.confirm')) && submit()}>
        {t('exam.submit')}
      </button>
    </div>
  );
}

export default function ExamPage() {
  const id = useModuleParam();
  const { data } = useModuleContent(id);
  const { t } = useT();
  const st = useStore();
  const exams = st.exams.filter((e) => e.module === id);
  const [run, setRun] = useState<{ key: number; pool: Question[]; size: number; minutes: number; weights?: Record<string, number> } | null>(null);
  const [annale, setAnnale] = useState<string | null>(null);
  if (!data) return <Loading />;
  const an = data.module.annales.find((a) => a.id === annale);
  if (an) return <AnnaleRunner key={an.id} annale={an} exercises={data.exercises} module={id} />;
  const titles = Object.fromEntries(data.chapters.map((c) => [c.id, c.title]));
  const normal = () => setRun({ key: Date.now(), pool: data.questions, size: EXAM_SIZE, minutes: EXAM_MINUTES });
  const boss = () => {
    // weak chapters weigh up to 3× more; only medium and hard questions
    const weights = Object.fromEntries(data.chapters.map((c) => [c.id, (data.module.weights[c.id] ?? 1) * (1 + (100 - chapterMastery(data as ModuleContent, c.id, st)) / 50)]));
    const pool = data.questions.filter((q) => q.difficulty >= 2);
    setRun({ key: Date.now(), pool: pool.length >= 10 ? pool : data.questions, size: 20, minutes: 25, weights });
  };
  if (run)
    return (
      <ExamRunner
        key={run.key}
        pool={run.pool}
        weights={run.weights ?? data.module.weights}
        module={id}
        size={run.size}
        minutes={run.minutes}
        titles={titles}
        onRetry={(wrong) => setRun({ key: Date.now(), pool: wrong, size: wrong.length, minutes: Math.max(5, Math.ceil(wrong.length * 1.5)), weights: run.weights })}
        onAgain={() => setRun(null)}
      />
    );
  return (
    <div className="space-y-4">
      <PageTitle title={t('exam.title')} sub={<L v={data.module.title} />} />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card flex flex-col gap-3 p-5">
          <h2 className="flex items-center gap-2 font-semibold">
            <Icon name="target" size={18} className="text-accent" /> {t('exam.title')}
          </h2>
          <p className="flex-1 text-sm">{t('exam.rules')}</p>
          <button className="btn-primary w-full" onClick={normal} data-testid="exam-start">
            <Icon name="play" size={16} /> {t('exam.start')}
          </button>
        </div>
        <div className="relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-line bg-[linear-gradient(135deg,rgb(var(--navy)),#3b0d18)] p-5 text-white shadow-sm" data-testid="boss-card">
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
          <h2 className="flex items-center gap-2 font-semibold">
            <Icon name="flame" size={18} className="text-[#ff9f6e]" /> {t('boss.title')}
          </h2>
          <p className="flex-1 text-sm text-white/85">{t('boss.rules')}</p>
          <button className="w-full rounded-xl bg-white px-4 py-2.5 font-bold text-[#3b0d18] transition hover:bg-white/90" onClick={boss} data-testid="boss-start">
            <Icon name="bolt" size={16} className="mr-1 inline" /> {t('boss.start')}
          </button>
        </div>
      </div>
      {data.module.annales.map((a) => (
        <div key={a.id} className="card space-y-2 p-5" data-testid={`annale-${a.id}`}>
          <h2 className="font-semibold">
            <L v={a.title} /> · {a.minutes} {t('common.minutes')}
          </h2>
          <L v={a.intro} md className="text-sm text-muted" />
          <button className="btn-primary w-full" onClick={() => setAnnale(a.id)}>
            <Icon name="flag" size={16} /> {t('exam.start')}
          </button>
        </div>
      ))}
      {exams.length > 0 && (
        <div className="card p-4">
          <h2 className="mb-2 font-semibold">{t('exam.history')}</h2>
          <NotesLine notes={exams.slice(-10).map((e) => e.note)} />
          <ul className="mt-2 space-y-1 text-sm">
            {[...exams].reverse().slice(0, 10).map((e) => (
              <li key={e.date} className="flex justify-between">
                <span className="text-muted">{new Date(e.date).toLocaleString()}</span>
                <span className="font-mono font-bold">
                  {String(e.note).replace('.', ',')}/20 · {t(mentionKey(e.note))}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/** Timed past exam paper: statements only, then the full correction and self-grading /20. */
function AnnaleRunner({ annale, exercises, module }: { annale: Module['annales'][number]; exercises: Exercise[]; module: string }) {
  const { t } = useT();
  const addExam = useStore((s) => s.addExam);
  const [end] = useState(() => Date.now() + annale.minutes * 60_000);
  const [now, setNow] = useState(Date.now());
  const [done, setDone] = useState(false);
  const [score, setScore] = useState<Record<string, number>>({});
  useEffect(() => {
    if (done) return;
    const iv = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(iv);
  }, [done]);
  const left = Math.max(0, end - now);
  useEffect(() => {
    if (left === 0) setDone(true);
  }, [left]);
  const parts = annale.parts.map((p) => ({ ...p, ex: exercises.find((e) => e.id === p.exerciseId)! })).filter((p) => p.ex);
  const groups = [...new Set(parts.map((p) => p.group).filter(Boolean))];
  const max = parts.filter((p) => !p.group || p.group === groups[0]).reduce((a, p) => a + p.points, 0);
  const total = Object.values(score).reduce((a, b) => a + b, 0);
  return (
    <div className="space-y-4" data-testid="annale-running">
      <PageTitle title={<Txt v={annale.title} />} />
      <div className="sticky top-[72px] lg:top-[88px] z-10 -mx-4 flex items-center gap-3 bg-bg/90 px-4 py-2 backdrop-blur">
        <span className="font-mono text-lg font-bold tabular-nums">
          {String(Math.floor(left / 60000)).padStart(2, '0')}:{String(Math.floor((left % 60000) / 1000)).padStart(2, '0')}
        </span>
        {!done ? (
          <button className="btn-primary btn-sm ml-auto" onClick={() => window.confirm(t('exam.confirm')) && setDone(true)}>
            {t('exam.submit')}
          </button>
        ) : (
          <span className="ml-auto font-bold">
            {t('exam.note')} : {Math.round((total / max) * 20 * 4) / 4}/20
          </span>
        )}
      </div>
      <Txt v={annale.intro} md className="text-sm text-muted" />
      {parts.map((p, i) => (
        <section key={p.exerciseId} className="card space-y-3 p-4">
          <h2 className="font-semibold">
            {i + 1}. <Txt v={p.ex.title} /> {p.group && <span className="chip">{p.group}</span>} <span className="text-xs text-muted">({p.points} pts)</span>
          </h2>
          <Txt v={p.ex.statement} md />
          {p.ex.data && <Code code={p.ex.data} lang="text" />}
          {done && (
            <div className="space-y-2 border-t border-line pt-3">
              {p.ex.solutionSteps.map((s, k) => (
                <div key={k}>
                  <div className="font-semibold">
                    <Txt v={s.title} />
                  </div>
                  <Txt v={s.body} md />
                  {s.code && <Code code={s.code} />}
                  {s.tex && <Tex tex={s.tex} block />}
                </div>
              ))}
              <div className="rounded-xl border border-ok/50 bg-ok/10 p-2">
                <Txt v={p.ex.finalAnswer} md />
              </div>
              <label className="flex items-center gap-2 text-sm">
                {t('common.score')} :
                <input type="range" min={0} max={p.points} step={0.5} value={score[p.exerciseId] ?? 0} onChange={(e) => setScore({ ...score, [p.exerciseId]: +e.target.value })} />
                <span className="font-mono">
                  {score[p.exerciseId] ?? 0}/{p.points}
                </span>
              </label>
            </div>
          )}
        </section>
      ))}
      {done && (
        <button className="btn-primary w-full" onClick={() => addExam({ module, date: Date.now(), note: Math.round((total / max) * 20 * 4) / 4, ok: total, total: max, perChapter: {} })}>
          <Icon name="check" size={16} /> {t('common.validate')}
        </button>
      )}
    </div>
  );
}
