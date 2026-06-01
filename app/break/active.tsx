import { LinearGradient } from 'expo-linear-gradient'
import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button } from '../../src/components/Button'
import { Screen } from '../../src/components/Screen'
import { useApp } from '../../src/context/AppContext'
import { gradientColorsFor } from '../../src/lib/visual'
import { colors, radius, softShadow } from '../../src/theme'

function formatMmSs(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds))
  const mm = Math.floor(s / 60)
  const ss = s % 60
  return `${mm}:${ss.toString().padStart(2, '0')}`
}

export default function BreakActive() {
  const router = useRouter()
  const { chosenActivity, breakStartedAt, plannedBreakMs } = useApp()
  const [elapsedMs, setElapsedMs] = useState(0)

  useEffect(() => {
    const startedAt = breakStartedAt
    if (startedAt === null) return
    function update() {
      setElapsedMs(Date.now() - startedAt!)
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [breakStartedAt])

  // Only redirect when THIS screen is focused — otherwise the still-mounted
  // screen would hijack navigation when chosenActivity is reset on completion.
  useFocusEffect(
    useCallback(() => {
      if (!chosenActivity) router.replace('/break/pick')
    }, [chosenActivity, router]),
  )

  if (!chosenActivity) return null

  const activity = chosenActivity
  const elapsedSeconds = Math.floor(elapsedMs / 1000)
  const suggestedSeconds = Math.floor(plannedBreakMs / 1000)
  const targetReached = elapsedSeconds >= suggestedSeconds

  return (
    <Screen>
      <View style={styles.head}>
        <Text style={styles.eyebrow}>On break</Text>
        <Text style={styles.h1}>{activity.name}</Text>
      </View>

      <LinearGradient
        colors={gradientColorsFor(activity.name)}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.visual}
      >
        <Text style={styles.visualEmoji}>{activity.icon ?? '✨'}</Text>
      </LinearGradient>

      {activity.description ? (
        <Text style={styles.desc}>{activity.description}</Text>
      ) : null}

      <View style={styles.badges}>
        {activity.helps_eyes && <Badge label="For your eyes" />}
        {activity.helps_neck && <Badge label="For your neck" />}
        {activity.helps_mind && <Badge label="For your mind" />}
        {activity.screen_free && <Badge label="Screen-free" accent />}
      </View>

      <View style={styles.timer}>
        <Text style={styles.timerValue}>{formatMmSs(elapsedSeconds)}</Text>
        <Text style={styles.timerSub}>
          {targetReached
            ? 'past the suggested time — take your time'
            : `suggested ${formatMmSs(suggestedSeconds)}`}
        </Text>
      </View>

      <Button label="I'm back" onPress={() => router.push('/break/outcome')} />
    </Screen>
  )
}

function Badge({ label, accent }: { label: string; accent?: boolean }) {
  return (
    <View style={[styles.badge, accent && styles.badgeAccent]}>
      <Text style={[styles.badgeText, accent && styles.badgeTextAccent]}>
        {label}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  head: { gap: 4 },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.accentStrong,
    fontWeight: '700',
  },
  h1: { fontSize: 27, fontWeight: '600', color: colors.text, letterSpacing: -0.3 },
  visual: {
    height: 240,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...softShadow,
  },
  visualEmoji: { fontSize: 92, lineHeight: 100 },
  desc: {
    fontSize: 16,
    color: colors.textMuted,
    lineHeight: 25,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeAccent: { backgroundColor: colors.accentSoft, borderColor: 'transparent' },
  badgeText: { fontSize: 13, fontWeight: '600', color: colors.text },
  badgeTextAccent: { color: colors.accentStrong },
  timer: { alignItems: 'center', gap: 4, paddingVertical: 4 },
  timerValue: {
    fontSize: 38,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: -0.5,
    fontVariant: ['tabular-nums'],
  },
  timerSub: { fontSize: 13, color: colors.textMuted },
})
