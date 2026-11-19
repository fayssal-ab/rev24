import { useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '../components/Icon';
import { LivePrompter } from './oral/LivePrompter';
import { useT } from '../hooks/useT';
import { CHECKLIST, FACTS, LEXICON, QA, QUIZ, SLIDES, TECH, TRANSITIONS, WARMUP, type Slide } from '../content/oral/rmrf';
import { listVoices, setPreferredVoice, speak as tts, stopSpeak } from '../lib/tts';
import { countFillers, maskWords, norm, scoreSpeech, words, wpm } from '../lib/oral';

/* ───────── speech helpers ───────── */
let voicePref: 'en-US' | 'en-GB' = 'en-US';
function speak(text: string, rate = 1, onWord?: (charIndex: number) => void, onEnd?: () => void) {
  // same length replacements keep charIndex aligned with the displayed text
  void tts(text.replace(/rm -rf/g, 'R M dash R F').replace(/rm -i/g, 'R M dash I').replace(/\bGB\b/g, 'gigabytes').replace(/\bpwd\b/g, 'P W D').replace(/\bls\b/g, 'L S'), { lang: voicePref, rate, onWord, onEnd });
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SR: any = typeof window !== 'undefined' ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition : undefined;
function listen(onText: (t: string, final: boolean) => void, continuous = false) {
  if (!SR) return null;
  const r = new SR();
  r.lang = 'en-US';
  r.interimResults = true;
  r.continuous = continuous;
  let acc = '';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  r.onresult = (e: any) => {
    let interim = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      if (e.results[i].isFinal) acc += ' ' + e.results[i][0].transcript;
      else interim += e.results[i][0].transcript;
    }
    onText((acc + ' ' + interim).trim(), false);
  };
  r.onend = () => onText(acc.trim(), true);
  r.start();
  return r as { stop: () => void };
}

/* ───────── progress (localStorage) ───────── */
const KEY = 'rev24-oral-rmrf';
type Prog = { best: Record<string, number>; level: Record<number, number>; times: Record<number, number>; qa: number[] };
function loadProg(): Prog {
  try {
    return { best: {}, level: {}, times: {}, qa: [], ...JSON.parse(localStorage.getItem(KEY) || '{}') };
  } catch {
    return { best: {}, level: {}, times: {}, qa: [] };
  }
}
function useProg() {
  const [p, setP] = useState<Prog>(loadProg);
  const save = (f: (p: Prog) => Prog) =>
    setP((old) => {
      const n = f(old);
      try {
        localStorage.setItem(KEY, JSON.stringify(n));
      } catch {
        /* ignore */
      }
      return n;
    });
  return [p, save] as const;
}

type Lang3 = 'fr' | 'dar' | 'en';
const tr = (l: Lang3, fr: string, dar: string, en: string) => (l === 'dar' ? dar : l === 'en' ? en : fr);

/* ───────── page ───────── */
const TABS = ['live', 'slides', 'lexique', 'repet', 'jury', 'quiz', 'jourj'] as const;
type Tab = (typeof TABS)[number];
const TAB_LABEL: Record<Tab, [string, string]> = { live: ['Live', 'mic'], slides: ['Slides', 'image'], lexique: ['Lexique', 'book'], repet: ['Répétition', 'reset'], jury: ['Jury', 'chat'], quiz: ['Quiz', 'quiz'], jourj: ['Jour J', 'flag'] };

export default function OralPage() {
  const { lang } = useT();
  const l = lang as Lang3;
  const [tab, setTab] = useState<Tab>('live');
  const [prudent, setPrudent] = useState(false);
  const [voice, setVoice] = useState<'en-US' | 'en-GB'>('en-US');
  const [prog, save] = useProg();
  voicePref = voice;
  useEffect(() => () => stopSpeak(), []);
  const slides = useMemo(() => SLIDES.map((s) => ({ ...s, sentences: s.sentences.map((x) => ({ ...x, en: prudent && x.safe ? x.safe : x.en })) })), [prudent]);

  return (
    <div className="pb-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="eyebrow mb-1">{tr(l, 'Présentation', 'Présentation', 'Presentation')}</div>
          <h2 className="text-xl font-bold sm:text-2xl">Coach oral · rm -rf /</h2>
          <p className="text-sm text-muted">{tr(l, 'Slides 9 → 12 · environ 4 minutes · en anglais', 'Slides 9 → 12 · ta9riban 4 d9aye9 · b l anglais', 'Slides 9 → 12 · about 4 minutes · in English')}</p>
        </div>
      </div>
      {!SR && <p className="mb-3 flex items-start gap-2 rounded-xl border border-warn/40 bg-warn/10 p-3 text-sm"><Icon name="alert" size={16} className="mt-0.5 shrink-0 text-warn" />{tr(l, 'Sur ce navigateur, utilise Chrome (Android ou ordinateur) pour la correction automatique.', 'F had navigateur, khdem b Chrome (Android wla PC) bach ykoun correction automatique.', 'Use Chrome (Android or desktop) for automatic speech correction.')}</p>}
      <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
        <label className="chip cursor-pointer">
          <input type="checkbox" checked={prudent} onChange={(e) => setPrudent(e.target.checked)} /> {tr(l, 'Version prudente', 'Version prudente', 'Cautious version')}
        </label>
        <select value={voice} onChange={(e) => setVoice(e.target.value as 'en-US')} className="chip bg-surface">
          <option value="en-US">English (US)</option>
          <option value="en-GB">English (UK)</option>
        </select>
        <VoicePicker lang={voice} />
      </div>
      <div className="sticky top-16 z-20 mb-4 flex gap-1 overflow-x-auto rounded-xl border border-line bg-surface/95 p-1 backdrop-blur">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition ${tab === t ? 'bg-accent text-white shadow-sm dark:text-bg' : 'text-muted hover:bg-surface2 hover:text-fg'}`}>
            <Icon name={TAB_LABEL[t][1]} size={15} /> {TAB_LABEL[t][0]}
          </button>
        ))}
      </div>
      {tab === 'live' && <LivePrompter slides={slides} l={l} />}
      {tab === 'slides' && <SlidesTab slides={slides} l={l} prog={prog} save={save} />}
      {tab === 'lexique' && <LexiconTab l={l} />}
      {tab === 'repet' && <RehearsalTab slides={slides} l={l} prog={prog} save={save} />}
      {tab === 'jury' && <JuryTab l={l} prog={prog} save={save} />}
      {tab === 'quiz' && <QuizTab />}
      {tab === 'jourj' && <DayTab l={l} />}
    </div>
  );
}

type TabProps = { slides: Slide[]; l: Lang3; prog: Prog; save: (f: (p: Prog) => Prog) => void };

/* ───────── slide preview ───────── */
function SlidePreview({ n }: { n: number }) {
  const C = { bg: '#F4F1EA', ink: '#0E0E12', red: '#FF3B30', blue: '#2B4BFF', green: '#00A86B', neon: '#3DFFA2' };
  const mono = 'font-mono text-[11px] rounded px-1.5 py-0.5';
  const term = (t: string) => (
    <code className={mono} style={{ background: C.ink, color: C.neon }}>
      {t}
    </code>
  );
  const s = SLIDES.find((x) => x.n === n)!;
  return (
    <div className="aspect-video w-full overflow-hidden rounded-2xl p-4 sm:p-6" style={{ background: C.bg, color: C.ink, fontFamily: 'Poppins, system-ui, sans-serif' }}>
      <div className="text-[10px] font-bold tracking-widest" style={{ color: C.red }}>
        {s.title.slice(0, 2)}
      </div>
      <div className="mb-3 text-lg font-extrabold sm:text-2xl">{s.title.slice(3)}</div>
      {n === 9 && (
        <div className="grid grid-cols-3 gap-2 text-[11px]">
          {[
            ['1998', 'PIXAR', 'Toy Story 2', '$ rm -r -f *'],
            ['2015', 'STEAM FOR LINUX', 'An empty variable', '$ rm -rf "$STEAMROOT/"*'],
            ['2017', 'GITLAB', 'Production database', '$ rm -rf <wrong server>']
          ].map(([y, c, d, cmd]) => (
            <div key={y} className="rounded-xl border-2 p-2" style={{ borderColor: C.ink }}>
              <div className="font-mono font-bold" style={{ color: C.red }}>{y}</div>
              <div className="font-extrabold">{c}</div>
              <div className="mb-1 opacity-70">{d}</div>
              {term(cmd)}
            </div>
          ))}
        </div>
      )}
      {n === 10 && (
        <>
          <div className="mb-2 rounded-lg p-2 font-mono text-[11px]" style={{ background: C.ink, color: C.neon }}>
            $ ls /home
            <br />
            <span style={{ color: C.red }}>ls: cannot access &apos;/home&apos;: No such file or directory</span>
          </div>
          <div className="grid grid-cols-4 gap-2 text-[11px] font-bold">
            {['Data loss', 'Downtime', 'Financial cost', 'Loss of trust'].map((x) => (
              <div key={x} className="rounded-lg border-2 p-2 text-center" style={{ borderColor: C.red }}>{x}</div>
            ))}
          </div>
        </>
      )}
      {n === 11 && (
        <div className="grid grid-cols-3 gap-2 text-[11px]">
          {['3-2-1 backups', '$ pwd && ls', '$ rm -i file', '--preserve-root', '$ sudo …', '$ trash-put file'].map((x, i) => (
            <div key={x} className="rounded-lg border-2 p-2" style={{ borderColor: C.green }}>
              <span className="font-bold" style={{ color: C.green }}>{i + 1}</span> {term(x)}
            </div>
          ))}
        </div>
      )}
      {n === 12 && (
        <>
          <blockquote className="mb-2 border-l-4 pl-2 text-sm font-semibold italic" style={{ borderColor: C.blue }}>
            “Linux does exactly what you tell it to do — even when it&apos;s a mistake.” {term('$ think --before "Enter"')}
          </blockquote>
          <div className="grid grid-cols-3 gap-2 text-[11px] font-bold">
            {['Power needs responsibility', 'Backups are the real safety net', 'Good habits prevent disasters'].map((x) => (
              <div key={x} className="rounded-lg border-2 p-2" style={{ borderColor: C.blue }}>{x}</div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ───────── clickable words ───────── */
function Words({ text, bad, onWord, hi }: { text: string; bad?: boolean[]; onWord?: (w: string) => void; hi?: number }) {
  const toks = text.split(/\s+/);
  return (
    <span>
      {toks.map((w, i) => (
        <span key={i}>
          <button
            onClick={() => onWord?.(w)}
            className={`rounded px-0.5 hover:bg-accent/20 ${bad && bad[i] === false ? 'bg-rose-500/25 text-rose-300' : ''} ${hi === i ? 'bg-accent text-bg' : ''}`}
          >
            {w}
          </button>{' '}
        </span>
      ))}
    </span>
  );
}

function wordInfo(w: string) {
  const k = norm(w);
  return LEXICON.find((x) => norm(x[0]) === k);
}

/* ───────── tab: slides + script ───────── */
function SlidesTab({ slides, l, prog, save }: TabProps) {
  const [i, setI] = useState(0);
  const [rate, setRate] = useState(1);
  const [word, setWord] = useState<string | null>(null);
  const touch = useRef<number | null>(null);
  const s = slides[i];
  const go = (d: number) => setI((x) => Math.max(0, Math.min(slides.length - 1, x + d)));
  const info = word ? wordInfo(word) : undefined;
  return (
    <div onTouchStart={(e) => (touch.current = e.touches[0].clientX)} onTouchEnd={(e) => {
      if (touch.current === null) return;
      const dx = e.changedTouches[0].clientX - touch.current;
      if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1);
      touch.current = null;
    }}>
      <div className="mb-2 flex items-center justify-between">
        <button className="btn-ghost" onClick={() => go(-1)} disabled={i === 0} aria-label="previous"><Icon name="left" size={16} /></button>
        <span className="font-semibold">Slide {s.n} / 12</span>
        <button className="btn-ghost" onClick={() => go(1)} disabled={i === slides.length - 1} aria-label="next"><Icon name="right" size={16} /></button>
      </div>
      <SlidePreview n={s.n} />
      <div className="my-3 flex items-center gap-2 text-sm">
        {[0.7, 1, 1.2].map((r) => (
          <button key={r} onClick={() => setRate(r)} className={`chip ${rate === r ? 'border-accent text-accent' : ''}`}>{r}×</button>
        ))}
        <button className="chip" onClick={() => speak(s.sentences.map((x) => x.en).join(' '), rate)}><Icon name="volume" size={14} /> {tr(l, 'Toute la slide', 'Slide kamla', 'Whole slide')}</button>
      </div>
      {word && (
        <div className="card mb-3 p-3 text-sm">
          <div className="flex items-center gap-2">
            <b className="text-lg">{word}</b>
            <button className="chip" onClick={() => speak(word, 0.8)} aria-label="listen"><Icon name="volume" size={14} /></button>
            <button className="ml-auto text-muted" onClick={() => setWord(null)} aria-label="close"><Icon name="x" size={16} /></button>
          </div>
          {info ? (
            <div className="mt-1">
              IPA <span className="font-mono">{info[1]}</span> · <b>{info[2]}</b> · <Icon name="alert" size={13} className="inline text-warn" /> {info[3]}
            </div>
          ) : (
            <div className="mt-1 text-muted">{tr(l, 'Écoute et répète.', 'Sma3 w 3awd.', 'Listen and repeat.')}</div>
          )}
        </div>
      )}
      <ol className="space-y-2">
        {s.sentences.map((x, j) => (
          <SentenceRow key={j} id={`${s.n}-${j}`} x={x} l={l} rate={rate} onWord={setWord} best={prog.best[`${s.n}-${j}`]} onScore={(sc) => save((p) => ({ ...p, best: { ...p.best, [`${s.n}-${j}`]: Math.max(sc, p.best[`${s.n}-${j}`] ?? 0) } }))} />
        ))}
      </ol>
      {s.n === 9 && (
        <details className="card mt-4 p-3 text-sm">
          <summary className="flex cursor-pointer items-center gap-2 font-semibold"><Icon name="book" size={15} /> Sources & précisions</summary>
          <ul className="mt-2 list-disc space-y-1 pl-5">{FACTS.map((f) => <li key={f}>{f}</li>)}</ul>
        </details>
      )}
      <details className="card mt-3 p-3 text-sm">
        <summary className="flex cursor-pointer items-center gap-2 font-semibold"><Icon name="tool" size={15} /> {tr(l, 'Explications techniques', 'Charh technique', 'Technical notes')}</summary>
        {TECH.map(([t, dar, fr, en]) => (
          <div key={t} className="mt-2">
            <code className="font-mono font-bold text-accent">{t}</code>
            <p>{tr(l, fr, dar, en)}</p>
          </div>
        ))}
        <SteamAnim />
      </details>
    </div>
  );
}

function SteamAnim() {
  const [empty, setEmpty] = useState(false);
  return (
    <div className="mt-3 rounded-xl bg-[#0b1020] p-3 font-mono text-xs text-emerald-300">
      <div>STEAMROOT=&quot;{empty ? '' : '/home/user/.steam'}&quot;</div>
      <div>
        rm -rf &quot;<span className={empty ? 'text-rose-400' : ''}>{empty ? '' : '/home/user/.steam'}</span>/&quot;*
        {empty && <span className="text-rose-400">  →  rm -rf &quot;/&quot;*</span>}
      </div>
      <button className="mt-2 rounded bg-emerald-400/20 px-2 py-1" onClick={() => setEmpty((e) => !e)}>{empty ? 'reset' : 'vider la variable'}</button>
    </div>
  );
}

function SentenceRow({ x, l, rate, onWord, best, onScore }: { id: string; x: Slide['sentences'][number]; l: Lang3; rate: number; onWord: (w: string) => void; best?: number; onScore: (n: number) => void }) {
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState<number | undefined>();
  const [rec, setRec] = useState<{ stop: () => void } | null>(null);
  const [res, setRes] = useState<{ text: string; ok: boolean[]; score: number } | null>(null);
  const play = () => {
    const starts: number[] = [];
    x.en.split(/\s+/).reduce((pos, w) => (starts.push(pos), pos + w.length + 1), 0);
    speak(x.en, rate, (c) => setHi(starts.filter((st) => st <= c).length - 1), () => setHi(undefined));
  };
  const record = () => {
    if (rec) return rec.stop();
    const r = listen((t, fin) => {
      if (!fin) return setRes((o) => ({ ...(o ?? { ok: [], score: 0 }), text: t }));
      const sc = scoreSpeech(x.en, t);
      setRes({ text: t, ...sc });
      onScore(sc.score);
      setRec(null);
    });
    setRec(r);
  };
  return (
    <li className="card p-3">
      <div className="text-[15px] leading-relaxed">
        <Words text={x.en} bad={res?.ok.length ? res.ok : undefined} onWord={onWord} hi={hi} />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-sm">
        <button className="chip" onClick={play} aria-label="listen"><Icon name="volume" size={14} /></button>
        {SR && <button className={`chip ${rec ? 'border-bad text-bad' : ''}`} onClick={record} aria-label="record"><Icon name={rec ? 'stop' : 'mic'} size={14} /></button>}
        <button className="chip" onClick={() => setOpen((o) => !o)} aria-label="translation"><Icon name="chat" size={14} /></button>
        {res && res.ok.length > 0 && <span className={`chip ${res.score >= 80 ? 'text-ok' : 'text-amber-400'}`}>{res.score}/100</span>}
        {best !== undefined && <span className="text-xs text-muted">best {best}</span>}
      </div>
      {res?.text && <p className="mt-1 text-xs italic text-muted">« {res.text} »</p>}
      {open && (
        <div className="mt-2 space-y-1 border-l-2 border-accent pl-3 text-sm">
          <p><b className="text-xs text-muted">DAR</b> {x.dar}</p>
          <p><b className="text-xs text-muted">FR</b> {x.fr}</p>
          {x.idea && <p className="text-muted">{tr(l, 'Idée', 'Lfikra', 'Idea')} : {x.idea}</p>}
        </div>
      )}
    </li>
  );
}

/* ───────── tab: lexicon ───────── */
function LexiconTab({ l }: { l: Lang3 }) {
  const [hard, setHard] = useState(true);
  const all = useMemo(() => {
    const known = new Set(LEXICON.map((x) => norm(x[0])));
    const extra = [...new Set(SLIDES.flatMap((s) => s.sentences.flatMap((x) => words(x.en))))].filter((w) => !known.has(w) && !/^\d/.test(w)).sort();
    return extra;
  }, []);
  return (
    <div>
      <label className="chip mb-3 cursor-pointer">
        <input type="checkbox" checked={hard} onChange={(e) => setHard(e.target.checked)} /> {tr(l, 'Mots difficiles seulement', 'Ghir lklmat s3ab', 'Hard words only')}
      </label>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-muted">
            <tr><th className="p-1">Mot</th><th className="p-1">IPA</th><th className="p-1">Kifach tgoulha</th><th className="p-1">{tr(l, 'Erreur fréquente', 'Ghalat', 'Common mistake')}</th></tr>
          </thead>
          <tbody>
            {LEXICON.map(([w, ipa, k, err]) => (
              <tr key={w} className="border-t border-line">
                <td className="p-1"><button className="font-semibold text-accent" onClick={() => speak(w, 0.8)}><Icon name="volume" size={13} className="mr-1 inline" />{w}</button></td>
                <td className="p-1 font-mono">{ipa}</td>
                <td className="p-1 font-bold">{k}</td>
                <td className="p-1 text-muted">{err}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!hard && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {all.map((w) => (
            <button key={w} className="chip" onClick={() => speak(w, 0.8)}>{w}</button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ───────── tab: rehearsal modes ───────── */
const MODES = ['Karaoké', 'Téléprompteur', 'Script qui disparaît', 'Mots-clés', 'À l’aveugle', 'Transitions', 'Répétition générale'];

function RehearsalTab({ slides, l, prog, save }: TabProps) {
  const [mode, setMode] = useState(0);
  const [i, setI] = useState(0);
  const s = slides[i];
  const text = s.sentences.map((x) => x.en).join(' ');
  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {MODES.map((m, k) => (
          <button key={m} onClick={() => setMode(k)} className={`chip text-xs ${mode === k ? 'border-accent text-accent' : ''}`}>{m}</button>
        ))}
      </div>
      {mode < 5 && (
        <div className="mb-3 flex gap-1.5">
          {slides.map((x, k) => (
            <button key={x.n} onClick={() => setI(k)} className={`chip ${i === k ? 'border-accent text-accent' : ''}`}>
              {x.n}{prog.level[x.n] ? ` · L${prog.level[x.n]}` : ''}
            </button>
          ))}
        </div>
      )}
      {mode === 0 && <Karaoke text={text} l={l} />}
      {mode === 1 && <Teleprompter text={text} />}
      {mode === 2 && <Fading s={s} l={l} level={prog.level[s.n] ?? 1} setLevel={(v) => save((p) => ({ ...p, level: { ...p.level, [s.n]: v } }))} />}
      {mode === 3 && <div className="card p-4 text-lg font-semibold"><Icon name="key" size={18} className="mr-2 inline text-accent" />{s.cues}<p className="mt-2 text-sm font-normal text-muted">{s.keywords.join(' · ')}</p></div>}
      {mode === 4 && <Blind slides={[s]} l={l} onTime={(ms) => save((p) => ({ ...p, times: { ...p.times, [s.n]: Math.min(ms, p.times[s.n] ?? Infinity) } }))} />}
      {mode === 5 && (
        <ol className="space-y-2">
          {TRANSITIONS.map((t, k) => (
            <li key={t} className="card flex items-center gap-2 p-3">
              <span className="text-xs text-muted">{['8→9', '9→10', '10→11', '11→12', 'fin'][k]}</span>
              <span className="flex-1 font-semibold">{t}</span>
              <button className="chip" onClick={() => speak(t)} aria-label="listen"><Icon name="volume" size={14} /></button>
            </li>
          ))}
          <li className="text-sm text-muted">→ $ questions --welcome</li>
        </ol>
      )}
      {mode === 6 && <Blind slides={slides} l={l} full />}
      {Object.keys(prog.times).length > 0 && (
        <p className="mt-4 text-xs text-muted">Best : {Object.entries(prog.times).map(([n, ms]) => `S${n} ${Math.round(ms / 1000)}s`).join(' · ')}</p>
      )}
    </div>
  );
}

function Karaoke({ text, l }: { text: string; l: Lang3 }) {
  const [hi, setHi] = useState<number | undefined>();
  const [rate, setRate] = useState(0.9);
  const starts = useMemo(() => {
    const a: number[] = [];
    text.split(/\s+/).reduce((pos, w) => (a.push(pos), pos + w.length + 1), 0);
    return a;
  }, [text]);
  return (
    <div>
      <div className="mb-2 flex items-center gap-2 text-sm">
        <button className="btn-primary" onClick={() => speak(text, rate, (c) => setHi(starts.filter((x) => x <= c).length - 1), () => setHi(undefined))}><Icon name="play" size={15} /> {tr(l, 'Lire avec la voix', '9ra m3a sout', 'Read along')}</button>
        <button className="chip" onClick={() => { stopSpeak(); setHi(undefined); }} aria-label="stop"><Icon name="stop" size={13} /></button>
        <input type="range" min={0.6} max={1.3} step={0.1} value={rate} onChange={(e) => setRate(+e.target.value)} /> {rate}×
      </div>
      <div className="card p-4 text-xl leading-relaxed">
        <Words text={text} hi={hi} />
      </div>
    </div>
  );
}

function Teleprompter({ text }: { text: string }) {
  const [speed, setSpeed] = useState(130);
  const [run, setRun] = useState(false);
  const [mirror, setMirror] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!run || !box.current) return;
    const el = box.current;
    const n = words(text).length;
    const pxPerMs = (el.scrollHeight - el.clientHeight) / ((n / speed) * 60000);
    let last = performance.now();
    let id = 0;
    const tick = (t: number) => {
      el.scrollTop += pxPerMs * (t - last);
      last = t;
      if (el.scrollTop + el.clientHeight < el.scrollHeight - 1) id = requestAnimationFrame(tick);
      else setRun(false);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [run, speed, text]);
  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
        <button className="btn-primary" onClick={() => setRun((r) => !r)} aria-label="play"><Icon name={run ? 'pause' : 'play'} size={15} /></button>
        <button className="chip" onClick={() => { if (box.current) box.current.scrollTop = 0; }} aria-label="restart"><Icon name="reset" size={13} /></button>
        <input type="range" min={90} max={170} value={speed} onChange={(e) => setSpeed(+e.target.value)} /> {speed} mots/min
        <label className="chip"><input type="checkbox" checked={mirror} onChange={(e) => setMirror(e.target.checked)} /> miroir</label>
        <button className="chip" onClick={() => box.current?.requestFullscreen?.()} aria-label="fullscreen"><Icon name="maximize" size={13} /></button>
      </div>
      <div ref={box} className="h-[55vh] overflow-y-auto rounded-2xl bg-[#0a1424] px-6 py-[25vh] text-3xl font-semibold leading-snug text-white" style={mirror ? { transform: 'scaleX(-1)' } : undefined}>
        {text}
      </div>
    </div>
  );
}

function Fading({ s, l, level, setLevel }: { s: Slide; l: Lang3; level: number; setLevel: (v: number) => void }) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2 text-sm">
        <span>{tr(l, 'Niveau', 'Niveau', 'Level')}</span>
        {[0, 1, 2, 3, 4].map((v) => (
          <button key={v} onClick={() => setLevel(v)} className={`chip ${level === v ? 'border-accent text-accent' : ''}`}>{v}</button>
        ))}
        <button className="btn-ghost btn-sm ml-auto" onClick={() => setLevel(Math.min(4, level + 1))}>+25 % <Icon name="right" size={14} /></button>
      </div>
      <div className="card space-y-2 p-4 text-lg leading-relaxed">
        {s.sentences.map((x, k) => <p key={k}>{maskWords(x.en, level, s.keywords)}</p>)}
      </div>
    </div>
  );
}

function Blind({ slides, l, full, onTime }: { slides: Slide[]; l: Lang3; full?: boolean; onTime?: (ms: number) => void }) {
  const [k, setK] = useState(0);
  const [start, setStart] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [marks, setMarks] = useState<number[]>([]);
  const [said, setSaid] = useState('');
  const [report, setReport] = useState<null | { ms: number; per: number[]; said: string }>(null);
  const rec = useRef<{ stop: () => void } | null>(null);
  useEffect(() => {
    if (start === null) return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [start]);
  const begin = () => {
    setReport(null);
    setSaid('');
    setK(0);
    setMarks([]);
    const t = Date.now();
    setStart(t);
    setNow(t);
    rec.current = listen((txt) => setSaid(txt), true);
  };
  const next = () => {
    const t = Date.now();
    const m = [...marks, t];
    setMarks(m);
    if (k < slides.length - 1) return setK(k + 1);
    rec.current?.stop();
    const st = start!;
    const per = m.map((x, j) => x - (j ? m[j - 1] : st));
    setReport({ ms: t - st, per, said });
    setStart(null);
    if (!full) onTime?.(t - st);
  };
  const el = start ? now - start : 0;
  const target = full ? 240000 : 60000;
  const all = slides.flatMap((s) => s.sentences.map((x) => x.en)).join(' ');
  return (
    <div>
      {start === null ? (
        <button className="btn-primary mb-3" onClick={begin}><Icon name="play" size={15} /> {full ? tr(l, 'Répétition générale (4 slides)', 'Répétition générale (4 slides)', 'Full run (4 slides)') : tr(l, 'Commencer à l’aveugle', 'Bda bla script', 'Start blind')}</button>
      ) : (
        <div className="mb-3 flex items-center gap-3">
          <span className={`font-mono text-3xl font-bold ${el > (full ? 300000 : 60000) ? 'text-rose-400' : el > (full ? 240000 : 45000) ? 'text-amber-400' : 'text-ok'}`}>
            {Math.floor(el / 60000)}:{String(Math.floor(el / 1000) % 60).padStart(2, '0')}
          </span>
          <span className="text-sm text-muted">/ {target / 60000}:00</span>
          <button className="btn-primary ml-auto" onClick={next}>{k < slides.length - 1 ? <>Slide suivante <Icon name="right" size={15} /></> : <><Icon name="stop" size={15} /> Fin</>}</button>
        </div>
      )}
      {start !== null && <SlidePreview n={slides[k].n} />}
      {start !== null && said && <p className="mt-2 text-xs italic text-muted">{said.slice(-160)}</p>}
      {report && (
        <div className="card mt-3 space-y-1 p-4 text-sm">
          <b className="flex items-center gap-2"><Icon name="chart" size={15} /> Rapport</b>
          {report.per.map((ms, j) => (
            <div key={j} className={ms >= 45000 && ms <= 60000 ? 'text-ok' : 'text-amber-400'}>Slide {slides[j].n} : {Math.round(ms / 1000)} s {ms >= 45000 && ms <= 60000 ? 'OK' : '(cible 45–60 s)'}</div>
          ))}
          <div>Total : {Math.round(report.ms / 1000)} s {full && (report.ms > 300000 ? '— plus de 5 min' : '')}</div>
          {report.said ? (
            <>
              <div>Débit : {wpm(words(report.said).length, report.ms)} mots/min (cible 120–140)</div>
              <div>Remplissage (euh, um, like) : {countFillers(report.said)}</div>
              <div>
                Mots-clés oubliés :{' '}
                {(() => {
                  const sp = new Set(words(report.said));
                  const miss = slides.flatMap((s) => s.keywords).filter((w) => !sp.has(norm(w)));
                  return miss.length ? miss.join(', ') : 'aucun';
                })()}
              </div>
              <div>Score global : {scoreSpeech(all, report.said).score}/100</div>
            </>
          ) : (
            <div className="text-muted">{tr(l, 'Pas de reconnaissance vocale : auto-évalue-toi.', 'Ma kaynach reconnaissance : 9iyyem rasek.', 'No speech recognition: self-assess.')}</div>
          )}
        </div>
      )}
    </div>
  );
}

/* ───────── tab: jury ───────── */
function JuryTab({ l, prog, save }: { l: Lang3; prog: Prog; save: (f: (p: Prog) => Prog) => void }) {
  const [k, setK] = useState(0);
  const [show, setShow] = useState(false);
  const [ans, setAns] = useState('');
  const [rec, setRec] = useState<{ stop: () => void } | null>(null);
  const [q, model, dar, kw] = QA[k];
  const go = (d: number) => {
    setK((k + d + QA.length) % QA.length);
    setShow(false);
    setAns('');
  };
  const reveal = () => {
    setShow(true);
    save((p) => ({ ...p, qa: p.qa.includes(k) ? p.qa : [...p.qa, k] }));
  };
  const sp = new Set(words(ans));
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <button className="btn-ghost" onClick={() => go(-1)} aria-label="previous"><Icon name="left" size={16} /></button>
        <span>{k + 1} / {QA.length} · {prog.qa.length} {tr(l, 'répondues', 'jawbti', 'answered')} {prog.qa.length >= 15 && <span className="chip text-ok"><Icon name="award" size={13} /> Jury proof</span>}</span>
        <button className="btn-ghost" onClick={() => go(1)} aria-label="next"><Icon name="right" size={16} /></button>
      </div>
      <div className="card p-4">
        <p className="text-lg font-semibold">{q}</p>
        <div className="mt-2 flex gap-2">
          <button className="chip" onClick={() => speak(q)}><Icon name="volume" size={13} /> {tr(l, 'Question du jury', 'Sou2al dyal jury', 'Jury asks')}</button>
          {SR && (
            <button className={`chip ${rec ? 'border-rose-400 text-rose-400' : ''}`} onClick={() => {
              if (rec) return rec.stop();
              setRec(listen((t, fin) => { setAns(t); if (fin) setRec(null); }));
            }}>{rec ? <Icon name="stop" size={13} /> : <><Icon name="mic" size={13} /> {tr(l, 'Répondre', 'Jaweb', 'Answer')}</>}</button>
          )}
          <button className="chip" onClick={reveal}><Icon name="eye" size={13} /> {tr(l, 'Réponse modèle', 'Jawab namoudaji', 'Model answer')}</button>
        </div>
        {ans && <p className="mt-2 text-sm italic text-muted">« {ans} »</p>}
        {show && (
          <div className="mt-3 space-y-2 border-l-2 border-accent pl-3 text-sm">
            <p><b>EN :</b> {model} <button onClick={() => speak(model)} aria-label="listen"><Icon name="volume" size={13} className="inline" /></button></p>
            <p><b className="text-xs text-muted">DAR</b> {dar}</p>
            {ans && <p>{kw.map((w) => <span key={w} className={`mr-2 inline-flex items-center gap-1 ${sp.has(norm(w)) ? 'text-ok' : 'text-bad'}`}><Icon name={sp.has(norm(w)) ? 'check' : 'x'} size={12} /> {w}</span>)}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

/* ───────── tab: quiz ───────── */
function QuizTab() {
  const [k, setK] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  if (k >= QUIZ.length)
    return (
      <div className="card p-6 text-center">
        <p className="text-2xl font-bold">{score} / {QUIZ.length}</p>
        <button className="btn-ghost mt-3" onClick={() => { setK(0); setScore(0); setPick(null); }}><Icon name="reset" size={15} /> Recommencer</button>
      </div>
    );
  const [q, opts, ok] = QUIZ[k];
  return (
    <div className="card p-4">
      <p className="mb-1 text-xs text-muted">{k + 1} / {QUIZ.length} · score {score}</p>
      <p className="mb-3 font-semibold">{q}</p>
      <div className="grid gap-2">
        {opts.map((o, j) => (
          <button
            key={o}
            disabled={pick !== null}
            onClick={() => { setPick(j); if (j === ok) setScore(score + 1); }}
            className={`rounded-xl border p-3 text-left ${pick === null ? 'border-line hover:border-accent' : j === ok ? 'border-ok bg-ok/10' : j === pick ? 'border-bad bg-bad/10' : 'border-line opacity-60'}`}
          >
            {o}
          </button>
        ))}
      </div>
      {pick !== null && <button className="btn-primary mt-3" onClick={() => { setK(k + 1); setPick(null); }}>Suivant <Icon name="right" size={15} /></button>}
    </div>
  );
}

/* ───────── tab: Jour J ───────── */
function DayTab({ l }: { l: Lang3 }) {
  const [done, setDone] = useState<boolean[]>([]);
  const first = SLIDES[0].sentences[0].en;
  const last = SLIDES[3].sentences.slice(-2).map((x) => x.en).join(' ');
  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h2 className="mb-2 flex items-center gap-2 font-bold"><Icon name="checkCircle" size={17} className="text-accent" /> Checklist</h2>
        {CHECKLIST.map((c, j) => (
          <label key={c} className="flex items-center gap-2 py-1 text-sm">
            <input type="checkbox" checked={!!done[j]} onChange={(e) => setDone((d) => Object.assign([...d], { [j]: e.target.checked }))} /> {c}
          </label>
        ))}
      </div>
      <div className="card p-4">
        <h2 className="mb-2 flex items-center gap-2 font-bold"><Icon name="flame" size={17} className="text-accent" /> {tr(l, 'Échauffement 5 min', 'Échauffement 5 d9aye9', '5-min warm-up')}</h2>
        <div className="mb-2 flex flex-wrap gap-1.5">
          {WARMUP.map((w) => <button key={w} className="chip" onClick={() => speak(w, 0.8)}><Icon name="volume" size={13} /> {w}</button>)}
        </div>
        <p className="text-sm"><b>×3</b> {first} <button onClick={() => speak(first)} aria-label="listen"><Icon name="volume" size={13} className="inline" /></button></p>
        <p className="mt-1 text-sm"><b>×3</b> {last} <button onClick={() => speak(last)} aria-label="listen"><Icon name="volume" size={13} className="inline" /></button></p>
      </div>
    </div>
  );
}

/** Choose the clearest installed voice (saved per language). */
function VoicePicker({ lang }: { lang: string }) {
  const [list, setList] = useState<SpeechSynthesisVoice[]>([]);
  const [cur, setCur] = useState('');
  useEffect(() => {
    let alive = true;
    void listVoices(lang).then((v) => {
      if (!alive) return;
      setList(v);
      let saved = '';
      try {
        saved = localStorage.getItem(`rev24-voice-${lang.slice(0, 2)}`) ?? '';
      } catch {
        /* ignore */
      }
      setCur(v.some((x) => x.name === saved) ? saved : (v[0]?.name ?? ''));
    });
    return () => {
      alive = false;
    };
  }, [lang]);
  if (!list.length) return null;
  return (
    <>
      <select
        value={cur}
        onChange={(e) => {
          setCur(e.target.value);
          setPreferredVoice(lang, e.target.value);
          speak('Linux does exactly what you tell it.', 1);
        }}
        className="chip max-w-[220px] bg-surface"
        aria-label="voice"
      >
        {list.map((v, i) => (
          <option key={v.name} value={v.name}>
            {v.name}
            {i === 0 ? ' (recommandée)' : ''}
          </option>
        ))}
      </select>
      <button className="chip" onClick={() => speak('Linux does exactly what you tell it.', 1)}><Icon name="play" size={13} /> test</button>
    </>
  );
}
