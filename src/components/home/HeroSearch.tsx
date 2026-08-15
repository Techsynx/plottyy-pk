'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  MapPin, 
  ChevronDown, 
  ShieldCheck, 
  Layers, 
  SlidersHorizontal,
  Sparkles,
  Building,
  Home,
  Check
} from 'lucide-react';
import { CITIES_DATA, LOCATIONS_DATA } from '@/lib/data/mock-db';
import { PropertyPurpose, PropertyType } from '@/types';

export function HeroSearch() {
  const router = useRouter();

  // Search State
  const [purpose, setPurpose] = useState<PropertyPurpose>('sale');
  const [selectedCity, setSelectedCity] = useState('Lahore');
  const [propertyType, setPropertyType] = useState<PropertyType>('plot');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);

  // Typeahead state
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter available locations by current city and query
  const cityObj = CITIES_DATA.find((c) => c.name.toLowerCase() === selectedCity.toLowerCase());
  const cityLocations = LOCATIONS_DATA.filter((l) => !cityObj || l.city_id === cityObj.id);

  const filteredLocations = cityLocations.filter((loc) =>
    searchQuery.trim() === '' ||
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.full_address_path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Click outside to close typeahead
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSuggestionsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set('purpose', purpose);
    params.set('city', selectedCity);
    if (propertyType) params.set('type', propertyType);
    if (selectedLocationId) {
      params.set('locationId', selectedLocationId.toString());
    } else if (searchQuery.trim()) {
      params.set('query', searchQuery.trim());
    }
    router.push(`/listings?${params.toString()}`);
  };

  const handleSelectLocation = (loc: typeof LOCATIONS_DATA[0]) => {
    setSearchQuery(loc.name);
    setSelectedLocationId(loc.id);
    setSuggestionsOpen(false);
  };

  return (
    <div className="relative bg-gradient-to-b from-[#0F6B5C] via-[#0D5C4F] to-[#0a483e] text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8">
      
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>

      <div className="relative max-w-5xl mx-auto text-center space-y-4">
        
        {/* Trust Pill */}
        <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-medium text-[#FAF8F5]">
          <ShieldCheck className="w-4 h-4 text-[#7FA37A]" />
          <span>Pakistan&apos;s Verified Plot & Real Estate Exchange</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-sans max-w-3xl mx-auto leading-tight">
          Search Real Estate with Verified Boundaries & Direct Pricing
        </h1>
        
        <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto">
          Explore plots, residential homes, and commercial spaces across DHA, Bahria Town, CDA Sectors & top societies.
        </p>

        {/* Search Card */}
        <div className="mt-8 bg-white rounded-2xl p-3 sm:p-5 shadow-2xl text-[#1F2420] text-left border border-black/5 max-w-4xl mx-auto">
          
          {/* Top Controls: Buy/Rent Switcher & Property Type Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E8E3DC]">
            
            {/* Purpose Switcher */}
            <div className="flex bg-[#F3EFEA] p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setPurpose('sale')}
                className={`px-5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  purpose === 'sale'
                    ? 'bg-[#0F6B5C] text-white shadow-sm'
                    : 'text-[#6B726D] hover:text-[#1F2420]'
                }`}
              >
                Buy
              </button>
              <button
                type="button"
                onClick={() => setPurpose('rent')}
                className={`px-5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  purpose === 'rent'
                    ? 'bg-[#0F6B5C] text-white shadow-sm'
                    : 'text-[#6B726D] hover:text-[#1F2420]'
                }`}
              >
                Rent
              </button>
            </div>

            {/* Property Types */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'plot', label: 'Plots / Land', icon: Layers },
                { id: 'house', label: 'Houses', icon: Home },
                { id: 'flat', label: 'Flats', icon: Building },
                { id: 'commercial', label: 'Commercial', icon: Sparkles },
              ].map((item) => {
                const isSelected = propertyType === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPropertyType(item.id as PropertyType)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-[#0F6B5C]/10 text-[#0F6B5C] border border-[#0F6B5C]/30'
                        : 'text-[#6B726D] hover:bg-[#F3EFEA] hover:text-[#1F2420]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Bar */}
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-3 items-center">
            
            {/* City Dropdown */}
            <div className="md:col-span-3 relative">
              <label className="block text-[11px] font-semibold text-[#8A8D89] uppercase tracking-wider mb-1">
                City
              </label>
              <div className="flex items-center bg-[#FAF8F5] border border-[#E8E3DC] hover:border-[#0F6B5C] rounded-xl px-3 py-2.5">
                <MapPin className="w-4 h-4 text-[#0F6B5C] mr-2 flex-shrink-0" />
                <select
                  value={selectedCity}
                  onChange={(e) => {
                    setSelectedCity(e.target.value);
                    setSelectedLocationId(null);
                    setSearchQuery('');
                  }}
                  className="w-full bg-transparent text-sm font-semibold text-[#1F2420] focus:outline-none cursor-pointer"
                >
                  {CITIES_DATA.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Society / Area Typeahead Autocomplete */}
            <div className="md:col-span-6 relative" ref={dropdownRef}>
              <label className="block text-[11px] font-semibold text-[#8A8D89] uppercase tracking-wider mb-1">
                Society, Sector, or Keyword
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. DHA Phase 6, Bahria Sector C, Block MB..."
                  value={searchQuery}
                  onFocus={() => setSuggestionsOpen(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedLocationId(null);
                    setSuggestionsOpen(true);
                  }}
                  className="w-full bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-xl px-3.5 py-2.5 text-sm text-[#1F2420] placeholder-[#8A8D89] focus:outline-none"
                />

                {/* Suggestions Dropdown */}
                {suggestionsOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-[#E8E3DC] rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto divide-y divide-[#F3EFEA]">
                    <div className="px-3 py-2 text-[11px] font-bold text-[#8A8D89] uppercase bg-[#FAF8F5]">
                      Popular Societies in {selectedCity}
                    </div>
                    {filteredLocations.length > 0 ? (
                      filteredLocations.map((loc) => (
                        <button
                          key={loc.id}
                          type="button"
                          onClick={() => handleSelectLocation(loc)}
                          className="w-full text-left px-3.5 py-2.5 hover:bg-[#E6F3F0] flex items-center justify-between text-xs transition-colors group"
                        >
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-3.5 h-3.5 text-[#0F6B5C] group-hover:scale-110 transition-transform" />
                            <span className="font-semibold text-[#1F2420] group-hover:text-[#0F6B5C]">
                              {loc.name}
                            </span>
                          </div>
                          <span className="text-[10px] text-[#8A8D89] truncate max-w-[150px]">
                            {loc.full_address_path}
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="p-3 text-xs text-[#8A8D89] text-center">
                        No specific society found. Search as free text.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Find Properties CTA */}
            <div className="md:col-span-3 flex flex-col justify-end">
              <label className="hidden md:block text-[11px] font-semibold text-transparent mb-1">
                Action
              </label>
              <button
                type="submit"
                className="w-full bg-[#D97B4F] hover:bg-[#c4683c] text-white font-bold text-sm py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all transform active:scale-98"
              >
                <Search className="w-4 h-4" />
                <span>Find Properties</span>
              </button>
            </div>
          </form>

          {/* Quick Filter Tags below search bar */}
          <div className="mt-3 pt-2.5 flex flex-wrap items-center gap-2 text-xs text-[#6B726D]">
            <span className="text-[#8A8D89] font-medium">Quick Searches:</span>
            <button
              type="button"
              onClick={() => router.push(`/listings?type=plot&city=${selectedCity}&subtype=residential_plot`)}
              className="px-2.5 py-1 bg-[#FAF8F5] hover:bg-[#E6F3F0] hover:text-[#0F6B5C] rounded-md border border-[#E8E3DC] transition-colors"
            >
              5 Marla Plots
            </button>
            <button
              type="button"
              onClick={() => router.push(`/listings?type=plot&city=${selectedCity}&subtype=residential_plot`)}
              className="px-2.5 py-1 bg-[#FAF8F5] hover:bg-[#E6F3F0] hover:text-[#0F6B5C] rounded-md border border-[#E8E3DC] transition-colors"
            >
              10 Marla Plots
            </button>
            <button
              type="button"
              onClick={() => router.push(`/listings?type=plot&city=${selectedCity}&sizeUnit=kanal&minSize=1`)}
              className="px-2.5 py-1 bg-[#FAF8F5] hover:bg-[#E6F3F0] hover:text-[#0F6B5C] rounded-md border border-[#E8E3DC] transition-colors"
            >
              1 Kanal Plots
            </button>
            <button
              type="button"
              onClick={() => router.push(`/listings?type=plot&verifiedOnly=true`)}
              className="px-2.5 py-1 bg-[#EFF6EE] text-[#0F6B5C] font-semibold hover:bg-[#e0eee0] rounded-md border border-[#7FA37A]/30 transition-colors"
            >
              ✓ Verified Only
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
