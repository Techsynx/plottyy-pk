'use server';

import { PROFILES_DATA } from '@/lib/data/mock-db';

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

  const collision = PROFILES_DATA.find(
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
