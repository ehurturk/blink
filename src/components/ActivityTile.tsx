import type { Activity } from '../types'
import { gradientFor } from '../lib/visual'

type Props = {
  activity: Activity
  onSelect: (a: Activity) => void
}

export function ActivityTile({ activity, onSelect }: Props) {
  return (
    <button
      type="button"
      className="activity-tile"
      style={{ backgroundImage: gradientFor(activity.name) }}
      onClick={() => onSelect(activity)}
    >
      <span className="tile-emoji" aria-hidden="true">
        {activity.icon ?? '✨'}
      </span>
      <span className="tile-name">{activity.name}</span>
    </button>
  )
}
