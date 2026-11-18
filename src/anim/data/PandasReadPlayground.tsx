import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useL, useT } from '../../hooks/useT';
import { L, Code } from '../../components/Text';
import { PANDAS } from '../../i18n/animData';
import { AnimCard } from '../Stepper';

const ROWS = [
  ['Pierre', '12.5', '14'],
  ['Sophie', '15', '11.5'],
  ['Karim', '9.5', '13'],
  ['Lina', '17', '16.5']
];
const HEAD = ['nom', 'note1', 'note2'];

const RAW: Record<string, string> = {
  notes: [HEAD.join(','), ...ROWS.map((r) => r.join(','))].join('\n'),
  decim: [HEAD.join(';'), ...ROWS.map((r) => r.map((c) => c.replace('.', ',')).join(';'))].join('\n'),
  h: ROWS.map((r) => r.join(',')).join('\n'),
  hs: ['# notes du controle continu', ...ROWS.map((r) => r.join(','))].join('\n'),
  xlsx: ['[feuille notes_h_s]', '# notes du controle continu', ...ROWS.map((r) => r.join(' | '))].join('\n'),
  export: '      nom  note1  note2\n0  Pierre   12.5   14.0\n1  Sophie   15.0   11.5\n2   Karim    9.5   13.0\n3    Lina   17.0   16.5'
};

const ANSWERS: Record<string, string> = {
  notes: 'pd.read_csv("notes.csv")',
  decim: 'pd.read_csv("notes_decim.csv", sep=";", decimal=",")',
  h: 'pd.read_csv("notes_h.csv", header=None)',
  hs: 'pd.read_csv("notes_h_s.csv", header=None, skiprows=1)',
  xlsx: 'pd.read_excel("notes.xlsx", sheet_name="notes_h_s", skiprows=1)',
  export: 'df.to_csv("notes_export.csv", sep=",", decimal=".", index=False)'
};

export interface Parsed {
  fn: string;
  kw: Record<string, string>;
}

