import type { Activity } from '../types'
import { gradientFor } from '../lib/visual'

type Props = {
  activity: Activity
  rationale: string
  onSelect: (a: Activity) => void
}

export function ActivityHero({ activity, rationale, onSelect }: Props) {
  return (
    <button
      type="button"
      className="activity-hero"
      onClick={() => onSelect(activity)}
    >
      <div
        className="hero-image"
        style={{ backgroundImage: gradientFor(activity.name) }}
      >
        <span className="hero-emoji" aria-hidden="true">
          {activity.icon ?? '✨'}
        </span>
      </div>
      <div className="hero-meta">
        <span className="hero-eyebrow">{rationale}</span>
        <span className="hero-name">{activity.name}</span>
        {activity.description && (
          <span className="hero-desc">{activity.description}</span>
        )}
        <span className="hero-cta">Take this break →</span>
      </div>
    </button>
  )
}
