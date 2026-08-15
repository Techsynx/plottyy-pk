import { createBrowserClient } from '@supabase/ssr';

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://emmhfhsxiwzwjsjwqzzh.supabase.co';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export function createClient() {
  if (!SUPABASE_ANON_KEY) {
    console.warn('NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured in environment variables.');
  }
  return createBrowserClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY || 'placeholder-anon-key'
  );
}
