import { MetadataRoute } from 'next';
import { LISTINGS_DATA, PROFILES_DATA, CITIES_DATA, LOCATIONS_DATA } from '@/lib/data/mock-db';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://plottyy.pk';

  // 1. Static core routes
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

  // 2. High-Intent Category & City Discovery Routes
  const categoryRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/listings?type=plot&purpose=sale`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/listings?type=house&purpose=sale`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/listings?type=commercial&purpose=sale`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/listings?purpose=rent`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  // 3. City-specific routes
  const cityRoutes: MetadataRoute.Sitemap = CITIES_DATA.map((city) => ({
    url: `${baseUrl}/listings?city=${encodeURIComponent(city.name)}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  // 4. Popular Society routes
  const societyRoutes: MetadataRoute.Sitemap = LOCATIONS_DATA.filter((l) => l.is_popular).map(
    (loc) => ({
      url: `${baseUrl}/listings?query=${encodeURIComponent(loc.name)}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    })
  );

  // 5. Individual Verified Property Listings
  const listingRoutes: MetadataRoute.Sitemap = LISTINGS_DATA.map((listing) => ({
    url: `${baseUrl}/listings/${listing.slug}`,
    lastModified: new Date(listing.updated_at || listing.created_at),
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  // 6. Registered Agency & Agent Handles
  const agentRoutes: MetadataRoute.Sitemap = PROFILES_DATA.map((agent) => ({
    url: `${baseUrl}/agents/${agent.username || agent.id}`,
    lastModified: new Date(agent.created_at),
    changeFrequency: 'weekly',
    priority: 0.75,
  }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...cityRoutes,
    ...societyRoutes,
    ...listingRoutes,
    ...agentRoutes,
  ];
}
