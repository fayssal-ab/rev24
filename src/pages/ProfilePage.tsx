import { lazy, Suspense, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loading } from '../components/Layout';
import { useStore, EXPORT_KEYS } from '../store/store';
import { useT, useL } from '../hooks/useT';
import { MODULES } from '../lib/content';
import { useAllModules } from '../hooks/useModule';
import { chapterMastery, moduleMastery } from '../lib/mastery';
import { Ring } from '../components/Ring';
import { Icon } from '../components/Icon';
import type { UIKey } from '../i18n/ui';
import { authEnabled, changePassword, signOut, updateProfile, useAuth, useCanSeeOral } from '../auth/auth';
import { Avatar, toAvatarDataUrl } from '../components/Avatar';

/** Profile picture with "change" / "remove" (resized to 160 px in the browser before upload). */
function AvatarEditor() {
  const { t } = useT();
  const user = useAuth((a) => a.user);
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(false);
  const name = user?.displayName || user?.email || '?';
  const pick = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    setErr(false);
    try {
      const r = await updateProfile({ avatar: await toAvatarDataUrl(file) });
      setErr(!r.ok);
    } catch {
      setErr(true);
    }
    setBusy(false);
  };
  if (!authEnabled || !user)
    return (
      <span className="icon-tile h-14 w-14 shrink-0 rounded-2xl bg-white/10 ring-1 ring-white/20 sm:h-16 sm:w-16">
        <Icon name="user" size={28} />
      </span>
    );
  return (
    <div className="flex shrink-0 items-center gap-3 md:flex-col md:items-center md:gap-1.5">
      <button type="button" className="group relative rounded-full ring-2 ring-white/30 transition hover:ring-emerald-300" onClick={() => input.current?.click()} aria-label={t('profile.avatar.change')} data-testid="avatar-change">
        <Avatar name={name} src={user.avatar} size={72} />
        <span className="absolute inset-0 grid place-items-center rounded-full bg-black/45 opacity-0 transition group-hover:opacity-100">
          <Icon name={busy ? 'clock' : 'image'} size={22} />
        </span>
      </button>
      <input ref={input} type="file" accept="image/*" className="hidden" onChange={(e) => void pick(e.target.files?.[0]).finally(() => (e.target.value = ''))} />
      <div className="flex gap-2 text-[11px] font-semibold">
        <button type="button" className="text-emerald-300 hover:underline" onClick={() => input.current?.click()} disabled={busy}>
          {t('profile.avatar.change')}
        </button>
        {user.avatar && (
          <button type="button" className="text-white/60 hover:text-white hover:underline" onClick={() => void updateProfile({ avatar: null })} disabled={busy}>
            {t('profile.avatar.remove')}
          </button>
        )}
      </div>
      {err && <span className="text-[11px] text-red-300">{t('profile.avatar.err')}</span>}
    </div>
  );
}

const OralPage = lazy(() => import('./OralPage'));
const BADGES = ['chmod', 'root', 'h0', 'terminal', 'exam', 'streak'];

type Tab = 'progress' | 'oral' | 'data';

