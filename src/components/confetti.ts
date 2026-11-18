/** Discreet confetti, skipped when the user prefers reduced motion. */
export async function confetti() {
  if (typeof window === 'undefined' || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  const { default: c } = await import('canvas-confetti');
  c({ particleCount: 70, spread: 60, origin: { y: 0.3 }, scalar: 0.8, disableForReducedMotion: true });
}
