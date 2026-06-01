import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useMemo, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { ActivityHero } from '../../src/components/ActivityHero'
import { ActivityTile } from '../../src/components/ActivityTile'
import { Button } from '../../src/components/Button'
import { ConfirmModal } from '../../src/components/ConfirmModal'
import { Screen } from '../../src/components/Screen'
import { useApp } from '../../src/context/AppContext'
import { rationaleFor } from '../../src/lib/visual'
import { topActivities } from '../../src/lib/suggest'
import { colors } from '../../src/theme'
import type { Activity } from '../../src/types'

export default function BreakPick() {
  const router = useRouter()
  const { activities, user, checkIn, setChosenActivity, resetFlow } = useApp()
  const [showEndDayConfirm, setShowEndDayConfirm] = useState(false)

  const ranked = useMemo(() => {
    if (!checkIn || activities.length === 0) return []
    return topActivities(checkIn, activities, activities.length)
  }, [checkIn, activities])

  const hero: Activity | null = ranked[0] ?? null

  const others = useMemo(() => {
    if (!hero) return []
    const seen = new Set<number>([hero.id])
    const picks: Activity[] = []
    const push = (a: Activity | undefined) => {
      if (a && !seen.has(a.id)) {
        seen.add(a.id)
        picks.push(a)
      }
    }
    // Next-best recommendations first, then favorites, then "something new".
    ranked.slice(1, 4).forEach(push)
    user.favoriteActivityIds.forEach((id) =>
      push(activities.find((a) => a.id === id)),
    )
    user.somethingNewIds.forEach((id) =>
      push(activities.find((a) => a.id === id)),
    )
    return picks
  }, [hero, ranked, activities, user.favoriteActivityIds, user.somethingNewIds])

  // No check-in recorded (deep link / reload) → restart that step. Focus-gated
  // so this unmounted-but-stacked screen can't redirect once state is reset.
  useFocusEffect(
    useCallback(() => {
      if (!checkIn) router.replace('/break/check-in')
    }, [checkIn, router]),
  )

  function pick(a: Activity) {
    setChosenActivity(a)
    router.push('/break/active')
  }

  function endDay() {
    setShowEndDayConfirm(false)
    resetFlow()
    router.replace('/')
  }

  if (!checkIn) return null

  if (!hero) {
    return (
      <Screen>
        <View style={styles.head}>
          <Text style={styles.h1}>Finding ideas…</Text>
        </View>
      </Screen>
    )
  }

  return (
    <Screen>
      <View style={styles.head}>
        <Text style={styles.eyebrow}>Right now</Text>
        <Text style={styles.h1}>How about this?</Text>
      </View>

      <ActivityHero
        activity={hero}
        rationale={rationaleFor(checkIn, hero)}
        onSelect={pick}
      />

      {others.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Or try one of these</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.scroller}
            contentContainerStyle={styles.scrollerContent}
          >
            {others.map((a) => (
              <ActivityTile key={a.id} activity={a} onSelect={pick} />
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.actions}>
        <Button
          label="Stop for today"
          variant="secondary"
          onPress={() => setShowEndDayConfirm(true)}
        />
      </View>

      <ConfirmModal
        open={showEndDayConfirm}
        title="Stop working for today?"
        body="This will end the current flow and take you back home."
        primaryLabel="Stop for today"
        secondaryLabel="Keep going"
        onPrimary={endDay}
        onSecondary={() => setShowEndDayConfirm(false)}
        onDismiss={() => setShowEndDayConfirm(false)}
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
  section: { gap: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '600', color: colors.text },
  // Bleed the horizontal scroller to the frame edges.
  scroller: { marginHorizontal: -20 },
  scrollerContent: { gap: 12, paddingHorizontal: 20, paddingVertical: 4 },
  actions: { gap: 12, marginTop: 4 },
})