export default function ProfilePage({ tab = 'progress' }: { tab?: Tab }) {
  const { t } = useT();
  const st = useStore();
  const level = Math.floor(st.xp / 500) + 1;
  const inLevel = st.xp % 500;
  const user = useAuth((a) => a.user);
  const canSeeOral = useCanSeeOral();
  const allTabs: { to: string; key: UIKey; icon: string; id: Tab }[] = [
    { to: '/profil', key: 'profile.tab.progress', icon: 'chart', id: 'progress' },
    { to: '/profil/oral', key: 'profile.tab.oral', icon: 'mic', id: 'oral' },
    { to: '/profil/donnees', key: 'profile.tab.data', icon: 'database', id: 'data' }
  ];
  const tabs = allTabs.filter((x) => x.id !== 'oral' || canSeeOral);
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="relative overflow-hidden rounded-2xl bg-navy p-6 text-white sm:p-8">
        <div className="hero-grid pointer-events-none absolute inset-0 opacity-60" />
        {/* stacked on phones: avatar + name, then level, then stats — never squeezed into one row */}
        <div className="relative flex flex-col gap-5 md:flex-row md:items-center">
          <AvatarEditor />
          <div className="w-full min-w-0 md:flex-1">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-300">{t('app.student')}</div>
            <h1 className="mt-1 break-words text-2xl font-extrabold sm:text-3xl">{user?.displayName || t('profile.title')}</h1>
            {user && (
              <p className="text-sm text-white/70">
                <span className="break-all">{user.email}</span> · {user.groupe}
              </p>
            )}
            <div className="mt-3 max-w-md">
              <div className="flex justify-between text-xs text-white/70">
                <span>
                  {t('prog.level')} {level}
                </span>
                <span className="tabular-nums">
                  {inLevel} / 500 XP
                </span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/15">
                <motion.div className="h-full rounded-full bg-emerald-400" initial={{ width: 0 }} animate={{ width: `${(inLevel / 500) * 100}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} />
              </div>
            </div>
          </div>
          <div className="grid w-full grid-cols-2 gap-3 md:flex md:w-auto">
            <Stat label="XP" value={st.xp} icon="bolt" />
            <Stat label={t('home.streak')} value={st.streak.count} icon="flame" />
          </div>
        </div>
      </section>

      <nav className="flex gap-1 overflow-x-auto border-b border-line" aria-label={t('profile.title')}>
        {tabs.map((x) => (
          <NavLink key={x.id} to={x.to} end className={() => `-mb-px flex shrink-0 items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition ${tab === x.id ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-fg'}`}>
            <Icon name={x.icon} size={16} /> {t(x.key)}
          </NavLink>
        ))}
      </nav>

      {tab === 'progress' && <ProgressTab />}
      {tab === 'oral' && canSeeOral && (
        <Suspense fallback={<Loading />}>
          <OralPage />
        </Suspense>
      )}
      {tab === 'data' && <DataTab />}
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: number | string; icon: string }) {
  return (
    <div className="rounded-xl bg-white/10 px-4 py-3 ring-1 ring-white/15">
      <div className="flex items-center gap-1.5 text-[11px] text-white/70">
        <Icon name={icon} size={13} /> {label}
      </div>
      <div className="text-xl font-bold tabular-nums">{value}</div>
    </div>
  );
}

