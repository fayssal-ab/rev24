/**
 * Admin dashboard (admin accounts only, checked again by the API):
 *   - Comptes : approve / block new sign-ups, edit, reset password, close session, delete, create
 *   - Supports : add a document (Drive link / URL), edit or hide a built-in file, delete
 *   - Annonces : messages shown at the top of the home page
 * Admin-only tool: labels are in French.
 */
import { useCallback, useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { Icon } from '../components/Icon';
import { api, useAuth } from '../auth/auth';
import { KINDS, RESOURCES, SUBJECTS, subjectById, type ResourceKind } from '../lib/catalog';
import { useRemoteSupports, type RemoteSupport } from '../lib/resources';
import type { Announcement } from '../components/Announcements';

type Status = 'pending' | 'approved' | 'blocked';
interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  groupe: string;
  role: 'admin' | 'user';
  status: Status;
  online: boolean;
  lastSeen: string | null;
  createdAt: string;
}

const ERR: Record<string, string> = {
  email_taken: 'Cet e-mail est déjà utilisé.',
  invalid_email: 'E-mail invalide.',
  weak_password: 'Mot de passe : 8 caractères minimum.',
  missing_fields: 'Remplis le titre et le lien.',
  invalid_url: 'Le lien doit commencer par https:// (ou /).',
  invalid_subject: 'Module invalide.',
  invalid_kind: 'Type invalide.',
  cannot_demote_self: 'Tu ne peux pas retirer ton propre rôle admin.',
  cannot_delete_self: 'Tu ne peux pas supprimer ton propre compte.',
  cannot_logout_self: 'Utilise « Se déconnecter » pour ta propre session.',
  exists: 'Ce fichier a déjà une modification : modifie-la.',
  forbidden: 'Réservé à l\'admin.',
  network: 'Serveur injoignable.'
};
const errMsg = (code: string) => ERR[code] ?? `Erreur (${code})`;

const STATUS: Record<Status, { label: string; cls: string }> = {
  pending: { label: 'En attente', cls: 'border-warn/40 bg-warn/10 text-warn' },
  approved: { label: 'Approuvé', cls: 'border-ok/40 bg-ok/10 text-ok' },
  blocked: { label: 'Bloqué', cls: 'border-bad/40 bg-bad/10 text-bad' }
};
const KIND_FR: Record<ResourceKind, string> = { cours: 'Cours', td: 'TD', tp: 'TP', controle: 'Contrôle / examen', resume: 'Résumé', annexe: 'Annexe' };

