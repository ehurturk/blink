import { useState } from 'react'
import type {
  StrainCheckIn as StrainCheckInValue,
  StrainDimension,
} from '../types'
import { StrainSlider } from './StrainSlider'

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
        <StrainSlider
          key={key}
          label={label}
          value={draft[key]}
          onChange={(v) => setDraft((d) => ({ ...d, [key]: v }))}
        />
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
