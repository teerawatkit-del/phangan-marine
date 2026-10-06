import React, { useState } from 'react';
import { Eye, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useGallery } from '../context/GalleryContext';
import { LightboxModal } from '../components/ui/LightboxModal';
import type { GalleryItem } from '../types';

export const GalleryPage: React.FC = () => {
  const { t } = useLanguage();
  const { galleryItems } = useGallery();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const categories = ['All', 'Jet Ski', 'Speedboat', 'Islands', 'Fishing', 'Snorkeling', 'Sunset'];

  const filteredItems = selectedCategory === 'All'
    ? galleryItems
    : galleryItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="pt-28 sm:pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="marine-badge">
          <Eye className="w-3.5 h-3.5 text-[#1A5C52]" />
          <span>{t.gallery.badge}</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-[#0D2137] tracking-tight">
          {t.gallery.title}
        </h1>
        <p className="text-sm sm:text-base text-[#64748B]">
          {t.gallery.subtitle}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm max-w-3xl mx-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-[#0D2137] text-white font-bold shadow-sm'
                : 'text-[#64748B] hover:text-[#0D2137] hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setLightboxItem(item)}
            className="group relative rounded-3xl overflow-hidden aspect-[4/3] bg-[#0D2137] border border-slate-200 cursor-pointer shadow-card hover:shadow-marine transition-all duration-300 hover:-translate-y-1"
          >
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D2137]/90 via-[#0D2137]/25 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

            <div className="absolute top-4 right-4">
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-[#0D2137]/85 backdrop-blur-md text-[#E8704A] border border-[#E8704A]/40">
                {item.category}
              </span>
            </div>

            <div className="absolute bottom-4 inset-x-4 flex items-end justify-between text-white">
              <div className="space-y-1">
                <h4 className="text-sm sm:text-base font-bold font-display line-clamp-1">{item.title}</h4>
                <p className="text-xs text-[#E8704A] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{item.location}</span>
                </p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white group-hover:bg-[#E8704A] group-hover:text-[#0D2137] transition-colors shrink-0 ml-2">
                <Eye className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA Banner */}
      <div className="rounded-3xl bg-[#0D2137] border border-[#E8704A]/30 p-8 sm:p-12 text-center space-y-6 shadow-2xl text-white">
        <div className="max-w-xl mx-auto space-y-2">
          <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
            Ready to Experience It in Person?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Book your private tour or jet ski adventure today. All photos represent real locations visited on our tours.
          </p>
        </div>

        <Link
          to="/book"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#C8820A] to-[#E8704A] text-[#0D2137] font-display font-extrabold text-sm uppercase tracking-wider shadow-lg hover:brightness-105 transition-all"
        >
          <Calendar className="w-4 h-4 text-[#0D2137]" />
          <span>{t.hero.bookAdventure}</span>
          <ArrowRight className="w-4 h-4 text-[#0D2137]" />
        </Link>
      </div>

      <LightboxModal
        item={lightboxItem}
        items={filteredItems}
        onClose={() => setLightboxItem(null)}
        onSelect={(item) => setLightboxItem(item)}
      />
    </div>
  );
};
