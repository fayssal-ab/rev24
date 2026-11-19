/**
 * Statistics library used by the course, the stats lab and the content checker.
 * Every number shown in Analyse-de-données exercises is verified against these functions.
 */

export type Tail = 'two' | 'left' | 'right';

export function mean(xs: number[]): number {
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

/** Corrected sample standard deviation S (divides by n − 1). */
export function sampleSd(xs: number[]): number {
  const m = mean(xs);
  return Math.sqrt(xs.reduce((a, x) => a + (x - m) ** 2, 0) / (xs.length - 1));
}

/** Population standard deviation (divides by n). */
export function popSd(xs: number[]): number {
  const m = mean(xs);
  return Math.sqrt(xs.reduce((a, x) => a + (x - m) ** 2, 0) / xs.length);
}

export function variance(xs: number[]): number {
  return sampleSd(xs) ** 2;
}

export function median(xs: number[]): number {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

/** Population variance (divides by n) — the "variance" of descriptive statistics. */
export function popVariance(xs: number[]): number {
  return popSd(xs) ** 2;
}

/** Quantile with linear interpolation — same convention as pandas `Series.quantile` (position (n − 1)·p). */
export function quantile(xs: number[], p: number): number {
  const s = [...xs].sort((a, b) => a - b);
  const pos = (s.length - 1) * p;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  return s[lo] + (s[hi] - s[lo]) * (pos - lo);
}

/** IQR method of the course: outliers are outside [Q1 − 1.5·IQR, Q3 + 1.5·IQR]. */
export function iqrBounds(xs: number[]): { q1: number; q3: number; iqr: number; low: number; high: number; outliers: number } {
  const q1 = quantile(xs, 0.25);
  const q3 = quantile(xs, 0.75);
  const iqr = q3 - q1;
  const low = q1 - 1.5 * iqr;
  const high = q3 + 1.5 * iqr;
  return { q1, q3, iqr, low, high, outliers: xs.filter((x) => x < low || x > high).length };
}

/** Population covariance (divides by n). */
export function covariance(xs: number[], ys: number[]): number {
  const mx = mean(xs);
  const my = mean(ys);
  return xs.reduce((a, x, i) => a + (x - mx) * (ys[i] - my), 0) / xs.length;
}

/** Pearson linear correlation coefficient r. */
export function correlation(xs: number[], ys: number[]): number {
  return covariance(xs, ys) / (popSd(xs) * popSd(ys));
}

/** Least-squares line y = a·x + b, with the coefficient of determination R². */
export function linReg(xs: number[], ys: number[]): { a: number; b: number; r2: number } {
  const a = covariance(xs, ys) / popVariance(xs);
  const b = mean(ys) - a * mean(xs);
  return { a, b, r2: correlation(xs, ys) ** 2 };
}

/** Min-max normalisation of x for a column whose min and max are given. */
export const minMax = (x: number, min: number, max: number) => (x - min) / (max - min);
/** Z-score standardisation. */
export const zScore = (x: number, mu: number, s: number) => (x - mu) / s;

// ---------- Normal distribution ----------

export function normalPdf(x: number, mu = 0, sigma = 1): number {
  const z = (x - mu) / sigma;
  return Math.exp(-0.5 * z * z) / (sigma * Math.sqrt(2 * Math.PI));
}

/** erf with high precision (W. J. Cody style rational approx via series/continued fraction). */
function erf(x: number): number {
  // Abramowitz-Stegun 7.1.26 is too coarse; use series for |x|<3, continued fraction otherwise.
  const ax = Math.abs(x);
  let r: number;
  if (ax < 3) {
    // Taylor series: erf(x) = 2/sqrt(pi) * sum (-1)^n x^(2n+1) / (n! (2n+1))
    let sum = ax;
    let term = ax;
    for (let n = 1; n < 200; n++) {
      term *= (-ax * ax) / n;
      const add = term / (2 * n + 1);
      sum += add;
      if (Math.abs(add) < 1e-17) break;
    }
    r = (2 / Math.sqrt(Math.PI)) * sum;
  } else {
    r = 1 - erfcCF(ax);
  }
  return x < 0 ? -r : r;
}

/** Continued fraction for erfc, valid for large x. */
function erfcCF(x: number): number {
  // Lentz's algorithm on erfc(x) = exp(-x^2)/sqrt(pi) * 1/(x + 1/2/(x + 1/(x + 3/2/(x + ...))))
  let f = x;
  let C = x;
  let D = 0;
  for (let n = 1; n < 300; n++) {
    const an = n / 2;
    D = x + an * D;
    D = D === 0 ? 1e-300 : 1 / D;
    C = x + an / C;
    if (C === 0) C = 1e-300;
    const delta = C * D;
    f *= delta;
    if (Math.abs(delta - 1) < 1e-16) break;
  }
  return Math.exp(-x * x) / Math.sqrt(Math.PI) / f;
}

/** Φ(z): standard normal CDF. */
export function phi(z: number): number {
  if (z < -8) return 0;
  if (z > 8) return 1;
  if (z < -3) return 0.5 * erfcCF(-z / Math.SQRT2);
  return 0.5 * (1 + erf(z / Math.SQRT2));
}

/** Inverse standard normal CDF (Acklam + one Newton refinement). */
export function normInv(p: number): number {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  const a = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.38357751867269e2, -3.066479806614716e1, 2.506628277459239];
  const b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1];
  const c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];
  const pl = 0.02425;
  let x: number;
  if (p < pl) {
    const q = Math.sqrt(-2 * Math.log(p));
    x = (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  } else if (p <= 1 - pl) {
    const q = p - 0.5;
    const r = q * q;
    x = ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  } else {
    const q = Math.sqrt(-2 * Math.log(1 - p));
    x = -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  // Newton refinement
  const e = phi(x) - p;
  const u = e * Math.sqrt(2 * Math.PI) * Math.exp((x * x) / 2);
  return x - u / (1 + (x * u) / 2);
}

/** z_α : value such that P(Z > z_α) = α. */
export function zCrit(alpha: number): number {
  return normInv(1 - alpha);
}

// ---------- Gamma / Beta helpers ----------

export function logGamma(x: number): number {
  const g = 7;
  const coef = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - logGamma(1 - x);
  x -= 1;
  let a = coef[0];
  const t = x + g + 0.5;
  for (let i = 1; i < g + 2; i++) a += coef[i] / (x + i);
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
}

/** Regularized lower incomplete gamma P(a, x). */
export function gammaP(a: number, x: number): number {
  if (x <= 0) return 0;
  if (x < a + 1) {
    let sum = 1 / a;
    let term = sum;
    for (let n = 1; n < 1000; n++) {
      term *= x / (a + n);
      sum += term;
      if (Math.abs(term) < Math.abs(sum) * 1e-16) break;
    }
    return sum * Math.exp(-x + a * Math.log(x) - logGamma(a));
  }
  // continued fraction for Q
  let b = x + 1 - a;
  let c = 1 / 1e-300;
  let d = 1 / b;
  let h = d;
  for (let i = 1; i < 1000; i++) {
    const an = -i * (i - a);
    b += 2;
    d = an * d + b;
    if (Math.abs(d) < 1e-300) d = 1e-300;
    c = b + an / c;
    if (Math.abs(c) < 1e-300) c = 1e-300;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < 1e-16) break;
  }
  return 1 - Math.exp(-x + a * Math.log(x) - logGamma(a)) * h;
}

