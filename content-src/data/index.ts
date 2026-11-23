import { L } from '../lib';
import type { Module } from '../../src/lib/schema';
import * as intro from './intro';
import * as pandas from './pandas';
import * as visu from './visu';
import * as tests from './tests';
import * as rappel from './rappel';
import * as nettoyage from './nettoyage';
import * as blanc from './blanc';

const parts = [intro, rappel, pandas, nettoyage, visu, tests, blanc];

export const module: Module = {
  id: 'data',
  title: L(['Analyse de données', 'Analyse de données', 'Data analysis']),
  subtitle: L(['Pr. A. Kadiri — statistiques, pandas, nettoyage, visualisation, tests d\'hypothèses', 'Pr. A. Kadiri — statistiques, pandas, nettoyage, visualisation, tests', 'Pr. A. Kadiri — statistics, pandas, cleaning, visualisation, hypothesis tests']),
  color: '#00844e',
  icon: 'chart',
  theme: 'violet',
  chapters: parts.map((p) => p.chapter.id),
  upcoming: [{ id: 'chap3', order: 4.5, title: L(['Chap 3 — (pas encore sur le Drive)', 'Fasl 3 — (mazal ma kaynch f Drive)', 'Ch. 3 — (not on the Drive yet)']) }],
  annales: [
    {
      id: 'blanc-controle',
      title: L(['Examen blanc du contrôle — pandas + tests d\'hypothèses', 'Examen blanc dyal contrôle — pandas + tests', 'Mock test — pandas + hypothesis tests']),
      minutes: 90,
      intro: L(['4 exercices de 5 points, seulement le programme du contrôle. Écris tes réponses sur papier (code + 7 lignes pour les tests), puis compare avec la correction et note-toi.', '4 exercices × 5 pts, ghir programme dyal contrôle. Kteb f wer9a, mn ba3d 9aren m3a correction.', '4 exercises × 5 pts, test scope only. Write on paper, then compare and grade yourself.']),
      parts: [{ exerciseId: 'd-x-b1', points: 5 }, { exerciseId: 'd-x-b2', points: 5 }, { exerciseId: 'd-x-b3', points: 5 }, { exerciseId: 'd-x-b4', points: 5 }]
    }
  ],
  weights: { tests: 5, nettoyage: 3, pandas: 3, rappel: 3, visu: 2, 'd-intro': 1, blanc: 1 }
};

export const chapters = parts.map((p) => p.chapter);
export const questions = parts.flatMap((p) => p.questions);
export const exercises = parts.flatMap((p) => p.exercises);
export const flashcards = parts.flatMap((p) => p.flashcards);
export const reference = parts.flatMap((p) => p.reference);
export const missions = [];
