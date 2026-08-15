'use client';

import React, { useRef } from 'react';
import { Listing } from '@/types';
import { formatPKR, getPKRInWords, convertToSqft } from '@/lib/constants';
import { 
  FileDown, 
  Printer, 
  X, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  MessageCircle, 
  ShieldCheck, 
  Building2,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

interface PropertyBrochureModalProps {
  listing: Listing;
  isOpen: boolean;
  onClose: () => void;
}

export function PropertyBrochureModal({
  listing,
  isOpen,
  onClose,
}: PropertyBrochureModalProps) {
  const printableRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const coverPhoto = listing.photos?.find((p) => p.is_cover)?.url || listing.photos?.[0]?.url;
  const subPhotos = listing.photos?.filter((p) => p.url !== coverPhoto).slice(0, 3) || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:static">
      
      <div className="relative w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#E8E3DC] my-8 print:border-none print:shadow-none print:m-0 print:rounded-none">
        
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#FAF8F5] border-b border-[#E8E3DC] print:hidden">
          <div className="flex items-center space-x-2">
            <FileDown className="w-5 h-5 text-[#0F6B5C]" />
            <h3 className="text-sm font-extrabold text-[#1F2420]">Official Property Dossier & PDF Brochure</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center space-x-1.5 bg-[#0F6B5C] hover:bg-[#0c564a] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-[#E8E3DC]/60 rounded-xl text-[#8A8D89] transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Brochure Canvas */}
        <div ref={printableRef} className="p-8 space-y-6 bg-white text-[#1F2420]">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b-2 border-[#0F6B5C] pb-4">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-xl bg-[#0F6B5C] flex items-center justify-center text-white font-black text-lg">
                P
              </div>
              <div>
                <h1 className="text-xl font-black text-[#0F6B5C] tracking-tight leading-none">
                  plottyy<span className="text-[#D97B4F]">.pk</span>
                </h1>
                <p className="text-[9px] font-bold text-[#8A8D89] uppercase tracking-wider">
                  Verified Real Estate Marketplace
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center space-x-1 bg-[#E6F3F0] text-[#0F6B5C] text-[10px] font-extrabold px-2.5 py-1 rounded-md">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Phone Verified Listing</span>
              </span>
              <p className="text-[10px] text-[#8A8D89] mt-1">Ref ID: {listing.id.toUpperCase()}</p>
            </div>
          </div>

          {/* Title & Price Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97B4F]">
                {listing.purpose === 'sale' ? 'For Sale' : 'For Rent'} • {listing.subtype || listing.property_type}
              </span>
              <h2 className="text-xl font-black text-[#1F2420]">{listing.title}</h2>
              <div className="flex items-center space-x-1 text-xs text-[#8A8D89]">
                <MapPin className="w-3.5 h-3.5 text-[#0F6B5C]" />
                <span>{listing.address_details || `${listing.location?.name}, ${listing.city?.name}`}</span>
              </div>
            </div>

            <div className="text-left sm:text-right bg-[#FAF8F5] p-3 rounded-2xl border border-[#E8E3DC]">
              <p className="text-xs font-bold text-[#8A8D89]">Demanded Price</p>
              <p className="text-2xl font-black text-[#0F6B5C]">{formatPKR(listing.price)}</p>
              <p className="text-[10px] font-bold text-[#D97B4F]">{getPKRInWords(listing.price)}</p>
            </div>
          </div>

          {/* Photos Grid with Watermark */}
          {coverPhoto && (
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 relative h-60 rounded-2xl overflow-hidden bg-gray-100">
                <img
                  src={coverPhoto}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
                {/* Watermark */}
                <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
                  plottyy.pk • @{listing.user?.username || 'verified'}
                </div>
              </div>
              <div className="col-span-1 space-y-3">
                {subPhotos.length > 0 ? (
                  subPhotos.map((p, idx) => (
                    <div key={idx} className="relative h-28 rounded-2xl overflow-hidden bg-gray-100">
                      <img src={p.url} alt="" className="w-full h-full object-cover" />
                      <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                        plottyy.pk
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-60 rounded-2xl bg-[#FAF8F5] border border-dashed border-[#E8E3DC] flex items-center justify-center text-center p-4 text-xs text-[#8A8D89]">
                    Verified Prime Plot Inventory
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Specs Table */}
          <div className="grid grid-cols-4 gap-3 bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E3DC] text-center">
            <div>
              <p className="text-[10px] font-bold text-[#8A8D89] uppercase">Plot / Land Size</p>
              <p className="text-sm font-black text-[#1F2420]">
                {listing.size} {listing.size_unit.toUpperCase()}
              </p>
              <p className="text-[10px] text-[#6B726D]">({listing.size_in_sqft || convertToSqft(listing.size, listing.size_unit)} Sq. Ft)</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#8A8D89] uppercase">Facing / Orientation</p>
              <p className="text-sm font-black text-[#1F2420]">{listing.facing || 'Direct Access'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#8A8D89] uppercase">Possession Status</p>
              <p className="text-sm font-black text-[#0F6B5C]">
                {listing.features?.includes('possession_paid') ? '100% Paid' : 'Standard'}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#8A8D89] uppercase">City Authority</p>
              <p className="text-sm font-black text-[#1F2420]">{listing.city?.name || 'Pakistan'}</p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-[#8A8D89] uppercase tracking-wider">Property Overview & Highlights</h4>
            <p className="text-xs text-[#4A4E4B] leading-relaxed line-clamp-4">
              {listing.description}
            </p>
          </div>

          {/* Features Badges */}
          {listing.features && listing.features.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {listing.features.map((f) => (
                <span
                  key={f}
                  className="bg-white border border-[#E8E3DC] text-[#1F2420] text-[10px] font-bold px-2.5 py-1 rounded-lg"
                >
                  ✓ {f.replace(/_/g, ' ').toUpperCase()}
                </span>
              ))}
            </div>
          )}

          {/* Listing Agent Contact Footer */}
          <div className="border-t border-[#E8E3DC] pt-4 flex items-center justify-between bg-[#0F6B5C]/5 p-4 rounded-2xl border border-[#0F6B5C]/20">
            <div className="flex items-center space-x-3">
              {listing.user?.avatar_url && (
                <img
                  src={listing.user.avatar_url}
                  alt={listing.user.full_name}
                  className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-xs"
                />
              )}
              <div>
                <p className="text-xs font-black text-[#1F2420]">{listing.user?.full_name || 'Verified Realtor'}</p>
                <p className="text-[11px] font-bold text-[#0F6B5C]">{listing.user?.agency_name || 'Direct Property Owner'}</p>
                <p className="text-[10px] text-[#8A8D89]">License: {listing.user?.license_number || 'REG-PK-2026'}</p>
              </div>
            </div>

            <div className="text-right space-y-1">
              <p className="text-xs font-black text-[#0F6B5C] flex items-center justify-end space-x-1">
                <Phone className="w-3.5 h-3.5" />
                <span>{listing.contact_phone || listing.user?.phone_number}</span>
              </p>
              <p className="text-[10px] text-[#6B726D]">
                Online Profile: <strong>plottyy.pk/agents/{listing.user?.username || 'agent'}</strong>
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
