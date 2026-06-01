import { useEffect, useMemo, useState } from 'react'
import { Pressable, StyleSheet, Text, type TextStyle, View } from 'react-native'
import { Screen } from '../src/components/Screen'
import { useApp } from '../src/context/AppContext'
import { supabase } from '../src/lib/supabase'
import { colors, radius, softShadow } from '../src/theme'
import type { Activity, Break } from '../src/types'

type Period = 'today' | 'three_days' | 'week'

const PERIODS: { key: Period; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'three_days', label: '3 days' },
  { key: 'week', label: 'Week' },
]

const DAY_MS = 24 * 60 * 60 * 1000

function cutoffFor(period: Period, now: number): number {
  const d = new Date(now)
  d.setHours(0, 0, 0, 0)
  if (period === 'three_days') d.setDate(d.getDate() - 2)
  if (period === 'week') d.setDate(d.getDate() - 6)
  return d.getTime()
}

// Renders e.g. "1h 12m" with small superscript-ish units, ported from the
// web .time-part / .time-unit markup.
function RichTime({
  totalSeconds,
  numStyle,
  unitStyle,
}: {
  totalSeconds: number
  numStyle: TextStyle
  unitStyle: TextStyle
}) {
  const safe = Math.max(0, Math.round(totalSeconds))
  const hours = Math.floor(safe / 3600)
  const minutes = Math.floor((safe % 3600) / 60)
  const seconds = safe % 60
  const parts: { num: number; unit: string }[] = []
  if (hours > 0) parts.push({ num: hours, unit: 'h' })
  if (minutes > 0) parts.push({ num: minutes, unit: 'm' })
  if (seconds > 0 || parts.length === 0) parts.push({ num: seconds, unit: 's' })

  return (
    <View style={styles.richRow}>
      {parts.map((p, i) => (
        <View key={i} style={styles.richPart}>
          <Text style={numStyle}>{p.num}</Text>
          <Text style={unitStyle}>{p.unit}</Text>
        </View>
      ))}
    </View>
  )
}

function dayLabel(date: Date, now: number): string {
  const today = new Date(now)
  today.setHours(0, 0, 0, 0)
  const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const diff = Math.round((today.getTime() - dayStart.getTime()) / DAY_MS)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  if (diff < 7)
    return dayStart.toLocaleDateString(undefined, { weekday: 'long' })
  return dayStart.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

function timeLabel(date: Date): string {
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  })
}

function statusFor(b: Break): { label: string; tone: '' | 'helped' | 'not' | 'skipped' } {
  if (b.did_activity === false) return { label: 'Skipped', tone: 'skipped' }
  if (b.helped === true) return { label: 'Helped', tone: 'helped' }
  if (b.helped === false) return { label: "Didn't help", tone: 'not' }
  return { label: 'Done', tone: '' }
}

