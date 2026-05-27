import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        orange:  '#FF551F',
        cyan:    '#66FFFF',
        dark:    '#0A0A0A',
        carbon:  '#1E1E1E',
        'carbon-2': '#252525',
        border:  'rgba(255,85,31,0.12)',
        'border-cyan': 'rgba(102,255,255,0.10)',
      },
      fontFamily: {
        bebas:   ['var(--font-bebas)', 'sans-serif'],
        rajdhani:['var(--font-rajdhani)', 'sans-serif'],
        mono:    ['var(--font-mono)', 'monospace'],
      },
      backgroundImage: {
        'grid-overlay': `linear-gradient(rgba(255,85,31,.022) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(255,85,31,.022) 1px, transparent 1px)`,
      },
      backgroundSize: {
        grid: '40px 40px',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        scan: {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100vw)' },
        },
        pulse_soft: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.4' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        marquee:    'marquee 24s linear infinite',
        scan:       'scan 4s linear infinite',
        pulse_soft: 'pulse_soft 2s ease-in-out infinite',
        float:      'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
