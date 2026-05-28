import { useState } from 'react'
import type {
  StrainCheckIn as StrainCheckInValue,
  StrainDimension,
  StrainState,
} from '../types'

type Props = {
  onSubmit: (strain: StrainCheckInValue) => void
  initial?: Partial<StrainCheckInValue>
  ctaLabel?: string
  disabled?: boolean
}

const DIMENSIONS: { key: StrainDimension; label: string }[] = [
  { key: 'eyes', label: 'Eyes' },
  { key: 'neck', label: 'Neck' },
  { key: 'mind', label: 'Mind' },
]

const STATES: { key: StrainState; label: string; emoji: string }[] = [
  { key: 'good', label: 'Good', emoji: '🙂' },
  { key: 'meh', label: 'Meh', emoji: '😐' },
  { key: 'sore', label: 'Sore', emoji: '😣' },
]

export function StrainCheckIn({
  onSubmit,
  initial,
  ctaLabel = 'Find me a break',
  disabled,
}: Props) {
  const [draft, setDraft] = useState<Partial<StrainCheckInValue>>(initial ?? {})

  const complete =
    draft.eyes !== undefined &&
    draft.neck !== undefined &&
    draft.mind !== undefined

  return (
    <div className="strain">
      {DIMENSIONS.map(({ key, label }) => (
        <fieldset key={key} className="feeling-row">
          <legend className="feeling-label">{label}</legend>
          <div className="feeling-options" role="radiogroup" aria-label={label}>
            {STATES.map(({ key: s, label: sLabel, emoji }) => {
              const selected = draft[key] === s
              return (
                <button
                  key={s}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  className={`feeling-card is-${s}${selected ? ' is-selected' : ''}`}
                  onClick={() => setDraft((d) => ({ ...d, [key]: s }))}
                >
                  <span className="feeling-emoji" aria-hidden="true">
                    {emoji}
                  </span>
                  <span className="feeling-name">{sLabel}</span>
                </button>
              )
            })}
          </div>
        </fieldset>
      ))}

      <button
        type="button"
        className="btn-primary"
        disabled={!complete || disabled}
        onClick={() => complete && onSubmit(draft as StrainCheckInValue)}
      >
        {disabled ? 'One moment…' : ctaLabel}
      </button>
    </div>
  )
}
