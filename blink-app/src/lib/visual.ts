import type { Activity, StrainCheckIn } from '../types'

type Stops = readonly [string, string]

const GRADIENTS: Record<string, Stops> = {
  'Eye exercises': ['#DCEAF3', '#A6C7DC'],
  'Look out a window': ['#DEEEDA', '#9CC1A1'],
  'Neck stretches': ['#E5DCEE', '#B49EC9'],
  'Short walk': ['#DDE9CB', '#A0BD7E'],
  'Grab a coffee': ['#F1E1C5', '#D0AC78'],
  'Call a friend': ['#F3D7D2', '#D89C95'],
  Meditation: ['#DCD4EC', '#9C8CB8'],
  'Power nap': ['#CFD5E4', '#8995AE'],
}

const FALLBACK: Stops = ['#EADFCB', '#C3B49A']

// Native: returns the two gradient stops for <LinearGradient colors={...}>.
// (The web build returned a CSS `linear-gradient(...)` string instead.)
export function gradientColorsFor(activityName: string): [string, string] {
  const [a, b] = GRADIENTS[activityName] ?? FALLBACK
  return [a, b]
}

export function rationaleFor(
  strain: StrainCheckIn,
  activity: Activity,
): string {
  if (strain.eyes === 'sore' && activity.helps_eyes)
    return 'A rest for tired eyes.'
  if (strain.neck === 'sore' && activity.helps_neck)
    return 'Loosen up your neck.'
  if (strain.mind === 'sore' && activity.helps_mind)
    return 'A reset for your head.'
  if (strain.eyes === 'meh' || strain.neck === 'meh' || strain.mind === 'meh')
    return 'A gentle reset.'
  return 'A moment for yourself.'
}
