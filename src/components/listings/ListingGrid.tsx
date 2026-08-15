'use client';

import React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Listing } from '@/types';
import { ListingCard } from './ListingCard';
import { 
  ArrowUpDown, 
  SearchX, 
  RotateCcw, 
  MapPin,
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';

interface ListingGridProps {
  listings: Listing[];
  total: number;
  isLoading?: boolean;
  onOpenMobileFilters?: () => void;
}

export function ListingGrid({
  listings,
  total,
  isLoading = false,
  onOpenMobileFilters,
}: ListingGridProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get('sortBy') || 'newest';

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
      <div className="bg-white rounded-xl p-3.5 border border-[#E8E3DC] flex items-center justify-between shadow-sm">
        
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
            Showing <span className="font-bold text-[#0F6B5C]">{total}</span> properties
          </div>
        </div>

        {/* Sort Select */}
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

      {/* Grid Content */}
      {isLoading ? (
        // Skeleton Loaders
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
      ) : listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {listings.map((item, idx) => (
            <ListingCard key={item.id} listing={item} priority={idx < 2} />
          ))}
        </div>
      ) : (
        // Zero-Results Fallback with Suggestions
        <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-[#E8E3DC] space-y-5">
          <div className="w-16 h-16 bg-[#FAF8F5] rounded-full flex items-center justify-center mx-auto text-[#D97B4F]">
            <SearchX className="w-8 h-8" />
          </div>

          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-[#1F2420]">
              No exact properties found
            </h3>
            <p className="text-xs sm:text-sm text-[#8A8D89]">
              We couldn&apos;t find properties matching all selected filters. Try broadening your search or explore popular societies below.
            </p>
          </div>

          {/* Quick suggestions */}
          <div className="pt-2 flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
            <button
              onClick={handleClearFilters}
              className="flex items-center space-x-1.5 bg-[#0F6B5C] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#0c564a]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear All Filters</span>
            </button>
            <button
              onClick={() => router.push('/listings?type=plot&city=Lahore')}
              className="bg-[#FAF8F5] border border-[#E8E3DC] text-[#1F2420] px-3 py-2 rounded-xl text-xs font-medium hover:bg-[#E6F3F0]"
            >
              Explore DHA Lahore Plots
            </button>
            <button
              onClick={() => router.push('/listings?type=plot&city=Islamabad')}
              className="bg-[#FAF8F5] border border-[#E8E3DC] text-[#1F2420] px-3 py-2 rounded-xl text-xs font-medium hover:bg-[#E6F3F0]"
            >
              Explore Islamabad Plots
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
