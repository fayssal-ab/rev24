import { L } from '../lib';
import type { Module } from '../../src/lib/schema';
import * as intro from './intro';
import * as rappel from './rappel';
import * as pandas from './pandas';
import * as nettoyage from './nettoyage';
import * as visu from './visu';
import * as tests from './tests';
import * as demos from './demos';
import * as blanc from './blanc';

/** Every chapter of the course is open again (the test is over); the proofs and the mock test stay. */
const parts = [intro, rappel, pandas, nettoyage, visu, tests, demos, blanc];

export const module: Module = {
  id: 'data',
  title: L(['Analyse de données', 'Analyse de données', 'Data analysis']),
  subtitle: L(['Pr. A. Kadiri — statistiques, pandas, nettoyage, visualisation, tests d\'hypothèses et démonstrations', 'Pr. A. Kadiri — statistiques, pandas, nettoyage, visualisation, tests w démonstrations', 'Pr. A. Kadiri — statistics, pandas, cleaning, visualisation, hypothesis tests and proofs']),
  color: '#00844e',
  icon: 'chart',
  theme: 'violet',
  chapters: parts.map((p) => p.chapter.id),
  upcoming: [{ id: 'chap3', order: 4.5, title: L(['Chap 3 — (pas encore sur le Drive)', 'Fasl 3 — (mazal ma kaynch f Drive)', 'Ch. 3 — (not on the Drive yet)']) }],
  annales: [
    {
      id: 'blanc-controle',
      title: L(['Examen blanc du contrôle — pandas, loi normale, Student', 'Examen blanc dyal contrôle — pandas, loi normale, Student', 'Mock test — pandas, normal law, Student']),
      minutes: 90,
      intro: L(['3 exercices, aucune question de cours : pandas (6 pts), loi normale avec les 3 cas ≠, <, > (7 pts), Student avec les 3 cas (7 pts). Toutes les données sont dans l\'énoncé. Écris sur papier (code + 7 lignes par test), puis compare avec la correction détaillée.', '3 exercices, bla questions de cours : pandas (6), loi normale 3 cas ≠, <, > (7), Student 3 cas (7). Data kamla f l énoncé. Kteb f wer9a, mn ba3d 9aren m3a correction mfssla.', '3 exercises, no theory questions: pandas (6), normal law in the 3 cases (7), Student in the 3 cases (7). All data in the statement. Write on paper, then compare with the detailed solution.']),
      parts: [{ exerciseId: 'd-x-b1', points: 6 }, { exerciseId: 'd-x-b2', points: 7 }, { exerciseId: 'd-x-b3', points: 7 }]
    }
  ],
  weights: { tests: 5, pandas: 4, demos: 3, nettoyage: 3, rappel: 3, visu: 2, 'd-intro': 1, blanc: 1 }
};

export const chapters = parts.map((p) => p.chapter);
export const questions = parts.flatMap((p) => p.questions);
export const exercises = parts.flatMap((p) => p.exercises);
export const flashcards = parts.flatMap((p) => p.flashcards);
export const reference = parts.flatMap((p) => p.reference);
export const missions = [];