function betacf(a: number, b: number, x: number): number {
  const qab = a + b;
  const qap = a + 1;
  const qam = a - 1;
  let c = 1;
  let d = 1 - (qab * x) / qap;
  if (Math.abs(d) < 1e-300) d = 1e-300;
  d = 1 / d;
  let h = d;
  for (let m = 1; m <= 1000; m++) {
    const m2 = 2 * m;
    let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < 1e-300) d = 1e-300;
    c = 1 + aa / c;
    if (Math.abs(c) < 1e-300) c = 1e-300;
    d = 1 / d;
    h *= d * c;
    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < 1e-300) d = 1e-300;
    c = 1 + aa / c;
    if (Math.abs(c) < 1e-300) c = 1e-300;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < 1e-16) break;
  }
  return h;
}

/** Regularized incomplete beta I_x(a, b). */
export function betaI(x: number, a: number, b: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const bt = Math.exp(logGamma(a + b) - logGamma(a) - logGamma(b) + a * Math.log(x) + b * Math.log(1 - x));
  if (x < (a + 1) / (a + b + 2)) return (bt * betacf(a, b, x)) / a;
  return 1 - (bt * betacf(b, a, 1 - x)) / b;
}

// ---------- Student t ----------

export function tPdf(t: number, nu: number): number {
  return Math.exp(logGamma((nu + 1) / 2) - logGamma(nu / 2) - 0.5 * Math.log(nu * Math.PI) - ((nu + 1) / 2) * Math.log(1 + (t * t) / nu));
}

export function tCdf(t: number, nu: number): number {
  const x = nu / (nu + t * t);
  const tail = 0.5 * betaI(x, nu / 2, 0.5);
  return t >= 0 ? 1 - tail : tail;
}

