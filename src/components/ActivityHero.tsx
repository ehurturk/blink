import { LinearGradient } from 'expo-linear-gradient'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { gradientColorsFor } from '../lib/visual'
import { colors, radius, softShadow } from '../theme'
import type { Activity } from '../types'

type Props = {
  activity: Activity
  rationale: string
  onSelect: (a: Activity) => void
}

export function ActivityHero({ activity, rationale, onSelect }: Props) {
  return (
    <Pressable
      onPress={() => onSelect(activity)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <LinearGradient
        colors={gradientColorsFor(activity.name)}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.image}
      >
        <Text style={styles.emoji}>{activity.icon ?? '✨'}</Text>
      </LinearGradient>
      <View style={styles.meta}>
        <Text style={styles.eyebrow}>{rationale}</Text>
        <Text style={styles.name}>{activity.name}</Text>
        {activity.description ? (
          <Text style={styles.desc}>{activity.description}</Text>
        ) : null}
        <Text style={styles.cta}>Take this break →</Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    ...softShadow,
  },
  pressed: { transform: [{ scale: 0.99 }] },
  image: {
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 76, lineHeight: 84 },
  meta: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 20, gap: 4 },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.accentStrong,
    fontWeight: '700',
    marginBottom: 4,
  },
  name: {
    fontSize: 25,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: -0.3,
  },
  desc: { fontSize: 15, color: colors.textMuted, lineHeight: 21, marginTop: 4 },
  cta: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '700',
    color: colors.accentStrong,
  },
})
