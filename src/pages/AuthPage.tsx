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

  const strength = passwordStrength(password);

  return (
    <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-line bg-surface shadow-[0_30px_80px_-40px_rgba(11,36,64,0.45)] lg:min-h-[620px] lg:grid-cols-[1.05fr_1fr]" data-testid="auth-page">
      {/* the class on the left */}
      <aside className="relative min-h-[210px] overflow-hidden bg-[#0B2440] text-white">
        <img src={`${import.meta.env.BASE_URL}group22-banner.jpg`} alt="" className="absolute inset-0 h-full w-full object-cover object-[50%_35%] opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B2440] via-[#0B2440]/80 to-[#0B2440]/20 lg:bg-gradient-to-br lg:from-[#0B2440]/95 lg:via-[#0B2440]/75 lg:to-[#0B2440]/40" />
        <div className="relative flex h-full flex-col p-6 sm:p-10">
          <div className="hidden items-center gap-3 lg:flex">
            <BrandMark />
            <Wordmark className="text-xl [&>span]:text-accent2" />
          </div>
          <div className="mt-auto pt-10 lg:mt-16 lg:pt-0">
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/60">EMSI Rabat · 4IIR · 2026/2027</span>
            <div className="mt-3 flex items-center gap-3 font-sign text-5xl uppercase leading-none sm:text-6xl">
              Group
              <span className="sticker inline-block rounded-md bg-accent px-3 py-1.5">22</span>
            </div>
            <p className="mt-4 max-w-sm text-[15px] text-white/80">{t('auth.aside.title')}</p>
          </div>
          <ul className="mt-8 hidden space-y-3 text-sm text-white/85 lg:block">
            {(['auth.aside.l1', 'auth.aside.l2', 'auth.aside.l3'] as const).map((k, i) => (
              <motion.li key={k} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.1 }} className="flex items-start gap-3 rounded-xl bg-white/[0.07] px-3.5 py-2.5 backdrop-blur-sm">
                <Icon name={(['lock', 'book', 'sparkles'] as const)[i]} size={17} className="mt-0.5 shrink-0 text-accent2" /> {t(k)}
              </motion.li>
            ))}
          </ul>
        </div>
      </aside>

      <section className="flex flex-col justify-center p-6 sm:p-10">
        {/* tabs with a sliding pill */}
        <div className="relative grid grid-cols-2 rounded-full border border-line bg-surface2 p-1 text-sm font-semibold">
          {(['login', 'signup'] as const).map((m) => (
            <button key={m} type="button" onClick={() => go(m)} className={`relative z-10 rounded-full py-2.5 transition-colors ${current === m ? 'text-white' : 'text-muted hover:text-fg'}`} data-testid={`auth-tab-${m}`}>
              {current === m && <motion.span layoutId="auth-pill" className="absolute inset-0 -z-10 rounded-full bg-accent shadow-sm" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
              {t(m === 'login' ? 'auth.login.tab' : 'auth.signup.tab')}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={current} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            <h1 className="mt-8 font-display text-3xl font-bold tracking-tight">{t(titles[current][0])}</h1>
            <p className="mt-1.5 text-sm text-muted">{t(titles[current][1])}</p>

            {wasKicked && (
              <p className="mt-6 flex items-start gap-2 rounded-xl border border-warn/40 bg-warn/[0.07] p-3 text-sm" role="alert" data-testid="auth-kicked">
                <Icon name="alert" size={16} className="mt-0.5 shrink-0 text-warn" /> {t('auth.kicked')}
              </p>
            )}

            <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
              {current === 'signup' && (
                <Field icon="user" label={t('auth.name')}>
                  <input className="input h-12 rounded-xl pl-10" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" placeholder={t('auth.name.ph')} />
                </Field>
              )}
              <Field icon="chat" label={t('auth.email')}>
                <input className="input h-12 rounded-xl pl-10" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="prenom.nom@emsi-edu.ma" data-testid="auth-email" />
              </Field>
              <Field icon="lock" label={t('auth.password')}>
                <input
                  className="input h-12 rounded-xl pl-10 pr-11"
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={current === 'signup' ? 8 : undefined}
                  autoComplete={current === 'login' ? 'current-password' : 'new-password'}
                  data-testid="auth-password"
                />
                <button type="button" onClick={() => setShow(!show)} className={`absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md transition ${show ? 'text-accent' : 'text-muted hover:text-fg'}`} aria-label={t('auth.showPassword')} aria-pressed={show}>
                  <Icon name="eye" size={17} />
                </button>
              </Field>
              {current === 'signup' && password && (
                <div aria-live="polite">
                  <div className="flex gap-1.5">
                    {[0, 1, 2, 3].map((k) => (
                      <span key={k} className={`h-1.5 flex-1 rounded-full transition-colors ${k < strength ? STRENGTH_COLORS[strength] : 'bg-surface2'}`} />
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-muted">{t(STRENGTH_KEYS[strength])}</p>
                </div>
              )}
              {current === 'signup' && (
                <Field icon="lock" label={t('auth.password2')}>
                  <input className="input h-12 rounded-xl pl-10 pr-11" type={show ? 'text' : 'password'} value={password2} onChange={(e) => setPassword2(e.target.value)} required autoComplete="new-password" />
                  {password2 && password2 === password && <Icon name="checkCircle" size={17} className="absolute right-3 top-1/2 -translate-y-1/2 text-ok" />}
                </Field>
              )}
              {current === 'signup' && <p className="text-xs text-muted">{t('auth.passwordRule')}</p>}
              {current === 'login' && <p className="text-xs text-muted">{t('auth.forgot.hint')}</p>}

              {error && (
                <motion.p initial={{ x: -6 }} animate={{ x: [6, -4, 2, 0] }} transition={{ duration: 0.3 }} className="flex items-start gap-2 rounded-xl border border-bad/40 bg-bad/[0.06] p-3 text-sm text-bad" role="alert">
                  <Icon name="alert" size={16} className="mt-0.5 shrink-0" /> {t(error)}
                </motion.p>
              )}

              <button className="btn-primary group h-12 w-full rounded-xl text-[15px]" disabled={busy} data-testid="auth-submit">
                {busy && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                {t(current === 'login' ? 'auth.login.cta' : 'auth.signup.cta')}
                {!busy && <Icon name="arrowRight" size={17} className="transition-transform group-hover:translate-x-1" />}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted">
              {t(current === 'login' ? 'auth.switch.toSignup' : 'auth.switch.toLogin')}{' '}
              <button type="button" onClick={() => go(current === 'login' ? 'signup' : 'login')} className="font-semibold text-accent hover:underline">
                {t(current === 'login' ? 'auth.signup.tab' : 'auth.login.tab')}
              </button>
            </p>
          </motion.div>
        </AnimatePresence>
      </section>
    </div>
  );
}

/** 0–4: length ≥ 8, length ≥ 12, mixed case, digit or symbol. */
function passwordStrength(pw: string): number {
  if (!pw) return 0;
  let n = pw.length >= 8 ? 1 : 0;
  if (pw.length >= 12) n++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) n++;
  if (/\d/.test(pw) || /[^\w\s]/.test(pw)) n++;
  return pw.length < 8 ? Math.min(n, 1) : n;
}
const STRENGTH_COLORS = ['bg-surface2', 'bg-bad', 'bg-warn', 'bg-accent2', 'bg-ok'];
const STRENGTH_KEYS: UIKey[] = ['auth.pw.0', 'auth.pw.1', 'auth.pw.2', 'auth.pw.3', 'auth.pw.4'];
