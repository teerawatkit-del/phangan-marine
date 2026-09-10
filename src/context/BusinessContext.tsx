import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSupabaseClient, isSupabaseConfigured, fetchBusinessInfoFromCloud, syncBusinessInfoToCloud } from '../lib/supabase';
import type { BusinessInfo } from '../types';

export const DEFAULT_BUSINESS_INFO: BusinessInfo = {
  companyName: 'Koh Phangan Marine Adventures',
  companyNameTh: 'เกาะพะงัน มารีน แอดเวนเจอร์ส',
  tagline: 'Premier private speedboat charters, jet ski safaris, and island tours on Koh Phangan.',
  taglineTh: 'บริการเรือสปีดโบ๊ทเหมาลำส่วนตัว ทัวร์เจ็ทสกี ดำน้ำเกาะเต่า-อ่างทอง และทริปตกปลาเกาะพะงัน',
  phone: '+66 83 690 3666',
  whatsapp: '+66 83 690 3666',
  lineId: '0836903666',
  email: 'info@kohphanganmarineadventures.com',
  mainBase: 'Thong Sala Coastal Pier & Harbor Road, Koh Phangan, Surat Thani 84280',
  mainBaseTh: 'ท่าเรือท้องศาลาและถนนเลียบชายหาด เกาะพะงัน สุราษฎร์ธานี 84280',
  northBase: 'Chaloklum Fishing Bay & Pier, Koh Phangan',
  northBaseTh: 'อ่าวโฉลกหลำและท่าเรือประมง เกาะพะงัน',
  operatingHours: '07:30 AM – 07:00 PM (Daily)',
  operatingHoursTh: '07:30 น. – 19:00 น. (ทุกวัน)',
  licenseNumber: '34/01928',
  googleMapsUrl: 'https://maps.google.com/?q=Koh+Phangan+Surat+Thani+Thailand',
  facebookUrl: 'https://facebook.com',
  instagramUrl: 'https://instagram.com'
};

interface BusinessContextType {
  businessInfo: BusinessInfo;
  updateBusinessInfo: (updated: Partial<BusinessInfo>) => void;
  resetBusinessInfo: () => void;
  getWhatsAppUrl: (customMsg?: string) => string;
  getLineUrl: () => string;
  getPhoneTelUrl: () => string;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const BusinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>(() => {
    const saved = localStorage.getItem('phangan_business_info');
    if (saved) {
      try {
        return { ...DEFAULT_BUSINESS_INFO, ...JSON.parse(saved) };
      } catch {
        return DEFAULT_BUSINESS_INFO;
      }
    }
    return DEFAULT_BUSINESS_INFO;
  });

  useEffect(() => {
    localStorage.setItem('phangan_business_info', JSON.stringify(businessInfo));
  }, [businessInfo]);

  // Load from Supabase on mount if configured
  useEffect(() => {
    const loadCloudBusiness = async () => {
      if (isSupabaseConfigured()) {
        try {
          const res = await fetchBusinessInfoFromCloud();
          if (res.success && res.data) {
            setBusinessInfo((prev) => ({ ...prev, ...res.data }));
          }
        } catch (err) {
          console.warn('Supabase business info fetch fallback to local:', err);
        }
      }
    };
    loadCloudBusiness();
  }, []);

  const updateBusinessInfo = (updated: Partial<BusinessInfo>) => {
    setBusinessInfo((prev) => {
      const merged = { ...prev, ...updated };
      if (isSupabaseConfigured()) {
        syncBusinessInfoToCloud(merged).catch((err) =>
          console.error('Failed to sync business info to Supabase:', err)
        );
      }
      return merged;
    });
  };

  const resetBusinessInfo = () => {
    setBusinessInfo(DEFAULT_BUSINESS_INFO);
    localStorage.removeItem('phangan_business_info');
  };

  const getWhatsAppUrl = (customMsg?: string) => {
    const cleanNumber = businessInfo.whatsapp.replace(/[^0-9]/g, '');
    const msg = customMsg || 'Hello! I am interested in Koh Phangan boat tours and marine adventures.';
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;
  };

  const getLineUrl = () => {
    const cleanId = businessInfo.lineId.trim();
    if (cleanId.startsWith('http')) return cleanId;
    if (cleanId.startsWith('@')) return `https://line.me/R/ti/p/${cleanId}`;
    return `https://line.me/ti/p/~${cleanId}`;
  };

  const getPhoneTelUrl = () => {
    return `tel:${businessInfo.phone.replace(/[^0-9+]/g, '')}`;
  };

  return (
    <BusinessContext.Provider
      value={{
        businessInfo,
        updateBusinessInfo,
        resetBusinessInfo,
        getWhatsAppUrl,
        getLineUrl,
        getPhoneTelUrl
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};
