import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SessionRing } from '../components/SessionRing'
import { useApp } from '../context/AppContext'

const DEFAULT_BREAK_MS = 5 * 60 * 1000

const BREAK_DURATIONS_MS: Record<string, number> = {
  'Eye exercises': 3 * 60 * 1000,
  'Look out a window': 2 * 60 * 1000,
  'Neck stretches': 4 * 60 * 1000,
  'Short walk': 8 * 60 * 1000,
  'Grab a coffee': 7 * 60 * 1000,
  'Call a friend': 10 * 60 * 1000,
  Meditation: 6 * 60 * 1000,
  'Power nap': 15 * 60 * 1000,
}

function formatMmSs(ms: number) {
  const s = Math.max(0, Math.ceil(ms / 1000))
  const mm = Math.floor(s / 60)
  const ss = s % 60
  return `${mm}:${ss.toString().padStart(2, '0')}`
}

export function BreakActive() {
  const navigate = useNavigate()
  const { chosenActivity, beginSession } = useApp()

  const durationMs = useMemo(() => {
    if (!chosenActivity) return DEFAULT_BREAK_MS
    return BREAK_DURATIONS_MS[chosenActivity.name] ?? DEFAULT_BREAK_MS
  }, [chosenActivity])

  const [remainingMs, setRemainingMs] = useState(durationMs)

  useEffect(() => {
    if (!chosenActivity) {
      navigate('/session', { replace: true })
    }
  }, [chosenActivity, navigate])

  useEffect(() => {
    if (remainingMs <= 0) return
    const id = window.setInterval(() => {
      setRemainingMs((current) => Math.max(0, current - 1000))
    }, 1000)
    return () => window.clearInterval(id)
  }, [remainingMs])

  if (!chosenActivity) return null

  const progress = durationMs === 0 ? 1 : 1 - remainingMs / durationMs
  const timerDone = remainingMs === 0

  function continueToSession() {
    beginSession()
    navigate('/session', { replace: true })
  }

  return (
    <div className="screen suggestion">
      <header className="page-head centered">
        <p className="eyebrow">On break</p>
        <h1>{chosenActivity.name}</h1>
      </header>

      <div className="ring-wrap session-ring-wrap">
        <SessionRing progress={progress}>
          <span className="ring-total mono">{formatMmSs(remainingMs)}</span>
          <span className="ring-sub">
            {timerDone ? 'Ready when you are' : 'remaining'}
          </span>
        </SessionRing>
      </div>

      {chosenActivity.icon && (
        <div className="suggestion-icon" aria-hidden="true">
          {chosenActivity.icon}
        </div>
      )}

      {chosenActivity.description && (
        <p className="suggestion-desc">{chosenActivity.description}</p>
      )}

      <p className="subtle centered">
        {timerDone
          ? 'Your break timer is finished. Start the next session when you are ready.'
          : 'You can finish early whenever you are done.'}
      </p>

      <button
        type="button"
        className="btn-primary"
        onClick={continueToSession}
      >
        {timerDone ? 'Continue' : "I'm done"}
      </button>
    </div>
  )
}
