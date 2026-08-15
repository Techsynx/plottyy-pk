-- =========================================================
-- PLOTTYY COMPLETE POSTGRES DATABASE SCHEMA (SUPABASE)
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/emmhfhsxiwzwjsjwqzzh/sql)
-- =========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 1. Profiles Table (Certified Agencies, Dealers & Agents)
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY,
    auth_user_id UUID UNIQUE,
    username TEXT UNIQUE,
    full_name TEXT NOT NULL,
    email TEXT,
    phone_number TEXT,
    phone_verified_at TIMESTAMPTZ,
    avatar_url TEXT,
    cover_url TEXT,
    role TEXT NOT NULL DEFAULT 'lister',
    agency_name TEXT,
    license_number TEXT,
    office_address TEXT,
    experience_years INT DEFAULT 5,
    operating_areas TEXT[] DEFAULT ARRAY['DHA Defence', 'Bahria Town'],
    website TEXT,
    is_verified BOOLEAN NOT NULL DEFAULT true,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    reviews_count INT DEFAULT 1,
    bio TEXT,
    social_links JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Cities Table
CREATE TABLE IF NOT EXISTS public.cities (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    province TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Locations Table
CREATE TABLE IF NOT EXISTS public.locations (
    id SERIAL PRIMARY KEY,
    city_id INT REFERENCES public.cities(id) ON DELETE CASCADE,
    parent_id INT REFERENCES public.locations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    full_address_path TEXT NOT NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    is_popular BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Listings Table (Properties & Plots)
CREATE TABLE IF NOT EXISTS public.listings (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    purpose TEXT NOT NULL DEFAULT 'sale',
    property_type TEXT NOT NULL DEFAULT 'plot',
    subtype TEXT,
    city_id INT,
    location_id INT,
    address_details TEXT,
    size NUMERIC(12, 2) NOT NULL,
    size_unit TEXT NOT NULL DEFAULT 'marla',
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
    status TEXT NOT NULL DEFAULT 'live',
    is_verified BOOLEAN NOT NULL DEFAULT true,
    verified_at TIMESTAMPTZ DEFAULT now(),
    is_featured BOOLEAN NOT NULL DEFAULT false,
    contact_phone TEXT NOT NULL,
    contact_whatsapp TEXT,
    views_count INT NOT NULL DEFAULT 1,
    leads_count INT NOT NULL DEFAULT 0,
    favorites_count INT NOT NULL DEFAULT 0,
    photos JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    published_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS) & Public Read Access
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all profiles and live listings
CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public Insert/Update Profiles" ON public.profiles FOR ALL USING (true);

CREATE POLICY "Public Read Listings" ON public.listings FOR SELECT USING (true);
CREATE POLICY "Public Insert/Update Listings" ON public.listings FOR ALL USING (true);

CREATE POLICY "Public Read Cities" ON public.cities FOR SELECT USING (true);
CREATE POLICY "Public Read Locations" ON public.locations FOR SELECT USING (true);
