import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Anchor, 
  Compass, 
  Calendar, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  Waves, 
  Star, 
  CheckCircle2, 
  ChevronDown, 
  ChevronRight, 
  MessageCircle, 
  Sparkles, 
  Eye, 
  MapPin, 
  Flame 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTours } from '../context/TourContext';
import { useGallery } from '../context/GalleryContext';
import { reviewsData } from '../data/reviewsData';
import { faqData } from '../data/faqData';
import { TourCard } from '../components/ui/TourCard';
import { ServiceCard } from '../components/ui/ServiceCard';
import { ReviewCard } from '../components/ui/ReviewCard';
import { LightboxModal } from '../components/ui/LightboxModal';
import { WeatherNotice } from '../components/ui/WeatherNotice';
import type { GalleryItem } from '../types';

export const HomePage: React.FC = () => {
  const { language, t } = useLanguage();
  const { tours } = useTours();
  const { galleryItems } = useGallery();
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState<string>('All');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [selectedTourFilter, setSelectedTourFilter] = useState<string>('all');

  const filteredGallery = selectedGalleryCategory === 'All'
    ? galleryItems.slice(0, 6)
    : galleryItems.filter((item) => item.category === selectedGalleryCategory);

  const activeTours = tours.filter(t => t.active);

  const filteredTours = selectedTourFilter === 'all'
    ? activeTours
    : activeTours.filter((tour) => {
        if (selectedTourFilter === 'featured') return tour.featured;
        if (selectedTourFilter === 'charter') return tour.category === 'VIP & Private Charters';
        if (selectedTourFilter === 'adrenaline') return tour.category === 'Adrenaline & Thrills';
        return true;
      });

  return (
    <div className="space-y-24 sm:space-y-32 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
        {/* Background Ocean Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85"
            alt="Koh Phangan Turquoise Coastline"
            className="w-full h-full object-cover scale-105"
          />
          {/* Rich layered gradient — left column read, photo visible on right */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D2137]/98 via-[#0D2137]/75 to-[#0D2137]/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D2137]/80 via-transparent to-[#0D2137]/40" />
          {/* Subtle warm tint at the very bottom to bleed into ivory bg */}
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#FAF7F2] to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Top Trust Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0D2137]/80 backdrop-blur-md border border-[#E8704A]/40 text-[#E8704A] text-xs sm:text-sm font-semibold tracking-wide shadow-lg animate-float">
            <Sparkles className="w-4 h-4 text-[#C8820A]" />
            <span>{t.hero.badge}</span>
          </div>

          {/* Master Headline */}
          <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white leading-[1.1] sm:leading-[1.08]">
            {language === 'en' ? (
              <>
                Explore <span className="text-[#E8704A]">Koh Phangan</span> <br className="hidden sm:inline" />
                From The Sea.
              </>
            ) : (
              <>
                สัมผัส <span className="text-[#E8704A]">เกาะพะงัน</span> <br className="hidden sm:inline" />
                จากมุมมองทางทะเล
              </>
            )}
          </h1>

          {/* Subheadline */}
          <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-200 font-normal leading-relaxed text-balance">
            {t.hero.subheadline}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/book"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-display font-extrabold text-base text-[#0D2137] bg-gradient-to-r from-[#C8820A] to-[#E8704A] hover:brightness-110 shadow-marine-lg hover:scale-105 active:scale-95 transition-all duration-200 tracking-wide uppercase"
            >
              <Calendar className="w-5 h-5 text-[#0D2137] stroke-[2.5]" />
              <span>{t.hero.bookAdventure}</span>
            </Link>

            <Link
              to="/tours"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-display font-bold text-base text-white bg-white/10 hover:bg-white/20 border border-white/25 backdrop-blur-md hover:border-[#E8704A] transition-all duration-200"
            >
              <Compass className="w-5 h-5 text-[#E8704A]" />
              <span>{t.hero.exploreTours}</span>
            </Link>
          </div>

          {/* Hero Trust Indicators */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
            <div className="p-3.5 rounded-2xl bg-[#0D2137]/80 backdrop-blur-md border border-white/15 flex items-center justify-center gap-2.5 text-slate-100 text-xs sm:text-sm font-semibold">
              <Users className="w-4 h-4 text-[#E8704A] shrink-0" />
              <span>{t.trust.privateTours}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0D2137]/80 backdrop-blur-md border border-white/15 flex items-center justify-center gap-2.5 text-slate-100 text-xs sm:text-sm font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#E8704A] shrink-0" />
              <span>{t.trust.safetyFirst}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0D2137]/80 backdrop-blur-md border border-white/15 flex items-center justify-center gap-2.5 text-slate-100 text-xs sm:text-sm font-semibold">
              <Anchor className="w-4 h-4 text-[#E8704A] shrink-0" />
              <span>{t.trust.experiencedCrew}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0D2137]/80 backdrop-blur-md border border-white/15 flex items-center justify-center gap-2.5 text-slate-100 text-xs sm:text-sm font-semibold">
              <Waves className="w-4 h-4 text-[#E8704A] shrink-0" />
              <span>{t.trust.localKnowledge}</span>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { num: '15+', label: 'Years on the Water', sub: 'Est. 2009' },
            { num: '10K+', label: 'Guests Welcomed', sub: 'Across 40 Nationalities' },
            { num: '6', label: 'Tour Experiences', sub: 'Curated Routes' },
            { num: '4.9★', label: 'Average Rating', sub: 'Google & TripAdvisor' },
          ].map((stat) => (
            <div key={stat.num} className="bg-white rounded-2xl border border-stone-200 shadow-card px-5 py-4 text-center hover:border-[#E8704A]/40 transition-colors">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0D2137] font-mono tracking-tight">{stat.num}</div>
              <div className="text-xs font-semibold text-[#1A1A2E] mt-0.5">{stat.label}</div>
              <div className="text-[10px] text-[#5C6E7A] mt-0.5">{stat.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. SERVICES SECTION - 6 SIGNATURE EXPERIENCES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
          <div className="marine-badge">
            <Sparkles className="w-3.5 h-3.5 text-[#1A5C52]" />
            <span>{t.services.badge}</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-[#0D2137] tracking-tight">
            {t.services.title}
          </h2>
          <p className="text-sm sm:text-base text-[#64748B]">
            {t.services.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {activeTours.map((tour, index) => (
            <ServiceCard key={tour.id} tour={tour} index={index} />
          ))}
        </div>
      </section>

      {/* 3. FEATURED TOURS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-2">
            <div className="marine-badge">
              <Compass className="w-3.5 h-3.5 text-[#1A5C52]" />
              <span>Curated Excursions</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#0D2137] tracking-tight">
              Featured Island Trips & Tours
            </h2>
            <p className="text-sm text-[#64748B] max-w-xl">
              All excursions include licensed skippers, certified safety gear, national park assistance, and complimentary cold refreshments.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedTourFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedTourFilter === 'all'
                  ? 'bg-[#0D2137] text-white shadow-md'
                  : 'bg-white text-[#64748B] hover:text-[#0D2137] border border-slate-200'
              }`}
            >
              All Tours ({activeTours.length})
            </button>
            <button
              onClick={() => setSelectedTourFilter('featured')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedTourFilter === 'featured'
                  ? 'bg-[#0D2137] text-white shadow-md'
                  : 'bg-white text-[#64748B] hover:text-[#0D2137] border border-slate-200'
              }`}
            >
              Popular & Top Rated
            </button>
            <button
              onClick={() => setSelectedTourFilter('charter')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedTourFilter === 'charter'
                  ? 'bg-[#0D2137] text-white shadow-md'
                  : 'bg-white text-[#64748B] hover:text-[#0D2137] border border-slate-200'
              }`}
            >
              Private Charters
            </button>
          </div>
        </div>

        {/* Tour Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredTours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>

        {/* Weather Guarantee Banner */}
        <div className="mt-12">
          <WeatherNotice />
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="relative overflow-hidden py-16 sm:py-24" style={{background: 'repeating-linear-gradient(45deg, #EDE0CB 0px, #EDE0CB 1px, #FAF7F2 1px, #FAF7F2 28px), linear-gradient(to bottom, #FAF7F2, #F5EDD8)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <div className="marine-badge">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1A5C52]" />
              <span>Unmatched Standards</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-[#0D2137] tracking-tight">
              Why Travelers Choose Our Crew
            </h2>
            <p className="text-sm sm:text-base text-[#64748B]">
              We operate under strict maritime safety standards with seasoned local captains who know every bay, current, and reef around Koh Phangan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-card space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0D2137] text-[#E8704A] flex items-center justify-center shadow-sm">
                <Anchor className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-[#0D2137]">
                {t.trust.experiencedCrew}
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                {t.trust.experiencedCrewDesc}
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-card space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0D2137] text-[#E8704A] flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-[#0D2137]">
                {t.trust.safetyFirst}
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                {t.trust.safetyFirstDesc}
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-card space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0D2137] text-[#E8704A] flex items-center justify-center shadow-sm">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-[#0D2137]">
                {t.trust.privateTours}
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                {t.trust.privateToursDesc}
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-card space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0D2137] text-[#E8704A] flex items-center justify-center shadow-sm">
                <Waves className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-[#0D2137]">
                {t.trust.localKnowledge}
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                {t.trust.localKnowledgeDesc}
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-card space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0D2137] text-[#E8704A] flex items-center justify-center shadow-sm">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-[#0D2137]">
                Modern High-Output Fleet
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Custom speedboats with cushioned shade seating and brand-new Yamaha/Sea-Doo watercraft maintained daily.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-card space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0D2137] text-[#E8704A] flex items-center justify-center shadow-sm">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-[#0D2137]">
                Flexible & Transparent
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                No hidden fuel surcharges or surprise fees. Seamless booking process with instant WhatsApp & LINE support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. EXPERIENCE STORYTELLING */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border border-[#1A5C52]/20">
              <img
                src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80"
                alt="Snorkeling with marine wildlife"
                className="w-full aspect-[4/3] object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>

            <div className="absolute -bottom-6 -right-4 sm:-right-6 z-20 p-4 sm:p-5 rounded-2xl bg-white border border-[#1A5C52]/20 shadow-marine-lg max-w-[260px]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C8820A] text-[#0D2137] flex items-center justify-center font-bold">
                  <Star className="w-5 h-5 fill-[#0D2137] text-[#0D2137]" />
                </div>
                <div>
                  <div className="text-sm font-extrabold text-[#0D2137]">5.0 Star Rated</div>
                  <div className="text-xs text-[#64748B]">Over 500+ Happy Guests</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="marine-badge">
              <Sparkles className="w-3.5 h-3.5 text-[#1A5C52]" />
              <span>{t.experience.tag}</span>
            </div>

            <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-[#0D2137] tracking-tight leading-tight">
              {t.experience.title}
            </h2>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              {t.experience.p1}
            </p>

            <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
              {t.experience.p2}
            </p>

            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-200">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#1A5C52] font-mono">
                  {t.experience.stat1Number}
                </div>
                <div className="text-xs text-[#64748B] mt-1">{t.experience.stat1Label}</div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#1A5C52] font-mono">
                  {t.experience.stat2Number}
                </div>
                <div className="text-xs text-[#64748B] mt-1">{t.experience.stat2Label}</div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#C8820A] font-mono">
                  {t.experience.stat3Number}
                </div>
                <div className="text-xs text-[#64748B] mt-1">{t.experience.stat3Label}</div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-[#1A5C52] hover:text-[#0D2137] text-sm font-bold group"
              >
                <span>Read more about our captain, crew & fleet</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PHOTO GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-2">
            <div className="marine-badge">
              <Eye className="w-3.5 h-3.5 text-[#1A5C52]" />
              <span>{t.gallery.badge}</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#0D2137] tracking-tight">
              {t.gallery.title}
            </h2>
            <p className="text-sm text-[#64748B]">
              {t.gallery.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
            {['All', 'Jet Ski', 'Speedboat', 'Islands', 'Snorkeling', 'Fishing', 'Sunset'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedGalleryCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedGalleryCategory === cat
                    ? 'bg-[#0D2137] text-white font-bold shadow-sm'
                    : 'text-[#64748B] hover:text-[#0D2137]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              onClick={() => setLightboxItem(item)}
              className="group relative rounded-3xl overflow-hidden aspect-[4/3] bg-[#0D2137] border border-slate-200 cursor-pointer shadow-card hover:shadow-marine transition-all"
            >
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D2137]/90 via-[#0D2137]/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              <div className="absolute bottom-4 inset-x-4 flex items-center justify-between text-white">
                <div>
                  <h4 className="text-sm font-bold font-display line-clamp-1">{item.title}</h4>
                  <p className="text-xs text-[#E8704A] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    <span>{item.location}</span>
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:bg-[#E8704A] group-hover:text-[#0D2137] transition-colors">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-slate-50 border border-slate-300 text-[#0D2137] text-xs font-bold shadow-sm transition-all"
          >
            <span>View Full 4K Photo Gallery</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 7. REVIEWS & SOCIAL PROOF */}
      <section className="relative overflow-hidden bg-[#FAF0E4] py-16 sm:py-24 border-t border-[#C8820A]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="marine-badge">
              <Star className="w-3.5 h-3.5 fill-[#C8820A] text-[#C8820A]" />
              <span>{t.reviews.badge}</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-[#0D2137] tracking-tight">
              {t.reviews.title}
            </h2>
            <p className="text-sm sm:text-base text-[#64748B]">
              {t.reviews.subtitle}
            </p>

            {/* Google & TripAdvisor Trust Box */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-stone-200 shadow-sm text-[#0D2137]">
                <div className="flex items-center gap-0.5 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                </div>
                <span className="font-bold font-mono">4.9 / 5.0</span>
                <span className="text-stone-400">•</span>
                <span className="font-semibold text-[#1A5C52]">520+ Google Reviews</span>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#00AA6C]/10 border border-[#00AA6C]/30 shadow-sm text-[#006644]">
                <span className="text-sm font-black">Tripadvisor</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#00AA6C] text-white">
                  Travelers' Choice 2024
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviewsData.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          {/* Social Proof Stats Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0D2137] text-white text-center flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-white/10">
            <div className="text-left space-y-1">
              <div className="font-display font-extrabold text-lg sm:text-xl text-white">
                Share Your Island Adventure Experience
              </div>
              <div className="text-xs text-slate-300">
                Join hundreds of international travelers who explored Koh Phangan with us.
              </div>
            </div>

            <a
              href="https://wa.me/66836903666?text=Hi!%20I%20would%20like%20to%20share%20my%20review%20and%20photos%20from%20our%20boat%20trip."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#C8820A] to-[#E8704A] text-[#0D2137] font-display font-extrabold text-xs uppercase tracking-wider shadow-md hover:brightness-105 transition-all shrink-0"
            >
              <Star className="w-3.5 h-3.5 fill-[#0D2137]" />
              <span>Leave a Review on WhatsApp</span>
            </a>
          </div>

        </div>
      </section>

      {/* 8. FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <div className="marine-badge">
            <Compass className="w-3.5 h-3.5 text-[#1A5C52]" />
            <span>{t.faq.badge}</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#0D2137] tracking-tight">
            {t.faq.title}
          </h2>
          <p className="text-sm text-[#64748B]">
            {t.faq.subtitle}
          </p>
        </div>

        <div className="space-y-3">
          {faqData.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            const questionText = language === 'th' ? faq.question_th : faq.question;
            const answerText = language === 'th' ? faq.answer_th : faq.answer;

            return (
              <div
                key={faq.id}
                className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-display font-bold text-base sm:text-lg text-[#0D2137] hover:text-[#1A5C52] transition-colors"
                >
                  <span>{questionText}</span>
                  <ChevronDown className={`w-5 h-5 text-[#E8704A] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm text-slate-700 leading-relaxed border-t border-slate-100 pt-3 animate-fadeIn">
                    {answerText}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/faq"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#1A5C52] hover:text-[#0D2137]"
          >
            <span>Have more questions? View our full FAQ guide</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 9. CONTACT CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#0D2137] border border-[#1A5C52]/40 p-8 sm:p-12 shadow-2xl relative overflow-hidden text-white" style={{backgroundImage: 'radial-gradient(ellipse at 80% 50%, rgba(26,92,82,0.25) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(232,112,74,0.12) 0%, transparent 50%)'}}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-[#E8704A] border border-[#E8704A]/30">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{t.contact.badge}</span>
              </div>

              <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
                {t.contact.title}
              </h2>

              <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                {t.contact.subtitle}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <a
                  href="https://wa.me/66836903666?text=Hello!%20I%20would%20like%20to%20inquire%20about%20Koh%20Phangan%20boat%20tours"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all group"
                >
                  <MessageCircle className="w-6 h-6 shrink-0" />
                  <div>
                    <div className="text-[11px] font-normal text-emerald-100">WhatsApp Instant Chat</div>
                    <div>+66 83 690 3666</div>
                  </div>
                </a>

                <a
                  href="https://line.me/ti/p/~0836903666"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-2xl bg-[#06C755] hover:bg-[#05b34c] text-white font-bold text-sm shadow-md transition-all"
                >
                  <div className="w-6 h-6 rounded-md bg-white text-[#06C755] font-extrabold text-xs flex items-center justify-center">
                    LINE
                  </div>
                  <div>
                    <div className="text-[11px] font-normal text-emerald-100">LINE Official Account</div>
                    <div>+66 83 690 3666</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Quick Booking Card */}
            <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-[#081629] border border-[#E8704A]/40 text-center space-y-5 shadow-lg">
              <div className="w-14 h-14 rounded-2xl bg-[#E8704A]/20 text-[#E8704A] flex items-center justify-center mx-auto">
                <Calendar className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <h3 className="font-display font-extrabold text-2xl text-white">
                  Ready to Set Sail?
                </h3>
                <p className="text-xs text-slate-300">
                  Select your tour, choose your dates, and submit your request in under 2 minutes. No credit card required.
                </p>
              </div>

              <Link
                to="/book"
                className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-[#C8820A] to-[#E8704A] text-[#0D2137] font-display font-extrabold text-base uppercase tracking-wider shadow-lg hover:brightness-105 transition-all"
              >
                <span>{t.hero.bookAdventure}</span>
                <ArrowRight className="w-4 h-4 text-[#0D2137] stroke-[2.5]" />
              </Link>

              <div className="text-[11px] text-slate-300 flex items-center justify-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#E8704A]" />
                <span>Instant confirmation available via WhatsApp</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <LightboxModal
        item={lightboxItem}
        items={galleryItems}
        onClose={() => setLightboxItem(null)}
        onSelect={(item) => setLightboxItem(item)}
      />
    </div>
  );
};
