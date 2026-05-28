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
  // Persisted session timing
  sessionStartedAt: number | null
  sessionPausedAt: number | null
  sessionTotalPausedMs: number
  studyElapsedMsAtBreak: number | null
  breakStartedAt: number | null
  beginSession: () => void
  togglePause: () => void
  endSession: () => void
  captureStudyElapsed: () => void
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
  const [chosenActivity, setChosenActivityRaw] = useState<Activity | null>(
    null,
  )
  const [sessionStartedAt, setSessionStartedAt] = useState<number | null>(null)
  const [sessionPausedAt, setSessionPausedAt] = useState<number | null>(null)
  const [sessionTotalPausedMs, setSessionTotalPausedMs] = useState(0)
  const [studyElapsedMsAtBreak, setStudyElapsedMsAtBreak] = useState<
    number | null
  >(null)
  const [breakStartedAt, setBreakStartedAt] = useState<number | null>(null)

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
    setChosenActivityRaw(null)
  }, [])

  const endSession = useCallback(() => {
    setSessionStartedAt(null)
    setSessionPausedAt(null)
    setSessionTotalPausedMs(0)
    setStudyElapsedMsAtBreak(null)
    setBreakStartedAt(null)
  }, [])

  const beginSession = useCallback(() => {
    resetFlow()
    setSessionStartedAt(Date.now())
    setSessionPausedAt(null)
    setSessionTotalPausedMs(0)
    setStudyElapsedMsAtBreak(null)
    setBreakStartedAt(null)
  }, [resetFlow])

  const togglePause = useCallback(() => {
    // Read the current pause timestamp from closure rather than nesting a
    // setState inside another setState updater — Strict Mode double-invokes
    // updater functions, which would double-count the pause duration here.
    const currentPausedAt = sessionPausedAt
    if (currentPausedAt !== null) {
      setSessionTotalPausedMs((t) => t + (Date.now() - currentPausedAt))
      setSessionPausedAt(null)
    } else {
      setSessionPausedAt(Date.now())
    }
  }, [sessionPausedAt])

  const captureStudyElapsed = useCallback(() => {
    if (sessionStartedAt === null) return
    const now = Date.now()
    const pauseAdj =
      sessionTotalPausedMs +
      (sessionPausedAt !== null ? now - sessionPausedAt : 0)
    setStudyElapsedMsAtBreak(now - sessionStartedAt - pauseAdj)
  }, [sessionStartedAt, sessionPausedAt, sessionTotalPausedMs])

  const setChosenActivity = useCallback((a: Activity) => {
    setChosenActivityRaw(a)
    setBreakStartedAt(Date.now())
  }, [])

  const recordBreak = useCallback(
    async ({ did, helped }: BreakOutcome) => {
      if (!checkIn) throw new Error('No strain check-in recorded')
      const study_seconds =
        studyElapsedMsAtBreak !== null
          ? Math.max(0, Math.round(studyElapsedMsAtBreak / 1000))
          : 0
      const break_seconds =
        breakStartedAt !== null
          ? Math.max(0, Math.round((Date.now() - breakStartedAt) / 1000))
          : 0
      const { error } = await supabase.from('breaks').insert({
        eyes_state: checkIn.eyes,
        neck_state: checkIn.neck,
        mind_state: checkIn.mind,
        suggested_activity_id: chosenActivity?.id ?? null,
        did_activity: did,
        helped: did ? helped : null,
        study_seconds,
        break_seconds,
      })
      if (error) throw error
      resetFlow()
      endSession()
    },
    [
      checkIn,
      chosenActivity,
      resetFlow,
      endSession,
      studyElapsedMsAtBreak,
      breakStartedAt,
    ],
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
      sessionStartedAt,
      sessionPausedAt,
      sessionTotalPausedMs,
      studyElapsedMsAtBreak,
      breakStartedAt,
      beginSession,
      togglePause,
      endSession,
      captureStudyElapsed,
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
      setChosenActivity,
      sessionStartedAt,
      sessionPausedAt,
      sessionTotalPausedMs,
      studyElapsedMsAtBreak,
      breakStartedAt,
      beginSession,
      togglePause,
      endSession,
      captureStudyElapsed,
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
