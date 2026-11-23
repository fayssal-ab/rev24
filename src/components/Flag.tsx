/** Small inline SVG flags for the language menu (no emoji: they render differently on every OS). */
import type { Lang } from '../lib/schema';

/** Five-pointed star path centred on (cx, cy), drawn point to point so it can be stroked (Morocco's pentagram). */
function pentagram(cx: number, cy: number, r: number) {
  const pts = [0, 2, 4, 1, 3].map((k) => {
    const a = -Math.PI / 2 + (k * 2 * Math.PI) / 5;
    return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
  });
  return `M${pts.join('L')}Z`;
}

const FLAGS: Record<Lang, JSX.Element> = {
  // Morocco: red field, green pentagram
  dar: (
    <>
      <rect width="30" height="20" fill="#C1272D" />
      <path d={pentagram(15, 10.6, 5.6)} fill="none" stroke="#006233" strokeWidth="1.1" strokeLinejoin="miter" />
    </>
  ),
  // France: blue, white, red
  fr: (
    <>
      <rect width="10" height="20" fill="#002654" />
      <rect x="10" width="10" height="20" fill="#FFFFFF" />
      <rect x="20" width="10" height="20" fill="#CE1126" />
    </>
  ),
  // United Kingdom: Union Jack
  en: (
    <>
      <clipPath id="flag-uk">
        <rect width="30" height="20" />
      </clipPath>
      <g clipPath="url(#flag-uk)">
        <rect width="30" height="20" fill="#012169" />
        <path d="M0,0 30,20 M30,0 0,20" stroke="#FFFFFF" strokeWidth="4" />
        <path d="M0,0 30,20 M30,0 0,20" stroke="#C8102E" strokeWidth="1.6" />
        <path d="M15,0V20M0,10H30" stroke="#FFFFFF" strokeWidth="6" />
        <path d="M15,0V20M0,10H30" stroke="#C8102E" strokeWidth="3.4" />
      </g>
    </>
  )
};

export function Flag({ lang, size = 20, className = '' }: { lang: Lang; size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 30 20" width={size} height={(size * 2) / 3} className={`shrink-0 overflow-hidden rounded-[3px] ring-1 ring-black/10 ${className}`} aria-hidden>
      {FLAGS[lang]}
    </svg>
  );
}
