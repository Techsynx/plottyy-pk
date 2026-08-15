'use client';

import React, { useState } from 'react';
import { Listing } from '@/types';
import { PropertyBrochureModal } from '@/components/listings/PropertyBrochureModal';
import { InstallmentCalculator } from '@/components/listings/InstallmentCalculator';
import { FileDown, Calculator, Share2, Check } from 'lucide-react';

interface ListingInteractiveActionsProps {
  listing: Listing;
}

export function ListingInteractiveActions({ listing }: ListingInteractiveActionsProps) {
  const [brochureOpen, setBrochureOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Action Buttons Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setBrochureOpen(true)}
          className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-white hover:bg-[#FAF8F5] border border-[#0F6B5C] text-[#0F6B5C] px-5 py-3 rounded-2xl font-bold text-xs shadow-xs transition-all hover:shadow-sm"
        >
          <FileDown className="w-4 h-4" />
          <span>Download Official PDF Brochure</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="flex items-center space-x-2 bg-white hover:bg-[#FAF8F5] border border-[#E8E3DC] text-[#1F2420] px-4 py-3 rounded-2xl font-bold text-xs transition-all"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-[#0F6B5C]" />
              <span className="text-[#0F6B5C]">Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-[#8A8D89]" />
              <span>Share Property</span>
            </>
          )}
        </button>
      </div>

      {/* Installment Plan Calculator Section */}
      <InstallmentCalculator totalPrice={listing.price} />

      {/* Printable / PDF Brochure Modal */}
      <PropertyBrochureModal
        listing={listing}
        isOpen={brochureOpen}
        onClose={() => setBrochureOpen(false)}
      />

    </div>
  );
}
