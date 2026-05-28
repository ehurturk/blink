import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useApp } from '../context/AppContext'
import { supabase } from '../lib/supabase'
import type { Activity, Break } from '../types'

type Period = 'today' | 'three_days' | 'week'

const PERIODS: { key: Period; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'three_days', label: '3 days' },
  { key: 'week', label: 'Week' },
]

const DAY_MS = 24 * 60 * 60 * 1000

function cutoffFor(period: Period, now: number): number {
  const d = new Date(now)
  d.setHours(0, 0, 0, 0)
  if (period === 'three_days') d.setDate(d.getDate() - 2)
  if (period === 'week') d.setDate(d.getDate() - 6)
  return d.getTime()
}

function formatTimeRich(totalSeconds: number): ReactNode {
  const safe = Math.max(0, Math.round(totalSeconds))
  const hours = Math.floor(safe / 3600)
  const minutes = Math.floor((safe % 3600) / 60)
  const seconds = safe % 60
  const parts: ReactNode[] = []
  let key = 0
  function push(num: number, unit: string) {
    parts.push(
      <span key={key++} className="time-part">
        <span className="time-num">{num}</span>
        <span className="time-unit">{unit}</span>
      </span>,
    )
  }
  if (hours > 0) push(hours, 'h')
  if (minutes > 0) push(minutes, 'm')
  if (seconds > 0 || parts.length === 0) push(seconds, 's')
  return <>{parts}</>
}

function dayLabel(date: Date, now: number): string {
  const today = new Date(now)
  today.setHours(0, 0, 0, 0)
  const dayStart = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  )
  const diff = Math.round((today.getTime() - dayStart.getTime()) / DAY_MS)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  if (diff < 7)
    return dayStart.toLocaleDateString(undefined, { weekday: 'long' })
  return dayStart.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

function timeLabel(date: Date): string {
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  })
}

function statusFor(b: Break): { label: string; className: string } {
  if (b.did_activity === false)
    return { label: 'Skipped', className: 'is-skipped' }
  if (b.helped === true) return { label: 'Helped', className: 'is-helped' }
  if (b.helped === false)
    return { label: "Didn't help", className: 'is-not-helped' }
  return { label: 'Done', className: '' }
}

export function Stats() {
  const { user, activities } = useApp()
  const [breaks, setBreaks] = useState<Break[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [period, setPeriod] = useState<Period>('today')
  const [now] = useState(() => Date.now())

  useEffect(() => {
    let ignore = false
    void (async () => {
      const { data, error: err } = await supabase
        .from('breaks')
        .select('*')
        .order('created_at', { ascending: false })
        .returns<Break[]>()
      if (ignore) return
      if (err) {
        setError(err.message)
        return
      }
      setBreaks(data ?? [])
    })()
    return () => {
      ignore = true
    }
  }, [])

  const filtered = useMemo(() => {
    if (!breaks) return []
    const cutoff = cutoffFor(period, now)
    return breaks.filter((b) => new Date(b.created_at).getTime() >= cutoff)
  }, [breaks, period, now])

  const summary = useMemo(() => {
    const totalBreaks = filtered.length
    const studySeconds = filtered.reduce(
      (acc, b) => acc + (b.study_seconds ?? 0),
      0,
    )
    const breakSeconds = filtered.reduce(
      (acc, b) => acc + (b.break_seconds ?? 0),
      0,
    )
    const didCount = filtered.filter((b) => b.did_activity === true).length
    const helpedCount = filtered.filter(
      (b) => b.did_activity === true && b.helped === true,
    ).length
    const effectiveness =
      didCount > 0 ? Math.round((helpedCount / didCount) * 100) : null
    return { totalBreaks, studySeconds, breakSeconds, effectiveness }
  }, [filtered])

  const grouped = useMemo(() => {
    const groups = new Map<string, Break[]>()
    for (const b of filtered) {
      const d = new Date(b.created_at)
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
      const arr = groups.get(key) ?? []
      arr.push(b)
      groups.set(key, arr)
    }
    return Array.from(groups.entries()).map(([key, items]) => {
      const parts = key.split('-').map(Number)
      const date = new Date(parts[0], parts[1], parts[2])
      return { key, label: dayLabel(date, now), breaks: items }
    })
  }, [filtered, now])

  const activityById = useMemo(() => {
    const m = new Map<number, Activity>()
    for (const a of activities) m.set(a.id, a)
    return m
  }, [activities])

  return (
    <div className="screen stats-screen">
      <header className="page-head">
        <p className="eyebrow">{user.name}'s wins</p>
        <h1>Your activity</h1>
      </header>

      <div className="stats-tabs" role="tablist" aria-label="Time period">
        {PERIODS.map((p) => (
          <button
            key={p.key}
            type="button"
            role="tab"
            aria-selected={period === p.key}
            className={`stats-tab${period === p.key ? ' is-active' : ''}`}
            onClick={() => setPeriod(p.key)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {error && <p className="error">{error}</p>}

      <div className="stat-hero">
        <span className="stat-hero-label">Studied</span>
        <div className="stat-hero-value mono">
          {formatTimeRich(summary.studySeconds)}
        </div>
        <p className="stat-hero-sub">
          {summary.totalBreaks === 0
            ? 'No breaks yet.'
            : `${summary.totalBreaks} break${summary.totalBreaks !== 1 ? 's' : ''} taken`}
        </p>
      </div>

      <div className="stat-cards">
        <div className="stat-card">
          <p className="stat-card-label">Break time</p>
          <div className="stat-card-value mono">
            {formatTimeRich(summary.breakSeconds)}
          </div>
        </div>
        <div className="stat-card">
          <p className="stat-card-label">Effective</p>
          <div className="stat-card-value mono">
            {summary.effectiveness === null ? (
              <span className="time-part">
                <span className="time-num">—</span>
              </span>
            ) : (
              <span className="time-part">
                <span className="time-num">{summary.effectiveness}</span>
                <span className="time-unit">%</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {breaks === null && !error ? (
        <p className="subtle empty">Loading…</p>
      ) : grouped.length === 0 ? (
        <p className="subtle empty">Take a break to see it here.</p>
      ) : (
        <section className="break-list">
          {grouped.map((group) => (
            <div className="break-day" key={group.key}>
              <h3 className="break-day-label">{group.label}</h3>
              <div className="break-card">
                {group.breaks.map((b) => {
                  const activity =
                    b.suggested_activity_id !== null
                      ? (activityById.get(b.suggested_activity_id) ?? null)
                      : null
                  const status = statusFor(b)
                  const d = new Date(b.created_at)
                  return (
                    <div className="break-row" key={b.id}>
                      <span className="break-row-emoji" aria-hidden="true">
                        {activity?.icon ?? '✨'}
                      </span>
                      <div className="break-row-main">
                        <span className="break-row-name">
                          {activity?.name ?? 'Break'}
                        </span>
                        <span
                          className={`break-row-status ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </div>
                      <span className="break-row-time mono">
                        {timeLabel(d)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  )
}
