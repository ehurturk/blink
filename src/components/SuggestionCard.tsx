import type { Activity } from '../types'

type Props = {
  activity: Activity
  onBack: () => void
}

export function SuggestionCard({ activity, onBack }: Props) {
  return (
    <div className="suggestion">
      <header className="page-head">
        <p className="eyebrow">Try this</p>
        <h1>{activity.name}</h1>
      </header>

      {activity.icon && (
        <div className="suggestion-icon" aria-hidden="true">
          {activity.icon}
        </div>
      )}

      {activity.description && (
        <p className="suggestion-desc">{activity.description}</p>
      )}

      <button type="button" className="btn-secondary" onClick={onBack}>
        New check-in
      </button>
    </div>
  )
}
