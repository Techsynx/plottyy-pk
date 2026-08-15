import { MetadataRoute } from 'next';
import { LISTINGS_DATA, PROFILES_DATA } from '@/lib/data/mock-db';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://plotty.unicorn-realtors.com';

  // 1. Static core routes (Canonical URLs)
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
      priority: 0.9,
    },
    {
      url: `${baseUrl}/agents`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
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

  // 2. Individual Verified Property Listings
  const listingRoutes: MetadataRoute.Sitemap = LISTINGS_DATA.map((listing) => ({
    url: `${baseUrl}/listings/${listing.slug}`,
    lastModified: new Date(listing.updated_at || listing.created_at),
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  // 3. Registered Agency & Agent Handles
  const agentRoutes: MetadataRoute.Sitemap = PROFILES_DATA.map((agent) => ({
    url: `${baseUrl}/agents/${agent.username || agent.id}`,
    lastModified: new Date(agent.created_at),
    changeFrequency: 'weekly',
    priority: 0.75,
  }));

  return [
    ...staticRoutes,
    ...listingRoutes,
    ...agentRoutes,
  ];
}
