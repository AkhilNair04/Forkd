import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://tzmgwmadzhtbyqykliah.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6bWd3bWFkemh0YnlxeWtsaWFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0NDQ0ODgsImV4cCI6MjA2NjAyMDQ4OH0.v1e8FRYjO1eKg7NARnrHmSYf2ojRAANK2nCxqrqWDe8'
);

export async function getCurrentUserProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) return null;
  return { ...user, ...data };
}
