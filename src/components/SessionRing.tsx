import type { ReactNode } from 'react'

type Props = {
  /** 0 to 1 */
  progress?: number
  /** Second arc (e.g. break portion) drawn after `progress`. */
  secondaryProgress?: number
  size?: number
  stroke?: number
  children?: ReactNode
}

export function SessionRing({
  progress = 0,
  secondaryProgress = 0,
  size = 240,
  stroke = 14,
  children,
}: Props) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const clamp = (n: number) => Math.max(0, Math.min(1, n))
  const p = clamp(progress)
  const q = clamp(secondaryProgress)
  const cx = size / 2

  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden="true"
      >
        <circle
          cx={cx}
          cy={cx}
          r={r}
          fill="none"
          stroke="var(--border)"
          strokeWidth={stroke}
        />
        {q > 0 && (
          <circle
            cx={cx}
            cy={cx}
            r={r}
            fill="none"
            stroke="var(--meh-strong)"
            strokeWidth={stroke}
            strokeDasharray={c}
            strokeDashoffset={c * (1 - p - q)}
            strokeLinecap="butt"
            transform={`rotate(-90 ${cx} ${cx})`}
            opacity={0.85}
          />
        )}
        {p > 0 && (
          <circle
            cx={cx}
            cy={cx}
            r={r}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={stroke}
            strokeDasharray={c}
            strokeDashoffset={c * (1 - p)}
            strokeLinecap="round"
            transform={`rotate(-90 ${cx} ${cx})`}
          />
        )}
      </svg>
      <div className="ring-center">{children}</div>
    </div>
  )
}
