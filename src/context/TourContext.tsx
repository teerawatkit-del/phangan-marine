import React, { createContext, useContext, useState, useEffect } from 'react';
import { toursData as initialToursData } from '../data/toursData';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import type { Tour } from '../types';

interface TourContextType {
  tours: Tour[];
  updateTour: (updatedTour: Tour) => void;
  addTour: (newTour: Tour) => void;
  deleteTour: (id: string) => void;
  resetToDefault: () => void;
  getTourBySlug: (slug: string) => Tour | undefined;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export const TourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tours, setTours] = useState<Tour[]>(() => {
    const saved = localStorage.getItem('phangan_tours_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
        return initialToursData;
      }
    }
    return initialToursData;
  });

  useEffect(() => {
    localStorage.setItem('phangan_tours_data', JSON.stringify(tours));
  }, [tours]);

  // Load from Supabase if configured
  useEffect(() => {
    const fetchCloud = async () => {
      const client = getSupabaseClient();
      if (isSupabaseConfigured() && client) {
        try {
          const { data, error } = await client.from('tours').select('*').order('price_from', { ascending: true });
          if (!error && data && data.length > 0) {
            setTours(data as Tour[]);
          }
        } catch (err) {
          console.warn('Supabase tours fetch fallback to local:', err);
        }
      }
    };
    fetchCloud();
  }, []);

  const updateTour = async (updatedTour: Tour) => {
    setTours((prev) =>
      prev.map((tour) => (tour.id === updatedTour.id ? updatedTour : tour))
    );

    const client = getSupabaseClient();
    if (isSupabaseConfigured() && client) {
      try {
        await client.from('tours').upsert([updatedTour], { onConflict: 'id' });
      } catch (err) {
        console.error('Failed to sync tour to Supabase:', err);
      }
    }
  };

  const addTour = (newTour: Tour) => {
    setTours((prev) => [...prev, newTour]);
  };

  const deleteTour = (id: string) => {
    setTours((prev) => prev.filter((tour) => tour.id !== id));
  };

  const resetToDefault = () => {
    setTours(initialToursData);
    localStorage.removeItem('phangan_tours_data');
  };

  const getTourBySlug = (slug: string) => {
    return tours.find((tour) => tour.slug === slug);
  };

  return (
    <TourContext.Provider
      value={{
        tours,
        updateTour,
        addTour,
        deleteTour,
        resetToDefault,
        getTourBySlug
      }}
    >
      {children}
    </TourContext.Provider>
  );
};

export const useTours = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTours must be used within a TourProvider');
  }
  return context;
};
