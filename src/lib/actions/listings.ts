'use server';

import { FilterState, Listing, ListingStatus } from '@/types';
import { LISTINGS_DATA, CITIES_DATA, LOCATIONS_DATA, getHydratedListings, getHydratedListingBySlug } from '@/lib/data/mock-db';
import { convertToSqft } from '@/lib/constants';
import { listingSchema, ListingInput } from '@/lib/validations/listing';
import { getSupabaseServer } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

const GLOBAL_CUSTOM_LISTINGS: Listing[] = [];

export async function getFilteredListings(filters: FilterState = {}): Promise<{
  listings: Listing[];
  total: number;
}> {
  let dbListings: Listing[] = [];

  // 1. Fetch live listings from Supabase Postgres Database
  const supabase = getSupabaseServer();
  if (supabase) {
    try {
      let query = supabase.from('listings').select('*').order('created_at', { ascending: false });

      if (filters.purpose) {
        query = query.eq('purpose', filters.purpose);
      }
      if (filters.type) {
        query = query.eq('property_type', filters.type);
      }
      if (filters.city) {
        const cityObj = CITIES_DATA.find((c) => c.name.toLowerCase() === filters.city?.toLowerCase() || c.slug === filters.city?.toLowerCase());
        if (cityObj) {
          query = query.eq('city_id', cityObj.id);
        }
      }

      const { data } = await query;
      if (data && data.length > 0) {
        dbListings = data.map((d) => ({
          id: d.id,
          user_id: d.user_id,
          title: d.title,
          slug: d.slug,
          description: d.description,
          purpose: d.purpose,
          property_type: d.property_type,
          subtype: d.subtype,
          city_id: d.city_id,
          city: CITIES_DATA.find((c) => c.id === d.city_id),
          location_id: d.location_id,
          location: LOCATIONS_DATA.find((loc) => loc.id === d.location_id),
          address_details: d.address_details,
          size: Number(d.size),
          size_unit: d.size_unit,
          size_in_sqft: Number(d.size_in_sqft),
          price: Number(d.price),
          is_price_negotiable: d.is_price_negotiable ?? true,
          installment_available: d.installment_available ?? false,
          bedrooms: d.bedrooms,
          bathrooms: d.bathrooms,
          floor_number: d.floor_number,
          total_floors: d.total_floors,
          facing: d.facing,
          features: Array.isArray(d.features) ? d.features : [],
          status: d.status,
          is_verified: d.is_verified ?? true,
          verified_at: d.verified_at,
          is_featured: d.is_featured ?? false,
          contact_phone: d.contact_phone,
          contact_whatsapp: d.contact_whatsapp,
          views_count: d.views_count || 1,
          leads_count: d.leads_count || 0,
          favorites_count: d.favorites_count || 0,
          photos: Array.isArray(d.photos) ? d.photos : [],
          created_at: d.created_at,
          updated_at: d.updated_at,
          published_at: d.published_at,
        }));
      }
    } catch (e) {
      console.error('Error fetching listings from Supabase:', e);
    }
  }

  // Combine DB listings + Global listings + Static listings without duplicates
  const existingIds = new Set(dbListings.map((l) => l.id));
  const customFiltered = GLOBAL_CUSTOM_LISTINGS.filter((l) => !existingIds.has(l.id));
  const staticFiltered = getHydratedListings().filter((l) => !existingIds.has(l.id));

  let results = [...dbListings, ...customFiltered, ...staticFiltered];

  // Apply filters
  if (filters.city) {
    results = results.filter(
      (l) => l.city?.slug.toLowerCase() === filters.city?.toLowerCase() ||
             l.city?.name.toLowerCase() === filters.city?.toLowerCase()
    );
  }

  if (filters.locationId) {
    results = results.filter((l) => l.location_id === Number(filters.locationId));
  }

  if (filters.purpose) {
    results = results.filter((l) => l.purpose === filters.purpose);
  }

  if (filters.type) {
    results = results.filter((l) => l.property_type === filters.type);
  }

  if (filters.subtype) {
    results = results.filter((l) => l.subtype === filters.subtype);
  }

  if (filters.minPrice !== undefined && filters.minPrice > 0) {
    results = results.filter((l) => l.price >= Number(filters.minPrice));
  }
  if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
    results = results.filter((l) => l.price <= Number(filters.maxPrice));
  }

  if (filters.minSize !== undefined && filters.minSize > 0) {
    const minSqft = convertToSqft(Number(filters.minSize), filters.sizeUnit || 'marla');
    results = results.filter((l) => l.size_in_sqft >= minSqft);
  }
  if (filters.maxSize !== undefined && filters.maxSize > 0) {
    const maxSqft = convertToSqft(Number(filters.maxSize), filters.sizeUnit || 'marla');
    results = results.filter((l) => l.size_in_sqft <= maxSqft);
  }

  if (filters.bedrooms) {
    results = results.filter((l) => l.bedrooms && l.bedrooms >= Number(filters.bedrooms));
  }

  if (filters.verifiedOnly) {
    results = results.filter((l) => l.is_verified);
  }

  if (filters.query) {
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

  if (filters.sortBy === 'price_asc') {
    results.sort((a, b) => a.price - b.price);
  } else if (filters.sortBy === 'price_desc') {
    results.sort((a, b) => b.price - a.price);
  } else if (filters.sortBy === 'popular') {
    results.sort((a, b) => b.views_count - a.views_count);
  } else {
    results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  return {
    listings: results,
    total: results.length,
  };
}

export async function getListingBySlug(slug: string): Promise<Listing | null> {
  const clean = decodeURIComponent(slug).toLowerCase().trim();

  // 1. Query Supabase Database first
  const supabase = getSupabaseServer();
  if (supabase) {
    try {
      const { data } = await supabase
        .from('listings')
        .select('*')
        .or(`slug.ilike.${clean},id.eq.${slug}`)
        .maybeSingle();

      if (data) {
        return {
          id: data.id,
          user_id: data.user_id,
          title: data.title,
          slug: data.slug,
          description: data.description,
          purpose: data.purpose,
          property_type: data.property_type,
          subtype: data.subtype,
          city_id: data.city_id,
          city: CITIES_DATA.find((c) => c.id === data.city_id),
          location_id: data.location_id,
          location: LOCATIONS_DATA.find((loc) => loc.id === data.location_id),
          address_details: data.address_details,
          size: Number(data.size),
          size_unit: data.size_unit,
          size_in_sqft: Number(data.size_in_sqft),
          price: Number(data.price),
          is_price_negotiable: data.is_price_negotiable ?? true,
          installment_available: data.installment_available ?? false,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          floor_number: data.floor_number,
          total_floors: data.total_floors,
          facing: data.facing,
          features: Array.isArray(data.features) ? data.features : [],
          status: data.status,
          is_verified: data.is_verified ?? true,
          verified_at: data.verified_at,
          is_featured: data.is_featured ?? false,
          contact_phone: data.contact_phone,
          contact_whatsapp: data.contact_whatsapp,
          views_count: (data.views_count || 1) + 1,
          leads_count: data.leads_count || 0,
          favorites_count: data.favorites_count || 0,
          photos: Array.isArray(data.photos) ? data.photos : [],
          created_at: data.created_at,
          updated_at: data.updated_at,
          published_at: data.published_at,
        };
      }
    } catch (e) {
      console.error('Error fetching listing from Supabase:', e);
    }
  }

  // 2. Fallback to in-memory / mock database
  const custom = GLOBAL_CUSTOM_LISTINGS.find((l) => l.slug.toLowerCase() === clean || l.id === slug);
  if (custom) {
    custom.views_count += 1;
    return custom;
  }

  const listing = getHydratedListingBySlug(slug);
  if (listing) {
    listing.views_count += 1;
    return listing;
  }
  return null;
}

export async function createListing(
  input: ListingInput, 
  isDraft = false,
  userId?: string
): Promise<{ success: boolean; slug?: string; listing?: Listing; error?: string }> {
  try {
    const validated = listingSchema.parse(input);
    const id = `lst-${Date.now()}`;
    const slugBase = validated.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'property';
    const slug = `${slugBase}-${id.slice(-6)}`;
    
    const size_in_sqft = convertToSqft(validated.size, validated.size_unit);
    const city = CITIES_DATA.find((c) => c.id === validated.city_id);
    const location = LOCATIONS_DATA.find((loc) => loc.id === validated.location_id);

    const effectivePhotos = validated.photos.length > 0
      ? validated.photos.map((p, idx) => ({
          id: `p-${id}-${idx}`,
          listing_id: id,
          storage_path: p.url,
          url: p.url,
          alt_text: p.alt_text || validated.title,
          sort_order: idx,
          is_cover: idx === 0 || p.is_cover,
        }))
      : [
          {
            id: `p-${id}-0`,
            listing_id: id,
            storage_path: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=80',
            url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=80',
            alt_text: validated.title,
            sort_order: 0,
            is_cover: true,
          },
        ];

    const newListing: Listing = {
      id,
      user_id: userId || `usr_${Date.now()}`,
      title: validated.title,
      slug,
      description: validated.description,
      purpose: validated.purpose,
      property_type: validated.property_type,
      subtype: validated.subtype || null,
      city_id: validated.city_id,
      city,
      location_id: validated.location_id,
      location,
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
      photos: effectivePhotos,
    };

    // 1. Insert into Supabase with safe 2-second timeout so requests NEVER hang
    const supabase = getSupabaseServer();
    if (supabase) {
      try {
        await Promise.race([
          supabase.from('listings').insert({
            id: newListing.id,
            user_id: newListing.user_id,
            title: newListing.title,
            slug: newListing.slug,
            description: newListing.description,
            purpose: newListing.purpose,
            property_type: newListing.property_type,
            subtype: newListing.subtype,
            city_id: newListing.city_id,
            location_id: newListing.location_id,
            address_details: newListing.address_details,
            size: newListing.size,
            size_unit: newListing.size_unit,
            size_in_sqft: newListing.size_in_sqft,
            price: newListing.price,
            is_price_negotiable: newListing.is_price_negotiable,
            installment_available: newListing.installment_available,
            bedrooms: newListing.bedrooms,
            bathrooms: newListing.bathrooms,
            floor_number: newListing.floor_number,
            total_floors: newListing.total_floors,
            facing: newListing.facing,
            features: newListing.features,
            status: newListing.status,
            is_verified: true,
            contact_phone: newListing.contact_phone,
            contact_whatsapp: newListing.contact_whatsapp,
            photos: newListing.photos,
            created_at: newListing.created_at,
            published_at: newListing.published_at,
          }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 2000)),
        ]).catch((e) => console.warn('Supabase insert timed out or table missing, continuing:', e?.message));
      } catch (e) {}
    }

    GLOBAL_CUSTOM_LISTINGS.unshift(newListing);
    LISTINGS_DATA.unshift(newListing);
    revalidatePath('/listings');
    revalidatePath(`/listings/${newListing.slug}`);
    revalidatePath('/dashboard');

    return { success: true, slug, listing: newListing };
  } catch (err: any) {
    console.error('Error creating listing:', err);
    return { success: false, error: err?.message || 'Validation failed' };
  }
}

export async function updateListingStatus(listingId: string, status: ListingStatus): Promise<boolean> {
  const supabase = getSupabaseServer();
  if (supabase) {
    try {
      await supabase.from('listings').update({ status }).eq('id', listingId);
    } catch (e) {}
  }

  const item = GLOBAL_CUSTOM_LISTINGS.find((l) => l.id === listingId) || LISTINGS_DATA.find((l) => l.id === listingId);
  if (item) {
    item.status = status;
    item.updated_at = new Date().toISOString();
    revalidatePath('/dashboard');
    revalidatePath('/listings');
    return true;
  }
  return false;
}
