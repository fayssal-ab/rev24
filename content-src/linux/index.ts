import { L } from '../lib';
import type { Module } from '../../src/lib/schema';
import * as intro from './intro';
import * as installfhs from './installfhs';
import * as demarrage from './demarrage';
import * as ccblanc from './ccblanc';
import * as ccexams from './ccexams';
import * as tp1 from './tp1';
import * as grub from './grub';
import * as systemd from './systemd';
import * as paquets from './paquets';
import * as users from './users';
import { missions as allMissions } from './missions';

/** CC (Pr Zbakh) : Installation, FHS, processus de démarrage (GRUB, systemd) — documents papier autorisés. */
/**
 * Only what the CC covers is open. Chap 1 (intro), TP1 (shell), TP4 (paquets) and Chap 4 + TP5 (users) are locked:
 * their sources stay in this folder; add them back to `parts` (and their missions below) to reopen them.
 */
void [intro, tp1, paquets, users];
const parts = [installfhs, demarrage, grub, systemd, ccblanc];
const locked = (id: string, order: number, t: [string, string, string]) => ({ id, order, title: L([t[0] + ' — verrouillé (hors CC)', t[1] + ' — msdoud (barra CC)', t[2] + ' — locked (not in the test)']) });
/** only the boot missions (GRUB, root password, systemd) stay open */
export const missions = allMissions.filter((m) => /^m-(grub|root|systemd)/.test(m.id));
const exam = (id: string, t: [string, string, string], minutes: number, intro: [string, string, string], ids: string[], pts: number) => ({
  id,
  title: L(t),
  minutes,
  intro: L(intro),
  parts: ids.map((exerciseId) => ({ exerciseId, points: pts }))
});

export const module: Module = {
  id: 'linux',
  title: L(['Administration Unix / Linux RHEL 9', 'Administration Unix / Linux RHEL 9', 'Unix / Linux administration (RHEL 9)']),
  subtitle: L(['Pr Zbakh — CC : Installation, FHS, démarrage (GRUB, systemd) · documents papier autorisés', 'Pr Zbakh — CC : Installation, FHS, démarrage (GRUB, systemd) · documents autorisés', 'Pr Zbakh — test: installation, FHS, boot (GRUB, systemd) · paper documents allowed']),
  color: '#2d6a3e',
  icon: 'terminal',
  theme: 'terminal',
  chapters: parts.map((p) => p.chapter.id),
  upcoming: [
    locked('intro', 1, ['Chap 1 — Introduction', 'Fasl 1 — Mo9addima', 'Ch. 1 — Introduction']),
    locked('tp1', 2, ['TP1 — Prise en main du shell', 'TP1 — Shell', 'TP1 — Shell basics']),
    locked('paquets', 5, ['TP4 — Paquetages (rpm, dnf)', 'TP4 — Paquets', 'TP4 — Packages']),
    locked('users', 6, ['Chap 4 + TP5 — Utilisateurs, groupes et droits', 'Fasl 4 + TP5 — Users w droits', 'Ch. 4 + TP5 — Users and permissions'])
  ],
  annales: [
    exam('cc-facile', ['CC Linux — Niveau 1 · Facile', 'CC Linux — Niveau 1 · Sahel', 'Linux test — Level 1 · Easy'], 45, ['4 exercices de 5 points : les définitions et les commandes de base. Écris ta réponse sous chaque exercice ; la correction est automatique à la fin.', '4 exercices × 5 pts : définitions w commandes de base. Kteb jawab ta7t kol exercice ; correction automatique.', '4 × 5 pts: definitions and basic commands. Automatic marking at the end.'], ['lx-e-1', 'lx-e-2', 'lx-e-3', 'lx-e-4'], 5),
    exam('cc-moyen', ['CC Linux — Niveau 2 · Moyen (type CC)', 'CC Linux — Niveau 2 · Moyen (b7al CC)', 'Linux test — Level 2 · Medium (real test style)'], 90, ['5 exercices de 4 points, comme le vrai CC : partitionnement, FHS, pannes de démarrage, GRUB2, systemd. Documents autorisés.', '5 × 4 pts b7al CC. Documents autorisés.', '5 × 4 pts like the real test. Documents allowed.'], ['lx-cc-1', 'lx-cc-2', 'lx-cc-3', 'lx-cc-4', 'lx-cc-5'], 4),
    exam('cc-difficile', ['CC Linux — Niveau 3 · Difficile', 'CC Linux — Niveau 3 · S3ib', 'Linux test — Level 3 · Hard'], 90, ['4 exercices de 5 points : MBR/GPT, entrée GRUB personnalisée, unité systemd avec dépendances, enquête journalctl.', '4 × 5 pts : MBR/GPT, entrée GRUB, unité systemd, journalctl.', '4 × 5 pts: MBR/GPT, custom GRUB entry, systemd unit, journalctl.'], ['lx-h-1', 'lx-h-2', 'lx-h-3', 'lx-h-4'], 5),
    exam('cc-expert', ['CC Linux — Niveau 4 · Expert', 'CC Linux — Niveau 4 · Expert', 'Linux test — Level 4 · Expert'], 120, ['4 exercices de 5 points pour viser 20/20 : mot de passe root (rd.break), UEFI en détail, SysVinit → systemd, diagnostic complet d\'un démarrage.', '4 × 5 pts l 20/20 : rd.break, UEFI, SysVinit → systemd, diagnostic.', '4 × 5 pts for 20/20: rd.break, UEFI, SysVinit → systemd, diagnosis.'], ['lx-x-1', 'lx-x-2', 'lx-x-3', 'lx-x-4'], 5)
  ],
  weights: { demarrage: 6, 'install-fhs': 5, grub: 5, systemd: 5, 'cc-blanc': 3 }
};

export const chapters = parts.map((p) => p.chapter);
export const questions = parts.flatMap((p) => p.questions);
export const exercises = [...parts.flatMap((p) => p.exercises), ...ccexams.exercises];
export const flashcards = parts.flatMap((p) => p.flashcards);
export const reference = parts.flatMap((p) => p.reference);
