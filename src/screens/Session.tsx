import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { strainFlagsToCheckIn, useApp } from '../context/AppContext'
import { ConfirmModal } from '../components/ConfirmModal'
import { HiddenOverlay } from '../components/HiddenOverlay'
import { SessionRing } from '../components/SessionRing'
import type { StrainCheckIn } from '../types'

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
  const { plannedStudyMs, strainFlags, toggleStrainFlag, setCheckIn } = useApp()
  const [elapsedMs, setElapsedMs] = useState(0)
  const [paused, setPaused] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [pendingFlag, setPendingFlag] = useState<PendingFlag>(null)
  const [showEndConfirm, setShowEndConfirm] = useState(false)

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => setElapsedMs((e) => e + 1000), 1000)
    return () => clearInterval(id)
  }, [paused])

  const progress = Math.min(1, elapsedMs / plannedStudyMs)
  const copy = pendingFlag ? FLAG_COPY[pendingFlag] : null

  function handleFlagTap(dim: 'eyes' | 'neck') {
    if (strainFlags[dim]) {
      toggleStrainFlag(dim)
      return
    }
    setPendingFlag(dim)
  }

  const skipBreakCheckIn = useCallback(
    (replace = false) => {
      const partial = strainFlagsToCheckIn(strainFlags)
      const nextCheckIn: StrainCheckIn = {
        eyes: partial.eyes ?? 'good',
        neck: partial.neck ?? 'good',
        mind: 'good',
      }
      setCheckIn(nextCheckIn)
      navigate('/break/pick', replace ? { replace: true } : undefined)
    },
    [navigate, setCheckIn, strainFlags],
  )

  useEffect(() => {
    if (elapsedMs >= plannedStudyMs) {
      skipBreakCheckIn(true)
    }
  }, [elapsedMs, plannedStudyMs, skipBreakCheckIn])

  function confirmBreak() {
    if (pendingFlag) toggleStrainFlag(pendingFlag)
    setPendingFlag(null)
    skipBreakCheckIn()
  }

  function confirmNote() {
    if (pendingFlag) toggleStrainFlag(pendingFlag)
    setPendingFlag(null)
  }

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
        </SessionRing>
      </div>

      <div className="session-actions">
        <button
          type="button"
          className="round-btn round-btn-warn"
          onClick={() => setShowEndConfirm(true)}
        >
          End Session
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
        open={showEndConfirm}
        title="End session?"
        body="Are you sure you want to end this session now?"
        primaryLabel="End session"
        secondaryLabel="Keep going"
        onPrimary={() => skipBreakCheckIn()}
        onSecondary={() => setShowEndConfirm(false)}
        onDismiss={() => setShowEndConfirm(false)}
      />

      <ConfirmModal
        open={!!copy}
        title={copy?.title ?? ''}
        body={copy?.body}
        primaryLabel="Take break now"
        secondaryLabel="Just note it"
        onPrimary={confirmBreak}
        onSecondary={confirmNote}
        onDismiss={() => setPendingFlag(null)}
      />
    </div>
  )
}
