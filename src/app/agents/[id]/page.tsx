import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { PROFILES_DATA, getHydratedListings } from '@/lib/data/mock-db';
import { ListingCard } from '@/components/listings/ListingCard';
import { 
  Building2, 
  ShieldCheck, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Star, 
  Briefcase, 
  Award, 
  Globe, 
  Calendar,
  Layers,
  Sparkles,
  Share2
} from 'lucide-react';

interface AgentDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: AgentDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const agent = PROFILES_DATA.find(
    (p) => p.username?.toLowerCase() === id.toLowerCase() || p.id === id
  );

  if (!agent) {
    return { title: 'Agent Not Found | plottyy' };
  }

  return {
    title: `${agent.full_name} (@${agent.username || 'agent'}) — ${agent.agency_name} | plottyy`,
    description: `${agent.bio} View all verified plot and property listings by ${agent.agency_name}.`,
  };
}

export default async function AgentDetailPage({ params }: AgentDetailPageProps) {
  const { id } = await params;
  const agent = PROFILES_DATA.find(
    (p) => p.username?.toLowerCase() === id.toLowerCase() || p.id === id
  );

  if (!agent) {
    notFound();
  }

  const allListings = getHydratedListings();
  const agentListings = allListings.filter((l) => l.user_id === agent.id);
  const totalViews = agentListings.reduce((acc, l) => acc + (l.views_count || 0), 0);
  const totalLeads = agentListings.reduce((acc, l) => acc + (l.leads_count || 0), 0);

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-20">
      
      {/* Hero Agency Cover */}
      <div className="h-64 sm:h-80 bg-gradient-to-r from-[#0F6B5C] via-[#164e44] to-[#0A3E35] relative overflow-hidden">
        {agent.cover_url && (
          <img
            src={agent.cover_url}
            alt=""
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Main Agency Profile Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-28 relative z-10 space-y-8">
        
        {/* Profile Card Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E3DC] shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Avatar & Title */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="relative">
                <img
                  src={agent.avatar_url || ''}
                  alt={agent.full_name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-white shadow-lg bg-white"
                />
                {agent.is_verified && (
                  <span className="absolute -bottom-2 -right-2 bg-[#7FA37A] text-white p-1.5 rounded-full shadow-md">
                    <ShieldCheck className="w-5 h-5" />
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-[#1F2420]">
                    {agent.full_name}
                  </h1>
                  {agent.is_verified && (
                    <span className="bg-[#7FA37A]/20 text-[#0F6B5C] text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Certified Agency Partner</span>
                    </span>
                  )}
                </div>

                <p className="text-sm font-extrabold text-[#0F6B5C]">
                  {agent.agency_name}
                </p>

                {agent.license_number && (
                  <p className="text-xs text-[#8A8D89] font-mono">
                    Registration / License: {agent.license_number}
                  </p>
                )}

                {agent.office_address && (
                  <p className="text-xs text-[#6B726D] flex items-center space-x-1.5 pt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#0F6B5C] flex-shrink-0" />
                    <span>{agent.office_address}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Direct Action Hub */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
              <a
                href={`tel:${agent.phone_number.replace(/\s+/g, '')}`}
                className="flex-1 sm:flex-initial bg-[#0F6B5C] hover:bg-[#0c564a] text-white px-5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center space-x-2 shadow-sm"
              >
                <Phone className="w-4 h-4" />
                <span>Call {agent.phone_number}</span>
              </a>

              <a
                href={`https://wa.me/${agent.phone_number.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(agent.full_name)},%20I%20am%20inquiring%20about%20your%20property%20portfolio%20on%20plottyy.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial bg-[#25D366] hover:bg-[#20bd5a] text-white px-5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center space-x-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Message</span>
              </a>
            </div>

          </div>

          {/* Bio & Details */}
          <div className="border-t border-[#E8E3DC] pt-5 space-y-4">
            <div>
              <h3 className="text-xs font-bold text-[#8A8D89] uppercase tracking-wider mb-1.5">
                About Agency & Mission
              </h3>
              <p className="text-sm text-[#1F2420] leading-relaxed max-w-4xl">
                {agent.bio}
              </p>
            </div>

            {/* KPI metrics bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E3DC]">
              <div className="space-y-0.5">
                <p className="text-xs text-[#8A8D89] font-medium">Active Portfolio</p>
                <p className="text-lg font-black text-[#1F2420]">{agentListings.length} Properties</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs text-[#8A8D89] font-medium">Market Trust Score</p>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <p className="text-lg font-black text-[#1F2420]">{agent.rating || 5.0} / 5.0</p>
                </div>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs text-[#8A8D89] font-medium">Industry Experience</p>
                <p className="text-lg font-black text-[#1F2420]">{agent.experience_years || 5}+ Years</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs text-[#8A8D89] font-medium">Inquiry Response</p>
                <p className="text-lg font-black text-[#0F6B5C]">Under 15 Mins</p>
              </div>
            </div>

            {/* Operating Areas tags */}
            {agent.operating_areas && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#8A8D89] uppercase tracking-wider">
                  Specialized Housing Societies:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {agent.operating_areas.map((area, i) => (
                    <span
                      key={i}
                      className="text-xs font-bold bg-[#E6F3F0] text-[#0F6B5C] px-3 py-1 rounded-xl border border-[#0F6B5C]/20"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Agency Listings Inventory Showcase */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-[#1F2420]">
                Properties by {agent.agency_name} ({agentListings.length})
              </h2>
              <p className="text-xs text-[#8A8D89] mt-0.5">
                Verified genuine listings directly managed and negotiated by this agency
              </p>
            </div>
          </div>

          {agentListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {agentListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#E8E3DC] space-y-3">
              <p className="text-sm font-bold text-[#1F2420]">No active properties right now</p>
              <p className="text-xs text-[#8A8D89]">
                This agency is updating their inventory. Check back shortly or contact them directly.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
