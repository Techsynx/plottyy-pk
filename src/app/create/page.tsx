import React from 'react';
import { Metadata } from 'next';
import { ListingWizard } from '@/components/create/ListingWizard';
import { PlusCircle, ShieldCheck, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'List Your Plot or Property for Free | plottyy',
  description: 'Publish your plot, house, or commercial real estate listing on plottyy with OTP verification, direct buyer phone reveals, and WhatsApp inquiries.',
};

export default function CreateListingPage() {
  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 bg-[#E6F3F0] text-[#0F6B5C] px-3.5 py-1 rounded-full text-xs font-bold border border-[#0F6B5C]/20">
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Direct Seller & Dealer Gateway</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1F2420] tracking-tight">
            List Your Property on plot<span className="text-[#D97B4F]">tyy</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#6B726D] max-w-xl mx-auto">
            Fill in the details below. Reach genuine verified buyers across Pakistan with 0% listing commissions.
          </p>
        </div>

        {/* Wizard Form Component */}
        <ListingWizard />

      </div>
    </div>
  );
}
