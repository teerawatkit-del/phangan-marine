import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Eye, 
  TrendingUp, 
  MessageCircle, 
  Mail,
  Printer,
  Bell,
  Send,
  Download,
  AlertCircle,
  Anchor,
  Compass,
  Check,
  Volume2,
  VolumeX,
  FileText,
  Edit3,
  Plus,
  Trash2,
  RotateCcw,
  Sparkles,
  Image as ImageIcon,
  Save,
  Lock,
  Unlock,
  Key,
  LogOut,
  Building2,
  EyeOff,
  Phone,
  MapPin,
  Globe,
  Sliders,
  Copy,
  ExternalLink,
  Database,
  Cloud,
  Server,
  RefreshCw,
  UploadCloud,
  DownloadCloud,
  Code
} from 'lucide-react';
import { useBookings } from '../context/BookingContext';
import { useTours } from '../context/TourContext';
import { useBusiness } from '../context/BusinessContext';
import { 
  generateEmailHtml, 
  generateEmailText, 
  generateMailtoLink, 
  sendAutomatedEmail, 
  sendTestEmail, 
  getEmailSettings, 
  saveEmailSettings, 
  EmailSettings 
} from '../lib/emailService';
import {
  getSupabaseConfig,
  saveSupabaseConfig,
  clearCustomSupabaseConfig,
  testSupabaseConnection,
  syncBookingsToCloud,
  fetchBookingsFromCloud,
  syncToursToCloud,
  fetchToursFromCloud,
  syncBusinessInfoToCloud,
  fetchBusinessInfoFromCloud,
  isSupabaseConfigured
} from '../lib/supabase';
import type { Booking, BookingStatus, Tour, BusinessInfo } from '../types';

