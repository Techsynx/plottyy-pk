import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { getFilteredListings } from '@/lib/actions/listings';
import { FilterState, PropertyPurpose, PropertyType } from '@/types';
import { ListingFilters } from '@/components/listings/ListingFilters';
import { ListingGrid } from '@/components/listings/ListingGrid';
import { ListingsSearchHeader } from '@/components/listings/ListingsSearchHeader';

export const metadata: Metadata = {
  title: 'Search Verified Plots & Properties in Pakistan | plottyy',
  description: 'Browse thousands of verified plots, houses, flats, and commercial properties with live pricing in Lakh and Crore across Lahore, Islamabad, Karachi, and Rawalpindi.',
};

interface ListingsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
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
