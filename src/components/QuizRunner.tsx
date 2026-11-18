import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { Question } from '../lib/schema';
import { xpFor, MISTAKE_EXIT_STREAK } from '../lib/quiz';
import { useStore } from '../store/store';
import { useT } from '../hooks/useT';
import { QuestionCard } from './QuestionCard';
import { Bar } from './Ring';
import { Icon } from './Icon';

interface Props {
  questions: Question[];
  mistakesMode?: boolean;
  onFinish?: (ok: number, total: number, wrongIds: string[]) => void;
  compact?: boolean;
}

export function QuizRunner({ questions, mistakesMode = false, onFinish, compact = false }: Props) {
  const { t } = useT();
  const answer = useStore((s) => s.answer);
  const [queue, setQueue] = useState<Question[]>(questions);
  const [pos, setPos] = useState(0);
  const [ok, setOk] = useState(0);
  const [done, setDone] = useState(0);
  const [wrong, setWrong] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  const total = useMemo(() => questions.length, [questions]);

  if (!queue.length) return <p className="text-muted">{t('common.empty')}</p>;

  const q = queue[pos];
  const handle = (good: boolean) => {
    answer(q.id, good, xpFor(q));
    setDone((d) => d + 1);
    if (good) setOk((n) => n + 1);
    else setWrong((w) => (w.includes(q.id) ? w : [...w, q.id]));
    if (mistakesMode) {
      const st = useStore.getState().qstats[q.id];
      if (st?.inMistakes) setQueue((qq) => [...qq, q]); // served again later, until 3 right in a row
    }
  };
  const next = () => {
    if (pos + 1 >= queue.length) {
      setFinished(true);
      onFinish?.(ok, done, wrong);
      return;
    }
    setPos((p) => p + 1);
  };

  if (finished) {
    const pct = done ? Math.round((ok / done) * 100) : 0;
    return (
      <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card p-6 text-center" data-testid="quiz-finished">
        <div className="mx-auto mb-2 grid h-14 w-14 place-items-center rounded-full bg-accent/15 text-accent">
          <Icon name="target" size={28} />
        </div>
        <h2 className="h2">{t('qcm.finished')}</h2>
        <p className="mt-1 text-3xl font-bold tabular-nums">
          {ok}/{done} <span className="text-base text-muted">({pct} %)</span>
        </p>
        {mistakesMode && <p className="mt-2 text-sm text-muted">{t('qcm.mistakes.hint')}</p>}
        <button
          className="btn-primary mt-4"
          onClick={() => {
            setQueue(mistakesMode ? questions.filter((x) => useStore.getState().qstats[x.id]?.inMistakes) : questions);
            setPos(0);
            setOk(0);
            setDone(0);
            setWrong([]);
            setFinished(false);
          }}
        >
          <Icon name="reset" size={16} /> {t('qcm.again')}
        </button>
      </motion.div>
    );
  }

  const streak = useStore.getState().qstats[q.id]?.streak ?? 0;
  return (
    <div className="space-y-3">
      {!compact && (
        <div className="flex items-center gap-3">
          <Bar value={(pos / Math.max(queue.length, total)) * 100} />
          <span className="shrink-0 font-mono text-xs text-muted">
            {ok}/{done}
          </span>
        </div>
      )}
      {mistakesMode && useStore.getState().qstats[q.id]?.inMistakes && (
        <div className="flex items-center gap-1 text-xs text-muted" aria-label={`${streak}/${MISTAKE_EXIT_STREAK}`}>
          {Array.from({ length: MISTAKE_EXIT_STREAK }).map((_, i) => (
            <span key={i} className={`h-2 w-6 rounded-full ${i < streak ? 'bg-ok' : 'bg-line'}`} />
          ))}
        </div>
      )}
      <QuestionCard key={`${q.id}-${pos}`} q={q} onAnswer={handle} onNext={next} index={pos} total={queue.length} />
    </div>
  );
}
