import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { pickActivity } from './lib/suggest'
import { StrainCheckIn } from './components/StrainCheckIn'
import { SuggestionCard } from './components/SuggestionCard'
import { TodayCount } from './components/TodayCount'
import type {
  Activity,
  StrainCheckIn as StrainCheckInValue,
} from './types'
import './App.css'

function startOfTodayISO() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

async function fetchTodayCount() {
  const { count, error } = await supabase
    .from('breaks')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startOfTodayISO())
  if (error) throw error
  return count ?? 0
}

function App() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [suggestion, setSuggestion] = useState<Activity | null>(null)
  const [todayCount, setTodayCount] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false

    async function loadInitial() {
      const [activitiesRes, count] = await Promise.all([
        supabase.from('activities').select('*').returns<Activity[]>(),
        fetchTodayCount().catch(() => null),
      ])
      if (ignore) return
      if (activitiesRes.error) {
        setError(activitiesRes.error.message)
        return
      }
      setActivities(activitiesRes.data ?? [])
      if (count !== null) setTodayCount(count)
    }

    void loadInitial()
    return () => {
      ignore = true
    }
  }, [])

  async function handleSubmit(strain: StrainCheckInValue) {
    setSubmitting(true)
    setError(null)
    const picked = pickActivity(strain, activities)
    if (!picked) {
      setError('No activities available yet.')
      setSubmitting(false)
      return
    }
    const { error: insertErr } = await supabase.from('breaks').insert({
      eyes_state: strain.eyes,
      neck_state: strain.neck,
      mind_state: strain.mind,
      suggested_activity_id: picked.id,
    })
    if (insertErr) {
      setError(insertErr.message)
      setSubmitting(false)
      return
    }
    try {
      setTodayCount(await fetchTodayCount())
    } catch {
      // count is non-critical; the insert already landed
    }
    setSuggestion(picked)
    setSubmitting(false)
  }

  function handleBack() {
    setSuggestion(null)
    setError(null)
  }

  return (
    <main className="app">
      <div className="frame">
        {suggestion ? (
          <SuggestionCard activity={suggestion} onBack={handleBack} />
        ) : (
          <StrainCheckIn onSubmit={handleSubmit} disabled={submitting} />
        )}
        <TodayCount count={todayCount} />
        {error && <p className="error">{error}</p>}
      </div>
    </main>
  )
}

export default App
