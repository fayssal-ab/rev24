import { useState } from 'react';
import { Icon } from '../components/Icon';
import { BrandMark, Wordmark } from '../components/Layout';
import { useT } from '../hooks/useT';
import { refreshMe, signOut, useAuth } from '../auth/auth';

/** Shown to a signed-in account until the admin approves it (or when it was blocked). */
export default function PendingPage() {
  const { t } = useT();
  const user = useAuth((s) => s.user);
  const [busy, setBusy] = useState(false);
  const blocked = user?.status === 'blocked';
  const check = async () => {
    setBusy(true);
    await refreshMe();
    setBusy(false);
  };
  return (
    <div className="mx-auto max-w-xl py-10" data-testid="pending-page">
      <div className="rounded-2xl border border-line bg-surface p-8 text-center shadow-sm sm:p-10">
        <div className="mb-6 flex items-center justify-center gap-2.5">
          <BrandMark small />
          <Wordmark className="text-lg" />
        </div>
        <span className={`mx-auto grid h-14 w-14 place-items-center rounded-full ${blocked ? 'bg-bad/10 text-bad' : 'bg-accent/10 text-accent'}`}>
          <Icon name={blocked ? 'lock' : 'clock'} size={26} />
        </span>
        <h1 className="mt-5 font-display text-2xl font-bold">{t(blocked ? 'pending.blocked.title' : 'pending.title')}</h1>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-muted">{t(blocked ? 'pending.blocked.sub' : 'pending.sub')}</p>
        {user && (
          <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 font-mono text-xs text-muted">
            <Icon name="user" size={13} /> {user.email}
          </p>
        )}
        {!blocked && (
          <p className="mt-4 flex items-center justify-center gap-2 text-xs text-muted">
            <span className="h-2 w-2 animate-pulse rounded-full bg-accent" /> {t('pending.checking')}
          </p>
        )}
        <div className="mt-7 flex flex-wrap justify-center gap-2">
          {!blocked && (
            <button className="btn-primary" onClick={() => void check()} disabled={busy}>
              <Icon name="reset" size={15} /> {t('pending.refresh')}
            </button>
          )}
          <button className="btn-ghost" onClick={() => void signOut()}>
            {t('auth.signout')}
          </button>
        </div>
      </div>
    </div>
  );
}
