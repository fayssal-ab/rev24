/**
 * Smooth page scrolling with Lenis, on computers with a mouse / trackpad only (phones keep their native scrolling).
 * Inner scroll areas (chat, menus, dialogs) opt out with the `data-lenis-prevent` attribute.
 */
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

let lenis: Lenis | null = null;

export function startSmoothScroll() {
  if (lenis || typeof window === 'undefined') return;
  const fine = window.matchMedia('(pointer: fine)').matches;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!fine || reduce) return;
  lenis = new Lenis({ autoRaf: true, lerp: 0.12, wheelMultiplier: 1, anchors: true });
}

/** Jump to the top (route change) without fighting the smooth scroller. */
export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true });
  else window.scrollTo(0, 0);
}
