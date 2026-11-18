import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageTitle } from '../components/Layout';
import { useStore, EXPORT_KEYS } from '../store/store';
import { useT, useL } from '../hooks/useT';
import { MODULES } from '../lib/content';
import { useAllModules } from '../hooks/useModule';
import { chapterMastery, moduleMastery } from '../lib/mastery';
import { Ring } from '../components/Ring';
import { Icon } from '../components/Icon';
import type { UIKey } from '../i18n/ui';

const BADGES = ['chmod', 'root', 'h0', '24h', 'terminal', 'exam', 'streak'];

export default function ProgressPage() {
  const { t } = useT();
  const tl = useL();
  const st = useStore();
  const content = useAllModules(MODULES.map((m) => m.id));
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState('');
  const stats = Object.values(st.qstats);
  const answered = stats.reduce((a, s) => a + s.seen, 0);
  const correct = stats.reduce((a, s) => a + s.correct, 0);
  const level = Math.floor(st.xp / 500) + 1;

  const exportJson = () => {
    const data = Object.fromEntries(EXPORT_KEYS.map((k) => [k, (st as unknown as Record<string, unknown>)[k]]));
    const blob = new Blob([JSON.stringify({ app: 'rev24', version: 1, exported: new Date().toISOString(), data }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `rev24-progression-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const importJson = async (f: File) => {
    try {
      const j = JSON.parse(await f.text());
      if (j.app !== 'rev24' || typeof j.data !== 'object') throw new Error();
      st.importData(j.data);
      setMsg(t('prog.importOk'));
    } catch {
      setMsg(t('prog.importKo'));
    }
  };

  return (
    <div className="space-y-5">
      <PageTitle title={t('prog.title')} />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { k: t('prog.level'), v: level, icon: 'star' },
          { k: 'XP', v: st.xp, icon: 'bolt' },
          { k: t('prog.answered'), v: answered, icon: 'quiz' },
          { k: t('prog.accuracy'), v: answered ? `${Math.round((correct / answered) * 100)} %` : '—', icon: 'target' },
          { k: t('prog.exDone'), v: Object.values(st.exercises).filter((x) => x === 'ok').length, icon: 'dumbbell' },
          { k: t('prog.missionsDone'), v: Object.values(st.missions).filter(Boolean).length, icon: 'terminal' },
          { k: t('home.streak'), v: st.streak.count, icon: 'flame' },
          { k: t('nav.exam'), v: st.exams.length, icon: 'flag' }
        ].map((x) => (
          <div key={x.k} className="card p-3">
            <div className="flex items-center gap-1 text-xs text-muted">
              <Icon name={x.icon} size={14} /> {x.k}
            </div>
            <div className="text-2xl font-bold tabular-nums">{x.v}</div>
          </div>
        ))}
      </div>

      {content?.map((c) => (
        <section key={c.module.id} className="card p-4">
          <div className="mb-3 flex items-center gap-3">
            <Ring value={moduleMastery(c, st)} size={48} stroke={5} />
            <h2 className="font-semibold">{tl(c.module.title)}</h2>
          </div>
          <ul className="space-y-2">
            {c.chapters.map((ch) => {
              const v = chapterMastery(c, ch.id, st);
              return (
                <li key={ch.id}>
                  <Link to={`/m/${c.module.id}/c/${ch.id}`} className="grid grid-cols-[1fr_auto] items-center gap-2 text-sm hover:text-accent">
                    <span className="truncate">{tl(ch.title)}</span>
                    <span className="font-mono text-xs">{v}%</span>
                    <span className="col-span-2 h-2 rounded-full" style={{ background: `linear-gradient(90deg, rgb(var(--${v >= 70 ? 'ok' : v >= 40 ? 'warn' : 'bad'})) ${v}%, rgb(var(--surface2)) ${v}%)` }} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <section>
        <h2 className="h2 mb-2">{t('prog.badges')}</h2>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {BADGES.map((b) => {
            const on = st.badges.includes(b);
            return (
              <li key={b} className={`card p-3 text-center ${on ? 'border-accent' : 'opacity-50'}`} data-testid={`badge-${b}`} data-on={on}>
                <div className={`mx-auto mb-1 grid h-10 w-10 place-items-center rounded-full ${on ? 'bg-accent text-bg' : 'bg-surface2 text-muted'}`}>
                  <Icon name={on ? 'star' : 'lock'} size={18} />
                </div>
                <div className="text-sm font-semibold">{t(`badge.${b}` as UIKey)}</div>
                <div className="text-[11px] text-muted">{t(`badge.${b}.desc` as UIKey)}</div>
              </li>
            );
          })}
        </ul>
      </section>

      {st.exams.length > 0 && (
        <section className="card p-4">
          <h2 className="mb-2 font-semibold">{t('exam.history')}</h2>
          <ul className="space-y-1 text-sm">
            {[...st.exams].reverse().map((e) => (
              <li key={e.date} className="flex justify-between gap-2">
                <span className="text-muted">
                  {new Date(e.date).toLocaleString()} · {e.module}
                </span>
                <span className="font-mono font-bold">{String(e.note).replace('.', ',')}/20</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="flex flex-wrap gap-2">
        <button className="btn-ghost" onClick={exportJson}>
          <Icon name="download" size={16} /> {t('prog.export')}
        </button>
        <button className="btn-ghost" onClick={() => fileRef.current?.click()}>
          <Icon name="upload" size={16} /> {t('prog.import')}
        </button>
        <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files?.[0] && importJson(e.target.files[0])} />
        <button className="btn-ghost text-bad" onClick={() => window.confirm(t('prog.resetConfirm')) && st.resetAll()}>
          <Icon name="trash" size={16} /> {t('prog.resetAll')}
        </button>
        {msg && <p className="w-full text-sm text-muted">{msg}</p>}
      </section>
    </div>
  );
}
