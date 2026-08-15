import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { getFilteredListings } from '@/lib/actions/listings';
import { FilterState, PropertyPurpose, PropertyType } from '@/types';
import { ListingFilters } from '@/components/listings/ListingFilters';
import { ListingGrid } from '@/components/listings/ListingGrid';
import { ListingsSearchHeader } from '@/components/listings/ListingsSearchHeader';

interface ListingsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://plotty.unicorn-realtors.com';

export async function generateMetadata({ searchParams }: ListingsPageProps): Promise<Metadata> {
  const resolved = await searchParams;
  const city = typeof resolved.city === 'string' ? resolved.city : '';
  const type = typeof resolved.type === 'string' ? resolved.type : 'plot';
  const query = typeof resolved.query === 'string' ? resolved.query : '';
  const purpose = resolved.purpose === 'rent' ? 'for Rent' : 'for Sale';

  const typeLabel = type === 'plot' ? 'Plots' : type === 'commercial' ? 'Commercial Land' : type === 'house' ? 'Houses' : 'Properties';
  const cityLabel = city ? `in ${city.charAt(0).toUpperCase() + city.slice(1)}` : 'in Pakistan';

  const title = query
    ? `"${query}" — ${typeLabel} ${purpose} ${cityLabel} | plottyy Plot Finder`
    : `${typeLabel} ${purpose} ${cityLabel} — 5 Marla, 10 Marla & 1 Kanal | plottyy`;

  const description = `Find verified ${typeLabel.toLowerCase()} ${purpose} ${cityLabel} on Plottyy by Unicorn Realtors. Compare prices in Lakh and Crore, verify GPS plot locations, and chat directly with authorized listers on WhatsApp.`;

  return {
    title,
    description,
    keywords: [
      `plots ${cityLabel}`,
      `plot finder ${city}`,
      `${typeLabel} ${cityLabel}`,
      `buy plot in ${city || 'pakistan'}`,
      `dha ${city || 'lahore'} plots`,
      `bahria town ${city || 'islamabad'} plots`,
      `unicorn realtors`,
      `exhuzaifa`,
      `plottyy`,
    ],
    alternates: {
      canonical: `${SITE_URL}/listings${city ? `?city=${city}` : ''}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/listings`,
    },
  };
}

export default async function ListingsPage({ searchParams }: ListingsPageProps) {
  const resolvedParams = await searchParams;

  const filters: FilterState = {
    city: typeof resolvedParams.city === 'string' ? resolvedParams.city : undefined,
    locationId: typeof resolvedParams.locationId === 'string' ? Number(resolvedParams.locationId) : undefined,
    purpose: typeof resolvedParams.purpose === 'string' ? (resolvedParams.purpose as PropertyPurpose) : undefined,
    type: typeof resolvedParams.type === 'string' ? (resolvedParams.type as PropertyType) : undefined,
    subtype: typeof resolvedParams.subtype === 'string' ? resolvedParams.subtype : undefined,
    minPrice: typeof resolvedParams.minPrice === 'string' ? Number(resolvedParams.minPrice) : undefined,
    maxPrice: typeof resolvedParams.maxPrice === 'string' ? Number(resolvedParams.maxPrice) : undefined,
    minSize: typeof resolvedParams.minSize === 'string' ? Number(resolvedParams.minSize) : undefined,
    maxSize: typeof resolvedParams.maxSize === 'string' ? Number(resolvedParams.maxSize) : undefined,
    sizeUnit: typeof resolvedParams.sizeUnit === 'string' ? (resolvedParams.sizeUnit as any) : undefined,
    bedrooms: typeof resolvedParams.bedrooms === 'string' ? resolvedParams.bedrooms : undefined,
    verifiedOnly: resolvedParams.verifiedOnly === 'true',
    sortBy: typeof resolvedParams.sortBy === 'string' ? (resolvedParams.sortBy as any) : 'newest',
    query: typeof resolvedParams.query === 'string' ? resolvedParams.query : undefined,
  };

  const { listings, total } = await getFilteredListings(filters);

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Search Bar & Filter Indicators */}
        <Suspense fallback={<div className="h-16 bg-white rounded-xl animate-pulse"></div>}>
          <ListingsSearchHeader total={total} filters={filters} />
        </Suspense>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Filter Sidebar (4 Cols) */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-20">
            <Suspense fallback={<div className="h-96 bg-white rounded-2xl animate-pulse"></div>}>
              <ListingFilters />
            </Suspense>
          </aside>

          {/* Listings Results Grid (8-9 Cols) */}
          <main className="lg:col-span-9">
            <Suspense fallback={<div className="h-96 bg-white rounded-2xl animate-pulse"></div>}>
              <ListingGrid listings={listings} total={total} />
            </Suspense>
          </main>

        </div>

      </div>
    </div>
  );
}