export function parseCall(src: string): Parsed | null {
  const m = /(?:pd\.|df\.)?(read_csv|read_excel|to_csv)\s*\(([\s\S]*)\)\s*$/.exec(src.trim());
  if (!m) return null;
  const kw: Record<string, string> = {};
  const re = /(\w+)\s*=\s*("[^"]*"|'[^']*'|[\w.+-]+)/g;
  let k: RegExpExecArray | null;
  while ((k = re.exec(m[2]))) kw[k[1]] = k[2].replace(/^['"]|['"]$/g, '');
  return { fn: m[1], kw };
}

type Cell = string | number;
interface DF {
  cols: string[];
  rows: Cell[][];
}

/** Simulate pandas reading the raw text with the given keyword arguments. */
export function simulateRead(caseId: string, p: Parsed): DF | string {
  if (caseId === 'export') {
    if (p.fn !== 'to_csv') return 'df.to_csv(...)';
    const sep = p.kw.sep ?? ',';
    const dec = p.kw.decimal ?? '.';
    const withIndex = p.kw.index !== 'False';
    const num = (s: string) => String(Number(s)).replace('.', dec);
    const lines = [(withIndex ? [''] : []).concat(HEAD).join(sep), ...ROWS.map((r, i) => (withIndex ? [String(i)] : []).concat([r[0], num(r[1]), num(r[2])]).join(sep))];
    return lines.join('\n');
  }
  if (caseId === 'xlsx' && p.fn !== 'read_excel') return 'read_excel';
  if (caseId !== 'xlsx' && p.fn !== 'read_csv') return 'read_csv';
  let lines = RAW[caseId].split('\n');
  if (caseId === 'xlsx') {
    const sheet = p.kw.sheet_name ?? '0';
    if (sheet !== 'notes_h_s' && sheet !== '2') return `sheet_name=${sheet} → ?`;
    lines = lines.slice(1).map((l) => l.replace(/ \| /g, ','));
  }
  const sep = caseId === 'xlsx' ? ',' : p.kw.sep ?? ',';
  const dec = p.kw.decimal ?? '.';
  const skip = +(p.kw.skiprows ?? 0);
  lines = lines.slice(skip);
  const split = lines.map((l) => l.split(sep));
  const headerNone = p.kw.header === 'None';
  const cols = headerNone ? split[0].map((_, i) => String(i)) : split[0];
  const body = headerNone ? split : split.slice(1);
  const conv = (s: string): Cell => {
    const t = dec === ',' ? s.replace(',', '.') : s;
    return /^-?\d+(\.\d+)?$/.test(t) ? Number(t) : s;
  };
  return { cols, rows: body.map((r) => r.map(conv)) };
}

export default function PandasReadPlayground() {
  const tl = useL();
  const { t } = useT();
  const [c, setC] = useState('decim');
  const [src, setSrc] = useState('pd.read_csv("notes_decim.csv")');
  const [show, setShow] = useState(false);
  const parsed = useMemo(() => parseCall(src), [src]);
  const res = parsed ? simulateRead(c, parsed) : null;
  const expected = simulateRead(c, parseCall(ANSWERS[c])!);
  const ok = res !== null && JSON.stringify(res) === JSON.stringify(expected);
  const cs = PANDAS.cases.find((x) => x.id === c)!;
  const reasons = Object.entries(PANDAS.why)
    .filter(([k]) => {
      const want = parseCall(ANSWERS[c])!.kw;
      const have = parsed?.kw ?? {};
      const key = k === 'sheet' ? 'sheet_name' : k;
      return want[key] !== undefined && have[key] !== want[key];
    })
    .map(([, v]) => v);
  return (
    <AnimCard title={tl(PANDAS.title)}>
      <p className="mb-2 text-sm text-muted">{tl(PANDAS.pick)}</p>
      <div className="mb-3 flex flex-wrap gap-1">
        {PANDAS.cases.map((x) => (
          <button
            key={x.id}
            className={`chip font-mono !text-[11px] ${c === x.id ? '!border-accent !bg-accent !text-bg' : ''}`}
            onClick={() => {
              setC(x.id);
              setShow(false);
              setSrc(x.id === 'export' ? 'df.to_csv("notes_export.csv")' : x.id === 'xlsx' ? 'pd.read_excel("notes.xlsx")' : `pd.read_csv("${x.file}")`);
            }}
          >
            {x.file}
          </button>
        ))}
      </div>
      <div className="mb-2 text-sm">
        <L v={cs.hint} />
      </div>
      <Code code={RAW[c]} lang="text" />
      <label className="mt-3 block">
        <span className="sr-only">Python</span>
        <textarea value={src} onChange={(e) => setSrc(e.target.value)} rows={2} spellCheck={false} className="term w-full rounded-xl border border-line bg-[#0b1020] p-3 text-[13px] text-emerald-300 outline-none focus:border-accent" data-testid="pandas-input" />
      </label>
      {parsed && (
        <div className="mt-1 flex flex-wrap gap-1 text-xs">
          <span className="text-muted">{t('anim.params')} :</span>
          {Object.entries(parsed.kw).map(([k, v]) => (
            <code key={k} className="rounded bg-surface2 px-1.5 font-mono">
              {k}={v}
            </code>
          ))}
        </div>
      )}
      <motion.div key={String(ok)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`mt-3 rounded-xl border p-3 ${ok ? 'border-ok/60 bg-ok/5' : 'border-bad/50 bg-bad/5'}`}>
        <div className={`mb-2 text-sm font-semibold ${ok ? 'text-ok' : 'text-bad'}`} data-testid="pandas-result">
          {ok ? `✓ ${tl(PANDAS.ok)}` : `✗ ${tl(PANDAS.bad)}`}
        </div>
        {res && typeof res === 'object' && (
          <div className="overflow-x-auto">
            <table className="font-mono text-xs">
              <thead>
                <tr>
                  <th className="pr-3 text-muted" />
                  {res.cols.map((h) => (
                    <th key={h} className="pr-3 text-left">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {res.rows.map((r, i) => (
                  <tr key={i}>
                    <td className="pr-3 text-muted">{i}</td>
                    {r.map((v, j) => (
                      <td key={j} className={`pr-3 ${typeof v === 'number' ? 'text-accent2' : ''}`}>
                        {String(v)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-1 text-[11px] text-muted">dtypes: {res.cols.map((h, j) => `${h}=${res.rows.every((r) => typeof r[j] === 'number') ? (res.rows.every((r) => Number.isInteger(r[j])) ? 'int64' : 'float64') : 'object'}`).join(', ')}</div>
          </div>
        )}
        {typeof res === 'string' && <pre className="term whitespace-pre-wrap text-xs">{res}</pre>}
        {!ok && reasons.length > 0 && (
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {reasons.map((r, i) => (
              <li key={i}>
                <L v={r} />
              </li>
            ))}
          </ul>
        )}
      </motion.div>
      <button className="btn-ghost btn-sm mt-2" onClick={() => setShow(!show)}>
        {tl(PANDAS.show)}
      </button>
      {show && <Code code={ANSWERS[c]} lang="python" className="mt-2" />}
    </AnimCard>
  );
}
