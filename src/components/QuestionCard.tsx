import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, Reorder, useReducedMotion } from 'framer-motion';
import type { Question } from '../lib/schema';
import { checkAnswer, shuffle, canonicalCommand, parseNumber, type Response } from '../lib/quiz';
import { useT } from '../hooks/useT';
import { L, Code } from './Text';
import { Icon } from './Icon';

interface Props {
  q: Question;
  /** called once when the user validates */
  onAnswer?: (ok: boolean, response: Response) => void;
  onNext?: () => void;
  /** exam mode: record the response without showing the correction */
  examMode?: boolean;
  initialResponse?: Response;
  onChange?: (r: Response | undefined) => void;
  index?: number;
  total?: number;
}

export function DifficultyDots({ d }: { d: 1 | 2 | 3 }) {
  const { t } = useT();
  const label = d === 1 ? t('common.easy') : d === 2 ? t('common.medium') : t('common.hard');
  return (
    <span className="chip" title={`${t('common.difficulty')} : ${label}`}>
      {[1, 2, 3].map((i) => (
        <span key={i} className={`h-1.5 w-1.5 rounded-full ${i <= d ? 'bg-accent' : 'bg-line'}`} />
      ))}
      <span className="sr-only">{label}</span>
    </span>
  );
}

export function QuestionCard({ q, onAnswer, onNext, examMode = false, initialResponse, onChange, index, total, autoFocus = true }: Props & { autoFocus?: boolean }) {
  const { t } = useT();
  const reduce = useReducedMotion();
  const options = useMemo(() => (q.options ? shuffle(q.options) : []), [q]);
  const [single, setSingle] = useState<string | null>(typeof initialResponse === 'string' && q.kind === 'single' ? initialResponse : null);
  const [multi, setMulti] = useState<string[]>(Array.isArray(initialResponse) && q.kind === 'multi' ? initialResponse : []);
  const [order, setOrder] = useState<string[]>(Array.isArray(initialResponse) && q.kind === 'order' ? initialResponse : options.map((o) => o.id));
  const [text, setText] = useState(typeof initialResponse === 'string' && (q.kind === 'command' || q.kind === 'numeric') ? initialResponse : '');
  const [result, setResult] = useState<null | boolean>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSingle(null);
    setMulti([]);
    setOrder(options.map((o) => o.id));
    setText('');
    setResult(null);
    // inside a chapter (mini-quiz) we never steal the focus: it would scroll the page to the quiz
    if (autoFocus) {
      if (q.kind === 'command' || q.kind === 'numeric') setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 50);
      else rootRef.current?.focus({ preventScroll: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q.id]);

  const response = (): Response | undefined => {
    if (q.kind === 'single') return single ?? undefined;
    if (q.kind === 'multi') return multi.length ? multi : undefined;
    if (q.kind === 'order') return order;
    return text.trim() ? text : undefined;
  };

  useEffect(() => {
    if (examMode) onChange?.(response());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [single, multi, order, text]);

  const validate = () => {
    const r = response();
    if (r === undefined || result !== null) return;
    const ok = checkAnswer(q, r);
    setResult(ok);
    onAnswer?.(ok, r);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if ((e.target as HTMLElement).tagName === 'INPUT' && e.key !== 'Enter') return;
    if (/^[1-9]$/.test(e.key) && (q.kind === 'single' || q.kind === 'multi') && result === null) {
      const o = options[+e.key - 1];
      if (!o) return;
      e.preventDefault();
      if (q.kind === 'single') setSingle(o.id);
      else setMulti((m) => (m.includes(o.id) ? m.filter((x) => x !== o.id) : [...m, o.id]));
    } else if (e.key === 'Enter' && !examMode) {
      e.preventDefault();
      if (result === null) validate();
      else onNext?.();
    } else if (e.key === 'ArrowRight' && result !== null && !examMode) {
      e.preventDefault();
      onNext?.();
    }
  };

  const answered = result !== null;
  const correctIds = q.kind === 'single' ? [q.answer as string] : q.kind === 'multi' ? (q.answer as string[]) : [];
  const shake = answered && !result && !reduce ? { x: [0, -8, 8, -6, 6, 0] } : {};
  const bounce = answered && result && !reduce ? { scale: [1, 1.03, 1] } : {};

  return (
    <motion.div
      ref={rootRef}
      tabIndex={-1}
      onKeyDown={onKey}
      animate={{ ...shake, ...bounce }}
      transition={{ duration: 0.4 }}
      className={`card p-4 outline-none sm:p-5 ${answered ? (result ? 'border-ok/70' : 'border-bad/70') : ''}`}
      data-testid="question"
      data-qid={q.id}
    >
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted">
        {index !== undefined && total !== undefined && (
          <span className="font-mono">
            {index + 1}/{total}
          </span>
        )}
        <DifficultyDots d={q.difficulty} />
        {q.kind === 'multi' && <span className="chip">{t('qcm.multiHint')}</span>}
      </div>
      <div className="mb-3 text-base font-medium sm:text-lg">
        <L v={q.prompt} md />
      </div>
      {q.code && <Code code={q.code} lang={q.module === 'data' ? 'python' : 'bash'} className="mb-3" />}

      {(q.kind === 'single' || q.kind === 'multi') && (
        <ul className="grid gap-2" role={q.kind === 'single' ? 'radiogroup' : 'group'}>
          {options.map((o, i) => {
            const selected = q.kind === 'single' ? single === o.id : multi.includes(o.id);
            const isRight = correctIds.includes(o.id);
            let cls = 'border-line bg-surface2 hover:border-accent/60';
            if (selected && !answered) cls = 'border-accent bg-accent/10';
            if (answered && !examMode) {
              if (isRight) cls = 'border-ok bg-ok/10';
              else if (selected) cls = 'border-bad bg-bad/10';
              else cls = 'border-line bg-surface2 opacity-70';
            }
            return (
              <li key={o.id}>
                <button
                  type="button"
                  role={q.kind === 'single' ? 'radio' : 'checkbox'}
                  aria-checked={selected}
                  disabled={answered}
                  onClick={() => (q.kind === 'single' ? setSingle(o.id) : setMulti((m) => (m.includes(o.id) ? m.filter((x) => x !== o.id) : [...m, o.id])))}
                  className={`flex w-full items-start gap-3 rounded-xl border px-3 py-3 text-left transition ${cls}`}
                  data-testid={`option-${o.id}`}
                  data-correct={isRight ? 'true' : 'false'}
                >
                  <kbd className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md border border-line bg-surface text-xs text-muted">{i + 1}</kbd>
                  <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">
                    <L v={o.text} />
                  </span>
                  {answered && !examMode && isRight && <Icon name="check" className="text-ok" />}
                  {answered && !examMode && selected && !isRight && <Icon name="x" className="text-bad" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {q.kind === 'order' && (
        <div>
          <p className="mb-2 text-xs text-muted">{t('qcm.orderHint')}</p>
          <Reorder.Group axis="y" values={order} onReorder={answered ? () => undefined : setOrder} className="grid gap-2">
            {order.map((id, i) => {
              const o = q.options!.find((x) => x.id === id)!;
              const good = answered && (q.answer as string[])[i] === id;
              return (
                <Reorder.Item key={id} value={id} dragListener={!answered} className={`flex items-center gap-2 rounded-xl border px-3 py-2 ${answered && !examMode ? (good ? 'border-ok bg-ok/10' : 'border-bad bg-bad/10') : 'border-line bg-surface2'}`}>
                  <Icon name="grip" size={16} className="shrink-0 cursor-grab text-muted" />
                  <span className="w-5 font-mono text-xs text-muted">{i + 1}.</span>
                  <span className="min-w-0 flex-1 text-sm [overflow-wrap:anywhere]">
                    <L v={o.text} />
                  </span>
                  {!answered && (
                    <span className="flex">
                      <button type="button" aria-label="↑" className="grid h-9 w-9 place-items-center rounded-lg hover:bg-line" disabled={i === 0} onClick={() => setOrder((a) => swap(a, i, i - 1))}>
                        <Icon name="up" size={16} />
                      </button>
                      <button type="button" aria-label="↓" className="grid h-9 w-9 place-items-center rounded-lg hover:bg-line" disabled={i === order.length - 1} onClick={() => setOrder((a) => swap(a, i, i + 1))}>
                        <Icon name="down" size={16} />
                      </button>
                    </span>
                  )}
                </Reorder.Item>
              );
            })}
          </Reorder.Group>
        </div>
      )}

      {(q.kind === 'command' || q.kind === 'numeric') && (
        <div className={`flex items-center gap-2 rounded-xl border px-3 ${q.kind === 'command' ? 'term bg-[#0b1020] text-emerald-300' : 'bg-surface2'} ${answered && !examMode ? (result ? 'border-ok' : 'border-bad') : 'border-line'}`}>
          {q.kind === 'command' && <span className="select-none text-cyan-300">#</span>}
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={answered}
            inputMode={q.kind === 'numeric' ? 'decimal' : 'text'}
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            aria-label={q.kind === 'command' ? t('qcm.typeCommand') : t('qcm.typeNumber')}
            placeholder={q.kind === 'command' ? t('qcm.typeCommand') : t('qcm.typeNumber')}
            className="min-h-[48px] w-full bg-transparent outline-none placeholder:text-slate-500"
            data-testid="answer-input"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !examMode) {
                e.preventDefault();
                e.stopPropagation();
                if (result === null) validate();
                else onNext?.();
              }
            }}
          />
        </div>
      )}
      {q.kind === 'numeric' && q.tolerance !== undefined && (
        <p className="mt-1 text-xs text-muted">
          {t('qcm.tolerance')} ± {String(q.tolerance).replace('.', ',')}
        </p>
      )}

      {!examMode && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {!answered ? (
            <button className="btn-primary" onClick={validate} disabled={response() === undefined} data-testid="validate">
              {t('common.validate')}
            </button>
          ) : (
            onNext && (
              <button className="btn-primary" onClick={onNext} data-testid="next" autoFocus={autoFocus}>
                {t('common.next')} <Icon name="right" size={16} />
              </button>
            )
          )}
          <span className="hidden text-xs text-muted sm:inline">{t('qcm.keys')}</span>
        </div>
      )}

      <AnimatePresence>
        {answered && !examMode && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <Feedback q={q} ok={result!} response={response()!} />
          </motion.div>
        )}
      </AnimatePresence>
      <span className="sr-only" aria-live="polite">
        {answered ? (result ? t('qcm.correct') : t('qcm.wrong')) : ''}
      </span>
    </motion.div>
  );
}

function swap<T>(a: T[], i: number, j: number): T[] {
  const b = [...a];
  [b[i], b[j]] = [b[j], b[i]];
  return b;
}

export function Feedback({ q, ok, response }: { q: Question; ok: boolean; response: Response }) {
  const { t } = useT();
  const wrongExpl = q.wrongExplanations ?? {};
  const typedWrong = (): string[] => {
    if (ok) return [];
    if (q.kind === 'command') return Object.keys(wrongExpl).filter((k) => canonicalCommand(k) === canonicalCommand(String(response)));
    if (q.kind === 'numeric') return Object.keys(wrongExpl).filter((k) => Math.abs(parseNumber(k) - parseNumber(String(response))) <= (q.tolerance ?? 0.01));
    return [];
  };
  const wrongPicked = q.kind === 'single' && !ok ? [response as string] : q.kind === 'multi' ? (response as string[]).filter((r) => !(q.answer as string[]).includes(r)) : typedWrong();
  const others = Object.keys(wrongExpl).filter((k) => !wrongPicked.includes(k));
  return (
    <div className="mt-4 space-y-3 border-t border-line pt-4" data-testid="feedback">
      <div className={`flex items-center gap-2 font-semibold ${ok ? 'text-ok' : 'text-bad'}`}>
        <Icon name={ok ? 'check' : 'x'} /> {ok ? t('qcm.correct') : t('qcm.wrong')}
      </div>
      {!ok && (q.kind === 'command' || q.kind === 'numeric' || q.kind === 'order') && (
        <div className="text-sm">
          <span className="text-muted">{t('qcm.expected')} : </span>
          {q.kind === 'command' && <code className="rounded bg-surface2 px-1.5 py-0.5 font-mono text-accent2">{(q.answer as string[])[0]}</code>}
          {q.kind === 'numeric' && <strong>{String(Math.round((q.answer as number) * 10000) / 10000).replace('.', ',')}</strong>}
          {q.kind === 'order' && (
            <ol className="mt-1 list-decimal pl-5">
              {(q.answer as string[]).map((id) => (
                <li key={id}>
                  <L v={q.options!.find((o) => o.id === id)!.text} />
                </li>
              ))}
            </ol>
          )}
          {q.kind === 'command' && (q.answer as string[]).length > 1 && (
            <div className="mt-1 text-xs text-muted">
              ≡ {(q.answer as string[]).slice(1).map((a) => <code key={a} className="mr-2 font-mono">{a}</code>)}
            </div>
          )}
        </div>
      )}
      <div>
        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">{t('qcm.why')}</div>
        <L v={q.explanation} md />
      </div>
      {wrongPicked.map((w) =>
        wrongExpl[w] ? (
          <div key={w} className="rounded-xl border border-bad/40 bg-bad/5 p-3 text-sm">
            {q.options ? <L v={q.options.find((o) => o.id === w)?.text} className="font-semibold" /> : <code className="font-mono font-semibold">{w}</code>}
            <L v={wrongExpl[w]} md />
          </div>
        ) : null
      )}
      {others.length > 0 && (
        <details className="text-sm">
          <summary className="cursor-pointer text-muted">{t('qcm.whyWrong')}</summary>
          <ul className="mt-2 space-y-2">
            {others.map((k) => (
              <li key={k} className="rounded-lg bg-surface2 p-2">
                <L v={q.options?.find((o) => o.id === k)?.text} className="font-medium" />
                {q.options?.find((o) => o.id === k) ? ' — ' : <code className="font-mono">{k} — </code>}
                <L v={wrongExpl[k]} />
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
