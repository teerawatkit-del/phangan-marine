-- ==============================================================================
-- KOH PHANGAN ISLAND ADVENTURE - SUPABASE DATABASE SCHEMA (FULL)
-- ==============================================================================
-- Instructions: Copy and run this entire script in your Supabase SQL Editor
-- (Dashboard -> SQL Editor -> New Query -> Paste & Run)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TOURS TABLE
CREATE TABLE IF NOT EXISTS public.tours (
    id TEXT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_th VARCHAR(255),
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    boat_type VARCHAR(100),
    boat_type_th VARCHAR(100),
    boat_specs TEXT,
    boat_specs_th TEXT,
    short_description TEXT NOT NULL,
    short_description_th TEXT,
    description TEXT NOT NULL,
    description_th TEXT,
    duration VARCHAR(100) NOT NULL,
    duration_th VARCHAR(100),
    price_from NUMERIC(10, 2) NOT NULL,
    max_guests INTEGER NOT NULL DEFAULT 12,
    featured BOOLEAN NOT NULL DEFAULT false,
    active BOOLEAN NOT NULL DEFAULT true,
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.0,
    review_count INTEGER NOT NULL DEFAULT 0,
    departure_location VARCHAR(255) DEFAULT 'Thong Sala Pier, Koh Phangan',
    departure_times TEXT[] DEFAULT '{"09:00 AM", "01:30 PM"}',
    included TEXT[] DEFAULT '{}',
    included_th TEXT[] DEFAULT '{}',
    excluded TEXT[] DEFAULT '{}',
    highlights TEXT[] DEFAULT '{}',
    highlights_th TEXT[] DEFAULT '{}',
    itinerary JSONB DEFAULT '[]'::jsonb,
    itinerary_th JSONB DEFAULT '[]'::jsonb,
    hero_image TEXT NOT NULL,
    gallery_images TEXT[] DEFAULT '{}',
    suitable_for TEXT[] DEFAULT '{}',
    pricing_tiers JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
    id TEXT PRIMARY KEY,
    booking_number VARCHAR(50) UNIQUE NOT NULL,
    tour_id TEXT,
    tour_name VARCHAR(255),
    booking_date DATE NOT NULL,
    preferred_time VARCHAR(100) NOT NULL DEFAULT '09:00 AM',
    adults INTEGER NOT NULL DEFAULT 1,
    children INTEGER NOT NULL DEFAULT 0,
    selected_model VARCHAR(255),
    selected_duration VARCHAR(100),
    craft_count INTEGER DEFAULT 1,
    customer_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    whatsapp VARCHAR(50) NOT NULL,
    country VARCHAR(100) NOT NULL,
    language VARCHAR(10) DEFAULT 'en',
    special_request TEXT,
    total_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'paid', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. BUSINESS INFO TABLE (Singleton configuration row)
CREATE TABLE IF NOT EXISTS public.business_info (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
    company_name VARCHAR(255) NOT NULL,
    company_name_th VARCHAR(255),
    tagline TEXT,
    tagline_th TEXT,
    phone VARCHAR(50) NOT NULL,
    whatsapp VARCHAR(50) NOT NULL,
    line_id VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    main_base TEXT NOT NULL,
    main_base_th TEXT,
    north_base TEXT,
    north_base_th TEXT,
    operating_hours VARCHAR(100) NOT NULL,
    operating_hours_th VARCHAR(100),
    license_number VARCHAR(100) NOT NULL,
    google_maps_url TEXT NOT NULL,
    facebook_url TEXT,
    instagram_url TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. CUSTOMER INQUIRIES & MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. CUSTOMER REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    tour_name VARCHAR(255) NOT NULL,
    comment TEXT NOT NULL,
    avatar TEXT,
    approved BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. AVAILABILITY TABLE
CREATE TABLE IF NOT EXISTS public.availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tour_id TEXT REFERENCES public.tours(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    max_guests INTEGER NOT NULL DEFAULT 12,
    booked_guests INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'limited', 'sold_out', 'closed')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(tour_id, date)
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_tours_slug ON public.tours(slug);
CREATE INDEX IF NOT EXISTS idx_tours_featured ON public.tours(featured);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_number ON public.bookings(booking_number);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON public.reviews(approved);

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ & WRITE POLICIES (Configured for web client with anon key)
-- Tours
DROP POLICY IF EXISTS "Public read active tours" ON public.tours;
CREATE POLICY "Public read active tours" ON public.tours FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public manage tours" ON public.tours;
CREATE POLICY "Public manage tours" ON public.tours FOR ALL USING (true) WITH CHECK (true);

-- Bookings
DROP POLICY IF EXISTS "Public read bookings" ON public.bookings;
CREATE POLICY "Public read bookings" ON public.bookings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert bookings" ON public.bookings;
CREATE POLICY "Public insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public update bookings" ON public.bookings;
CREATE POLICY "Public update bookings" ON public.bookings FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public delete bookings" ON public.bookings;
CREATE POLICY "Public delete bookings" ON public.bookings FOR DELETE USING (true);

-- Business Info
DROP POLICY IF EXISTS "Public read business_info" ON public.business_info;
CREATE POLICY "Public read business_info" ON public.business_info FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public upsert business_info" ON public.business_info;
CREATE POLICY "Public upsert business_info" ON public.business_info FOR ALL USING (true) WITH CHECK (true);

-- Inquiries
DROP POLICY IF EXISTS "Public read inquiries" ON public.inquiries;
CREATE POLICY "Public read inquiries" ON public.inquiries FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert inquiries" ON public.inquiries;
CREATE POLICY "Public insert inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);

-- Reviews
DROP POLICY IF EXISTS "Public read reviews" ON public.reviews;
CREATE POLICY "Public read reviews" ON public.reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert reviews" ON public.reviews;
CREATE POLICY "Public insert reviews" ON public.reviews FOR INSERT WITH CHECK (true);

-- Availability
DROP POLICY IF EXISTS "Public read availability" ON public.availability;
CREATE POLICY "Public read availability" ON public.availability FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public manage availability" ON public.availability;
CREATE POLICY "Public manage availability" ON public.availability FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- INITIAL DEFAULT SEED DATA
-- ==============================================================================

-- Seed Business Info
INSERT INTO public.business_info (
    id, company_name, company_name_th, tagline, tagline_th,
    phone, whatsapp, line_id, email, main_base, main_base_th,
    north_base, north_base_th, operating_hours, operating_hours_th,
    license_number, google_maps_url
) VALUES (
    'default',
    'Koh Phangan Marine Adventures',
    'เกาะพะงัน มารีน แอดเวนเจอร์ส',
    'Premier private speedboat charters, jet ski safaris, and island tours on Koh Phangan.',
    'บริการเรือสปีดโบ๊ทเหมาลำส่วนตัว ทัวร์เจ็ทสกี ดำน้ำเกาะเต่า-อ่างทอง และทริปตกปลาเกาะพะงัน',
    '+66 83 690 3666',
    '+66 83 690 3666',
    '0836903666',
    'info@kohphanganmarineadventures.com',
    'Thong Sala Coastal Pier & Harbor Road, Koh Phangan, Surat Thani 84280',
    'ท่าเรือท้องศาลาและถนนเลียบชายหาด เกาะพะงัน สุราษฎร์ธานี 84280',
    'Chaloklum Fishing Bay & Pier, Koh Phangan',
    'อ่าวโฉลกหลำและท่าเรือประมง เกาะพะงัน',
    '07:30 AM – 07:00 PM (Daily)',
    '07:30 น. – 19:00 น. (ทุกวัน)',
    '34/01928',
    'https://maps.google.com/?q=Koh+Phangan+Surat+Thani+Thailand'
) ON CONFLICT (id) DO UPDATE SET updated_at = NOW();
