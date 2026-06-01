import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { AppProvider } from '../src/context/AppContext'
import { colors } from '../src/theme'

// Ports the web App.tsx: AppProvider wrapping the router. Screens live as files
// under app/ (the web BrowserRouter routes), with the header hidden because the
// app draws its own TopBar inside the Screen wrapper.
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            contentStyle: { backgroundColor: colors.bg },
          }}
        />
      </AppProvider>
    </SafeAreaProvider>
  )
}
