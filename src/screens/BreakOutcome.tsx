import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

type Stage = 'did' | 'helped' | 'saving'

export function BreakOutcome() {
  const navigate = useNavigate()
  const { chosenActivity, recordBreak } = useApp()
  const [stage, setStage] = useState<Stage>('did')
  const [error, setError] = useState<string | null>(null)

  async function submit(did: boolean, helped: boolean | null) {
    setStage('saving')
    setError(null)
    try {
      await recordBreak({ did, helped })
      navigate('/stats', { replace: true })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
      setStage(did ? 'helped' : 'did')
    }
  }

  return (
    <div className="screen">
      <header className="page-head">
        <p className="eyebrow">Welcome back</p>
        <h1>
          {stage === 'helped'
            ? 'Did it help?'
            : 'Did you do it?'}
        </h1>
        {chosenActivity && stage === 'did' && (
          <p className="subtle">
            {chosenActivity.icon} {chosenActivity.name}
          </p>
        )}
      </header>

      {stage === 'did' && (
        <div className="choice-pair">
          <button
            type="button"
            className="choice-btn choice-yes"
            onClick={() => setStage('helped')}
          >
            Yes
          </button>
          <button
            type="button"
            className="choice-btn choice-no"
            onClick={() => void submit(false, null)}
          >
            Not this time
          </button>
        </div>
      )}

      {stage === 'helped' && (
        <div className="choice-pair">
          <button
            type="button"
            className="choice-btn choice-yes"
            onClick={() => void submit(true, true)}
          >
            Yes
          </button>
          <button
            type="button"
            className="choice-btn choice-no"
            onClick={() => void submit(true, false)}
          >
            Not really
          </button>
        </div>
      )}

      {stage === 'saving' && (
        <p className="subtle centered">Saving…</p>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  )
}