export const AdminPage: React.FC = () => {
  const { bookings, updateBookingStatus, metrics } = useBookings();
  const { tours, updateTour, resetToDefault } = useTours();
  const { businessInfo, updateBusinessInfo, resetBusinessInfo } = useBusiness();

  // ── 1. AUTHENTICATION & SECURITY STATE ──
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('phangan_admin_authenticated') === 'true';
  });
  const [enteredPassword, setEnteredPassword] = useState<string>('');
  const [showLoginPassword, setShowLoginPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [isLockedOut, setIsLockedOut] = useState<boolean>(false);
  const [lockoutTimer, setLockoutTimer] = useState<number>(0);

  // ── 2. ADMIN TABS ──
  const [activeTab, setActiveTab] = useState<
    'bookings' | 'tours' | 'manifest' | 'business' | 'database' | 'notifications' | 'availability' | 'security'
  >('bookings');
  
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Supabase Cloud State
  const [supabaseConfigState, setSupabaseConfigState] = useState(getSupabaseConfig);
  const [supabaseUrlInput, setSupabaseUrlInput] = useState<string>(() => getSupabaseConfig().url);
  const [supabaseKeyInput, setSupabaseKeyInput] = useState<string>(() => getSupabaseConfig().anonKey);
  const [showSupabaseKey, setShowSupabaseKey] = useState<boolean>(false);
  const [supabaseTestStatus, setSupabaseTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [supabaseTestFeedback, setSupabaseTestFeedback] = useState<string>('');
  const [supabaseSaveSuccess, setSupabaseSaveSuccess] = useState<boolean>(false);
  const [supabaseSyncStatus, setSupabaseSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [supabaseSyncMsg, setSupabaseSyncMsg] = useState<string>('');
  const [showSchemaModal, setShowSchemaModal] = useState<boolean>(false);
  const [copiedSchema, setCopiedSchema] = useState<boolean>(false);

  // Booking Management Modal
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [adminNotes, setAdminNotes] = useState<string>('');

  // Email Voucher Modal
  const [emailVoucherBooking, setEmailVoucherBooking] = useState<Booking | null>(null);
  const [emailSendingStatus, setEmailSendingStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [emailStatusMsg, setEmailStatusMsg] = useState<string>('');
  const [copiedHtmlCode, setCopiedHtmlCode] = useState<boolean>(false);

  // Tour CMS Modal State
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [tourSavedSuccess, setTourSavedSuccess] = useState<boolean>(false);

  // Manifest Date Selector
  const [manifestDate, setManifestDate] = useState<string>(() => new Date().toISOString().split('T')[0]);

  // Webhook settings state
  const [webhookUrl, setWebhookUrl] = useState<string>(() => localStorage.getItem('phangan_admin_webhook') || '');
  const [webhookSaved, setWebhookSaved] = useState<boolean>(false);
  const [testWebhookStatus, setTestWebhookStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  // Email Settings state
  const [emailSettings, setEmailSettingsState] = useState<EmailSettings>(getEmailSettings);
  const [emailSettingsSaved, setEmailSettingsSaved] = useState<boolean>(false);
  const [testEmailTarget, setTestEmailTarget] = useState<string>('');
  const [testEmailStatus, setTestEmailStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [testEmailFeedback, setTestEmailFeedback] = useState<string>('');
  const [showApiKey, setShowApiKey] = useState<boolean>(false);

  // Business Info Form State
  const [businessForm, setBusinessForm] = useState<BusinessInfo>(businessInfo);
  const [businessSavedSuccess, setBusinessSavedSuccess] = useState<boolean>(false);

  // Password Management State
  const [currentPasswordInput, setCurrentPasswordInput] = useState<string>('');
  const [newPasswordInput, setNewPasswordInput] = useState<string>('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState<string>('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState<boolean>(false);
  const [passwordChangeError, setPasswordChangeError] = useState<string>('');

  // Keep businessForm synced when businessInfo changes
  useEffect(() => {
    setBusinessForm(businessInfo);
  }, [businessInfo]);

  // Lockout countdown timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isLockedOut && lockoutTimer > 0) {
      interval = setInterval(() => {
        setLockoutTimer((prev) => {
          if (prev <= 1) {
            setIsLockedOut(false);
            setFailedAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLockedOut, lockoutTimer]);

  // Master / Admin Password Check
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLockedOut) return;

    const storedMasterPassword = localStorage.getItem('phangan_admin_password') || 'phangan2026';
    const cleanEntered = enteredPassword.trim();

    // Accept Master Password, Default Password, or Quick PIN (8899)
    if (cleanEntered === storedMasterPassword || cleanEntered === 'phangan2026' || cleanEntered === '8899') {
      setIsAuthenticated(true);
      sessionStorage.setItem('phangan_admin_authenticated', 'true');
      setLoginError('');
      setFailedAttempts(0);
      setEnteredPassword('');
    } else {
      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);
      if (nextAttempts >= 5) {
        setIsLockedOut(true);
        setLockoutTimer(30);
        setLoginError('Too many failed attempts. Security lock active for 30 seconds.');
      } else {
        setLoginError(`Invalid Access Password or PIN. (${5 - nextAttempts} attempts remaining)`);
      }
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('phangan_admin_authenticated');
    setEnteredPassword('');
    setLoginError('');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeError('');
    setPasswordChangeSuccess(false);

    const storedMasterPassword = localStorage.getItem('phangan_admin_password') || 'phangan2026';

    if (currentPasswordInput !== storedMasterPassword && currentPasswordInput !== 'phangan2026' && currentPasswordInput !== '8899') {
      setPasswordChangeError('Current password is incorrect.');
      return;
    }

    if (!newPasswordInput || newPasswordInput.length < 4) {
      setPasswordChangeError('New password must be at least 4 characters long.');
      return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordChangeError('New password and confirmation do not match.');
      return;
    }

    localStorage.setItem('phangan_admin_password', newPasswordInput.trim());
    setPasswordChangeSuccess(true);
    setCurrentPasswordInput('');
    setNewPasswordInput('');
    setConfirmPasswordInput('');
    setTimeout(() => setPasswordChangeSuccess(false), 4000);
  };

  const handleSaveBusinessInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessInfo(businessForm);
    setBusinessSavedSuccess(true);
    setTimeout(() => setBusinessSavedSuccess(false), 3000);
  };

  const handleSaveEmailSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveEmailSettings(emailSettings);
    setEmailSettingsSaved(true);
    setTimeout(() => setEmailSettingsSaved(false), 3000);
  };

  const handleTestEmailDispatch = async () => {
    if (!testEmailTarget.trim()) return;
    setTestEmailStatus('sending');
    setTestEmailFeedback('');

    const res = await sendTestEmail(testEmailTarget.trim(), businessInfo);
    if (res.success) {
      setTestEmailStatus('success');
      setTestEmailFeedback(res.message);
    } else {
      setTestEmailStatus('error');
      setTestEmailFeedback(res.message);
    }
  };

  const handleSendEmailVoucher = async (booking: Booking) => {
    setEmailSendingStatus('sending');
    setEmailStatusMsg('');

    const res = await sendAutomatedEmail(booking, businessInfo);
    if (res.success) {
      setEmailSendingStatus('success');
      setEmailStatusMsg(res.message);
    } else {
      setEmailSendingStatus('error');
      setEmailStatusMsg(res.message);
    }
  };

  const handleCopyVoucherHtml = (booking: Booking) => {
    const html = generateEmailHtml(booking, businessInfo);
    navigator.clipboard.writeText(html);
    setCopiedHtmlCode(true);
    setTimeout(() => setCopiedHtmlCode(false), 3000);
  };

  // Photo preset templates
  const photoPresets = [
    { label: 'Speedboat VIP', url: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d17?auto=format&fit=crop&w=1600&q=80' },
    { label: 'Jet Ski Coastal', url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1600&q=80' },
    { label: 'Koh Tao Reef', url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=80' },
    { label: 'Ang Thong Park', url: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1600&q=80' },
    { label: 'Deep Sea Fishing', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80' },
    { label: 'Sunset Cruise', url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1600&q=80' },
    { label: 'Bottle Beach', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80' },
  ];

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesSearch = searchQuery === '' ||
      b.booking_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.whatsapp.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.tour_name && b.tour_name.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  const manifestBookings = bookings.filter((b) => b.booking_date === manifestDate && b.status !== 'cancelled');

  const handleOpenDetailModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setAdminNotes(booking.notes || '');
  };

  const handleUpdateStatus = async (id: string, newStatus: BookingStatus) => {
    await updateBookingStatus(id, newStatus, adminNotes);
    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking({ ...selectedBooking, status: newStatus, notes: adminNotes });
    }
  };

  const handleSaveWebhook = () => {
    localStorage.setItem('phangan_admin_webhook', webhookUrl.trim());
    setWebhookSaved(true);
    setTimeout(() => setWebhookSaved(false), 3000);
  };

  const handleTestWebhook = async () => {
    if (!webhookUrl.trim()) return;
    setTestWebhookStatus('sending');
    try {
      await fetch(webhookUrl.trim(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'test_notification',
          title: 'Koh Phangan Marine Adventures - Test Notification',
          message: 'Webhook is working properly! You will receive instant notifications for every new booking request.',
          timestamp: new Date().toISOString()
        })
      });
      setTestWebhookStatus('success');
    } catch {
      setTestWebhookStatus('error');
    } finally {
      setTimeout(() => setTestWebhookStatus('idle'), 4000);
    }
  };

  const handleSaveTourEdits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTour) return;
    updateTour(editingTour);
    setTourSavedSuccess(true);
    setTimeout(() => {
      setTourSavedSuccess(false);
      setEditingTour(null);
    }, 1200);
  };

  // ── SUPABASE CLOUD HANDLERS ──
  const handleSaveSupabase = async (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseConfig(supabaseUrlInput, supabaseKeyInput);
    setSupabaseConfigState(getSupabaseConfig());
    setSupabaseSaveSuccess(true);
    setTimeout(() => setSupabaseSaveSuccess(false), 4000);

    setSupabaseTestStatus('testing');
    setSupabaseTestFeedback('Connecting & testing credentials...');
    const res = await testSupabaseConnection(supabaseUrlInput, supabaseKeyInput);
    if (res.success) {
      setSupabaseTestStatus('success');
      setSupabaseTestFeedback(res.message);
    } else {
      setSupabaseTestStatus('error');
      setSupabaseTestFeedback(res.message);
    }
  };

  const handleTestSupabase = async () => {
    setSupabaseTestStatus('testing');
    setSupabaseTestFeedback('Testing connection to Supabase Cloud...');
    const res = await testSupabaseConnection(supabaseUrlInput, supabaseKeyInput);
    if (res.success) {
      setSupabaseTestStatus('success');
      setSupabaseTestFeedback(res.message);
    } else {
      setSupabaseTestStatus('error');
      setSupabaseTestFeedback(res.message);
    }
  };

  const handleResetSupabaseToEnv = () => {
    clearCustomSupabaseConfig();
    const envConfig = getSupabaseConfig();
    setSupabaseConfigState(envConfig);
    setSupabaseUrlInput(envConfig.url);
    setSupabaseKeyInput(envConfig.anonKey);
    setSupabaseTestStatus('idle');
    setSupabaseTestFeedback('Reset to .env configuration');
  };

  const handlePushAllToSupabase = async () => {
    setSupabaseSyncStatus('syncing');
    setSupabaseSyncMsg('Uploading local bookings, tours, and business info to Supabase Cloud...');
    
    const [bRes, tRes, biRes] = await Promise.all([
      syncBookingsToCloud(bookings),
      syncToursToCloud(tours),
      syncBusinessInfoToCloud(businessInfo)
    ]);

    if (bRes.success && tRes.success && biRes.success) {
      setSupabaseSyncStatus('success');
      setSupabaseSyncMsg(`Sync completed! (${bRes.count} bookings, ${tRes.count} tours, and business profile updated on cloud)`);
    } else {
      setSupabaseSyncStatus('error');
      const errs = [bRes.error, tRes.error, biRes.error].filter(Boolean).join('; ');
      setSupabaseSyncMsg(`Sync error: ${errs || 'Failed to upload tables'}`);
    }
    setTimeout(() => {
      if (bRes.success && tRes.success && biRes.success) {
        setSupabaseSyncStatus('idle');
        setSupabaseSyncMsg('');
      }
    }, 6000);
  };

  const handlePullAllFromSupabase = async () => {
    setSupabaseSyncStatus('syncing');
    setSupabaseSyncMsg('Pulling latest records from Supabase Cloud...');
    
    const [bRes, tRes, biRes] = await Promise.all([
      fetchBookingsFromCloud(),
      fetchToursFromCloud(),
      fetchBusinessInfoFromCloud()
    ]);

    const details: string[] = [];
    if (bRes.success && bRes.data.length > 0) {
      details.push(`${bRes.data.length} bookings`);
    }
    if (tRes.success && tRes.data.length > 0) {
      details.push(`${tRes.data.length} tours`);
    }
    if (biRes.success && biRes.data) {
      updateBusinessInfo(biRes.data);
      details.push('business profile');
    }

    if (bRes.success && tRes.success && biRes.success) {
      setSupabaseSyncStatus('success');
      setSupabaseSyncMsg(`Downloaded from Cloud: ${details.join(', ') || 'No records found'}`);
    } else {
      setSupabaseSyncStatus('error');
      setSupabaseSyncMsg(`Download failed: ${bRes.error || tRes.error || biRes.error}`);
    }
    setTimeout(() => {
      if (bRes.success && tRes.success && biRes.success) {
        setSupabaseSyncStatus('idle');
        setSupabaseSyncMsg('');
      }
    }, 6000);
  };

  const handleCopySchemaSql = () => {
    const schemaSql = `-- ==============================================================================
-- KOH PHANGAN ISLAND ADVENTURE - SUPABASE DATABASE SCHEMA
-- Run this entire script in your Supabase SQL Editor
-- ==============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active tours" ON public.tours FOR SELECT USING (true);
CREATE POLICY "Public manage tours" ON public.tours FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Public insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update bookings" ON public.bookings FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public delete bookings" ON public.bookings FOR DELETE USING (true);
CREATE POLICY "Public read business_info" ON public.business_info FOR SELECT USING (true);
CREATE POLICY "Public upsert business_info" ON public.business_info FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read inquiries" ON public.inquiries FOR SELECT USING (true);
CREATE POLICY "Public insert inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Public insert reviews" ON public.reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read availability" ON public.availability FOR SELECT USING (true);
CREATE POLICY "Public manage availability" ON public.availability FOR ALL USING (true) WITH CHECK (true);
`;
    navigator.clipboard.writeText(schemaSql);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 3000);
  };

  const generateCaptainWhatsAppMessage = (booking: Booking) => {
    const text = 
      `🚤 *ใบงานออกเรือ - ${businessInfo.companyNameTh || 'Koh Phangan Marine'}*\n` +
      `--------------------------------\n` +
      `📌 *รหัสการจอง:* ${booking.booking_number}\n` +
      `🛥️ *ทริป / เส้นทาง:* ${booking.tour_name || 'Marine Tour'}\n` +
      (booking.selected_model ? `⚡ *เรือ / ตัวเลือก:* ${booking.selected_model}\n` : '') +
      `📅 *วันที่:* ${booking.booking_date}\n` +
      `⏰ *เวลานัดหมาย:* ${booking.preferred_time}\n` +
      `👥 *ผู้โดยสาร:* ${booking.adults} ผู้ใหญ่, ${booking.children} เด็ก (รวม ${booking.adults + booking.children} ท่าน)\n` +
      `👤 *หัวหน้ากรุ๊ป:* ${booking.customer_name} (${booking.country})\n` +
      `📱 *เบอร์ติดต่อ:* ${booking.whatsapp}\n` +
      (booking.special_request ? `📝 *ความต้องการพิเศษ:* ${booking.special_request}\n` : '') +
      `--------------------------------\n` +
      `*กัปตันโปรดตรวจเช็คอุปกรณ์เซฟตี้ น้ำมัน และเครื่องดื่มให้พร้อมก่อนออกเรือ*`;

    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  const generateCustomerConfirmationMessage = (booking: Booking) => {
    const text =
      `Hello ${booking.customer_name}! 🌊\n\n` +
      `This is ${businessInfo.companyName}.\n` +
      `We are pleased to confirm your booking *#${booking.booking_number}* for *${booking.tour_name}* on *${booking.booking_date}* at *${booking.preferred_time}*.\n\n` +
      `📍 *Departure Location:* ${businessInfo.mainBase}\n` +
      `👥 *Party:* ${booking.adults} Adults${booking.children > 0 ? `, ${booking.children} Children` : ''}\n` +
      `💰 *Total:* ฿${(Number(booking.total_price) || 0).toLocaleString()}\n\n` +
      `Our captain and crew look forward to welcoming you aboard! If you need any assistance, reply here anytime or call ${businessInfo.phone}.`;

    return `https://wa.me/${booking.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Pending
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" />
            Cancelled
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-300 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            Completed
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 text-xs font-bold uppercase">
            {status}
          </span>
        );
    }
  };

  // ── MAIN ADMIN DASHBOARD (DIRECT ACCESS) ──
  return (
    <div className="pt-28 sm:pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      {/* Admin Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="marine-badge">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1A5C52]" />
              <span>Operations Dispatch & CMS Center</span>
            </span>
            <span className="text-xs text-emerald-600 font-mono flex items-center gap-1 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Live Operator Active
            </span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-4xl text-[#0D2137]">
            Island Dispatch & Content Portal
          </h1>
        </div>

        {/* Tab Switchers & Logout Button */}
        <div className="flex items-center gap-2 flex-wrap justify-between md:justify-end">
          <div className="flex flex-wrap items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'bookings'
                  ? 'bg-[#0D2137] text-white shadow-sm'
                  : 'text-[#64748B] hover:text-[#0D2137]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Bookings ({bookings.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('tours')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'tours'
                  ? 'bg-[#0D2137] text-white shadow-sm'
                  : 'text-[#64748B] hover:text-[#0D2137]'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5 text-[#E8704A]" />
              <span>Tours CMS ({tours.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('business')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'business'
                  ? 'bg-[#0D2137] text-white shadow-sm'
                  : 'text-[#64748B] hover:text-[#0D2137]'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-[#1A5C52]" />
              <span>Business & Contacts</span>
            </button>

            <button
              onClick={() => setActiveTab('database')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'database'
                  ? 'bg-[#0D2137] text-white shadow-sm'
                  : 'text-[#64748B] hover:text-[#0D2137]'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-[#3ECF8E]" />
              <span>Supabase Cloud</span>
            </button>

            <button
              onClick={() => setActiveTab('manifest')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'manifest'
                  ? 'bg-[#0D2137] text-white shadow-sm'
                  : 'text-[#64748B] hover:text-[#0D2137]'
              }`}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Manifest</span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'notifications'
                  ? 'bg-[#0D2137] text-white shadow-sm'
                  : 'text-[#64748B] hover:text-[#0D2137]'
              }`}
            >
              <Bell className="w-3.5 h-3.5 text-[#E8704A]" />
              <span>Alerts & Emails</span>
            </button>

            <button
              onClick={() => setActiveTab('availability')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'availability'
                  ? 'bg-[#0D2137] text-white shadow-sm'
                  : 'text-[#64748B] hover:text-[#0D2137]'
              }`}
            >
              <Anchor className="w-3.5 h-3.5" />
              <span>Fleet</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Dashboard Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-card space-y-2">
          <div className="flex items-center justify-between text-[#64748B] text-xs font-bold uppercase tracking-wider">
            <span>Today's Departures</span>
            <Calendar className="w-4 h-4 text-[#1A5C52]" />
          </div>
          <div className="text-3xl font-extrabold text-[#0D2137] font-mono">{metrics.today}</div>
          <div className="text-[11px] text-[#64748B]">Scheduled for today</div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-amber-200 shadow-card space-y-2">
          <div className="flex items-center justify-between text-[#64748B] text-xs font-bold uppercase tracking-wider">
            <span>Pending Requests</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-amber-700 font-mono">{metrics.pending}</div>
          <div className="text-[11px] text-[#64748B]">Requires dispatch confirmation</div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-emerald-200 shadow-card space-y-2">
          <div className="flex items-center justify-between text-[#64748B] text-xs font-bold uppercase tracking-wider">
            <span>Active Tour Catalog</span>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-700 font-mono">
            {tours.filter(t => t.active).length} / {tours.length}
          </div>
          <div className="text-[11px] text-[#64748B]">Published on website</div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-card space-y-2">
          <div className="flex items-center justify-between text-[#64748B] text-xs font-bold uppercase tracking-wider">
            <span>Est. Active Revenue</span>
            <TrendingUp className="w-4 h-4 text-[#C8820A]" />
          </div>
          <div className="text-3xl font-extrabold text-[#0D2137] font-mono">
            ฿{metrics.totalRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#64748B]">Active pipeline value</div>
        </div>
      </div>

      {/* ── TAB 1: ALL BOOKINGS ── */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          {/* Filter & Search Toolbar */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-card flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ref #, name, phone, tour..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#E8704A]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider mr-1">Status:</span>
              {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                    statusFilter === status
                      ? 'bg-[#0D2137] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Bookings Table */}
          <div className="rounded-3xl bg-white border border-slate-200 shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0D2137] text-white uppercase font-mono tracking-wider text-[11px]">
                  <tr>
                    <th className="py-4 px-4 font-bold">Booking Ref</th>
                    <th className="py-4 px-4 font-bold">Date & Time</th>
                    <th className="py-4 px-4 font-bold">Customer</th>
                    <th className="py-4 px-4 font-bold">Tour & Vessel</th>
                    <th className="py-4 px-4 font-bold">Party</th>
                    <th className="py-4 px-4 font-bold">Price</th>
                    <th className="py-4 px-4 font-bold">Status</th>
                    <th className="py-4 px-4 font-bold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        No bookings found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-4 font-mono font-extrabold text-[#0D2137]">
                          {b.booking_number}
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-semibold text-[#0D2137]">{b.booking_date}</div>
                          <div className="text-[11px] text-[#64748B]">{b.preferred_time}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-bold text-[#0D2137]">{b.customer_name}</div>
                          <div className="text-[11px] text-[#64748B]">{b.whatsapp}</div>
                        </td>
                        <td className="py-4 px-4 max-w-xs">
                          <div className="font-semibold text-[#0D2137] line-clamp-1">{b.tour_name || 'Custom Charter'}</div>
                          {b.selected_model && (
                            <div className="text-[10px] text-[#E8704A] font-bold line-clamp-1">{b.selected_model}</div>
                          )}
                        </td>
                        <td className="py-4 px-4 font-semibold text-[#0D2137]">
                          {b.adults}A {b.children > 0 ? `+ ${b.children}C` : ''}
                        </td>
                        <td className="py-4 px-4 font-mono font-extrabold text-[#1A5C52]">
                          ฿{(Number(b.total_price) || 0).toLocaleString()}
                        </td>
                        <td className="py-4 px-4">
                          {getStatusBadge(b.status)}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={() => handleOpenDetailModal(b)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#0D2137] hover:text-white text-[#0D2137] font-bold text-xs transition-all shadow-sm"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Manage</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: MANAGE TOURS & PRICES (CMS TEMPLATE) ── */}
      {activeTab === 'tours' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header & Reset Toolbar */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-display font-extrabold text-lg text-[#0D2137]">
                Tours & Activities Catalog Manager
              </h3>
              <p className="text-xs text-[#5C6E7A]">
                Click "Edit" on any tour to update pricing, boat specs, descriptions, or change photos. Changes apply to the website immediately.
              </p>
            </div>

            <button
              onClick={() => {
                if (window.confirm('Reset all tour descriptions and prices back to default factory template?')) {
                  resetToDefault();
                }
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Default Template</span>
            </button>
          </div>

          {/* Tours Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((tour) => (
              <div
                key={tour.id}
                className={`rounded-3xl bg-white border-2 overflow-hidden shadow-card flex flex-col justify-between transition-all ${
                  tour.active ? 'border-slate-200 hover:border-[#E8704A]' : 'border-dashed border-slate-300 opacity-60'
                }`}
              >
                <div>
                  {/* Photo Banner */}
                  <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
                    <img src={tour.hero_image} alt={tour.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        tour.active ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                      }`}>
                        {tour.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 bg-[#0D2137]/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-white font-mono font-bold text-xs">
                      Starts from ฿{tour.price_from.toLocaleString()}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A5C52]">
                        {tour.category}
                      </span>
                      <h4 className="font-display font-extrabold text-base text-[#0D2137] line-clamp-1">
                        {tour.name}
                      </h4>
                      {tour.name_th && (
                        <div className="text-xs text-[#5C6E7A] line-clamp-1">{tour.name_th}</div>
                      )}
                    </div>

                    {tour.boat_type && (
                      <div className="text-xs text-[#0D2137] font-semibold bg-stone-50 p-2.5 rounded-xl border border-stone-200 line-clamp-1">
                        🛥️ {tour.boat_type}
                      </div>
                    )}

                    <p className="text-xs text-[#64748B] line-clamp-2">
                      {tour.short_description}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-[#5C6E7A] pt-2 border-t border-slate-100">
                      <span>⏱️ {tour.duration}</span>
                      <span>👥 Max {tour.max_guests} Guests</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => updateTour({ ...tour, active: !tour.active })}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                      tour.active
                        ? 'text-rose-700 bg-rose-50 border-rose-200 hover:bg-rose-100'
                        : 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    {tour.active ? 'Hide Tour' : 'Publish Tour'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingTour(tour)}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#0D2137] hover:bg-[#1A5C52] text-white text-xs font-bold shadow-sm transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#E8704A]" />
                    <span>Edit Tour Details</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 3: BUSINESS INFO & CONTACTS (CENTRALIZED CMS) ── */}
      {activeTab === 'business' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <h3 className="font-display font-extrabold text-xl text-[#0D2137] flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#1A5C52]" />
                  <span>Business Contact & Operations Information CMS</span>
                </h3>
                <p className="text-xs text-[#5C6E7A]">
                  Edit your company details, WhatsApp, phone numbers, LINE ID, and pier locations. Updates reflect instantly across all pages and buttons.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Reset business contact details back to default values?')) {
                    resetBusinessInfo();
                  }
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all shrink-0 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Default</span>
              </button>
            </div>

            {businessSavedSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-800 font-bold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Business details successfully updated across the website!</span>
              </div>
            )}

            <form onSubmit={handleSaveBusinessInfo} className="space-y-6 text-xs">
              
              {/* Section 1: Company Names */}
              <div className="space-y-3">
                <h4 className="font-display font-bold text-sm text-[#0D2137] flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-[#E8704A]" />
                  <span>1. Company Brand & Tagline</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-[#0D2137] block mb-1">Company Name (English):</label>
                    <input
                      type="text"
                      required
                      value={businessForm.companyName}
                      onChange={(e) => setBusinessForm({ ...businessForm, companyName: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-[#0D2137]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#0D2137] block mb-1">Company Name (ภาษาไทย):</label>
                    <input
                      type="text"
                      required
                      value={businessForm.companyNameTh}
                      onChange={(e) => setBusinessForm({ ...businessForm, companyNameTh: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-[#0D2137]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-[#0D2137] block mb-1">Tagline (English):</label>
                    <input
                      type="text"
                      value={businessForm.tagline}
                      onChange={(e) => setBusinessForm({ ...businessForm, tagline: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-[#0D2137]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#0D2137] block mb-1">Tagline (ภาษาไทย):</label>
                    <input
                      type="text"
                      value={businessForm.taglineTh}
                      onChange={(e) => setBusinessForm({ ...businessForm, taglineTh: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-[#0D2137]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Direct Contact Channels */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h4 className="font-display font-bold text-sm text-[#0D2137] flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-[#1A5C52]" />
                  <span>2. Direct Communication Channels</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-bold text-[#0D2137] block mb-1">Phone Number (โทรศัพท์):</label>
                    <input
                      type="text"
                      required
                      value={businessForm.phone}
                      onChange={(e) => setBusinessForm({ ...businessForm, phone: e.target.value })}
                      placeholder="e.g. +66 83 690 3666"
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono font-semibold text-[#0D2137]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#0D2137] block mb-1">WhatsApp Number:</label>
                    <input
                      type="text"
                      required
                      value={businessForm.whatsapp}
                      onChange={(e) => setBusinessForm({ ...businessForm, whatsapp: e.target.value })}
                      placeholder="e.g. +66 83 690 3666"
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono font-semibold text-[#0D2137]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#0D2137] block mb-1">LINE Official ID / Link:</label>
                    <input
                      type="text"
                      required
                      value={businessForm.lineId}
                      onChange={(e) => setBusinessForm({ ...businessForm, lineId: e.target.value })}
                      placeholder="e.g. 0836903666 or @mylineid"
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono font-semibold text-[#0D2137]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-[#0D2137] block mb-1">Business Email:</label>
                    <input
                      type="email"
                      required
                      value={businessForm.email}
                      onChange={(e) => setBusinessForm({ ...businessForm, email: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-[#0D2137]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#0D2137] block mb-1">Thai Marine License Number (เลขใบอนุญาต):</label>
                    <input
                      type="text"
                      value={businessForm.licenseNumber}
                      onChange={(e) => setBusinessForm({ ...businessForm, licenseNumber: e.target.value })}
                      placeholder="e.g. 34/01928"
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[#0D2137]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Locations & Operating Hours */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h4 className="font-display font-bold text-sm text-[#0D2137] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#E8704A]" />
                  <span>3. Marina Bases & Operating Hours</span>
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-[#0D2137] block mb-1">Main Pier Base (English):</label>
                    <input
                      type="text"
                      value={businessForm.mainBase}
                      onChange={(e) => setBusinessForm({ ...businessForm, mainBase: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-[#0D2137]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#0D2137] block mb-1">Main Pier Base (ภาษาไทย):</label>
                    <input
                      type="text"
                      value={businessForm.mainBaseTh}
                      onChange={(e) => setBusinessForm({ ...businessForm, mainBaseTh: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-[#0D2137]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-[#0D2137] block mb-1">North Pier Base (English):</label>
                    <input
                      type="text"
                      value={businessForm.northBase}
                      onChange={(e) => setBusinessForm({ ...businessForm, northBase: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-[#0D2137]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#0D2137] block mb-1">North Pier Base (ภาษาไทย):</label>
                    <input
                      type="text"
                      value={businessForm.northBaseTh}
                      onChange={(e) => setBusinessForm({ ...businessForm, northBaseTh: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-[#0D2137]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-[#0D2137] block mb-1">Operating Hours (English):</label>
                    <input
                      type="text"
                      value={businessForm.operatingHours}
                      onChange={(e) => setBusinessForm({ ...businessForm, operatingHours: e.target.value })}
                      placeholder="e.g. 07:30 AM – 07:00 PM (Daily)"
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-[#0D2137]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#0D2137] block mb-1">Operating Hours (ภาษาไทย):</label>
                    <input
                      type="text"
                      value={businessForm.operatingHoursTh}
                      onChange={(e) => setBusinessForm({ ...businessForm, operatingHoursTh: e.target.value })}
                      placeholder="e.g. 07:30 น. – 19:00 น. (ทุกวัน)"
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-[#0D2137]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[#0D2137] block mb-1">Google Maps URL:</label>
                  <input
                    type="url"
                    value={businessForm.googleMapsUrl}
                    onChange={(e) => setBusinessForm({ ...businessForm, googleMapsUrl: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-[#0D2137]"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-200 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#1A5C52] to-[#0D2137] text-white font-display font-extrabold text-xs uppercase tracking-wider shadow-md hover:brightness-110 transition-all"
                >
                  <Save className="w-4 h-4 text-[#E8704A]" />
                  <span>{businessSavedSuccess ? 'Saved Changes! ✅' : 'Save Business Details'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ── TAB 3: SUPABASE CLOUD DATABASE ── */}
      {activeTab === 'database' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header & Status Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-card space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#3ECF8E]/15 text-[#0D2137] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-[#3ECF8E]" />
                    <span>PostgreSQL Cloud Engine</span>
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                    isSupabaseConfigured() 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured() ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
                    {isSupabaseConfigured() ? 'Cloud Active' : 'Local Fallback Mode'}
                  </span>
                </div>
                <h3 className="font-display font-extrabold text-2xl text-[#0D2137]">
                  Supabase Cloud Database & Real-Time Sync
                </h3>
                <p className="text-xs text-[#5C6E7A]">
                  Manage Supabase PostgreSQL database connection, sync local bookings & tour catalog with the cloud.
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowSchemaModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-[#0D2137] hover:text-white text-[#0D2137] text-xs font-bold transition-all inline-flex items-center gap-1.5"
                >
                  <Code className="w-3.5 h-3.5 text-[#3ECF8E]" />
                  <span>View SQL Schema</span>
                </button>
              </div>
            </div>

            {/* Grid 2 Columns: Credentials & Cloud Sync */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left Card: Supabase Connection Credentials */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-5">
                <div className="space-y-1">
                  <h4 className="font-display font-bold text-sm text-[#0D2137] flex items-center gap-2">
                    <Cloud className="w-4 h-4 text-[#3ECF8E]" />
                    <span>1. Cloud Project Credentials</span>
                  </h4>
                  <p className="text-[11px] text-[#64748B]">
                    Get credentials from Supabase Dashboard &rarr; Project Settings &rarr; API
                  </p>
                </div>

                <form onSubmit={handleSaveSupabase} className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-bold text-[#0D2137] block">
                      Supabase Project URL:
                    </label>
                    <input
                      type="url"
                      required
                      value={supabaseUrlInput}
                      onChange={(e) => setSupabaseUrlInput(e.target.value)}
                      placeholder="https://your-project-ref.supabase.co"
                      className="w-full p-3 rounded-xl bg-white border border-slate-200 font-mono text-[#0D2137] focus:outline-none focus:border-[#3ECF8E]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-[#0D2137] block">
                        Supabase Anon / Public API Key:
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowSupabaseKey(!showSupabaseKey)}
                        className="text-[11px] text-[#1A5C52] font-semibold hover:underline"
                      >
                        {showSupabaseKey ? 'Hide Key' : 'Show Key'}
                      </button>
                    </div>
                    <input
                      type={showSupabaseKey ? 'text' : 'password'}
                      required
                      value={supabaseKeyInput}
                      onChange={(e) => setSupabaseKeyInput(e.target.value)}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      className="w-full p-3 rounded-xl bg-white border border-slate-200 font-mono text-[#0D2137] focus:outline-none focus:border-[#3ECF8E]"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleTestSupabase}
                        disabled={supabaseTestStatus === 'testing' || !supabaseUrlInput}
                        className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-[#0D2137] font-bold text-xs transition-all disabled:opacity-50 flex items-center gap-1.5"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${supabaseTestStatus === 'testing' ? 'animate-spin' : ''}`} />
                        <span>{supabaseTestStatus === 'testing' ? 'Testing...' : 'Test Connection'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleResetSupabaseToEnv}
                        className="px-3 py-2.5 rounded-xl bg-transparent hover:bg-slate-200 text-[#64748B] text-xs font-semibold transition-all"
                        title="Reset to .env file configuration"
                      >
                        Reset to .env
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-[#0D2137] hover:bg-[#1A5C52] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <Save className="w-3.5 h-3.5 text-[#3ECF8E]" />
                      <span>{supabaseSaveSuccess ? 'Saved! ✅' : 'Save Config'}</span>
                    </button>
                  </div>
                </form>

                {/* Test Feedback */}
                {supabaseTestFeedback && (
                  <div className={`p-3.5 rounded-xl text-xs font-semibold flex items-start gap-2 ${
                    supabaseTestStatus === 'success' 
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' 
                      : supabaseTestStatus === 'error'
                      ? 'bg-rose-50 text-rose-800 border border-rose-300'
                      : 'bg-blue-50 text-blue-800 border border-blue-300'
                  }`}>
                    {supabaseTestStatus === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
                    {supabaseTestStatus === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
                    {supabaseTestStatus === 'testing' && <RefreshCw className="w-4 h-4 text-blue-600 shrink-0 mt-0.5 animate-spin" />}
                    <div>{supabaseTestFeedback}</div>
                  </div>
                )}
              </div>

              {/* Right Card: Cloud Data Sync & Operations */}
              <div className="p-6 rounded-2xl bg-[#EDE0CB]/25 border border-[#1A5C52]/20 space-y-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="font-display font-bold text-sm text-[#0D2137] flex items-center gap-2">
                      <Server className="w-4 h-4 text-[#1A5C52]" />
                      <span>2. Cloud Synchronization Controls</span>
                    </h4>
                    <p className="text-[11px] text-[#64748B]">
                      Sync your local tour catalog, bookings, and contact details with the live Supabase cloud database.
                    </p>
                  </div>

                  {/* Sync Status Banner */}
                  {supabaseSyncMsg && (
                    <div className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                      supabaseSyncStatus === 'success' 
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' 
                        : supabaseSyncStatus === 'error'
                        ? 'bg-rose-50 text-rose-800 border border-rose-300'
                        : 'bg-blue-50 text-blue-800 border border-blue-300'
                    }`}>
                      {supabaseSyncStatus === 'syncing' ? <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      <span>{supabaseSyncMsg}</span>
                    </div>
                  )}

                  <div className="p-4 rounded-xl bg-white/80 border border-stone-200 text-xs text-[#0D2137] space-y-2">
                    <div className="font-bold">Current Local Data Snapshot:</div>
                    <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
                      <div className="p-2 rounded bg-slate-50 border border-slate-100">
                        <div className="text-[#64748B]">Bookings:</div>
                        <div className="text-sm font-bold text-[#0D2137]">{bookings.length}</div>
                      </div>
                      <div className="p-2 rounded bg-slate-50 border border-slate-100">
                        <div className="text-[#64748B]">Tours:</div>
                        <div className="text-sm font-bold text-[#0D2137]">{tours.length}</div>
                      </div>
                      <div className="p-2 rounded bg-slate-50 border border-slate-100">
                        <div className="text-[#64748B]">Business:</div>
                        <div className="text-sm font-bold text-[#1A5C52]">Configured</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sync Action Buttons */}
                <div className="space-y-2.5 pt-4 border-t border-stone-200">
                  <button
                    type="button"
                    disabled={supabaseSyncStatus === 'syncing'}
                    onClick={handlePushAllToSupabase}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#1A5C52] to-[#0D2137] hover:brightness-110 text-white font-display font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <UploadCloud className="w-4 h-4 text-[#3ECF8E]" />
                    <span>{supabaseSyncStatus === 'syncing' ? 'Syncing...' : 'Push All Local Data to Supabase (Upload)'}</span>
                  </button>

                  <button
                    type="button"
                    disabled={supabaseSyncStatus === 'syncing'}
                    onClick={handlePullAllFromSupabase}
                    className="w-full py-3 px-4 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-[#0D2137] font-bold text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
                  >
                    <DownloadCloud className="w-4 h-4 text-[#E8704A]" />
                    <span>Pull Latest Cloud Data to Local (Download)</span>
                  </button>
                </div>
              </div>

            </div>

            {/* 3-Step Setup Instructions Card */}
            <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#3ECF8E]/20 text-[#3ECF8E] flex items-center justify-center font-bold text-xs">
                    ⚡
                  </div>
                  <h4 className="font-display font-bold text-sm text-white">
                    3-Step Supabase Database Setup Guide
                  </h4>
                </div>

                <button
                  type="button"
                  onClick={handleCopySchemaSql}
                  className="px-3.5 py-1.5 rounded-lg bg-[#3ECF8E] text-[#0D2137] font-bold text-xs hover:brightness-110 transition-all flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedSchema ? 'SQL Copied! ✅' : 'Copy SQL Schema'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-slate-700 text-[#3ECF8E] inline-flex items-center justify-center text-[10px]">1</span>
                    <span>Create Project</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Sign up / Log in to <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-[#3ECF8E] underline">supabase.com</a> and create a new project.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-slate-700 text-[#3ECF8E] inline-flex items-center justify-center text-[10px]">2</span>
                    <span>Run SQL Editor Query</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Go to <strong>SQL Editor</strong> &rarr; <strong>New Query</strong> &rarr; Paste the schema script and click <strong>Run</strong>.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-slate-700 text-[#3ECF8E] inline-flex items-center justify-center text-[10px]">3</span>
                    <span>Paste Credentials</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Copy your <strong>Project URL</strong> and <strong>Anon Key</strong> into the form above or in <code>.env</code>.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── TAB 4: PASSENGER MANIFEST ── */}
      {activeTab === 'manifest' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Manifest Toolbar */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[#0D2137]">Select Date:</label>
              <input
                type="date"
                value={manifestDate}
                onChange={(e) => setManifestDate(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-[#0D2137]"
              />
              <span className="text-xs text-[#5C6E7A]">
                ({manifestBookings.length} departures scheduled)
              </span>
            </div>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0D2137] hover:bg-[#1A5C52] text-white font-bold text-xs shadow-md transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Manifest (พิมพ์ใบรายชื่อผู้โดยสาร)</span>
            </button>
          </div>

          {/* Printable Sheet */}
          <div className="p-8 rounded-3xl bg-white border border-stone-200 shadow-card space-y-6" id="printable-manifest">
            <div className="flex items-start justify-between pb-6 border-b border-stone-200">
              <div>
                <h2 className="font-display font-black text-xl text-[#0D2137]">
                  DAILY PASSENGER MANIFEST & VESSEL DEPARTURE LOG
                </h2>
                <div className="text-xs text-[#5C6E7A] mt-1">
                  {businessInfo.companyName} · License #{businessInfo.licenseNumber} · Pier Base: {businessInfo.mainBase}
                </div>
              </div>
              <div className="text-right text-xs">
                <div className="font-bold text-[#0D2137]">DATE: {manifestDate}</div>
                <div className="text-[#5C6E7A]">Total Scheduled Pax: {manifestBookings.reduce((sum, b) => sum + b.adults + b.children, 0)} Persons</div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-stone-200">
                <thead className="bg-stone-100 text-[#0D2137] uppercase font-bold text-[10px]">
                  <tr>
                    <th className="p-3 border border-stone-200">#</th>
                    <th className="p-3 border border-stone-200">Ref #</th>
                    <th className="p-3 border border-stone-200">Lead Passenger Name</th>
                    <th className="p-3 border border-stone-200">Nationality</th>
                    <th className="p-3 border border-stone-200">Pax (A+C)</th>
                    <th className="p-3 border border-stone-200">Time</th>
                    <th className="p-3 border border-stone-200">Tour & Boat Type</th>
                    <th className="p-3 border border-stone-200">Emergency Tel</th>
                    <th className="p-3 border border-stone-200">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {manifestBookings.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-slate-400">
                        No active departures scheduled on {manifestDate}.
                      </td>
                    </tr>
                  ) : (
                    manifestBookings.map((b, idx) => (
                      <tr key={b.id} className="hover:bg-stone-50">
                        <td className="p-3 border border-stone-200 font-mono">{idx + 1}</td>
                        <td className="p-3 border border-stone-200 font-mono font-bold">{b.booking_number}</td>
                        <td className="p-3 border border-stone-200 font-bold">{b.customer_name}</td>
                        <td className="p-3 border border-stone-200">{b.country}</td>
                        <td className="p-3 border border-stone-200 font-bold">{b.adults} + {b.children}</td>
                        <td className="p-3 border border-stone-200 font-mono">{b.preferred_time}</td>
                        <td className="p-3 border border-stone-200">
                          <div className="font-semibold">{b.tour_name}</div>
                          {b.selected_model && <div className="text-[10px] text-slate-500">{b.selected_model}</div>}
                        </td>
                        <td className="p-3 border border-stone-200 font-mono">{b.whatsapp}</td>
                        <td className="p-3 border border-stone-200 uppercase text-[10px] font-bold">
                          {b.status}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="pt-6 border-t border-stone-200 grid grid-cols-2 text-xs text-[#5C6E7A]">
              <div>
                <span>Chief Harbor Officer / Safety Marshal Signature: _______________________</span>
              </div>
              <div className="text-right">
                <span>Lead Boat Captain Signature: _______________________</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 5: INSTANT NOTIFICATIONS & AUTOMATED EMAIL DISPATCH ── */}
      {activeTab === 'notifications' && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Section 1: Automated Customer Email Confirmation Dispatch */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-card space-y-6">
            <div className="space-y-1 pb-4 border-b border-slate-100">
              <h3 className="font-display font-extrabold text-xl text-[#0D2137] flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#1A5C52]" />
                <span>Automated Email Confirmation & Voucher Dispatch</span>
              </h3>
              <p className="text-xs text-[#5C6E7A]">
                Configure automatic email delivery for voyage vouchers, receipts, and departure briefing notes to customers.
              </p>
            </div>

            {emailSettingsSaved && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-800 font-bold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Email service configuration saved successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveEmailSettings} className="space-y-5 text-xs">
              
              {/* Provider Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-[#0D2137] block">Active Email Delivery Provider:</label>
                  <select
                    value={emailSettings.provider}
                    onChange={(e) => setEmailSettingsState({ ...emailSettings, provider: e.target.value as any })}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-300 font-semibold text-[#0D2137] focus:outline-none focus:border-[#E8704A]"
                  >
                    <option value="native">Native Client / Mailto Mode (Default)</option>
                    <option value="resend">Resend API (Cloud Inbox Delivery - Recommended)</option>
                    <option value="webhook">Custom Webhook (Make.com / Zapier / SendGrid)</option>
                    <option value="emailjs">EmailJS Browser API</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#0D2137] block">Sender Display Name:</label>
                  <input
                    type="text"
                    required
                    value={emailSettings.senderName}
                    onChange={(e) => setEmailSettingsState({ ...emailSettings, senderName: e.target.value })}
                    placeholder="e.g. Koh Phangan Marine Adventures"
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-[#0D2137]"
                  />
                </div>
              </div>

              {/* Sender Email & Key */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-[#0D2137] block">Sender Email Address:</label>
                  <input
                    type="email"
                    required
                    value={emailSettings.senderEmail}
                    onChange={(e) => setEmailSettingsState({ ...emailSettings, senderEmail: e.target.value })}
                    placeholder="e.g. reservations@kohphanganmarineadventures.com"
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[#0D2137]"
                  />
                </div>

                {emailSettings.provider === 'resend' && (
                  <div className="space-y-1.5">
                    <label className="font-bold text-[#0D2137] block">Resend API Key (re_...):</label>
                    <div className="relative">
                      <input
                        type={showApiKey ? 'text' : 'password'}
                        value={emailSettings.apiKey}
                        onChange={(e) => setEmailSettingsState({ ...emailSettings, apiKey: e.target.value })}
                        placeholder="re_123456789..."
                        className="w-full p-3 pr-10 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[#0D2137]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 p-1"
                      >
                        {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {emailSettings.provider === 'webhook' && (
                  <div className="space-y-1.5">
                    <label className="font-bold text-[#0D2137] block">Custom Email Webhook URL:</label>
                    <input
                      type="url"
                      value={emailSettings.webhookEndpoint}
                      onChange={(e) => setEmailSettingsState({ ...emailSettings, webhookEndpoint: e.target.value })}
                      placeholder="https://hook.eu1.make.com/..."
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[#0D2137]"
                    />
                  </div>
                )}
              </div>

              {/* EmailJS Specifics */}
              {emailSettings.provider === 'emailjs' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
                  <div className="space-y-1.5">
                    <label className="font-bold text-[#0D2137] block">EmailJS Service ID:</label>
                    <input
                      type="text"
                      value={emailSettings.emailjsServiceId}
                      onChange={(e) => setEmailSettingsState({ ...emailSettings, emailjsServiceId: e.target.value })}
                      placeholder="service_xxx"
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[#0D2137]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-[#0D2137] block">EmailJS Template ID:</label>
                    <input
                      type="text"
                      value={emailSettings.emailjsTemplateId}
                      onChange={(e) => setEmailSettingsState({ ...emailSettings, emailjsTemplateId: e.target.value })}
                      placeholder="template_xxx"
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[#0D2137]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-[#0D2137] block">Public Key:</label>
                    <input
                      type="text"
                      value={emailSettings.emailjsPublicKey}
                      onChange={(e) => setEmailSettingsState({ ...emailSettings, emailjsPublicKey: e.target.value })}
                      placeholder="public_key"
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[#0D2137]"
                    />
                  </div>
                </div>
              )}

              {/* Submit & Test Email Box */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="email"
                    value={testEmailTarget}
                    onChange={(e) => setTestEmailTarget(e.target.value)}
                    placeholder="Enter email to test dispatch..."
                    className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs w-full sm:w-64"
                  />
                  <button
                    type="button"
                    disabled={testEmailStatus === 'sending' || !testEmailTarget}
                    onClick={handleTestEmailDispatch}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0D2137] font-bold text-xs transition-all shrink-0 disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{testEmailStatus === 'sending' ? 'Sending...' : 'Test Send'}</span>
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#0D2137] hover:bg-[#1A5C52] text-white font-display font-extrabold text-xs uppercase tracking-wider shadow-md transition-all"
                >
                  Save Email Settings
                </button>
              </div>

              {testEmailFeedback && (
                <div className={`p-3 rounded-xl text-xs font-semibold ${
                  testEmailStatus === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                  {testEmailFeedback}
                </div>
              )}
            </form>
          </div>

          {/* Section 2: Instant Telegram / LINE / Zapier Webhook Alert */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-card space-y-6">
            <div className="space-y-1">
              <h3 className="font-display font-extrabold text-xl text-[#0D2137] flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#E8704A]" />
                <span>Instant Operations Webhook (LINE Notify / Telegram / Zapier)</span>
              </h3>
              <p className="text-xs text-[#5C6E7A]">
                Receive instant real-time notifications on your phone or team chat whenever a customer submits a new booking.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#EDE0CB]/30 border border-[#1A5C52]/20 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#0D2137] block">
                  Webhook Endpoint URL
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://hook.eu1.make.com/... or https://notify-api.line.me/api/notify"
                    className="flex-1 px-4 py-3 rounded-xl bg-white border border-stone-300 text-xs font-mono focus:outline-none focus:border-[#E8704A]"
                  />
                  <button
                    onClick={handleSaveWebhook}
                    className="px-6 py-3 rounded-xl bg-[#0D2137] hover:bg-[#1A5C52] text-white font-bold text-xs transition-all shrink-0"
                  >
                    {webhookSaved ? 'Saved! ✅' : 'Save Webhook'}
                  </button>
                  <button
                    onClick={handleTestWebhook}
                    disabled={testWebhookStatus === 'sending' || !webhookUrl}
                    className="px-5 py-3 rounded-xl bg-[#E8704A] hover:bg-[#D45F3C] text-white font-bold text-xs transition-all shrink-0 disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>
                      {testWebhookStatus === 'sending' ? 'Sending...' : testWebhookStatus === 'success' ? 'Sent! ✅' : testWebhookStatus === 'error' ? 'Failed ❌' : 'Test Webhook'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ── TAB 6: FLEET CALENDAR ── */}
      {activeTab === 'availability' && (
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-card space-y-6 animate-fadeIn">
          <div className="space-y-1">
            <h3 className="font-display font-extrabold text-xl text-[#0D2137]">
              Boat Fleet Schedule & Vessel Allocation
            </h3>
            <p className="text-xs text-[#5C6E7A]">
              Daily overview of speedboats, jet skis, and sport fishing craft.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: '1 Engine (8 Pax) Speedboat #1', status: 'Available', color: 'emerald' },
              { name: '2 Engines (16 Pax + WC) Speedboat #2', status: 'Booked (Koh Tao)', color: 'amber' },
              { name: '2 Engines (8 Pax + WC) VIP Cruiser #3', status: 'Booked (Angthong)', color: 'amber' },
              { name: 'Yamaha 1900 CC Jet Ski #1 & #2', status: 'Available', color: 'emerald' },
              { name: 'Sea-Doo SVHO (300HP) Jet Ski #3', status: 'Available', color: 'emerald' },
              { name: '38ft Sport Fisher Cruiser #1', status: 'Available', color: 'emerald' },
            ].map((boat, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#0D2137]">{boat.name}</span>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    boat.color === 'emerald' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {boat.status}
                  </span>
                </div>
                <div className="text-[11px] text-[#64748B]">Ready for dispatch at Thong Sala Base</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TOUR CMS EDIT MODAL (TEMPLATES) ── */}
      {editingTour && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl">
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#1A5C52]">Tour Template CMS</span>
                <h3 className="font-display font-black text-xl sm:text-2xl text-[#0D2137]">
                  Edit: {editingTour.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingTour(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTourEdits} className="space-y-6 text-xs">
              
              {/* Basic Details */}
              <div className="space-y-3">
                <h4 className="font-display font-bold text-sm text-[#0D2137]">1. Tour Name & Category</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-[#0D2137] block mb-1">Tour Name (English):</label>
                    <input
                      type="text"
                      required
                      value={editingTour.name}
                      onChange={(e) => setEditingTour({ ...editingTour, name: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-[#0D2137]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#0D2137] block mb-1">Tour Name (ภาษาไทย):</label>
                    <input
                      type="text"
                      value={editingTour.name_th || ''}
                      onChange={(e) => setEditingTour({ ...editingTour, name_th: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-[#0D2137]"
                    />
                  </div>
                </div>
              </div>

              {/* Price & Capacity */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h4 className="font-display font-bold text-sm text-[#0D2137]">2. Pricing & Capacity</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-bold text-[#0D2137] block mb-1">Starting Price (฿ THB):</label>
                    <input
                      type="number"
                      required
                      value={editingTour.price_from}
                      onChange={(e) => setEditingTour({ ...editingTour, price_from: Number(e.target.value) })}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold text-[#0D2137]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#0D2137] block mb-1">Max Guests (Pax):</label>
                    <input
                      type="number"
                      required
                      value={editingTour.max_guests}
                      onChange={(e) => setEditingTour({ ...editingTour, max_guests: Number(e.target.value) })}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-[#0D2137]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#0D2137] block mb-1">Duration (e.g. 5 Hours):</label>
                    <input
                      type="text"
                      required
                      value={editingTour.duration}
                      onChange={(e) => setEditingTour({ ...editingTour, duration: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-[#0D2137]"
                    />
                  </div>
                </div>
              </div>

              {/* Boat Details */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h4 className="font-display font-bold text-sm text-[#0D2137]">3. Vessel & Boat Specifications</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-[#0D2137] block mb-1">Boat Type (English):</label>
                    <input
                      type="text"
                      value={editingTour.boat_type || ''}
                      onChange={(e) => setEditingTour({ ...editingTour, boat_type: e.target.value })}
                      placeholder="e.g. 2 Engines Speedboat (Has Bathroom)"
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-[#0D2137]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#0D2137] block mb-1">Boat Type (ภาษาไทย):</label>
                    <input
                      type="text"
                      value={editingTour.boat_type_th || ''}
                      onChange={(e) => setEditingTour({ ...editingTour, boat_type_th: e.target.value })}
                      placeholder="e.g. เรือสปีดโบ๊ท 2 เครื่องยนต์ (มีห้องน้ำ)"
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-[#0D2137]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[#0D2137] block mb-1">Engine & Amenity Specs:</label>
                  <input
                    type="text"
                    value={editingTour.boat_specs || ''}
                    onChange={(e) => setEditingTour({ ...editingTour, boat_specs: e.target.value })}
                    placeholder="e.g. Twin Yamaha 500HP · Marine Toilet · Shaded Seating · Snorkel Gear"
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-[#0D2137]"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h4 className="font-display font-bold text-sm text-[#0D2137]">4. Tour Descriptions</h4>
                <div className="space-y-3">
                  <div>
                    <label className="font-bold text-[#0D2137] block mb-1">Short Description (English):</label>
                    <input
                      type="text"
                      value={editingTour.short_description}
                      onChange={(e) => setEditingTour({ ...editingTour, short_description: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-[#0D2137]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#0D2137] block mb-1">Full Description (English):</label>
                    <textarea
                      rows={3}
                      value={editingTour.description}
                      onChange={(e) => setEditingTour({ ...editingTour, description: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-[#0D2137]"
                    />
                  </div>
                </div>
              </div>

              {/* Photo Selector & Templates */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h4 className="font-display font-bold text-sm text-[#0D2137] flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#E8704A]" />
                  <span>5. Cover Photo URL & Quick Templates</span>
                </h4>

                <div>
                  <label className="font-bold text-[#0D2137] block mb-1">Image URL (Unsplash or Direct Image):</label>
                  <input
                    type="url"
                    value={editingTour.hero_image}
                    onChange={(e) => setEditingTour({ ...editingTour, hero_image: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-[#0D2137]"
                  />
                </div>

                {/* Preset Photo Templates */}
                <div className="space-y-1.5">
                  <span className="text-[11px] text-[#5C6E7A]">Click any template below to apply photo instantly:</span>
                  <div className="flex flex-wrap gap-2">
                    {photoPresets.map((preset, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setEditingTour({ ...editingTour, hero_image: preset.url })}
                        className="px-3 py-1 rounded-lg bg-stone-100 hover:bg-[#E8704A] hover:text-white text-[#0D2137] text-[11px] font-semibold border border-stone-200 transition-all"
                      >
                        📷 {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                {editingTour.hero_image && (
                  <div className="relative aspect-[16/8] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 max-w-sm mt-2">
                    <img src={editingTour.hero_image} alt="Preview" className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded">
                      Current Preview
                    </span>
                  </div>
                )}
              </div>

              {/* Submit & Cancel */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setEditingTour(null)}
                  className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#C8820A] to-[#E8704A] text-[#0D2137] font-display font-extrabold text-xs uppercase tracking-wider shadow-md hover:brightness-105 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{tourSavedSuccess ? 'Saved Changes! ✅' : 'Save & Publish Tour'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ── BOOKING DETAIL MODAL ── */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl">
            
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-mono font-bold text-[#1A5C52] bg-[#EDE0CB] px-2.5 py-1 rounded-lg">
                  {selectedBooking.booking_number}
                </span>
                <h3 className="font-display font-black text-xl sm:text-2xl text-[#0D2137] mt-1.5">
                  {selectedBooking.customer_name}
                </h3>
              </div>
              <div>{getStatusBadge(selectedBooking.status)}</div>
            </div>

            {/* Tour & Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50">
                <span className="text-[#64748B] block">Tour Package</span>
                <span className="font-bold text-[#0D2137] text-sm">{selectedBooking.tour_name || 'Island Adventure'}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50">
                <span className="text-[#64748B] block">Scheduled Date</span>
                <span className="font-bold text-[#0D2137] text-sm">{selectedBooking.booking_date}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50">
                <span className="text-[#64748B] block">Departure Time</span>
                <span className="font-bold text-[#0D2137] text-sm">{selectedBooking.preferred_time}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50">
                <span className="text-[#64748B] block">Guests</span>
                <span className="font-bold text-[#0D2137] text-sm">{selectedBooking.adults} Adults, {selectedBooking.children} Kids</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50">
                <span className="text-[#64748B] block">Country</span>
                <span className="font-bold text-[#0D2137] text-sm">{selectedBooking.country}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50">
                <span className="text-[#64748B] block">Total Est. Price</span>
                <span className="font-bold text-[#0D2137] font-mono text-sm">฿{(Number(selectedBooking.total_price) || 0).toLocaleString()}</span>
              </div>

              {selectedBooking.selected_model && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 col-span-2 sm:col-span-3">
                  <span className="text-amber-800 font-bold block text-xs">Selected Option / Vessel Size:</span>
                  <span className="font-extrabold text-[#0D2137] text-sm">
                    {selectedBooking.selected_model}
                  </span>
                </div>
              )}
            </div>

            {/* 1-Click WhatsApp & Email Dispatch Actions */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] block">1-Click Dispatch & Communication</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href={generateCaptainWhatsAppMessage(selectedBooking)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800 hover:bg-black text-white font-bold text-xs shadow-sm transition-all"
                >
                  <Anchor className="w-4 h-4 text-[#E8704A]" />
                  <span>Send Job Sheet to Captain (ส่งใบงาน)</span>
                </a>

                <a
                  href={generateCustomerConfirmationMessage(selectedBooking)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send WhatsApp Confirmation (ส่งให้ลูกค้า)</span>
                </a>
              </div>

              {/* Email Confirmation Voucher Button */}
              <button
                type="button"
                onClick={() => setEmailVoucherBooking(selectedBooking)}
                className="w-full inline-flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-[#0D2137] to-[#1A5C52] hover:brightness-110 text-white font-bold text-xs shadow-sm transition-all mt-1"
              >
                <Mail className="w-4 h-4 text-[#E8704A]" />
                <span>📧 Email Confirmation Voucher & Receipt (ส่งอีเมลยืนยัน/ใบเสร็จ)</span>
              </button>
            </div>

            {/* Special Request */}
            {selectedBooking.special_request && (
              <div className="p-3.5 rounded-xl bg-[#EDE0CB]/60 border border-[#1A5C52]/20 text-xs space-y-1">
                <span className="font-bold text-[#0D2137] block">Guest Special Requests:</span>
                <p className="text-slate-700 italic">"{selectedBooking.special_request}"</p>
              </div>
            )}

            {/* Internal Dispatch Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                Internal Dispatch Notes
              </label>
              <textarea
                rows={2}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="e.g. Assigned to Speedboat #2 (Capt Somchai). Paid cash at pier."
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#E8704A]"
              />
            </div>

            {/* Status Update Buttons */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] block">Change Status:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleUpdateStatus(selectedBooking.id, 'confirmed')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all"
                >
                  Mark Confirmed
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedBooking.id, 'pending')}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-xs font-bold transition-all"
                >
                  Mark Pending
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedBooking.id, 'completed')}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all"
                >
                  Mark Completed
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedBooking.id, 'cancelled')}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all"
                >
                  Cancel Booking
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0D2137] text-xs font-bold transition-all"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── EMAIL CONFIRMATION VOUCHER MODAL ── */}
      {emailVoucherBooking && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-5 max-h-[92vh] overflow-y-auto border border-slate-200 shadow-2xl">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#0D2137] text-[#E8704A] flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-[#0D2137]">
                    Email Confirmation Voucher: {emailVoucherBooking.booking_number}
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Recipient: <strong className="text-[#0D2137]">{emailVoucherBooking.email}</strong> ({emailVoucherBooking.customer_name})
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEmailVoucherBooking(null);
                  setEmailSendingStatus('idle');
                  setEmailStatusMsg('');
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Email Dispatch Feedback Alert */}
            {emailStatusMsg && (
              <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                emailSendingStatus === 'success' 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' 
                  : 'bg-rose-50 text-rose-800 border border-rose-300'
              }`}>
                {emailSendingStatus === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                <span>{emailStatusMsg}</span>
              </div>
            )}

            {/* Rendered HTML Preview Frame */}
            <div className="rounded-2xl border border-slate-300 overflow-hidden shadow-inner bg-slate-100">
              <iframe
                title="Admin Email Voucher Preview"
                srcDoc={generateEmailHtml(emailVoucherBooking, businessInfo)}
                className="w-full h-96 border-0 bg-white"
              />
            </div>

            {/* Actions Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap gap-2">
                <a
                  href={generateMailtoLink(emailVoucherBooking, businessInfo)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0D2137] text-xs font-bold transition-all inline-flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Mail App (Mailto)</span>
                </a>

                <button
                  type="button"
                  onClick={() => handleCopyVoucherHtml(emailVoucherBooking)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0D2137] text-xs font-bold transition-all inline-flex items-center gap-1.5"
                >
                  {copiedHtmlCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedHtmlCode ? 'HTML Copied!' : 'Copy HTML Code'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEmailVoucherBooking(null);
                    setEmailSendingStatus('idle');
                    setEmailStatusMsg('');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                >
                  Close
                </button>

                <button
                  type="button"
                  disabled={emailSendingStatus === 'sending'}
                  onClick={() => handleSendEmailVoucher(emailVoucherBooking)}
                  className="px-6 py-2.5 rounded-xl bg-[#0D2137] hover:bg-[#1A5C52] text-white text-xs font-display font-extrabold uppercase tracking-wider shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5 text-[#E8704A]" />
                  <span>{emailSendingStatus === 'sending' ? 'Sending...' : 'Send to Customer Inbox'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── SUPABASE SQL SCHEMA MODAL ── */}
      {showSchemaModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#0D2137] text-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-5 max-h-[92vh] overflow-y-auto border border-slate-700 shadow-2xl">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-700">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#3ECF8E]/20 text-[#3ECF8E] flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-white">
                    Supabase PostgreSQL Database Schema (schema.sql)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Execute this script once in your Supabase Dashboard &rarr; SQL Editor.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowSchemaModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Quick Instruction Banner */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[#3ECF8E] font-bold">💡 Tip:</span>
                <span>Creates tables: <code>tours</code>, <code>bookings</code>, <code>business_info</code>, <code>inquiries</code>, <code>reviews</code> with Row Level Security (RLS).</span>
              </div>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-lg bg-[#3ECF8E] text-[#0D2137] font-bold text-xs hover:brightness-110 transition-all inline-flex items-center gap-1 shrink-0"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Open Supabase Dashboard</span>
              </a>
            </div>

            {/* SQL Code Block */}
            <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-emerald-400 overflow-x-auto max-h-96 leading-relaxed">
              <pre>
{`-- KOH PHANGAN ISLAND ADVENTURE - SUPABASE DATABASE SCHEMA
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

-- 3. BUSINESS INFO TABLE
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

-- 4. CUSTOMER INQUIRIES & REVIEWS
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

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active tours" ON public.tours FOR SELECT USING (true);
CREATE POLICY "Public manage tours" ON public.tours FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Public insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update bookings" ON public.bookings FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public delete bookings" ON public.bookings FOR DELETE USING (true);
CREATE POLICY "Public read business_info" ON public.business_info FOR SELECT USING (true);
CREATE POLICY "Public upsert business_info" ON public.business_info FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read inquiries" ON public.inquiries FOR SELECT USING (true);
CREATE POLICY "Public insert inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Public insert reviews" ON public.reviews FOR INSERT WITH CHECK (true);`}
              </pre>
            </div>

            {/* Modal Actions Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleCopySchemaSql}
                className="px-5 py-2.5 rounded-xl bg-[#3ECF8E] text-[#0D2137] font-bold text-xs hover:brightness-110 transition-all flex items-center gap-1.5 shadow-md"
              >
                {copiedSchema ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSchema ? 'SQL Schema Copied to Clipboard!' : 'Copy SQL Schema to Clipboard'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowSchemaModal(false)}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
