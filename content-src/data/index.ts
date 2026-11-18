import { L } from '../lib';
import type { Module } from '../../src/lib/schema';
import * as intro from './intro';
import * as pandas from './pandas';
import * as visu from './visu';
import * as tests from './tests';

const parts = [intro, pandas, visu, tests];

export const module: Module = {
  id: 'data',
  title: L(['Analyse de données', 'Analyse de données', 'Data analysis']),
  subtitle: L(['Pr. A. Kadiri — pandas, visualisation, tests d\'hypothèses', 'Pr. A. Kadiri — pandas, visualisation, tests', 'Pr. A. Kadiri — pandas, visualisation, hypothesis tests']),
  color: '#8b5cf6',
  icon: 'chart',
  theme: 'violet',
  chapters: parts.map((p) => p.chapter.id),
  upcoming: [
    { id: 'chap2', title: L(['Chap 2 — (à venir)', 'Fasl 2 — (jay)', 'Ch. 2 — (coming)']) },
    { id: 'chap3', title: L(['Chap 3 — (à venir)', 'Fasl 3 — (jay)', 'Ch. 3 — (coming)']) }
  ],
  annales: [],
  weights: { tests: 5, pandas: 3, visu: 2, 'd-intro': 1 }
};

export const chapters = parts.map((p) => p.chapter);
export const questions = parts.flatMap((p) => p.questions);
export const exercises = parts.flatMap((p) => p.exercises);
export const flashcards = parts.flatMap((p) => p.flashcards);
export const reference = parts.flatMap((p) => p.reference);
export const missions = [];
