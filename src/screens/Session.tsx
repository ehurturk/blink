import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { SessionRing } from '../components/SessionRing'
import { HiddenOverlay } from '../components/HiddenOverlay'
import { ConfirmModal } from '../components/ConfirmModal'

function formatMmSs(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000))
  const mm = Math.floor(s / 60)
  const ss = s % 60
  return `${mm}:${ss.toString().padStart(2, '0')}`
}

type PendingFlag = 'eyes' | 'neck' | null

const FLAG_COPY: Record<
  Exclude<PendingFlag, null>,
  { title: string; body: string }
> = {
  eyes: {
    title: 'Eyes feeling tired?',
    body: "We'll factor that into your next break suggestion.",
  },
  neck: {
    title: 'Neck feeling tight?',
    body: "We'll factor that into your next break suggestion.",
  },
}

export function Session() {
  const navigate = useNavigate()
  const { plannedStudyMs, strainFlags, toggleStrainFlag } = useApp()
  const [elapsedMs, setElapsedMs] = useState(0)
  const [paused, setPaused] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [pendingFlag, setPendingFlag] = useState<PendingFlag>(null)

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => setElapsedMs((e) => e + 1000), 1000)
    return () => clearInterval(id)
  }, [paused])

  useEffect(() => {
    if (elapsedMs >= plannedStudyMs) {
      navigate('/break/check-in', { replace: true })
    }
  }, [elapsedMs, plannedStudyMs, navigate])

  const progress = Math.min(1, elapsedMs / plannedStudyMs)

  function handleFlagTap(dim: 'eyes' | 'neck') {
    if (strainFlags[dim]) {
      toggleStrainFlag(dim) // already flagged → clear instantly
    } else {
      setPendingFlag(dim)
    }
  }

  function confirmBreak() {
    if (pendingFlag) toggleStrainFlag(pendingFlag)
    setPendingFlag(null)
    navigate('/break/check-in')
  }

  function confirmNote() {
    if (pendingFlag) toggleStrainFlag(pendingFlag)
    setPendingFlag(null)
  }

  const copy = pendingFlag ? FLAG_COPY[pendingFlag] : null

  return (
    <div className={`screen session-screen${hidden ? ' is-hidden' : ''}`}>
      <div className="strain-flags">
        <button
          type="button"
          className={`flag-chip${strainFlags.eyes ? ' is-on' : ''}`}
          onClick={() => handleFlagTap('eyes')}
        >
          My eyes hurt
        </button>
        <button
          type="button"
          className={`flag-chip${strainFlags.neck ? ' is-on' : ''}`}
          onClick={() => handleFlagTap('neck')}
        >
          My neck hurts
        </button>
      </div>

      <div className="ring-wrap session-ring-wrap">
        <SessionRing progress={progress}>
          <span className="ring-total mono">{formatMmSs(elapsedMs)}</span>
          <span className="ring-sub">of {formatMmSs(plannedStudyMs)}</span>
        </SessionRing>
      </div>

      <div className="session-actions">
        <button
          type="button"
          className="round-btn round-btn-warn"
          onClick={() => navigate('/break/check-in')}
        >
          Break now
        </button>
        <button
          type="button"
          className="round-btn round-btn-soft"
          onClick={() => setPaused((p) => !p)}
        >
          {paused ? 'Resume' : 'Pause'}
        </button>
      </div>

      <button
        type="button"
        className="btn-secondary btn-hide"
        onClick={() => setHidden(true)}
      >
        Hide
      </button>

      <HiddenOverlay active={hidden} onReveal={() => setHidden(false)} />

      <ConfirmModal
        open={pendingFlag !== null}
        title={copy?.title ?? ''}
        body={copy?.body}
        primaryLabel="Break now"
        secondaryLabel="Just note it"
        onPrimary={confirmBreak}
        onSecondary={confirmNote}
        onDismiss={() => setPendingFlag(null)}
      />
    </div>
  )
}
