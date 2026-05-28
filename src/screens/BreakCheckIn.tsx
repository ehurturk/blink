import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { strainFlagsToCheckIn, useApp } from '../context/AppContext'
import type { StrainCheckIn } from '../types'

export function BreakCheckIn() {
  const navigate = useNavigate()
  const { strainFlags, setCheckIn } = useApp()

  useEffect(() => {
    const partial = strainFlagsToCheckIn(strainFlags)
    const nextCheckIn: StrainCheckIn = {
      eyes: partial.eyes ?? 'good',
      neck: partial.neck ?? 'good',
      mind: 'good',
    }
    setCheckIn(nextCheckIn)
    navigate('/break/pick', { replace: true })
  }, [navigate, setCheckIn, strainFlags])

  return null
}
