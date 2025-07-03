import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.SUPABASE_URL;
const supabaseAnonKey = Constants.expoConfig?.extra?.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase env variables are missing");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getCurrentUserProfile() {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.warn("❌ User not found:", userError?.message);
      return null;
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.warn("❌ Error fetching profile:", error.message);
      return null;
    }

    return { ...user, ...profile };
  } catch (err) {
    console.warn("❌ Unexpected error:", err.message);
    return null;
  }
}
import 'dotenv/config';

export default {
  expo: {
    extra: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    },
  },
};
