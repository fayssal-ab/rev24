import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useModuleContent } from '../hooks/useModule';
import { Loading, PageTitle, useModuleParam } from '../components/Layout';
import { useStore } from '../store/store';
import { useT, useL } from '../hooks/useT';
import { dueQueue, type Grade } from '../lib/sm2';
import { L } from '../components/Text';
import { Icon } from '../components/Icon';

export default function FlashcardsPage() {
  const id = useModuleParam();
  const { data } = useModuleContent(id);
  const { t } = useT();
  const tl = useL();
  const reduce = useReducedMotion();
  const cards = useStore((s) => s.cards);
  const grade = useStore((s) => s.gradeCard);
  const [chapter, setChapter] = useState('all');
  const [flipped, setFlipped] = useState(false);
  const [tick, setTick] = useState(0);
  const queue = useMemo(() => {
    if (!data) return [];
    return dueQueue(data.flashcards.filter((c) => chapter === 'all' || c.chapter === chapter), cards);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, chapter, tick]);
  if (!data) return <Loading />;
  const card = queue[0];
  const newCount = queue.filter((c) => !cards[c.id]).length;
  const doGrade = (g: Grade) => {
    if (!card) return;
    grade(card.id, g);
    setFlipped(false);
    setTick((x) => x + 1);
  };
  const buttons: { g: Grade; key: 'fc.again' | 'fc.hard' | 'fc.good' | 'fc.easy'; cls: string }[] = [
    { g: 'again', key: 'fc.again', cls: 'bg-bad/15 text-bad' },
    { g: 'hard', key: 'fc.hard', cls: 'bg-warn/15 text-warn' },
    { g: 'good', key: 'fc.good', cls: 'bg-ok/15 text-ok' },
    { g: 'easy', key: 'fc.easy', cls: 'bg-accent2/15 text-accent2' }
  ];
  return (
    <div className="space-y-4">
      <PageTitle back={`/m/${id}`} title={t('fc.title')} sub={`${queue.length - newCount} ${t('fc.due')} · ${newCount} ${t('fc.new')}`} />
      <select className="input" value={chapter} onChange={(e) => setChapter(e.target.value)} aria-label={t('qcm.filterChapter')}>
        <option value="all">{t('common.all')}</option>
        {data.chapters.map((c) => (
          <option key={c.id} value={c.id}>
            {tl(c.title)}
          </option>
        ))}
      </select>
      {!card ? (
        <p className="card p-6 text-center text-muted">{t('fc.done')}</p>
      ) : (
        <>
          <div className="[perspective:1200px]">
            <motion.button
              key={card.id}
              onClick={() => setFlipped(!flipped)}
              className="relative h-64 w-full [transform-style:preserve-3d] sm:h-72"
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={reduce ? { duration: 0 } : { duration: 0.45 }}
              aria-label={t('fc.flip')}
              data-testid="flashcard"
            >
              <div className="card absolute inset-0 grid place-items-center overflow-auto p-6 text-center text-lg font-medium [backface-visibility:hidden]">
                <L v={card.front} md />
              </div>
              <div className="card absolute inset-0 grid place-items-center overflow-auto border-accent p-6 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <L v={card.back} md />
              </div>
            </motion.button>
          </div>
          {flipped ? (
            <div className="grid grid-cols-4 gap-2">
              {buttons.map((b) => (
                <button key={b.g} className={`btn ${b.cls}`} onClick={() => doGrade(b.g)}>
                  {t(b.key)}
                </button>
              ))}
            </div>
          ) : (
            <button className="btn-primary w-full" onClick={() => setFlipped(true)}>
              <Icon name="cards" size={16} /> {t('fc.flip')}
            </button>
          )}
        </>
      )}
    </div>
  );
}
