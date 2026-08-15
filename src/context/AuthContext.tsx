'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile } from '@/types';
import { PROFILES_DATA } from '@/lib/data/mock-db';

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
  // Unauthenticated by default for first-time visitors
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    try {
      const savedUserId = localStorage.getItem('plottyy_active_user_id');
      if (savedUserId) {
        // Clear legacy mock demo users
        if (savedUserId.startsWith('a0000000-0000-0000-0000-00000000000')) {
          localStorage.removeItem('plottyy_active_user_id');
          setUser(null);
          return;
        }

        // Check local registered profiles
        const registered = localStorage.getItem('plottyy_registered_profiles');
        if (registered) {
          const list: Profile[] = JSON.parse(registered);
          const found = list.find((p) => p.id === savedUserId);
          if (found) {
            setUser(found);
            return;
          }
        }

        const foundInDb = PROFILES_DATA.find((p) => p.id === savedUserId);
        if (foundInDb && !foundInDb.id.startsWith('a0000000-0000-0000-0000-00000000000')) {
          setUser(foundInDb);
        }
      }
    } catch (e) {
      // Ignore in SSR
    }
  }, []);

  const loginWithGoogle = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    
    // Check if user has an existing registered profile
    let currentProfile: Profile | null = null;
    try {
      const registered = localStorage.getItem('plottyy_registered_profiles');
      if (registered) {
        const list: Profile[] = JSON.parse(registered);
        if (list.length > 0) {
          currentProfile = list[list.length - 1]; // Pick the latest user profile
        }
      }
    } catch (e) {}

    // If no existing profile, create a clean dynamic Google profile
    if (!currentProfile) {
      const timestamp = Date.now().toString().slice(-4);
      currentProfile = {
        id: `usr_${Date.now()}`,
        username: `google_user_${timestamp}`,
        full_name: 'Google Verified Realtor',
        email: 'user@gmail.com',
        phone_number: '+92 300 0000000',
        phone_verified_at: new Date().toISOString(),
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
        cover_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600',
        role: 'lister',
        agency_name: 'Verified Real Estate Brokerage',
        license_number: `REG-${timestamp}`,
        office_address: 'Pakistan',
        experience_years: 3,
        operating_areas: ['DHA Defence', 'Bahria Town'],
        website: null,
        is_verified: true,
        rating: 5.0,
        reviews_count: 1,
        bio: 'Professional verified real estate consultant.',
        social_links: {},
        created_at: new Date().toISOString(),
      };

      try {
        const list = [currentProfile];
        localStorage.setItem('plottyy_registered_profiles', JSON.stringify(list));
      } catch (e) {}

      try {
        const { saveAgentProfile } = await import('@/lib/actions/agents');
        await saveAgentProfile(currentProfile);
      } catch (e) {}
    }

    setUser(currentProfile);
    localStorage.setItem('plottyy_active_user_id', currentProfile.id);
    setIsLoading(false);
    setIsAuthModalOpen(false);
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

  const logout = () => {
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
