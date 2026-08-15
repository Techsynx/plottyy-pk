'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Profile, Listing } from '@/types';
import { 
  Building2, 
  ShieldCheck, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Star, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  PlusCircle
} from 'lucide-react';

interface AgentDirectoryClientViewProps {
  initialAgents: Profile[];
  allListings: Listing[];
}

export function AgentDirectoryClientView({
  initialAgents,
  allListings: initialAllListings,
}: AgentDirectoryClientViewProps) {
  const [agents, setAgents] = useState<Profile[]>(initialAgents);
  const [allListings, setAllListings] = useState<Listing[]>(initialAllListings);

  useEffect(() => {
    try {
      // 1. Hydrate custom registered profiles from storage
      const registered = localStorage.getItem('plottyy_registered_profiles');
      let customAgents: Profile[] = [];
      if (registered) {
        customAgents = JSON.parse(registered);
      }

      // 2. Hydrate client-created listings
      const userListings = localStorage.getItem('plottyy_user_listings');
      let customListings: Listing[] = [];
      if (userListings) {
        customListings = JSON.parse(userListings);
      }

      if (customListings.length > 0) {
        const existingListingIds = new Set(initialAllListings.map((l) => l.id));
        const newOnes = customListings.filter((l) => !existingListingIds.has(l.id));
        setAllListings([...newOnes, ...initialAllListings]);
      }

      // 3. Merge custom agents with initial agents (custom first, deduplicated by id/username)
      if (customAgents.length > 0) {
        const seenHandles = new Set<string>();
        const merged: Profile[] = [];

        // Put real registered agents at the top
        for (const ag of customAgents) {
          const handle = (ag.username || ag.id).toLowerCase();
          if (!seenHandles.has(handle)) {
            seenHandles.add(handle);
            merged.push(ag);
          }
        }

        // Add remaining mock agents
        for (const ag of initialAgents) {
          const handle = (ag.username || ag.id).toLowerCase();
          if (!seenHandles.has(handle)) {
            seenHandles.add(handle);
            merged.push(ag);
          }
        }

        setAgents(merged);
      }
    } catch (e) {
      console.error('Error hydrating agents directory:', e);
    }
  }, [initialAgents, initialAllListings]);

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
            Browse registered property consultants with verified identities, transparent portfolios, and zero hidden markups.
          </p>
        </div>
      </section>

      {/* Directory Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-[#1F2420]">
              All Registered Agencies ({agents.length})
            </h2>
            <p className="text-xs text-[#8A8D89]">
              100% Certified Agency Partners & Verified Consultants
            </p>
          </div>

          <Link
            href="/create"
            className="inline-flex items-center space-x-2 bg-[#0F6B5C] hover:bg-[#0c564a] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Register Agency / List Plot</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {agents.map((agent) => {
            const agentListings = allListings.filter(
              (l) => l.user_id === agent.id || l.user?.username === agent.username || l.contact_phone === agent.phone_number
            );
            const totalViews = agentListings.reduce((acc, l) => acc + (l.views_count || 0), 0);
            const handle = agent.username || agent.id;

            return (
              <div
                key={agent.id}
                className="bg-white rounded-3xl border border-[#E8E3DC] overflow-hidden shadow-xs hover:border-[#0F6B5C]/50 transition-all flex flex-col justify-between"
              >
                {/* Cover & Avatar */}
                <div>
                  <div className="h-28 bg-gradient-to-r from-[#0F6B5C] to-[#164e44] relative overflow-hidden">
                    {agent.cover_url && (
                      <img
                        src={agent.cover_url}
                        alt=""
                        className="w-full h-full object-cover opacity-40 mix-blend-overlay"
                      />
                    )}
                    <div className="absolute -bottom-6 left-6">
                      <img
                        src={agent.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400'}
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
                          {agent.agency_name || `${agent.full_name} Real Estate`}
                        </p>
                        <span className="text-[11px] font-mono text-[#8A8D89] block mt-0.5">
                          @{handle}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1 bg-[#FAF8F5] border border-[#E8E3DC] px-2 py-1 rounded-lg text-xs font-extrabold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{agent.rating || 5.0}</span>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-[#6B726D] line-clamp-2 leading-relaxed">
                      {agent.bio || 'Verified real estate consultant dedicated to transparent plot purchases and commercial investments.'}
                    </p>

                    {/* Operating Sectors */}
                    {agent.operating_areas && agent.operating_areas.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {agent.operating_areas.slice(0, 3).map((area) => (
                          <span
                            key={area}
                            className="bg-[#FAF8F5] border border-[#E8E3DC] text-[10px] font-bold text-[#1F2420] px-2 py-0.5 rounded-md"
                          >
                            📍 {area}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Metrics Bar */}
                    <div className="grid grid-cols-3 gap-2 bg-[#FAF8F5] p-3 rounded-2xl border border-[#E8E3DC] text-center text-xs">
                      <div>
                        <span className="font-extrabold text-[#0F6B5C] text-sm block">
                          {agentListings.length}
                        </span>
                        <span className="text-[10px] text-[#8A8D89]">Listings</span>
                      </div>
                      <div>
                        <span className="font-extrabold text-[#1F2420] text-sm block">
                          {totalViews}
                        </span>
                        <span className="text-[10px] text-[#8A8D89]">Total Views</span>
                      </div>
                      <div>
                        <span className="font-extrabold text-[#D97B4F] text-sm block">
                          {agent.experience_years || 5}+ Yrs
                        </span>
                        <span className="text-[10px] text-[#8A8D89]">Experience</span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Footer CTAs */}
                <div className="p-6 pt-0 flex items-center space-x-2">
                  <Link
                    href={`/agents/${handle}`}
                    className="flex-1 bg-[#0F6B5C] hover:bg-[#0c564a] text-white py-2.5 rounded-xl font-bold text-xs text-center transition-all shadow-xs flex items-center justify-center space-x-1"
                  >
                    <span>View Showcase</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>

                  <a
                    href={`https://wa.me/${agent.phone_number?.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl shadow-xs transition-all flex-shrink-0"
                    title="Chat on WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>

                  <a
                    href={`tel:${agent.phone_number?.replace(/\s+/g, '')}`}
                    className="p-2.5 bg-white border border-[#E8E3DC] hover:bg-[#FAF8F5] text-[#1F2420] rounded-xl transition-all flex-shrink-0"
                    title="Call Direct"
                  >
                    <Phone className="w-4 h-4 text-[#0F6B5C]" />
                  </a>
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
