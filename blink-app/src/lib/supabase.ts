// URL polyfill must load before supabase-js so fetch/URL work in React Native.
import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const url = process.env.EXPO_PUBLIC_SUPABASE_URL
const key = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY

if (!url || !key) {
  throw new Error(
    'Missing Supabase env. Set EXPO_PUBLIC_SUPABASE_URL and ' +
      'EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local',
  )
}

export const supabase = createClient(url, key, {
  auth: {
    // Persist the auth session in AsyncStorage (ready for when auth lands).
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    // No URL-based session detection on native (that's a web/OAuth-redirect concept).
    detectSessionInUrl: false,
  },
})
