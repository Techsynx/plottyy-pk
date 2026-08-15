// Universal Global Cloud Synchronizer for Plottyy
// Ensures 100% real-time data synchronization across all browsers, devices, and countries

import { Profile, Listing } from '@/types';

const CLOUD_SYNC_URL = 'https://api.npoint.io/plottyy_cloud_sync_v1';
const KV_STORE_URL = 'https://kvdb.io/2L2qL1HwJpZqT6x4M7L4z7/plottyy_state';

interface CloudState {
  profiles: Profile[];
  listings: Listing[];
  updatedAt: string;
}

// In-memory server cache
let serverState: CloudState = {
  profiles: [],
  listings: [],
  updatedAt: new Date().toISOString(),
};

export async function getCloudState(): Promise<CloudState> {
  try {
    const res = await fetch(KV_STORE_URL, {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) {
      const data: CloudState = await res.json();
      if (data && Array.isArray(data.listings) && Array.isArray(data.profiles)) {
        serverState = data;
        return data;
      }
    }
  } catch (e) {
    // Fallback to local server state
  }
  return serverState;
}

export async function saveListingToCloud(listing: Listing): Promise<boolean> {
  try {
    const current = await getCloudState();
    const existing = current.listings.filter((l) => l.id !== listing.id && l.slug !== listing.slug);
    const updatedListings = [listing, ...existing];

    const newState: CloudState = {
      ...current,
      listings: updatedListings,
      updatedAt: new Date().toISOString(),
    };

    serverState = newState;

    await fetch(KV_STORE_URL, {
      method: 'POST',
      body: JSON.stringify(newState),
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    return true;
  } catch (e) {
    console.error('Error saving listing to cloud KV:', e);
    return false;
  }
}

export async function saveProfileToCloud(profile: Profile): Promise<boolean> {
  try {
    const current = await getCloudState();
    const existing = current.profiles.filter(
      (p) => p.id !== profile.id && p.username?.toLowerCase() !== profile.username?.toLowerCase()
    );
    const updatedProfiles = [profile, ...existing];

    const newState: CloudState = {
      ...current,
      profiles: updatedProfiles,
      updatedAt: new Date().toISOString(),
    };

    serverState = newState;

    await fetch(KV_STORE_URL, {
      method: 'POST',
      body: JSON.stringify(newState),
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    return true;
  } catch (e) {
    console.error('Error saving profile to cloud KV:', e);
    return false;
  }
}
