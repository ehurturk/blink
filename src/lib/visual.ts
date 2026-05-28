import type { Activity, StrainCheckIn } from '../types'

type Stops = readonly [string, string]

const GRADIENTS: Record<string, Stops> = {
  'Eye exercises': ['#CFE3F1', '#8FB6CC'],
  'Look out a window': ['#D6E7F0', '#7FA8C2'],
  'Neck stretches': ['#E5DAEC', '#A693C0'],
  'Short walk': ['#D3E1CA', '#7FA579'],
  'Grab a coffee': ['#EFE0CB', '#C5A77F'],
  'Call a friend': ['#F2D7D5', '#DA9E97'],
  Meditation: ['#D7D2EA', '#897FA6'],
  'Power nap': ['#C9CEE0', '#6E789B'],
}

const FALLBACK: Stops = ['#E8E2D6', '#B9B0A0']

export function gradientFor(activityName: string): string {
  const [a, b] = GRADIENTS[activityName] ?? FALLBACK
  return `linear-gradient(155deg, ${a}, ${b})`
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
  if (
    strain.eyes === 'meh' ||
    strain.neck === 'meh' ||
    strain.mind === 'meh'
  )
    return 'A gentle reset.'
  return 'A moment for yourself.'
}
