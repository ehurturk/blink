import { formatDuration } from '../lib/format'

type Props = {
  valueMs: number
  onChange: (ms: number) => void
  stepMs?: number
  minMs?: number
  maxMs?: number
  label: string
}

export function DurationStepper({
  valueMs,
  onChange,
  stepMs = 5 * 60 * 1000,
  minMs = 5 * 60 * 1000,
  maxMs = 120 * 60 * 1000,
  label,
}: Props) {
  const dec = () => onChange(Math.max(minMs, valueMs - stepMs))
  const inc = () => onChange(Math.min(maxMs, valueMs + stepMs))

  return (
    <div className="stepper">
      <span className="stepper-label">{label}</span>
      <div className="stepper-controls">
        <button
          type="button"
          className="stepper-btn"
          onClick={dec}
          disabled={valueMs <= minMs}
          aria-label="Decrease"
        >
          –
        </button>
        <span className="stepper-value">{formatDuration(valueMs)}</span>
        <button
          type="button"
          className="stepper-btn"
          onClick={inc}
          disabled={valueMs >= maxMs}
          aria-label="Increase"
        >
          +
        </button>
      </div>
    </div>
  )
}
