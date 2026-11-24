/**
 * Group chat, docked on the right like a casino-site chat (Stake / Rainbet): open or hide it with the bubble,
 * the choice is remembered. Only the last 20 messages exist (the API deletes older ones). Links are clickable.
 * Clicking a name opens that member's profile: picture, activity and what they studied.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { create } from 'zustand';
import { AnimatePresence, motion } from 'framer-motion';
import { api, authEnabled, useApproved, useAuth, useIsAdmin } from '../auth/auth';
import { useT, useL } from '../hooks/useT';
import { MODULES } from '../lib/content';
import { useAllModules } from '../hooks/useModule';
import { Avatar } from './Avatar';
import { Icon } from './Icon';

interface ChatMessage {
  id: number;
  body: string;
  at: string;
  user: { id: string; name: string; avatar: string | null; admin: boolean };
}

const OPEN_KEY = 'g22-chat-open';
const SEEN_KEY = 'g22-chat-seen';
const KEEP = 20;

/** Panel open / closed (remembered on the device); the layout reads it to make room on wide screens. */
export const useChat = create<{ open: boolean; profile: string | null; setOpen: (o: boolean) => void; showProfile: (id: string | null) => void }>((set) => ({
  open: typeof localStorage !== 'undefined' && localStorage.getItem(OPEN_KEY) === '1',
  profile: null,
  setOpen: (open) => {
    try {
      localStorage.setItem(OPEN_KEY, open ? '1' : '0');
    } catch {
      /* private mode */
    }
    set({ open });
  },
  showProfile: (profile) => set({ profile })
}));

/** Whether the chat exists for this visitor (signed in and approved). */
export const useChatEnabled = () => {
  const approved = useApproved();
  const user = useAuth((s) => s.user);
  return authEnabled && approved && !!user;
};

