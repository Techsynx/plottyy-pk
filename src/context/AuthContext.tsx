'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile } from '@/types';
import { PROFILES_DATA } from '@/lib/data/mock-db';
import { createClient, SUPABASE_ANON_KEY } from '@/lib/supabase/client';

interface AuthContextType {
  user: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string) => Promise<void>;
  registerAgent: (agentData: Partial<Profile>) => Promise<void>;
  updateProfile: (updatedData: Partial<Profile>) => Promise<void>;
  logout: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    // 1. Check for ?code= from Google OAuth redirect and exchange for real session
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      if (code && SUPABASE_ANON_KEY) {
        setIsLoading(true);
        supabase.auth.exchangeCodeForSession(code).then(({ data, error }) => {
          setIsLoading(false);
          if (data?.session?.user) {
            const authUser = data.session.user;
            const meta = authUser.user_metadata || {};
            const cleanHandle = (authUser.email?.split('@')[0] || `agent_${authUser.id.slice(0, 5)}`).replace(/[^a-z0-9_-]/g, '').toLowerCase();

            const realProfile: Profile = {
              id: authUser.id,
              username: meta.username || cleanHandle,
              full_name: meta.full_name || meta.name || authUser.email?.split('@')[0] || 'Verified Agent',
              email: authUser.email || '',
              phone_number: meta.phone_number || '+92 300 0000000',
              phone_verified_at: new Date().toISOString(),
              avatar_url: meta.avatar_url || meta.picture || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
              cover_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600',
              role: 'lister',
              agency_name: meta.agency_name || `${meta.full_name || cleanHandle} Real Estate`,
              license_number: meta.license_number || `REG-${authUser.id.slice(0, 6).toUpperCase()}`,
              office_address: meta.office_address || 'Pakistan',
              experience_years: 5,
              operating_areas: ['DHA Defence', 'Bahria Town'],
              website: null,
              is_verified: true,
              rating: 5.0,
              reviews_count: 1,
              bio: meta.bio || 'Verified real estate consultant on plottyy.',
              social_links: {},
              created_at: authUser.created_at || new Date().toISOString(),
            };

            setUser(realProfile);
            localStorage.setItem('plottyy_active_user_id', realProfile.id);
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        });
      }
    }

    // 2. Listen to real Supabase Auth sessions (Google OAuth / Email)
    const initAuth = async () => {
      try {
        if (SUPABASE_ANON_KEY) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const authUser = session.user;
            const meta = authUser.user_metadata || {};
            const cleanHandle = (authUser.email?.split('@')[0] || `agent_${authUser.id.slice(0, 5)}`).replace(/[^a-z0-9_-]/g, '').toLowerCase();

            const realProfile: Profile = {
              id: authUser.id,
              username: meta.username || cleanHandle,
              full_name: meta.full_name || meta.name || authUser.email?.split('@')[0] || 'Verified Agent',
              email: authUser.email || '',
              phone_number: meta.phone_number || '+92 300 0000000',
              phone_verified_at: new Date().toISOString(),
              avatar_url: meta.avatar_url || meta.picture || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
              cover_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600',
              role: 'lister',
              agency_name: meta.agency_name || `${meta.full_name || cleanHandle} Real Estate`,
              license_number: meta.license_number || `REG-${authUser.id.slice(0, 6).toUpperCase()}`,
              office_address: meta.office_address || 'Pakistan',
              experience_years: 5,
              operating_areas: ['DHA Defence', 'Bahria Town'],
              website: null,
              is_verified: true,
              rating: 5.0,
              reviews_count: 1,
              bio: meta.bio || 'Verified real estate consultant on plottyy.',
              social_links: {},
              created_at: authUser.created_at || new Date().toISOString(),
            };

            setUser(realProfile);
            return;
          }
        }
      } catch (e) {
        console.error('Supabase getSession error:', e);
      }

      // 2. Check local client storage
      try {
        const savedUserId = localStorage.getItem('plottyy_active_user_id');
        if (savedUserId) {
          // Clear legacy mock demo users
          if (savedUserId.startsWith('a0000000-0000-0000-0000-00000000000')) {
            localStorage.removeItem('plottyy_active_user_id');
            setUser(null);
            return;
          }

          const registered = localStorage.getItem('plottyy_registered_profiles');
          if (registered) {
            const list: Profile[] = JSON.parse(registered);
            const found = list.find((p) => p.id === savedUserId);
            if (found) {
              setUser(found);
              return;
            }
          }
        }
      } catch (e) {}
    };

    initAuth();

    // Subscribe to auth state changes
    if (SUPABASE_ANON_KEY) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const authUser = session.user;
          const meta = authUser.user_metadata || {};
          const cleanHandle = (authUser.email?.split('@')[0] || `agent_${authUser.id.slice(0, 5)}`).replace(/[^a-z0-9_-]/g, '').toLowerCase();

          const realProfile: Profile = {
            id: authUser.id,
            username: meta.username || cleanHandle,
            full_name: meta.full_name || meta.name || authUser.email?.split('@')[0] || 'Verified Agent',
            email: authUser.email || '',
            phone_number: meta.phone_number || '+92 300 0000000',
            phone_verified_at: new Date().toISOString(),
            avatar_url: meta.avatar_url || meta.picture || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
            cover_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600',
            role: 'lister',
            agency_name: meta.agency_name || `${meta.full_name || cleanHandle} Real Estate`,
            license_number: meta.license_number || `REG-${authUser.id.slice(0, 6).toUpperCase()}`,
            office_address: meta.office_address || 'Pakistan',
            experience_years: 5,
            operating_areas: ['DHA Defence', 'Bahria Town'],
            website: null,
            is_verified: true,
            rating: 5.0,
            reviews_count: 1,
            bio: meta.bio || 'Verified real estate consultant on plottyy.',
            social_links: {},
            created_at: authUser.created_at || new Date().toISOString(),
          };

          setUser(realProfile);
          localStorage.setItem('plottyy_active_user_id', realProfile.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem('plottyy_active_user_id');
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const loginWithGoogle = async () => {
    setIsLoading(true);

    if (SUPABASE_ANON_KEY) {
      // Real Google OAuth Redirect via Supabase
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      });

      if (error) {
        console.error('Google OAuth Error:', error);
        alert(`Google OAuth Error: ${error.message}`);
        setIsLoading(false);
      }
      return;
    }

    // Fallback: If SUPABASE_ANON_KEY environment variable is not added to Vercel yet
    alert('Please add NEXT_PUBLIC_SUPABASE_ANON_KEY to your Vercel Environment Variables to enable live Google account redirection.');
    setIsLoading(false);
  };

  const loginWithEmail = async (email: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    const cleanEmail = email.toLowerCase().trim();
    let matched: Profile | null = null;

    try {
      const registered = localStorage.getItem('plottyy_registered_profiles');
      if (registered) {
        const list: Profile[] = JSON.parse(registered);
        matched = list.find((p) => p.email?.toLowerCase() === cleanEmail) || null;
      }
    } catch (e) {}

    if (!matched) {
      const usernameHandle = cleanEmail.split('@')[0].replace(/[^a-z0-9_-]/g, '') || `agent_${Date.now().toString().slice(-4)}`;
      matched = {
        id: `usr_${Date.now()}`,
        username: usernameHandle,
        full_name: usernameHandle.charAt(0).toUpperCase() + usernameHandle.slice(1),
        email: cleanEmail,
        phone_number: '+92 300 0000000',
        phone_verified_at: new Date().toISOString(),
        avatar_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
        cover_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600',
        role: 'lister',
        agency_name: `${usernameHandle.toUpperCase()} Real Estate`,
        license_number: `REG-${Math.floor(1000 + Math.random() * 9000)}`,
        office_address: 'Pakistan',
        experience_years: 3,
        operating_areas: ['DHA Defence', 'Bahria Town'],
        website: null,
        is_verified: true,
        rating: 5.0,
        reviews_count: 1,
        bio: 'Verified real estate agency on plottyy.',
        social_links: {},
        created_at: new Date().toISOString(),
      };

      try {
        const existing = localStorage.getItem('plottyy_registered_profiles');
        const list = existing ? JSON.parse(existing) : [];
        list.push(matched);
        localStorage.setItem('plottyy_registered_profiles', JSON.stringify(list));
      } catch (e) {}

      try {
        const { saveAgentProfile } = await import('@/lib/actions/agents');
        await saveAgentProfile(matched);
      } catch (e) {}
    }

    setUser(matched);
    localStorage.setItem('plottyy_active_user_id', matched.id);
    setIsLoading(false);
    setIsAuthModalOpen(false);
  };

  const registerAgent = async (agentData: Partial<Profile>) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const rawUsername = (agentData.username || agentData.agency_name || agentData.full_name || 'agency')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9_-]/g, '');
    const username = `${rawUsername}${PROFILES_DATA.some(p => p.username === rawUsername) ? `_${Math.floor(10 + Math.random() * 90)}` : ''}`;

    const newProfile: Profile = {
      id: `usr_${Date.now()}`,
      username: username || `agency_${Date.now().toString().slice(-4)}`,
      full_name: agentData.full_name || 'Verified Realtor',
      email: agentData.email || 'agent@plottyy.pk',
      phone_number: agentData.phone_number || '+92 300 1234567',
      phone_verified_at: new Date().toISOString(),
      avatar_url: agentData.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
      cover_url: agentData.cover_url || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600',
      role: 'lister',
      agency_name: agentData.agency_name || 'Prime Real Estate Agency',
      license_number: agentData.license_number || `REG-PK-${Math.floor(1000 + Math.random() * 9000)}`,
      office_address: agentData.office_address || 'Main Boulevard Commercial, Pakistan',
      experience_years: agentData.experience_years || 5,
      operating_areas: agentData.operating_areas || ['DHA Defence', 'Bahria Town'],
      website: agentData.website || null,
      is_verified: true,
      rating: 5.0,
      reviews_count: 1,
      bio: agentData.bio || 'Professional real estate agency dedicated to transparent, verified property transactions.',
      social_links: agentData.social_links || {},
      created_at: new Date().toISOString(),
    };

    PROFILES_DATA.push(newProfile);
    setUser(newProfile);

    // Save to local storage registry
    try {
      localStorage.setItem('plottyy_active_user_id', newProfile.id);
      const existing = localStorage.getItem('plottyy_registered_profiles');
      const list = existing ? JSON.parse(existing) : [];
      list.push(newProfile);
      localStorage.setItem('plottyy_registered_profiles', JSON.stringify(list));
    } catch (e) {}

    // Persist to server action
    try {
      const { saveAgentProfile } = await import('@/lib/actions/agents');
      await saveAgentProfile(newProfile);
    } catch (e) {}

    setIsLoading(false);
    setIsAuthModalOpen(false);
  };

  const updateProfile = async (updatedData: Partial<Profile>) => {
    if (!user) return;
    const updated = { ...user, ...updatedData };
    setUser(updated);
    
    const index = PROFILES_DATA.findIndex((p) => p.id === user.id || p.username === user.username);
    if (index !== -1) {
      PROFILES_DATA[index] = updated;
    } else {
      PROFILES_DATA.push(updated);
    }

    try {
      const existing = localStorage.getItem('plottyy_registered_profiles');
      const list: Profile[] = existing ? JSON.parse(existing) : [];
      const idx = list.findIndex(p => p.id === user.id || p.username === user.username);
      if (idx !== -1) {
        list[idx] = updated;
      } else {
        list.push(updated);
      }
      localStorage.setItem('plottyy_registered_profiles', JSON.stringify(list));
    } catch (e) {}

    try {
      const { saveAgentProfile } = await import('@/lib/actions/agents');
      await saveAgentProfile(updated);
    } catch (e) {}
  };

  const logout = async () => {
    if (SUPABASE_ANON_KEY) {
      try {
        await supabase.auth.signOut();
      } catch (e) {}
    }
    setUser(null);
    localStorage.removeItem('plottyy_active_user_id');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        loginWithGoogle,
        loginWithEmail,
        registerAgent,
        updateProfile,
        logout,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
