import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Users, ArrowRight, MapPin } from 'lucide-react';
import type { Tour } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface TourCardProps {
  tour: Tour;
}

export const TourCard: React.FC<TourCardProps> = ({ tour }) => {
  const { language, t } = useLanguage();

  const tourName = language === 'th' && tour.name_th ? tour.name_th : tour.name;
  const tourDesc = language === 'th' && tour.short_description_th ? tour.short_description_th : tour.short_description;
  const durationText = language === 'th' && tour.duration_th ? tour.duration_th : tour.duration;

  return (
    <div className="group rounded-3xl bg-white border border-stone-200/80 hover:border-[#E8704A]/50 shadow-card hover:shadow-marine transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1.5">
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#0D2137]">
        <img
          src={tour.hero_image}
          alt={tourName}
          className="w-full h-full object-cover group-hover:scale-107 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        {/* Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D2137]/85 via-[#0D2137]/10 to-transparent" />

        {/* Category + Rating */}
        <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between pointer-events-none">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#0D2137]/80 backdrop-blur-md text-[#E8704A] border border-[#E8704A]/30">
            {tour.category}
          </span>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0D2137]/80 backdrop-blur-md text-[#C8820A] border border-[#C8820A]/30 text-xs font-bold">
            <Star className="w-3 h-3 fill-[#C8820A] text-[#C8820A]" />
            <span>{tour.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Price overlay bottom-left */}
        <div className="absolute bottom-3 left-3.5">
          <div className="text-[10px] text-slate-300 leading-tight">{t.services.from}</div>
          <div className="text-lg font-extrabold text-white font-mono leading-tight tracking-tight">
            ฿{tour.price_from.toLocaleString()}
          </div>
        </div>

        {/* Location tag bottom-right */}
        <div className="absolute bottom-3.5 right-3.5 flex items-center gap-1 text-[10px] text-slate-300">
          <MapPin className="w-3 h-3 text-[#E8704A]" />
          <span>{tour.departure_location}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-2">
          {/* Duration + guests */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#5C6E7A]">
            <div className="flex items-center gap-1 text-[#1A5C52] font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>{durationText}</span>
            </div>
            <span className="text-stone-300">·</span>
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#E8704A]" />
              <span>Max {tour.max_guests}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-display font-bold text-lg sm:text-xl text-[#0D2137] group-hover:text-[#1A5C52] transition-colors line-clamp-1 leading-snug">
            {tourName}
          </h3>

          {/* Boat Type Pill */}
          {tour.boat_type && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#EDE0CB]/40 border border-[#1A5C52]/20 text-[10px] font-semibold text-[#1A5C52]">
              <span>🛥️ {language === 'th' && tour.boat_type_th ? tour.boat_type_th : tour.boat_type}</span>
            </div>
          )}

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#5C6E7A] line-clamp-2 leading-relaxed">
            {tourDesc}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-stone-100 grid grid-cols-2 gap-2.5">
          <Link
            to={`/tours/${tour.slug}`}
            className="group/btn flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#FAF7F2] border border-[#1A5C52]/20 hover:border-[#1A5C52] hover:bg-white transition-all duration-300"
          >
            <span className="text-[#1A5C52] font-bold text-xs">{t.services.viewTour}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#1A5C52] group-hover/btn:translate-x-1 transition-transform" />
          </Link>

          <Link
            to={`/book?tour=${tour.slug}`}
            className="group/book flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#E8704A] to-[#D45F3C] hover:from-[#D45F3C] hover:to-[#C8820A] shadow-md hover:shadow-lg shadow-[#E8704A]/30 transition-all duration-300 hover:-translate-y-0.5"
          >
            <span className="text-white text-xs font-extrabold tracking-wide drop-shadow-sm">{t.services.bookNow}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
