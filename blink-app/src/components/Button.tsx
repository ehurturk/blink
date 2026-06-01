import { Pressable, StyleSheet, Text, type ViewStyle } from 'react-native'
import { colors, radius, softShadow } from '../theme'

type Props = {
  label: string
  onPress: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
  style?: ViewStyle
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
  style,
}: Props) {
  const isPrimary = variant === 'primary'
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        isPrimary ? styles.primary : styles.secondary,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.text, isPrimary ? styles.primaryText : styles.secondaryText]}>
        {label}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    minHeight: 56,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  primary: {
    backgroundColor: colors.accent,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    ...softShadow,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.accentStrong,
  },
  pressed: { transform: [{ scale: 0.99 }], opacity: 0.92 },
  disabled: { opacity: 0.5 },
  text: { fontWeight: '600', fontSize: 16, letterSpacing: -0.1 },
  primaryText: { color: colors.text },
  secondaryText: { color: colors.accentStrong },
})
