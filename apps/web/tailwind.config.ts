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
        }
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
