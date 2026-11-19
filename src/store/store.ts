import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Lang } from '../lib/schema';
import { updateQStat, type QStat } from '../lib/quiz';
import { review, newCard, type CardState, type Grade } from '../lib/sm2';

export interface ExamRecord {
  module: string;
  date: number;
  note: number;
  ok: number;
  total: number;
  perChapter: Record<string, { ok: number; total: number }>;
}

export interface State {
  lang: Lang;
  theme: 'dark' | 'light';
  bilingual: boolean;
  xp: number;
  streak: { last: string; count: number };
  qstats: Record<string, QStat>;
  exercises: Record<string, 'ok' | 'ko'>;
  cards: Record<string, CardState>;
  read: Record<string, boolean>; // chapterId -> read
  missions: Record<string, boolean>;
  exams: ExamRecord[];
  badges: string[];
  /** reading position per chapter ("module/chapter" -> last section reached, % read) — saved on this device */
  chapterPos: Record<string, { section: number; pct: number; at: number }>;
  /** last page studied, for the "resume" card */
  lastVisit: { path: string; module: string; chapter?: string; at: number } | null;
  /** steps already revealed in step-by-step explanations ("chapter/section" -> count) */
  stepsSeen: Record<string, number>;
  lastBadge: string | null;
  lastModule: string;
  achievements: Record<string, boolean>;
  achieve: (k: string) => void;
  setLastModule: (m: string) => void;
  setLang: (l: Lang) => void;
  setTheme: (t: 'dark' | 'light') => void;
  setBilingual: (b: boolean) => void;
  answer: (qid: string, ok: boolean, xp: number) => void;
  setExercise: (id: string, ok: boolean) => void;
  gradeCard: (id: string, g: Grade) => void;
  markRead: (chapterId: string) => void;
  completeMission: (id: string) => void;
  addExam: (e: ExamRecord) => void;
  setChapterPos: (key: string, section: number, pct: number) => void;
  setLastVisit: (v: { path: string; module: string; chapter?: string }) => void;
  setStepsSeen: (key: string, n: number) => void;
  unlock: (badge: string) => void;
  clearLastBadge: () => void;
  importData: (d: Partial<State>) => void;
  resetAll: () => void;
}

const today = () => new Date().toISOString().slice(0, 10);

function bumpStreak(s: { last: string; count: number }): { last: string; count: number } {
  const t = today();
  if (s.last === t) return s;
  const y = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  return { last: t, count: s.last === y ? s.count + 1 : 1 };
}

const initial = {
  lang: 'fr' as Lang,
  theme: 'light' as 'dark' | 'light',
  bilingual: false,
  xp: 0,
  streak: { last: '', count: 0 },
  qstats: {},
  exercises: {},
  cards: {},
  read: {},
  missions: {},
  exams: [],
  badges: [],
  chapterPos: {} as Record<string, { section: number; pct: number; at: number }>,
  lastVisit: null as { path: string; module: string; chapter?: string; at: number } | null,
  stepsSeen: {} as Record<string, number>,
  lastBadge: null,
  lastModule: 'linux',
  achievements: {} as Record<string, boolean>
};

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      ...initial,
      setLang: (lang) => {
        document.documentElement.lang = lang === 'dar' ? 'ar-MA' : lang;
        set({ lang });
      },
      setTheme: (theme) => {
        try {
          localStorage.setItem('rev24-theme', theme);
        } catch {
          /* private mode */
        }
        document.documentElement.classList.toggle('dark', theme === 'dark');
        set({ theme });
      },
      setBilingual: (bilingual) => set({ bilingual }),
      setLastModule: (lastModule) => set({ lastModule }),
      achieve: (k) => set((s) => (s.achievements[k] ? s : { achievements: { ...s.achievements, [k]: true }, xp: s.xp + 50 })),
      answer: (qid, ok, xp) =>
        set((s) => ({
          qstats: { ...s.qstats, [qid]: updateQStat(s.qstats[qid], ok) },
          xp: s.xp + (ok ? xp : 1),
          streak: bumpStreak(s.streak)
        })),
      setExercise: (id, ok) => set((s) => ({ exercises: { ...s.exercises, [id]: ok ? 'ok' : 'ko' }, xp: s.xp + (ok ? 40 : 5), streak: bumpStreak(s.streak) })),
      gradeCard: (id, g) => set((s) => ({ cards: { ...s.cards, [id]: review(s.cards[id] ?? newCard(), g) }, xp: s.xp + 2, streak: bumpStreak(s.streak) })),
      markRead: (chapterId) => set((s) => ({ read: { ...s.read, [chapterId]: true }, xp: s.read[chapterId] ? s.xp : s.xp + 30, streak: bumpStreak(s.streak) })),
      completeMission: (id) => set((s) => ({ missions: { ...s.missions, [id]: true }, xp: s.missions[id] ? s.xp : s.xp + 60 })),
      addExam: (e) => set((s) => ({ exams: [...s.exams, e], xp: s.xp + Math.round(e.note * 5) })),
      setChapterPos: (key, section, pct) =>
        set((s) => {
          const prev = s.chapterPos[key];
          if (prev && prev.section === section && Math.abs(prev.pct - pct) < 2) return s;
          return { chapterPos: { ...s.chapterPos, [key]: { section, pct: Math.max(pct, prev?.pct ?? 0), at: Date.now() } } };
        }),
      setLastVisit: (v) => set({ lastVisit: { ...v, at: Date.now() } }),
      setStepsSeen: (key, n) => set((s) => (s.stepsSeen[key] >= n ? s : { stepsSeen: { ...s.stepsSeen, [key]: n } })),
      unlock: (badge) => {
        if (get().badges.includes(badge)) return;
        set((s) => ({ badges: [...s.badges, badge], lastBadge: badge }));
      },
      clearLastBadge: () => set({ lastBadge: null }),
      importData: (d) =>
        set((s) => ({
          ...s,
          ...Object.fromEntries(Object.entries(d).filter(([k]) => k in initial))
        })),
      resetAll: () => set({ ...initial, lang: get().lang, theme: get().theme })
    }),
    {
      name: 'rev24',
      version: 3,
      // v1 -> v2: the 24h mode was removed; keep every other piece of progress
      // v2 -> v3: the site is white by default — reset the old dark default once (the user can switch again)
      migrate: (old, version) => {
        const o = { ...(old as Record<string, unknown>) };
        delete o.rev24;
        delete o.rev24Done;
        if (version < 3) {
          o.theme = 'light';
          o.bilingual = false;
          try {
            localStorage.setItem('rev24-theme', 'light');
          } catch {
            /* private mode */
          }
        }
        return o as unknown as State;
      },
      storage: createJSONStorage(() => {
        try {
          localStorage.setItem('__t', '1');
          localStorage.removeItem('__t');
          return localStorage;
        } catch {
          const mem = new Map<string, string>();
          return { getItem: (k) => mem.get(k) ?? null, setItem: (k, v) => void mem.set(k, v), removeItem: (k) => void mem.delete(k) };
        }
      }),
      partialize: (s) => Object.fromEntries(Object.entries(s).filter(([k, v]) => typeof v !== 'function' && k !== 'lastBadge')) as Partial<State>
    }
  )
);

export const EXPORT_KEYS = Object.keys(initial).filter((k) => k !== 'lastBadge');
