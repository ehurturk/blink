import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

type Option = {
  key: 'helped' | 'didnt' | 'skipped'
  emoji: string
  label: string
  sub: string
  did: boolean
  helped: boolean | null
  className: string
}

const OPTIONS: Option[] = [
  {
    key: 'helped',
    emoji: '😊',
    label: 'Helped',
    sub: 'I feel a bit better',
    did: true,
    helped: true,
    className: 'is-helped',
  },
  {
    key: 'didnt',
    emoji: '😐',
    label: "Didn't help",
    sub: 'About the same as before',
    did: true,
    helped: false,
    className: 'is-meh',
  },
  {
    key: 'skipped',
    emoji: '⏭',
    label: 'Skipped it',
    sub: "Didn't get to it this time",
    did: false,
    helped: null,
    className: 'is-skipped',
  },
]

export function BreakOutcome() {
  const navigate = useNavigate()
  const { chosenActivity, recordBreak } = useApp()
  const [submitting, setSubmitting] = useState<Option['key'] | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function submit(opt: Option) {
    setSubmitting(opt.key)
    setError(null)
    try {
      await recordBreak({ did: opt.did, helped: opt.helped })
      navigate('/stats', { replace: true })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
      setSubmitting(null)
    }
  }

  return (
    <div className="screen outcome-screen">
      <header className="page-head">
        <p className="eyebrow">After your break</p>
        <h1>How did it go?</h1>
      </header>

      {chosenActivity && (
        <div className="outcome-activity">
          <span className="outcome-activity-emoji" aria-hidden="true">
            {chosenActivity.icon ?? '✨'}
          </span>
          <span className="outcome-activity-name">{chosenActivity.name}</span>
        </div>
      )}

      <div className="outcome-options">
        {OPTIONS.map((opt) => (
          <button
            key={opt.key}
            type="button"
            className={`outcome-btn ${opt.className}${submitting === opt.key ? ' is-loading' : ''}`}
            onClick={() => void submit(opt)}
            disabled={submitting !== null}
          >
            <span className="outcome-btn-emoji" aria-hidden="true">
              {opt.emoji}
            </span>
            <span className="outcome-btn-text">
              <span className="outcome-btn-label">
                {submitting === opt.key ? 'Saving…' : opt.label}
              </span>
              <span className="outcome-btn-sub">{opt.sub}</span>
            </span>
          </button>
        ))}
      </div>

      {error && <p className="error">{error}</p>}
    </div>
  )
}
