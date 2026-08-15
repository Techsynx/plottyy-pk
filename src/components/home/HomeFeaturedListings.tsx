'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Listing } from '@/types';
import { ListingCard } from '@/components/listings/ListingCard';
import { ShieldCheck, ArrowRight } from 'lucide-react';

interface HomeFeaturedListingsProps {
  initialListings: Listing[];
}

export function HomeFeaturedListings({ initialListings }: HomeFeaturedListingsProps) {
  const [listings, setListings] = useState<Listing[]>(initialListings);

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

    setListings(combined.slice(0, 6));

    // Background fetch from cloud API for cross-browser visitors
    fetch('/api/listings')
      .then((res) => res.json())
      .then((data) => {
        if (data.listings && Array.isArray(data.listings)) {
          const existingIds = new Set(combined.map((l) => l.id));
          const fresh = data.listings.filter((l: Listing) => !existingIds.has(l.id));
          if (fresh.length > 0) {
            combined = [...fresh, ...combined];
            setListings(combined.slice(0, 6));
          }
        }
      })
      .catch(() => {});
  }, [initialListings]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-[#0F6B5C] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#7FA37A]" />
            <span>Verified by Plottyy</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2420] tracking-tight mt-1">
            Featured Plots & Luxury Properties
          </h2>
        </div>
        <Link
          href="/listings"
          className="text-xs font-bold text-[#0F6B5C] hover:text-[#0c564a] flex items-center space-x-1"
        >
          <span>View all properties</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((item) => (
          <ListingCard key={item.id} listing={item} />
        ))}
      </div>
    </section>
  );
}