/** Text with clickable http(s) links (opened in a new tab, no referrer). */
function Linkified({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s<>"']+)/g);
  return (
    <>
      {parts.map((p, i) =>
        /^https?:\/\//.test(p) ? (
          <a key={i} href={p.replace(/[.,;:!?)]+$/, '')} target="_blank" rel="noopener noreferrer nofollow" className="break-all font-medium text-accent underline underline-offset-2 hover:opacity-80">
            {p}
          </a>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}

function timeOf(iso: string, locale: string) {
  return new Date(iso).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
}

export function ChatDock() {
  const enabled = useChatEnabled();
  if (!enabled) return null;
  return <ChatDockInner />;
}

function ChatDockInner() {
  const { t, lang } = useT();
  const me = useAuth((s) => s.user);
  const isAdmin = useIsAdmin();
  const { open, setOpen, showProfile } = useChat();
  const [msgs, setMsgs] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [seen, setSeen] = useState(() => Number(localStorage.getItem(SEEN_KEY) ?? 0) || 0);
  const list = useRef<HTMLDivElement>(null);
  const lastId = msgs.at(-1)?.id ?? 0;
  const locale = lang === 'en' ? 'en-GB' : 'fr-FR';

  const merge = useCallback((incoming: ChatMessage[], full: boolean) => {
    setMsgs((cur) => {
      const base = full ? [] : cur;
      const ids = new Set(base.map((m) => m.id));
      return [...base, ...incoming.filter((m) => !ids.has(m.id))].sort((a, b) => a.id - b.id).slice(-KEEP);
    });
  }, []);

  // full list now and every 30 s (picks up deletions), new messages only in between when open
  const refresh = useCallback(async () => {
    const r = await api<{ messages: ChatMessage[] }>('GET', '/chat');
    if (r.ok) merge(r.data.messages, true);
  }, [merge]);
  useEffect(() => {
    void refresh();
    const id = setInterval(() => document.visibilityState === 'visible' && void refresh(), open ? 30_000 : 20_000);
    return () => clearInterval(id);
  }, [refresh, open]);
  const lastRef = useRef(0);
  lastRef.current = lastId;
  useEffect(() => {
    if (!open) return;
    const id = setInterval(async () => {
      if (document.visibilityState !== 'visible') return;
      const r = await api<{ messages: ChatMessage[] }>('GET', `/chat?after=${lastRef.current}`);
      if (r.ok && r.data.messages.length) merge(r.data.messages, false);
    }, 4000);
    return () => clearInterval(id);
  }, [open, merge]);

  // read marker + scroll to the newest message
  useEffect(() => {
    if (!open || !lastId) return;
    setSeen(lastId);
    localStorage.setItem(SEEN_KEY, String(lastId));
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: 'smooth' });
  }, [open, lastId]);
  const unread = open ? 0 : msgs.filter((m) => m.id > seen && m.user.id !== me?.id).length;

  const send = async (e: FormEvent) => {
    e.preventDefault();
    const body = text.trim();
    if (!body) return;
    setErr(null);
    const r = await api<{ messages: ChatMessage[] }>('POST', '/chat', { body });
    if (!r.ok) return setErr(r.error === 'too_fast' ? t('chat.tooFast') : t('chat.error'));
    setText('');
    merge(r.data.messages, true);
  };
  const remove = async (m: ChatMessage) => {
    const r = await api<{ messages: ChatMessage[] }>('DELETE', `/admin/chat/${m.id}`);
    if (r.ok) merge(r.data.messages, true);
  };

  return (
    <>
      {/* bubble: opens / hides the chat */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-accent text-white shadow-[0_10px_30px_-8px_rgba(0,132,78,0.7)] transition hover:scale-105 active:scale-95"
          aria-label={t('chat.open')}
          data-testid="chat-open"
        >
          <Icon name="chat" size={24} />
          {unread > 0 && <span className="absolute -right-1 -top-1 grid h-6 min-w-6 place-items-center rounded-full bg-bad px-1.5 text-[11px] font-bold">{unread > 9 ? '9+' : unread}</span>}
        </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-0 right-0 top-0 z-50 flex w-full flex-col border-l border-line bg-surface shadow-2xl sm:w-[22rem] xl:shadow-none"
            aria-label={t('chat.title')}
            data-testid="chat-panel"
          >
            <header className="flex items-center gap-2 border-b border-line px-4 py-3">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent/10 text-accent">
                <Icon name="chat" size={17} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-semibold leading-tight">{t('chat.title')}</div>
                <div className="text-[11px] text-muted">{t('chat.keep')}</div>
              </div>
              <button className="grid h-9 w-9 place-items-center rounded-lg border border-line text-muted transition hover:text-fg" onClick={() => setOpen(false)} aria-label={t('chat.hide')} title={t('chat.hide')} data-testid="chat-hide">
                <Icon name="right" size={18} />
              </button>
            </header>

            <div ref={list} className="scroll-thin flex-1 space-y-3 overflow-y-auto px-3 py-4">
              {!msgs.length && <p className="px-2 py-10 text-center text-sm text-muted">{t('chat.empty')}</p>}
              {msgs.map((m) => {
                const mine = m.user.id === me?.id;
                return (
                  <div key={m.id} className="group flex gap-2.5" data-testid="chat-msg">
                    <button onClick={() => showProfile(m.user.id)} className="mt-0.5 shrink-0 rounded-full transition hover:opacity-80" aria-label={m.user.name}>
                      <Avatar name={m.user.name} src={m.user.avatar} size={32} />
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        <button onClick={() => showProfile(m.user.id)} className={`truncate text-[13px] font-semibold hover:underline ${mine ? 'text-accent' : ''}`}>
                          {m.user.name}
                        </button>
                        {m.user.admin && <span className="rounded bg-accent px-1 text-[9px] font-bold uppercase text-white">Admin</span>}
                        <span className="ml-auto shrink-0 font-mono text-[10px] text-muted">{timeOf(m.at, locale)}</span>
                        {isAdmin && (
                          <button onClick={() => void remove(m)} className="shrink-0 text-muted opacity-0 transition hover:text-bad group-hover:opacity-100" aria-label={t('chat.delete')} title={t('chat.delete')}>
                            <Icon name="trash" size={13} />
                          </button>
                        )}
                      </div>
                      <p className={`mt-0.5 whitespace-pre-line break-words rounded-lg rounded-tl-sm px-3 py-2 text-[14px] leading-snug ${mine ? 'bg-accent/10' : 'bg-surface2'}`}>
                        <Linkified text={m.body} />
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={send} className="border-t border-line p-3">
              {err && <p className="mb-2 text-xs text-bad">{err}</p>}
              <div className="flex items-end gap-2">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      void send(e);
                    }
                  }}
                  rows={1}
                  maxLength={500}
                  placeholder={t('chat.placeholder')}
                  className="input max-h-28 min-h-[44px] flex-1 resize-none !py-2.5 text-sm"
                  data-testid="chat-input"
                />
                <button className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent text-white transition hover:opacity-90 disabled:opacity-40" disabled={!text.trim()} aria-label={t('chat.send')} data-testid="chat-send">
                  <Icon name="arrowRight" size={18} />
                </button>
              </div>
            </form>
          </motion.aside>
        )}
      </AnimatePresence>
      <MemberProfile />
    </>
  );
}

// ---------------------------------------------------------------- a member's profile
interface Profile {
  id: string;
  displayName: string;
  groupe: string;
  avatar: string | null;
  createdAt: string;
  online: boolean;
  seenAgo: number | null;
  study: {
    xp: number;
    streak: number;
    read: string[];
    inProgress: { key: string; pct: number }[];
    exams: { module: string; note: number; date: number }[];
    exercisesOk: number;
    questions: number;
    lastVisit: { module: string; chapter: string; at: number } | null;
  };
}

function ago(sec: number, t: (k: 'chat.ago.now' | 'chat.ago.min' | 'chat.ago.h' | 'chat.ago.d') => string) {
  if (sec < 60) return t('chat.ago.now');
  if (sec < 3600) return t('chat.ago.min').replace('{n}', String(Math.floor(sec / 60)));
  if (sec < 86400) return t('chat.ago.h').replace('{n}', String(Math.floor(sec / 3600)));
  return t('chat.ago.d').replace('{n}', String(Math.floor(sec / 86400)));
}

function Stat({ icon, value, label }: { icon: string; value: ReactNode; label: string }) {
  return (
    <div className="rounded-lg border border-line p-2.5 text-center">
      <Icon name={icon} size={15} className="mx-auto text-accent" />
      <div className="mt-1 font-display text-lg font-bold tabular-nums">{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-muted">{label}</div>
    </div>
  );
}

function MemberProfile() {
  const { t } = useT();
  const tl = useL();
  const { profile: id, showProfile } = useChat();
  const [p, setP] = useState<Profile | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    setP(null);
    setFailed(false);
    if (!id) return;
    void api<{ profile: Profile }>('GET', `/users/${id}/profile`).then((r) => (r.ok ? setP(r.data.profile) : setFailed(true)));
  }, [id]);
  useEffect(() => {
    if (!id) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && showProfile(null);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [id, showProfile]);

  // chapter titles for the modules this member touched
  const keys = useMemo(() => (p ? [...p.study.read, ...p.study.inProgress.map((x) => x.key)] : []), [p]);
  const moduleIds = useMemo(() => [...new Set(keys.map((k) => k.split('/')[0]).filter((m) => MODULES.some((x) => x.id === m)))], [keys]);
  const content = useAllModules(moduleIds);
  const chapterTitle = (key: string) => {
    const [m, c] = key.split('/');
    const ch = content?.find((x) => x.module.id === m)?.chapters.find((x) => x.id === c);
    return ch ? tl(ch.title) : c;
  };
  const moduleTitle = (m: string) => {
    const mod = MODULES.find((x) => x.id === m);
    return mod ? tl(mod.title) : m;
  };
  const readByModule = useMemo(() => {
    const g = new Map<string, string[]>();
    for (const k of p?.study.read ?? []) {
      const m = k.split('/')[0];
      g.set(m, [...(g.get(m) ?? []), k]);
    }
    return [...g.entries()];
  }, [p]);

  return createPortal(
    <AnimatePresence>
      {id && (
        <motion.div className="fixed inset-0 z-[60] grid place-items-center bg-navy/50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => showProfile(null)}>
          <motion.div
            role="dialog"
            aria-modal="true"
            className="scroll-thin max-h-[88dvh] w-full max-w-md overflow-y-auto rounded-2xl border border-line bg-surface shadow-2xl"
            initial={{ y: 16, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 16, scale: 0.98 }}
            onClick={(e) => e.stopPropagation()}
            data-testid="member-profile"
          >
            <div className="relative bg-navy px-5 pb-5 pt-6 text-white">
              <button className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-white/20" onClick={() => showProfile(null)} aria-label={t('common.close')}>
                <Icon name="x" size={16} />
              </button>
              {!p && !failed && <div className="py-8 text-center text-sm text-white/70">…</div>}
              {failed && <div className="py-8 text-center text-sm text-white/70">{t('chat.profileError')}</div>}
              {p && (
                <div className="flex items-center gap-4">
                  <Avatar name={p.displayName} src={p.avatar} size={64} className="ring-2 ring-white/30" />
                  <div className="min-w-0">
                    <div className="truncate text-xl font-extrabold">{p.displayName}</div>
                    <div className="text-sm text-white/70">{p.groupe}</div>
                    <div className={`mt-1 inline-flex items-center gap-1.5 text-xs font-semibold ${p.online ? 'text-emerald-300' : 'text-white/60'}`}>
                      <span className={`h-2 w-2 rounded-full ${p.online ? 'bg-emerald-400' : 'bg-white/40'}`} />
                      {p.online ? t('chat.online') : p.seenAgo !== null ? `${t('chat.seen')} ${ago(p.seenAgo, t)}` : t('chat.never')}
                    </div>
                  </div>
                </div>
              )}
            </div>
            {p && (
              <div className="space-y-5 p-5">
                <div className="grid grid-cols-4 gap-2">
                  <Stat icon="star" value={p.study.xp} label="XP" />
                  <Stat icon="flame" value={p.study.streak} label={t('chat.streak')} />
                  <Stat icon="book" value={p.study.read.length} label={t('chat.read')} />
                  <Stat icon="dumbbell" value={p.study.exercisesOk} label={t('chat.exos')} />
                </div>

                {p.study.lastVisit?.module && (
                  <div className="rounded-lg border border-accent/30 bg-accent/[0.05] px-3 py-2.5 text-sm">
                    <div className="text-[11px] font-bold uppercase tracking-wide text-accent">{t('chat.lastVisit')}</div>
                    <div className="mt-0.5 font-medium">
                      {moduleTitle(p.study.lastVisit.module)}
                      {p.study.lastVisit.chapter && ` · ${chapterTitle(`${p.study.lastVisit.module}/${p.study.lastVisit.chapter}`)}`}
                    </div>
                  </div>
                )}

                {p.study.inProgress.length > 0 && (
                  <section>
                    <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">{t('chat.inProgress')}</h3>
                    <ul className="space-y-2">
                      {p.study.inProgress.map((x) => (
                        <li key={x.key}>
                          <div className="flex justify-between gap-2 text-sm">
                            <span className="truncate">{chapterTitle(x.key)}</span>
                            <span className="shrink-0 font-mono text-xs text-muted">{x.pct}%</span>
                          </div>
                          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface2">
                            <div className="h-full rounded-full bg-accent" style={{ width: `${x.pct}%` }} />
                          </div>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                <section>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">{t('chat.readList')}</h3>
                  {!readByModule.length && <p className="text-sm text-muted">{t('chat.nothingRead')}</p>}
                  <div className="space-y-3">
                    {readByModule.map(([m, ks]) => (
                      <div key={m}>
                        <Link to={`/m/${m}`} onClick={() => showProfile(null)} className="text-sm font-semibold hover:underline">
                          {moduleTitle(m)}
                        </Link>
                        <ul className="mt-1 space-y-0.5">
                          {ks.map((k) => (
                            <li key={k} className="flex items-center gap-2 text-sm text-muted">
                              <Icon name="check" size={13} className="shrink-0 text-ok" />
                              <span className="truncate">{chapterTitle(k)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>

                {p.study.exams.length > 0 && (
                  <section>
                    <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">{t('chat.exams')}</h3>
                    <ul className="divide-y divide-line rounded-lg border border-line">
                      {p.study.exams.map((e, i) => (
                        <li key={i} className="flex items-center justify-between px-3 py-2 text-sm">
                          <span className="truncate">{moduleTitle(e.module)}</span>
                          <span className={`font-mono font-bold ${e.note >= 10 ? 'text-ok' : 'text-bad'}`}>{e.note}/20</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
