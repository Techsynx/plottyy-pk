import { MetadataRoute } from 'next';
import { LISTINGS_DATA, PROFILES_DATA, CITIES_DATA } from '@/lib/data/mock-db';
import { getCloudState } from '@/lib/cloud-sync';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://plotty.unicorn-realtors.com';

  // 1. Static Core Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/listings`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/agents`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/create`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // 2. City Hub Landing Pages (High Search Volume)
  const cityRoutes: MetadataRoute.Sitemap = CITIES_DATA.map((city) => ({
    url: `${baseUrl}/listings?city=${city.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  // 3. Property Category Pages
  const propertyCategories = ['plot', 'commercial', 'house', 'flat', 'agricultural'];
  const categoryRoutes: MetadataRoute.Sitemap = propertyCategories.map((type) => ({
    url: `${baseUrl}/listings?type=${type}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  // 4. Dynamic Cloud + Mock Listings
  const cloudState = await getCloudState().catch(() => ({ listings: [], profiles: [] }));
  const allListings = [...(cloudState.listings || []), ...LISTINGS_DATA];
  const seenListingSlugs = new Set<string>();
  const listingRoutes: MetadataRoute.Sitemap = [];

  for (const listing of allListings) {
    if (listing.slug && !seenListingSlugs.has(listing.slug)) {
      seenListingSlugs.add(listing.slug);
      listingRoutes.push({
        url: `${baseUrl}/listings/${listing.slug}`,
        lastModified: new Date(listing.updated_at || listing.created_at || new Date()),
        changeFrequency: 'daily',
        priority: 0.9,
      });
    }
  }

  // 5. Dynamic Cloud + Mock Agent Profiles
  const allProfiles = [...(cloudState.profiles || []), ...PROFILES_DATA];
  const seenHandles = new Set<string>();
  const agentRoutes: MetadataRoute.Sitemap = [];

  for (const profile of allProfiles) {
    const handle = profile.username || profile.id;
    if (handle && !seenHandles.has(handle.toLowerCase())) {
      seenHandles.add(handle.toLowerCase());
      agentRoutes.push({
        url: `${baseUrl}/agents/${handle}`,
        lastModified: new Date(profile.created_at || new Date()),
        changeFrequency: 'daily',
        priority: 0.85,
      });
    }
  }

  return [
    ...staticRoutes,
    ...cityRoutes,
    ...categoryRoutes,
    ...listingRoutes,
    ...agentRoutes,
  ];
}
