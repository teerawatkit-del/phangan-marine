import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Booking, Tour, BusinessInfo } from '../types';

export interface SupabaseConfigState {
  url: string;
  anonKey: string;
  source: 'env' | 'custom' | 'none';
  isConfigured: boolean;
}

const cleanSupabaseUrl = (url: string): string => {
  let cleaned = url.trim();
  cleaned = cleaned.replace(/\/rest\/v1\/?$/, '');
  cleaned = cleaned.replace(/\/+$/, '');
  return cleaned;
};

// ── 1. RETRIEVE CURRENT SUPABASE CONFIG ──
export const getSupabaseConfig = (): SupabaseConfigState => {
  const customUrl = localStorage.getItem('phangan_supabase_url') || '';
  const customKey = localStorage.getItem('phangan_supabase_anon_key') || '';
  
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  if (customUrl && customKey) {
    const sanitizedUrl = cleanSupabaseUrl(customUrl);
    return {
      url: sanitizedUrl,
      anonKey: customKey.trim(),
      source: 'custom',
      isConfigured: sanitizedUrl.startsWith('https://') && !sanitizedUrl.includes('placeholder')
    };
  }

  if (envUrl && envKey) {
    const sanitizedUrl = cleanSupabaseUrl(envUrl);
    return {
      url: sanitizedUrl,
      anonKey: envKey.trim(),
      source: 'env',
      isConfigured: sanitizedUrl.startsWith('https://') && !sanitizedUrl.includes('placeholder')
    };
  }

  return {
    url: '',
    anonKey: '',
    source: 'none',
    isConfigured: false
  };
};

export const saveSupabaseConfig = (url: string, anonKey: string): void => {
  if (url.trim() && anonKey.trim()) {
    localStorage.setItem('phangan_supabase_url', url.trim());
    localStorage.setItem('phangan_supabase_anon_key', anonKey.trim());
  } else {
    localStorage.removeItem('phangan_supabase_url');
    localStorage.removeItem('phangan_supabase_anon_key');
  }
  // Reset cached client
  cachedClient = null;
};

export const clearCustomSupabaseConfig = (): void => {
  localStorage.removeItem('phangan_supabase_url');
  localStorage.removeItem('phangan_supabase_anon_key');
  cachedClient = null;
};

// ── 2. INSTANTIATE SUPABASE CLIENT DYNAMICALLY ──
let cachedClient: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  const config = getSupabaseConfig();
  if (!config.isConfigured) return null;

  if (!cachedClient) {
    try {
      cachedClient = createClient(config.url, config.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      });
    } catch (err) {
      console.error('Failed to create Supabase client:', err);
      return null;
    }
  }

  return cachedClient;
};

export const isSupabaseConfigured = (): boolean => {
  return getSupabaseConfig().isConfigured;
};

export const supabase = getSupabaseClient();

// ── 3. CONNECTION TESTER ──
export interface ConnectionTestResult {
  success: boolean;
  latencyMs?: number;
  message: string;
  details?: string;
  tableCount?: {
    bookings?: number;
    tours?: number;
  };
}

