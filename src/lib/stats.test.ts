import { describe, it, expect } from 'vitest';
import * as S from './stats';

describe('normal distribution', () => {
  it('Φ known values', () => {
    expect(S.phi(0)).toBeCloseTo(0.5, 10);
    expect(S.phi(1.96)).toBeCloseTo(0.9750021, 6);
    expect(S.phi(-1.645)).toBeCloseTo(0.0499849, 6);
    expect(S.phi(3.6)).toBeCloseTo(0.99984089, 7);
    expect(S.phi(-4)).toBeCloseTo(3.167e-5, 7);
  });
  it('quantiles of the course table', () => {
    expect(S.zCrit(0.1)).toBeCloseTo(1.282, 3);
    expect(S.zCrit(0.05)).toBeCloseTo(1.645, 3);
    expect(S.zCrit(0.025)).toBeCloseTo(1.96, 2);
    expect(S.zCrit(0.02)).toBeCloseTo(2.054, 3);
    expect(S.zCrit(0.01)).toBeCloseTo(2.326, 3);
    expect(S.zCrit(0.005)).toBeCloseTo(2.576, 3);
  });
  it('normInv is the inverse of Φ', () => {
    for (const p of [0.001, 0.02, 0.3, 0.5, 0.77, 0.975, 0.9999]) expect(S.phi(S.normInv(p))).toBeCloseTo(p, 9);
  });
});

describe('student & chi2', () => {
  it('t quantiles', () => {
    expect(S.tCrit(0.01, 9)).toBeCloseTo(2.821, 3);
    expect(S.tCrit(0.025, 9)).toBeCloseTo(2.262, 3);
    expect(S.tCrit(0.05, 15)).toBeCloseTo(1.753, 3);
    expect(S.tCrit(0.025, 24)).toBeCloseTo(2.064, 3);
  });
  it('chi2 quantiles', () => {
    expect(S.chi2Crit(0.05, 1)).toBeCloseTo(3.841, 3);
    expect(S.chi2Crit(0.05, 2)).toBeCloseTo(5.991, 3);
    expect(S.chi2Crit(0.05, 3)).toBeCloseTo(7.815, 3);
    expect(S.chi2Crit(0.05, 5)).toBeCloseTo(11.07, 2);
    expect(S.chi2Crit(0.01, 4)).toBeCloseTo(13.277, 3);
  });
  it('t tends to normal', () => {
    expect(S.tCdf(1.96, 10000)).toBeCloseTo(S.phi(1.96), 4);
  });
});

describe('§8.2 course examples', () => {
  it('Fusée: σ connu, bilatéral α=5%', () => {
    const r = S.zTest(41.25, 40, 2, 25, 0.05, 'two');
    expect(r.stat).toBeCloseTo(3.125, 10);
    expect(r.crit).toBeCloseTo(1.96, 2);
    expect(r.reject).toBe(true);
    expect(r.pValue).toBeCloseTo(0.0018, 4);
  });
  it('Comprimés: σ inconnu, bilatéral seuil 98%', () => {
    const xs = [0.81, 0.84, 0.83, 0.8, 0.85, 0.86, 0.85, 0.83, 0.84, 0.8];
    expect(S.mean(xs)).toBeCloseTo(0.831, 10);
    expect(S.sampleSd(xs)).toBeCloseTo(0.0213, 4);
    const r = S.tTest(S.mean(xs), 0.83, S.sampleSd(xs), xs.length, 0.02, 'two');
    expect(r.stat).toBeCloseTo(0.148, 3);
    expect(r.crit).toBeCloseTo(2.821, 3);
    expect(r.nu).toBe(9);
    expect(r.reject).toBe(false);
  });
  it('Glycémie: σ connu, unilatéral gauche α=5%', () => {
    const r = S.zTest(1.12, 1, 0.1, 9, 0.05, 'left');
    expect(r.stat).toBeCloseTo(3.6, 10);
    expect(-r.crit).toBeCloseTo(-1.645, 3);
    expect(r.reject).toBe(false);
  });
  it('χ² normalité α=5%', () => {
    const r = S.chi2Normal([0.5, 1, 1.5], [2, 23, 17, 8], 1.168, 0.591, 0.05);
    const p = [0.129, 0.259, 0.325, 0.287];
    r.p.forEach((pi, i) => expect(pi).toBeCloseTo(p[i], 3));
    const E = [6.46, 12.95, 16.24, 14.36];
    r.E.forEach((e, i) => expect(Math.abs(e - E[i])).toBeLessThan(0.02));
    expect(Math.abs(r.chi2 - 13.74)).toBeLessThan(0.02);
    expect(r.nu).toBe(1);
    expect(r.crit).toBeCloseTo(3.841, 3);
    expect(r.reject).toBe(true);
  });
});

describe('compute registry', () => {
  it('runCompute with pick', () => {
    expect(S.runCompute({ fn: 'zTest', args: [41.25, 40, 2, 25, 0.05, 'two'], pick: 'stat' })).toBeCloseTo(3.125);
    expect(S.runCompute({ fn: 'chi2Normal', args: [[0.5, 1, 1.5], [2, 23, 17, 8], 1.168, 0.591, 0.05], pick: 'E.0' })).toBeCloseTo(6.46, 1);
    expect(S.runCompute({ fn: 'tTest', args: [1, 1, 1, 10, 0.05, 'two'], pick: 'reject' })).toBe(0);
  });
  it('power', () => {
    expect(S.zPower(40, 40, 2, 25, 0.05, 'two')).toBeCloseTo(0.05, 6);
  });
});
