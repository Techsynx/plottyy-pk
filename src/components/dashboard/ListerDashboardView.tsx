'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Listing, 
  Lead, 
  ListingStatus, 
  LeadStatus 
} from '@/types';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Eye, 
  Phone, 
  MessageCircle, 
  PlusCircle, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Tag, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Mail,
  UploadCloud,
  Download,
  Save,
  Globe
} from 'lucide-react';
import { formatPKR, formatSize } from '@/lib/constants';
import { updateListingStatus } from '@/lib/actions/listings';
import { updateLeadStatus } from '@/lib/actions/leads';
import { BulkImportModal } from './BulkImportModal';
import { useAuth } from '@/context/AuthContext';

interface ListerDashboardViewProps {
  initialListings: Listing[];
  initialLeads: Lead[];
}

export function ListerDashboardView({
  initialListings,
  initialLeads,
}: ListerDashboardViewProps) {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'listings' | 'leads' | 'profile'>('listings');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [listings, setListings] = useState<Listing[]>(initialListings);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [importModalOpen, setImportModalOpen] = useState(false);

  // Profile form state
  const [profFullName, setProfFullName] = useState(user?.full_name || '');
  const [profAgencyName, setProfAgencyName] = useState(user?.agency_name || '');
  const [profUsername, setProfUsername] = useState(user?.username || '');
  const [usernameStatus, setUsernameStatus] = useState<{ isAvailable?: boolean; message?: string }>({});
  const [profPhone, setProfPhone] = useState(user?.phone_number || '');
  const [profAddress, setProfAddress] = useState(user?.office_address || '');
  const [profLicense, setProfLicense] = useState(user?.license_number || '');
  const [profBio, setProfBio] = useState(user?.bio || '');
  const [profAvatarUrl, setProfAvatarUrl] = useState(user?.avatar_url || '');
  const [profCoverUrl, setProfCoverUrl] = useState(user?.cover_url || '');
  const [profWebsite, setProfWebsite] = useState(user?.website || '');
  const [profFacebook, setProfFacebook] = useState(user?.social_links?.facebook || '');
  const [profInstagram, setProfInstagram] = useState(user?.social_links?.instagram || '');
  const [profLinkedin, setProfLinkedin] = useState(user?.social_links?.linkedin || '');
  const [profYoutube, setProfYoutube] = useState(user?.social_links?.youtube || '');
  const [profOperatingAreas, setProfOperatingAreas] = useState(user?.operating_areas?.join(', ') || 'DHA Defence, Bahria Town, Gulberg');
  const [profSaved, setProfSaved] = useState(false);

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) setProfAvatarUrl(ev.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCoverFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) setProfCoverUrl(ev.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUsernameChange = async (raw: string) => {
    const clean = raw.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    setProfUsername(clean);
    if (!clean || clean.length < 3) {
      setUsernameStatus({ isAvailable: false, message: 'Min 3 chars' });
      return;
    }
    const { checkUsernameAvailability } = await import('@/lib/actions/agents');
    const res = await checkUsernameAvailability(clean, user?.id);
    setUsernameStatus({ isAvailable: res.isAvailable, message: res.message });
  };

  // Export leads to CSV
  const handleExportLeads = () => {
    const headers = ['Lead ID', 'Type', 'Buyer Name', 'Phone', 'Email', 'Status', 'Property Title', 'Inquiry Message', 'Date'];
    const rows = leads.map(l => [
      l.id,
      l.lead_type,
      `"${l.buyer_name || 'Anonymous'}"`,
      `"${l.buyer_phone || ''}"`,
      `"${l.buyer_email || ''}"`,
      l.status,
      `"${l.listing?.title || ''}"`,
      `"${(l.message || '').replace(/"/g, '""')}"`,
      l.created_at
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `plottyy-leads-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameStatus.isAvailable === false) return;
    const areas = profOperatingAreas.split(',').map(s => s.trim()).filter(Boolean);
    await updateProfile({
      full_name: profFullName,
      username: profUsername,
      agency_name: profAgencyName,
      phone_number: profPhone,
      office_address: profAddress,
      license_number: profLicense,
      bio: profBio,
      avatar_url: profAvatarUrl,
      cover_url: profCoverUrl,
      website: profWebsite,
      operating_areas: areas.length > 0 ? areas : ['DHA Defence', 'Bahria Town'],
      social_links: {
        facebook: profFacebook,
        instagram: profInstagram,
        linkedin: profLinkedin,
        youtube: profYoutube,
      },
    });
    setProfSaved(true);
    setTimeout(() => setProfSaved(false), 3000);
  };

  // Statistics
  const totalViews = listings.reduce((acc, l) => acc + (l.views_count || 0), 0);
  const totalLeadsCount = leads.length;
  const activeListingsCount = listings.filter((l) => l.status === 'live').length;
  const conversionRate = totalViews > 0 ? ((totalLeadsCount / totalViews) * 100).toFixed(1) : '0';

  const handleStatusChange = async (listingId: string, newStatus: ListingStatus) => {
    setListings((prev) =>
      prev.map((l) => (l.id === listingId ? { ...l, status: newStatus } : l))
    );
    await updateListingStatus(listingId, newStatus);
  };

  const handleLeadStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    setLeads((prev) =>
      prev.map((ld) => (ld.id === leadId ? { ...ld, status: newStatus } : ld))
    );
    await updateLeadStatus(leadId, newStatus);
  };

  const filteredListings = statusFilter === 'all'
    ? listings
    : listings.filter((l) => l.status === statusFilter);

  return (
    <div className="space-y-8">
      
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-2xl p-5 border border-[#E8E3DC] property-card-shadow">
          <div className="flex items-center justify-between text-[#8A8D89] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Listings</span>
            <div className="p-2 bg-[#E6F3F0] rounded-xl text-[#0F6B5C]">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#1F2420]">
            {activeListingsCount}
          </div>
          <span className="text-[11px] text-[#7FA37A] font-semibold mt-1 block">
            ✓ Live on search
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E8E3DC] property-card-shadow">
          <div className="flex items-center justify-between text-[#8A8D89] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Views</span>
            <div className="p-2 bg-[#FAF8F5] rounded-xl text-[#0F6B5C]">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#1F2420]">
            {totalViews.toLocaleString()}
          </div>
          <span className="text-[11px] text-[#6B726D] font-medium mt-1 block">
            Across all properties
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E8E3DC] property-card-shadow">
          <div className="flex items-center justify-between text-[#8A8D89] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Leads</span>
            <div className="p-2 bg-[#FBF0EA] rounded-xl text-[#D97B4F]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#D97B4F]">
            {totalLeadsCount}
          </div>
          <span className="text-[11px] text-[#D97B4F] font-semibold mt-1 block">
            Phone & WhatsApp calls
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E8E3DC] property-card-shadow">
          <div className="flex items-center justify-between text-[#8A8D89] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Lead Conversion</span>
            <div className="p-2 bg-[#EFF6EE] rounded-xl text-[#7FA37A]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#1F2420]">
            {conversionRate}%
          </div>
          <span className="text-[11px] text-[#7FA37A] font-semibold mt-1 block">
            View to inquiry ratio
          </span>
        </div>

      </div>

      {/* Main Tabs Navigation */}
      <div className="bg-white rounded-2xl border border-[#E8E3DC] property-card-shadow overflow-hidden">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E3DC] flex-wrap gap-4">
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('listings')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'listings'
                  ? 'bg-[#0F6B5C] text-white shadow-sm'
                  : 'text-[#6B726D] hover:bg-[#FAF8F5]'
              }`}
            >
              My Listings ({listings.length})
            </button>
            <button
              onClick={() => setActiveTab('leads')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'leads'
                  ? 'bg-[#0F6B5C] text-white shadow-sm'
                  : 'text-[#6B726D] hover:bg-[#FAF8F5]'
              }`}
            >
              Leads Inbox ({leads.length})
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'profile'
                  ? 'bg-[#0F6B5C] text-white shadow-sm'
                  : 'text-[#6B726D] hover:bg-[#FAF8F5]'
              }`}
            >
              Profile & Verification
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setImportModalOpen(true)}
              className="flex items-center space-x-1.5 bg-[#FAF8F5] hover:bg-[#E6F3F0] text-[#0F6B5C] border border-[#0F6B5C]/30 px-3.5 py-2 rounded-xl text-xs font-bold transition-all"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Bulk Feed Import</span>
            </button>

            <Link
              href="/create"
              className="flex items-center space-x-1.5 bg-[#D97B4F] hover:bg-[#c4683c] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Listing</span>
            </Link>
          </div>

        </div>

        {/* TAB 1: LISTINGS MANAGEMENT */}
        {activeTab === 'listings' && (
          <div className="p-6 space-y-4">
            
            {/* Status Pills Filter */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              {['all', 'live', 'draft', 'sold'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                    statusFilter === st
                      ? 'bg-[#0F6B5C]/10 text-[#0F6B5C] border border-[#0F6B5C]/30'
                      : 'text-[#8A8D89] hover:bg-[#FAF8F5]'
                  }`}
                >
                  {st === 'all' ? 'All Statuses' : st}
                </button>
              ))}
            </div>

            {/* Listings Table / Rows */}
            <div className="divide-y divide-[#E8E3DC]">
              {filteredListings.length > 0 ? (
                filteredListings.map((item) => {
                  const cover = item.photos?.[0]?.url || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400';
                  return (
                    <div
                      key={item.id}
                      className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                    >
                      {/* Left: Thumbnail & Info */}
                      <div className="flex items-center space-x-4 min-w-0">
                        <div className="w-20 h-16 rounded-xl overflow-hidden bg-[#F3EFEA] flex-shrink-0">
                          <img src={cover} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                                item.status === 'live'
                                  ? 'bg-[#EFF6EE] text-[#0F6B5C]'
                                  : item.status === 'sold'
                                  ? 'bg-gray-100 text-gray-700'
                                  : 'bg-amber-50 text-amber-700'
                              }`}
                            >
                              {item.status}
                            </span>
                            <span className="text-xs text-[#8A8D89]">
                              {formatSize(item.size, item.size_unit)}
                            </span>
                          </div>
                          <Link
                            href={`/listings/${item.slug}`}
                            className="font-bold text-sm text-[#1F2420] hover:text-[#0F6B5C] truncate block mt-0.5"
                          >
                            {item.title}
                          </Link>
                          <p className="text-xs text-[#0F6B5C] font-extrabold">
                            {formatPKR(item.price, item.purpose === 'rent')}
                          </p>
                        </div>
                      </div>

                      {/* Middle: Metrics */}
                      <div className="flex items-center space-x-6 text-xs text-[#6B726D] flex-shrink-0">
                        <div className="text-center">
                          <span className="font-extrabold text-sm text-[#1F2420] block">
                            {item.views_count}
                          </span>
                          <span className="text-[10px] text-[#8A8D89]">Views</span>
                        </div>
                        <div className="text-center">
                          <span className="font-extrabold text-sm text-[#D97B4F] block">
                            {item.leads_count}
                          </span>
                          <span className="text-[10px] text-[#8A8D89]">Leads</span>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item.id, e.target.value as ListingStatus)}
                          className="bg-[#FAF8F5] border border-[#E8E3DC] rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#1F2420] focus:outline-none cursor-pointer"
                        >
                          <option value="live">Mark Live</option>
                          <option value="draft">Move to Draft</option>
                          <option value="sold">Mark as Sold</option>
                        </select>

                        <Link
                          href={`/listings/${item.slug}`}
                          className="p-2 rounded-lg bg-[#FAF8F5] hover:bg-[#E6F3F0] text-[#0F6B5C] transition-colors"
                          title="View Live Listing"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center text-xs text-[#8A8D89]">
                  No properties found in this category.
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: LEADS INBOX */}
        {activeTab === 'leads' && (
          <div className="p-6 space-y-4">
            
            <div className="divide-y divide-[#E8E3DC]">
              {leads.length > 0 ? (
                leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="py-4 flex flex-col md:flex-row md:items-start justify-between gap-4"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            lead.lead_type === 'whatsapp_click'
                              ? 'bg-[#25D366]/15 text-[#1e964b]'
                              : lead.lead_type === 'phone_reveal'
                              ? 'bg-[#0F6B5C]/15 text-[#0F6B5C]'
                              : 'bg-[#D97B4F]/15 text-[#D97B4F]'
                          }`}
                        >
                          {lead.lead_type.replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs font-bold text-[#1F2420]">
                          {lead.buyer_name}
                        </span>
                        <span className="text-[10px] text-[#8A8D89]">
                          {new Date(lead.created_at).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })} • {new Date(lead.created_at).toLocaleDateString('en-PK', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>

                      {lead.listing && (
                        <p className="text-xs text-[#6B726D] font-medium truncate">
                          Target Property: <strong className="text-[#1F2420]">{lead.listing.title}</strong>
                        </p>
                      )}

                      <p className="text-xs text-[#1F2420] bg-[#FAF8F5] p-2.5 rounded-lg border border-[#E8E3DC] max-w-xl">
                        &ldquo;{lead.message}&rdquo;
                      </p>

                      {lead.buyer_phone && (
                        <div className="flex items-center space-x-1.5 text-[#0F6B5C] font-bold">
                          <Phone className="w-3.5 h-3.5" />
                          <a href={`tel:${lead.buyer_phone}`}>{lead.buyer_phone}</a>
                        </div>
                      )}
                      {lead.buyer_email && (
                        <div className="flex items-center space-x-1.5 text-[#6B726D] underline">
                          <Mail className="w-3.5 h-3.5" />
                          <a href={`mailto:${lead.buyer_email}`}>{lead.buyer_email}</a>
                        </div>
                      )}
                    </div>

                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-xs text-[#8A8D89]">
                  No leads received yet. Publish more listings to gain buyer inquiries.
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 3: PROFILE & VERIFICATION */}
        {activeTab === 'profile' && (
          <div className="p-6 space-y-8 max-w-3xl">
            
            {/* Top Overview & Public Showcase Link */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FAF8F5] p-5 rounded-2xl border border-[#E8E3DC]">
              <div className="flex items-center space-x-4">
                <img
                  src={user?.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200'}
                  alt={user?.full_name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm bg-white"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-extrabold text-base text-[#1F2420]">{user?.full_name}</h3>
                    <span className="bg-[#7FA37A] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Certified Agency</span>
                    </span>
                  </div>
                  <p className="text-xs text-[#6B726D] font-bold">{user?.agency_name}</p>
                  <p className="text-xs font-mono text-[#0F6B5C] font-bold mt-0.5">{user?.phone_number}</p>
                </div>
              </div>

              {user && (
                <Link
                  href={`/agents/${user.username || user.id}`}
                  className="bg-[#0F6B5C] hover:bg-[#0c564a] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow-xs"
                >
                  <Globe className="w-4 h-4" />
                  <span>View Public Agency Page</span>
                </Link>
              )}
            </div>

            {/* Editable Profile Form */}
            <form onSubmit={handleSaveProfile} className="space-y-6">
              
              {/* Photo & Banner Upload Section */}
              <div className="space-y-4 bg-[#FAF8F5] p-5 rounded-2xl border border-[#E8E3DC]">
                <h4 className="text-xs font-bold text-[#8A8D89] uppercase tracking-wider">
                  Agency Visual Branding (Photos & Banner)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                  
                  {/* Avatar / Headshot Upload */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#1F2420] block">
                      Agent Headshot / Logo
                    </label>
                    <div className="flex items-center space-x-3">
                      <img
                        src={profAvatarUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200'}
                        alt="Preview"
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-xs bg-white"
                      />
                      <label className="cursor-pointer bg-white border border-[#E8E3DC] hover:border-[#0F6B5C] text-[#1F2420] px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5">
                        <UploadCloud className="w-4 h-4 text-[#0F6B5C]" />
                        <span>Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarFile}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Cover Banner Upload */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#1F2420] block">
                      Agency Cover Banner
                    </label>
                    <div className="space-y-2">
                      <div className="h-16 rounded-xl overflow-hidden bg-gray-200 border border-[#E8E3DC] relative">
                        {profCoverUrl ? (
                          <img src={profCoverUrl} alt="Cover" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-r from-[#0F6B5C] to-[#0A3E35] flex items-center justify-center text-[10px] text-white/70 font-bold">
                            Default Teal Banner
                          </div>
                        )}
                      </div>
                      <label className="cursor-pointer inline-flex bg-white border border-[#E8E3DC] hover:border-[#0F6B5C] text-[#1F2420] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs items-center space-x-1.5">
                        <UploadCloud className="w-3.5 h-3.5 text-[#0F6B5C]" />
                        <span>Upload Custom Banner</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCoverFile}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                </div>
              </div>

              {/* Identity & Legal Information */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#8A8D89] uppercase tracking-wider">
                  Agency Credentials & Contact Info
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#1F2420]">
                      Agent / Representative Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={profFullName}
                      onChange={(e) => setProfFullName(e.target.value)}
                      className="w-full mt-1 bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-xl px-3.5 py-2 text-xs font-bold text-[#1F2420] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#1F2420]">
                      Agency / Brokerage Company Name
                    </label>
                    <input
                      type="text"
                      required
                      value={profAgencyName}
                      onChange={(e) => setProfAgencyName(e.target.value)}
                      className="w-full mt-1 bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-xl px-3.5 py-2 text-xs font-bold text-[#1F2420] focus:outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#1F2420]">
                        Unique Agency Handle / Username
                      </label>
                      {usernameStatus.message && (
                        <span className={`text-[10px] font-bold ${usernameStatus.isAvailable ? 'text-[#0F6B5C]' : 'text-red-600'}`}>
                          {usernameStatus.message}
                        </span>
                      )}
                    </div>
                    <div className="relative mt-1">
                      <span className="absolute left-3.5 top-2 text-xs font-bold text-[#8A8D89]">@</span>
                      <input
                        type="text"
                        required
                        value={profUsername}
                        onChange={(e) => handleUsernameChange(e.target.value)}
                        className={`w-full bg-[#FAF8F5] border rounded-xl pl-8 pr-3.5 py-2 text-xs font-bold text-[#1F2420] focus:outline-none ${
                          usernameStatus.isAvailable === false
                            ? 'border-red-400 focus:border-red-500'
                            : usernameStatus.isAvailable
                            ? 'border-[#0F6B5C] focus:border-[#0F6B5C]'
                            : 'border-[#E8E3DC] focus:border-[#0F6B5C]'
                        }`}
                      />
                    </div>
                    <p className="text-[10px] text-[#8A8D89] mt-0.5">
                      Your public showcase link: <strong className="text-[#0F6B5C]">plottyy.pk/agents/{profUsername || 'handle'}</strong>
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#1F2420]">
                      Official Calling & WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={profPhone}
                      onChange={(e) => setProfPhone(e.target.value)}
                      className="w-full mt-1 bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-xl px-3.5 py-2 text-xs font-bold text-[#1F2420] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#1F2420]">
                      Government Registration / License No.
                    </label>
                    <input
                      type="text"
                      value={profLicense}
                      onChange={(e) => setProfLicense(e.target.value)}
                      placeholder="e.g. LDA-REG-2024-8841"
                      className="w-full mt-1 bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-xl px-3.5 py-2 text-xs font-bold text-[#1F2420] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#1F2420]">
                      Specialized Operating Societies (Comma Separated)
                    </label>
                    <input
                      type="text"
                      value={profOperatingAreas}
                      onChange={(e) => setProfOperatingAreas(e.target.value)}
                      placeholder="e.g. DHA Phase 6, Bahria Town, Gulberg III"
                      className="w-full mt-1 bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-xl px-3.5 py-2 text-xs font-bold text-[#1F2420] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#1F2420]">
                    Head Office / Branch Address
                  </label>
                  <input
                    type="text"
                    value={profAddress}
                    onChange={(e) => setProfAddress(e.target.value)}
                    placeholder="e.g. Plaza 14, Commercial Broadway, DHA Phase 6, Lahore"
                    className="w-full mt-1 bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-xl px-3.5 py-2 text-xs font-bold text-[#1F2420] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#1F2420]">
                    Agency Bio & Track Record
                  </label>
                  <textarea
                    rows={3}
                    value={profBio}
                    onChange={(e) => setProfBio(e.target.value)}
                    placeholder="Describe your market track record, verified deals, and specialty areas..."
                    className="w-full mt-1 bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-xl p-3 text-xs text-[#1F2420] focus:outline-none"
                  />
                </div>
              </div>

              {/* Social Media Channels */}
              <div className="space-y-3 bg-[#FAF8F5] p-5 rounded-2xl border border-[#E8E3DC]">
                <h4 className="text-xs font-bold text-[#8A8D89] uppercase tracking-wider">
                  Official Website & Social Media Channels
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-[#1F2420]">Official Website URL</label>
                    <input
                      type="url"
                      value={profWebsite}
                      onChange={(e) => setProfWebsite(e.target.value)}
                      placeholder="https://youragency.pk"
                      className="w-full mt-1 bg-white border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-xl px-3 py-2 text-xs text-[#1F2420] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#1F2420]">Facebook Page URL</label>
                    <input
                      type="url"
                      value={profFacebook}
                      onChange={(e) => setProfFacebook(e.target.value)}
                      placeholder="https://facebook.com/youragency"
                      className="w-full mt-1 bg-white border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-xl px-3 py-2 text-xs text-[#1F2420] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#1F2420]">Instagram Handle / URL</label>
                    <input
                      type="text"
                      value={profInstagram}
                      onChange={(e) => setProfInstagram(e.target.value)}
                      placeholder="https://instagram.com/youragency"
                      className="w-full mt-1 bg-white border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-xl px-3 py-2 text-xs text-[#1F2420] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#1F2420]">YouTube Channel URL</label>
                    <input
                      type="url"
                      value={profYoutube}
                      onChange={(e) => setProfYoutube(e.target.value)}
                      placeholder="https://youtube.com/@youragency"
                      className="w-full mt-1 bg-white border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-xl px-3 py-2 text-xs text-[#1F2420] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="submit"
                  className="bg-[#0F6B5C] hover:bg-[#0c564a] text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center space-x-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Agency Profile</span>
                </button>

                {profSaved && (
                  <span className="text-xs font-bold text-[#0F6B5C] flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4 text-[#7FA37A]" />
                    <span>Profile updated successfully!</span>
                  </span>
                )}
              </div>
            </form>

            {/* Trust & Verification Badges */}
            <div className="space-y-3 text-xs pt-4 border-t border-[#E8E3DC]">
              <h4 className="font-bold text-[#1F2420] uppercase tracking-wider">
                Verification & Trust Score
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#EFF6EE] text-[#0F6B5C] font-semibold border border-[#7FA37A]/30">
                  <span>1. Phone Number Verified (OTP)</span>
                  <span>✓ 100% Verified</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#EFF6EE] text-[#0F6B5C] font-semibold border border-[#7FA37A]/30">
                  <span>2. Society Dealer Affiliation Verified</span>
                  <span>✓ Complete (LDA / CDA Network)</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#EFF6EE] text-[#0F6B5C] font-semibold border border-[#7FA37A]/30">
                  <span>3. Title Deed Authenticity Review</span>
                  <span>✓ 100% Clear</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Bulk Import Feed Modal */}
      <BulkImportModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onSuccess={() => {
          setImportModalOpen(false);
          window.location.reload();
        }}
      />

    </div>
  );
}
