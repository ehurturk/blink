import type { Activity, StrainCheckIn } from '../types'

function score(strain: StrainCheckIn, a: Activity) {
  const sore = (['eyes', 'neck', 'mind'] as const).filter(
    (d) => strain[d] === 'sore',
  )
  if (sore.length === 0) return a.screen_free ? 1 : 0
  let s = 0
  if (sore.includes('eyes') && a.helps_eyes) s++
  if (sore.includes('neck') && a.helps_neck) s++
  if (sore.includes('mind') && a.helps_mind) s++
  return s
}

export function pickActivity(
  strain: StrainCheckIn,
  activities: Activity[],
): Activity | null {
  if (activities.length === 0) return null
  const scored = activities.map((a) => ({ a, s: score(strain, a) }))
  const top = Math.max(...scored.map((x) => x.s))
  const pool = (top > 0 ? scored.filter((x) => x.s === top) : scored).map(
    (x) => x.a,
  )
  return pool[Math.floor(Math.random() * pool.length)]
}

export function topActivities(
  strain: StrainCheckIn,
  activities: Activity[],
  n: number,
): Activity[] {
  const scored = activities
    .map((a) => ({ a, s: score(strain, a) }))
    .sort((x, y) => y.s - x.s)
  return scored.slice(0, n).map((x) => x.a)
}
