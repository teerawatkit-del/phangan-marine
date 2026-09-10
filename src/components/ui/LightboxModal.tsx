import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, Tag } from 'lucide-react';
import type { GalleryItem } from '../../types';

interface LightboxModalProps {
  item: GalleryItem | null;
  items: GalleryItem[];
  onClose: () => void;
  onSelect: (item: GalleryItem) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  item,
  items,
  onClose,
  onSelect
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!item) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, items]);

  if (!item) return null;

  const currentIndex = items.findIndex((i) => i.id === item.id);

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    onSelect(items[prevIndex]);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % items.length;
    onSelect(items[nextIndex]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
        aria-label="Close Lightbox"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation Left */}
      <button
        onClick={handlePrev}
        className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
        aria-label="Previous Image"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Navigation Right */}
      <button
        onClick={handleNext}
        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
        aria-label="Next Image"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Media & Meta */}
      <div className="max-w-5xl w-full flex flex-col items-center max-h-[90vh]">
        <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl max-h-[75vh] flex items-center justify-center bg-black/40">
          <img
            src={item.image_url}
            alt={item.title}
            className="max-h-[75vh] w-auto max-w-full object-contain rounded-xl"
          />
        </div>

        {/* Caption Bar */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 w-full max-w-3xl text-center sm:text-left px-4">
          <div>
            <h4 className="text-base sm:text-lg font-bold text-white font-display">
              {item.title}
            </h4>
            <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-slate-400 mt-1">
              <span className="flex items-center gap-1 text-cyan-400">
                <MapPin className="w-3.5 h-3.5" />
                {item.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                {item.category}
              </span>
            </div>
          </div>

          <div className="text-xs font-mono text-slate-400">
            {currentIndex + 1} / {items.length}
          </div>
        </div>
      </div>
    </div>
  );
};
