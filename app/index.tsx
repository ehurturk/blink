import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button } from '../src/components/Button'
import { DurationStepper } from '../src/components/DurationStepper'
import { Screen } from '../src/components/Screen'
import { SessionRing } from '../src/components/SessionRing'
import { useApp } from '../src/context/AppContext'
import { formatDuration } from '../src/lib/format'
import { colors } from '../src/theme'

const SUGGESTED_STUDY_MS = 25 * 60 * 1000
const MIN_STUDY_MS = 5 * 60 * 1000
const MAX_STUDY_MS = 120 * 60 * 1000

export default function Home() {
  const router = useRouter()
  const {
    user,
    plannedStudyMs,
    setPlannedStudy,
    beginSession,
    sessionStartedAt,
    studyElapsedMsAtBreak,
    checkIn,
    chosenActivity,
  } = useApp()

  // If a session is already in flight, send the user back to the live screen.
  // No new session can be started until the current one's break flow finishes.
  useEffect(() => {
    if (sessionStartedAt === null) return
    if (studyElapsedMsAtBreak === null) {
      router.replace('/session')
    } else if (chosenActivity !== null) {
      router.replace('/break/active')
    } else if (checkIn !== null) {
      router.replace('/break/pick')
    } else {
      router.replace('/break/check-in')
    }
  }, [sessionStartedAt, studyElapsedMsAtBreak, checkIn, chosenActivity, router])

  // Don't flash Home content during the redirect.
  if (sessionStartedAt !== null) return null

  // Visual cue on the ring: longer planned session = fuller ring.
  const progress = Math.max(
    0.08,
    Math.min(
      0.97,
      (plannedStudyMs - MIN_STUDY_MS) / (MAX_STUDY_MS - MIN_STUDY_MS),
    ),
  )

  function begin() {
    beginSession()
    router.push('/session')
  }

  function pickSuggested() {
    setPlannedStudy(SUGGESTED_STUDY_MS)
    beginSession()
    router.push('/session')
  }

  return (
    <Screen>
      <Text style={styles.welcome}>Welcome back, {user.name}</Text>

      <View style={styles.ringWrap}>
        <SessionRing progress={progress} stroke={18}>
          <Text style={styles.ringTotal}>{formatDuration(plannedStudyMs)}</Text>
          <Text style={styles.ringSub}>planned</Text>
        </SessionRing>
      </View>

      <DurationStepper
        label="Study time"
        valueMs={plannedStudyMs}
        onChange={setPlannedStudy}
      />

      <View style={styles.actions}>
        <Button label="Begin" onPress={begin} />
        <Button
          label="Suggested time (25 min)"
          variant="secondary"
          onPress={pickSuggested}
        />
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  welcome: {
    fontSize: 28,
    fontWeight: '600',
    letterSpacing: -0.5,
    color: colors.text,
    lineHeight: 33,
  },
  ringWrap: { alignItems: 'center', paddingVertical: 4 },
  ringTotal: { fontSize: 35, fontWeight: '600', color: colors.text },
  ringSub: { fontSize: 13, color: colors.textMuted, letterSpacing: 0.6 },
  actions: { gap: 12, marginTop: 4 },
})
