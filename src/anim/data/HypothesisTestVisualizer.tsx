import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useL, useT } from '../../hooks/useT';
import { Tex } from '../../components/Text';
import { HTV } from '../../i18n/animData';
import { AnimCard } from '../Stepper';
import * as S from '../../lib/stats';

type Dist = 'z' | 't' | 'chi2';
interface P {
  dist: Dist;
  tail: S.Tail;
  alpha: number;
  xbar: number;
  mu0: number;
  sigma: number;
  n: number;
  chi2: number;
  nu: number;
}

const COMPRIMES = [0.81, 0.84, 0.83, 0.8, 0.85, 0.86, 0.85, 0.83, 0.84, 0.8];
const CHI = S.chi2Normal([0.5, 1, 1.5], [2, 23, 17, 8], 1.168, 0.591, 0.05);

const PRESETS: Record<string, P> = {
  fusee: { dist: 'z', tail: 'two', alpha: 0.05, xbar: 41.25, mu0: 40, sigma: 2, n: 25, chi2: 0, nu: 1 },
  comprimes: { dist: 't', tail: 'two', alpha: 0.02, xbar: S.mean(COMPRIMES), mu0: 0.83, sigma: S.sampleSd(COMPRIMES), n: 10, chi2: 0, nu: 9 },
  glycemie: { dist: 'z', tail: 'left', alpha: 0.05, xbar: 1.12, mu0: 1, sigma: 0.1, n: 9, chi2: 0, nu: 1 },
  chi2: { dist: 'chi2', tail: 'right', alpha: 0.05, xbar: 0, mu0: 0, sigma: 1, n: 50, chi2: CHI.chi2, nu: CHI.nu }
};

const fmt = (x: number, d = 3) => (Number.isFinite(x) ? x.toFixed(d).replace('.', ',') : '∞');