function ProgressTab() {
  const { t } = useT();
  const tl = useL();
  const st = useStore();
  const content = useAllModules(MODULES.map((m) => m.id));
  const stats = Object.values(st.qstats);
  const answered = stats.reduce((a, s) => a + s.seen, 0);
  const correct = stats.reduce((a, s) => a + s.correct, 0);
  return (
    <div className="space-y-6">
      {authEnabled && <AccountCard />}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          { k: t('prog.answered'), v: answered, icon: 'quiz' },
          { k: t('prog.accuracy'), v: answered ? `${Math.round((correct / answered) * 100)} %` : '—', icon: 'target' },
          { k: t('prog.exDone'), v: Object.values(st.exercises).filter((x) => x === 'ok').length, icon: 'dumbbell' },
          { k: t('prog.chaptersRead'), v: Object.values(st.read).filter(Boolean).length, icon: 'book' },
          { k: t('prog.missionsDone'), v: Object.values(st.missions).filter(Boolean).length, icon: 'terminal' },
          { k: t('nav.exam'), v: st.exams.length, icon: 'flag' }
        ].map((x) => (
          <div key={x.k} className="card p-4">
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <Icon name={x.icon} size={14} /> {x.k}
            </div>
            <div className="mt-1 text-2xl font-bold tabular-nums">{x.v}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {content?.map((c) => (
          <section key={c.module.id} className="card p-5">
            <div className="mb-4 flex items-center gap-3">
              <span className="icon-tile h-10 w-10 text-white" style={{ background: c.module.color }}>
                <Icon name={c.module.icon} size={19} />
              </span>
              <h2 className="flex-1 font-semibold">{tl(c.module.title)}</h2>
              <Ring value={moduleMastery(c, st)} size={44} stroke={5} />
            </div>
            <ul className="space-y-2.5">
              {c.chapters.map((ch) => {
                const v = chapterMastery(c, ch.id, st);
                return (
                  <li key={ch.id}>
                    <Link to={`/m/${c.module.id}/c/${ch.id}`} className="grid grid-cols-[1fr_auto] items-center gap-x-2 gap-y-1 text-sm hover:text-accent">
                      <span className="truncate">{tl(ch.title)}</span>
                      <span className="font-mono text-xs text-muted">{v}%</span>
                      <span className="col-span-2 h-1.5 overflow-hidden rounded-full bg-surface2">
                        <span className="block h-full rounded-full" style={{ width: `${v}%`, background: `rgb(var(--${v >= 70 ? 'ok' : v >= 40 ? 'warn' : 'bad'}))` }} />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      <section>
        <h2 className="h2 mb-3">{t('prog.badges')}</h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {BADGES.map((b) => {
            const on = st.badges.includes(b);
            return (
              <li key={b} className={`card p-4 text-center ${on ? 'border-accent/60' : 'opacity-60'}`} data-testid={`badge-${b}`} data-on={on}>
                <div className={`mx-auto mb-2 grid h-11 w-11 place-items-center rounded-full ${on ? 'bg-accent text-white' : 'bg-surface2 text-muted'}`}>
                  <Icon name={on ? 'award' : 'lock'} size={20} />
                </div>
                <div className="text-sm font-semibold">{t(`badge.${b}` as UIKey)}</div>
                <div className="text-[11px] text-muted">{t(`badge.${b}.desc` as UIKey)}</div>
              </li>
            );
          })}
        </ul>
      </section>

      {st.exams.length > 0 && (
        <section className="card p-5">
          <h2 className="mb-3 font-semibold">{t('exam.history')}</h2>
          <ul className="divide-y divide-line text-sm">
            {[...st.exams].reverse().map((e) => (
              <li key={e.date} className="flex justify-between gap-2 py-2">
                <span className="text-muted">
                  {new Date(e.date).toLocaleString()} · {e.module}
                </span>
                <span className="font-mono font-bold">{String(e.note).replace('.', ',')}/20</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function DataTab() {
  const { t } = useT();
  const st = useStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState('');
  const exportJson = () => {
    const data = Object.fromEntries(EXPORT_KEYS.map((k) => [k, (st as unknown as Record<string, unknown>)[k]]));
    const blob = new Blob([JSON.stringify({ app: 'group22', version: 2, exported: new Date().toISOString(), data }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `group22-progression-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const importJson = async (f: File) => {
    try {
      const j = JSON.parse(await f.text());
      if (!['group22', 'rev24'].includes(j.app) || typeof j.data !== 'object') throw new Error();
      st.importData(j.data);
      setMsg(t('prog.importOk'));
    } catch {
      setMsg(t('prog.importKo'));
    }
  };
  return (
    <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
      <section className="card p-5">
        <div className="flex items-center gap-2 font-semibold">
          <Icon name="database" size={18} className="text-accent" /> {t('profile.data.title')}
        </div>
        <p className="mt-2 text-sm text-muted">{t('profile.data.desc')}</p>
        <ul className="mt-3 space-y-1.5 text-sm">
          {(['profile.data.l1', 'profile.data.l2', 'profile.data.l3'] as const).map((k) => (
            <li key={k} className="flex items-start gap-2">
              <Icon name="check" size={15} className="mt-0.5 text-ok" /> {t(k)}
            </li>
          ))}
        </ul>
      </section>
      <section className="card space-y-3 p-5">
        <button className="btn-ghost w-full" onClick={exportJson}>
          <Icon name="download" size={16} /> {t('prog.export')}
        </button>
        <button className="btn-ghost w-full" onClick={() => fileRef.current?.click()}>
          <Icon name="upload" size={16} /> {t('prog.import')}
        </button>
        <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files?.[0] && importJson(e.target.files[0])} />
        <button className="btn-ghost w-full text-bad" onClick={() => window.confirm(t('prog.resetConfirm')) && st.resetAll()}>
          <Icon name="trash" size={16} /> {t('prog.resetAll')}
        </button>
        {msg && <p className="text-sm text-muted">{msg}</p>}
      </section>
    </div>
  );
}

function AccountCard() {
  const { t } = useT();
  const { user, syncing } = useAuth();
  const [name, setName] = useState(user?.displayName ?? '');
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [msg, setMsg] = useState<{ ok: boolean; key: UIKey } | null>(null);
  if (!user)
    return (
      <section className="card flex flex-wrap items-center gap-4 p-5 md:col-span-2">
        <span className="icon-tile h-11 w-11 rounded-xl bg-accent/10 text-accent">
          <Icon name="user" size={20} />
        </span>
        <p className="min-w-0 flex-1 text-sm text-muted">{t('auth.guest')}</p>
        <Link to="/connexion" className="btn-primary" data-testid="profile-login">
          {t('auth.signin')}
        </Link>
      </section>
    );
  const saveName = async () => setMsg((await updateProfile({ displayName: name.trim() })).ok ? { ok: true, key: 'auth.saved' } : { ok: false, key: 'auth.err.generic' });
  const savePassword = async () => {
    if (next.length < 8) return setMsg({ ok: false, key: 'auth.err.weak' });
    const r = await changePassword(current, next);
    setMsg(r.ok ? { ok: true, key: 'auth.passwordChanged' } : { ok: false, key: r.error === 'invalid_credentials' ? 'auth.err.credentials' : 'auth.err.generic' });
    if (r.ok) {
      setCurrent('');
      setNext('');
    }
  };
  return (
    <section className="card space-y-4 p-5 md:col-span-2">
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-2 font-semibold">
          <Icon name="user" size={18} className="text-accent" /> {t('auth.account')}
        </span>
        <span className={`chip ${syncing === 'error' ? '!text-bad' : '!text-ok'}`}>
          <Icon name={syncing === 'error' ? 'alert' : 'checkCircle'} size={13} /> {t(syncing === 'saving' ? 'auth.sync.saving' : syncing === 'error' ? 'auth.sync.error' : 'auth.sync.saved')}
        </span>
        <button className="btn-ghost btn-sm ml-auto text-bad" onClick={() => void signOut()} data-testid="sign-out">
          <Icon name="external" size={14} /> {t('auth.signout')}
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-semibold">{t('auth.name')}</label>
          <div className="flex gap-2">
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            <button className="btn-primary" onClick={() => void saveName()}>
              {t('auth.save')}
            </button>
          </div>
          <p className="text-xs text-muted">{user.email}</p>
        </div>
        {/* private profile: in the chat, other members only see the name, picture and presence */}
        <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 md:col-span-2 ${user.privateProfile ? 'border-accent/50 bg-accent/[0.05]' : 'border-line'}`} data-testid="private-profile">
          <input
            type="checkbox"
            className="mt-1"
            checked={!!user.privateProfile}
            onChange={async (e) => setMsg((await updateProfile({ privateProfile: e.target.checked })).ok ? { ok: true, key: 'auth.saved' } : { ok: false, key: 'auth.err.generic' })}
          />
          <span className="min-w-0">
            <span className="flex items-center gap-1.5 font-semibold">
              <Icon name="lock" size={14} className="text-accent" /> {t('profile.private')}
            </span>
            <span className="block text-xs text-muted">{t('profile.private.sub')}</span>
          </span>
        </label>
        <div className="space-y-2">
          <label className="block text-sm font-semibold">{t('auth.changePassword')}</label>
          <input className="input" type="password" placeholder={t('auth.currentPassword')} value={current} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" />
          <div className="flex gap-2">
            <input className="input" type="password" placeholder={t('auth.newPasswordLabel')} value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" />
            <button className="btn-ghost" onClick={() => void savePassword()}>
              {t('auth.save')}
            </button>
          </div>
        </div>
      </div>
      {msg && <p className={`text-sm ${msg.ok ? 'text-ok' : 'text-bad'}`}>{t(msg.key)}</p>}
    </section>
  );
}
