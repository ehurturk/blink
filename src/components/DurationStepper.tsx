import { Pressable, StyleSheet, Text, View } from 'react-native'
import { formatDuration } from '../lib/format'
import { colors, radius } from '../theme'

type Props = {
  valueMs: number
  onChange: (ms: number) => void
  stepMs?: number
  minMs?: number
  maxMs?: number
  label: string
}

export function DurationStepper({
  valueMs,
  onChange,
  stepMs = 5 * 60 * 1000,
  minMs = 5 * 60 * 1000,
  maxMs = 120 * 60 * 1000,
  label,
}: Props) {
  const atMin = valueMs <= minMs
  const atMax = valueMs >= maxMs

  return (
    <View style={styles.stepper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.controls}>
        <Pressable
          disabled={atMin}
          onPress={() => onChange(Math.max(minMs, valueMs - stepMs))}
          accessibilityRole="button"
          accessibilityLabel="Decrease"
          style={({ pressed }) => [
            styles.btn,
            pressed && !atMin && styles.btnPressed,
            atMin && styles.btnDisabled,
          ]}
        >
          <Text style={[styles.btnText, atMin && styles.btnTextDisabled]}>–</Text>
        </Pressable>
        <Text style={styles.value}>{formatDuration(valueMs)}</Text>
        <Pressable
          disabled={atMax}
          onPress={() => onChange(Math.min(maxMs, valueMs + stepMs))}
          accessibilityRole="button"
          accessibilityLabel="Increase"
          style={({ pressed }) => [
            styles.btn,
            pressed && !atMax && styles.btnPressed,
            atMax && styles.btnDisabled,
          ]}
        >
          <Text style={[styles.btnText, atMax && styles.btnTextDisabled]}>+</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  stepper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    borderRadius: radius.md,
    paddingVertical: 12,
    paddingLeft: 20,
    paddingRight: 14,
  },
  label: { fontSize: 16, fontWeight: '500', color: colors.text },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  btn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPressed: { backgroundColor: colors.white, transform: [{ scale: 0.95 }] },
  btnDisabled: { borderColor: 'rgba(0,0,0,0.08)' },
  btnText: { fontSize: 20, fontWeight: '600', color: colors.text, lineHeight: 22 },
  btnTextDisabled: { color: colors.textMuted },
  value: {
    minWidth: 68,
    textAlign: 'center',
    fontWeight: '600',
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
})
