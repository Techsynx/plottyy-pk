'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Listing } from '@/types';
import { ListingCard } from './ListingCard';
import { 
  ArrowUpDown, 
  SearchX, 
  RotateCcw, 
  PlusCircle,
  SlidersHorizontal,
  Sparkles,
  Building2
} from 'lucide-react';

interface ListingGridProps {
  listings: Listing[];
  total: number;
  isLoading?: boolean;
  onOpenMobileFilters?: () => void;
}

export function ListingGrid({
  listings: initialListings,
  total: initialTotal,
  isLoading = false,
  onOpenMobileFilters,
}: ListingGridProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [displayListings, setDisplayListings] = useState<Listing[]>(initialListings);
  const [totalCount, setTotalCount] = useState<number>(initialTotal);

  const currentSort = searchParams.get('sortBy') || 'newest';
  const currentCity = searchParams.get('city') || '';
  const currentType = searchParams.get('type') || '';

  // Synchronize client-created listings in real-time across the marketplace
  useEffect(() => {
    let combined = [...initialListings];

    try {
      const sources = ['plottyy_user_listings', 'plottyy_all_public_listings'];
      for (const key of sources) {
        const stored = localStorage.getItem(key);
        if (stored) {
          const customList: Listing[] = JSON.parse(stored);
          const existingIds = new Set(combined.map((l) => l.id));
          const toAdd = customList.filter((l) => !existingIds.has(l.id));
          combined = [...toAdd, ...combined];
        }
      }
    } catch (e) {}

    const filterListings = (list: Listing[]) => {
      return list.filter((item) => {
        if (currentCity && item.city?.name?.toLowerCase() !== currentCity.toLowerCase() && item.city?.slug?.toLowerCase() !== currentCity.toLowerCase()) {
          return false;
        }
        if (currentType && item.property_type !== currentType) {
          return false;
        }
        return true;
      });
    };

    const initialFiltered = filterListings(combined);
    setDisplayListings(initialFiltered);
    setTotalCount(initialFiltered.length);

    // Live background fetch from cloud API for cross-browser visitors
    fetch(`/api/listings${currentCity ? `?city=${encodeURIComponent(currentCity)}` : ''}${currentType ? `&type=${encodeURIComponent(currentType)}` : ''}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.listings && Array.isArray(data.listings)) {
          const existingIds = new Set(combined.map((l) => l.id));
          const fresh = data.listings.filter((l: Listing) => !existingIds.has(l.id));
          if (fresh.length > 0) {
            combined = [...fresh, ...combined];
            const updated = filterListings(combined);
            setDisplayListings(updated);
            setTotalCount(updated.length);
          }
        }
      })
      .catch(() => {});
  }, [initialListings, initialTotal, currentCity, currentType]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sortBy', e.target.value);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClearFilters = () => {
    router.push('/listings');
  };

  return (
    <div className="space-y-4">
      
      {/* Top Bar: Count & Sort Selector & Mobile Filter Button */}
      <div className="bg-white rounded-xl p-3.5 border border-[#E8E3DC] flex items-center justify-between shadow-xs">
        
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onOpenMobileFilters}
            className="lg:hidden flex items-center space-x-1.5 bg-[#FAF8F5] border border-[#E8E3DC] px-3 py-1.5 rounded-lg text-xs font-bold text-[#1F2420]"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#0F6B5C]" />
            <span>Filters</span>
          </button>
          
          <div className="text-xs sm:text-sm text-[#1F2420]">
            Showing <span className="font-bold text-[#0F6B5C]">{totalCount}</span> verified properties
          </div>
        </div>

        {/* Action: Add Listing + Sort Select */}
        <div className="flex items-center space-x-3">
          <Link
            href="/create"
            className="hidden sm:inline-flex items-center space-x-1.5 bg-[#0F6B5C] hover:bg-[#0c564a] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Add Listing</span>
          </Link>

          <div className="flex items-center space-x-2 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#8A8D89] hidden sm:block" />
            <span className="text-[#8A8D89] hidden sm:inline">Sort:</span>
            <select
              value={currentSort}
              onChange={handleSortChange}
              className="bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] text-[#1F2420] font-semibold rounded-lg px-2.5 py-1.5 text-xs focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="popular">Most Viewed</option>
            </select>
          </div>
        </div>

      </div>

      {/* Grid Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-[#E8E3DC] animate-pulse">
              <div className="aspect-[4/3] bg-[#E8E3DC]"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-[#E8E3DC] rounded w-3/4"></div>
                <div className="h-3 bg-[#E8E3DC] rounded w-1/2"></div>
                <div className="h-8 bg-[#F3EFEA] rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : displayListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {displayListings.map((item, idx) => (
            <ListingCard key={item.id} listing={item} priority={idx < 2} />
          ))}
        </div>
      ) : (
        /* Zero-Results Empty State with "Add New Listing" Action */
        <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-[#E8E3DC] space-y-5 shadow-xs">
          <div className="w-16 h-16 bg-[#FAF8F5] rounded-2xl flex items-center justify-center mx-auto text-[#0F6B5C] border border-[#E8E3DC]">
            <Building2 className="w-8 h-8" />
          </div>

          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-lg font-black text-[#1F2420]">
              {currentCity ? `No Properties Listed in ${currentCity} Yet` : 'No Matching Properties Found'}
            </h3>
            <p className="text-xs sm:text-sm text-[#8A8D89]">
              Be the first certified agency or owner to list a verified property file in this location and reach active buyers.
            </p>
          </div>

          {/* Primary CTA: Add Listing in this location */}
          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto">
            <Link
              href="/create"
              className="flex-1 inline-flex items-center justify-center space-x-2 bg-[#0F6B5C] hover:bg-[#0c564a] text-white px-5 py-3 rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Add New Listing in {currentCity || 'This Location'}</span>
            </Link>
            
            <button
              type="button"
              onClick={handleClearFilters}
              className="flex-1 inline-flex items-center justify-center space-x-1.5 bg-white border border-[#E8E3DC] hover:bg-[#FAF8F5] text-[#1F2420] px-4 py-3 rounded-xl text-xs font-bold transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#8A8D89]" />
              <span>View All Properties</span>
            </button>
          </div>

          {/* Popular Cities Recommendations */}
          <div className="pt-4 border-t border-[#E8E3DC]/60 max-w-lg mx-auto">
            <p className="text-[11px] font-bold text-[#8A8D89] uppercase tracking-wider mb-2">
              Or Explore Popular Cities:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {['Lahore', 'Islamabad', 'Karachi', 'Rawalpindi', 'Peshawar', 'Multan', 'Faisalabad', 'Gujranwala'].map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => router.push(`/listings?city=${city}`)}
                  className="px-2.5 py-1 bg-[#FAF8F5] hover:bg-[#E6F3F0] hover:text-[#0F6B5C] rounded-lg border border-[#E8E3DC] text-[11px] font-semibold transition-colors"
                >
                  📍 {city}
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
