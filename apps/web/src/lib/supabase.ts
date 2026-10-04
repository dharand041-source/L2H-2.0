import { createClient } from './supabase/client';

export const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(
    url &&
    url !== 'https://placeholder.supabase.co' &&
    key &&
    key !== 'placeholder-anon-key'
  );
};

/**
 * Universal browser and client-side safe Supabase Client.
 */
export const supabase = createClient();