const fmt = (iso: string | null) => (iso ? new Date(iso).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—');

// ---------------------------------------------------------------- small building blocks
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-navy/40 p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label={title} className="w-full max-w-lg rounded-xl border border-line bg-surface p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-bold">{title}</h2>
          <button className="grid h-8 w-8 place-items-center rounded-md border border-line" onClick={onClose} aria-label="Fermer">
            <Icon name="x" size={15} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function F({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-muted">{label}</span>
      {children}
    </label>
  );
}

function ErrorLine({ error }: { error: string | null }) {
  if (!error) return null;
  return (
    <p className="flex items-start gap-2 rounded-md border border-bad/40 bg-bad/[0.06] p-2.5 text-sm text-bad" role="alert">
      <Icon name="alert" size={15} className="mt-0.5 shrink-0" /> {error}
    </p>
  );
}

const confirmDo = (msg: string) => window.confirm(msg);

// ---------------------------------------------------------------- users
interface UserForm {
  id?: string;
  displayName: string;
  email: string;
  groupe: string;
  role: 'admin' | 'user';
  status: Status;
  password: string;
}
const EMPTY_USER: UserForm = { displayName: '', email: '', groupe: '4IIR G22', role: 'user', status: 'approved', password: '' };

function UsersTab({ onPending }: { onPending: (n: number) => void }) {
  const me = useAuth((s) => s.user);
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | Status>('all');
  const [q, setQ] = useState('');
  const [form, setForm] = useState<UserForm | null>(null);
  const [formErr, setFormErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const r = await api<{ users: AdminUser[] }>('GET', '/admin/users');
    if (r.ok) {
      setUsers(r.data.users);
      onPending(r.data.users.filter((u) => u.status === 'pending').length);
    } else setError(errMsg(r.error));
  }, [onPending]);
  useEffect(() => {
    void load();
  }, [load]);

  const act = async (method: string, path: string, body?: unknown) => {
    setError(null);
    const r = await api(method, path, body);
    if (!r.ok) setError(errMsg(r.error));
    await load();
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setBusy(true);
    setFormErr(null);
    const payload = { displayName: form.displayName, email: form.email, groupe: form.groupe, role: form.role, status: form.status, ...(form.password ? { password: form.password } : {}) };
    const r = form.id ? await api('PUT', `/admin/users/${form.id}`, payload) : await api('POST', '/admin/users', { ...payload, password: form.password });
    setBusy(false);
    if (!r.ok) return setFormErr(errMsg(r.error));
    setForm(null);
    await load();
  };

  const list = (users ?? []).filter(
    (u) => (filter === 'all' || u.status === filter) && (!q.trim() || `${u.displayName} ${u.email} ${u.groupe}`.toLowerCase().includes(q.trim().toLowerCase()))
  );
  const count = (s: Status) => (users ?? []).filter((u) => u.status === s).length;

  return (
    <div>
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Comptes', n: users?.length ?? 0, icon: 'user' },
          { label: 'En attente', n: count('pending'), icon: 'clock' },
          { label: 'Approuvés', n: count('approved'), icon: 'checkCircle' },
          { label: 'En ligne', n: (users ?? []).filter((u) => u.online).length, icon: 'bolt' }
        ].map((x) => (
          <div key={x.label} className="card flex items-center gap-3 p-4">
            <Icon name={x.icon} size={18} className="text-accent" />
            <div>
              <div className="font-display text-2xl font-bold tabular-nums">{x.n}</div>
              <div className="text-xs text-muted">{x.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {(['all', 'pending', 'approved', 'blocked'] as const).map((s) => (
          <button key={s} className={`chip !py-1 !text-sm ${filter === s ? '!border-accent !text-accent' : ''}`} onClick={() => setFilter(s)}>
            {s === 'all' ? 'Tous' : STATUS[s].label}
            {s === 'pending' && count('pending') > 0 && <span className="rounded bg-warn px-1.5 text-[10px] font-bold text-white">{count('pending')}</span>}
          </button>
        ))}
        <input className="input !min-h-[36px] max-w-xs flex-1 !py-1.5 text-sm" placeholder="Rechercher un nom, un e-mail…" value={q} onChange={(e) => setQ(e.target.value)} type="search" />
        <button className="btn-primary btn-sm ml-auto" onClick={() => (setFormErr(null), setForm({ ...EMPTY_USER }))}>
          <Icon name="user" size={14} /> Ajouter un compte
        </button>
      </div>

      <ErrorLine error={error} />
      {!users && !error && <p className="py-8 text-center text-sm text-muted">Chargement…</p>}

      <ul className="mt-2 divide-y divide-line rounded-lg border border-line bg-surface">
        {list.map((u) => {
          const self = u.id === me?.id;
          return (
            <li key={u.id} className="flex flex-wrap items-center gap-3 px-4 py-3" data-testid="admin-user">
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${u.online ? 'bg-ok' : 'bg-line'}`} title={u.online ? 'En ligne' : `Vu : ${fmt(u.lastSeen)}`} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{u.displayName || u.email}</span>
                  {u.role === 'admin' && <span className="rounded border border-accent/40 px-1.5 text-[10px] font-bold uppercase text-accent">Admin</span>}
                  <span className={`rounded border px-1.5 text-[10px] font-bold uppercase ${STATUS[u.status].cls}`}>{STATUS[u.status].label}</span>
                </div>
                <div className="truncate text-xs text-muted">
                  {u.email} · {u.groupe} · inscrit le {fmt(u.createdAt)}
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {u.status !== 'approved' && (
                  <button className="btn-primary btn-sm" onClick={() => void act('PUT', `/admin/users/${u.id}`, { status: 'approved' })} data-testid="admin-approve">
                    <Icon name="check" size={14} /> Approuver
                  </button>
                )}
                {u.status !== 'blocked' && !self && (
                  <button className="btn-ghost btn-sm" onClick={() => void act('PUT', `/admin/users/${u.id}`, { status: 'blocked' })}>
                    <Icon name="lock" size={14} /> {u.status === 'pending' ? 'Refuser' : 'Bloquer'}
                  </button>
                )}
                <button className="btn-ghost btn-sm" onClick={() => (setFormErr(null), setForm({ id: u.id, displayName: u.displayName, email: u.email, groupe: u.groupe, role: u.role, status: u.status, password: '' }))}>
                  <Icon name="settings" size={14} /> Modifier
                </button>
                {u.online && !self && (
                  <button className="btn-ghost btn-sm" title="Fermer sa session" onClick={() => void act('POST', `/admin/users/${u.id}/logout`)}>
                    <Icon name="external" size={14} />
                  </button>
                )}
                {!self && (
                  <button
                    className="btn-ghost btn-sm text-bad"
                    title="Supprimer"
                    onClick={() => confirmDo(`Supprimer le compte ${u.email} et sa progression ?`) && void act('DELETE', `/admin/users/${u.id}`)}
                  >
                    <Icon name="trash" size={14} />
                  </button>
                )}
              </div>
            </li>
          );
        })}
        {users && !list.length && <li className="px-4 py-8 text-center text-sm text-muted">Aucun compte.</li>}
      </ul>

      {form && (
        <Modal title={form.id ? 'Modifier le compte' : 'Nouveau compte'} onClose={() => setForm(null)}>
          <form onSubmit={save} className="space-y-3">
            <F label="Nom complet">
              <input className="input" value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} />
            </F>
            <F label="E-mail">
              <input className="input" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </F>
            <div className="grid grid-cols-3 gap-3">
              <F label="Groupe">
                <input className="input" value={form.groupe} onChange={(e) => setForm({ ...form, groupe: e.target.value })} />
              </F>
              <F label="Rôle">
                <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as 'admin' | 'user' })}>
                  <option value="user">Étudiant</option>
                  <option value="admin">Admin</option>
                </select>
              </F>
              <F label="Statut">
                <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Status })}>
                  {(Object.keys(STATUS) as Status[]).map((s) => (
                    <option key={s} value={s}>
                      {STATUS[s].label}
                    </option>
                  ))}
                </select>
              </F>
            </div>
            <F label={form.id ? 'Nouveau mot de passe (laisser vide pour ne pas changer)' : 'Mot de passe (8 caractères min.)'}>
              <input className="input" type="text" autoComplete="new-password" required={!form.id} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </F>
            <ErrorLine error={formErr} />
            <div className="flex justify-end gap-2 pt-1">
              <button type="button" className="btn-ghost" onClick={() => setForm(null)}>
                Annuler
              </button>
              <button className="btn-primary" disabled={busy}>
                Enregistrer
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ---------------------------------------------------------------- supports
interface SupportForm {
  /** db row id when editing an existing row */
  id?: string;
  /** built-in file id when editing a built-in file */
  ref?: string;
  subject: string;
  kind: ResourceKind;
  title: string;
  url: string;
  sort: number;
  hidden: boolean;
}

/** One line of the admin list: a built-in file (with its override, if any) or a document added online. */
interface Row {
  key: string;
  subject: string;
  kind: ResourceKind;
  title: string;
  url: string;
  order: number;
  builtIn: boolean;
  hidden: boolean;
  edited: boolean;
  row?: RemoteSupport;
  ref?: string;
}

function SupportsTab() {
  const { remote, load } = useRemoteSupports();
  const [subject, setSubject] = useState('');
  const [form, setForm] = useState<SupportForm | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formErr, setFormErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    void load();
  }, [load]);

  const rows = useMemo<Row[]>(() => {
    const byRef = new Map(remote.filter((r) => r.ref).map((r) => [r.ref!, r]));
    const built: Row[] = RESOURCES.filter((r) => !r.route).map((r) => {
      const o = byRef.get(r.id);
      return {
        key: r.id,
        subject: o?.subject || r.subject,
        kind: o?.kind || r.kind,
        title: o?.title || r.title,
        url: r.url,
        order: o && o.sort !== 500 ? o.sort : r.order,
        builtIn: true,
        hidden: !!o?.hidden,
        edited: !!o,
        row: o,
        ref: r.id
      };
    });
    const added: Row[] = remote
      .filter((r) => !r.ref)
      .map((r) => ({ key: r.id, subject: r.subject, kind: r.kind, title: r.title, url: r.url, order: r.sort, builtIn: false, hidden: r.hidden, edited: false, row: r }));
    return [...built, ...added]
      .filter((r) => !subject || r.subject === subject)
      .sort((a, b) => a.subject.localeCompare(b.subject) || KINDS.indexOf(a.kind) - KINDS.indexOf(b.kind) || a.order - b.order);
  }, [remote, subject]);

  const run = async (method: string, path: string, body?: unknown) => {
    setError(null);
    const r = await api(method, path, body);
    if (!r.ok) setError(errMsg(r.error));
    await load();
    return r.ok;
  };

  /** Hide / show: built-in files get (or update) an override row; added documents toggle their own flag. */
  const toggleHidden = (r: Row) => {
    const hidden = !r.hidden;
    if (r.row) return run('PUT', `/admin/supports/${r.row.id}`, { ...r.row, hidden });
    return run('POST', '/admin/supports', { ref: r.ref, subject: r.subject, kind: r.kind, title: '', url: '', sort: 500, hidden });
  };

  const openEdit = (r: Row) => {
    setFormErr(null);
    setForm({ id: r.row?.id, ref: r.ref, subject: r.subject, kind: r.kind, title: r.title, url: r.builtIn ? '' : r.url, sort: r.row?.sort ?? 500, hidden: r.hidden });
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setBusy(true);
    setFormErr(null);
    const payload = { ref: form.ref ?? null, subject: form.subject, kind: form.kind, title: form.title.trim(), url: form.url.trim(), sort: form.sort, hidden: form.hidden };
    const r = form.id ? await api('PUT', `/admin/supports/${form.id}`, payload) : await api('POST', '/admin/supports', payload);
    setBusy(false);
    if (!r.ok) return setFormErr(errMsg(r.error));
    setForm(null);
    await load();
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <select className="input !min-h-[36px] w-auto !py-1.5 text-sm" value={subject} onChange={(e) => setSubject(e.target.value)}>
          <option value="">Tous les modules</option>
          {SUBJECTS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title.fr}
            </option>
          ))}
        </select>
        <span className="text-xs text-muted">{rows.length} documents</span>
        <button
          className="btn-primary btn-sm ml-auto"
          onClick={() => (setFormErr(null), setForm({ subject: subject || SUBJECTS[0].id, kind: 'cours', title: '', url: '', sort: 500, hidden: false }))}
          data-testid="admin-add-support"
        >
          <Icon name="upload" size={14} /> Ajouter un document
        </button>
      </div>
      <p className="mb-4 text-xs text-muted">
        Un document ajouté ici est un lien (Google Drive, PDF en ligne…). Les fichiers intégrés au site (dossier cours/) peuvent être renommés, déplacés ou masqués.
      </p>
      <ErrorLine error={error} />

      <ul className="mt-2 divide-y divide-line rounded-lg border border-line bg-surface">
        {rows.map((r) => (
          <li key={r.key} className={`flex flex-wrap items-center gap-3 px-4 py-2.5 ${r.hidden ? 'opacity-55' : ''}`} data-testid="admin-support">
            <span className="h-2 w-2 shrink-0 rounded-sm" style={{ background: subjectById(r.subject)?.color ?? '#999' }} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{r.title}</div>
              <div className="flex flex-wrap gap-x-2 text-xs text-muted">
                <span>{subjectById(r.subject)?.title.fr ?? r.subject}</span>
                <span>· {KIND_FR[r.kind]}</span>
                <span>· {r.builtIn ? 'Fichier intégré' : 'Lien ajouté'}</span>
                {r.edited && <span className="text-accent">· modifié</span>}
                {r.hidden && <span className="text-bad">· masqué</span>}
              </div>
            </div>
            <div className="flex gap-1.5">
              <a className="btn-ghost btn-sm" href={r.url} target="_blank" rel="noreferrer" title="Ouvrir">
                <Icon name="eye" size={14} />
              </a>
              <button className="btn-ghost btn-sm" onClick={() => openEdit(r)}>
                <Icon name="settings" size={14} /> Modifier
              </button>
              <button className="btn-ghost btn-sm" onClick={() => void toggleHidden(r)} title={r.hidden ? 'Afficher' : 'Masquer'}>
                <Icon name={r.hidden ? 'eye' : 'x'} size={14} /> {r.hidden ? 'Afficher' : 'Masquer'}
              </button>
              {r.builtIn && r.row && (
                <button className="btn-ghost btn-sm" title="Annuler les modifications" onClick={() => void run('DELETE', `/admin/supports/${r.row!.id}`)}>
                  <Icon name="reset" size={14} />
                </button>
              )}
              {!r.builtIn && r.row && (
                <button className="btn-ghost btn-sm text-bad" title="Supprimer" onClick={() => confirmDo(`Supprimer « ${r.title} » ?`) && void run('DELETE', `/admin/supports/${r.row!.id}`)}>
                  <Icon name="trash" size={14} />
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {form && (
        <Modal title={form.ref ? 'Modifier un fichier intégré' : form.id ? 'Modifier le document' : 'Ajouter un document'} onClose={() => setForm(null)}>
          <form onSubmit={save} className="space-y-3">
            <F label="Titre">
              <input className="input" required={!form.ref} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ex. Chapitre 3 – Jointures" />
            </F>
            {!form.ref && (
              <F label="Lien (Google Drive, PDF…)">
                <input className="input" required type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://drive.google.com/…" />
              </F>
            )}
            <div className="grid grid-cols-3 gap-3">
              <F label="Module">
                <select className="input" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
                  {SUBJECTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title.fr}
                    </option>
                  ))}
                </select>
              </F>
              <F label="Type">
                <select className="input" value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value as ResourceKind })}>
                  {KINDS.map((k) => (
                    <option key={k} value={k}>
                      {KIND_FR[k]}
                    </option>
                  ))}
                </select>
              </F>
              <F label="Ordre">
                <input className="input" type="number" value={form.sort} onChange={(e) => setForm({ ...form, sort: Number(e.target.value) })} />
              </F>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.hidden} onChange={(e) => setForm({ ...form, hidden: e.target.checked })} /> Masqué pour les étudiants
            </label>
            <ErrorLine error={formErr} />
            <div className="flex justify-end gap-2 pt-1">
              <button type="button" className="btn-ghost" onClick={() => setForm(null)}>
                Annuler
              </button>
              <button className="btn-primary" disabled={busy}>
                Enregistrer
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ---------------------------------------------------------------- announcements
function AnnouncementsTab() {
  const [list, setList] = useState<Announcement[]>([]);
  const [form, setForm] = useState<{ id?: string; title: string; body: string; pinned: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const load = useCallback(async () => {
    const r = await api<{ announcements: Announcement[] }>('GET', '/announcements');
    if (r.ok) setList(r.data.announcements);
  }, []);
  useEffect(() => {
    void load();
  }, [load]);
  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!form) return;
    const payload = { title: form.title, body: form.body, pinned: form.pinned };
    const r = form.id ? await api('PUT', `/admin/announcements/${form.id}`, payload) : await api('POST', '/admin/announcements', payload);
    if (!r.ok) return setError(errMsg(r.error));
    setForm(null);
    await load();
  };
  const remove = async (a: Announcement) => {
    if (!confirmDo(`Supprimer l'annonce « ${a.title} » ?`)) return;
    await api('DELETE', `/admin/announcements/${a.id}`);
    await load();
  };
  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <p className="text-xs text-muted">Les 3 plus récentes (épinglées d&apos;abord) s&apos;affichent en haut de l&apos;accueil.</p>
        <button className="btn-primary btn-sm ml-auto" onClick={() => (setError(null), setForm({ title: '', body: '', pinned: false }))}>
          <Icon name="bell" size={14} /> Nouvelle annonce
        </button>
      </div>
      <ul className="divide-y divide-line rounded-lg border border-line bg-surface">
        {list.map((a) => (
          <li key={a.id} className="flex items-start gap-3 px-4 py-3">
            <Icon name={a.pinned ? 'flag' : 'bell'} size={16} className="mt-1 shrink-0 text-accent" />
            <div className="min-w-0 flex-1">
              <div className="font-semibold">{a.title}</div>
              {a.body && <p className="whitespace-pre-line text-sm text-muted">{a.body}</p>}
              <div className="mt-1 font-mono text-[11px] text-muted">{fmt(a.createdAt)}</div>
            </div>
            <button className="btn-ghost btn-sm" onClick={() => (setError(null), setForm({ id: a.id, title: a.title, body: a.body, pinned: a.pinned }))}>
              <Icon name="settings" size={14} /> Modifier
            </button>
            <button className="btn-ghost btn-sm text-bad" onClick={() => void remove(a)} title="Supprimer">
              <Icon name="trash" size={14} />
            </button>
          </li>
        ))}
        {!list.length && <li className="px-4 py-8 text-center text-sm text-muted">Aucune annonce.</li>}
      </ul>
      {form && (
        <Modal title={form.id ? 'Modifier l\'annonce' : 'Nouvelle annonce'} onClose={() => setForm(null)}>
          <form onSubmit={save} className="space-y-3">
            <F label="Titre">
              <input className="input" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ex. Contrôle Oracle jeudi 10h" />
            </F>
            <F label="Message">
              <textarea className="input min-h-[120px]" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
            </F>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.pinned} onChange={(e) => setForm({ ...form, pinned: e.target.checked })} /> Épingler
            </label>
            <ErrorLine error={error} />
            <div className="flex justify-end gap-2 pt-1">
              <button type="button" className="btn-ghost" onClick={() => setForm(null)}>
                Annuler
              </button>
              <button className="btn-primary">Enregistrer</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ---------------------------------------------------------------- page
type Tab = 'users' | 'supports' | 'announcements';

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('users');
  const [pending, setPending] = useState(0);
  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'users', label: 'Comptes', icon: 'user' },
    { id: 'supports', label: 'Supports', icon: 'inbox' },
    { id: 'announcements', label: 'Annonces', icon: 'bell' }
  ];
  return (
    <div className="mx-auto max-w-6xl" data-testid="admin-page">
      <div className="mb-6 border-b border-line pb-6">
        <div className="eyebrow mb-2">GROUP22 · Administration</div>
        <h1 className="h1">Tableau de bord</h1>
        <p className="mt-2 text-[15px] text-muted">Valide les nouveaux comptes, gère les supports de cours et publie des annonces.</p>
      </div>
      <div className="scroll-thin mb-6 flex gap-1 overflow-x-auto border-b border-line" role="tablist">
        {tabs.map((x) => (
          <button
            key={x.id}
            role="tab"
            aria-selected={tab === x.id}
            onClick={() => setTab(x.id)}
            className={`-mb-px flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 sm:px-4 text-sm font-semibold transition-colors ${tab === x.id ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-fg'}`}
          >
            <Icon name={x.icon} size={16} /> {x.label}
            {x.id === 'users' && pending > 0 && <span className="rounded-full bg-warn px-1.5 text-[10px] font-bold text-white">{pending}</span>}
          </button>
        ))}
      </div>
      {/* users tab stays mounted so the pending badge stays accurate */}
      <div hidden={tab !== 'users'}>
        <UsersTab onPending={setPending} />
      </div>
      {tab === 'supports' && <SupportsTab />}
      {tab === 'announcements' && <AnnouncementsTab />}
    </div>
  );
}
