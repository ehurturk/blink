import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { supabase } from '../lib/supabase'
import { mockUser } from '../mock/user'
import type {
  Activity,
  MockUser,
  SessionStrainFlags,
  StrainCheckIn,
  StrainDimension,
} from '../types'

type BreakOutcome = { did: boolean; helped: boolean | null }

type AppContextValue = {
  user: MockUser
  activities: Activity[]
  activitiesError: string | null
  plannedStudyMs: number
  setPlannedStudy: (ms: number) => void
  strainFlags: SessionStrainFlags
  toggleStrainFlag: (dim: 'eyes' | 'neck') => void
  checkIn: StrainCheckIn | null
  setCheckIn: (c: StrainCheckIn) => void
  chosenActivity: Activity | null
  setChosenActivity: (a: Activity) => void
  beginSession: () => void
  recordBreak: (outcome: BreakOutcome) => Promise<void>
  resetFlow: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

const DEFAULT_STUDY_MS = 25 * 60 * 1000

export function AppProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [activitiesError, setActivitiesError] = useState<string | null>(null)
  const [plannedStudyMs, setPlannedStudyMs] = useState(DEFAULT_STUDY_MS)
  const [strainFlags, setStrainFlags] = useState<SessionStrainFlags>({
    eyes: false,
    neck: false,
  })
  const [checkIn, setCheckIn] = useState<StrainCheckIn | null>(null)
  const [chosenActivity, setChosenActivity] = useState<Activity | null>(null)

  useEffect(() => {
    let ignore = false
    void (async () => {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .returns<Activity[]>()
      if (ignore) return
      if (error) {
        setActivitiesError(error.message)
        return
      }
      setActivities(data ?? [])
    })()
    return () => {
      ignore = true
    }
  }, [])

  const toggleStrainFlag = useCallback((dim: 'eyes' | 'neck') => {
    setStrainFlags((f) => ({ ...f, [dim]: !f[dim] }))
  }, [])

  const resetFlow = useCallback(() => {
    setStrainFlags({ eyes: false, neck: false })
    setCheckIn(null)
    setChosenActivity(null)
  }, [])

  const beginSession = useCallback(() => {
    resetFlow()
  }, [resetFlow])

  const recordBreak = useCallback(
    async ({ did, helped }: BreakOutcome) => {
      if (!checkIn) throw new Error('No strain check-in recorded')
      const { error } = await supabase.from('breaks').insert({
        eyes_state: checkIn.eyes,
        neck_state: checkIn.neck,
        mind_state: checkIn.mind,
        suggested_activity_id: chosenActivity?.id ?? null,
        did_activity: did,
        helped: did ? helped : null,
      })
      if (error) throw error
      resetFlow()
    },
    [checkIn, chosenActivity, resetFlow],
  )

  const value = useMemo<AppContextValue>(
    () => ({
      user: mockUser,
      activities,
      activitiesError,
      plannedStudyMs,
      setPlannedStudy: setPlannedStudyMs,
      strainFlags,
      toggleStrainFlag,
      checkIn,
      setCheckIn,
      chosenActivity,
      setChosenActivity,
      beginSession,
      recordBreak,
      resetFlow,
    }),
    [
      activities,
      activitiesError,
      plannedStudyMs,
      strainFlags,
      toggleStrainFlag,
      checkIn,
      chosenActivity,
      beginSession,
      recordBreak,
      resetFlow,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}

// eslint-disable-next-line react-refresh/only-export-components
export function strainFlagsToCheckIn(
  flags: SessionStrainFlags,
): Partial<Record<StrainDimension, 'sore'>> {
  const out: Partial<Record<StrainDimension, 'sore'>> = {}
  if (flags.eyes) out.eyes = 'sore'
  if (flags.neck) out.neck = 'sore'
  return out
}
