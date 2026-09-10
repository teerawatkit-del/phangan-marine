import React from 'react';
import { Star, Quote, CheckCircle2, Award } from 'lucide-react';
import type { Review } from '../../types';

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="rounded-3xl bg-white border border-stone-200/90 p-6 sm:p-7 shadow-card flex flex-col justify-between space-y-4 relative overflow-hidden group hover:border-[#E8704A]/60 hover:shadow-marine transition-all duration-300">
      <Quote className="absolute top-4 right-4 w-10 h-10 text-[#1A5C52]/10 pointer-events-none" />

      <div className="space-y-3">
        {/* Star Rating + Verified Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {Array.from({ length: review.rating }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-[#C8820A] text-[#C8820A]" />
            ))}
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Verified Guest</span>
          </span>
        </div>

        {/* Comment */}
        <p className="text-sm text-[#172126] leading-relaxed italic">
          "{review.comment}"
        </p>
      </div>

      {/* Author & Tour Info */}
      <div className="pt-4 border-t border-stone-100 flex items-center gap-3">
        {review.avatar ? (
          <img
            src={review.avatar}
            alt={review.name}
            className="w-11 h-11 rounded-full object-cover border-2 border-[#E8704A]/40 shadow-sm"
            loading="lazy"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-[#EDE0CB] border border-[#1A5C52]/30 text-[#0D2137] font-bold text-sm flex items-center justify-center shadow-sm">
            {review.name.charAt(0)}
          </div>
        )}

        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-[#0D2137] font-display">{review.name}</span>
          </div>
          <div className="text-xs text-[#5C6E7A]">
            <span>{review.country}</span>
            {review.date && <span className="text-stone-400"> • {review.date}</span>}
          </div>
          <div className="text-[11px] text-[#1A5C52] font-semibold line-clamp-1">
            🛥️ {review.tour_name}
          </div>
        </div>
      </div>
    </div>
  );
};
