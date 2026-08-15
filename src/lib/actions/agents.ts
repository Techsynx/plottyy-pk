'use server';

import { PROFILES_DATA } from '@/lib/data/mock-db';
import { Profile } from '@/types';
import { getSupabaseServer } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface UsernameCheckResult {
  isAvailable: boolean;
  message: string;
  suggested?: string;
}

const RESERVED_USERNAMES = [
  'admin',
  'api',
  'app',
  'auth',
  'dashboard',
  'create',
  'listings',
  'agents',
  'plottyy',
  'login',
  'signup',
  'help',
  'support',
  'terms',
  'privacy',
  'contact',
];

const GLOBAL_REGISTERED_PROFILES: Profile[] = [...PROFILES_DATA];

export async function checkUsernameAvailability(
  rawUsername: string,
  currentUserId?: string
): Promise<UsernameCheckResult> {
  const username = rawUsername.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '');

  if (username.length < 3) {
    return {
      isAvailable: false,
      message: 'Username must be at least 3 characters.',
    };
  }

  if (username.length > 30) {
    return {
      isAvailable: false,
      message: 'Username cannot exceed 30 characters.',
    };
  }

  if (RESERVED_USERNAMES.includes(username)) {
    return {
      isAvailable: false,
      message: `@${username} is reserved for system use. Please pick another name.`,
    };
  }

  // Check Supabase database
  const supabase = getSupabaseServer();
  if (supabase) {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('id, username')
        .ilike('username', username)
        .maybeSingle();

      if (data && data.id !== currentUserId) {
        const suggested = `${username}_${Math.floor(10 + Math.random() * 90)}`;
        return {
          isAvailable: false,
          message: `@${username} is already claimed by another agency.`,
          suggested,
        };
      }
    } catch (e) {}
  }

  const collision = GLOBAL_REGISTERED_PROFILES.find(
    (p) => p.username?.toLowerCase() === username && p.id !== currentUserId
  );

  if (collision) {
    const suggested = `${username}_${Math.floor(10 + Math.random() * 90)}`;
    return {
      isAvailable: false,
      message: `@${username} is already claimed by another agency.`,
      suggested,
    };
  }

  return {
    isAvailable: true,
    message: `@${username} is available!`,
  };
}

export async function saveAgentProfile(profile: Profile): Promise<{ success: boolean; profile: Profile }> {
  // 1. Save to Supabase Cloud Postgres Database
  const supabase = getSupabaseServer();
  if (supabase) {
    try {
      await supabase.from('profiles').upsert({
        id: profile.id,
        username: profile.username?.toLowerCase(),
        full_name: profile.full_name,
        email: profile.email,
        phone_number: profile.phone_number,
        phone_verified_at: profile.phone_verified_at || new Date().toISOString(),
        avatar_url: profile.avatar_url,
        cover_url: profile.cover_url,
        role: profile.role || 'lister',
        agency_name: profile.agency_name,
        license_number: profile.license_number,
        office_address: profile.office_address,
        experience_years: profile.experience_years || 5,
        operating_areas: profile.operating_areas || ['DHA Defence', 'Bahria Town'],
        website: profile.website,
        is_verified: profile.is_verified ?? true,
        rating: profile.rating || 5.0,
        reviews_count: profile.reviews_count || 1,
        bio: profile.bio,
        social_links: profile.social_links || {},
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.error('Error saving profile to Supabase:', e);
    }
  }

  // 2. Update local in-memory registry
  const index = GLOBAL_REGISTERED_PROFILES.findIndex((p) => p.id === profile.id || p.username?.toLowerCase() === profile.username?.toLowerCase());
  if (index !== -1) {
    GLOBAL_REGISTERED_PROFILES[index] = { ...GLOBAL_REGISTERED_PROFILES[index], ...profile };
  } else {
    GLOBAL_REGISTERED_PROFILES.unshift(profile);
  }

  revalidatePath('/agents');
  revalidatePath(`/agents/${profile.username || profile.id}`);

  return { success: true, profile };
}

export async function getAgentProfileByHandleOrId(handleOrId: string): Promise<Profile | null> {
  const clean = handleOrId.toLowerCase().trim();

  // 1. Query Supabase Cloud Database first (available to any browser worldwide)
  const supabase = getSupabaseServer();
  if (supabase) {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .or(`username.ilike.${clean},id.eq.${handleOrId}`)
        .maybeSingle();

      if (data) {
        return {
          id: data.id,
          username: data.username,
          full_name: data.full_name,
          email: data.email || '',
          phone_number: data.phone_number || '',
          phone_verified_at: data.phone_verified_at,
          avatar_url: data.avatar_url,
          cover_url: data.cover_url,
          role: data.role || 'lister',
          agency_name: data.agency_name,
          license_number: data.license_number,
          office_address: data.office_address,
          experience_years: data.experience_years || 5,
          operating_areas: data.operating_areas || ['DHA Defence', 'Bahria Town'],
          website: data.website,
          is_verified: data.is_verified ?? true,
          rating: Number(data.rating) || 5.0,
          reviews_count: data.reviews_count || 1,
          bio: data.bio,
          social_links: data.social_links || {},
          created_at: data.created_at,
        };
      }
    } catch (e) {
      console.error('Error fetching profile from Supabase:', e);
    }
  }

  // 2. Fallback to in-memory / mock registry
  const found = GLOBAL_REGISTERED_PROFILES.find(
    (p) => p.username?.toLowerCase() === clean || p.id === handleOrId
  );
  return found || null;
}

export async function getAllAgents(): Promise<Profile[]> {
  const supabase = getSupabaseServer();
  if (supabase) {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        const dbProfiles: Profile[] = data.map((d) => ({
          id: d.id,
          username: d.username,
          full_name: d.full_name,
          email: d.email || '',
          phone_number: d.phone_number || '',
          phone_verified_at: d.phone_verified_at,
          avatar_url: d.avatar_url,
          cover_url: d.cover_url,
          role: d.role || 'lister',
          agency_name: d.agency_name,
          license_number: d.license_number,
          office_address: d.office_address,
          experience_years: d.experience_years || 5,
          operating_areas: d.operating_areas || ['DHA Defence', 'Bahria Town'],
          website: d.website,
          is_verified: d.is_verified ?? true,
          rating: Number(d.rating) || 5.0,
          reviews_count: d.reviews_count || 1,
          bio: d.bio,
          social_links: d.social_links || {},
          created_at: d.created_at,
        }));

        // Deduplicate with default list
        const existingHandles = new Set(dbProfiles.map((p) => (p.username || p.id).toLowerCase()));
        const remaining = PROFILES_DATA.filter((p) => !existingHandles.has((p.username || p.id).toLowerCase()));
        return [...dbProfiles, ...remaining];
      }
    } catch (e) {
      console.error('Error fetching all agents from Supabase:', e);
    }
  }

  return GLOBAL_REGISTERED_PROFILES;
}
