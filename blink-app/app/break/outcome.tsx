import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Screen } from '../../src/components/Screen'
import { useApp } from '../../src/context/AppContext'
import { colors, radius } from '../../src/theme'

type Option = {
  key: 'helped' | 'didnt' | 'skipped'
  emoji: string
  label: string
  sub: string
  did: boolean
  helped: boolean | null
  tone: 'helped' | 'meh' | 'skipped'
}

const OPTIONS: Option[] = [
  {
    key: 'helped',
    emoji: '😊',
    label: 'Helped',
    sub: 'I feel a bit better',
    did: true,
    helped: true,
    tone: 'helped',
  },
  {
    key: 'didnt',
    emoji: '😐',
    label: "Didn't help",
    sub: 'About the same as before',
    did: true,
    helped: false,
    tone: 'meh',
  },
  {
    key: 'skipped',
    emoji: '⏭',
    label: 'Skipped it',
    sub: "Didn't get to it this time",
    did: false,
    helped: null,
    tone: 'skipped',
  },
]

export default function BreakOutcome() {
  const router = useRouter()
  const { chosenActivity, recordBreak } = useApp()
  const [submitting, setSubmitting] = useState<Option['key'] | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function submit(opt: Option) {
    setSubmitting(opt.key)
    setError(null)
    try {
      await recordBreak({ did: opt.did, helped: opt.helped })
      // Return to Home (the start-studying page), discarding the break-flow
      // stack so its now-reset screens unmount instead of lingering beneath.
      if (router.canDismiss()) {
        router.dismissAll()
      } else {
        router.replace('/')
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
      setSubmitting(null)
    }
  }

  return (
    <Screen>
      <View style={styles.head}>
        <Text style={styles.eyebrow}>After your break</Text>
        <Text style={styles.h1}>How did it go?</Text>
      </View>

      {chosenActivity && (
        <View style={styles.activity}>
          <Text style={styles.activityEmoji}>{chosenActivity.icon ?? '✨'}</Text>
          <Text style={styles.activityName}>{chosenActivity.name}</Text>
        </View>
      )}

      <View style={styles.options}>
        {OPTIONS.map((opt) => (
          <Pressable
            key={opt.key}
            disabled={submitting !== null}
            onPress={() => void submit(opt)}
            style={({ pressed }) => [
              styles.btn,
              opt.tone === 'helped' && styles.btnHelped,
              opt.tone === 'meh' && styles.btnMeh,
              opt.tone === 'skipped' && styles.btnSkipped,
              pressed && submitting === null && styles.btnPressed,
              submitting !== null && submitting !== opt.key && styles.btnDimmed,
            ]}
          >
            <Text style={styles.btnEmoji}>{opt.emoji}</Text>
            <View style={styles.btnText}>
              <Text style={styles.btnLabel}>
                {submitting === opt.key ? 'Saving…' : opt.label}
              </Text>
              <Text style={styles.btnSub}>{opt.sub}</Text>
            </View>
          </Pressable>
        ))}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
    </Screen>
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
  activity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
  },
  activityEmoji: { fontSize: 27 },
  activityName: { fontSize: 16, fontWeight: '600', color: colors.text },
  options: { gap: 10 },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
  },
  btnHelped: { borderColor: colors.goodStrong },
  btnMeh: { borderColor: colors.mehStrong },
  btnSkipped: { borderColor: colors.border, backgroundColor: 'transparent', opacity: 0.85 },
  btnPressed: { transform: [{ scale: 0.99 }] },
  btnDimmed: { opacity: 0.5 },
  btnEmoji: { fontSize: 32, width: 48, textAlign: 'center' },
  btnText: { flex: 1, gap: 2 },
  btnLabel: { fontSize: 16, fontWeight: '600', color: colors.text },
  btnSub: { fontSize: 13, color: colors.textMuted },
  error: { color: colors.error, textAlign: 'center', fontSize: 14 },
})
