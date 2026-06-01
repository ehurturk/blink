import { BlurView } from 'expo-blur'
import { Modal, Pressable, StyleSheet, Text } from 'react-native'
import { colors } from '../theme'

type Props = {
  active: boolean
  onReveal: () => void
}

// The "Hide" feature: a full-screen blur the user taps to dismiss, so the
// screen gets out of the way mid-session. Ports the web backdrop-filter blur.
export function HiddenOverlay({ active, onReveal }: Props) {
  return (
    <Modal visible={active} transparent animationType="fade" onRequestClose={onReveal}>
      <Pressable
        style={styles.fill}
        onPress={onReveal}
        accessibilityRole="button"
        accessibilityLabel="Reveal screen"
      >
        <BlurView intensity={60} tint="light" style={StyleSheet.absoluteFill} />
        <Text style={styles.hint}>Tap to reveal</Text>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // Fallback tint so the screen is still obscured where blur is unsupported.
    backgroundColor: 'rgba(250,236,208,0.55)',
  },
  hint: { fontSize: 14, color: colors.textMuted, letterSpacing: 0.7 },
})
