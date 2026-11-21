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

export const EXAM_SIZE = 30;
export const EXAM_MINUTES = 45;

export function ExamRunner({ pool, weights, module, onDone, size = EXAM_SIZE, minutes = EXAM_MINUTES, titles = {} }: { pool: Question[]; weights: Record<string, number>; module: string; titles?: Record<string, L10n>; onDone?: (note: number, perChapter: Record<string, { ok: number; total: number }>, wrong: Question[]) => void; size?: number; minutes?: number }) {
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

  if (result)
    return (
      <div className="space-y-4" data-testid="exam-result">
        <div className="card p-6 text-center">
          <div className="text-sm text-muted">{t('exam.note')}</div>
          <div className={`text-5xl font-extrabold tabular-nums ${result.note >= 10 ? 'text-ok' : 'text-bad'}`}>{String(result.note).replace('.', ',')}/20</div>
          <div className="mt-1 text-sm text-muted">
            {result.ok}/{result.total}
          </div>
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
  const allExams = useStore((s) => s.exams);
  const exams = allExams.filter((e) => e.module === id);
  const [started, setStarted] = useState(0);
  const [annale, setAnnale] = useState<string | null>(null);
  if (!data) return <Loading />;
  const an = data.module.annales.find((a) => a.id === annale);
  if (an) return <AnnaleRunner key={an.id} annale={an} exercises={data.exercises} module={id} />;
  if (started) return <ExamRunner key={started} pool={data.questions} weights={data.module.weights} module={id} titles={Object.fromEntries(data.chapters.map((c) => [c.id, c.title]))} />;
  return (
    <div className="space-y-4">
      <PageTitle title={t('exam.title')} sub={<L v={data.module.title} />} />
      <div className="card space-y-3 p-5">
        <p>{t('exam.rules')}</p>
        <button className="btn-primary w-full" onClick={() => setStarted(Date.now())} data-testid="exam-start">
          <Icon name="play" size={16} /> {t('exam.start')}
        </button>
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
          <ul className="space-y-1 text-sm">
            {[...exams].reverse().slice(0, 10).map((e) => (
              <li key={e.date} className="flex justify-between">
                <span className="text-muted">{new Date(e.date).toLocaleString()}</span>
                <span className="font-mono font-bold">{String(e.note).replace('.', ',')}/20</span>
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
