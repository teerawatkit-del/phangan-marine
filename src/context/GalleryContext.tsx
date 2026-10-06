import React, { createContext, useContext, useState, useEffect } from 'react';
import { galleryData as initialGalleryData } from '../data/galleryData';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import type { GalleryItem } from '../types';

interface GalleryContextType {
  galleryItems: GalleryItem[];
  addGalleryItem: (item: GalleryItem) => void;
  updateGalleryItem: (updatedItem: GalleryItem) => void;
  deleteGalleryItem: (id: string) => void;
  resetToDefault: () => void;
}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export const GalleryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('phangan_gallery_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
        return initialGalleryData;
      }
    }
    return initialGalleryData;
  });

  useEffect(() => {
    localStorage.setItem('phangan_gallery_data', JSON.stringify(galleryItems));
  }, [galleryItems]);

  // Load from Supabase if configured
  useEffect(() => {
    const fetchCloud = async () => {
      const client = getSupabaseClient();
      if (isSupabaseConfigured() && client) {
        try {
          const { data, error } = await client.from('gallery').select('*').order('created_at', { ascending: false });
          if (!error && data && data.length > 0) {
            setGalleryItems(data as GalleryItem[]);
          }
        } catch (err) {
          console.warn('Supabase gallery fetch fallback to local:', err);
        }
      }
    };
    fetchCloud();
  }, []);

  const addGalleryItem = async (newItem: GalleryItem) => {
    setGalleryItems((prev) => [newItem, ...prev]);

    const client = getSupabaseClient();
    if (isSupabaseConfigured() && client) {
      try {
        await client.from('gallery').insert([{ ...newItem, created_at: new Date().toISOString() }]);
      } catch (err) {
        console.error('Failed to add gallery item to Supabase:', err);
      }
    }
  };

  const updateGalleryItem = async (updatedItem: GalleryItem) => {
    setGalleryItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );

    const client = getSupabaseClient();
    if (isSupabaseConfigured() && client) {
      try {
        await client.from('gallery').upsert([updatedItem], { onConflict: 'id' });
      } catch (err) {
        console.error('Failed to sync gallery item to Supabase:', err);
      }
    }
  };

  const deleteGalleryItem = async (id: string) => {
    setGalleryItems((prev) => prev.filter((item) => item.id !== id));

    const client = getSupabaseClient();
    if (isSupabaseConfigured() && client) {
      try {
        await client.from('gallery').delete().eq('id', id);
      } catch (err) {
        console.error('Failed to delete gallery item from Supabase:', err);
      }
    }
  };

  const resetToDefault = () => {
    setGalleryItems(initialGalleryData);
    localStorage.removeItem('phangan_gallery_data');
  };

  return (
    <GalleryContext.Provider
      value={{
        galleryItems,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        resetToDefault,
      }}
    >
      {children}
    </GalleryContext.Provider>
  );
};

export const useGallery = () => {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  return context;
};
