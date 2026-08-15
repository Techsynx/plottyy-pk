export type UserRole = 'buyer' | 'lister' | 'admin';
export type PropertyPurpose = 'sale' | 'rent';
export type PropertyType = 'plot' | 'house' | 'flat' | 'commercial' | 'agricultural';
export type SizeUnit = 'marla' | 'kanal' | 'sqft' | 'sqyd';
export type ListingStatus = 'draft' | 'pending_review' | 'live' | 'sold' | 'expired' | 'rejected';
export type LeadType = 'phone_reveal' | 'whatsapp_click' | 'contact_form';
export type LeadStatus = 'new' | 'contacted' | 'closed' | 'spam';

export interface Profile {
  id: string;
  auth_user_id?: string;
  username: string;
  full_name: string;
  email?: string;
  phone_number: string;
  phone_verified_at?: string | null;
  avatar_url?: string | null;
  cover_url?: string | null;
  role: UserRole;
  agency_name?: string | null;
  license_number?: string | null;
  office_address?: string | null;
  experience_years?: number;
  operating_areas?: string[];
  website?: string | null;
  is_verified: boolean;
  rating?: number;
  reviews_count?: number;
  bio?: string | null;
  social_links?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  created_at: string;
}

export interface City {
  id: number;
  name: string;
  slug: string;
  province: string;
  is_active: boolean;
  sort_order: number;
}

export interface Location {
  id: number;
  city_id: number;
  parent_id?: number | null;
  name: string;
  slug: string;
  full_address_path: string;
  latitude?: number | null;
  longitude?: number | null;
  is_popular?: boolean;
  city?: City;
}

export interface ListingPhoto {
  id: string;
  listing_id: string;
  storage_path: string;
  url: string;
  alt_text?: string | null;
  sort_order: number;
  is_cover: boolean;
}

export interface Listing {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  description: string;
  purpose: PropertyPurpose;
  property_type: PropertyType;
  subtype?: string | null;
  
  city_id: number;
  location_id: number;
  address_details?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  
  size: number;
  size_unit: SizeUnit;
  size_in_sqft: number;
  
  price: number; // in PKR
  is_price_negotiable: boolean;
  installment_available: boolean;
  
  bedrooms?: number | null;
  bathrooms?: number | null;
  floor_number?: number | null;
  total_floors?: number | null;
  facing?: string | null;
  features: string[];
  
  status: ListingStatus;
  is_verified: boolean;
  verified_at?: string | null;
  rejection_reason?: string | null;
  is_featured: boolean;
  
  contact_phone: string;
  contact_whatsapp?: string | null;
  
  views_count: number;
  leads_count: number;
  favorites_count: number;
  
  created_at: string;
  updated_at: string;
  published_at?: string | null;
  expires_at?: string | null;
  
  // Joined Relations
  photos?: ListingPhoto[];
  location?: Location;
  city?: City;
  user?: Profile;
}

export interface Lead {
  id: string;
  listing_id: string;
  lister_id: string;
  buyer_id?: string | null;
  lead_type: LeadType;
  buyer_name?: string | null;
  buyer_phone?: string | null;
  buyer_email?: string | null;
  message?: string | null;
  status: LeadStatus;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  
  // Joined
  listing?: Listing;
}

export interface FilterState {
  city?: string;
  locationId?: number;
  purpose?: PropertyPurpose;
  type?: PropertyType;
  subtype?: string;
  minPrice?: number;
  maxPrice?: number;
  minSize?: number;
  maxSize?: number;
  sizeUnit?: SizeUnit;
  bedrooms?: number | string;
  bathrooms?: number | string;
  verifiedOnly?: boolean;
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'popular';
  query?: string;
}
