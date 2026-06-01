import Slider from '@react-native-community/slider'
import { StyleSheet, Text, View } from 'react-native'
import type { StrainState } from '../types'
import { colors, radius } from '../theme'

type Props = {
  label: string
  value: StrainState | undefined
  onChange: (v: StrainState) => void
}

const STATES: readonly StrainState[] = ['good', 'meh', 'sore'] as const
const EMOJI: Record<StrainState, string> = { good: '🙂', meh: '😐', sore: '😣' }
const LABEL: Record<StrainState, string> = { good: 'Good', meh: 'Meh', sore: 'Sore' }
const TINT: Record<StrainState, string> = {
  good: colors.goodStrong,
  meh: colors.mehStrong,
  sore: colors.soreStrong,
}
const TEXT: Record<StrainState, string> = {
  good: colors.goodText,
  meh: colors.mehText,
  sore: colors.soreText,
}

export function StrainSlider({ label, value, onChange }: Props) {
  const numeric = value !== undefined ? STATES.indexOf(value) : 1
  const tint = value !== undefined ? TINT[value] : colors.accent

  return (
    <View
      style={[
        styles.card,
        { borderColor: value !== undefined ? TINT[value] : colors.border },
      ]}
    >
      <View style={styles.head}>
        <Text style={styles.label}>{label}</Text>
        <Text
          style={[
            styles.state,
            { color: value !== undefined ? TEXT[value] : colors.textMuted },
          ]}
        >
          {value !== undefined ? `${EMOJI[value]}  ${LABEL[value]}` : 'Slide to set'}
        </Text>
      </View>

      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={2}
        step={1}
        value={numeric}
        onValueChange={(n) => onChange(STATES[n])}
        minimumTrackTintColor={tint}
        maximumTrackTintColor={colors.border}
        thumbTintColor={tint}
      />

      <View style={styles.ticks}>
        <Text style={[styles.tick, styles.tickLeft]}>Good</Text>
        <Text style={[styles.tick, styles.tickCenter]}>Meh</Text>
        <Text style={[styles.tick, styles.tickRight]}>Sore</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    gap: 6,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderRadius: radius.md,
  },
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: colors.text,
  },
  state: { fontSize: 13, fontWeight: '600' },
  slider: { width: '100%', height: 36 },
  ticks: { flexDirection: 'row' },
  tick: {
    flex: 1,
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  tickLeft: { textAlign: 'left' },
  tickCenter: { textAlign: 'center' },
  tickRight: { textAlign: 'right' },
})