export default function HypothesisTestVisualizer({ preset = 'fusee' }: { preset?: string }) {
  const tl = useL();
  const { t } = useT();
  const [p, setP] = useState<P>(PRESETS[preset] ?? PRESETS.fusee);
  const [active, setActive] = useState(preset);
  const set = (k: keyof P, v: number | string) => {
    setActive('');
    setP((x) => ({ ...x, [k]: v }));
  };
  const r = useMemo(() => {
    if (p.dist === 'chi2') {
      const crit = S.chi2Crit(p.alpha, p.nu);
      return { stat: p.chi2, crit, pv: 1 - S.chi2Cdf(p.chi2, p.nu), reject: p.chi2 > crit };
    }
    if (p.dist === 't') {
      const x = S.tTest(p.xbar, p.mu0, p.sigma, p.n, p.alpha, p.tail);
      return { stat: x.stat, crit: x.crit, pv: x.pValue, reject: x.reject };
    }
    const x = S.zTest(p.xbar, p.mu0, p.sigma, p.n, p.alpha, p.tail);
    return { stat: x.stat, crit: x.crit, pv: x.pValue, reject: x.reject };
  }, [p]);

  // ----- plot -----
  const W = 340;
  const H = 170;
  const pad = 20;
  const nu = p.dist === 't' ? p.n - 1 : p.nu;
  const pdf = (x: number) => (p.dist === 'z' ? S.normalPdf(x) : p.dist === 't' ? S.tPdf(x, nu) : S.chi2Pdf(x, nu));
  const xmin = p.dist === 'chi2' ? 0 : -4.5;
  const xmax = p.dist === 'chi2' ? Math.max(S.chi2Crit(0.001, nu), r.stat * 1.15, 8) : 4.5;
  const xs = Array.from({ length: 241 }, (_, i) => xmin + ((xmax - xmin) * i) / 240);
  const ymax = Math.max(...xs.map(pdf).filter(Number.isFinite).map((y) => Math.min(y, 1.2))) * 1.1;
  const X = (x: number) => pad + ((x - xmin) / (xmax - xmin)) * (W - 2 * pad);
  const Y = (y: number) => H - pad - (Math.min(y, ymax) / ymax) * (H - 2 * pad);
  const path = (a: number, b: number) => {
    const pts = xs.filter((x) => x >= a && x <= b);
    if (!pts.length) return '';
    return `M${X(pts[0])},${Y(0)} ` + pts.map((x) => `L${X(x)},${Y(pdf(x))}`).join(' ') + ` L${X(pts[pts.length - 1])},${Y(0)} Z`;
  };
  const curve = 'M' + xs.map((x) => `${X(x)},${Y(pdf(x))}`).join(' L');
  const regions: [number, number][] = p.tail === 'two' ? [[xmin, -r.crit], [r.crit, xmax]] : p.tail === 'left' ? [[xmin, -r.crit]] : [[r.crit, xmax]];
  const s = Math.max(xmin, Math.min(xmax, r.stat));
  const pvRegions: [number, number][] = p.tail === 'two' ? [[xmin, -Math.abs(r.stat)], [Math.abs(r.stat), xmax]] : p.tail === 'left' ? [[xmin, r.stat]] : [[r.stat, xmax]];
  const statName = p.dist === 'z' ? 'Z_0' : p.dist === 't' ? 'T_0' : '\\chi^2';
  const formula =
    p.dist === 'z' ? 'Z_0=\\dfrac{\\bar x-\\mu_0}{\\sigma/\\sqrt n}' : p.dist === 't' ? 'T_0=\\dfrac{\\bar x-\\mu_0}{S/\\sqrt n}\\sim t(n-1)' : '\\chi^2=\\sum_i\\dfrac{(O_i-E_i)^2}{E_i}\\sim\\chi^2(k-p-1)';
  const h0 = p.dist === 'chi2' ? 'H_0:\\ X\\sim\\mathcal N \\quad H_1:\\ X\\not\\sim\\mathcal N' : `H_0:\\ \\mu=${p.mu0} \\quad H_1:\\ \\mu ${p.tail === 'two' ? '\\neq' : p.tail === 'left' ? '<' : '>'} ${p.mu0}`;
  const conclusion = t(r.reject ? 'lab.conclusionReject' : 'lab.conclusionKeep', { a: `${Math.round(p.alpha * 100)} %`, p: fmt(r.pv, 4) });
  const se = p.sigma / Math.sqrt(p.n);

  return (
    <AnimCard title={tl(HTV.title)}>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {HTV.presets.map((pr) => (
          <button key={pr.id} className={`chip !text-xs ${active === pr.id ? '!border-accent !bg-accent !text-bg' : ''}`} onClick={() => { setP(PRESETS[pr.id]); setActive(pr.id); }} data-testid={`preset-${pr.id}`}>
            {tl(pr.name)}
          </button>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_260px]">
        <div>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`${statName} = ${fmt(r.stat)}`}>
            {regions.map(([a, b], k) => (
              <path key={k} d={path(a, b)} fill="rgb(var(--bad) / 0.35)" />
            ))}
            {pvRegions.map(([a, b], k) => (
              <motion.path key={`pv${k}`} d={path(a, b)} fill="rgb(var(--accent2) / 0.35)" initial={false} animate={{ d: path(a, b) }} />
            ))}
            <path d={curve} fill="none" stroke="rgb(var(--fg))" strokeWidth={1.6} />
            <line x1={pad} x2={W - pad} y1={Y(0)} y2={Y(0)} stroke="rgb(var(--line))" />
            {(p.tail === 'two' ? [-r.crit, r.crit] : p.tail === 'left' ? [-r.crit] : [r.crit]).map((c) => (
              <g key={c}>
                <line x1={X(c)} x2={X(c)} y1={Y(0)} y2={pad} stroke="rgb(var(--bad))" strokeDasharray="3 3" />
                <text x={X(c)} y={pad - 4} fontSize={9} textAnchor="middle" fill="rgb(var(--bad))">
                  {fmt(c)}
                </text>
              </g>
            ))}
            <motion.g initial={false} animate={{ x: X(s) }}>
              <line x1={0} x2={0} y1={Y(0)} y2={pad + 8} stroke="rgb(var(--accent))" strokeWidth={2.5} />
              <circle cx={0} cy={pad + 8} r={4} fill="rgb(var(--accent))" />
            </motion.g>
            <text x={Math.min(W - 40, X(s) + 6)} y={pad + 18} fontSize={10} fill="rgb(var(--accent))" fontWeight={700}>
              {fmt(r.stat)}
            </text>
            {(p.dist === 'chi2' ? [0, Math.round(xmax / 2), Math.round(xmax)] : [-4, -2, 0, 2, 4]).map((v) => (
              <text key={v} x={X(v)} y={H - 6} fontSize={9} textAnchor="middle" fill="rgb(var(--muted))">
                {v}
              </text>
            ))}
          </svg>
          <div className="flex flex-wrap gap-3 text-[11px] text-muted">
            <span className="flex items-center gap-1">
              <span className="h-3 w-3 rounded bg-bad/40" /> {tl(HTV.area)}
            </span>
            <span className="flex items-center gap-1">
              <span className="h-3 w-3 rounded bg-accent2/40" /> {tl(HTV.pv)}
            </span>
          </div>
          <div className="mt-2 space-y-1 text-sm">
            <Tex tex={h0} block />
            <Tex tex={formula} block />
          </div>
        </div>
        <div className="space-y-3 text-sm">
          {p.dist !== 'chi2' && (
            <>
              <div className="flex gap-1">
                {(['z', 't'] as Dist[]).map((d) => (
                  <button key={d} className={`flex-1 rounded-lg px-2 py-1.5 text-xs ${p.dist === d ? 'bg-accent text-bg' : 'bg-surface2'}`} onClick={() => set('dist', d)}>
                    {d === 'z' ? t('lab.sigmaKnown') : t('lab.sigmaUnknown')}
                  </button>
                ))}
              </div>
              <div className="flex gap-1">
                {(['two', 'left', 'right'] as S.Tail[]).map((tt) => (
                  <button key={tt} className={`flex-1 rounded-lg px-1 py-1.5 text-[11px] ${p.tail === tt ? 'bg-accent text-bg' : 'bg-surface2'}`} onClick={() => set('tail', tt)}>
                    {t(tt === 'two' ? 'lab.two' : tt === 'left' ? 'lab.left' : 'lab.right')}
                  </button>
                ))}
              </div>
              <Slider label="x̄" value={p.xbar} min={p.mu0 - 5 * se} max={p.mu0 + 5 * se} step={se / 50} onChange={(v) => set('xbar', v)} />
              <Slider label="µ0" value={p.mu0} min={p.mu0 - 3 * se} max={p.mu0 + 3 * se} step={se / 50} onChange={(v) => set('mu0', v)} />
              <Slider label={p.dist === 'z' ? 'σ' : 'S'} value={p.sigma} min={p.sigma / 4} max={p.sigma * 3} step={p.sigma / 100} onChange={(v) => set('sigma', v)} />
              <Slider label="n" value={p.n} min={2} max={200} step={1} onChange={(v) => set('n', Math.round(v))} />
            </>
          )}
          {p.dist === 'chi2' && (
            <>
              <Slider label="χ²" value={p.chi2} min={0} max={30} step={0.01} onChange={(v) => set('chi2', v)} />
              <Slider label="ν" value={p.nu} min={1} max={10} step={1} onChange={(v) => set('nu', Math.round(v))} />
            </>
          )}
          <div>
            <span className="text-xs text-muted">α</span>
            <div className="mt-1 flex gap-1">
              {[0.01, 0.02, 0.05, 0.1].map((a) => (
                <button key={a} className={`flex-1 rounded-lg py-1.5 font-mono text-xs ${p.alpha === a ? 'bg-accent text-bg' : 'bg-surface2'}`} onClick={() => set('alpha', a)}>
                  {Math.round(a * 100)}%
                </button>
              ))}
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-1 rounded-xl bg-surface2 p-2 font-mono text-xs" data-testid="htv-results">
            <dt className="text-muted">{t('lab.stat')}</dt>
            <dd data-testid="htv-stat">{fmt(r.stat)}</dd>
            <dt className="text-muted">{t('lab.crit')}</dt>
            <dd>{p.tail === 'two' ? '±' : p.tail === 'left' ? '−' : ''}{fmt(r.crit)}</dd>
            <dt className="text-muted">P-value</dt>
            <dd data-testid="htv-pv">{fmt(r.pv, 4)}</dd>
            {p.dist === 't' && (
              <>
                <dt className="text-muted">ν</dt>
                <dd>{p.n - 1}</dd>
              </>
            )}
          </dl>
          <motion.div key={String(r.reject)} initial={{ scale: 0.95 }} animate={{ scale: 1 }} className={`rounded-xl px-3 py-2 text-center font-bold ${r.reject ? 'bg-bad/15 text-bad' : 'bg-ok/15 text-ok'}`} data-testid="htv-decision">
            {r.reject ? t('lab.reject') : t('lab.keep')}
          </motion.div>
        </div>
      </div>
      <p className="mt-3 text-sm">{conclusion}</p>
    </AnimCard>
  );
}

function Slider({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <span className="flex justify-between text-xs">
        <span className="text-muted">{label}</span>
        <span className="font-mono">{Number.isInteger(value) ? value : value.toFixed(4).replace(/0+$/, '').replace('.', ',')}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} className="w-full accent-[rgb(var(--accent))]" aria-label={label} />
    </label>
  );
}
