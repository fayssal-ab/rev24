import { describe, expect, it } from 'vitest';


import { MATH_RE_FOR_TEST as RE } from './Text';

const hits = (s: string) => [...s.matchAll(RE)].map((m) => m[0]);

describe('plain-text maths typesetting', () => {
  it('typesets indexed variables', () => {
    expect(hits('H0 : µ = 40 contre H1 : µ ≠ 40, Z0 = 3,125 et z0,025 = 1,96')).toEqual(['H0', 'µ', 'H1', 'µ', 'Z0', 'z0,025']);
    expect(hits('Oi et Ei, K5, S1 et S2, s0, Q1 et Q3, t0,01;9')).toEqual(['Oi', 'Ei', 'K5', 'S1', 'S2', 's0', 'Q1', 'Q3', 't0,01;9']);
  });
  it('leaves ordinary words alone', () => {
    expect(hits('si on ajoute ci-dessous ainsi que TD P1, TP1, Chap 0, 4IIR G22, ESXi et IPv4')).toEqual([]);
  });
});