/** t(α; ν): value such that P(T > t) = α. */
export function tCrit(alpha: number, nu: number): number {
  let lo = 0;
  let hi = 1000;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (1 - tCdf(mid, nu) > alpha) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// ---------- Chi-square ----------

export function chi2Pdf(x: number, k: number): number {
  if (x <= 0) return 0;
  return Math.exp((k / 2 - 1) * Math.log(x) - x / 2 - (k / 2) * Math.log(2) - logGamma(k / 2));
}

export function chi2Cdf(x: number, k: number): number {
  return gammaP(k / 2, x / 2);
}

/** χ²(α; ν): value such that P(X > c) = α. */
export function chi2Crit(alpha: number, nu: number): number {
  let lo = 0;
  let hi = 1000;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (1 - chi2Cdf(mid, nu) > alpha) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// ---------- Tests ----------

/** Z0 = (x̄ − µ0) / (σ / √n) */
export function zStat(xbar: number, mu0: number, sigma: number, n: number): number {
  return (xbar - mu0) / (sigma / Math.sqrt(n));
}

/** T0 = (x̄ − µ0) / (S / √n) */
export function tStat(xbar: number, mu0: number, s: number, n: number): number {
  return (xbar - mu0) / (s / Math.sqrt(n));
}

/** P-value for a Z statistic. */
export function pValueZ(z: number, tail: Tail): number {
  if (tail === 'two') return 2 * (1 - phi(Math.abs(z)));
  if (tail === 'left') return phi(z);
  return 1 - phi(z);
}

export function pValueT(t: number, nu: number, tail: Tail): number {
  if (tail === 'two') return 2 * (1 - tCdf(Math.abs(t), nu));
  if (tail === 'left') return tCdf(t, nu);
  return 1 - tCdf(t, nu);
}

/** Critical value for the test (positive number; for 'left' the region is stat < −c). */
export function criticalValue(alpha: number, tail: Tail, nu?: number): number {
  const a = tail === 'two' ? alpha / 2 : alpha;
  return nu === undefined ? zCrit(a) : tCrit(a, nu);
}

export function rejectH0(stat: number, crit: number, tail: Tail): boolean {
  if (tail === 'two') return Math.abs(stat) > crit;
  if (tail === 'left') return stat < -crit;
  return stat > crit;
}

export interface MeanTestResult {
  stat: number;
  crit: number;
  pValue: number;
  reject: boolean;
  nu?: number;
}

export function zTest(xbar: number, mu0: number, sigma: number, n: number, alpha: number, tail: Tail): MeanTestResult {
  const stat = zStat(xbar, mu0, sigma, n);
  const crit = criticalValue(alpha, tail);
  return { stat, crit, pValue: pValueZ(stat, tail), reject: rejectH0(stat, crit, tail) };
}

export function tTest(xbar: number, mu0: number, s: number, n: number, alpha: number, tail: Tail): MeanTestResult {
  const nu = n - 1;
  const stat = tStat(xbar, mu0, s, n);
  const crit = criticalValue(alpha, tail, nu);
  return { stat, crit, pValue: pValueT(stat, nu, tail), reject: rejectH0(stat, crit, tail), nu };
}

/** Probabilities of normal classes given boundaries (open ends at −∞ / +∞). */
export function normalClassProbs(bounds: number[], mu: number, sigma: number): number[] {
  const cuts = [-Infinity, ...bounds, Infinity];
  const out: number[] = [];
  for (let i = 0; i < cuts.length - 1; i++) {
    const a = cuts[i] === -Infinity ? 0 : phi((cuts[i] - mu) / sigma);
    const b = cuts[i + 1] === Infinity ? 1 : phi((cuts[i + 1] - mu) / sigma);
    out.push(b - a);
  }
  return out;
}

export interface Chi2Result {
  p: number[];
  E: number[];
  contributions: number[];
  chi2: number;
  nu: number;
  crit: number;
  pValue: number;
  reject: boolean;
}

/** χ² goodness of fit given observed counts and theoretical probabilities; p = number of estimated parameters. */
export function chi2GoF(O: number[], p: number[], estimatedParams: number, alpha: number): Chi2Result {
  const n = O.reduce((a, b) => a + b, 0);
  const E = p.map((pi) => n * pi);
  const contributions = O.map((o, i) => (o - E[i]) ** 2 / E[i]);
  const chi2 = contributions.reduce((a, b) => a + b, 0);
  const nu = O.length - estimatedParams - 1;
  const crit = chi2Crit(alpha, nu);
  return { p, E, contributions, chi2, nu, crit, pValue: 1 - chi2Cdf(chi2, nu), reject: chi2 > crit };
}

/** χ² test of normality on classes. */
export function chi2Normal(bounds: number[], O: number[], xbar: number, s: number, alpha: number): Chi2Result {
  return chi2GoF(O, normalClassProbs(bounds, xbar, s), 2, alpha);
}

/** Uniform χ² (e.g. a die): all classes equiprobable, no estimated parameter. */
export function chi2Uniform(O: number[], alpha: number): Chi2Result {
  return chi2GoF(O, O.map(() => 1 / O.length), 0, alpha);
}

/** Power of a Z test against a true mean µ1. */
export function zPower(mu0: number, mu1: number, sigma: number, n: number, alpha: number, tail: Tail): number {
  const se = sigma / Math.sqrt(n);
  const d = (mu1 - mu0) / se;
  if (tail === 'right') return 1 - phi(zCrit(alpha) - d);
  if (tail === 'left') return phi(-zCrit(alpha) - d);
  const c = zCrit(alpha / 2);
  return 1 - phi(c - d) + phi(-c - d);
}

/** Confidence interval for the mean (σ known). */
export function ciZ(xbar: number, sigma: number, n: number, alpha: number): [number, number] {
  const h = zCrit(alpha / 2) * (sigma / Math.sqrt(n));
  return [xbar - h, xbar + h];
}

export function ciT(xbar: number, s: number, n: number, alpha: number): [number, number] {
  const h = tCrit(alpha / 2, n - 1) * (s / Math.sqrt(n));
  return [xbar - h, xbar + h];
}

// ---------- Compute registry (used by content files) ----------

type Arg = number | string | number[] | boolean;
type Fn = (...args: Arg[]) => number | number[] | object;

/**
 * Named functions callable from content (`compute: { fn, args, pick }`).
 * Keeps numbers in the course computed by code, never copied by hand.
 */
export const COMPUTE: Record<string, Fn> = {
  mean: (xs) => mean(xs as number[]),
  sampleSd: (xs) => sampleSd(xs as number[]),
  popSd: (xs) => popSd(xs as number[]),
  variance: (xs) => variance(xs as number[]),
  median: (xs) => median(xs as number[]),
  phi: (z) => phi(z as number),
  normInv: (p) => normInv(p as number),
  zCrit: (a) => zCrit(a as number),
  tCrit: (a, nu) => tCrit(a as number, nu as number),
  chi2Crit: (a, nu) => chi2Crit(a as number, nu as number),
  zStat: (x, m, s, n) => zStat(x as number, m as number, s as number, n as number),
  tStat: (x, m, s, n) => tStat(x as number, m as number, s as number, n as number),
  /** tStat from raw data */
  tStatData: (xs, m) => tStat(mean(xs as number[]), m as number, sampleSd(xs as number[]), (xs as number[]).length),
  pValueZ: (z, tail) => pValueZ(z as number, tail as Tail),
  pValueT: (t, nu, tail) => pValueT(t as number, nu as number, tail as Tail),
  zTest: (x, m, s, n, a, tail) => zTest(x as number, m as number, s as number, n as number, a as number, tail as Tail),
  tTest: (x, m, s, n, a, tail) => tTest(x as number, m as number, s as number, n as number, a as number, tail as Tail),
  chi2Normal: (bounds, O, x, s, a) => chi2Normal(bounds as number[], O as number[], x as number, s as number, a as number),
  chi2Uniform: (O, a) => chi2Uniform(O as number[], a as number),
  chi2GoF: (O, p, k, a) => chi2GoF(O as number[], p as number[], k as number, a as number),
  zPower: (m0, m1, s, n, a, tail) => zPower(m0 as number, m1 as number, s as number, n as number, a as number, tail as Tail),
  ciZ: (x, s, n, a) => ciZ(x as number, s as number, n as number, a as number),
  ciT: (x, s, n, a) => ciT(x as number, s as number, n as number, a as number),
  popVariance: (xs) => popVariance(xs as number[]),
  quantile: (xs, p) => quantile(xs as number[], p as number),
  iqrBounds: (xs) => iqrBounds(xs as number[]),
  covariance: (xs, ys) => covariance(xs as number[], ys as number[]),
  correlation: (xs, ys) => correlation(xs as number[], ys as number[]),
  linReg: (xs, ys) => linReg(xs as number[], ys as number[]),
  minMax: (x, a, b) => minMax(x as number, a as number, b as number),
  zScore: (x, m, s) => zScore(x as number, m as number, s as number),
  chmod: (s) => parseInt(s as string, 8),
  arith: (a) => a as number
};

export function runCompute(c: { fn: string; args: Arg[]; pick?: string | number }): number {
  const f = COMPUTE[c.fn];
  if (!f) throw new Error(`Unknown compute fn ${c.fn}`);
  let r: unknown = f(...c.args);
  if (c.pick !== undefined) {
    const path = String(c.pick).split('.');
    for (const k of path) r = (r as Record<string, unknown>)[k];
  }
  if (typeof r === 'boolean') return r ? 1 : 0;
  if (typeof r !== 'number') throw new Error(`compute ${c.fn} did not return a number (pick=${c.pick})`);
  return r;
}
