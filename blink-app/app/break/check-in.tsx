import { useRouter } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'
import { Screen } from '../../src/components/Screen'
import { StrainCheckIn } from '../../src/components/StrainCheckIn'
import { strainFlagsToCheckIn, useApp } from '../../src/context/AppContext'
import { colors } from '../../src/theme'
import type { StrainCheckIn as StrainCheckInValue } from '../../src/types'

// The strain check-in core moment: rate eyes / neck / mind (good / meh / sore),
// then we match a break to it. Any flags raised mid-session pre-seed as "sore".
export default function BreakCheckIn() {
  const router = useRouter()
  const { strainFlags, setCheckIn } = useApp()
  const initial = strainFlagsToCheckIn(strainFlags)

  function handleSubmit(strain: StrainCheckInValue) {
    setCheckIn(strain)
    router.replace('/break/pick')
  }

  return (
    <Screen>
      <View style={styles.head}>
        <Text style={styles.eyebrow}>Before your break</Text>
        <Text style={styles.h1}>How are you feeling?</Text>
        <Text style={styles.sub}>Rate each — we&apos;ll match a break to it.</Text>
      </View>

      <StrainCheckIn
        initial={initial}
        onSubmit={handleSubmit}
        ctaLabel="Find me a break"
      />
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
  sub: { fontSize: 15, color: colors.textMuted, marginTop: 2 },
})
