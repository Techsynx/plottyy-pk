'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Profile, Listing } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { ListingCard } from '@/components/listings/ListingCard';
import { 
  Building2, 
  ShieldCheck, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Star, 
  Globe, 
  Share2, 
  ChevronLeft, 
  Edit3,
  X,
  UploadCloud,
  Save,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface AgentProfileViewProps {
  initialAgent: Profile | null;
  initialListings: Listing[];
  handleOrId: string;
}

export function AgentProfileView({
  initialAgent,
  initialListings,
  handleOrId,
}: AgentProfileViewProps) {
  const { user, updateProfile } = useAuth();
  const [agent, setAgent] = useState<Profile | null>(initialAgent);
  const [copied, setCopied] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Edit form state
  const [editFullName, setEditFullName] = useState('');
  const [editAgencyName, setEditAgencyName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editLicense, setEditLicense] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatarUrl, setEditAvatarUrl] = useState('');
  const [editCoverUrl, setEditCoverUrl] = useState('');
  const [editOperatingAreas, setEditOperatingAreas] = useState('');
  const [editWebsite, setEditWebsite] = useState('');
  const [editFacebook, setEditFacebook] = useState('');
  const [editInstagram, setEditInstagram] = useState('');
  const [editLinkedin, setEditLinkedin] = useState('');
  const [editYoutube, setEditYoutube] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (!agent) {
      if (user && (user.username?.toLowerCase() === handleOrId.toLowerCase() || user.id === handleOrId)) {
        setAgent(user);
        return;
      }

      try {
        const stored = localStorage.getItem('plottyy_registered_profiles');
        if (stored) {
          const parsed: Profile[] = JSON.parse(stored);
          const found = parsed.find(
            (p) => p.username?.toLowerCase() === handleOrId.toLowerCase() || p.id === handleOrId
          );
          if (found) {
            setAgent(found);
          }
        }
      } catch (e) {}
    }
  }, [agent, user, handleOrId]);

  // Sync edit form with current agent
  useEffect(() => {
    if (agent) {
      setEditFullName(agent.full_name || '');
      setEditAgencyName(agent.agency_name || '');
      setEditPhone(agent.phone_number || '');
      setEditAddress(agent.office_address || '');
      setEditLicense(agent.license_number || '');
      setEditBio(agent.bio || '');
      setEditAvatarUrl(agent.avatar_url || '');
      setEditCoverUrl(agent.cover_url || '');
      setEditOperatingAreas(agent.operating_areas?.join(', ') || 'DHA Defence, Bahria Town');
      setEditWebsite(agent.website || '');
      setEditFacebook(agent.social_links?.facebook || '');
      setEditInstagram(agent.social_links?.instagram || '');
      setEditLinkedin(agent.social_links?.linkedin || '');
      setEditYoutube(agent.social_links?.youtube || '');
    }
  }, [agent]);

  const isOwner = user && agent && (user.id === agent.id || user.username?.toLowerCase() === agent.username?.toLowerCase());

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) setEditAvatarUrl(ev.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCoverFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) setEditCoverUrl(ev.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const areas = editOperatingAreas.split(',').map((s) => s.trim()).filter(Boolean);

    const updatedProfile: Partial<Profile> = {
      full_name: editFullName,
      agency_name: editAgencyName,
      phone_number: editPhone,
      office_address: editAddress,
      license_number: editLicense,
      bio: editBio,
      avatar_url: editAvatarUrl,
      cover_url: editCoverUrl,
      operating_areas: areas.length > 0 ? areas : ['DHA Defence', 'Bahria Town'],
      website: editWebsite || null,
      social_links: {
        facebook: editFacebook,
        instagram: editInstagram,
        linkedin: editLinkedin,
        youtube: editYoutube,
      },
    };

    await updateProfile(updatedProfile);
    if (agent) {
      setAgent({ ...agent, ...updatedProfile } as Profile);
    }

    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsEditModalOpen(false);
    }, 1200);
  };

  if (!agent) {
    return (
      <div className="min-h-[70vh] bg-[#FAF8F5] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#E8E3DC] shadow-sm text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
            <Building2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-black text-[#1F2420]">Agency Profile Not Found</h2>
            <p className="text-xs text-[#8A8D89]">
              The agency handle <strong className="text-[#0F6B5C]">@{handleOrId}</strong> has not been claimed yet or is awaiting publication.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <Link
              href="/agents"
              className="flex-1 bg-[#0F6B5C] hover:bg-[#0c564a] text-white py-3 rounded-xl text-xs font-bold transition-all text-center shadow-xs"
            >
              Browse Certified Agencies
            </Link>
            <Link
              href="/create"
              className="flex-1 bg-white hover:bg-[#FAF8F5] border border-[#E8E3DC] text-[#1F2420] py-3 rounded-xl text-xs font-bold transition-all text-center"
            >
              Claim Your Handle
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const agentListings = initialListings.filter(
    (l) => l.user_id === agent.id || l.user?.username === agent.username
  );

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-20">
      
      {/* Hero Agency Cover Banner */}
      <div className="h-64 sm:h-80 bg-gradient-to-r from-[#0F6B5C] via-[#164e44] to-[#0A3E35] relative overflow-hidden">
        {agent.cover_url ? (
          <img
            src={agent.cover_url}
            alt={agent.agency_name || agent.full_name}
            className="w-full h-full object-cover opacity-40"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#0F6B5C] to-[#083830]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
        
        {/* Top Breadcrumb & Actions */}
        <div className="absolute top-6 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link
            href="/agents"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-white/90 hover:text-white bg-black/30 hover:bg-black/50 backdrop-blur px-3 py-1.5 rounded-xl border border-white/15 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>All Agencies</span>
          </Link>

          <div className="flex items-center space-x-2">
            {isOwner && (
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-[#D97B4F] hover:bg-[#c4683c] px-3.5 py-1.5 rounded-xl shadow-xs transition-all"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit My Profile</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-black/30 hover:bg-black/50 backdrop-blur px-3.5 py-1.5 rounded-xl border border-white/15 transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-28 relative z-10 space-y-8">
        
        {/* Main Agency Identity Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E3DC] shadow-sm space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E8E3DC]">
            
            {/* Avatar & Title */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-5">
              <div className="relative flex-shrink-0">
                <img
                  src={agent.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400'}
                  alt={agent.full_name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-white shadow-md bg-white"
                />
                {agent.is_verified && (
                  <div className="absolute -bottom-1.5 -right-1.5 bg-[#0F6B5C] text-white p-1 rounded-full border-2 border-white shadow-xs" title="Verified Agency Partner">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center space-x-1 text-[11px] font-extrabold bg-[#E6F3F0] text-[#0F6B5C] px-2.5 py-0.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Certified Agency Partner</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-[#8A8D89] bg-[#FAF8F5] px-2 py-0.5 rounded-md border border-[#E8E3DC]">
                    @{agent.username || 'verified'}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-[#1F2420] tracking-tight">
                  {agent.full_name}
                </h1>
                
                <p className="text-sm font-bold text-[#0F6B5C]">
                  {agent.agency_name || `${agent.full_name} Real Estate`}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-[#8A8D89] pt-1">
                  {agent.license_number && (
                    <span className="font-mono">License: <strong className="text-[#1F2420]">{agent.license_number}</strong></span>
                  )}
                  {agent.office_address && (
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-[#0F6B5C]" />
                      <span className="truncate max-w-xs">{agent.office_address}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Direct Contact & Edit CTAs */}
            <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
              {isOwner && (
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 bg-[#E6F3F0] hover:bg-[#d8ece7] text-[#0F6B5C] border border-[#0F6B5C]/20 px-4 py-3 rounded-2xl font-bold text-xs transition-all"
                >
                  <Edit3 className="w-4 h-4 text-[#D97B4F]" />
                  <span>Edit Profile</span>
                </button>
              )}

              <a
                href={`tel:${agent.phone_number.replace(/\s+/g, '')}`}
                className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-[#0F6B5C] hover:bg-[#0c564a] text-white px-5 py-3 rounded-2xl font-bold text-xs shadow-xs transition-all"
              >
                <Phone className="w-4 h-4" />
                <span>Call {agent.phone_number}</span>
              </a>

              <a
                href={`https://wa.me/${agent.phone_number.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-5 py-3 rounded-2xl font-bold text-xs shadow-xs transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>

          </div>

          {/* Bio & Social Hub */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
            
            {/* Bio Column */}
            <div className="lg:col-span-2 space-y-2">
              <h4 className="text-xs font-extrabold text-[#8A8D89] uppercase tracking-wider">
                About Agency & Track Record
              </h4>
              <p className="text-xs sm:text-sm text-[#4A4E4B] leading-relaxed">
                {agent.bio || 'Professional real estate consultancy dedicated to transparent plot purchases, residential sales, and verified title deed transfers in Pakistan.'}
              </p>
            </div>

            {/* Stats & Social Links */}
            <div className="space-y-3 bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E3DC]">
              <h4 className="text-xs font-extrabold text-[#8A8D89] uppercase tracking-wider">
                Verified Credentials & Social
              </h4>
              
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-white p-2 rounded-xl border border-[#E8E3DC]">
                  <p className="text-base font-black text-[#0F6B5C]">{agentListings.length}</p>
                  <p className="text-[10px] text-[#8A8D89] font-bold">Active Listings</p>
                </div>
                <div className="bg-white p-2 rounded-xl border border-[#E8E3DC]">
                  <p className="text-base font-black text-amber-500">★ {agent.rating || 5.0}</p>
                  <p className="text-[10px] text-[#8A8D89] font-bold">Verified Rating</p>
                </div>
              </div>

              {/* Social Channels */}
              <div className="flex items-center space-x-2 pt-1">
                {agent.social_links?.facebook && (
                  <a href={agent.social_links.facebook} target="_blank" rel="noopener noreferrer" className="p-2 bg-white rounded-xl border border-[#E8E3DC] text-blue-600 hover:border-blue-600" title="Facebook">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                )}
                {agent.social_links?.instagram && (
                  <a href={agent.social_links.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-white rounded-xl border border-[#E8E3DC] text-pink-600 hover:border-pink-600" title="Instagram">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                )}
                {agent.social_links?.linkedin && (
                  <a href={agent.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-white rounded-xl border border-[#E8E3DC] text-blue-700 hover:border-blue-700" title="LinkedIn">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </a>
                )}
                {agent.social_links?.youtube && (
                  <a href={agent.social_links.youtube} target="_blank" rel="noopener noreferrer" className="p-2 bg-white rounded-xl border border-[#E8E3DC] text-red-600 hover:border-red-600" title="YouTube">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </a>
                )}
                {agent.website && (
                  <a href={agent.website} target="_blank" rel="noopener noreferrer" className="p-2 bg-white rounded-xl border border-[#E8E3DC] text-[#0F6B5C] hover:border-[#0F6B5C]" title="Official Website">
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

          </div>

          {/* Operating Societies Chips */}
          {agent.operating_areas && agent.operating_areas.length > 0 && (
            <div className="pt-2 border-t border-[#E8E3DC] space-y-2">
              <h4 className="text-xs font-extrabold text-[#8A8D89] uppercase tracking-wider">
                Specialized Societies & Operating Sectors
              </h4>
              <div className="flex flex-wrap gap-2">
                {agent.operating_areas.map((area) => (
                  <span
                    key={area}
                    className="bg-[#FAF8F5] border border-[#E8E3DC] text-[#1F2420] text-xs font-bold px-3 py-1 rounded-xl"
                  >
                    📍 {area}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Agency Listings Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-[#1F2420]">
                Active Inventory by {agent.agency_name || agent.full_name}
              </h2>
              <p className="text-xs text-[#8A8D89]">
                Showing {agentListings.length} direct, verified properties available for sale and rent
              </p>
            </div>
          </div>

          {agentListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agentListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 border border-[#E8E3DC] text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#0F6B5C]/10 text-[#0F6B5C] mx-auto flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#1F2420]">No Active Listings Right Now</h3>
              <p className="text-xs text-[#8A8D89] max-w-sm mx-auto">
                This agency is currently updating its plot inventory. Check back soon or contact them directly on WhatsApp.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* QUICK PROFILE EDIT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-[#E8E3DC] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto animate-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[#E8E3DC] bg-[#FAF8F5]/60 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#0F6B5C] flex items-center justify-center text-white font-black text-sm">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-[#1F2420]">
                    Edit Public Agency Profile
                  </h3>
                  <p className="text-[10px] text-[#8A8D89]">
                    Updates appear live immediately on your public showcase
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-xl text-[#8A8D89] hover:bg-black/5 hover:text-[#1F2420] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProfileSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 text-left">
              
              {/* Photo & Banner Upload */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E3DC]">
                <div>
                  <label className="text-xs font-bold text-[#1F2420] block mb-1.5">
                    Profile Picture / Headshot
                  </label>
                  <div className="flex items-center space-x-3">
                    <img
                      src={editAvatarUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200'}
                      alt="Avatar"
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-xs bg-white flex-shrink-0"
                    />
                    <label className="cursor-pointer bg-white border border-[#E8E3DC] hover:border-[#0F6B5C] text-[#1F2420] px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5">
                      <UploadCloud className="w-3.5 h-3.5 text-[#0F6B5C]" />
                      <span>Change Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarFile}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#1F2420] block mb-1.5">
                    Agency Cover Banner
                  </label>
                  <div className="space-y-1.5">
                    <div className="h-10 rounded-xl overflow-hidden bg-gray-200 border border-[#E8E3DC]">
                      {editCoverUrl ? (
                        <img src={editCoverUrl} alt="Cover" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-[#0F6B5C] to-[#0A3E35]" />
                      )}
                    </div>
                    <label className="cursor-pointer inline-flex bg-white border border-[#E8E3DC] hover:border-[#0F6B5C] text-[#1F2420] px-3 py-1 rounded-xl text-xs font-bold transition-all shadow-xs items-center space-x-1">
                      <UploadCloud className="w-3 h-3 text-[#0F6B5C]" />
                      <span>Upload Banner</span>
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

              {/* Name & Agency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#1F2420]">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editFullName}
                    onChange={(e) => setEditFullName(e.target.value)}
                    className="w-full mt-1 bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-xl px-3 py-2 text-xs font-bold text-[#1F2420] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#1F2420]">Agency / Brokerage Name</label>
                  <input
                    type="text"
                    required
                    value={editAgencyName}
                    onChange={(e) => setEditAgencyName(e.target.value)}
                    className="w-full mt-1 bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-xl px-3 py-2 text-xs font-bold text-[#1F2420] focus:outline-none"
                  />
                </div>
              </div>

              {/* Phone & License */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#1F2420]">WhatsApp & Calling Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="0326 8282409"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full mt-1 bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-xl px-3 py-2 text-xs font-bold text-[#1F2420] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#1F2420]">License / Reg No.</label>
                  <input
                    type="text"
                    placeholder="e.g. LDA-REG-2024-8841"
                    value={editLicense}
                    onChange={(e) => setEditLicense(e.target.value)}
                    className="w-full mt-1 bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-xl px-3 py-2 text-xs font-bold text-[#1F2420] focus:outline-none"
                  />
                </div>
              </div>

              {/* Operating Areas & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#1F2420]">Specialized Societies (Comma Separated)</label>
                  <input
                    type="text"
                    placeholder="DHA Phase 6, Bahria Town, Gulberg"
                    value={editOperatingAreas}
                    onChange={(e) => setEditOperatingAreas(e.target.value)}
                    className="w-full mt-1 bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-xl px-3 py-2 text-xs font-bold text-[#1F2420] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#1F2420]">Office Address</label>
                  <input
                    type="text"
                    placeholder="Plaza 14, Commercial Broadway, DHA Phase 6, Lahore"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="w-full mt-1 bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-xl px-3 py-2 text-xs font-bold text-[#1F2420] focus:outline-none"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="text-[11px] font-bold text-[#1F2420]">About Agency / Bio</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Share your verified track record, specialized projects, and investment advisory..."
                  className="w-full mt-1 bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-xl p-3 text-xs text-[#1F2420] focus:outline-none"
                />
              </div>

              {/* Social Channels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E8E3DC]">
                <div>
                  <label className="text-[10px] font-bold text-[#8A8D89] uppercase">Website URL</label>
                  <input
                    type="url"
                    placeholder="https://agency.pk"
                    value={editWebsite}
                    onChange={(e) => setEditWebsite(e.target.value)}
                    className="w-full mt-1 bg-white border border-[#E8E3DC] rounded-xl px-2.5 py-1.5 text-xs text-[#1F2420] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#8A8D89] uppercase">Facebook URL</label>
                  <input
                    type="url"
                    placeholder="https://facebook.com/page"
                    value={editFacebook}
                    onChange={(e) => setEditFacebook(e.target.value)}
                    className="w-full mt-1 bg-white border border-[#E8E3DC] rounded-xl px-2.5 py-1.5 text-xs text-[#1F2420] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#8A8D89] uppercase">Instagram URL</label>
                  <input
                    type="text"
                    placeholder="https://instagram.com/page"
                    value={editInstagram}
                    onChange={(e) => setEditInstagram(e.target.value)}
                    className="w-full mt-1 bg-white border border-[#E8E3DC] rounded-xl px-2.5 py-1.5 text-xs text-[#1F2420] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#8A8D89] uppercase">YouTube URL</label>
                  <input
                    type="url"
                    placeholder="https://youtube.com/@channel"
                    value={editYoutube}
                    onChange={(e) => setEditYoutube(e.target.value)}
                    className="w-full mt-1 bg-white border border-[#E8E3DC] rounded-xl px-2.5 py-1.5 text-xs text-[#1F2420] focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center space-x-2 pt-2 border-t border-[#E8E3DC]">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 bg-white border border-[#E8E3DC] hover:bg-[#FAF8F5] text-[#1F2420] py-2.5 rounded-xl font-bold text-xs transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-[#0F6B5C] hover:bg-[#0c564a] text-white py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center space-x-1.5"
                >
                  {isSaving ? (
                    <span>Saving...</span>
                  ) : saveSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>Updated!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
