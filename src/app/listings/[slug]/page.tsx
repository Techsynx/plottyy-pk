import React from 'react';
import { Metadata } from 'next';
import { getListingBySlug, getFilteredListings } from '@/lib/actions/listings';
import { formatPKR, formatSize } from '@/lib/constants';
import { ListingDetailClientView } from '@/components/listings/ListingDetailClientView';

interface ListingPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ListingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) return { title: 'Verified Property | plottyy' };

  const priceText = formatPKR(listing.price, listing.purpose === 'rent');
  const sizeText = formatSize(listing.size, listing.size_unit);

  return {
    title: `${listing.title} - ${priceText} | plottyy`,
    description: `${sizeText} ${listing.property_type} in ${listing.location?.name || 'Pakistan'}, ${listing.city?.name || 'Pakistan'}. ${listing.description.slice(0, 150)}...`,
    openGraph: {
      title: `${listing.title} - ${priceText}`,
      description: `${sizeText} ${listing.property_type} in ${listing.location?.name || 'Pakistan'}, ${listing.city?.name || 'Pakistan'}`,
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

  return (
    <ListingDetailClientView
      initialListing={listing}
      slug={slug}
      similarListings={similarListings}
    />
  );
}
