import { useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '../../components/Icon';
import type { Slide } from '../../content/oral/rmrf';
import { alignProgress, countFillers, norm, words, wpm } from '../../lib/oral';

type Lang3 = 'fr' | 'dar' | 'en';
const tr = (l: Lang3, fr: string, dar: string, en: string) => (l === 'dar' ? dar : l === 'en' ? en : fr);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SR: any = typeof window !== 'undefined' ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition : undefined;

interface Tok {
  text: string;
  /** index in the list of spoken (normalised, non-empty) words, -1 for pure punctuation */
  w: number;
  slide: number;
  sentence: number;
}

/**
 * Live prompter: the whole script (slides 9 → 12) as one continuous text, always starting from
 * the first slide. With Chrome speech recognition the text follows your voice (current word
 * highlighted, already-said words dimmed); otherwise it scrolls at a chosen pace.
 */
export function LivePrompter({ slides, l }: { slides: Slide[]; l: Lang3 }) {
  const { toks, expected, slideStart } = useMemo(() => {
    const toks: Tok[] = [];
    const expected: string[] = [];
    const slideStart: number[] = [];
    slides.forEach((s, si) => {
      slideStart.push(expected.length);
      s.sentences.forEach((x, ki) => {
        for (const raw of x.en.split(/\s+/)) {
          const n = norm(raw);
          toks.push({ text: raw, w: n ? expected.length : -1, slide: si, sentence: ki });
          if (n) expected.push(n);
        }
      });
    });
    return { toks, expected, slideStart };
  }, [slides]);

  const [mode, setMode] = useState<'voice' | 'auto'>(SR ? 'voice' : 'auto');
  const [running, setRunning] = useState(false);
  const [pos, setPos] = useState(0); // number of expected words already read
  const [heard, setHeard] = useState('');
  const [size, setSize] = useState(34);
  const [speed, setSpeed] = useState(130);
  const [mirror, setMirror] = useState(false);
  const [start, setStart] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [report, setReport] = useState<null | { ms: number; said: string; reached: number }>(null);
  const box = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const rec = useRef<{ stop: () => void; abort?: () => void } | null>(null);
  const finalText = useRef('');
  const runningRef = useRef(false);

  // timer
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [running]);

  // keep the current word at ~35 % of the prompter height
  useEffect(() => {
    if (mode !== 'voice') return;
    const el = wordRefs.current[Math.min(pos, expected.length - 1)];
    const b = box.current;
    if (!el || !b) return;
    const target = el.offsetTop - b.clientHeight * 0.35;
    b.scrollTo({ top: Math.max(0, target), behavior: 'smooth' });
  }, [pos, mode, expected.length]);

  // auto-scroll mode: move the highlight at the chosen words-per-minute pace
  useEffect(() => {
    if (!running || mode !== 'auto') return;
    const id = setInterval(() => setPos((p) => Math.min(expected.length, p + 1)), 60000 / speed);
    return () => clearInterval(id);
  }, [running, mode, speed, expected.length]);
  useEffect(() => {
    if (mode !== 'auto') return;
    const el = wordRefs.current[Math.min(pos, expected.length - 1)];
    const b = box.current;
    if (el && b) b.scrollTo({ top: Math.max(0, el.offsetTop - b.clientHeight * 0.35), behavior: 'smooth' });
  }, [pos, mode, expected.length]);

  const listen = () => {
    if (!SR) return;
    const r = new SR();
    r.lang = 'en-US';
    r.interimResults = true;
    r.continuous = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    r.onresult = (e: any) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) finalText.current += ' ' + e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      const all = `${finalText.current} ${interim}`.trim();
      setHeard(all);
      setPos((p) => Math.max(p, alignProgress(expected, words(all))));
    };
    // Chrome stops listening after a silence: restart while the session is running
    r.onend = () => {
      if (runningRef.current) {
        try {
          listen();
        } catch {
          /* already started */
        }
      }
    };
    r.start();
    rec.current = r;
  };

  const begin = () => {
    setReport(null);
    finalText.current = '';
    setHeard('');
    setPos(0);
    box.current?.scrollTo({ top: 0 });
    const t = Date.now();
    setStart(t);
    setNow(t);
    setRunning(true);
    runningRef.current = true;
    if (mode === 'voice') listen();
  };
  const stop = () => {
    runningRef.current = false;
    setRunning(false);
    rec.current?.stop();
    rec.current = null;
    if (start) setReport({ ms: Date.now() - start, said: finalText.current.trim(), reached: pos });
  };
  useEffect(
    () => () => {
      runningRef.current = false;
      rec.current?.stop();
    },
    []
  );

  const el = start && running ? now - start : 0;
  const curSlide = slideStart.filter((s) => s <= pos).length - 1;
  const pct = Math.round((100 * pos) / expected.length);
  const fullscreen = () => box.current?.parentElement?.requestFullscreen?.();

  return (
    <div className="space-y-3">
      <div className="card flex flex-wrap items-center gap-2 p-3">
        {!running ? (
          <button className="btn-primary" onClick={begin} data-testid="live-start">
            <Icon name={mode === 'voice' ? 'mic' : 'play'} size={16} /> {tr(l, 'Démarrer depuis la slide 9', 'Bda mn slide 9', 'Start from slide 9')}
          </button>
        ) : (
          <button className="btn-primary !bg-bad" onClick={stop}>
            <Icon name="stop" size={16} /> {tr(l, 'Terminer', 'Sali', 'Finish')}
          </button>
        )}
        <div className="flex rounded-lg border border-line bg-surface2 p-0.5 text-xs font-semibold">
          {(['voice', 'auto'] as const).map((m) => (
            <button
              key={m}
              disabled={running || (m === 'voice' && !SR)}
              onClick={() => setMode(m)}
              className={`rounded-md px-2.5 py-1.5 disabled:opacity-40 ${mode === m ? 'bg-surface text-accent shadow-sm' : 'text-muted'}`}
            >
              {m === 'voice' ? tr(l, 'Suit ma voix', 'Kaytb3 sooti', 'Follows my voice') : tr(l, 'Défilement auto', 'Défilement auto', 'Auto-scroll')}
            </button>
          ))}
        </div>
        {mode === 'auto' && (
          <label className="flex items-center gap-2 text-xs text-muted">
            <input type="range" min={90} max={170} value={speed} onChange={(e) => setSpeed(+e.target.value)} /> {speed} {tr(l, 'mots/min', 'klma/d9i9a', 'wpm')}
          </label>
        )}
        <label className="flex items-center gap-2 text-xs text-muted">
          <Icon name="search" size={14} />
          <input type="range" min={22} max={52} value={size} onChange={(e) => setSize(+e.target.value)} aria-label="font size" />
        </label>
        <button className={`chip ${mirror ? 'border-accent text-accent' : ''}`} onClick={() => setMirror(!mirror)}>
          <Icon name="reset" size={13} /> {tr(l, 'Miroir', 'Miroir', 'Mirror')}
        </button>
        <button className="chip" onClick={fullscreen}>
          <Icon name="maximize" size={13} /> {tr(l, 'Plein écran', 'Écran kaml', 'Fullscreen')}
        </button>
        <div className="ml-auto flex items-center gap-3">
          <span className={`font-mono text-2xl font-bold tabular-nums ${el > 300000 ? 'text-bad' : el > 240000 ? 'text-warn' : 'text-ok'}`}>
            {Math.floor(el / 60000)}:{String(Math.floor(el / 1000) % 60).padStart(2, '0')}
          </span>
          <span className="text-xs text-muted">/ 4:00</span>
        </div>
      </div>
      {!SR && <p className="text-xs text-muted">{tr(l, 'Le suivi de la voix demande Chrome (ordinateur ou Android). Ici : défilement automatique.', 'Suivi dyal sout khass Chrome. Hna : défilement auto.', 'Voice follow needs Chrome (desktop or Android). Using auto-scroll here.')}</p>}

      <div className="relative overflow-hidden rounded-2xl bg-[#0a1424] ring-1 ring-white/10">
        {/* header: slide + progress */}
        <div className="absolute inset-x-0 top-0 z-10 flex items-center gap-3 bg-gradient-to-b from-[#0a1424] via-[#0a1424]/90 to-transparent px-5 pb-6 pt-3 text-white">
          <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 font-mono text-xs font-bold text-emerald-300">SLIDE {slides[Math.max(0, curSlide)].n}</span>
          <span className="truncate text-sm text-white/70">{slides[Math.max(0, curSlide)].title.slice(3)}</span>
          <span className="ml-auto font-mono text-xs text-white/60">{pct}%</span>
        </div>
        <div className="absolute inset-x-0 top-0 z-20 h-1 bg-white/10">
          <div className="h-full bg-emerald-400 transition-all duration-300" style={{ width: `${pct}%` }} />
        </div>
        {/* reading line */}
        <div className="pointer-events-none absolute inset-x-0 top-[35%] z-10 h-px bg-emerald-400/30" />
        <div
          ref={box}
          data-lenis-prevent
          className="scroll-thin relative h-[62vh] overflow-y-auto px-6 pb-[45vh] pt-[22vh] font-semibold leading-[1.45] text-white sm:px-12"
          style={{ fontSize: size, transform: mirror ? 'scaleX(-1)' : undefined }}
          data-testid="live-text"
        >
          {toks.map((t, i) => {
            const firstOfSlide = i === 0 || toks[i - 1].slide !== t.slide;
            const said = t.w >= 0 && t.w < pos;
            const current = t.w === pos;
            return (
              <span key={i}>
                {firstOfSlide && (
                  <span className="mb-3 mt-8 block font-mono text-[0.4em] font-bold uppercase tracking-[0.2em] text-emerald-300/80 first:mt-0">
                    — Slide {slides[t.slide].n} · {slides[t.slide].title.slice(3)}
                  </span>
                )}
                <span
                  ref={(r) => {
                    if (t.w >= 0) wordRefs.current[t.w] = r;
                  }}
                  className={`rounded px-0.5 transition-colors duration-200 ${current ? 'bg-emerald-400 text-[#0a1424]' : said ? 'text-white/35' : 'text-white'}`}
                >
                  {t.text}
                </span>{' '}
              </span>
            );
          })}
        </div>
      </div>
      {running && mode === 'voice' && heard && <p className="truncate text-xs italic text-muted">{heard.slice(-140)}</p>}

      {report && (
        <div className="card grid gap-3 p-4 text-sm sm:grid-cols-4">
          <Metric label={tr(l, 'Durée', 'Lmodda', 'Duration')} value={`${Math.floor(report.ms / 60000)}:${String(Math.round(report.ms / 1000) % 60).padStart(2, '0')}`} hint={tr(l, 'cible ≈ 4:00', 'lhadaf ≈ 4:00', 'target ≈ 4:00')} />
          <Metric label={tr(l, 'Script couvert', 'Script li 9riti', 'Script covered')} value={`${Math.round((100 * report.reached) / expected.length)} %`} />
          <Metric label={tr(l, 'Débit', 'Sor3a', 'Pace')} value={report.said ? `${wpm(words(report.said).length, report.ms)}` : '—'} hint={tr(l, 'mots/min, cible 120–140', 'klma/d9i9a, 120–140', 'wpm, target 120–140')} />
          <Metric label={tr(l, 'Hésitations', 'Euh…', 'Fillers')} value={report.said ? String(countFillers(report.said)) : '—'} hint="euh, um, like" />
        </div>
      )}
    </div>
  );
}

function Metric({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div>
      <div className="text-xs text-muted">{label}</div>
      <div className="text-2xl font-bold tabular-nums">{value}</div>
      {hint && <div className="text-[11px] text-muted">{hint}</div>}
    </div>
  );
}
