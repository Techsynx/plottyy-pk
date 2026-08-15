'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { 
  SlidersHorizontal, 
  RotateCcw, 
  ShieldCheck, 
  Check,
  ChevronDown,
  Layers,
  Home,
  Building,
  Sparkles
} from 'lucide-react';
import { CITIES_DATA, LOCATIONS_DATA } from '@/lib/data/mock-db';
import { PROPERTY_TYPES_CONFIG, formatPKR } from '@/lib/constants';

interface ListingFiltersProps {
  onCloseMobile?: () => void;
}

export function ListingFilters({ onCloseMobile }: ListingFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Current URL states
  const currentCity = searchParams.get('city') || '';
  const currentPurpose = searchParams.get('purpose') || 'sale';
  const currentType = searchParams.get('type') || '';
  const currentSubtype = searchParams.get('subtype') || '';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const currentMinSize = searchParams.get('minSize') || '';
  const currentMaxSize = searchParams.get('maxSize') || '';
  const currentSizeUnit = searchParams.get('sizeUnit') || 'marla';
  const currentBeds = searchParams.get('bedrooms') || '';
  const currentVerifiedOnly = searchParams.get('verifiedOnly') === 'true';

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'all' && value !== '') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    router.push(pathname);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E8E3DC] property-card-shadow space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E8E3DC]">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-4 h-4 text-[#0F6B5C]" />
          <h3 className="font-bold text-sm text-[#1F2420]">Filters</h3>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="text-xs font-semibold text-[#8A8D89] hover:text-[#D97B4F] flex items-center space-x-1"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* 1. Purpose (Buy / Rent) */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-[#8A8D89] uppercase tracking-wider">
          Purpose
        </label>
        <div className="grid grid-cols-2 gap-2 bg-[#F3EFEA] p-1 rounded-xl">
          <button
            type="button"
            onClick={() => updateParam('purpose', 'sale')}
            className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
              currentPurpose === 'sale'
                ? 'bg-[#0F6B5C] text-white shadow-sm'
                : 'text-[#6B726D] hover:text-[#1F2420]'
            }`}
          >
            For Sale
          </button>
          <button
            type="button"
            onClick={() => updateParam('purpose', 'rent')}
            className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
              currentPurpose === 'rent'
                ? 'bg-[#0F6B5C] text-white shadow-sm'
                : 'text-[#6B726D] hover:text-[#1F2420]'
            }`}
          >
            For Rent
          </button>
        </div>
      </div>

      {/* 2. City */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-[#8A8D89] uppercase tracking-wider">
          City
        </label>
        <select
          value={currentCity}
          onChange={(e) => updateParam('city', e.target.value)}
          className="w-full bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-xl px-3 py-2 text-xs font-semibold text-[#1F2420] focus:outline-none"
        >
          <option value="">All Cities</option>
          {CITIES_DATA.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* 3. Property Type */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-[#8A8D89] uppercase tracking-wider">
          Property Type
        </label>
        <div className="space-y-1.5">
          {[
            { id: '', label: 'All Property Types' },
            { id: 'plot', label: 'Plots & Land' },
            { id: 'house', label: 'Houses & Villas' },
            { id: 'flat', label: 'Flats & Apartments' },
            { id: 'commercial', label: 'Commercial' },
          ].map((t) => {
            const isSelected = currentType === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => updateParam('type', t.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-[#0F6B5C]/10 text-[#0F6B5C] border border-[#0F6B5C]/30'
                    : 'text-[#6B726D] hover:bg-[#FAF8F5] hover:text-[#1F2420]'
                }`}
              >
                <span>{t.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Price Presets (PKR) */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-[#8A8D89] uppercase tracking-wider">
          Price Range (PKR)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min PKR"
            value={currentMinPrice}
            onChange={(e) => updateParam('minPrice', e.target.value)}
            className="w-full bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-lg px-2.5 py-1.5 text-xs text-[#1F2420] focus:outline-none"
          />
          <input
            type="number"
            placeholder="Max PKR"
            value={currentMaxPrice}
            onChange={(e) => updateParam('maxPrice', e.target.value)}
            className="w-full bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-lg px-2.5 py-1.5 text-xs text-[#1F2420] focus:outline-none"
          />
        </div>
        
        {/* Quick Price Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {[
            { label: 'Under 1 Crore', min: '', max: '10000000' },
            { label: '1 - 3 Crore', min: '10000000', max: '30000000' },
            { label: '3 - 6 Crore', min: '30000000', max: '60000000' },
            { label: '6+ Crore', min: '60000000', max: '' },
          ].map((pill, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                if (pill.min) params.set('minPrice', pill.min); else params.delete('minPrice');
                if (pill.max) params.set('maxPrice', pill.max); else params.delete('maxPrice');
                router.push(`${pathname}?${params.toString()}`);
              }}
              className="text-[10px] font-medium bg-[#FAF8F5] hover:bg-[#E6F3F0] hover:text-[#0F6B5C] px-2 py-1 rounded border border-[#E8E3DC] transition-colors"
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Size Range */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-[#8A8D89] uppercase tracking-wider">
            Size
          </label>
          <select
            value={currentSizeUnit}
            onChange={(e) => updateParam('sizeUnit', e.target.value)}
            className="text-[11px] font-bold text-[#0F6B5C] bg-transparent focus:outline-none cursor-pointer"
          >
            <option value="marla">Marla</option>
            <option value="kanal">Kanal</option>
            <option value="sqyd">Sq. Yd</option>
            <option value="sqft">Sq. Ft</option>
          </select>
        </div>

        {/* Quick Size Pills */}
        <div className="grid grid-cols-3 gap-1.5">
          {['3', '5', '10', '20'].map((sz) => (
            <button
              key={sz}
              type="button"
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.set('sizeUnit', 'marla');
                params.set('minSize', sz);
                params.set('maxSize', sz);
                router.push(`${pathname}?${params.toString()}`);
              }}
              className="py-1 text-center text-xs font-semibold rounded bg-[#FAF8F5] hover:bg-[#E6F3F0] hover:text-[#0F6B5C] border border-[#E8E3DC] transition-colors"
            >
              {sz} Marla
            </button>
          ))}
          {['1', '2'].map((sz) => (
            <button
              key={sz}
              type="button"
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.set('sizeUnit', 'kanal');
                params.set('minSize', sz);
                params.set('maxSize', sz);
                router.push(`${pathname}?${params.toString()}`);
              }}
              className="py-1 text-center text-xs font-semibold rounded bg-[#FAF8F5] hover:bg-[#E6F3F0] hover:text-[#0F6B5C] border border-[#E8E3DC] transition-colors"
            >
              {sz} Kanal
            </button>
          ))}
        </div>
      </div>

      {/* 6. Verified Only Toggle */}
      <div className="pt-2 border-t border-[#E8E3DC]">
        <label className="flex items-center justify-between cursor-pointer group">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#7FA37A]" />
            <span className="text-xs font-bold text-[#1F2420] group-hover:text-[#0F6B5C]">
              Verified Listings Only
            </span>
          </div>
          <input
            type="checkbox"
            checked={currentVerifiedOnly}
            onChange={(e) => updateParam('verifiedOnly', e.target.checked ? 'true' : null)}
            className="w-4 h-4 text-[#0F6B5C] rounded border-[#E8E3DC] focus:ring-[#0F6B5C] cursor-pointer"
          />
        </label>
      </div>

    </div>
  );
}
