'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles, ShieldCheck, MapPin, Building } from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: 'What is Plottyy Plot Finder and how does it work in Pakistan?',
    a: 'Plottyy (by Unicorn Realtors) is Pakistan\'s dedicated plot finder and verified property marketplace. Unlike traditional classified portals with stale ads and ghost brokers, Plottyy verifies every lister and agent with 6-digit phone verification, exact GPS location pins, and transparent Lakh/Crore pricing. You can search 5 Marla, 10 Marla, 1 Kanal residential plots, commercial land, and ready houses across DHA Lahore, Bahria Town, and major Pakistani cities.',
  },
  {
    q: 'How can I find verified plots for sale in DHA Lahore and Bahria Town?',
    a: 'Simply select Lahore from the top city dropdown or search for specific societies like DHA Phase 6, Phase 7, Phase 9 Prism, or Bahria Town Sector C. Plottyy filters plots by exact size (Marla/Kanal), direct road access, corner/facing park status, and possession verification. You can instantly reveal the direct phone number or start a 1-click WhatsApp chat with the certified lister.',
  },
  {
    q: 'Who is Unicorn Realtors and Huzaifa Malik (@exhuzaifa)?',
    a: 'Unicorn Realtors, led by Huzaifa Malik (@exhuzaifa), is a certified real estate consultancy specializing in high-yield plot investments, commercial files, and luxury residential properties across Lahore, Islamabad, and Faisalabad. On Plottyy, Unicorn Realtors connects genuine plot buyers directly with authentic inventory with zero hidden dealer commissions.',
  },
  {
    q: 'How are plot sizes calculated in Pakistan (Marla vs Kanal vs Sq. Feet)?',
    a: 'In Pakistan, 1 Marla is officially standardized as 225 square feet in modern societies like DHA and Bahria Town (and 272.25 sq. ft. in traditional revenue records). 1 Kanal equals 20 Marlas (4,500 sq. ft.), and 1 Murabba equals 25 Acres. Plottyy includes an automated Marla/Kanal converter on every listing to show the exact price per Marla.',
  },
  {
    q: 'How do I list my plot or register as a certified agent on Plottyy?',
    a: 'Click "List Your Property" at the top of the page. You can claim your custom agency handle (e.g. @your_agency), upload your plot details, select your society, and publish your listing in under 2 minutes. All listings are indexed on Google Search and visible across all browsers worldwide.',
  },
  {
    q: 'Is Plottyy free for property buyers and sellers in Pakistan?',
    a: 'Yes, searching for plots, revealing owner contact numbers, and starting WhatsApp conversations is 100% free for all buyers and investors. Certified agents and owners can also publish verified listings directly to the marketplace.',
  },
];

export function HomeSEOFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      'name': item.q,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': item.a,
      },
    })),
  };

  return (
    <section className="space-y-8 pt-4">
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="text-center space-y-2 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-1.5 bg-[#E6F3F0] text-[#0F6B5C] px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Pakistan Property Guide & FAQs</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1F2420] tracking-tight">
          Everything You Need to Know About Buying Plots in Pakistan
        </h2>
        <p className="text-xs sm:text-sm text-[#6B726D]">
          Expert insights, society guides, and answers to common real estate questions by Unicorn Realtors.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-3">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-[#E8E3DC] overflow-hidden property-card-shadow transition-all"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-[#FAF8F5]/60 transition-colors"
              >
                <span className="font-extrabold text-sm sm:text-base text-[#1F2420]">
                  {item.q}
                </span>
                <div
                  className={`w-8 h-8 rounded-xl bg-[#FAF8F5] border border-[#E8E3DC] flex items-center justify-center flex-shrink-0 text-[#0F6B5C] transition-transform duration-200 ${
                    isOpen ? 'rotate-180 bg-[#0F6B5C] text-white' : ''
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-[#6B726D] leading-relaxed border-t border-[#FAF8F5] pt-4 animate-in fade-in duration-200">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
