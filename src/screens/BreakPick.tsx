import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { topActivities } from '../lib/suggest'
import { rationaleFor } from '../lib/visual'
import { ActivityHero } from '../components/ActivityHero'
import { ActivityTile } from '../components/ActivityTile'
import { ConfirmModal } from '../components/ConfirmModal'
import type { Activity } from '../types'

export function BreakPick() {
  const navigate = useNavigate()
  const { activities, user, checkIn, setChosenActivity, resetFlow } = useApp()
  const [showEndDayConfirm, setShowEndDayConfirm] = useState(false)

  const ranked = useMemo(() => {
    if (!checkIn || activities.length === 0) return []
    return topActivities(checkIn, activities, activities.length)
  }, [checkIn, activities])

  const hero: Activity | null = ranked[0] ?? null

  const others = useMemo(() => {
    if (!hero) return []
    const seen = new Set<number>([hero.id])
    const picks: Activity[] = []
    const push = (a: Activity | undefined) => {
      if (a && !seen.has(a.id)) {
        seen.add(a.id)
        picks.push(a)
      }
    }
    // Next-best recommendations first, then favorites, then "something new".
    ranked.slice(1, 4).forEach(push)
    user.favoriteActivityIds.forEach((id) =>
      push(activities.find((a) => a.id === id)),
    )
    user.somethingNewIds.forEach((id) =>
      push(activities.find((a) => a.id === id)),
    )
    return picks
  }, [hero, ranked, activities, user.favoriteActivityIds, user.somethingNewIds])

  function pick(a: Activity) {
    setChosenActivity(a)
    navigate('/break/active')
  }

  function endDay() {
    resetFlow()
    navigate('/', { replace: true })
  }

  if (!checkIn) {
    navigate('/break/check-in', { replace: true })
    return null
  }

  if (!hero) {
    return (
      <div className="screen">
        <header className="page-head">
          <h1>Finding ideas…</h1>
        </header>
      </div>
    )
  }

  return (
    <div className="screen">
      <header className="page-head">
        <p className="eyebrow">Right now</p>
        <h1>How about this?</h1>
      </header>

      <ActivityHero
        activity={hero}
        rationale={rationaleFor(checkIn, hero)}
        onSelect={pick}
      />

      {others.length > 0 && (
        <section className="tile-section">
          <h2 className="section-title">Or try one of these</h2>
          <div className="tile-scroller">
            {others.map((a) => (
              <ActivityTile key={a.id} activity={a} onSelect={pick} />
            ))}
          </div>
        </section>
      )}

      <div className="actions">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => setShowEndDayConfirm(true)}
        >
          Stop for today
        </button>
      </div>

      <ConfirmModal
        open={showEndDayConfirm}
        title="Stop working for today?"
        body="This will end the current flow and take you back home."
        primaryLabel="Stop for today"
        secondaryLabel="Keep going"
        onPrimary={endDay}
        onSecondary={() => setShowEndDayConfirm(false)}
        onDismiss={() => setShowEndDayConfirm(false)}
      />
    </div>
  )
}
