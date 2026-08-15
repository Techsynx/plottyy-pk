import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  getListingBySlug, 
  getFilteredListings 
} from '@/lib/actions/listings';
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
  CheckCircle2
} from 'lucide-react';
import { ContactSidebar } from '@/components/listings/ContactSidebar';
import { DetailGallery } from '@/components/listings/DetailGallery';
import { ListingCard } from '@/components/listings/ListingCard';
import { ListingInteractiveActions } from '@/components/listings/ListingInteractiveActions';

interface ListingPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ListingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) return { title: 'Property Not Found | plottyy' };

  const priceText = formatPKR(listing.price, listing.purpose === 'rent');
  const sizeText = formatSize(listing.size, listing.size_unit);

  return {
    title: `${listing.title} - ${priceText} | plottyy`,
    description: `${sizeText} ${listing.property_type} in ${listing.location?.name}, ${listing.city?.name}. ${listing.description.slice(0, 150)}...`,
    openGraph: {
      title: `${listing.title} - ${priceText}`,
      description: `${sizeText} ${listing.property_type} in ${listing.location?.name}, ${listing.city?.name}`,
      images: listing.photos?.[0]?.url ? [listing.photos[0].url] : [],
    },
  };
}

export default async function ListingDetailPage({ params }: ListingPageProps) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);

  if (!listing) {
    notFound();
  }

  // Get similar listings in same city
  const { listings: similarListings } = await getFilteredListings({
    city: listing.city?.name,
    purpose: listing.purpose,
  });
  const otherListings = similarListings.filter((l) => l.id !== listing.id).slice(0, 3);

  // Schema.org RealEstateListing Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: listing.title,
    description: listing.description,
    url: `https://plottyy.pk/listings/${listing.slug}`,
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

  const pricePerMarla = listing.size_in_sqft > 0
    ? (listing.price / (listing.size_in_sqft / 225))
    : 0;

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
          <Link href={`/listings?city=${listing.city?.name}`} className="hover:text-[#0F6B5C] transition-colors">
            {listing.city?.name}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <Link href={`/listings?type=${listing.property_type}`} className="hover:text-[#0F6B5C] transition-colors capitalize">
            {listing.property_type}s
          </Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-[#1F2420] font-semibold truncate max-w-[200px] sm:max-w-none">
            {listing.location?.name}
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
              <span>{listing.address_details || listing.location?.full_address_path}</span>
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

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Info Column */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Overview / Key Specs Table */}
            <div className="bg-white rounded-2xl p-6 border border-[#E8E3DC] property-card-shadow space-y-5">
              <h2 className="text-base font-bold text-[#1F2420] uppercase tracking-wider border-b border-[#E8E3DC] pb-3">
                Property Overview
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-[#FAF8F5] p-3 rounded-xl">
                  <span className="text-[#8A8D89] font-medium block">Price</span>
                  <span className="text-sm font-extrabold text-[#0F6B5C]">
                    {formatPKR(listing.price, listing.purpose === 'rent')}
                  </span>
                </div>

                <div className="bg-[#FAF8F5] p-3 rounded-xl">
                  <span className="text-[#8A8D89] font-medium block">Area / Size</span>
                  <span className="text-sm font-extrabold text-[#1F2420]">
                    {formatSize(listing.size, listing.size_unit)}
                  </span>
                  <span className="text-[10px] text-[#8A8D89] block">
                    ({listing.size_in_sqft.toLocaleString()} sq. ft)
                  </span>
                </div>

                <div className="bg-[#FAF8F5] p-3 rounded-xl">
                  <span className="text-[#8A8D89] font-medium block">Price per Marla</span>
                  <span className="text-sm font-extrabold text-[#1F2420]">
                    {pricePerMarla > 0 ? formatPKR(pricePerMarla) : 'N/A'}
                  </span>
                </div>

                <div className="bg-[#FAF8F5] p-3 rounded-xl">
                  <span className="text-[#8A8D89] font-medium block">Property Type</span>
                  <span className="text-sm font-bold text-[#1F2420] capitalize">
                    {listing.subtype?.replace(/_/g, ' ') || listing.property_type}
                  </span>
                </div>

                <div className="bg-[#FAF8F5] p-3 rounded-xl">
                  <span className="text-[#8A8D89] font-medium block">Purpose</span>
                  <span className="text-sm font-bold text-[#1F2420] capitalize">
                    {listing.purpose === 'sale' ? 'For Sale' : 'For Rent'}
                  </span>
                </div>

                <div className="bg-[#FAF8F5] p-3 rounded-xl">
                  <span className="text-[#8A8D89] font-medium block">Facing / Orientation</span>
                  <span className="text-sm font-bold text-[#1F2420]">
                    {listing.facing || 'Standard Orientation'}
                  </span>
                </div>

                {listing.bedrooms ? (
                  <div className="bg-[#FAF8F5] p-3 rounded-xl">
                    <span className="text-[#8A8D89] font-medium block">Bedrooms</span>
                    <span className="text-sm font-bold text-[#1F2420]">
                      {listing.bedrooms} Beds
                    </span>
                  </div>
                ) : null}

                {listing.bathrooms ? (
                  <div className="bg-[#FAF8F5] p-3 rounded-xl">
                    <span className="text-[#8A8D89] font-medium block">Bathrooms</span>
                    <span className="text-sm font-bold text-[#1F2420]">
                      {listing.bathrooms} Baths
                    </span>
                  </div>
                ) : null}

                <div className="bg-[#FAF8F5] p-3 rounded-xl">
                  <span className="text-[#8A8D89] font-medium block">Possession Status</span>
                  <span className="text-sm font-bold text-[#7FA37A]">
                    ✓ Ready / Possession Paid
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 border border-[#E8E3DC] property-card-shadow space-y-4">
              <h2 className="text-base font-bold text-[#1F2420] uppercase tracking-wider border-b border-[#E8E3DC] pb-3">
                Property Description
              </h2>
              <div className="prose max-w-none text-sm text-[#1F2420] leading-relaxed whitespace-pre-line font-sans">
                {listing.description}
              </div>
            </div>

            {/* Features & Amenities */}
            {listing.features && listing.features.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-[#E8E3DC] property-card-shadow space-y-4">
                <h2 className="text-base font-bold text-[#1F2420] uppercase tracking-wider border-b border-[#E8E3DC] pb-3">
                  Features & Utilities
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  {listing.features.map((fId) => {
                    const tag = AMENITY_TAGS.find((a) => a.id === fId);
                    return (
                      <div key={fId} className="flex items-center space-x-2 bg-[#FAF8F5] p-2.5 rounded-lg border border-[#E8E3DC]">
                        <CheckCircle2 className="w-4 h-4 text-[#0F6B5C] flex-shrink-0" />
                        <span className="font-semibold text-[#1F2420]">{tag?.label || fId}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Location & Society Context */}
            <div className="bg-white rounded-2xl p-6 border border-[#E8E3DC] property-card-shadow space-y-3">
              <h2 className="text-base font-bold text-[#1F2420] uppercase tracking-wider border-b border-[#E8E3DC] pb-3">
                Location & Connectivity
              </h2>
              <p className="text-xs text-[#6B726D]">
                Situated in <strong className="text-[#1F2420]">{listing.location?.name}</strong>, {listing.city?.name}. Accessible via main arterial boulevards, close to educational institutions, mosques, and commercial zones.
              </p>
              <div className="bg-[#FAF8F5] border border-[#E8E3DC] rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-semibold text-[#1F2420]">
                  <Compass className="w-4 h-4 text-[#0F6B5C]" />
                  <span>GPS Coordinates: {listing.latitude || '31.4721'}° N, {listing.longitude || '74.4392'}° E</span>
                </div>
                <span className="text-[11px] text-[#7FA37A] font-bold">✓ Geo-Tagged Society</span>
              </div>
            </div>

            {/* Interactive Actions & Installment Calculator */}
            <ListingInteractiveActions listing={listing} />

          </div>

          {/* Sticky Contact Action Sidebar */}
          <div className="lg:col-span-4">
            <ContactSidebar listing={listing} />
          </div>

        </div>

        {/* Similar Listings Section */}
        {otherListings.length > 0 && (
          <div className="pt-10 space-y-5 border-t border-[#E8E3DC]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#1F2420]">
                  Similar Properties in {listing.city?.name}
                </h2>
                <p className="text-xs text-[#8A8D89]">
                  Explore alternative plots and residences in nearby sectors
                </p>
              </div>
              <Link
                href={`/listings?city=${listing.city?.name}`}
                className="text-xs font-bold text-[#0F6B5C] hover:underline"
              >
                View all in {listing.city?.name} →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {otherListings.map((item) => (
                <ListingCard key={item.id} listing={item} />
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
