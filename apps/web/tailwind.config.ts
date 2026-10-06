import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/design-system/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // UI & Card Tokens
        border: 'hsl(var(--border, 220 13% 91%))',
        background: 'hsl(var(--background, 0 0% 100%))',
        card: {
          DEFAULT: 'hsl(var(--card, 0 0% 100%))',
          foreground: 'hsl(var(--card-foreground, 240 10% 3.9%))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted, 240 4.8% 95.9%))',
          foreground: 'hsl(var(--muted-foreground, 240 3.8% 46.1%))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent, 240 4.8% 95.9%))',
          foreground: 'hsl(var(--accent-foreground, 240 5.9% 10%))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive, 0 84.2% 60.2%))',
          foreground: 'hsl(var(--destructive-foreground, 0 0% 98%))',
        },
        // Mandatory 5 Brand Colors
        brand: {
          orange: '#E43D12',
          rose: '#D6536D',
          pink: '#FFA2B6',
          yellow: '#EFB11D',
          cream: '#EBE9E1',
          ink: '#171714',
          paper: '#F7F5EF',
        },
        l2h: {
          orange: '#E43D12',
          rose: '#D6536D',
          pink: '#FFA2B6',
          yellow: '#EFB11D',
          cream: '#EBE9E1',
          ink: '#171714',
          paper: '#F7F5EF',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Anton', 'Bebas Neue', 'sans-serif'],
        body: ['var(--font-body)', 'Inter', 'Manrope', 'sans-serif'],
      },
      boxShadow: {
        'editorial-sm': '2px 2px 0px #171714',
        'editorial': '3px 3px 0px #171714',
        'editorial-hover': '5px 5px 0px #171714',
        'editorial-lg': '8px 8px 0px #171714',
      },
      borderWidth: {
        'editorial': '1.5px',
      },
      letterSpacing: {
        tighter: '0.015em',
        tight: '0.03em',
        normal: '0.04em',
        wide: '0.065em',
        wider: '0.095em',
        widest: '0.14em',
      },
      lineHeight: {
        none: '1.2',
        tight: '1.3',
        snug: '1.45',
        normal: '1.6',
        relaxed: '1.75',
        loose: '2',
      },
    },
  },
  plugins: [],
};

export default config;
