'use server';

import { FilterState, Listing, ListingStatus } from '@/types';
import { LISTINGS_DATA, getHydratedListings, getHydratedListingBySlug } from '@/lib/data/mock-db';
import { convertToSqft } from '@/lib/constants';
import { listingSchema, ListingInput } from '@/lib/validations/listing';
import { revalidatePath } from 'next/cache';

export async function getFilteredListings(filters: FilterState = {}): Promise<{
  listings: Listing[];
  total: number;
}> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 50));

  let results = getHydratedListings();

  // 1. City Filter
  if (filters.city) {
    results = results.filter(
      (l) => l.city?.slug.toLowerCase() === filters.city?.toLowerCase() ||
             l.city?.name.toLowerCase() === filters.city?.toLowerCase()
    );
  }

  // 2. Location ID Filter
  if (filters.locationId) {
    results = results.filter((l) => l.location_id === Number(filters.locationId));
  }

  // 3. Purpose Filter (Buy/Rent)
  if (filters.purpose) {
    results = results.filter((l) => l.purpose === filters.purpose);
  }

  // 4. Property Type Filter
  if (filters.type) {
    results = results.filter((l) => l.property_type === filters.type);
  }

  // 5. Subtype Filter
  if (filters.subtype) {
    results = results.filter((l) => l.subtype === filters.subtype);
  }

  // 6. Price Range Filter
  if (filters.minPrice !== undefined && filters.minPrice > 0) {
    results = results.filter((l) => l.price >= Number(filters.minPrice));
  }
  if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
    results = results.filter((l) => l.price <= Number(filters.maxPrice));
  }

  // 7. Size Filter (Normalized to Sq. Ft)
  if (filters.minSize !== undefined && filters.minSize > 0) {
    const minSqft = convertToSqft(Number(filters.minSize), filters.sizeUnit || 'marla');
    results = results.filter((l) => l.size_in_sqft >= minSqft);
  }
  if (filters.maxSize !== undefined && filters.maxSize > 0) {
    const maxSqft = convertToSqft(Number(filters.maxSize), filters.sizeUnit || 'marla');
    results = results.filter((l) => l.size_in_sqft <= maxSqft);
  }

  // 8. Bedrooms Filter
  if (filters.bedrooms && filters.bedrooms !== 'any') {
    results = results.filter((l) => (l.bedrooms || 0) >= Number(filters.bedrooms));
  }

  // 9. Verified Only Filter
  if (filters.verifiedOnly) {
    results = results.filter((l) => l.is_verified);
  }

  // 10. Query String (Free Search against Title / Society)
  if (filters.query && filters.query.trim() !== '') {
    const q = filters.query.toLowerCase().trim();
    results = results.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.location?.name.toLowerCase().includes(q) ||
        l.city?.name.toLowerCase().includes(q) ||
        (l.address_details && l.address_details.toLowerCase().includes(q))
    );
  }

  // 11. Sorting
  if (filters.sortBy === 'price_asc') {
    results.sort((a, b) => a.price - b.price);
  } else if (filters.sortBy === 'price_desc') {
    results.sort((a, b) => b.price - a.price);
  } else if (filters.sortBy === 'popular') {
    results.sort((a, b) => b.views_count - a.views_count);
  } else {
    // default newest
    results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  return {
    listings: results,
    total: results.length,
  };
}

export async function getListingBySlug(slug: string): Promise<Listing | null> {
  const listing = getHydratedListingBySlug(slug);
  if (listing) {
    // increment view count
    listing.views_count += 1;
  }
  return listing;
}

export async function createListing(input: ListingInput, isDraft = false): Promise<{ success: boolean; slug?: string; error?: string }> {
  try {
    const validated = listingSchema.parse(input);
    const id = `lst-${Date.now()}`;
    const slugBase = validated.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const slug = `${slugBase}-${id.slice(-4)}`;
    
    const size_in_sqft = convertToSqft(validated.size, validated.size_unit);

    const newListing: Listing = {
      id,
      user_id: 'a0000000-0000-0000-0000-000000000001', // Demo lister ID
      title: validated.title,
      slug,
      description: validated.description,
      purpose: validated.purpose,
      property_type: validated.property_type,
      subtype: validated.subtype || null,
      city_id: validated.city_id,
      location_id: validated.location_id,
      address_details: validated.address_details || null,
      size: validated.size,
      size_unit: validated.size_unit,
      size_in_sqft,
      price: validated.price,
      is_price_negotiable: validated.is_price_negotiable,
      installment_available: validated.installment_available,
      bedrooms: validated.bedrooms || null,
      bathrooms: validated.bathrooms || null,
      floor_number: validated.floor_number || null,
      total_floors: validated.total_floors || null,
      facing: validated.facing || null,
      features: validated.features,
      status: isDraft ? 'draft' : 'live',
      is_verified: true,
      verified_at: new Date().toISOString(),
      is_featured: false,
      contact_phone: validated.contact_phone,
      contact_whatsapp: validated.contact_whatsapp || validated.contact_phone,
      views_count: 1,
      leads_count: 0,
      favorites_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: isDraft ? null : new Date().toISOString(),
      photos: validated.photos.map((p, idx) => ({
        id: `p-${id}-${idx}`,
        listing_id: id,
        storage_path: p.url,
        url: p.url,
        alt_text: p.alt_text || validated.title,
        sort_order: idx,
        is_cover: idx === 0 || p.is_cover,
      })),
    };

    // Prepend to in-memory list
    LISTINGS_DATA.unshift(newListing);
    revalidatePath('/listings');
    revalidatePath('/dashboard');

    return { success: true, slug };
  } catch (err: any) {
    console.error('Error creating listing:', err);
    return { success: false, error: err?.message || 'Validation failed' };
  }
}

export async function updateListingStatus(listingId: string, status: ListingStatus): Promise<boolean> {
  const item = LISTINGS_DATA.find((l) => l.id === listingId);
  if (item) {
    item.status = status;
    item.updated_at = new Date().toISOString();
    revalidatePath('/dashboard');
    revalidatePath('/listings');
    return true;
  }
  return false;
}
