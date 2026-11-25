/**
 * Group chat, docked on the right like a casino-site chat (Stake / Rainbet): open or hide it with the bubble,
 * the choice is remembered. Only the last 20 messages exist (the API deletes older ones). Links are clickable,
 * "@" mentions a member (autocomplete; the message is highlighted for them) and a message can be a poll.
 * Clicking a name opens that member's profile: picture, activity and what they studied.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { create } from 'zustand';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { StickToBottom, useStickToBottomContext } from 'use-stick-to-bottom';
import { api, authEnabled, useApproved, useAuth, useIsAdmin } from '../auth/auth';
import { useT, useL } from '../hooks/useT';
import { MODULES } from '../lib/content';
import { useAllModules } from '../hooks/useModule';
import { Avatar } from './Avatar';
import { Icon } from './Icon';

interface Poll {
  options: string[];
  counts: number[];
  total: number;
  /** index voted by me, null = not voted */
  mine: number | null;
}
interface ChatMessage {
  id: number;
  body: string;
  at: string;
  poll: Poll | null;
  user: { id: string; name: string; avatar: string | null };
}
interface Member {
  id: string;
  name: string;
  avatar: string | null;
}

const OPEN_KEY = 'g22-chat-open';
const SEEN_KEY = 'g22-chat-seen';
const KEEP = 20;
/** stored form of a mention: @[Name](user id) */
const MENTION = /@\[([^\]\n]{1,60})\]\(([0-9a-f-]{36})\)/g;
const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

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

/** Message text: mentions as chips (mine stands out), then links. */
function MessageText({ text, me, onMention }: { text: string; me?: string; onMention: (id: string) => void }) {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(MENTION)) {
    if (m.index! > last) out.push(<Linkified key={`t${last}`} text={text.slice(last, m.index)} />);
    const isMe = m[2] === me;
    out.push(
      <button
        key={`m${m.index}`}
        type="button"
        onClick={() => onMention(m[2])}
        className={`rounded px-1 font-semibold transition hover:opacity-80 ${isMe ? 'bg-warn text-white' : 'bg-accent/15 text-accent'}`}
      >
        @{m[1]}
      </button>
    );
    last = m.index! + m[0].length;
  }
  if (last < text.length) out.push(<Linkified key={`t${last}`} text={text.slice(last)} />);
  return <>{out}</>;
}

const mentions = (text: string, id?: string) => !!id && [...text.matchAll(MENTION)].some((m) => m[2] === id);

