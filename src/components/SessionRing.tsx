import { type ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'
import Svg, { Circle, G } from 'react-native-svg'
import { colors } from '../theme'

type Props = {
  /** 0 to 1 */
  progress?: number
  /** Second arc (e.g. break portion) drawn after `progress`. */
  secondaryProgress?: number
  size?: number
  stroke?: number
  children?: ReactNode
}

export function SessionRing({
  progress = 0,
  secondaryProgress = 0,
  size = 240,
  stroke = 14,
  children,
}: Props) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const clamp = (n: number) => Math.max(0, Math.min(1, n))
  const p = clamp(progress)
  const q = clamp(secondaryProgress)
  const cx = size / 2

  return (
    <View style={[styles.ring, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle
          cx={cx}
          cy={cx}
          r={r}
          fill="none"
          stroke={colors.border}
          strokeWidth={stroke}
        />
        <G rotation={-90} origin={`${cx}, ${cx}`}>
          {q > 0 && (
            <Circle
              cx={cx}
              cy={cx}
              r={r}
              fill="none"
              stroke={colors.mehStrong}
              strokeWidth={stroke}
              strokeDasharray={[c, c]}
              strokeDashoffset={c * (1 - p - q)}
              strokeLinecap="butt"
              opacity={0.85}
            />
          )}
          {p > 0 && (
            <Circle
              cx={cx}
              cy={cx}
              r={r}
              fill="none"
              stroke={colors.accent}
              strokeWidth={stroke}
              strokeDasharray={[c, c]}
              strokeDashoffset={c * (1 - p)}
              strokeLinecap="round"
            />
          )}
        </G>
      </Svg>
      <View style={styles.center}>{children}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  ring: { alignItems: 'center', justifyContent: 'center' },
  center: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
})
