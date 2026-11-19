/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      // restrained corners everywhere (existing rounded-xl / 2xl / 3xl classes shrink with this scale)
      borderRadius: { lg: '6px', xl: '8px', '2xl': '10px', '3xl': '12px' },
      fontFamily: {
        sans: ['Geist', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
        mono: ['"Geist Mono"', '"JetBrains Mono"', 'ui-monospace', 'monospace'],
        hand: ['Caveat', 'cursive']
      },
      colors: {
        bg: 'rgb(var(--bg) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        surface2: 'rgb(var(--surface2) / <alpha-value>)',
        fg: 'rgb(var(--fg) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        accent2: 'rgb(var(--accent2) / <alpha-value>)',
        brand: 'rgb(var(--brand) / <alpha-value>)',
        navy: 'rgb(var(--navy) / <alpha-value>)',
        mint: 'rgb(var(--mint) / <alpha-value>)',
        brandlight: 'rgb(var(--brand-light) / <alpha-value>)',
        ok: 'rgb(var(--ok) / <alpha-value>)',
        bad: 'rgb(var(--bad) / <alpha-value>)',
        warn: 'rgb(var(--warn) / <alpha-value>)'
      }
    }
  },
  plugins: []
};
