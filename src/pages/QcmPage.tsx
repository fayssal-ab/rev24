import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useModuleContent } from '../hooks/useModule';
import { Loading, PageTitle, useModuleParam } from '../components/Layout';
import { useStore } from '../store/store';
import { useT, useL } from '../hooks/useT';
import { QuizRunner } from '../components/QuizRunner';
import { shuffle } from '../lib/quiz';
import { Icon } from '../components/Icon';

export default function QcmPage() {
  const id = useModuleParam();
  const { data } = useModuleContent(id);
  const { t } = useT();
  const tl = useL();
  const [params] = useSearchParams();
  const qstats = useStore((s) => s.qstats);
  const [chapter, setChapter] = useState(params.get('chapter') ?? 'all');
  const [diff, setDiff] = useState<'all' | '1' | '2' | '3'>('all');
  const [mistakes, setMistakes] = useState(params.get('mode') === 'mistakes');
  const [count, setCount] = useState(10);
  const [run, setRun] = useState<{ key: number; qs: ReturnType<typeof shuffle<NonNullable<typeof data>['questions'][0]>> } | null>(null);
  const tag = params.get('tag');
  const pool = useMemo(() => {
    if (!data) return [];
    return data.questions.filter(
      (q) =>
        (chapter === 'all' || q.chapter === chapter) &&
        (diff === 'all' || String(q.difficulty) === diff) &&
        (!tag || q.tags.includes(tag)) &&
        (!mistakes || qstats[q.id]?.inMistakes)
    );
  }, [data, chapter, diff, mistakes, qstats, tag]);
  if (!data) return <Loading />;
  const mistakesCount = data.questions.filter((q) => qstats[q.id]?.inMistakes).length;

  if (run)
    return (
      <div>
        <PageTitle title={mistakes ? t('qcm.mistakes') : t('qcm.title')} />
        <button className="btn-ghost btn-sm mb-3" onClick={() => setRun(null)}>
          <Icon name="left" size={14} /> {t('nav.back')}
        </button>
        <QuizRunner key={run.key} questions={run.qs} mistakesMode={mistakes} />
      </div>
    );

  return (
    <div className="space-y-4">
      <PageTitle title={t('qcm.title')} sub={`${data.questions.length} ${t('module.questions')}`} />
      <div className="card space-y-4 p-4">
        <div className="flex flex-wrap gap-2" role="tablist">
          <button role="tab" aria-selected={!mistakes} className={!mistakes ? 'btn-primary btn-sm' : 'btn-ghost btn-sm'} onClick={() => setMistakes(false)}>
            {t('common.all')}
          </button>
          <button role="tab" aria-selected={mistakes} className={mistakes ? 'btn-primary btn-sm' : 'btn-ghost btn-sm'} onClick={() => setMistakes(true)} data-testid="mistakes-tab">
            <Icon name="flag" size={14} /> {t('qcm.mistakes')} ({mistakesCount})
          </button>
        </div>
        {mistakes && <p className="text-xs text-muted">{t('qcm.mistakes.hint')}</p>}
        <label className="block text-sm">
          <span className="mb-1 block text-muted">{t('qcm.filterChapter')}</span>
          <select className="input" value={chapter} onChange={(e) => setChapter(e.target.value)} data-testid="chapter-filter">
            <option value="all">{t('common.all')}</option>
            {data.chapters.map((c) => (
              <option key={c.id} value={c.id}>
                {tl(c.title)}
              </option>
            ))}
          </select>
        </label>
        <div className="text-sm">
          <span className="mb-1 block text-muted">{t('common.difficulty')}</span>
          <div className="flex flex-wrap gap-2">
            {(['all', '1', '2', '3'] as const).map((d) => (
              <button key={d} className={diff === d ? 'btn-primary btn-sm' : 'btn-ghost btn-sm'} onClick={() => setDiff(d)}>
                {d === 'all' ? t('common.all') : d === '1' ? t('common.easy') : d === '2' ? t('common.medium') : t('common.hard')}
              </button>
            ))}
          </div>
        </div>
        {!mistakes && (
          <label className="block text-sm">
            <span className="mb-1 block text-muted">
              {t('qcm.count')} : {Math.min(count, pool.length)}
            </span>
            <input type="range" min={5} max={Math.max(5, Math.min(50, pool.length))} value={count} onChange={(e) => setCount(+e.target.value)} className="w-full accent-[rgb(var(--accent))]" />
          </label>
        )}
        {tag && <span className="chip">#{tag}</span>}
        <p className="text-xs text-muted">
          {pool.length} {t('qcm.available')}
        </p>
        {mistakes && !pool.length ? (
          <p className="text-sm text-ok">{t('qcm.mistakes.empty')}</p>
        ) : (
          <button className="btn-primary w-full" disabled={!pool.length} onClick={() => setRun({ key: Date.now(), qs: mistakes ? shuffle(pool) : shuffle(pool).slice(0, count) })} data-testid="start-qcm">
            <Icon name="play" size={16} /> {t('qcm.start')}
          </button>
        )}
      </div>
    </div>
  );
}
