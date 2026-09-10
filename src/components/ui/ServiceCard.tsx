import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowUpRight } from 'lucide-react';
import type { Tour } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface ServiceCardProps {
  tour: Tour;
  index: number;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ tour, index }) => {
  const { language, t } = useLanguage();

  const tourName = language === 'th' && tour.name_th ? tour.name_th : tour.name;
  const tourDesc = language === 'th' && tour.short_description_th ? tour.short_description_th : tour.short_description;
  const durationText = language === 'th' && tour.duration_th ? tour.duration_th : tour.duration;

  return (
    <Link
      to={`/tours/${tour.slug}`}
      className="group relative rounded-3xl overflow-hidden bg-[#0D2137] border border-[#E8704A]/30 hover:border-[#E8704A] p-6 flex flex-col justify-between min-h-[340px] shadow-card hover:shadow-marine-lg transition-all duration-300 hover:-translate-y-1.5"
    >
      {/* Background Image with Dark Gradient Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={tour.hero_image}
          alt={tourName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-45 group-hover:opacity-60"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D2137] via-[#0D2137]/75 to-[#0D2137]/40" />
      </div>

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="text-xs font-mono font-bold text-[#E8704A] bg-[#081629]/90 px-2.5 py-1 rounded-lg border border-[#E8704A]/40">
          0{index + 1}
        </span>
        <div className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-[#E8704A] group-hover:text-[#0D2137] text-white flex items-center justify-center transition-all duration-300 shadow-md">
          <ArrowUpRight className="w-5 h-5 stroke-[2.2] group-hover:rotate-45 transition-transform" />
        </div>
      </div>

      {/* Bottom Information */}
      <div className="relative z-10 space-y-3 pt-12">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#E8704A]">
          <Clock className="w-3.5 h-3.5" />
          <span>{durationText}</span>
        </div>

        <h3 className="font-display font-extrabold text-xl sm:text-2xl text-white group-hover:text-[#E8704A] transition-colors">
          {tourName}
        </h3>

        <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 leading-relaxed">
          {tourDesc}
        </p>

        <div className="pt-2 flex items-center justify-between border-t border-white/15">
          <div className="text-xs text-slate-300">
            <span>{t.services.from} </span>
            <span className="text-base font-bold text-[#C8820A] font-mono">฿{tour.price_from.toLocaleString()}</span>
          </div>
          <span className="text-xs font-bold text-[#E8704A] group-hover:text-white flex items-center gap-1">
            {t.services.viewTour}
          </span>
        </div>
      </div>
    </Link>
  );
};
