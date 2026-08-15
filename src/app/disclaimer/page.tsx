import React from 'react';
import { Metadata } from 'next';
import { AlertCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Real Estate Legal Disclaimer & Verification Guidelines | plottyy.pk',
  description: 'Legal disclaimer and title deed verification guidance for property buyers across Pakistan.',
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-[#E8E3DC] shadow-sm space-y-8">
        
        {/* Header */}
        <div className="space-y-2 border-b border-[#E8E3DC] pb-6">
          <div className="inline-flex items-center space-x-2 text-amber-800 font-bold text-xs bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>Buyer Caution & Due Diligence</span>
          </div>
          <h1 className="text-3xl font-black text-[#1F2420]">Legal & Property Disclaimer</h1>
          <p className="text-xs text-[#8A8D89]">
            Important Advisory for Property Buyers & Investors in Pakistan
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6 text-sm text-[#1F2420] leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-[#0F6B5C]">1. Independent Title Verification</h2>
            <p className="text-xs text-[#6B726D]">
              While plottyy enforces strict phone OTP verification and checks dealer affiliation records, all buyers and investors are strongly advised to perform independent due diligence with the relevant housing authority (e.g. DHA, LDA, CDA, SBCA, RDA, GDA) before transferring token advance or signing sale agreements.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-[#0F6B5C]">2. Society Approvals & NOC Status</h2>
            <p className="text-xs text-[#6B726D]">
              Property boundaries, possession readiness, and NOC approvals are published based on data provided by listing owners and registered dealers. plottyy is not responsible for zoning changes, master plan revisions, or authority development delays.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-[#0F6B5C]">3. Financial Transactions</h2>
            <p className="text-xs text-[#6B726D]">
              plottyy never requests money transfers, pay orders, or token payments on behalf of third-party sellers. Always conduct financial settlements inside official society transfer offices (e.g., DHA Transfer & Record Branch).
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
