'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Listing } from '@/types';
import { formatPKR, formatSize, AMENITY_TAGS } from '@/lib/constants';
import { 
  MapPin, 
  ShieldCheck, 
  Calendar, 
  Eye, 
  Maximize2, 
  Bed, 
  Bath, 
  Layers, 
  Compass, 
  ChevronRight,
  Share2,
  CheckCircle2,
  Building2,
  ArrowRight
} from 'lucide-react';
import { ContactSidebar } from '@/components/listings/ContactSidebar';
import { DetailGallery } from '@/components/listings/DetailGallery';
import { ListingCard } from '@/components/listings/ListingCard';
import { ListingInteractiveActions } from '@/components/listings/ListingInteractiveActions';

interface ListingDetailClientViewProps {
  initialListing: Listing | null;
  slug: string;
  similarListings: Listing[];
}

export function ListingDetailClientView({
  initialListing,
  slug,
  similarListings,
}: ListingDetailClientViewProps) {
  const [listing, setListing] = useState<Listing | null>(initialListing);

  useEffect(() => {
    if (!listing) {
      try {
        const stored = localStorage.getItem('plottyy_user_listings');
        if (stored) {
          const list: Listing[] = JSON.parse(stored);
          const found = list.find((l) => l.slug === slug || l.id === slug);
          if (found) {
            setListing(found);
          }
        }
      } catch (e) {}
    }
  }, [listing, slug]);

  if (!listing) {
    return (
      <div className="min-h-[70vh] bg-[#FAF8F5] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#E8E3DC] shadow-sm text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
            <Building2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-black text-[#1F2420]">Property Listing Not Found</h2>
            <p className="text-xs text-[#8A8D89]">
              This property may have been sold, archived, or is awaiting publication.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <Link
              href="/listings"
              className="flex-1 bg-[#0F6B5C] hover:bg-[#0c564a] text-white py-3 rounded-xl text-xs font-bold transition-all text-center shadow-xs"
            >
              Browse Verified Listings
            </Link>
            <Link
              href="/create"
              className="flex-1 bg-white hover:bg-[#FAF8F5] border border-[#E8E3DC] text-[#1F2420] py-3 rounded-xl text-xs font-bold transition-all text-center"
            >
              List a Property
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const pricePerMarla = listing.size_in_sqft > 0
    ? (listing.price / (listing.size_in_sqft / 225))
    : 0;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: listing.title,
    description: listing.description,
    url: `https://plotty.unicorn-realtors.com/listings/${listing.slug}`,
    datePosted: listing.created_at,
    price: listing.price,
    priceCurrency: 'PKR',
    address: {
      '@type': 'PostalAddress',
      addressLocality: listing.city?.name,
      addressRegion: listing.city?.province,
      streetAddress: listing.address_details || listing.location?.name,
      addressCountry: 'PK',
    },
    image: listing.photos?.map((p) => p.url) || [],
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-6 sm:py-10">
      
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs text-[#8A8D89] overflow-x-auto pb-1">
          <Link href="/" className="hover:text-[#0F6B5C] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <Link href={`/listings?city=${listing.city?.name || 'Lahore'}`} className="hover:text-[#0F6B5C] transition-colors">
            {listing.city?.name || 'Pakistan'}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <Link href={`/listings?type=${listing.property_type}`} className="hover:text-[#0F6B5C] transition-colors capitalize">
            {listing.property_type}s
          </Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-[#1F2420] font-semibold truncate max-w-[200px] sm:max-w-none">
            {listing.location?.name || 'Verified Area'}
          </span>
        </nav>

        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-2 border-b border-[#E8E3DC]">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#0F6B5C] text-white text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                {listing.purpose === 'sale' ? 'For Sale' : 'For Rent'}
              </span>
              <span className="bg-[#FAF8F5] border border-[#E8E3DC] text-[#1F2420] text-xs font-bold px-2.5 py-1 rounded-md">
                {formatSize(listing.size, listing.size_unit)}
              </span>
              {listing.is_verified && (
                <span className="bg-[#7FA37A] text-white text-xs font-semibold px-2.5 py-1 rounded-md flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Property</span>
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-3xl font-extrabold text-[#1F2420] tracking-tight">
              {listing.title}
            </h1>

            <div className="flex items-center text-xs sm:text-sm text-[#6B726D]">
              <MapPin className="w-4 h-4 text-[#0F6B5C] mr-1 flex-shrink-0" />
              <span>{listing.address_details || listing.location?.full_address_path || 'Prime Location, Pakistan'}</span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center space-x-4 text-xs text-[#8A8D89] flex-shrink-0">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{listing.views_count} views</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Added {new Date(listing.created_at).toLocaleDateString('en-PK', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>
        </div>

        {/* Interactive Photo Gallery Lightbox */}
        <DetailGallery photos={listing.photos || []} title={listing.title} />

        {/* Interactive PDF Dossier & Share Actions */}
        <ListingInteractiveActions listing={listing} />

        {/* Main Content Grid: Specs + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left 2 Columns: Specs & Details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Price & Size Overview Card */}
            <div className="bg-white rounded-2xl p-6 border border-[#E8E3DC] shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold text-[#8A8D89] uppercase tracking-wider">Demanded Price</p>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl sm:text-4xl font-extrabold text-[#0F6B5C]">
                      {formatPKR(listing.price, listing.purpose === 'rent')}
                    </span>
                    {listing.is_price_negotiable && (
                      <span className="text-xs font-semibold text-[#7FA37A] bg-[#E6F3F0] px-2 py-0.5 rounded">
                        Negotiable
                      </span>
                    )}
                  </div>
                </div>

                {pricePerMarla > 0 && (
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-[#8A8D89]">Calculated Rate</p>
                    <p className="text-xs sm:text-sm font-semibold text-[#1F2420]">
                      {formatPKR(pricePerMarla)} / Marla
                    </p>
                  </div>
                )}
              </div>

              {/* Installment Badge if applicable */}
              {listing.installment_available && (
                <div className="p-3 bg-[#E6F3F0] rounded-xl border border-[#7FA37A]/30 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0F6B5C] flex-shrink-0" />
                  <p className="text-xs font-semibold text-[#0F6B5C]">
                    Easy Quarterly Installment Plan Available for this property file.
                  </p>
                </div>
              )}
            </div>

            {/* Key Specifications Matrix */}
            <div className="bg-white rounded-2xl p-6 border border-[#E8E3DC] shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-[#1F2420]">Property Specifications</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#E8E3DC]">
                  <span className="text-[11px] text-[#8A8D89] font-medium block">Total Area</span>
                  <div className="flex items-center space-x-1.5 mt-1">
                    <Maximize2 className="w-4 h-4 text-[#0F6B5C]" />
                    <span className="text-sm font-bold text-[#1F2420]">
                      {formatSize(listing.size, listing.size_unit)}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#E8E3DC]">
                  <span className="text-[11px] text-[#8A8D89] font-medium block">Area in Sq. Ft</span>
                  <div className="flex items-center space-x-1.5 mt-1">
                    <Layers className="w-4 h-4 text-[#0F6B5C]" />
                    <span className="text-sm font-bold text-[#1F2420]">
                      {listing.size_in_sqft.toLocaleString()} sqft
                    </span>
                  </div>
                </div>

                <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#E8E3DC]">
                  <span className="text-[11px] text-[#8A8D89] font-medium block">Property Type</span>
                  <div className="flex items-center space-x-1.5 mt-1">
                    <Compass className="w-4 h-4 text-[#0F6B5C]" />
                    <span className="text-sm font-bold text-[#1F2420] capitalize">
                      {listing.subtype ? `${listing.subtype} (${listing.property_type})` : listing.property_type}
                    </span>
                  </div>
                </div>

                {listing.bedrooms && (
                  <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#E8E3DC]">
                    <span className="text-[11px] text-[#8A8D89] font-medium block">Bedrooms</span>
                    <div className="flex items-center space-x-1.5 mt-1">
                      <Bed className="w-4 h-4 text-[#0F6B5C]" />
                      <span className="text-sm font-bold text-[#1F2420]">{listing.bedrooms} Beds</span>
                    </div>
                  </div>
                )}

                {listing.bathrooms && (
                  <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#E8E3DC]">
                    <span className="text-[11px] text-[#8A8D89] font-medium block">Bathrooms</span>
                    <div className="flex items-center space-x-1.5 mt-1">
                      <Bath className="w-4 h-4 text-[#0F6B5C]" />
                      <span className="text-sm font-bold text-[#1F2420]">{listing.bathrooms} Baths</span>
                    </div>
                  </div>
                )}

                {listing.facing && (
                  <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#E8E3DC]">
                    <span className="text-[11px] text-[#8A8D89] font-medium block">Plot Facing</span>
                    <div className="flex items-center space-x-1.5 mt-1">
                      <Compass className="w-4 h-4 text-[#0F6B5C]" />
                      <span className="text-sm font-bold text-[#1F2420] capitalize">{listing.facing}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description Section */}
            <div className="bg-white rounded-2xl p-6 border border-[#E8E3DC] shadow-xs space-y-3">
              <h3 className="text-lg font-bold text-[#1F2420]">Description & Features</h3>
              <p className="text-sm text-[#4A4E4B] leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            </div>

            {/* Amenities / Plot Features */}
            {listing.features && listing.features.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-[#E8E3DC] shadow-xs space-y-4">
                <h3 className="text-lg font-bold text-[#1F2420]">Society Features & Utilities</h3>
                <div className="flex flex-wrap gap-2.5">
                  {listing.features.map((featureId) => {
                    const tag = AMENITY_TAGS.find((t) => t.id === featureId);
                    return (
                      <span
                        key={featureId}
                        className="inline-flex items-center space-x-1.5 bg-[#FAF8F5] border border-[#E8E3DC] text-[#1F2420] text-xs font-semibold px-3 py-1.5 rounded-xl"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0F6B5C]" />
                        <span>{tag ? tag.label : featureId}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Contact Agent Sidebar */}
          <div className="lg:col-span-1 sticky top-24 space-y-6">
            <ContactSidebar listing={listing} />
          </div>

        </div>

        {/* Similar Listings Section */}
        {similarListings.length > 0 && (
          <div className="pt-10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-[#1F2420]">
                  Similar Properties in {listing.city?.name}
                </h3>
                <p className="text-xs text-[#8A8D89]">
                  Explore more plots and homes matching this criteria
                </p>
              </div>
              <Link
                href={`/listings?city=${listing.city?.name}&type=${listing.property_type}`}
                className="text-xs font-bold text-[#0F6B5C] hover:underline flex items-center space-x-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarListings.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
