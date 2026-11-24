import { L } from '../lib';
import type { Module } from '../../src/lib/schema';
import * as pandas from './pandas';
import * as tests from './tests';
import * as demos from './demos';
import * as blanc from './blanc';

/**
 * Only what the test covers is open: pandas, hypothesis tests, their proofs and the mock test.
 * Chap 0 (intro), Rappel, Chap 2 (nettoyage) and Chap 4 (visualisation) are locked: their sources
 * stay in this folder (intro.ts, rappel.ts, nettoyage.ts, visu.ts); add them back to `parts` to reopen them.
 */
const parts = [pandas, tests, demos, blanc];
const locked = (id: string, t: [string, string, string]) => ({ id, title: L([t[0] + ' — verrouillé', t[1] + ' — msdoud', t[2] + ' — locked']) });

export const module: Module = {
  id: 'data',
  title: L(['Analyse de données', 'Analyse de données', 'Data analysis']),
  subtitle: L(['Pr. A. Kadiri — pandas, tests d\'hypothèses (loi normale, Student, χ²) et leurs démonstrations', 'Pr. A. Kadiri — pandas, tests (normale, Student, χ²) w démonstrations', 'Pr. A. Kadiri — pandas, hypothesis tests (normal, Student, χ²) and their proofs']),
  color: '#00844e',
  icon: 'chart',
  theme: 'violet',
  chapters: parts.map((p) => p.chapter.id),
  upcoming: [
    locked('d-intro', ['Chap 0 — Introduction', 'Fasl 0 — Introduction', 'Ch. 0 — Introduction']),
    locked('rappel', ['Rappel — statistique descriptive', 'Rappel — statistique descriptive', 'Recap — descriptive statistics']),
    locked('nettoyage', ['Chap 2 — Nettoyage des données', 'Fasl 2 — Nettoyage', 'Ch. 2 — Data cleaning']),
    locked('chap3', ['Chap 3', 'Fasl 3', 'Ch. 3']),
    locked('visu', ['Chap 4 — Visualisation', 'Fasl 4 — Visualisation', 'Ch. 4 — Visualisation'])
  ],
  annales: [
    {
      id: 'blanc-controle',
      title: L(['Examen blanc du contrôle — pandas, loi normale, Student', 'Examen blanc dyal contrôle — pandas, loi normale, Student', 'Mock test — pandas, normal law, Student']),
      minutes: 90,
      intro: L(['3 exercices, aucune question de cours : pandas (6 pts), loi normale avec les 3 cas ≠, <, > (7 pts), Student avec les 3 cas (7 pts). Toutes les données sont dans l\'énoncé. Écris sur papier (code + 7 lignes par test), puis compare avec la correction détaillée.', '3 exercices, bla questions de cours : pandas (6), loi normale 3 cas ≠, <, > (7), Student 3 cas (7). Data kamla f l énoncé. Kteb f wer9a, mn ba3d 9aren m3a correction mfssla.', '3 exercises, no theory questions: pandas (6), normal law in the 3 cases (7), Student in the 3 cases (7). All data in the statement. Write on paper, then compare with the detailed solution.']),
      parts: [{ exerciseId: 'd-x-b1', points: 6 }, { exerciseId: 'd-x-b2', points: 7 }, { exerciseId: 'd-x-b3', points: 7 }]
    }
  ],
  weights: { tests: 5, pandas: 4, demos: 3, blanc: 1 }
};

export const chapters = parts.map((p) => p.chapter);
export const questions = parts.flatMap((p) => p.questions);
export const exercises = parts.flatMap((p) => p.exercises);
export const flashcards = parts.flatMap((p) => p.flashcards);
export const reference = parts.flatMap((p) => p.reference);
export const missions = [];
