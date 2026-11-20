import { useState, type FormEvent, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useT } from '../hooks/useT';
import { Icon } from '../components/Icon';
import { BrandMark, Wordmark } from '../components/Layout';
import { signIn, signUp, useAuth } from '../auth/auth';
import type { UIKey } from '../i18n/ui';

type Mode = 'login' | 'signup';

/** API error codes → messages. */
const ERRORS: Record<string, UIKey> = {
  invalid_credentials: 'auth.err.credentials',
  email_taken: 'auth.err.exists',
  weak_password: 'auth.err.weak',
  invalid_email: 'auth.err.email',
  too_many_attempts: 'auth.err.rate',
  network: 'auth.err.network'
};
const errorKey = (code: string): UIKey => ERRORS[code] ?? 'auth.err.generic';

function Field({ icon, label, children }: { icon: string; label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      <span className="relative block">
        <Icon name={icon} size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        {children}
      </span>
    </label>
  );
}

export default function AuthPage() {
  const { t } = useT();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [name, setName] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<UIKey | null>(null);
  const wasKicked = useAuth((s) => s.kicked);
  const current: Mode = mode;

  const go = (m: Mode) => {
    setMode(m);
    setError(null);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (current === 'signup' && password.length < 8) return setError('auth.err.weak');
    if (current === 'signup' && password !== password2) return setError('auth.err.mismatch');
    setBusy(true);
    const r = current === 'login' ? await signIn(email.trim(), password) : await signUp(email.trim(), password, name.trim());
    setBusy(false);
    if (!r.ok) setError(errorKey(r.error));
  };

  const titles: Record<Mode, [UIKey, UIKey]> = {
    login: ['auth.login.title', 'auth.login.sub'],
    signup: ['auth.signup.title', 'auth.signup.sub']
  };

  return (
    <div className="mx-auto grid max-w-5xl overflow-hidden rounded-2xl border border-line bg-surface shadow-sm lg:grid-cols-[1fr_1.1fr]">
      <aside className="relative hidden overflow-hidden bg-navy p-10 text-white lg:block">
        <div className="hero-grid pointer-events-none absolute inset-0" />
        <div className="relative flex h-full flex-col">
          <div className="flex items-center gap-3">
            <BrandMark />
            <Wordmark className="text-xl [&>span]:text-accent2" />
          </div>
          <h2 className="mt-10 text-3xl font-extrabold leading-tight">{t('auth.aside.title')}</h2>
          <ul className="mt-6 space-y-3 text-sm text-white/80">
            {(['auth.aside.l1', 'auth.aside.l2', 'auth.aside.l3'] as const).map((k) => (
              <li key={k} className="flex items-start gap-2.5">
                <Icon name="checkCircle" size={17} className="mt-0.5 shrink-0 text-accent2" /> {t(k)}
              </li>
            ))}
          </ul>
          <p className="mt-auto pt-10 text-xs text-white/50">4IIR G22 · EMSI Rabat · 2026/2027</p>
        </div>
      </aside>

      <section className="p-6 sm:p-10">
        <div className="mb-6 flex items-center gap-3 lg:hidden">
          <BrandMark small />
          <Wordmark className="text-lg" />
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={current} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            <h1 className="text-2xl font-extrabold tracking-tight">{t(titles[current][0])}</h1>
            <p className="mt-1 text-sm text-muted">{t(titles[current][1])}</p>

            {(
              <div className="mt-6 grid grid-cols-2 rounded-lg border border-line bg-surface2 p-1 text-sm font-semibold">
                {(['login', 'signup'] as const).map((m) => (
                  <button key={m} type="button" onClick={() => go(m)} className={`rounded-md py-2 transition ${current === m ? 'bg-surface text-accent shadow-sm' : 'text-muted'}`} data-testid={`auth-tab-${m}`}>
                    {t(m === 'login' ? 'auth.login.tab' : 'auth.signup.tab')}
                  </button>
                ))}
              </div>
            )}

            {wasKicked && (
              <p className="mt-6 flex items-start gap-2 rounded-lg border border-warn/40 bg-warn/[0.07] p-3 text-sm" role="alert" data-testid="auth-kicked">
                <Icon name="alert" size={16} className="mt-0.5 shrink-0 text-warn" /> {t('auth.kicked')}
              </p>
            )}

            <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
              {current === 'signup' && (
                <Field icon="user" label={t('auth.name')}>
                  <input className="input pl-10" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" placeholder={t('auth.name.ph')} />
                </Field>
              )}
              <Field icon="chat" label={t('auth.email')}>
                <input className="input pl-10" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="prenom.nom@emsi-edu.ma" data-testid="auth-email" />
              </Field>
              {(
                <Field icon="lock" label={t('auth.password')}>
                  <input
                    className="input pl-10 pr-11"
                    type={show ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={current === 'signup' ? 8 : undefined}
                    autoComplete={current === 'login' ? 'current-password' : 'new-password'}
                    data-testid="auth-password"
                  />
                  <button type="button" onClick={() => setShow(!show)} className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md text-muted hover:text-fg" aria-label={t('auth.showPassword')}>
                    <Icon name="eye" size={17} />
                  </button>
                </Field>
              )}
              {current === 'signup' && (
                <Field icon="lock" label={t('auth.password2')}>
                  <input className="input pl-10" type={show ? 'text' : 'password'} value={password2} onChange={(e) => setPassword2(e.target.value)} required autoComplete="new-password" />
                </Field>
              )}
              {current === 'signup' && <p className="text-xs text-muted">{t('auth.passwordRule')}</p>}
              {current === 'login' && <p className="text-xs text-muted">{t('auth.forgot.hint')}</p>}

              {error && (
                <p className="flex items-start gap-2 rounded-lg border border-bad/40 bg-bad/[0.06] p-3 text-sm text-bad" role="alert">
                  <Icon name="alert" size={16} className="mt-0.5 shrink-0" /> {t(error)}
                </p>
              )}

              <button className="btn-primary w-full" disabled={busy} data-testid="auth-submit">
                {busy && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                {t(current === 'login' ? 'auth.login.cta' : 'auth.signup.cta')}
              </button>
            </form>
          </motion.div>
        </AnimatePresence>
      </section>
    </div>
  );
}
