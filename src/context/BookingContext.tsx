import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Booking, BookingStatus } from '../types';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';

interface BookingContextType {
  bookings: Booking[];
  loading: boolean;
  addBooking: (booking: Omit<Booking, 'id' | 'booking_number' | 'created_at' | 'status'>) => Promise<Booking>;
  updateBookingStatus: (id: string, status: BookingStatus, notes?: string) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;
  getBookingByNumber: (bookingNumber: string) => Booking | undefined;
  metrics: {
    today: number;
    pending: number;
    confirmed: number;
    month: number;
    totalRevenue: number;
  };
}

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'b-101',
    booking_number: 'BK-782914',
    tour_id: 't-1',
    tour_name: 'Koh Phangan Island Tour & Secret Beaches',
    booking_date: new Date().toISOString().split('T')[0],
    preferred_time: '09:00 AM',
    adults: 2,
    children: 1,
    customer_name: 'Alexander Wright',
    email: 'alexander.wright@example.com',
    phone: '+44 7911 123456',
    whatsapp: '+44 7911 123456',
    country: 'United Kingdom',
    language: 'en',
    special_request: 'Staying at Santhiya Resort. Require hotel pickup at 08:15 AM. 1 vegetarian meal.',
    total_price: 6250,
    status: 'pending',
    created_at: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: 'b-102',
    booking_number: 'BK-542190',
    tour_id: 't-2',
    tour_name: 'Jet Ski Guided Coastal Adventure',
    booking_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    preferred_time: '04:30 PM (Sunset Tour)',
    adults: 2,
    children: 0,
    customer_name: 'Sophia Martinez',
    email: 'sophia.m@example.com',
    phone: '+1 415 555 0199',
    whatsapp: '+1 415 555 0199',
    country: 'United States',
    language: 'en',
    special_request: '2 separate jet skis (solo riders). Celebrating boyfriend birthday.',
    total_price: 9000,
    status: 'confirmed',
    created_at: new Date(Date.now() - 3600000 * 18).toISOString()
  },
  {
    id: 'b-103',
    booking_number: 'BK-391845',
    tour_id: 't-6',
    tour_name: 'Private VIP Speedboat Charter',
    booking_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    preferred_time: '10:00 AM',
    adults: 4,
    children: 2,
    customer_name: 'Laurent Mercier',
    email: 'l.mercier@example.fr',
    phone: '+33 6 12 34 56 78',
    whatsapp: '+33 6 12 34 56 78',
    country: 'France',
    language: 'en',
    special_request: 'Custom full-day charter to Koh Tao & Nang Yuan. Need bottle of champagne on ice.',
    total_price: 24500,
    status: 'confirmed',
    created_at: new Date(Date.now() - 3600000 * 42).toISOString()
  },
  {
    id: 'b-104',
    booking_number: 'BK-918230',
    tour_id: 't-4',
    tour_name: 'Ang Thong National Marine Park Expedition',
    booking_date: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
    preferred_time: '08:30 AM',
    adults: 2,
    children: 0,
    customer_name: 'Klaus Wagner',
    email: 'klaus.w@example.de',
    phone: '+49 170 5551234',
    whatsapp: '+49 170 5551234',
    country: 'Germany',
    language: 'en',
    special_request: 'Interested in sea kayaking around the caves.',
    total_price: 5600,
    status: 'pending',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString()
  }
];

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('phangan_bookings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_BOOKINGS;
      }
    }
    return INITIAL_BOOKINGS;
  });
  const [loading, setLoading] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('phangan_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Load from Supabase if active
  useEffect(() => {
    const fetchSupabaseBookings = async () => {
      const client = getSupabaseClient();
      if (isSupabaseConfigured() && client) {
        setLoading(true);
        try {
          const { data, error } = await client
            .from('bookings')
            .select('*')
            .order('created_at', { ascending: false });

          if (!error && data && data.length > 0) {
            setBookings(data as Booking[]);
          }
        } catch (err) {
          console.warn('Supabase fetch error, fallback to local storage', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSupabaseBookings();
  }, []);

  const addBooking = async (
    bookingData: Omit<Booking, 'id' | 'booking_number' | 'created_at' | 'status'>
  ): Promise<Booking> => {
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const newBooking: Booking = {
      ...bookingData,
      id: 'b-' + Date.now(),
      booking_number: `BK-${randomSuffix}`,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    // Dispatch Webhook Notification if configured
    try {
      const webhookUrl = localStorage.getItem('phangan_admin_webhook');
      if (webhookUrl) {
        fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'new_booking_request',
            booking_number: newBooking.booking_number,
            tour_name: newBooking.tour_name,
            booking_date: newBooking.booking_date,
            preferred_time: newBooking.preferred_time,
            guests: `${newBooking.adults} Adults, ${newBooking.children} Children`,
            customer_name: newBooking.customer_name,
            whatsapp: newBooking.whatsapp,
            email: newBooking.email,
            country: newBooking.country,
            total_price_thb: newBooking.total_price,
            option_details: newBooking.selected_model || 'Standard Option',
            notes: newBooking.special_request || 'None',
            created_at: newBooking.created_at
          })
        }).catch((err) => console.warn('Background webhook dispatch failed:', err));
      }
    } catch (err) {
      console.warn('Webhook error:', err);
    }

    // Save to state & local storage
    setBookings((prev) => [newBooking, ...prev]);

    // Push to Supabase if connected
    const client = getSupabaseClient();
    if (isSupabaseConfigured() && client) {
      try {
        await client.from('bookings').insert([newBooking]);
      } catch (err) {
        console.error('Failed to sync booking to Supabase:', err);
      }
    }

    return newBooking;
  };

  const updateBookingStatus = async (id: string, status: BookingStatus, notes?: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, status, notes: notes !== undefined ? notes : b.notes, updated_at: new Date().toISOString() }
          : b
      )
    );

    const client = getSupabaseClient();
    if (isSupabaseConfigured() && client) {
      try {
        await client
          .from('bookings')
          .update({ status, notes, updated_at: new Date().toISOString() })
          .eq('id', id);
      } catch (err) {
        console.error('Failed to update booking on Supabase:', err);
      }
    }
  };

  const deleteBooking = async (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));

    const client = getSupabaseClient();
    if (isSupabaseConfigured() && client) {
      try {
        await client.from('bookings').delete().eq('id', id);
      } catch (err) {
        console.error('Failed to delete booking from Supabase:', err);
      }
    }
  };

  const getBookingByNumber = (bookingNumber: string) => {
    return bookings.find(
      (b) => b.booking_number.toLowerCase() === bookingNumber.trim().toLowerCase()
    );
  };

  // Metrics calculation
  const todayStr = new Date().toISOString().split('T')[0];
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const metrics = {
    today: bookings.filter((b) => b.booking_date === todayStr).length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    month: bookings.filter((b) => {
      const bDate = new Date(b.booking_date);
      return bDate.getMonth() === currentMonth && bDate.getFullYear() === currentYear;
    }).length,
    totalRevenue: bookings
      .filter((b) => b.status === 'confirmed' || b.status === 'paid' || b.status === 'completed')
      .reduce((sum, b) => sum + (Number(b.total_price) || 0), 0)
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        loading,
        addBooking,
        updateBookingStatus,
        deleteBooking,
        getBookingByNumber,
        metrics
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};
