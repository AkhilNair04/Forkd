import Constants from 'expo-constants'
import { createClient } from '@supabase/supabase-js'


const {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
} = Constants.manifest!.extra as {
  SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
