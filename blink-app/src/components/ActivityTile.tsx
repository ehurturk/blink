import { LinearGradient } from 'expo-linear-gradient'
import { Pressable, StyleSheet, Text } from 'react-native'
import { gradientColorsFor } from '../lib/visual'
import { colors, softShadow } from '../theme'
import type { Activity } from '../types'

type Props = {
  activity: Activity
  onSelect: (a: Activity) => void
}

export function ActivityTile({ activity, onSelect }: Props) {
  return (
    <Pressable
      onPress={() => onSelect(activity)}
      style={({ pressed }) => [styles.wrap, pressed && styles.pressed]}
    >
      <LinearGradient
        colors={gradientColorsFor(activity.name)}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.tile}
      >
        <Text style={styles.emoji}>{activity.icon ?? '✨'}</Text>
        <Text style={styles.name}>{activity.name}</Text>
      </LinearGradient>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  wrap: { ...softShadow, borderRadius: 18 },
  pressed: { transform: [{ scale: 0.97 }] },
  tile: {
    width: 152,
    height: 170,
    borderRadius: 18,
    padding: 14,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  emoji: { fontSize: 32, lineHeight: 36 },
  name: { fontSize: 15, fontWeight: '600', color: colors.text },
})
