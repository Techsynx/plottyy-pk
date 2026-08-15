'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { 
  Search, 
  MapPin, 
  X, 
  SlidersHorizontal,
  Layers,
  Home,
  Building,
  Sparkles
} from 'lucide-react';
import { FilterState, PropertyType } from '@/types';
import { ListingFilters } from './ListingFilters';

interface ListingsSearchHeaderProps {
  total: number;
  filters: FilterState;
}

export function ListingsSearchHeader({ total, filters }: ListingsSearchHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [queryInput, setQueryInput] = useState(filters.query || '');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (queryInput.trim()) {
      params.set('query', queryInput.trim());
    } else {
      params.delete('query');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const removeFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  };

  const activeFilterPills = [];
  if (filters.city) activeFilterPills.push({ label: `City: ${filters.city}`, key: 'city' });
  if (filters.purpose) activeFilterPills.push({ label: `Purpose: ${filters.purpose === 'sale' ? 'For Sale' : 'For Rent'}`, key: 'purpose' });
  if (filters.type) activeFilterPills.push({ label: `Type: ${filters.type}`, key: 'type' });
  if (filters.subtype) activeFilterPills.push({ label: `Subtype: ${filters.subtype.replace(/_/g, ' ')}`, key: 'subtype' });
  if (filters.minPrice) activeFilterPills.push({ label: `Min Price: PKR ${filters.minPrice.toLocaleString()}`, key: 'minPrice' });
  if (filters.maxPrice) activeFilterPills.push({ label: `Max Price: PKR ${filters.maxPrice.toLocaleString()}`, key: 'maxPrice' });
  if (filters.minSize) activeFilterPills.push({ label: `Size: ${filters.minSize} ${filters.sizeUnit || 'Marla'}`, key: 'minSize' });
  if (filters.verifiedOnly) activeFilterPills.push({ label: '✓ Verified Only', key: 'verifiedOnly' });
  if (filters.query) activeFilterPills.push({ label: `Keyword: "${filters.query}"`, key: 'query' });

  return (
    <div className="space-y-3">
      
      {/* Top Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E8E3DC] property-card-shadow">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8A8D89] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by society, block, sector, or keyword (e.g. DHA Phase 6, Bahria, Corner Plot)..."
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#1F2420] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="bg-[#0F6B5C] hover:bg-[#0c564a] text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex-shrink-0 transition-colors shadow-sm"
          >
            Search
          </button>

          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="lg:hidden bg-[#FAF8F5] border border-[#E8E3DC] p-2.5 rounded-xl text-[#1F2420] flex-shrink-0"
            aria-label="Open Filter Drawer"
          >
            <SlidersHorizontal className="w-5 h-5 text-[#0F6B5C]" />
          </button>
        </form>
      </div>

      {/* Active Filter Tags */}
      {activeFilterPills.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#8A8D89] font-medium">Active filters:</span>
          {activeFilterPills.map((pill) => (
            <span
              key={pill.key}
              className="inline-flex items-center space-x-1.5 bg-white border border-[#0F6B5C]/30 text-[#0F6B5C] px-2.5 py-1 rounded-full text-xs font-semibold shadow-xs"
            >
              <span>{pill.label}</span>
              <button
                type="button"
                onClick={() => removeFilter(pill.key)}
                className="hover:text-red-500 rounded-full"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={() => router.push('/listings')}
            className="text-xs font-bold text-[#D97B4F] hover:underline ml-1"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Mobile Drawer Modal */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end lg:hidden">
          <div className="bg-[#FAF8F5] w-full max-w-sm h-full overflow-y-auto p-4 space-y-4 animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-[#E8E3DC]">
              <h3 className="font-bold text-base text-[#1F2420]">Filter Properties</h3>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-2 rounded-full bg-white text-[#1F2420]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ListingFilters onCloseMobile={() => setMobileDrawerOpen(false)} />
          </div>
        </div>
      )}

    </div>
  );
}