export default function Stats() {
  const { user, activities } = useApp()
  const [breaks, setBreaks] = useState<Break[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [period, setPeriod] = useState<Period>('today')
  const [now] = useState(() => Date.now())

  useEffect(() => {
    let ignore = false
    void (async () => {
      const { data, error: err } = await supabase
        .from('breaks')
        .select('*')
        .order('created_at', { ascending: false })
        .returns<Break[]>()
      if (ignore) return
      if (err) {
        setError(err.message)
        return
      }
      setBreaks(data ?? [])
    })()
    return () => {
      ignore = true
    }
  }, [])

  const filtered = useMemo(() => {
    if (!breaks) return []
    const cutoff = cutoffFor(period, now)
    return breaks.filter((b) => new Date(b.created_at).getTime() >= cutoff)
  }, [breaks, period, now])

  const summary = useMemo(() => {
    const totalBreaks = filtered.length
    const studySeconds = filtered.reduce((acc, b) => acc + (b.study_seconds ?? 0), 0)
    const breakSeconds = filtered.reduce((acc, b) => acc + (b.break_seconds ?? 0), 0)
    const didCount = filtered.filter((b) => b.did_activity === true).length
    const helpedCount = filtered.filter(
      (b) => b.did_activity === true && b.helped === true,
    ).length
    const effectiveness =
      didCount > 0 ? Math.round((helpedCount / didCount) * 100) : null
    return { totalBreaks, studySeconds, breakSeconds, effectiveness }
  }, [filtered])

  const grouped = useMemo(() => {
    const groups = new Map<string, Break[]>()
    for (const b of filtered) {
      const d = new Date(b.created_at)
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
      const arr = groups.get(key) ?? []
      arr.push(b)
      groups.set(key, arr)
    }
    return Array.from(groups.entries()).map(([key, items]) => {
      const parts = key.split('-').map(Number)
      const date = new Date(parts[0], parts[1], parts[2])
      return { key, label: dayLabel(date, now), breaks: items }
    })
  }, [filtered, now])

  const activityById = useMemo(() => {
    const m = new Map<number, Activity>()
    for (const a of activities) m.set(a.id, a)
    return m
  }, [activities])

  return (
    <Screen>
      <View style={styles.head}>
        <Text style={styles.eyebrow}>{user.name}&apos;s wins</Text>
        <Text style={styles.h1}>Your activity</Text>
      </View>

      <View style={styles.tabs}>
        {PERIODS.map((p) => {
          const active = period === p.key
          return (
            <Pressable
              key={p.key}
              onPress={() => setPeriod(p.key)}
              style={[styles.tab, active && styles.tabActive]}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>
                {p.label}
              </Text>
            </Pressable>
          )
        })}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.statHero}>
        <Text style={styles.statHeroLabel}>Studied</Text>
        <RichTime
          totalSeconds={summary.studySeconds}
          numStyle={styles.heroNum}
          unitStyle={styles.heroUnit}
        />
        <Text style={styles.statHeroSub}>
          {summary.totalBreaks === 0
            ? 'No breaks yet.'
            : `${summary.totalBreaks} break${summary.totalBreaks !== 1 ? 's' : ''} taken`}
        </Text>
      </View>

      <View style={styles.statCards}>
        <View style={styles.statCard}>
          <Text style={styles.statCardLabel}>Break time</Text>
          <RichTime
            totalSeconds={summary.breakSeconds}
            numStyle={styles.cardNum}
            unitStyle={styles.cardUnit}
          />
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statCardLabel}>Effective</Text>
          {summary.effectiveness === null ? (
            <Text style={styles.cardNum}>—</Text>
          ) : (
            <View style={styles.richPart}>
              <Text style={styles.cardNum}>{summary.effectiveness}</Text>
              <Text style={styles.cardUnit}>%</Text>
            </View>
          )}
        </View>
      </View>

      {breaks === null && !error ? (
        <Text style={styles.empty}>Loading…</Text>
      ) : grouped.length === 0 ? (
        <Text style={styles.empty}>Take a break to see it here.</Text>
      ) : (
        <View style={styles.list}>
          {grouped.map((group) => (
            <View style={styles.day} key={group.key}>
              <Text style={styles.dayLabel}>{group.label}</Text>
              <View style={styles.dayCard}>
                {group.breaks.map((b, idx) => {
                  const activity =
                    b.suggested_activity_id !== null
                      ? (activityById.get(b.suggested_activity_id) ?? null)
                      : null
                  const status = statusFor(b)
                  const d = new Date(b.created_at)
                  return (
                    <View
                      key={b.id}
                      style={[
                        styles.row,
                        idx < group.breaks.length - 1 && styles.rowDivider,
                      ]}
                    >
                      <Text style={styles.rowEmoji}>{activity?.icon ?? '✨'}</Text>
                      <View style={styles.rowMain}>
                        <Text style={styles.rowName} numberOfLines={1}>
                          {activity?.name ?? 'Break'}
                        </Text>
                        <Text
                          style={[
                            styles.rowStatus,
                            status.tone === 'helped' && styles.statusHelped,
                            status.tone === 'skipped' && styles.statusSkipped,
                          ]}
                        >
                          {status.label}
                        </Text>
                      </View>
                      <Text style={styles.rowTime}>{timeLabel(d)}</Text>
                    </View>
                  )
                })}
              </View>
            </View>
          ))}
        </View>
      )}
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

  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: radius.pill,
  },
  tabActive: { backgroundColor: colors.accent },
  tabText: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
  tabTextActive: { color: colors.text },

  richRow: { flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 },
  richPart: { flexDirection: 'row', alignItems: 'baseline' },

  statHero: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 18,
    gap: 6,
    ...softShadow,
  },
  statHeroLabel: {
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.accentStrong,
    fontWeight: '700',
  },
  heroNum: {
    fontSize: 48,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: -1,
    fontVariant: ['tabular-nums'],
  },
  heroUnit: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.textMuted,
    marginLeft: 2,
  },
  statHeroSub: { fontSize: 14, color: colors.textMuted, marginTop: 2 },

  statCards: { flexDirection: 'row', gap: 10 },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 12,
    gap: 6,
  },
  statCardLabel: {
    fontSize: 12,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '600',
  },
  cardNum: {
    fontSize: 26,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: -0.4,
    fontVariant: ['tabular-nums'],
  },
  cardUnit: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textMuted,
    marginLeft: 2,
  },

  empty: { textAlign: 'center', color: colors.textMuted, fontSize: 15, paddingVertical: 24 },

  list: { gap: 18 },
  day: { gap: 8 },
  dayLabel: {
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.textMuted,
    fontWeight: '700',
    paddingLeft: 4,
  },
  dayCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: colors.border },
  rowEmoji: { fontSize: 24, width: 32, textAlign: 'center' },
  rowMain: { flex: 1, gap: 2 },
  rowName: { fontSize: 15, fontWeight: '600', color: colors.text },
  rowStatus: { fontSize: 13, color: colors.textMuted },
  statusHelped: { color: colors.goodText },
  statusSkipped: { color: colors.textMuted, fontStyle: 'italic' },
  rowTime: { fontSize: 14, color: colors.textMuted, fontWeight: '500' },
  error: { color: colors.error, textAlign: 'center', fontSize: 14 },
})
