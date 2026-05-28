import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { gradientFor } from '../lib/visual'

function formatMmSs(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds))
  const mm = Math.floor(s / 60)
  const ss = s % 60
  return `${mm}:${ss.toString().padStart(2, '0')}`
}

export function BreakActive() {
  const navigate = useNavigate()
  const { chosenActivity, breakStartedAt, plannedBreakMs } = useApp()
  const [elapsedMs, setElapsedMs] = useState(0)

  useEffect(() => {
    const startedAt = breakStartedAt
    if (startedAt === null) return
    function update() {
      setElapsedMs(Date.now() - startedAt!)
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [breakStartedAt])

  if (!chosenActivity) {
    navigate('/break/pick', { replace: true })
    return null
  }

  const activity = chosenActivity
  const elapsedSeconds = Math.floor(elapsedMs / 1000)
  const suggestedSeconds = Math.floor(plannedBreakMs / 1000)
  const targetReached = elapsedSeconds >= suggestedSeconds

  return (
    <div className="screen break-active-screen">
      <header className="page-head">
        <p className="eyebrow">On break</p>
        <h1>{activity.name}</h1>
      </header>

      <div
        className="break-visual"
        style={{ backgroundImage: gradientFor(activity.name) }}
      >
        <span className="break-visual-emoji" aria-hidden="true">
          {activity.icon ?? '✨'}
        </span>
      </div>

      {activity.description && (
        <p className="break-desc">{activity.description}</p>
      )}

      <div className="break-badges">
        {activity.helps_eyes && (
          <span className="break-badge">For your eyes</span>
        )}
        {activity.helps_neck && (
          <span className="break-badge">For your neck</span>
        )}
        {activity.helps_mind && (
          <span className="break-badge">For your mind</span>
        )}
        {activity.screen_free && (
          <span className="break-badge break-badge-accent">Screen-free</span>
        )}
      </div>

      <div className="break-timer">
        <span className="break-timer-value mono">
          {formatMmSs(elapsedSeconds)}
        </span>
        <span className="break-timer-sub">
          {targetReached
            ? 'past the suggested time — take your time'
            : `suggested ${formatMmSs(suggestedSeconds)}`}
        </span>
      </div>

      <button
        type="button"
        className="btn-primary"
        onClick={() => navigate('/break/outcome')}
      >
        I'm back
      </button>
    </div>
  )
}
