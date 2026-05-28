import { useState } from 'react'
import type {
  StrainCheckIn as StrainCheckInValue,
  StrainDimension,
  StrainState,
} from '../types'

type Props = {
  onSubmit: (strain: StrainCheckInValue) => void
  disabled?: boolean
}

const DIMENSIONS: { key: StrainDimension; label: string }[] = [
  { key: 'eyes', label: 'Eyes' },
  { key: 'neck', label: 'Neck' },
  { key: 'mind', label: 'Mind' },
]

const STATES: { key: StrainState; label: string }[] = [
  { key: 'good', label: 'Good' },
  { key: 'meh', label: 'Meh' },
  { key: 'sore', label: 'Sore' },
]

export function StrainCheckIn({ onSubmit, disabled }: Props) {
  const [draft, setDraft] = useState<Partial<StrainCheckInValue>>({})

  const complete =
    draft.eyes !== undefined &&
    draft.neck !== undefined &&
    draft.mind !== undefined

  return (
    <div className="strain">
      <header className="page-head">
        <h1>How are you feeling?</h1>
        <p className="subtle">Tap one for each. We'll suggest a break.</p>
      </header>

      {DIMENSIONS.map(({ key, label }) => (
        <fieldset key={key} className="strain-row">
          <legend className="strain-label">{label}</legend>
          <div className="strain-options" role="radiogroup" aria-label={label}>
            {STATES.map(({ key: s, label: sLabel }) => {
              const selected = draft[key] === s
              return (
                <button
                  key={s}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  className={`strain-pill is-${s}${selected ? ' is-selected' : ''}`}
                  onClick={() => setDraft((d) => ({ ...d, [key]: s }))}
                >
                  {sLabel}
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
        {disabled ? 'Thinking…' : 'Suggest a break'}
      </button>
    </div>
  )
}