export const testSupabaseConnection = async (
  customUrl?: string,
  customKey?: string
): Promise<ConnectionTestResult> => {
  const url = customUrl !== undefined ? customUrl.trim() : getSupabaseConfig().url;
  const anonKey = customKey !== undefined ? customKey.trim() : getSupabaseConfig().anonKey;

  if (!url || !anonKey) {
    return {
      success: false,
      message: 'Supabase URL หรือ Anon Key ยังไม่ได้ถูกระบุ'
    };
  }

  if (!url.startsWith('https://')) {
    return {
      success: false,
      message: 'Supabase URL ต้องขึ้นต้นด้วย https:// (เช่น https://your-project.supabase.co)'
    };
  }

  const startTime = Date.now();

  try {
    const testClient = createClient(url, anonKey);
    
    // Attempt a light SELECT from bookings or tours table
    const { data: bookingsData, error: bookingsError } = await testClient
      .from('bookings')
      .select('id', { count: 'exact', head: true });

    const latencyMs = Date.now() - startTime;

    if (bookingsError) {
      // If table doesn't exist yet, it's connected to Supabase but schema is missing
      if (bookingsError.message.includes('relation "public.bookings" does not exist') || bookingsError.code === '42P01') {
        return {
          success: true,
          latencyMs,
          message: 'เชื่อมต่อ Supabase สำเร็จ! แต่ยังไม่พบตารางข้อมูล (กรุณารันไฟล์ schema.sql ใน SQL Editor)',
          details: bookingsError.message
        };
      }

      return {
        success: false,
        latencyMs,
        message: `เชื่อมต่อไม่สำเร็จ: ${bookingsError.message}`,
        details: JSON.stringify(bookingsError)
      };
    }

    // Try counting tours as well
    const { count: toursCount } = await testClient
      .from('tours')
      .select('id', { count: 'exact', head: true });

    return {
      success: true,
      latencyMs,
      message: `เชื่อมต่อ Supabase Cloud สำเร็จเรียบร้อย! (ความเร็วการตอบสนอง ${latencyMs}ms)`,
      tableCount: {
        bookings: bookingsData ? 1 : 0,
        tours: toursCount || 0
      }
    };
  } catch (err: unknown) {
    const latencyMs = Date.now() - startTime;
    const msg = err instanceof Error ? err.message : 'Unknown network error';
    return {
      success: false,
      latencyMs,
      message: `เกิดข้อผิดพลาดในการเชื่อมต่อ: ${msg}`,
      details: String(err)
    };
  }
};

// ── 4. CLOUD SYNC SERVICES ──

// Push all local bookings to Supabase
export const syncBookingsToCloud = async (bookings: Booking[]): Promise<{ success: boolean; count: number; error?: string }> => {
  const client = getSupabaseClient();
  if (!client) return { success: false, count: 0, error: 'Supabase is not configured' };

  try {
    const rows = bookings.map((b) => ({
      id: b.id,
      booking_number: b.booking_number,
      tour_id: b.tour_id,
      tour_name: b.tour_name || '',
      booking_date: b.booking_date,
      preferred_time: b.preferred_time,
      adults: b.adults,
      children: b.children,
      selected_model: b.selected_model || null,
      selected_duration: b.selected_duration || null,
      craft_count: b.craft_count || 1,
      customer_name: b.customer_name,
      email: b.email,
      phone: b.phone || null,
      whatsapp: b.whatsapp,
      country: b.country,
      language: b.language,
      special_request: b.special_request || null,
      total_price: b.total_price,
      status: b.status,
      notes: b.notes || null,
      created_at: b.created_at,
      updated_at: new Date().toISOString()
    }));

    const { error } = await client
      .from('bookings')
      .upsert(rows, { onConflict: 'id' });

    if (error) throw error;
    return { success: true, count: rows.length };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('syncBookingsToCloud failed:', err);
    return { success: false, count: 0, error: errorMsg };
  }
};

// Pull bookings from Supabase
export const fetchBookingsFromCloud = async (): Promise<{ success: boolean; data: Booking[]; error?: string }> => {
  const client = getSupabaseClient();
  if (!client) return { success: false, data: [], error: 'Supabase is not configured' };

  try {
    const { data, error } = await client
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data: (data || []) as Booking[] };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('fetchBookingsFromCloud failed:', err);
    return { success: false, data: [], error: errorMsg };
  }
};

// Push Business Info to Supabase
export const syncBusinessInfoToCloud = async (info: BusinessInfo): Promise<{ success: boolean; error?: string }> => {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase is not configured' };

  try {
    const row = {
      id: 'default',
      company_name: info.companyName,
      company_name_th: info.companyNameTh,
      tagline: info.tagline,
      tagline_th: info.taglineTh,
      phone: info.phone,
      whatsapp: info.whatsapp,
      line_id: info.lineId,
      email: info.email,
      main_base: info.mainBase,
      main_base_th: info.mainBaseTh,
      north_base: info.northBase,
      north_base_th: info.northBaseTh,
      operating_hours: info.operatingHours,
      operating_hours_th: info.operatingHoursTh,
      license_number: info.licenseNumber,
      google_maps_url: info.googleMapsUrl,
      facebook_url: info.facebookUrl || null,
      instagram_url: info.instagramUrl || null,
      updated_at: new Date().toISOString()
    };

    const { error } = await client
      .from('business_info')
      .upsert([row], { onConflict: 'id' });

    if (error) throw error;
    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('syncBusinessInfoToCloud failed:', err);
    return { success: false, error: errorMsg };
  }
};

