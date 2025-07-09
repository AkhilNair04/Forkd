import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.SUPABASE_URL;
const supabaseAnonKey = Constants.expoConfig?.extra?.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase env variables are missing");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Get current user profile from both auth and user_profiles table
export async function getCurrentUserProfile() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
      return null;
    }

    return {
      ...user,
      profile: profile || {
        full_name: '',
        bio: '',
        location: '',
        user_type: 'customer',
        avatar_url: null,
        phone: ''
      }
    };
  } catch (error) {
    console.error('Error in getCurrentUserProfile:', error);
    return null;
  }
}

// Update user profile
export async function updateUserProfile(profileData) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: user.id,
        ...profileData,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { data: null, error };
  }
}

// Upload avatar image to Supabase Storage
export async function uploadAvatar(imageUri) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    let blob;
    let fileExt = 'jpg';
    
    // Handle data URL (from web file input)
    if (imageUri.startsWith('data:')) {
      // Extract file type from data URL
      const mimeType = imageUri.split(';')[0].split(':')[1];
      fileExt = mimeType.split('/')[1] || 'jpg';
      
      // Convert data URL to blob
      const response = await fetch(imageUri);
      blob = await response.blob();
    } else {
      // Handle regular file URI (from mobile)
      const response = await fetch(imageUri);
      blob = await response.blob();
      fileExt = imageUri.split('.').pop()?.toLowerCase() || 'jpg';
    }
    
    // Create unique filename
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;

    // Upload to Supabase Storage (without nested avatars folder)
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, blob, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(data.path);

    return { data: publicUrl, error: null };
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return { data: null, error };
  }
}

// Update user avatar URL in profile
export async function updateUserAvatar(avatarUrl) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: user.id,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating avatar:', error);
    return { data: null, error };
  }
}

