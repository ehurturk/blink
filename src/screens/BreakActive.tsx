import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export function BreakActive() {
  const navigate = useNavigate()
  const { chosenActivity } = useApp()

  if (!chosenActivity) {
    navigate('/break/pick', { replace: true })
    return null
  }

  return (
    <div className="screen suggestion">
      <header className="page-head centered">
        <p className="eyebrow">On break</p>
        <h1>{chosenActivity.name}</h1>
      </header>

      {chosenActivity.icon && (
        <div className="suggestion-icon" aria-hidden="true">
          {chosenActivity.icon}
        </div>
      )}

      {chosenActivity.description && (
        <p className="suggestion-desc">{chosenActivity.description}</p>
      )}

      <p className="subtle centered">
        Step away from the screen. Come back when you're done.
      </p>

      <button
        type="button"
        className="btn-primary"
        onClick={() => navigate('/break/outcome')}
      >
        I'm back
      </button>
    </div>
  )
}
