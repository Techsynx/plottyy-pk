'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShieldCheck, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Phone, 
  MessageCircle, 
  Heart, 
  Eye,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { Listing } from '@/types';
import { formatPKR, formatSize } from '@/lib/constants';
import { recordLead } from '@/lib/actions/leads';

interface ListingCardProps {
  listing: Listing;
  priority?: boolean;
}

export function ListingCard({ listing, priority = false }: ListingCardProps) {
  const [showPhone, setShowPhone] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const coverPhoto = listing.photos?.find((p) => p.is_cover) || listing.photos?.[0] || {
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
    alt_text: listing.title,
  };

  const handleRevealPhone = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPhone(true);
    await recordLead({
      listingId: listing.id,
      leadType: 'phone_reveal',
    });
  };

  const handleWhatsAppClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await recordLead({
      listingId: listing.id,
      leadType: 'whatsapp_click',
    });
  };

  const whatsappMessage = encodeURIComponent(
    `Assalam o Alaikum, I am interested in your property on plottyy: "${listing.title}" priced at ${formatPKR(listing.price)} (${listing.size} ${listing.size_unit}). Is it available?`
  );
  const cleanPhone = (listing.contact_whatsapp || listing.contact_phone).replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappMessage}`;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-[#E8E3DC] hover:border-[#0F6B5C]/40 property-card-shadow transition-all duration-200 flex flex-col h-full">
      
      {/* Photo Container */}
      <Link href={`/listings/${listing.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-[#F3EFEA]">
        <img
          src={coverPhoto.url}
          alt={coverPhoto.alt_text || listing.title}
          loading={priority ? 'eager' : 'lazy'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient Overlay for Top Badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none"></div>

        {/* Top Badges: Purpose & Verified Status */}
        <div className="absolute top-3 left-3 flex items-center space-x-1.5 z-10">
          <span className="bg-[#0F6B5C] text-white text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
            {listing.purpose === 'sale' ? 'For Sale' : 'For Rent'}
          </span>
          {listing.is_verified && (
            <span className="bg-[#7FA37A] text-white text-[11px] font-semibold px-2 py-1 rounded-md flex items-center space-x-1 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified</span>
            </span>
          )}
        </div>

        {/* Top Right: Favorite Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsFavorited(!isFavorited);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
            isFavorited
              ? 'bg-red-500 text-white'
              : 'bg-black/30 text-white hover:bg-black/50'
          }`}
          aria-label="Save Property"
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* Bottom Photo Overlay: Price & Size */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white z-10">
          <div>
            <div className="text-xl sm:text-2xl font-extrabold tracking-tight leading-none text-white drop-shadow-md">
              {formatPKR(listing.price, listing.purpose === 'rent')}
            </div>
            <div className="text-xs text-white/90 font-medium mt-1 drop-shadow">
              {formatSize(listing.size, listing.size_unit)}
              <span className="text-white/70 ml-1">({listing.size_in_sqft.toLocaleString()} sq. ft)</span>
            </div>
          </div>

          {/* Photo Count Badge */}
          <span className="text-[11px] bg-black/40 backdrop-blur px-2 py-0.5 rounded text-white/90">
            📷 {listing.photos?.length || 1}
          </span>
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        
        <div className="space-y-2">
          {/* Location Line */}
          <div className="flex items-center text-xs text-[#6B726D] font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#0F6B5C] mr-1.5 flex-shrink-0" />
            <span className="truncate">
              {listing.location?.name || 'Prime Location'}, {listing.city?.name}
            </span>
          </div>

          {/* Listing Title */}
          <Link href={`/listings/${listing.slug}`} className="block">
            <h3 className="text-sm sm:text-base font-bold text-[#1F2420] hover:text-[#0F6B5C] line-clamp-2 transition-colors leading-snug">
              {listing.title}
            </h3>
          </Link>

          {/* Key Specs: Beds / Baths / Type */}
          <div className="flex items-center space-x-3 text-xs text-[#6B726D] pt-1">
            <span className="inline-flex items-center bg-[#FAF8F5] border border-[#E8E3DC] px-2 py-0.5 rounded font-medium text-[#1F2420]">
              {listing.subtype?.replace(/_/g, ' ') || listing.property_type}
            </span>
            {listing.bedrooms ? (
              <span className="flex items-center space-x-1">
                <Bed className="w-3.5 h-3.5 text-[#8A8D89]" />
                <span>{listing.bedrooms} Beds</span>
              </span>
            ) : null}
            {listing.bathrooms ? (
              <span className="flex items-center space-x-1">
                <Bath className="w-3.5 h-3.5 text-[#8A8D89]" />
                <span>{listing.bathrooms} Baths</span>
              </span>
            ) : null}
            {listing.facing && (
              <span className="text-[11px] text-[#8A8D89] truncate">
                • {listing.facing}
              </span>
            )}
          </div>
        </div>

        {/* Footer: Lister Info & Contact Actions */}
        <div className="pt-3 border-t border-[#E8E3DC] flex items-center justify-between gap-2">
          
          {/* Lister Identity */}
          <div className="flex items-center space-x-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-[#E6F3F0] text-[#0F6B5C] font-bold text-xs flex items-center justify-center flex-shrink-0">
              {listing.user?.full_name?.charAt(0) || 'L'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#1F2420] truncate">
                {listing.user?.agency_name || listing.user?.full_name || 'Verified Owner'}
              </p>
              <p className="text-[10px] text-[#8A8D89]">
                Posted {new Date(listing.created_at).toLocaleDateString('en-PK', { month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Action Buttons: Show Phone & WhatsApp */}
          <div className="flex items-center space-x-1.5 flex-shrink-0">
            {showPhone ? (
              <a
                href={`tel:${listing.contact_phone}`}
                className="bg-[#0F6B5C] text-white text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center space-x-1 hover:bg-[#0c564a]"
              >
                <Phone className="w-3 h-3" />
                <span className="text-[11px]">{listing.contact_phone}</span>
              </a>
            ) : (
              <button
                type="button"
                onClick={handleRevealPhone}
                className="bg-[#FAF8F5] hover:bg-[#E6F3F0] text-[#0F6B5C] border border-[#0F6B5C]/30 text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center space-x-1 transition-all"
                title="Click to reveal phone number"
              >
                <Phone className="w-3 h-3" />
                <span>Call</span>
              </button>
            )}

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsAppClick}
              className="bg-[#25D366] hover:bg-[#20b858] text-white p-1.5 rounded-lg transition-colors shadow-sm"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>

        </div>

      </div>

    </div>
  );
}
