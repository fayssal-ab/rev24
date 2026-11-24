import { useState } from 'react';
import { API } from '../auth/auth';

export const initials = (name: string) =>
  name
    .split(/[\s.@_-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('') || '?';

/** Stable colour per name, from the site palette, for members without a picture. */
const COLORS = ['#00844e', '#0b2440', '#1f6feb', '#b45309', '#7c3aed', '#be123c', '#0f766e'];
const colorOf = (name: string) => COLORS[[...name].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7) % COLORS.length];

/** Profile picture, or the member's initials on a coloured disc. `src` is the API-relative URL from the server. */
export function Avatar({ name, src, size = 40, className = '' }: { name: string; src?: string | null; size?: number; className?: string }) {
  const [broken, setBroken] = useState(false);
  const style = { width: size, height: size, fontSize: Math.max(10, Math.round(size * 0.36)) };
  if (src && !broken)
    return <img src={`${API}${src}`} alt="" width={size} height={size} style={style} className={`shrink-0 rounded-full object-cover ${className}`} onError={() => setBroken(true)} />;
  return (
    <span style={{ ...style, background: colorOf(name) }} className={`grid shrink-0 place-items-center rounded-full font-bold tracking-wide text-white ${className}`} aria-hidden>
      {initials(name)}
    </span>
  );
}

/** Resize a picked image to a square JPEG data URL (centre crop), small enough to store with the account. */
export async function toAvatarDataUrl(file: File, size = 160): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((ok, ko) => {
      const i = new Image();
      i.onload = () => ok(i);
      i.onerror = ko;
      i.src = url;
    });
    const side = Math.min(img.naturalWidth, img.naturalHeight);
    const c = document.createElement('canvas');
    c.width = c.height = size;
    c.getContext('2d')!.drawImage(img, (img.naturalWidth - side) / 2, (img.naturalHeight - side) / 2, side, side, 0, 0, size, size);
    return c.toDataURL('image/jpeg', 0.85);
  } finally {
    URL.revokeObjectURL(url);
  }
}
