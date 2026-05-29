import { describe, it, expect } from 'vitest'
import { formatDuration } from './format'

const MIN = 60_000

describe('formatDuration', () => {
  it('formats sub-hour durations as minutes', () => {
    expect(formatDuration(25 * MIN)).toBe('25 min')
  })

  it('formats whole hours without minutes', () => {
    expect(formatDuration(120 * MIN)).toBe('2 h')
  })

  it('formats hours and minutes together', () => {
    expect(formatDuration(90 * MIN)).toBe('1 h 30 min')
  })

  it('rounds to the nearest minute', () => {
    expect(formatDuration(89_000)).toBe('1 min')
  })

  it('handles zero', () => {
    expect(formatDuration(0)).toBe('0 min')
  })
})
