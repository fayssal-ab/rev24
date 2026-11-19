import { describe, expect, it } from 'vitest';
import { parseSupport } from './supports';

describe('course materials file names', () => {
  it('reads order, type and title', () => {
    expect(parseSupport('/cours/data/05 - Cours - Chapitre 4 - Visualisation.pdf', 'u')).toMatchObject({ module: 'data', order: 5, kind: 'cours', title: 'Chapitre 4 – Visualisation', ext: 'pdf' });
    expect(parseSupport('/cours/ro/09 - TD - Théorie des graphes P1.pdf', 'u')).toMatchObject({ order: 9, kind: 'td', title: 'Théorie des graphes P1' });
    expect(parseSupport('/cours/ro/12 - Contrôle - Contrôle continu 2025.pdf', 'u')?.kind).toBe('controle');
  });
  it('guesses the type when the file name is free', () => {
    expect(parseSupport('/cours/oracle/TP1 architecture instance.docx', 'u')).toMatchObject({ order: 999, kind: 'tp', ext: 'docx' });
  });
});
