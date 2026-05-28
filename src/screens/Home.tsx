import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { SessionRing } from '../components/SessionRing'
import { DurationStepper } from '../components/DurationStepper'
import { formatDuration } from '../lib/format'

const SUGGESTED_STUDY_MS = 25 * 60 * 1000
const SUGGESTED_BREAK_MS = 5 * 60 * 1000

export function Home() {
  const navigate = useNavigate()
  const {
    user,
    plannedStudyMs,
    plannedBreakMs,
    setPlannedStudy,
    setPlannedBreak,
    beginSession,
  } = useApp()

  const total = plannedStudyMs + plannedBreakMs
  const studyShare = plannedStudyMs / total
  const breakShare = plannedBreakMs / total

  function begin() {
    beginSession()
    navigate('/session')
  }

  function pickSuggested() {
    setPlannedStudy(SUGGESTED_STUDY_MS)
    setPlannedBreak(SUGGESTED_BREAK_MS)
    beginSession()
    navigate('/session')
  }

  return (
    <div className="screen">
      <header className="page-head">
        <p className="eyebrow">Welcome back</p>
        <h1>Hey {user.name}.</h1>
      </header>

      <div className="ring-wrap">
        <SessionRing progress={studyShare} secondaryProgress={breakShare}>
          <span className="ring-total">{formatDuration(total)}</span>
          <span className="ring-sub">session</span>
        </SessionRing>
        <div className="ring-legend">
          <span>
            <i className="dot dot-study" /> Study {formatDuration(plannedStudyMs)}
          </span>
          <span>
            <i className="dot dot-break" /> Break {formatDuration(plannedBreakMs)}
          </span>
        </div>
      </div>

      <div className="steppers">
        <DurationStepper
          label="Study time"
          valueMs={plannedStudyMs}
          onChange={setPlannedStudy}
        />
        <DurationStepper
          label="Break time"
          valueMs={plannedBreakMs}
          onChange={setPlannedBreak}
          stepMs={60 * 1000}
          minMs={60 * 1000}
          maxMs={30 * 60 * 1000}
        />
      </div>

      <div className="actions">
        <button type="button" className="btn-primary" onClick={begin}>
          Begin
        </button>
        <button type="button" className="btn-secondary" onClick={pickSuggested}>
          Pick suggested
        </button>
      </div>
    </div>
  )
}
