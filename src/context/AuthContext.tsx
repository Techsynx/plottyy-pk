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
  switchAgentAccount: (profileId: string) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Default to Malik Tariq Mehmood for initial preview, stored in localStorage
  const [user, setUser] = useState<Profile | null>(PROFILES_DATA[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    try {
      const savedUserId = localStorage.getItem('plottyy_active_user_id');
      if (savedUserId) {
        const found = PROFILES_DATA.find((p) => p.id === savedUserId);
        if (found) {
          setUser(found);
        }
      }
    } catch (e) {
      // Ignore in SSR
    }
  }, []);

  const loginWithGoogle = async () => {
    setIsLoading(true);
    // Simulate instantaneous Google OAuth handshake
    await new Promise((r) => setTimeout(r, 600));
    const defaultUser = PROFILES_DATA[0];
    setUser(defaultUser);
    localStorage.setItem('plottyy_active_user_id', defaultUser.id);
    setIsLoading(false);
    setIsAuthModalOpen(false);
  };

  const loginWithEmail = async (email: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const matched = PROFILES_DATA.find((p) => p.email?.toLowerCase() === email.toLowerCase()) || PROFILES_DATA[0];
    setUser(matched);
    localStorage.setItem('plottyy_active_user_id', matched.id);
    setIsLoading(false);
    setIsAuthModalOpen(false);
  };

  const registerAgent = async (agentData: Partial<Profile>) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const rawUsername = (agentData.username || agentData.agency_name || agentData.full_name || 'agency')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9_-]/g, '');
    const username = `${rawUsername}${PROFILES_DATA.some(p => p.username === rawUsername) ? `_${Math.floor(10 + Math.random() * 90)}` : ''}`;

    const newProfile: Profile = {
      id: `a0000000-0000-0000-0000-${Date.now().toString().slice(-12)}`,
      username: username || `agency_${Date.now().toString().slice(-4)}`,
      full_name: agentData.full_name || 'Verified Realtor',
      email: agentData.email || 'agent@plottyy.pk',
      phone_number: agentData.phone_number || '+92 300 1234567',
      phone_verified_at: new Date().toISOString(),
      avatar_url: agentData.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      cover_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600',
      role: 'lister',
      agency_name: agentData.agency_name || 'Prime Real Estate Agency',
      license_number: agentData.license_number || `REG-PK-${Math.floor(1000 + Math.random() * 9000)}`,
      office_address: agentData.office_address || 'Main Boulevard Commercial, Pakistan',
      experience_years: agentData.experience_years || 5,
      operating_areas: agentData.operating_areas || ['DHA Phase 6', 'Bahria Town'],
      website: agentData.website || null,
      is_verified: true,
      rating: 5.0,
      reviews_count: 1,
      bio: agentData.bio || 'Professional real estate agency dedicated to transparent, verified property transactions.',
      created_at: new Date().toISOString(),
    };

    PROFILES_DATA.push(newProfile);
    setUser(newProfile);
    localStorage.setItem('plottyy_active_user_id', newProfile.id);
    setIsLoading(false);
    setIsAuthModalOpen(false);
  };

  const updateProfile = async (updatedData: Partial<Profile>) => {
    if (!user) return;
    const updated = { ...user, ...updatedData };
    setUser(updated);
    const index = PROFILES_DATA.findIndex((p) => p.id === user.id);
    if (index !== -1) {
      PROFILES_DATA[index] = updated;
    }
  };

  const switchAgentAccount = (profileId: string) => {
    const found = PROFILES_DATA.find((p) => p.id === profileId);
    if (found) {
      setUser(found);
      localStorage.setItem('plottyy_active_user_id', found.id);
    }
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
        switchAgentAccount,
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
