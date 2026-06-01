// Design tokens ported from the web build's CSS custom properties (index.css).
// Calm, restorative palette — warm off-whites, muted accents, no alarm-red.

export const colors = {
  bg: '#faecd0',
  surface: '#fff5de',
  surfaceSoft: '#fbe9c9',
  text: '#2b2419',
  textMuted: '#87765f',
  border: '#e6d6b5',

  accent: '#aacde0',
  accentStrong: '#7baac6',
  accentSoft: '#cce0ee',

  warmChip: '#f3d3ae',
  warmChipStrong: '#d9a872',

  warn: '#df8c8c',
  peach: '#f2cb9d',

  good: '#dfeed3',
  goodStrong: '#93b68a',
  goodText: '#3f5a38',

  meh: '#f4e3c0',
  mehStrong: '#cfae6d',
  mehText: '#6b541f',

  sore: '#f1d6cf',
  soreStrong: '#c68684',
  soreText: '#6b3a30',

  error: '#b9534a',
  white: '#ffffff',
} as const

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  pill: 999,
} as const

// A soft, low-elevation shadow used by cards/buttons throughout the app.
export const softShadow = {
  shadowColor: '#000',
  shadowOpacity: 0.16,
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 6 },
  elevation: 4,
} as const
