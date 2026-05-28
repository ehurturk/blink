import { useEffect, useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import { supabase } from '../lib/supabase'
import { categoryFor } from '../lib/categories'
import type { Break } from '../types'

export function Stats() {
  const { activities, user } = useApp()
  const [breaks, setBreaks] = useState<Break[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false
    void (async () => {
      const { data, error } = await supabase
        .from('breaks')
        .select('*')
        .order('created_at', { ascending: false })
        .returns<Break[]>()
      if (ignore) return
      if (error) {
        setError(error.message)
        return
      }
      setBreaks(data ?? [])
    })()
    return () => {
      ignore = true
    }
  }, [])

  const tiles = useMemo(() => {
    if (!breaks) return []
    const counts = new Map<number, number>()
    for (const b of breaks) {
      if (b.did_activity && b.suggested_activity_id !== null) {
        counts.set(
          b.suggested_activity_id,
          (counts.get(b.suggested_activity_id) ?? 0) + 1,
        )
      }
    }
    return activities
      .map((a) => ({
        activity: a,
        count: counts.get(a.id) ?? 0,
        ...categoryFor(a.name),
      }))
      .filter((t) => t.count > 0)
      .sort((a, b) => b.count - a.count)
  }, [breaks, activities])

  const [weekCutoff] = useState(() => Date.now() - 7 * 24 * 60 * 60 * 1000)
  const weekCount = useMemo(() => {
    if (!breaks) return 0
    return breaks.filter(
      (b) =>
        b.did_activity && new Date(b.created_at).getTime() >= weekCutoff,
    ).length
  }, [breaks, weekCutoff])

  return (
    <div className="screen">
      <header className="page-head">
        <p className="eyebrow">{user.name}'s wins</p>
        <h1>
          {breaks === null
            ? '…'
            : weekCount === 0
              ? 'A blank week.'
              : weekCount === 1
                ? '1 good break this week.'
                : `${weekCount} good breaks this week.`}
        </h1>
      </header>

      {error && <p className="error">{error}</p>}

      {breaks !== null && tiles.length === 0 && !error && (
        <p className="subtle">
          No completed breaks yet. Start a session and take one to see your wins
          here.
        </p>
      )}

      {tiles.length > 0 && (
        <div className="stats-grid">
          {tiles.map((t) => (
            <div key={t.activity.id} className="stats-tile">
              <span className="stats-icon" aria-hidden="true">
                {t.icon}
              </span>
              <span className="stats-count">{t.count}</span>
              <span className="stats-name">{t.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
