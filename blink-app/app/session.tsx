import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Button } from '../src/components/Button'
import { ConfirmModal } from '../src/components/ConfirmModal'
import { HiddenOverlay } from '../src/components/HiddenOverlay'
import { Screen } from '../src/components/Screen'
import { SessionRing } from '../src/components/SessionRing'
import { useApp } from '../src/context/AppContext'
import { colors, radius, softShadow } from '../src/theme'

function formatMmSs(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000))
  const mm = Math.floor(s / 60)
  const ss = s % 60
  return `${mm}:${ss.toString().padStart(2, '0')}`
}

type PendingFlag = 'eyes' | 'neck' | null

const FLAG_COPY: Record<
  Exclude<PendingFlag, null>,
  { title: string; body: string }
> = {
  eyes: {
    title: 'Eyes feeling tired?',
    body: "We'll factor that into your next break suggestion.",
  },
  neck: {
    title: 'Neck feeling tight?',
    body: "We'll factor that into your next break suggestion.",
  },
}

export default function Session() {
  const router = useRouter()
  const {
    plannedStudyMs,
    strainFlags,
    toggleStrainFlag,
    sessionStartedAt,
    sessionPausedAt,
    sessionTotalPausedMs,
    togglePause,
    captureStudyElapsed,
  } = useApp()
  const [elapsedMs, setElapsedMs] = useState(0)
  const [hidden, setHidden] = useState(false)
  const [pendingFlag, setPendingFlag] = useState<PendingFlag>(null)
  const [pendingManualBreak, setPendingManualBreak] = useState(false)
  // Whether this screen is the focused (top) route. The break-flow screens stay
  // mounted beneath us in the stack, so we gate timers/redirects on focus to
  // stop a backgrounded session from advancing or navigating.
  const [focused, setFocused] = useState(true)

  const paused = sessionPausedAt !== null

  useFocusEffect(
    useCallback(() => {
      setFocused(true)
      return () => setFocused(false)
    }, []),
  )

  // If somebody lands here without an active session (deep link, reload), bail home.
  useEffect(() => {
    if (focused && sessionStartedAt === null) router.replace('/')
  }, [focused, sessionStartedAt, router])

  // Drive elapsedMs from persisted timestamps. Runs only while focused so study
  // time doesn't keep ticking once we've moved into the break flow.
  useEffect(() => {
    const startedAt = sessionStartedAt
    if (startedAt === null || !focused) return
    function update() {
      const now = Date.now()
      const pauseAdjustment =
        sessionTotalPausedMs +
        (sessionPausedAt !== null ? now - sessionPausedAt : 0)
      setElapsedMs(now - startedAt! - pauseAdjustment)
    }
    update()
    if (sessionPausedAt !== null) return
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [sessionStartedAt, sessionPausedAt, sessionTotalPausedMs, focused])

  // Auto-advance to break check-in when the timer is up (focused only).
  useEffect(() => {
    if (focused && sessionStartedAt !== null && elapsedMs >= plannedStudyMs) {
      captureStudyElapsed()
      router.replace('/break/check-in')
    }
  }, [focused, elapsedMs, plannedStudyMs, router, sessionStartedAt, captureStudyElapsed])

  if (sessionStartedAt === null) return null

  const progress = Math.min(1, elapsedMs / plannedStudyMs)

  function handleFlagTap(dim: 'eyes' | 'neck') {
    if (strainFlags[dim]) {
      toggleStrainFlag(dim) // already flagged → clear instantly
    } else {
      setPendingFlag(dim)
    }
  }

  function confirmBreak() {
    if (pendingFlag) toggleStrainFlag(pendingFlag)
    setPendingFlag(null)
    captureStudyElapsed()
    router.push('/break/check-in')
  }

  function confirmNote() {
    if (pendingFlag) toggleStrainFlag(pendingFlag)
    setPendingFlag(null)
  }

  function confirmManualBreak() {
    setPendingManualBreak(false)
    captureStudyElapsed()
    router.push('/break/check-in')
  }

  const copy = pendingFlag ? FLAG_COPY[pendingFlag] : null

  return (
    <Screen scroll={false}>
      <View style={styles.flags}>
        <Pressable
          onPress={() => handleFlagTap('eyes')}
          style={({ pressed }) => [
            styles.chip,
            strainFlags.eyes && styles.chipOn,
            pressed && styles.chipPressed,
          ]}
        >
          <Text style={[styles.chipText, strainFlags.eyes && styles.chipTextOn]}>
            My eyes hurt
          </Text>
        </Pressable>
        <Pressable
          onPress={() => handleFlagTap('neck')}
          style={({ pressed }) => [
            styles.chip,
            strainFlags.neck && styles.chipOn,
            pressed && styles.chipPressed,
          ]}
        >
          <Text style={[styles.chipText, strainFlags.neck && styles.chipTextOn]}>
            My neck hurts
          </Text>
        </Pressable>
      </View>

      <View style={styles.ringWrap}>
        <SessionRing progress={progress}>
          <Text style={styles.ringTotal}>{formatMmSs(elapsedMs)}</Text>
          <Text style={styles.ringSub}>of {formatMmSs(plannedStudyMs)}</Text>
        </SessionRing>
      </View>

      <View style={styles.sessionActions}>
        <Pressable
          onPress={() => setPendingManualBreak(true)}
          style={({ pressed }) => [
            styles.roundBtn,
            styles.roundWarn,
            pressed && styles.roundPressed,
          ]}
        >
          <Text style={styles.roundTextLight}>Break now</Text>
        </Pressable>
        <Pressable
          onPress={togglePause}
          style={({ pressed }) => [
            styles.roundBtn,
            styles.roundSoft,
            pressed && styles.roundPressed,
          ]}
        >
          <Text style={styles.roundText}>{paused ? 'Resume' : 'Pause'}</Text>
        </Pressable>
      </View>

      <Button label="Hide" onPress={() => setHidden(true)} style={styles.hideBtn} />

      <HiddenOverlay active={hidden} onReveal={() => setHidden(false)} />

      <ConfirmModal
        open={pendingFlag !== null}
        title={copy?.title ?? ''}
        body={copy?.body}
        primaryLabel="Break now"
        secondaryLabel="Just note it"
        onPrimary={confirmBreak}
        onSecondary={confirmNote}
        onDismiss={() => setPendingFlag(null)}
      />

      <ConfirmModal
        open={pendingManualBreak}
        title="Take a break?"
        body="We'll end this study session here and find you something to do."
        primaryLabel="Yes, break now"
        secondaryLabel="Keep studying"
        onPrimary={confirmManualBreak}
        onSecondary={() => setPendingManualBreak(false)}
        onDismiss={() => setPendingManualBreak(false)}
      />
    </Screen>
  )
}

const styles = StyleSheet.create({
  flags: { flexDirection: 'row', gap: 12, marginTop: 4 },
  chip: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    backgroundColor: colors.warmChip,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    alignItems: 'center',
  },
  chipOn: { backgroundColor: colors.warmChipStrong, borderColor: colors.warmChipStrong },
  chipPressed: { transform: [{ scale: 0.98 }] },
  chipText: { fontSize: 15, fontWeight: '600', color: colors.text },
  chipTextOn: { color: colors.white },
  ringWrap: { alignItems: 'center', marginVertical: 8 },
  ringTotal: {
    fontSize: 36,
    fontWeight: '600',
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  ringSub: {
    fontSize: 13,
    color: colors.textMuted,
    fontVariant: ['tabular-nums'],
  },
  sessionActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: 4,
  },
  roundBtn: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    ...softShadow,
  },
  roundPressed: { transform: [{ scale: 0.96 }] },
  roundWarn: { backgroundColor: colors.warn },
  roundSoft: { backgroundColor: colors.peach },
  roundText: { fontSize: 15, fontWeight: '600', color: colors.text },
  roundTextLight: { fontSize: 15, fontWeight: '600', color: colors.white },
  hideBtn: { marginTop: 'auto' },
})
