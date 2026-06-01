import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import { colors, radius } from '../theme'
import { Button } from './Button'

type Props = {
  open: boolean
  title: string
  body?: string
  primaryLabel: string
  secondaryLabel: string
  onPrimary: () => void
  onSecondary: () => void
  onDismiss: () => void
}

export function ConfirmModal({
  open,
  title,
  body,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
  onDismiss,
}: Props) {
  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <Pressable style={styles.backdrop} onPress={onDismiss}>
        {/* Stop taps inside the card from dismissing the modal. */}
        <Pressable style={styles.card} onPress={() => {}}>
          <Text style={styles.title}>{title}</Text>
          {body ? <Text style={styles.body}>{body}</Text> : null}
          <View style={styles.actions}>
            <Button label={primaryLabel} onPress={onPrimary} />
            <Button label={secondaryLabel} variant="secondary" onPress={onSecondary} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(40,32,20,0.42)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 22,
    gap: 10,
  },
  title: { fontSize: 20, fontWeight: '600', color: colors.text },
  body: { fontSize: 15, color: colors.textMuted, lineHeight: 21 },
  actions: { gap: 8, marginTop: 12 },
})
