// constants/supabase.ts
import Constants from 'expo-constants';
import { createClient } from '@supabase/supabase-js';

interface AppConfig {
  extra: {
    SUPABASE_URL: string;
    SUPABASE_ANON_KEY: string;
  };
}

// Double-cast: first to unknown, then to our type
const appConfig = Constants.expoConfig as unknown as AppConfig;
const { SUPABASE_URL, SUPABASE_ANON_KEY } = appConfig.extra;

// Runtime guard
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Missing SUPABASE_URL or SUPABASE_ANON_KEY in app.config.js extra'
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
