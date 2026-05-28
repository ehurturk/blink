import type { Activity } from '../types'

type Props = {
  activity: Activity
  onSelect?: (a: Activity) => void
  selected?: boolean
}

export function ActivityCard({ activity, onSelect, selected }: Props) {
  return (
    <button
      type="button"
      className={`activity-card${selected ? ' is-selected' : ''}`}
      onClick={() => onSelect?.(activity)}
    >
      <span className="activity-icon" aria-hidden="true">
        {activity.icon ?? '✨'}
      </span>
      <span className="activity-name">{activity.name}</span>
    </button>
  )
}
