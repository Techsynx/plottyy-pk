-- Plottyy Database Schema Migration
-- Phase 1: Core Marketplace & Listings

-- Enable UUID and Trigram Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Enum Types
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('buyer', 'lister', 'admin');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'property_purpose') THEN
        CREATE TYPE property_purpose AS ENUM ('sale', 'rent');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'property_type') THEN
        CREATE TYPE property_type AS ENUM ('plot', 'house', 'flat', 'commercial', 'agricultural');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'size_unit') THEN
        CREATE TYPE size_unit AS ENUM ('marla', 'kanal', 'sqft', 'sqyd');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'listing_status') THEN
        CREATE TYPE listing_status AS ENUM ('draft', 'pending_review', 'live', 'sold', 'expired', 'rejected');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lead_type') THEN
        CREATE TYPE lead_type AS ENUM ('phone_reveal', 'whatsapp_click', 'contact_form');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lead_status') THEN
        CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'closed', 'spam');
    END IF;
END $$;

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE,
    full_name TEXT NOT NULL,
    phone_number TEXT UNIQUE,
    phone_verified_at TIMESTAMPTZ,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'buyer',
    agency_name TEXT,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    bio TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Cities Table
CREATE TABLE IF NOT EXISTS cities (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    province TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Locations (Societies, Sectors, Phases) Table
CREATE TABLE IF NOT EXISTS locations (
    id SERIAL PRIMARY KEY,
    city_id INT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
    parent_id INT REFERENCES locations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    full_address_path TEXT NOT NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    is_popular BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_city_location_parent UNIQUE (city_id, name, parent_id)
);

-- 4. Listings Table
CREATE TABLE IF NOT EXISTS listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    purpose property_purpose NOT NULL DEFAULT 'sale',
    property_type property_type NOT NULL DEFAULT 'plot',
    subtype TEXT, -- e.g., 'residential_plot', 'commercial_plot', 'penthouse', 'house'
    
    city_id INT NOT NULL REFERENCES cities(id) ON DELETE RESTRICT,
    location_id INT NOT NULL REFERENCES locations(id) ON DELETE RESTRICT,
    address_details TEXT,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    
    size NUMERIC(12, 2) NOT NULL,
    size_unit size_unit NOT NULL DEFAULT 'marla',
    size_in_sqft NUMERIC(12, 2) NOT NULL,
    
    price NUMERIC(15, 2) NOT NULL,
    is_price_negotiable BOOLEAN NOT NULL DEFAULT true,
    installment_available BOOLEAN NOT NULL DEFAULT false,
    
    bedrooms SMALLINT,
    bathrooms SMALLINT,
    floor_number SMALLINT,
    total_floors SMALLINT,
    facing TEXT,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    
    status listing_status NOT NULL DEFAULT 'draft',
    is_verified BOOLEAN NOT NULL DEFAULT false,
    verified_at TIMESTAMPTZ,
    rejection_reason TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    
    contact_phone TEXT NOT NULL,
    contact_whatsapp TEXT,
    
    views_count INT NOT NULL DEFAULT 0,
    leads_count INT NOT NULL DEFAULT 0,
    favorites_count INT NOT NULL DEFAULT 0,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    published_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ
);

-- 5. Listing Photos Table
CREATE TABLE IF NOT EXISTS listing_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    url TEXT NOT NULL,
    alt_text TEXT,
    sort_order SMALLINT NOT NULL DEFAULT 0,
    is_cover BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Leads Table
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    lister_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    buyer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    lead_type lead_type NOT NULL,
    buyer_name TEXT,
    buyer_phone TEXT,
    buyer_email TEXT,
    message TEXT,
    status lead_status NOT NULL DEFAULT 'new',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Favorites Table
CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_user_listing_favorite UNIQUE (user_id, listing_id)
);

-- 8. Phone Verifications Table
CREATE TABLE IF NOT EXISTS phone_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number TEXT NOT NULL,
    otp_code_hash TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    attempts SMALLINT NOT NULL DEFAULT 0,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_listings_search ON listings(status, purpose, property_type, city_id, location_id, price);
CREATE INDEX IF NOT EXISTS idx_listings_price ON listings(price);
CREATE INDEX IF NOT EXISTS idx_listings_size_sqft ON listings(size_in_sqft);
CREATE INDEX IF NOT EXISTS idx_listings_user ON listings(user_id);
CREATE INDEX IF NOT EXISTS idx_listing_photos_listing ON listing_photos(listing_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_leads_lister ON leads(lister_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_locations_city ON locations(city_id);
CREATE INDEX IF NOT EXISTS idx_locations_name_trgm ON locations USING gin (name gin_trgm_ops);
