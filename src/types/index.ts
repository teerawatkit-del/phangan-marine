export type Language = 'en' | 'th';

export type TourCategory = 
  | 'Island Escapes'
  | 'Adrenaline & Thrills'
  | 'Nature & Wildlife'
  | 'Angling & Sport'
  | 'VIP & Private Charters';

export interface TourItineraryItem {
  time: string;
  title: string;
  description: string;
}

export interface PricingTier {
  model: string;           // e.g. "Yamaha 1900 CC" or "Single Engine (28ft · 250HP)"
  model_th?: string;
  specs?: string;          // e.g. "Up to 6 guests · Ideal for couples & small families"
  price_30min?: number;
  price_60min?: number;
  price_halfday?: number;
  price_fullday?: number;
  price_join?: number;
  price_private?: number;
  col1_title?: string;     // custom col 1 header, e.g. "Half Day (4h)" or "30 Min"
  col2_title?: string;     // custom col 2 header, e.g. "Full Day (8h)" or "60 Min"
  note?: string;
}

export interface Tour {
  id: string;
  name: string;
  name_th?: string;
  slug: string;
  category: TourCategory;
  boat_type?: string;
  boat_type_th?: string;
  boat_specs?: string;
  boat_specs_th?: string;
  short_description: string;
  short_description_th?: string;
  description: string;
  description_th?: string;
  duration: string;
  duration_th?: string;
  price_from: number;
  max_guests: number;
  featured: boolean;
  active: boolean;
  rating: number;
  review_count: number;
  departure_location: string;
  departure_times: string[];
  included: string[];
  included_th?: string[];
  excluded?: string[];
  highlights: string[];
  highlights_th?: string[];
  itinerary: TourItineraryItem[];
  itinerary_th?: TourItineraryItem[];
  hero_image: string;
  gallery_images: string[];
  suitable_for: string[];
  pricing_tiers?: PricingTier[];
}

export type BookingStatus = 'pending' | 'confirmed' | 'paid' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  booking_number: string;
  tour_id: string;
  tour_name?: string;
  booking_date: string;
  preferred_time: string;
  adults: number;
  children: number;
  selected_model?: string;
  selected_duration?: string;
  craft_count?: number;
  customer_name: string;
  email: string;
  phone?: string;
  whatsapp: string;
  country: string;
  language: Language;
  special_request?: string;
  total_price: number;
  status: BookingStatus;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  whatsapp: string;
  country: string;
  language: Language;
  created_at: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Jet Ski' | 'Speedboat' | 'Islands' | 'Fishing' | 'Snorkeling' | 'Sunset';
  image_url: string;
  location: string;
}

export interface Review {
  id: string;
  name: string;
  country: string;
  rating: number;
  date: string;
  tour_name: string;
  comment: string;
  avatar?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  question_th: string;
  answer: string;
  answer_th: string;
  category: 'General' | 'Booking & Cancellation' | 'Safety & Weather' | 'Equipment';
}

export interface BusinessInfo {
  companyName: string;
  companyNameTh: string;
  tagline: string;
  taglineTh: string;
  phone: string;
  whatsapp: string;
  lineId: string;
  email: string;
  mainBase: string;
  mainBaseTh: string;
  northBase: string;
  northBaseTh: string;
  operatingHours: string;
  operatingHoursTh: string;
  licenseNumber: string;
  googleMapsUrl: string;
  facebookUrl?: string;
  instagramUrl?: string;
}

