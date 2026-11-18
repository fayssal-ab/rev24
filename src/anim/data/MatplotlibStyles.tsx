import { motion } from 'framer-motion';
import { useL, useT } from '../../hooks/useT';
import { L, Code } from '../../components/Text';
import { MPL } from '../../i18n/animData';
import { AnimCard } from '../Stepper';

const PROC = `import matplotlib.pyplot as plt
x = [1, 2, 3, 4, 5]
y = [2, 4, 3, 6, 7]
plt.figure(figsize=(6, 4))
plt.plot(x, y, marker="o", color="tab:blue")
plt.title("Évolution des ventes")
plt.xlabel("Mois")
plt.ylabel("Ventes")
plt.grid(True)
plt.show()`;

const OO = `import matplotlib.pyplot as plt
x = [1, 2, 3, 4, 5]
y = [2, 4, 3, 6, 7]
fig, ax = plt.subplots(figsize=(6, 4))
ax.plot(x, y, marker="o", color="tab:blue")
ax.set_title("Évolution des ventes")
ax.set_xlabel("Mois")
ax.set_ylabel("Ventes")
ax.grid(True)
fig.savefig("ventes.png", dpi=300)
plt.show()`;

const MAP = [
  ['plt.title()', 'ax.set_title()'],
  ['plt.xlabel()', 'ax.set_xlabel()'],
  ['plt.xlim()', 'ax.set_xlim()'],
  ['plt.legend()', 'ax.legend()'],
  ['plt.savefig()', 'fig.savefig()']
];

export default function MatplotlibStyles() {
  const tl = useL();
  const { t } = useT();
  const pts = [2, 4, 3, 6, 7].map((y, i) => [30 + i * 55, 130 - y * 15]);
  return (
    <AnimCard title={tl(MPL.title)}>
      <div className="grid gap-3 lg:grid-cols-2">
        <div>
          <div className="mb-1 text-sm font-semibold">{t('anim.procedural')}</div>
          <Code code={PROC} lang="python" />
          <div className="mt-1 text-sm text-muted">
            <L v={MPL.proc} md />
          </div>
        </div>
        <div>
          <div className="mb-1 text-sm font-semibold text-accent">{t('anim.oo')}</div>
          <Code code={OO} lang="python" />
          <div className="mt-1 text-sm text-muted">
            <L v={MPL.oo} md />
          </div>
        </div>
      </div>
      <p className="mt-3 text-sm">{tl(MPL.same)}</p>
      <svg viewBox="0 0 300 160" className="mx-auto mt-1 w-full max-w-sm rounded-xl bg-white" role="img" aria-label="plot">
        <text x={150} y={16} textAnchor="middle" fontSize={11} fill="#111">
          Évolution des ventes
        </text>
        {[0, 1, 2, 3].map((k) => (
          <line key={k} x1={25} x2={290} y1={130 - k * 30} y2={130 - k * 30} stroke="#e5e7eb" />
        ))}
        <line x1={25} y1={130} x2={290} y2={130} stroke="#111" />
        <line x1={25} y1={25} x2={25} y2={130} stroke="#111" />
        <motion.polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke="#1f77b4" strokeWidth={2} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} />
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={3.5} fill="#1f77b4" />
        ))}
        <text x={160} y={152} textAnchor="middle" fontSize={9} fill="#111">
          Mois
        </text>
        <text x={10} y={80} fontSize={9} fill="#111" transform="rotate(-90 10 80)" textAnchor="middle">
          Ventes
        </text>
      </svg>
      <h4 className="mb-1 mt-3 text-sm font-semibold">{tl(MPL.mapping)}</h4>
      <table className="w-full font-mono text-xs">
        <tbody>
          {MAP.map(([a, b]) => (
            <tr key={a} className="border-t border-line">
              <td className="py-1">{a}</td>
              <td className="text-accent">→ {b}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AnimCard>
  );
}
