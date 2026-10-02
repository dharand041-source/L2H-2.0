/**
 * LEARN-2-HIRE DESIGN SYSTEM TOKENS
 * Editorial European aesthetics, Swiss typography grids, and strict mandatory brand color matrix.
 */

export const COLOR_TOKENS = {
  // Mandatory 5 Brand Colors
  orange: '#E43D12', // Primary actions, major CTAs, selected navigation, urgent notices
  rose: '#D6536D',   // Assessment, interview states, secondary status, diagnostic feedback
  pink: '#FFA2B6',   // Learning modules, soft information tags, highlight strips
  yellow: '#EFB11D', // Progress, roadmaps, achievements, active attention states
  cream: '#EBE9E1',  // DOMINANT page canvas background (Warm Cream)

  // Mandatory Supporting Neutral Anchors
  ink: '#171714',    // Primary high-contrast typography, heavy borders, deep accents
  paper: '#F7F5EF',  // Elevated cards, modal dialogs, input field fills

  // Translucent functional shades for borders and overlays
  borderSubtle: 'rgba(23, 23, 20, 0.12)',
  borderBold: '#171714',
  overlayBackdrop: 'rgba(23, 23, 20, 0.65)',
} as const;

export const TYPOGRAPHY_TOKENS = {
  fontDisplay: 'var(--font-display, "Anton", "Bebas Neue", sans-serif)',
  fontBody: 'var(--font-body, "Inter", "Manrope", sans-serif)',
  
  // Responsive typography clamps for editorial impact
  scales: {
    display: 'clamp(3.5rem, 8vw, 9rem)',     // Hero statements
    h1: 'clamp(2.5rem, 6vw, 6rem)',           // Major section headers
    h2: 'clamp(1.75rem, 3.5vw, 3.25rem)',     // Module & panel titles
    h3: 'clamp(1.25rem, 2vw, 2rem)',          // Sub-headers & card titles
    bodyLarge: '1.125rem',                   // 18px leading 1.6
    bodyRegular: '1rem',                     // 16px leading 1.6
    caption: '0.8125rem',                    // 13px tracking-wider uppercase
  },

  letterSpacing: {
    tighter: '-0.03em',
    tight: '-0.015em',
    normal: '0',
    wide: '0.04em',
    widest: '0.12em',
  }
} as const;

export const ELEVATION_TOKENS = {
  // Editorial sharp offset drop shadows (Swiss design style, NOT fuzzy SaaS blobs)
  flat: 'none',
  card: '3px 3px 0px #171714',
  cardHover: '5px 5px 0px #171714',
  buttonActive: '1px 1px 0px #171714',
  dialog: '8px 8px 0px #171714',
} as const;

export const RADIUS_TOKENS = {
  none: '0px',
  sm: '2px',
  md: '4px',
  lg: '8px',
  pill: '9999px',
} as const;

export const MOTION_TOKENS = {
  durationFast: '150ms',
  durationNormal: '250ms',
  durationSlow: '400ms',
  easeEditorial: 'cubic-bezier(0.16, 1, 0.3, 1)',
} as const;
