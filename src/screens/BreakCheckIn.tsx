import { useNavigate } from 'react-router-dom'
import {
  strainFlagsToCheckIn,
  useApp,
} from '../context/AppContext'
import { StrainCheckIn } from '../components/StrainCheckIn'
import type { StrainCheckIn as StrainCheckInValue } from '../types'

export function BreakCheckIn() {
  const navigate = useNavigate()
  const { strainFlags, setCheckIn } = useApp()
  const initial = strainFlagsToCheckIn(strainFlags)

  function handleSubmit(strain: StrainCheckInValue) {
    setCheckIn(strain)
    navigate('/break/pick')
  }

  return (
    <div className="screen">
      <header className="page-head">
        <p className="eyebrow">Before your break</p>
        <h1>How are you feeling?</h1>
        <p className="subtle">A quick read on you. It shapes the suggestion.</p>
      </header>
      <StrainCheckIn
        onSubmit={handleSubmit}
        initial={initial}
        ctaLabel="See suggestions"
      />
    </div>
  )
}
