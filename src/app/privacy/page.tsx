import React from 'react';
import { Metadata } from 'next';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | plottyy.pk',
  description: 'Learn how plottyy protects your personal and property data with bank-grade encryption and anti-scraping privacy protocols.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-[#E8E3DC] shadow-sm space-y-8">
        
        {/* Header */}
        <div className="space-y-2 border-b border-[#E8E3DC] pb-6">
          <div className="inline-flex items-center space-x-2 text-[#0F6B5C] font-bold text-xs bg-[#E6F3F0] px-3 py-1 rounded-full">
            <ShieldCheck className="w-4 h-4" />
            <span>Data Protection & Privacy Standards</span>
          </div>
          <h1 className="text-3xl font-black text-[#1F2420]">Privacy Policy</h1>
          <p className="text-xs text-[#8A8D89]">
            Effective Date: August 15, 2026 • plottyy Pakistan
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6 text-sm text-[#1F2420] leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-[#0F6B5C]">1. Information We Collect</h2>
            <p className="text-xs text-[#6B726D]">
              We collect information that you directly provide to us when you create an account, register as an estate agent, list a property, or inquire about a listing. This includes your name, email address, verified Pakistani phone number, agency name, and property geolocation data.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-[#0F6B5C]">2. Anti-Scraping Phone Privacy</h2>
            <p className="text-xs text-[#6B726D]">
              To protect property sellers and licensed real estate dealers from spam, phone numbers are masked behind a click-to-reveal barrier. Contact details are never exposed to automated web crawlers or scrapers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-[#0F6B5C]">3. How We Use Your Data</h2>
            <ul className="list-disc list-inside text-xs text-[#6B726D] space-y-1">
              <li>To connect legitimate property buyers directly with verified listers and agency partners.</li>
              <li>To authenticate user identity via SMS OTP verification and Google OAuth.</li>
              <li>To provide listing analytics, lead generation reports, and platform trust scoring.</li>
              <li>To prevent fraudulent duplicates, unauthorized listings, and misrepresentation.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-[#0F6B5C]">4. Data Security</h2>
            <p className="text-xs text-[#6B726D]">
              All data transmitted to plottyy is encrypted in transit using Transport Layer Security (TLS 1.3) and stored in secure cloud database infrastructure with Row Level Security (RLS) policies.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-[#0F6B5C]">5. Contact Us</h2>
            <p className="text-xs text-[#6B726D]">
              If you have any questions regarding this Privacy Policy or wish to request data deletion, contact our privacy desk at <a href="mailto:privacy@plottyy.pk" className="text-[#0F6B5C] font-bold underline">privacy@plottyy.pk</a>.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
