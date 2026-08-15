import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { PROFILES_DATA, getHydratedListings } from '@/lib/data/mock-db';
import { 
  Building2, 
  ShieldCheck, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Star, 
  Briefcase, 
  Award,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Verified Real Estate Agents & Agencies in Pakistan | plottyy',
  description: 'Connect directly with certified property dealers, estate agencies, and verified plot consultants in DHA, Bahria Town, and major Pakistani cities.',
};

export default function AgentsDirectoryPage() {
  const allListings = getHydratedListings();

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-16">
      
      {/* Header Banner */}
      <section className="bg-[#0F6B5C] text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-1.5 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold text-[#FAF8F5] backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#D97B4F]" />
            <span>Pakistan Verified Dealer Network</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Certified Real Estate Agents & Agencies
          </h1>
          <p className="text-sm text-white/80 max-w-2xl">
            Browse registered property consultants with verified LDA/CDA affiliations, transparent portfolios, and zero hidden markups.
          </p>
        </div>
      </section>

      {/* Directory Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#1F2420]">
            All Registered Agencies ({PROFILES_DATA.length})
          </h2>
          <span className="text-xs text-[#8A8D89]">
            100% Phone & Identity Verified
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PROFILES_DATA.map((agent) => {
            const agentListings = allListings.filter((l) => l.user_id === agent.id);
            const totalViews = agentListings.reduce((acc, l) => acc + (l.views_count || 0), 0);

            return (
              <div
                key={agent.id}
                className="bg-white rounded-3xl border border-[#E8E3DC] overflow-hidden property-card-shadow hover:border-[#0F6B5C]/50 transition-all flex flex-col justify-between"
              >
                {/* Cover & Avatar */}
                <div>
                  <div className="h-28 bg-gradient-to-r from-[#0F6B5C] to-[#164e44] relative">
                    {agent.cover_url && (
                      <img
                        src={agent.cover_url}
                        alt=""
                        className="w-full h-full object-cover opacity-40 mix-blend-overlay"
                      />
                    )}
                    <div className="absolute -bottom-6 left-6">
                      <img
                        src={agent.avatar_url || ''}
                        alt={agent.full_name}
                        className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-md bg-white"
                      />
                    </div>
                  </div>

                  <div className="pt-8 p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <h3 className="text-base font-extrabold text-[#1F2420]">
                            {agent.full_name}
                          </h3>
                          {agent.is_verified && (
                            <span className="bg-[#7FA37A]/20 text-[#0F6B5C] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                              <ShieldCheck className="w-3 h-3 text-[#0F6B5C]" />
                              <span>Verified</span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-bold text-[#0F6B5C] mt-0.5">
                          {agent.agency_name}
                        </p>
                      </div>

                      {agent.rating && (
                        <div className="flex items-center space-x-1 bg-[#FAF8F5] border border-[#E8E3DC] px-2.5 py-1 rounded-xl">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span className="text-xs font-black text-[#1F2420]">{agent.rating}</span>
                          <span className="text-[10px] text-[#8A8D89]">({agent.reviews_count})</span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-[#6B726D] line-clamp-2 leading-relaxed">
                      {agent.bio}
                    </p>

                    {/* Meta stats */}
                    <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#E8E3DC] text-center">
                      <div>
                        <p className="text-xs font-extrabold text-[#1F2420]">
                          {agentListings.length}
                        </p>
                        <p className="text-[10px] text-[#8A8D89]">Active Listings</p>
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-[#1F2420]">
                          {agent.experience_years || 5}+ Yrs
                        </p>
                        <p className="text-[10px] text-[#8A8D89]">Experience</p>
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-[#0F6B5C]">
                          {totalViews.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-[#8A8D89]">Total Views</p>
                      </div>
                    </div>

                    {/* Operating Areas */}
                    {agent.operating_areas && agent.operating_areas.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-[#8A8D89] uppercase tracking-wider">
                          Primary Operating Areas:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {agent.operating_areas.map((area, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-semibold bg-[#FAF8F5] border border-[#E8E3DC] text-[#1F2420] px-2 py-0.5 rounded-lg"
                            >
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {agent.office_address && (
                      <div className="flex items-center space-x-1.5 text-xs text-[#8A8D89]">
                        <MapPin className="w-3.5 h-3.5 text-[#0F6B5C] flex-shrink-0" />
                        <span className="truncate">{agent.office_address}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="p-4 bg-[#FAF8F5] border-t border-[#E8E3DC] flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <a
                      href={`tel:${agent.phone_number.replace(/\s+/g, '')}`}
                      className="bg-white border border-[#E8E3DC] hover:border-[#0F6B5C] text-[#1F2420] p-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#0F6B5C]" />
                      <span className="hidden sm:inline">Call</span>
                    </a>
                    <a
                      href={`https://wa.me/${agent.phone_number.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20 border border-[#25D366]/30 p-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </a>
                  </div>

                  <Link
                    href={`/agents/${agent.username || agent.id}`}
                    className="bg-[#0F6B5C] hover:bg-[#0c564a] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 shadow-xs"
                  >
                    <span>View Inventory ({agentListings.length})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
