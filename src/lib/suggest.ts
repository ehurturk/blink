import type { Activity, StrainCheckIn } from '../types'

export function pickActivity(
  strain: StrainCheckIn,
  activities: Activity[],
): Activity | null {
  if (activities.length === 0) return null

  const soreDimensions = (['eyes', 'neck', 'mind'] as const).filter(
    (d) => strain[d] === 'sore',
  )

  const score = (a: Activity) => {
    if (soreDimensions.length === 0) return a.screen_free ? 1 : 0
    let s = 0
    if (soreDimensions.includes('eyes') && a.helps_eyes) s++
    if (soreDimensions.includes('neck') && a.helps_neck) s++
    if (soreDimensions.includes('mind') && a.helps_mind) s++
    return s
  }

  const scored = activities.map((a) => ({ a, s: score(a) }))
  const top = Math.max(...scored.map((x) => x.s))
  const pool = (top > 0 ? scored.filter((x) => x.s === top) : scored).map(
    (x) => x.a,
  )
  return pool[Math.floor(Math.random() * pool.length)]
}
