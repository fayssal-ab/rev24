import { useEffect, useMemo, useRef, useState } from 'react';
import { plain, speak, stopSpeak } from '../lib/tts';
import { Link, useParams } from 'react-router-dom';
import { useModuleContent } from '../hooks/useModule';
import { Loading, useModuleParam } from '../components/Layout';
import { useStore } from '../store/store';
import { useT, useL } from '../hooks/useT';
import { SectionView } from '../components/Sections';
import { L } from '../components/Text';
import { Icon } from '../components/Icon';
import { confetti } from '../components/confetti';
import { chapterMastery } from '../lib/mastery';
import { Ring } from '../components/Ring';
import NotFound from './NotFound';

export default function ChapterPage() {
  const id = useModuleParam();
  const { chapter } = useParams();
  const { data } = useModuleContent(id);
  const { t } = useT();
  const tl = useL();
  const st = useStore();
  const setPos = useStore((s) => s.setChapterPos);
  const qmap = useMemo(() => Object.fromEntries((data?.questions ?? []).map((q) => [q.id, q])), [data]);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(0);
  const article = useRef<HTMLDivElement>(null);
  const key = `${id}/${chapter}`;
  // position saved before this visit (used for the "resume" banner)
  const [saved] = useState(() => useStore.getState().chapterPos[key]);
  const [dismissed, setDismissed] = useState(false);

  const c = data?.chapters.find((x) => x.id === chapter);

  // reading progress + current section, saved on the device
  useEffect(() => {
    if (!c) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = article.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const total = r.height - window.innerHeight * 0.6;
        const pct = Math.max(0, Math.min(100, Math.round((-r.top / Math.max(1, total)) * 100)));
        setProgress(pct);
        const secs = [...el.querySelectorAll<HTMLElement>('[data-section]')];
        let cur = 0;
        secs.forEach((s, i) => {
          if (s.getBoundingClientRect().top < window.innerHeight * 0.35) cur = i;
        });
        setActive(cur);
        if (pct > 2) setPos(key, cur, pct);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [c, key, setPos]);

  if (!data) return <Loading />;
  if (!c) return <NotFound />;
  const idx = data.chapters.indexOf(c);
  const next = data.chapters[idx + 1];
  const prev = data.chapters[idx - 1];
  const headings = c.sections.map((s, i) => ({ s, i })).filter((x) => x.s.type === 'heading');
  const activeHeading = [...headings].reverse().find((h) => h.i <= active)?.i;
  const related = data.exercises.filter((e) => e.chapter === c.id);
  const done = !!st.read[key];
  const goTo = (i: number) => document.getElementById(`s-${i}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const showResume = !dismissed && !done && saved && saved.section > 1 && progress < 5;

  return (
    <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_14rem] xl:gap-10">
      {/* reading progress */}
      <div className="fixed inset-x-0 top-14 z-30 h-0.5 bg-transparent">
        <div className="h-full bg-accent transition-[width] duration-150" style={{ width: `${progress}%` }} />
      </div>

      <article className="min-w-0" data-testid="chapter">
        <header className="mb-8 border-b border-line pb-6">
          <div className="eyebrow">
            {t('chapter.number')} {idx + 1} / {data.chapters.length} · {tl(data.module.title)}
          </div>
          <h1 className="h1 mt-2">
            <L v={c.title} />
          </h1>
          <p className="mt-2 max-w-3xl text-[15px] text-muted">
            <L v={c.summary} />
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted">
            <span className="chip">
              <Icon name="clock" size={13} /> {c.estimatedMinutes} {t('module.minutes')}
            </span>
            <span className="chip">
              <Ring value={chapterMastery(data, c.id, st)} size={18} stroke={3} /> {t('module.mastery')}
            </span>
            <ReadAloud text={c.sections.map((x) => (x.type === 'text' || x.type === 'heading' || x.type === 'callout' ? (st.lang === 'en' ? x.body.en : x.body.fr) : '')).join('. ')} en={st.lang === 'en'} />
            <span className="inline-flex items-center gap-1">
              <Icon name="database" size={12} /> {t('chapter.saved')}
            </span>
          </div>
        </header>

        {showResume && (
          <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-accent/40 bg-accent/[0.06] p-3 text-sm">
            <Icon name="history" size={18} className="text-accent" />
            <span className="flex-1">
              {t('chapter.resumeAt')} · {saved!.pct}%
            </span>
            <button className="btn-primary btn-sm" onClick={() => { goTo(saved!.section); setDismissed(true); }} data-testid="resume-chapter">
              {t('module.continue')}
            </button>
            <button className="text-muted hover:text-fg" onClick={() => setDismissed(true)} aria-label={t('common.close')}>
              <Icon name="x" size={16} />
            </button>
          </div>
        )}

        {/* mobile table of contents */}
        {headings.length > 2 && (
          <details className="card mb-6 p-3 xl:hidden">
            <summary className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
              <Icon name="list" size={16} /> {t('chapter.onThisPage')}
            </summary>
            <ol className="mt-2 space-y-1">
              {headings.map(({ s, i }, k) => (
                <li key={i}>
                  <button className="text-left text-sm text-muted hover:text-accent" onClick={() => goTo(i)}>
                    {k + 1}. {s.type === 'heading' ? tl(s.body) : ''}
                  </button>
                </li>
              ))}
            </ol>
          </details>
        )}

        <div ref={article} className="max-w-3xl">
          {c.sections.map((s, i) => (
            <SectionView key={i} id={`s-${i}`} skey={`${key}/${i}`} s={s} questions={qmap} missions={data.missions} />
          ))}

          <section className="mt-12 rounded-xl border border-warn/40 bg-warn/[0.06] p-5">
            <h2 className="mb-3 flex items-center gap-2 font-bold">
              <Icon name="star" className="text-warn" /> {t('chapter.keypoints')}
            </h2>
            <ul className="space-y-2">
              {c.keyPoints.map((k, i) => (
                <li key={i} className="flex gap-2.5 text-[15px]">
                  <Icon name="check" size={16} className="mt-1 shrink-0 text-ok" />
                  <L v={k} />
                </li>
              ))}
            </ul>
          </section>

          {related.length > 0 && (
            <section className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="h2">{t('chapter.related')}</h2>
                <Link to={`/m/${id}/exercices?chapter=${c.id}`} className="text-sm font-semibold text-accent hover:underline">
                  {t('chapter.relatedAll')} ({related.length})
                </Link>
              </div>
              <ul className="grid gap-2 sm:grid-cols-2">
                {related.slice(0, 6).map((e) => {
                  const stx = st.exercises[e.id];
                  return (
                    <li key={e.id}>
                      <Link to={`/m/${id}/exercices?chapter=${c.id}&open=${e.id}`} className="card card-hover flex items-center gap-3 p-3 text-sm">
                        <span className={`icon-tile h-8 w-8 ${stx === 'ok' ? 'bg-ok/15 text-ok' : 'bg-surface2 text-muted'}`}>
                          <Icon name={stx === 'ok' ? 'check' : 'dumbbell'} size={15} />
                        </span>
                        <span className="min-w-0 flex-1 truncate font-medium">{tl(e.title)}</span>
                        <span className="text-[11px] text-muted">{e.difficulty === 3 ? t('common.hard') : t('common.medium')}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          <div className="mt-8 flex flex-wrap gap-2">
            <button
              className={done ? 'btn-ghost' : 'btn-primary'}
              onClick={() => {
                if (!done) confetti();
                st.markRead(key);
              }}
              data-testid="mark-read"
              data-done={done}
            >
              <Icon name="check" size={16} /> {done ? t('chapter.done') : t('chapter.markRead')}
            </button>
            <Link to={`/m/${id}/qcm?chapter=${c.id}`} className="btn-ghost">
              <Icon name="quiz" size={16} /> {t('chapter.practice')}
            </Link>
          </div>

          <nav className="mt-10 grid gap-3 border-t border-line pt-6 sm:grid-cols-2">
            {prev ? (
              <Link to={`/m/${id}/c/${prev.id}`} className="card card-hover p-4">
                <span className="flex items-center gap-1 text-xs text-muted">
                  <Icon name="left" size={14} /> {t('chapter.prev')}
                </span>
                <span className="mt-1 block font-semibold">
                  <L v={prev.title} />
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link to={`/m/${id}/c/${next.id}`} className="card card-hover p-4 text-right">
                <span className="flex items-center justify-end gap-1 text-xs text-muted">
                  {t('chapter.nextChapter')} <Icon name="right" size={14} />
                </span>
                <span className="mt-1 block font-semibold">
                  <L v={next.title} />
                </span>
              </Link>
            )}
          </nav>
        </div>
      </article>

      {/* desktop table of contents */}
      {headings.length > 1 && (
        <aside className="hidden xl:block">
          <div className="sticky top-24">
            <div className="eyebrow mb-3">{t('chapter.onThisPage')}</div>
            <ol className="space-y-0.5 border-l border-line">
              {headings.map(({ s, i }) => (
                <li key={i}>
                  <button
                    onClick={() => goTo(i)}
                    className={`-ml-px block border-l-2 py-1.5 pl-3 text-left text-[13px] leading-snug transition ${activeHeading === i ? 'border-accent font-semibold text-accent' : 'border-transparent text-muted hover:text-fg'}`}
                  >
                    {s.type === 'heading' ? tl(s.body) : ''}
                  </button>
                </li>
              ))}
            </ol>
            <div className="mt-6 rounded-xl border border-line bg-surface p-3">
              <div className="flex items-center justify-between text-xs text-muted">
                <span>{t('home.global')}</span>
                <span className="font-semibold tabular-nums text-fg">{done ? 100 : progress}%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface2">
                <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${done ? 100 : progress}%` }} />
              </div>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}

/** Read the chapter aloud (French voice for fr/darija, English for en). */
function ReadAloud({ text, en }: { text: string; en: boolean }) {
  const { t } = useT();
  const [on, setOn] = useState(false);
  useEffect(() => () => stopSpeak(), []);
  const toggle = () => {
    if (on) {
      stopSpeak();
      return setOn(false);
    }
    setOn(true);
    void speak(plain(text), { lang: en ? 'en-US' : 'fr-FR', onEnd: () => setOn(false) });
  };
  return (
    <button onClick={toggle} className={`chip ${on ? 'border-accent text-accent' : ''}`}>
      <Icon name={on ? 'stop' : 'volume'} size={13} /> {on ? t('chapter.stop') : t('chapter.listen')}
    </button>
  );
}
