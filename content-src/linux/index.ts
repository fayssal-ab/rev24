import { L } from '../lib';
import type { Module } from '../../src/lib/schema';
import * as intro from './intro';
import * as tp1 from './tp1';
import * as grub from './grub';
import * as systemd from './systemd';
import * as paquets from './paquets';
import * as users from './users';
export { missions } from './missions';

const parts = [intro, tp1, grub, systemd, paquets, users];

export const module: Module = {
  id: 'linux',
  title: L(['Administration Unix / Linux RHEL 9', 'Administration Unix / Linux RHEL 9', 'Unix / Linux administration (RHEL 9)']),
  subtitle: L(['Intro, TP1 → TP5, utilisateurs et droits', 'Intro, TP1 → TP5, users w droits', 'Intro, TP1 → TP5, users and permissions']),
  color: '#2d6a3e',
  icon: 'terminal',
  theme: 'terminal',
  chapters: parts.map((p) => p.chapter.id),
  upcoming: [],
  annales: [],
  weights: { users: 6, systemd: 4, paquets: 3, grub: 2.5, tp1: 2, intro: 1 }
};

export const chapters = parts.map((p) => p.chapter);
export const questions = parts.flatMap((p) => p.questions);
export const exercises = parts.flatMap((p) => p.exercises);
export const flashcards = parts.flatMap((p) => p.flashcards);
export const reference = parts.flatMap((p) => p.reference);