// Pull Business Info from Supabase
export const fetchBusinessInfoFromCloud = async (): Promise<{ success: boolean; data?: Partial<BusinessInfo>; error?: string }> => {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase is not configured' };

  try {
    const { data, error } = await client
      .from('business_info')
      .select('*')
      .eq('id', 'default')
      .maybeSingle();

    if (error) throw error;
    if (!data) return { success: true, data: undefined };

    const parsedInfo: Partial<BusinessInfo> = {
      companyName: data.company_name,
      companyNameTh: data.company_name_th,
      tagline: data.tagline,
      taglineTh: data.tagline_th,
      phone: data.phone,
      whatsapp: data.whatsapp,
      lineId: data.line_id,
      email: data.email,
      mainBase: data.main_base,
      mainBaseTh: data.main_base_th,
      northBase: data.north_base,
      northBaseTh: data.north_base_th,
      operatingHours: data.operating_hours,
      operatingHoursTh: data.operating_hours_th,
      licenseNumber: data.license_number,
      googleMapsUrl: data.google_maps_url,
      facebookUrl: data.facebook_url,
      instagramUrl: data.instagram_url
    };

    return { success: true, data: parsedInfo };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('fetchBusinessInfoFromCloud failed:', err);
    return { success: false, error: errorMsg };
  }
};

// Push Tours to Supabase
export const syncToursToCloud = async (tours: Tour[]): Promise<{ success: boolean; count: number; error?: string }> => {
  const client = getSupabaseClient();
  if (!client) return { success: false, count: 0, error: 'Supabase is not configured' };

  try {
    const rows = tours.map((t) => ({
      id: t.id,
      name: t.name,
      name_th: t.name_th || null,
      slug: t.slug,
      category: t.category,
      boat_type: t.boat_type || null,
      boat_type_th: t.boat_type_th || null,
      boat_specs: t.boat_specs || null,
      boat_specs_th: t.boat_specs_th || null,
      short_description: t.short_description,
      short_description_th: t.short_description_th || null,
      description: t.description,
      description_th: t.description_th || null,
      duration: t.duration,
      duration_th: t.duration_th || null,
      price_from: t.price_from,
      max_guests: t.max_guests,
      featured: t.featured,
      active: t.active,
      rating: t.rating,
      review_count: t.review_count,
      departure_location: t.departure_location,
      departure_times: t.departure_times,
      included: t.included,
      included_th: t.included_th || [],
      excluded: t.excluded || [],
      highlights: t.highlights,
      highlights_th: t.highlights_th || [],
      itinerary: t.itinerary,
      itinerary_th: t.itinerary_th || [],
      hero_image: t.hero_image,
      gallery_images: t.gallery_images,
      suitable_for: t.suitable_for,
      pricing_tiers: t.pricing_tiers || [],
      updated_at: new Date().toISOString()
    }));

    const { error } = await client
      .from('tours')
      .upsert(rows, { onConflict: 'id' });

    if (error) throw error;
    return { success: true, count: rows.length };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('syncToursToCloud failed:', err);
    return { success: false, count: 0, error: errorMsg };
  }
};

// Pull Tours from Supabase
export const fetchToursFromCloud = async (): Promise<{ success: boolean; data: Tour[]; error?: string }> => {
  const client = getSupabaseClient();
  if (!client) return { success: false, data: [], error: 'Supabase is not configured' };

  try {
    const { data, error } = await client
      .from('tours')
      .select('*')
      .order('price_from', { ascending: true });

    if (error) throw error;
    return { success: true, data: (data || []) as Tour[] };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('fetchToursFromCloud failed:', err);
    return { success: false, data: [], error: errorMsg };
  }
};
