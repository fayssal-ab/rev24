/**
 * Text-to-speech with fallback.
 * 1. Browser speechSynthesis when a voice for the language exists (Chrome, Edge, Android, Safari).
 * 2. Otherwise (Brave / Linux often have no voices): explain once how to get a voice.
 */

export interface SpeakOpts {
  lang?: string; // 'en-US' | 'en-GB' | 'fr-FR'
  rate?: number;
  onWord?: (charIndex: number) => void;
  onEnd?: () => void;
}

let token = 0;

const synth = () => (typeof window !== 'undefined' ? window.speechSynthesis : undefined);

function voicesReady(): Promise<SpeechSynthesisVoice[]> {
  const s = synth();
  if (!s) return Promise.resolve([]);
  const v = s.getVoices();
  if (v.length) return Promise.resolve(v);
  return new Promise((res) => {
    const done = () => res(s.getVoices());
    s.addEventListener?.('voiceschanged', done, { once: true });
    setTimeout(done, 800);
  });
}

/** Score a voice: natural / neural / Google / Microsoft Online / Apple premium voices first, robotic ones last. */
function quality(v: SpeechSynthesisVoice, lang: string): number {
  const n = v.name.toLowerCase();
  const l = v.lang.replace('_', '-');
  let q = 0;
  if (l === lang) q += 20;
  else if (l.startsWith(lang.slice(0, 2))) q += 10;
  else return -1;
  if (/natural|neural|online/.test(n)) q += 50;
  if (/google/.test(n)) q += 40;
  if (/microsoft/.test(n)) q += 15;
  if (/premium|enhanced|siri/.test(n)) q += 35;
  if (/samantha|daniel|karen|moira|aria|jenny|guy|ava|allison|thomas|amelie|denise|henri/.test(n)) q += 20;
  if (/espeak|mbrola|festival|pico|robot/.test(n)) q -= 60;
  if (!v.localService) q += 5; // cloud voices sound better
  return q;
}

const PREF = (lang: string) => `rev24-voice-${lang.slice(0, 2)}`;

/** Available voices for a language, best first. */
export async function listVoices(lang: string): Promise<SpeechSynthesisVoice[]> {
  const vs = await voicesReady();
  return vs.filter((v) => quality(v, lang) >= 0).sort((a, b) => quality(b, lang) - quality(a, lang));
}

export function setPreferredVoice(lang: string, name: string) {
  try {
    localStorage.setItem(PREF(lang), name);
  } catch {
    /* ignore */
  }
}

function pickVoice(voices: SpeechSynthesisVoice[], lang: string) {
  let pref: string | null = null;
  try {
    pref = localStorage.getItem(PREF(lang));
  } catch {
    /* ignore */
  }
  const chosen = pref && voices.find((v) => v.name === pref);
  if (chosen) return chosen;
  return voices.filter((v) => quality(v, lang) >= 0).sort((a, b) => quality(b, lang) - quality(a, lang))[0];
}

export function stopSpeak() {
  token++;
  synth()?.cancel();
}

/** Clean text for reading: strip markdown, code ticks, LaTeX. */
export function plain(s: string) {
  return s
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/\$[^$]*\$/g, ' ')
    .replace(/[*_`#>|]/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Split into chunks ≤ max chars on sentence / word boundaries (online TTS limit). */
export function chunks(text: string, max = 180): { t: string; start: number }[] {
  const out: { t: string; start: number }[] = [];
  let i = 0;
  while (i < text.length) {
    let end = Math.min(text.length, i + max);
    if (end < text.length) {
      const cut = Math.max(text.lastIndexOf('. ', end), text.lastIndexOf('? ', end), text.lastIndexOf('! ', end), text.lastIndexOf(', ', end));
      end = cut > i + 40 ? cut + 1 : Math.max(text.lastIndexOf(' ', end), i + 1);
    }
    const t = text.slice(i, end).trim();
    if (t) out.push({ t, start: i });
    i = end;
  }
  return out;
}

export async function speak(text: string, o: SpeakOpts = {}) {
  stopSpeak();
  const my = token;
  const lang = o.lang ?? 'en-US';
  const rate = o.rate ?? 1;
  const voices = await voicesReady();
  if (my !== token) return;
  const voice = pickVoice(voices, lang);
  const s = synth();
  if (s && voice) {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = voice.lang;
    u.voice = voice;
    u.rate = rate;
    if (o.onWord) u.onboundary = (e) => o.onWord!(e.charIndex);
    let started = false;
    u.onstart = () => (started = true);
    u.onend = () => my === token && o.onEnd?.();
    u.onerror = () => my === token && !started && online(text, lang, rate, my, o);
    // Chrome bug: speak() right after cancel() is sometimes dropped
    setTimeout(() => my === token && s.speak(u), 60);
    setTimeout(() => {
      if (my === token && !started && !s.speaking) {
        s.cancel();
        online(text, lang, rate, my, o);
      }
    }, 1500);
    return;
  }
  online(text, lang, rate, my, o);
}

let warned = false;
/** No usable voice: stop and explain once how to get one. */
function online(_text: string, _lang: string, _rate: number, _my: number, o: SpeakOpts) {
  o.onEnd?.();
  if (warned) return;
  warned = true;
  alert(
    "🔇 Ce navigateur n'a pas de voix de synthèse.\n\n• Brave : la synthèse vocale est souvent bloquée → utilise Google Chrome ou Edge (ou ton téléphone).\n• Linux : installe une voix : sudo apt install speech-dispatcher espeak-ng, puis redémarre le navigateur.\n\nNavigateur ma fihch sout : khdem b Chrome, Edge wla telephone."
  );
}
