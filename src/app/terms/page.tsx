import React from 'react';
import { Metadata } from 'next';
import { FileText, CheckCircle2, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | plottyy.pk',
  description: 'Terms and conditions governing listing creation, dealer verification, and buyer inquiries on plottyy.pk.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-[#E8E3DC] shadow-sm space-y-8">
        
        {/* Header */}
        <div className="space-y-2 border-b border-[#E8E3DC] pb-6">
          <div className="inline-flex items-center space-x-2 text-[#0F6B5C] font-bold text-xs bg-[#E6F3F0] px-3 py-1 rounded-full">
            <FileText className="w-4 h-4" />
            <span>Platform Agreement</span>
          </div>
          <h1 className="text-3xl font-black text-[#1F2420]">Terms of Service</h1>
          <p className="text-xs text-[#8A8D89]">
            Last Updated: August 15, 2026 • plottyy Pakistan
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6 text-sm text-[#1F2420] leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-[#0F6B5C]">1. Listing Authenticity & Ownership</h2>
            <p className="text-xs text-[#6B726D]">
              By posting a plot, residential, or commercial listing on plottyy, you warrant that you are either the direct legal owner or an authorized real estate agent holding explicit mandate from the owner. False listings, fabricated plot files, and misleading price tags will result in instant account termination and blacklist.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-[#0F6B5C]">2. 0% Listing Commission</h2>
            <p className="text-xs text-[#6B726D]">
              plottyy is an open marketplace infrastructure connecting verified sellers with buyers. plottyy does not charge listing commissions on standard transactions unless explicitly engaged for managed enterprise brokerage services.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-[#0F6B5C]">3. Agency Handles & Intellectual Property</h2>
            <p className="text-xs text-[#6B726D]">
              Agencies are allocated unique usernames (@handles) on a first-come, first-served basis. plottyy reserves the right to reclaim or reassign handles in cases of trademark infringement or impersonation.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
