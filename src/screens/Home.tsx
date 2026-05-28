import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { SessionRing } from '../components/SessionRing'
import { DurationStepper } from '../components/DurationStepper'
import { formatDuration } from '../lib/format'

const SUGGESTED_STUDY_MS = 25 * 60 * 1000
const MIN_STUDY_MS = 5 * 60 * 1000
const MAX_STUDY_MS = 120 * 60 * 1000

export function Home() {
  const navigate = useNavigate()
  const {
    user,
    plannedStudyMs,
    setPlannedStudy,
    beginSession,
    sessionStartedAt,
    studyElapsedMsAtBreak,
    checkIn,
    chosenActivity,
  } = useApp()

  // If a session is already in flight, send the user back to the live screen.
  // No new session can be started until the current one's break flow finishes.
  useEffect(() => {
    if (sessionStartedAt === null) return
    if (studyElapsedMsAtBreak === null) {
      navigate('/session', { replace: true })
    } else if (chosenActivity !== null) {
      navigate('/break/active', { replace: true })
    } else if (checkIn !== null) {
      navigate('/break/pick', { replace: true })
    } else {
      navigate('/break/check-in', { replace: true })
    }
  }, [
    sessionStartedAt,
    studyElapsedMsAtBreak,
    checkIn,
    chosenActivity,
    navigate,
  ])

  // Don't flash Home content during the redirect.
  if (sessionStartedAt !== null) return null

  // Visual cue on the ring: longer planned session = fuller ring.
  const progress = Math.max(
    0.08,
    Math.min(
      0.97,
      (plannedStudyMs - MIN_STUDY_MS) / (MAX_STUDY_MS - MIN_STUDY_MS),
    ),
  )

  function begin() {
    beginSession()
    navigate('/session')
  }

  function pickSuggested() {
    setPlannedStudy(SUGGESTED_STUDY_MS)
    beginSession()
    navigate('/session')
  }

  return (
    <div className="screen home-screen">
      <h1 className="welcome">Welcome back, {user.name}</h1>

      <div className="home-ring">
        <SessionRing progress={progress} stroke={18}>
          <span className="ring-total">{formatDuration(plannedStudyMs)}</span>
          <span className="ring-sub">planned</span>
        </SessionRing>
      </div>

      <DurationStepper
        label="Study time"
        valueMs={plannedStudyMs}
        onChange={setPlannedStudy}
      />

      <div className="actions home-actions">
        <button type="button" className="btn-primary" onClick={begin}>
          Begin
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={pickSuggested}
        >
          Suggested time (25 min)
        </button>
      </div>
    </div>
  )
}
