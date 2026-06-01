import { usePathname, useRouter } from 'expo-router'
import { Pressable, StyleSheet, View } from 'react-native'
import Svg, { Circle, Path } from 'react-native-svg'
import { colors } from '../theme'

function ProfileIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Circle
        cx={12}
        cy={8}
        r={4}
        stroke={colors.text}
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4 21c0-4.418 3.582-8 8-8s8 3.582 8 8"
        stroke={colors.text}
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

function BackIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 18l-6-6 6-6"
        stroke={colors.text}
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export function TopBar() {
  const pathname = usePathname()
  const router = useRouter()
  const onStats = pathname === '/stats'

  return (
    <View style={styles.bar}>
      <Pressable
        onPress={() => (onStats ? router.replace('/') : router.push('/stats'))}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={onStats ? 'Home' : 'Your activity'}
        style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
      >
        {onStats ? <BackIcon /> : <ProfileIcon />}
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    minHeight: 40,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { backgroundColor: 'rgba(0,0,0,0.05)' },
})