/** Poll card: bars with the share of votes; click to vote, click your choice again to take the vote back. */
function PollCard({ poll, onVote, t }: { poll: Poll; onVote: (i: number) => void; t: (k: 'chat.poll.votes' | 'chat.poll.vote1' | 'chat.poll.hint') => string }) {
  return (
    <div className="mt-2 space-y-1.5" data-testid="chat-poll">
      {poll.options.map((o, i) => {
        const pct = poll.total ? Math.round((poll.counts[i] / poll.total) * 100) : 0;
        const chosen = poll.mine === i;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onVote(i)}
            className={`relative block w-full overflow-hidden rounded-lg border px-3 py-2 text-left text-[13px] transition ${chosen ? 'border-accent' : 'border-line hover:border-accent/60'}`}
            data-testid="chat-poll-option"
          >
            <span className={`absolute inset-y-0 left-0 transition-[width] duration-500 ${chosen ? 'bg-accent/25' : 'bg-surface2'}`} style={{ width: `${poll.mine !== null || poll.total ? pct : 0}%` }} />
            <span className="relative flex items-center gap-2">
              <span className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border ${chosen ? 'border-accent bg-accent text-white' : 'border-line'}`}>{chosen && <Icon name="check" size={10} />}</span>
              <span className="min-w-0 flex-1 break-words font-medium">{o}</span>
              {(poll.mine !== null || poll.total > 0) && <span className="shrink-0 font-mono text-[11px] text-muted">{pct}%</span>}
            </span>
          </button>
        );
      })}
      <div className="text-[11px] text-muted">
        {poll.total} {poll.total === 1 ? t('chat.poll.vote1') : t('chat.poll.votes')} · {t('chat.poll.hint')}
      </div>
    </div>
  );
}

const SPRING = { type: 'spring', stiffness: 420, damping: 32, mass: 0.8 } as const;
const PANEL: Variants = {
  open: { x: 0, opacity: 1, visibility: 'visible', transition: { type: 'spring', stiffness: 380, damping: 36 } },
  closed: { x: '100%', opacity: 0.6, transition: { type: 'spring', stiffness: 380, damping: 40 }, transitionEnd: { visibility: 'hidden' } }
};

/** "New messages" pill when the member has scrolled up (state from use-stick-to-bottom). */
function JumpToLatest({ label }: { label: string }) {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();
  return (
    <AnimatePresence>
      {!isAtBottom && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={SPRING}
          onClick={() => void scrollToBottom()}
          className="absolute bottom-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-fg px-3 py-1.5 text-xs font-semibold text-bg shadow-lg"
          data-testid="chat-latest"
        >
          <Icon name="down" size={13} /> {label}
        </motion.button>
      )}
    </AnimatePresence>
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
  // poll being written: null = plain message
  const [pollOpts, setPollOpts] = useState<string[] | null>(null);
  // @mentions: members list, names inserted in the text, autocomplete state
  const [members, setMembers] = useState<Member[]>([]);
  const picked = useRef(new Map<string, string>());
  const [ac, setAc] = useState<{ q: string; start: number; sel: number } | null>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const lastId = msgs.at(-1)?.id ?? 0;
  const locale = lang === 'en' ? 'en-GB' : 'fr-FR';

  const refresh = useCallback(async () => {
    const r = await api<{ messages: ChatMessage[] }>('GET', '/chat');
    if (r.ok) setMsgs(r.data.messages.slice(-KEEP));
  }, []);
  // whole list (20 messages, so votes and deletions stay live): every 5 s when open, 20 s otherwise
  useEffect(() => {
    void refresh();
    const id = setInterval(() => document.visibilityState === 'visible' && void refresh(), open ? 5000 : 20_000);
    return () => clearInterval(id);
  }, [refresh, open]);
  useEffect(() => {
    if (!open || members.length) return;
    void api<{ members: Member[] }>('GET', '/members').then((r) => r.ok && setMembers(r.data.members));
  }, [open, members.length]);

  // read marker (scrolling is handled by use-stick-to-bottom)
  useEffect(() => {
    if (!open || !lastId) return;
    setSeen(lastId);
    localStorage.setItem(SEEN_KEY, String(lastId));
  }, [open, lastId]);
  const fresh = open ? [] : msgs.filter((m) => m.id > seen && m.user.id !== me?.id);
  const unread = fresh.length;
  const mentioned = fresh.some((m) => mentions(m.body, me?.id));

  // ---- @ autocomplete
  const matches = useMemo(() => {
    if (!ac) return [];
    const q = fold(ac.q);
    return members.filter((m) => m.id !== me?.id && fold(m.name).includes(q)).slice(0, 6);
  }, [ac, members, me?.id]);
  const onType = (value: string, caret: number) => {
    setText(value);
    const m = /(^|\s)@([^\s@]{0,20})$/.exec(value.slice(0, caret));
    setAc(m ? { q: m[2], start: caret - m[2].length - 1, sel: 0 } : null);
  };
  const pick = (m: Member) => {
    if (!ac) return;
    const caret = ac.start + 1 + ac.q.length;
    const next = `${text.slice(0, ac.start)}@${m.name} ${text.slice(caret)}`;
    picked.current.set(m.name, m.id);
    setText(next);
    setAc(null);
    requestAnimationFrame(() => {
      const pos = ac.start + m.name.length + 2;
      input.current?.focus();
      input.current?.setSelectionRange(pos, pos);
    });
  };
  /** "@Name" typed through the autocomplete → stored token @[Name](id) */
  const encode = (s: string) => {
    let out = s;
    for (const [name, id] of [...picked.current.entries()].sort((a, b) => b[0].length - a[0].length))
      out = out.split(`@${name}`).join(`@[${name}](${id})`);
    return out;
  };

  const send = async (e?: FormEvent) => {
    e?.preventDefault();
    const body = text.trim();
    if (!body) return;
    const options = pollOpts?.map((o) => o.trim()).filter(Boolean);
    if (pollOpts && (!options || options.length < 2)) return setErr(t('chat.poll.need2'));
    setErr(null);
    const r = await api<{ messages: ChatMessage[] }>('POST', '/chat', { body: encode(body), ...(options ? { poll: { options } } : {}) });
    if (!r.ok) return setErr(r.error === 'too_fast' ? t('chat.tooFast') : r.error === 'invalid_poll' ? t('chat.poll.invalid') : t('chat.error'));
    setText('');
    setPollOpts(null);
    picked.current.clear();
    setMsgs(r.data.messages);
  };
  const vote = async (m: ChatMessage, choice: number) => {
    const r = await api<{ messages: ChatMessage[] }>('POST', `/chat/${m.id}/vote`, { choice });
    if (r.ok) setMsgs(r.data.messages);
  };
  const remove = async (m: ChatMessage) => {
    const r = await api<{ messages: ChatMessage[] }>('DELETE', `/chat/${m.id}`);
    if (r.ok) setMsgs(r.data.messages);
  };
  const onKey = (e: ReactKeyboardEvent<HTMLTextAreaElement>) => {
    if (ac && matches.length) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const d = e.key === 'ArrowDown' ? 1 : -1;
        return setAc({ ...ac, sel: (ac.sel + d + matches.length) % matches.length });
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        return pick(matches[ac.sel]);
      }
      if (e.key === 'Escape') return setAc(null);
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  };

  return (
    <>
      {/* bubble: opens / hides the chat (framer-motion springs) */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="bubble"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            transition={SPRING}
            onClick={() => setOpen(true)}
            className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-accent text-white shadow-[0_10px_30px_-8px_rgba(0,132,78,0.7)]"
            aria-label={t('chat.open')}
            data-testid="chat-open"
          >
            <Icon name="chat" size={24} />
            <AnimatePresence>
              {unread > 0 && (
                <motion.span
                  key={mentioned ? 'at' : 'n'}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 600, damping: 20 }}
                  className={`absolute -right-1 -top-1 grid h-6 min-w-6 place-items-center rounded-full px-1.5 text-[11px] font-bold ${mentioned ? 'bg-warn' : 'bg-bad'}`}
                  data-testid="chat-unread"
                >
                  {mentioned ? '@' : unread > 9 ? '9+' : unread}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        )}
      </AnimatePresence>

      {/* always mounted, slid in / out by framer-motion (GPU transform, no re-mount when opening) */}
      <motion.aside
        initial={false}
        animate={open ? 'open' : 'closed'}
        variants={PANEL}
        className="fixed bottom-0 right-0 top-0 z-50 flex w-full flex-col border-l border-line bg-surface shadow-2xl will-change-transform sm:w-[22rem] xl:shadow-none"
        aria-label={t('chat.title')}
        aria-hidden={!open}
        data-testid={open ? 'chat-panel' : undefined}
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

            {/* use-stick-to-bottom: stays on the newest message with spring scrolling, stops when you scroll up */}
            <StickToBottom className="relative min-h-0 flex-1" resize="smooth" initial="instant">
              <StickToBottom.Content className="space-y-3 px-3 py-4" scrollClassName="scroll-thin">
              {!msgs.length && <p className="px-2 py-10 text-center text-sm text-muted">{t('chat.empty')}</p>}
              <AnimatePresence initial={false}>
              {msgs.map((m) => {
                const mine = m.user.id === me?.id;
                const forMe = !mine && mentions(m.body, me?.id);
                return (
                  <motion.div
                    key={m.id}
                    layout="position"
                    initial={{ opacity: 0, y: 14, x: mine ? 12 : -12, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
                    transition={SPRING}
                    className="group flex gap-2.5"
                    data-testid="chat-msg"
                  >
                    <button onClick={() => showProfile(m.user.id)} className="mt-0.5 shrink-0 rounded-full transition hover:opacity-80" aria-label={m.user.name}>
                      <Avatar name={m.user.name} src={m.user.avatar} size={32} />
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        <button onClick={() => showProfile(m.user.id)} className={`truncate text-[13px] font-semibold hover:underline ${mine ? 'text-accent' : ''}`}>
                          {m.user.name}
                        </button>
                        <span className="ml-auto shrink-0 font-mono text-[10px] text-muted">{timeOf(m.at, locale)}</span>
                        {(mine || isAdmin) && (
                          <button
                            onClick={() => window.confirm(t('chat.deleteConfirm')) && void remove(m)}
                            className="shrink-0 text-muted transition hover:text-bad sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                            aria-label={t('chat.delete')}
                            title={t('chat.delete')}
                            data-testid="chat-delete"
                          >
                            <Icon name="trash" size={13} />
                          </button>
                        )}
                      </div>
                      <div
                        className={`mt-0.5 whitespace-pre-line break-words rounded-lg rounded-tl-sm px-3 py-2 text-[14px] leading-snug ${forMe ? 'border-l-4 border-warn bg-warn/10' : mine ? 'bg-accent/10' : 'bg-surface2'}`}
                        data-testid={forMe ? 'chat-mention-me' : undefined}
                      >
                        {m.poll && (
                          <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-accent">
                            <Icon name="chart" size={12} /> {t('chat.poll.label')}
                          </div>
                        )}
                        <span className={m.poll ? 'font-semibold' : ''}>
                          <MessageText text={m.body} me={me?.id} onMention={showProfile} />
                        </span>
                        {m.poll && <PollCard poll={m.poll} onVote={(i) => void vote(m, i)} t={t} />}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              </AnimatePresence>
              </StickToBottom.Content>
              <JumpToLatest label={t('chat.latest')} />
            </StickToBottom>

            <form onSubmit={send} className="relative border-t border-line p-3">
              {/* @ autocomplete */}
              {ac && matches.length > 0 && (
                <ul className="absolute bottom-full left-3 right-3 mb-1 overflow-hidden rounded-xl border border-line bg-surface py-1 shadow-xl" role="listbox" data-testid="chat-mentions">
                  {matches.map((m, i) => (
                    <li key={m.id}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={i === ac.sel}
                        onMouseDown={(e) => (e.preventDefault(), pick(m))}
                        className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm ${i === ac.sel ? 'bg-accent/10 text-accent' : 'hover:bg-surface2'}`}
                      >
                        <Avatar name={m.name} src={m.avatar} size={24} />
                        <span className="truncate font-medium">{m.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {err && <p className="mb-2 text-xs text-bad">{err}</p>}

              {/* poll options */}
              {pollOpts && (
                <div className="mb-2 space-y-1.5 rounded-xl border border-accent/40 bg-accent/[0.04] p-2.5" data-testid="chat-poll-editor">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wide text-accent">
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name="chart" size={12} /> {t('chat.poll.new')}
                    </span>
                    <button type="button" className="text-muted hover:text-fg" onClick={() => setPollOpts(null)} aria-label={t('common.close')}>
                      <Icon name="x" size={14} />
                    </button>
                  </div>
                  {pollOpts.map((o, i) => (
                    <div key={i} className="flex gap-1.5">
                      <input
                        className="input !min-h-[36px] flex-1 !py-1.5 text-sm"
                        value={o}
                        maxLength={80}
                        placeholder={`${t('chat.poll.option')} ${i + 1}`}
                        onChange={(e) => setPollOpts(pollOpts.map((x, j) => (j === i ? e.target.value : x)))}
                      />
                      {pollOpts.length > 2 && (
                        <button type="button" className="px-1 text-muted hover:text-bad" onClick={() => setPollOpts(pollOpts.filter((_, j) => j !== i))} aria-label={t('chat.delete')}>
                          <Icon name="x" size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                  {pollOpts.length < 6 && (
                    <button type="button" className="text-xs font-semibold text-accent hover:underline" onClick={() => setPollOpts([...pollOpts, ''])}>
                      + {t('chat.poll.add')}
                    </button>
                  )}
                </div>
              )}

              <div className="flex items-end gap-2">
                <button
                  type="button"
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border transition ${pollOpts ? 'border-accent bg-accent/10 text-accent' : 'border-line text-muted hover:text-fg'}`}
                  onClick={() => setPollOpts(pollOpts ? null : ['', ''])}
                  aria-label={t('chat.poll.new')}
                  title={t('chat.poll.new')}
                  data-testid="chat-poll-toggle"
                >
                  <Icon name="chart" size={17} />
                </button>
                <textarea
                  ref={input}
                  value={text}
                  onChange={(e) => onType(e.target.value, e.target.selectionStart)}
                  onKeyDown={onKey}
                  onBlur={() => setTimeout(() => setAc(null), 150)}
                  rows={1}
                  maxLength={500}
                  placeholder={pollOpts ? t('chat.poll.question') : t('chat.placeholder')}
                  className="input max-h-28 min-h-[44px] flex-1 resize-none !py-2.5 text-sm"
                  data-testid="chat-input"
                />
                <button className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent text-white transition hover:opacity-90 disabled:opacity-40" disabled={!text.trim()} aria-label={t('chat.send')} data-testid="chat-send">
                  <Icon name="arrowRight" size={18} />
                </button>
              </div>
              <div className="mt-1.5 text-[10px] text-muted">{t('chat.tips')}</div>
            </form>
      </motion.aside>
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
  /** locked by its owner: study is null for other members */
  private: boolean;
  study: null | {
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
  const keys = useMemo(() => (p?.study ? [...p.study.read, ...p.study.inProgress.map((x) => x.key)] : []), [p]);
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
    for (const k of p?.study?.read ?? []) {
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
                    <div className="flex items-center gap-2 truncate text-xl font-extrabold">
                      {p.displayName}
                      {p.private && <Icon name="lock" size={15} className="shrink-0 text-white/60" />}
                    </div>
                    <div className="text-sm text-white/70">{p.groupe}</div>
                    <div className={`mt-1 inline-flex items-center gap-1.5 text-xs font-semibold ${p.online ? 'text-emerald-300' : 'text-white/60'}`}>
                      <span className={`h-2 w-2 rounded-full ${p.online ? 'bg-emerald-400' : 'bg-white/40'}`} />
                      {p.online ? t('chat.online') : p.seenAgo !== null ? `${t('chat.seen')} ${ago(p.seenAgo, t)}` : t('chat.never')}
                    </div>
                  </div>
                </div>
              )}
            </div>
            {p && !p.study && (
              <div className="flex items-start gap-3 p-5 text-sm text-muted" data-testid="member-private">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface2 text-fg">
                  <Icon name="lock" size={16} />
                </span>
                <span className="pt-1.5">{t('chat.private')}</span>
              </div>
            )}
            {p && p.study && (
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
