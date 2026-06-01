import { type ReactNode } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '../theme'
import { TopBar } from './TopBar'

type Props = {
  children: ReactNode
  /** When false, content fills the frame without scrolling (e.g. the session screen). */
  scroll?: boolean
}

// Ports the web AppShell: a centred, phone-width frame with the TopBar pinned
// above the screen content.
export function Screen({ children, scroll = true }: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.frame}>
        <TopBar />
        {scroll ? (
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.flex, styles.content]}>{children}</View>
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  frame: {
    flex: 1,
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    paddingHorizontal: 20,
  },
  flex: { flex: 1 },
  content: { paddingTop: 6, paddingBottom: 36, gap: 26 },
})
