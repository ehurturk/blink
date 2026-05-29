import { describe, it, expect, vi, afterEach } from 'vitest'
import { pickActivity, topActivities } from './suggest'
import type { Activity, StrainCheckIn } from '../types'

function activity(partial: Partial<Activity> & { id: number; name: string }): Activity {
  return {
    description: null,
    helps_eyes: false,
    helps_neck: false,
    helps_mind: false,
    screen_free: true,
    icon: null,
    created_at: '2026-01-01T00:00:00Z',
    ...partial,
  }
}

const eyeActivity = activity({ id: 1, name: 'Eye exercises', helps_eyes: true })
const neckActivity = activity({ id: 2, name: 'Neck stretches', helps_neck: true })
const mindActivity = activity({ id: 3, name: 'Call a friend', helps_mind: true })
const screenActivity = activity({ id: 4, name: 'Browse phone', screen_free: false })

const allGood: StrainCheckIn = { eyes: 'good', neck: 'good', mind: 'good' }

afterEach(() => {
  vi.restoreAllMocks()
})

describe('pickActivity', () => {
  it('returns null when there are no activities', () => {
    expect(pickActivity(allGood, [])).toBeNull()
  })

  it('picks an activity that helps the sore area', () => {
    const strain: StrainCheckIn = { eyes: 'sore', neck: 'good', mind: 'good' }
    const pick = pickActivity(strain, [eyeActivity, neckActivity, mindActivity])
    expect(pick).toBe(eyeActivity)
  })

  it('prefers an activity covering more sore areas', () => {
    const strain: StrainCheckIn = { eyes: 'sore', neck: 'sore', mind: 'good' }
    const both = activity({ id: 5, name: 'Walk', helps_eyes: true, helps_neck: true })
    const pick = pickActivity(strain, [eyeActivity, neckActivity, both])
    expect(pick).toBe(both)
  })

  it('falls back to a screen-free activity when nothing is sore', () => {
    // top score comes from screen_free; only screen-free options can be picked
    const pick = pickActivity(allGood, [screenActivity, eyeActivity])
    expect(pick).toBe(eyeActivity)
  })

  it('only ever returns a top-scored activity (random tie-break)', () => {
    const strain: StrainCheckIn = { eyes: 'sore', neck: 'good', mind: 'good' }
    const otherEye = activity({ id: 6, name: 'Look out window', helps_eyes: true })
    const pool = [eyeActivity, otherEye]
    // both score 1 — force each end of the random range
    vi.spyOn(Math, 'random').mockReturnValue(0)
    expect(pool).toContain(pickActivity(strain, [...pool, neckActivity]))
    vi.spyOn(Math, 'random').mockReturnValue(0.999)
    expect(pool).toContain(pickActivity(strain, [...pool, neckActivity]))
  })
})

describe('topActivities', () => {
  it('returns the n highest-scoring activities, best first', () => {
    const strain: StrainCheckIn = { eyes: 'sore', neck: 'good', mind: 'good' }
    const top = topActivities(strain, [neckActivity, eyeActivity, mindActivity], 2)
    expect(top).toHaveLength(2)
    expect(top[0]).toBe(eyeActivity)
  })

  it('never returns more than n activities', () => {
    expect(topActivities(allGood, [eyeActivity, neckActivity, mindActivity], 2)).toHaveLength(2)
  })
})
