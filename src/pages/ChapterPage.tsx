import { useEffect, useMemo, useState } from 'react';
import { plain, speak, stopSpeak } from '../lib/tts';
import { Link, useParams } from 'react-router-dom';
import { useModuleContent } from '../hooks/useModule';
import { Loading, PageTitle, useModuleParam } from '../components/Layout';
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
  const qmap = useMemo(() => Object.fromEntries((data?.questions ?? []).map((q) => [q.id, q])), [data]);
  if (!data) return <Loading />;
  const idx = data.chapters.findIndex((c) => c.id === chapter);
  if (idx < 0) return <NotFound />;
  const c = data.chapters[idx];
  const next = data.chapters[idx + 1];
  const key = `${id}/${c.id}`;
  const headings = c.sections.map((s, i) => ({ s, i })).filter((x) => x.s.type === 'heading');
  return (
    <article className="space-y-2" data-testid="chapter">
      <PageTitle back={`/m/${id}`} title={<L v={c.title} />} sub={<L v={c.summary} />} />
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
        <span className="chip">
          <Icon name="clock" size={14} /> ~{c.estimatedMinutes} {t('common.minutes')}
        </span>
        <Ring value={chapterMastery(data, c.id, st)} size={36} stroke={4} />
        <ReadAloud text={c.sections.map((x) => (x.type === 'text' || x.type === 'heading' || x.type === 'callout' ? (st.lang === 'en' ? x.body.en : x.body.fr) : '')).join('. ')} en={st.lang === 'en'} />
      </div>
      {headings.length > 2 && (
        <nav className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-2" aria-label={t('module.chapters')}>
          {headings.map(({ s, i }) => (
            <a key={i} href={`#s-${i}`} onClick={(e) => { e.preventDefault(); document.getElementById(`s-${i}`)?.scrollIntoView({ behavior: 'smooth' }); }} className="chip shrink-0 hover:text-fg">
              {s.type === 'heading' ? tl(s.body) : ''}
            </a>
          ))}
        </nav>
      )}
      <div className="leading-relaxed">
        {c.sections.map((s, i) => (
          <SectionView key={i} id={`s-${i}`} s={s} questions={qmap} missions={data.missions} />
        ))}
      </div>
      <section className="card mt-8 p-4">
        <h2 className="h2 mb-2 flex items-center gap-2">
          <Icon name="star" className="text-warn" /> {t('chapter.keypoints')}
        </h2>
        <ul className="list-disc space-y-1 pl-5">
          {c.keyPoints.map((k, i) => (
            <li key={i}>
              <L v={k} />
            </li>
          ))}
        </ul>
      </section>
      <div className="flex flex-wrap gap-2 py-4">
        <button
          className={st.read[key] ? 'btn-ghost' : 'btn-primary'}
          onClick={() => {
            if (!st.read[key]) confetti();
            st.markRead(key);
          }}
          data-testid="mark-read"
        >
          <Icon name="check" size={16} /> {st.read[key] ? t('chapter.done') : t('chapter.markRead')}
        </button>
        <Link to={`/m/${id}/qcm?chapter=${c.id}`} className="btn-ghost">
          <Icon name="quiz" size={16} /> {t('chapter.practice')}
        </Link>
        {next && (
          <Link to={`/m/${id}/c/${next.id}`} className="btn-ghost">
            {t('chapter.nextChapter')} <Icon name="right" size={16} />
          </Link>
        )}
      </div>
    </article>
  );
}

/** Read the chapter aloud (French voice for fr/darija, English for en). */
function ReadAloud({ text, en }: { text: string; en: boolean }) {
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
      {on ? '⏹ Stop' : en ? '🔊 Read aloud' : '🔊 Écouter'}
    </button>
  );
}
