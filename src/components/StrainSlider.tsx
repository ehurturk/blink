import type { StrainState } from '../types'

type Props = {
  label: string
  value: StrainState | undefined
  onChange: (v: StrainState) => void
}

const STATES: readonly StrainState[] = ['good', 'meh', 'sore'] as const
const EMOJI: Record<StrainState, string> = {
  good: '🙂',
  meh: '😐',
  sore: '😣',
}
const LABEL: Record<StrainState, string> = {
  good: 'Good',
  meh: 'Meh',
  sore: 'Sore',
}

export function StrainSlider({ label, value, onChange }: Props) {
  const touched = value !== undefined
  const numeric = touched ? STATES.indexOf(value) : 1

  return (
    <div
      className={`strain-slider${touched ? ' is-touched' : ''}${
        value ? ` is-${value}` : ''
      }`}
    >
      <div className="strain-slider-head">
        <span className="strain-slider-label">{label}</span>
        <span className="strain-slider-state">
          {touched ? (
            <>
              <span aria-hidden="true">{EMOJI[value]}</span>
              <span>{LABEL[value]}</span>
            </>
          ) : (
            <span className="strain-slider-hint">Slide to set</span>
          )}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={STATES.length - 1}
        step={1}
        value={numeric}
        onChange={(e) => onChange(STATES[Number(e.target.value)])}
        className="strain-range"
        aria-label={label}
      />
      <div className="strain-slider-ticks" aria-hidden="true">
        <span>Good</span>
        <span>Meh</span>
        <span>Sore</span>
      </div>
    </div>
  )
}
