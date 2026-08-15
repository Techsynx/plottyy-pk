import React from 'react';
import { Metadata } from 'next';
import { getListingBySlug, getFilteredListings } from '@/lib/actions/listings';
import { formatPKR, formatSize } from '@/lib/constants';
import { ListingDetailClientView } from '@/components/listings/ListingDetailClientView';

interface ListingPageProps {
  params: Promise<{ slug: string }>;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://plotty.unicorn-realtors.com';

export async function generateMetadata({ params }: ListingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) return { title: 'Verified Property | plottyy' };

  const priceText = formatPKR(listing.price, listing.purpose === 'rent');
  const sizeText = formatSize(listing.size, listing.size_unit);
  const locationName = listing.location?.name || 'Prime Location';
  const cityName = listing.city?.name || 'Pakistan';

  return {
    title: `${sizeText} ${listing.title} for ${listing.purpose === 'rent' ? 'Rent' : 'Sale'} in ${locationName}, ${cityName} — ${priceText}`,
    description: `Buy ${sizeText} ${listing.property_type} in ${locationName}, ${cityName} for ${priceText}. Direct owner/agent contact, 100% verified plot file, GPS coordinates, and zero hidden markups on Plottyy.`,
    keywords: [
      `${listing.title}`,
      `${sizeText} plot for sale in ${locationName}`,
      `plots in ${cityName}`,
      `plot finder ${cityName}`,
      `${locationName} plot price`,
      `unicorn realtors`,
      `exhuzaifa`,
      `plottyy`,
    ],
    alternates: {
      canonical: `${SITE_URL}/listings/${slug}`,
    },
    openGraph: {
      title: `${listing.title} - ${priceText} in ${locationName}, ${cityName}`,
      description: `${sizeText} ${listing.property_type} for ${listing.purpose === 'sale' ? 'Sale' : 'Rent'}. Contact lister directly on WhatsApp.`,
      url: `${SITE_URL}/listings/${slug}`,
      images: listing.photos?.[0]?.url ? [{ url: listing.photos[0].url, alt: listing.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${listing.title} - ${priceText}`,
      description: `Verified ${sizeText} property in ${locationName}, ${cityName}.`,
      images: listing.photos?.[0]?.url ? [listing.photos[0].url] : [],
    },
  };
}

export default async function ListingDetailPage({ params }: ListingPageProps) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);

  let similarListings: any[] = [];
  if (listing?.city?.name) {
    const { listings } = await getFilteredListings({
      city: listing.city.name,
      purpose: listing.purpose,
    });
    similarListings = listings.filter((l) => l.id !== listing.id).slice(0, 3);
  }

  const jsonLd = listing ? {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    'name': listing.title,
    'description': listing.description,
    'url': `${SITE_URL}/listings/${listing.slug}`,
    'image': listing.photos?.map((p) => p.url) || [],
    'datePosted': listing.published_at || listing.created_at,
    'offers': {
      '@type': 'Offer',
      'price': listing.price,
      'priceCurrency': 'PKR',
      'availability': 'https://schema.org/InStock',
      'validFrom': listing.created_at,
    },
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': listing.address_details || listing.location?.name,
      'addressLocality': listing.city?.name,
      'addressRegion': listing.city?.province,
      'addressCountry': 'PK',
    },
    'geo': listing.latitude && listing.longitude ? {
      '@type': 'GeoCoordinates',
      'latitude': listing.latitude,
      'longitude': listing.longitude,
    } : undefined,
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ListingDetailClientView
        initialListing={listing}
        slug={slug}
        similarListings={similarListings}
      />
    </>
  );
}
