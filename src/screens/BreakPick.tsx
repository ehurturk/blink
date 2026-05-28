import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { topActivities } from '../lib/suggest'
import { ActivityCard } from '../components/ActivityCard'
import type { Activity } from '../types'

function byIds(activities: Activity[], ids: number[]): Activity[] {
  return ids
    .map((id) => activities.find((a) => a.id === id))
    .filter((a): a is Activity => Boolean(a))
}

export function BreakPick() {
  const navigate = useNavigate()
  const { activities, user, checkIn, setChosenActivity } = useApp()
  const [wish, setWish] = useState('')

  const recommended = useMemo(() => {
    if (!checkIn || activities.length === 0) return []
    return topActivities(checkIn, activities, 3)
  }, [checkIn, activities])

  const favorites = useMemo(
    () => byIds(activities, user.favoriteActivityIds),
    [activities, user.favoriteActivityIds],
  )

  const somethingNew = useMemo(
    () => byIds(activities, user.somethingNewIds),
    [activities, user.somethingNewIds],
  )

  function pick(a: Activity) {
    setChosenActivity(a)
    navigate('/break/active')
  }

  if (!checkIn) {
    // Defensive — shouldn't happen via the normal flow.
    navigate('/break/check-in', { replace: true })
    return null
  }

  return (
    <div className="screen">
      <header className="page-head">
        <p className="eyebrow">Pick a break</p>
        <h1>What would you like to do?</h1>
      </header>

      {recommended.length > 0 && (
        <section className="pick-section">
          <h2 className="section-title">Recommended</h2>
          <div className="activity-grid">
            {recommended.map((a) => (
              <ActivityCard key={a.id} activity={a} onSelect={pick} />
            ))}
          </div>
        </section>
      )}

      {favorites.length > 0 && (
        <section className="pick-section">
          <h2 className="section-title">Favorites</h2>
          <div className="activity-grid">
            {favorites.map((a) => (
              <ActivityCard key={a.id} activity={a} onSelect={pick} />
            ))}
          </div>
        </section>
      )}

      <section className="pick-section">
        <h2 className="section-title">Something on your mind?</h2>
        <textarea
          className="wish-input"
          rows={2}
          placeholder="Give me a suggestion and I'll do my best."
          value={wish}
          onChange={(e) => setWish(e.target.value)}
        />
        <p className="subtle hint">Coming soon — for now, pick a card above.</p>
      </section>

      {somethingNew.length > 0 && (
        <section className="pick-section">
          <h2 className="section-title">Something new</h2>
          <div className="activity-grid">
            {somethingNew.map((a) => (
              <ActivityCard key={a.id} activity={a} onSelect={pick} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
