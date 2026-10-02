export * from './tokens';
import { COLOR_TOKENS } from './tokens';

/**
 * Returns accessible styling tokens for difficulty level badges.
 */
export function getDifficultyBadgeTokens(level: 'L0' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5') {
  switch (level) {
    case 'L0':
    case 'L1':
      return {
        bg: COLOR_TOKENS.paper,
        text: COLOR_TOKENS.ink,
        border: COLOR_TOKENS.ink,
        label: level === 'L0' ? 'L0 · Awareness' : 'L1 · Beginner',
      };
    case 'L2':
      return {
        bg: COLOR_TOKENS.pink,
        text: COLOR_TOKENS.ink,
        border: COLOR_TOKENS.ink,
        label: 'L2 · Basic',
      };
    case 'L3':
      return {
        bg: COLOR_TOKENS.yellow,
        text: COLOR_TOKENS.ink,
        border: COLOR_TOKENS.ink,
        label: 'L3 · Intermediate',
      };
    case 'L4':
      return {
        bg: COLOR_TOKENS.rose,
        text: '#FFFFFF',
        border: COLOR_TOKENS.ink,
        label: 'L4 · Advanced',
      };
    case 'L5':
      return {
        bg: COLOR_TOKENS.orange,
        text: '#FFFFFF',
        border: COLOR_TOKENS.ink,
        label: 'L5 · Expert',
      };
  }
}

/**
 * Returns distinct editorial styling for career track tags.
 */
export function getTrackBadgeTokens(track: 'TECHNICAL' | 'NON_TECHNICAL' | 'HYBRID') {
  switch (track) {
    case 'TECHNICAL':
      return {
        bg: COLOR_TOKENS.ink,
        text: COLOR_TOKENS.paper,
        label: 'Technical',
      };
    case 'NON_TECHNICAL':
      return {
        bg: COLOR_TOKENS.rose,
        text: '#FFFFFF',
        label: 'Non-Technical',
      };
    case 'HYBRID':
      return {
        bg: COLOR_TOKENS.yellow,
        text: COLOR_TOKENS.ink,
        label: 'Hybrid / Specialized',
      };
  }
}
