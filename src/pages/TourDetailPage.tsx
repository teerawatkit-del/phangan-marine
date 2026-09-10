import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { 
  Clock, 
  Users, 
  MapPin, 
  Check, 
  X, 
  Star, 
  ShieldCheck, 
  Calendar, 
  MessageCircle, 
  ChevronRight, 
  Sparkles,
  Anchor,
  Zap
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTours } from '../context/TourContext';
import { LightboxModal } from '../components/ui/LightboxModal';
import { WeatherNotice } from '../components/ui/WeatherNotice';
import type { GalleryItem } from '../types';

export const TourDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language, t } = useLanguage();
  const { getTourBySlug } = useTours();
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const tour = getTourBySlug(slug || '');

  if (!tour) {
    return <Navigate to="/tours" replace />;
  }

  const tourName = language === 'th' && tour.name_th ? tour.name_th : tour.name;
  const tourDesc = language === 'th' && tour.description_th ? tour.description_th : tour.description;
  const durationText = language === 'th' && tour.duration_th ? tour.duration_th : tour.duration;
  const inclusions = language === 'th' && tour.included_th ? tour.included_th : tour.included;
  const highlights = language === 'th' && tour.highlights_th ? tour.highlights_th : tour.highlights;

  const galleryItems: GalleryItem[] = [
    { id: 'h-1', title: tourName, category: 'Islands', image_url: tour.hero_image, location: tour.departure_location },
    ...tour.gallery_images.map((img, idx) => ({
      id: `g-${idx}`,
      title: `${tourName} - View ${idx + 1}`,
      category: 'Islands' as const,
      image_url: img,
      location: tour.departure_location
    }))
  ];

  return (
    <div className="pt-24 sm:pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[#64748B]">
        <Link to="/" className="hover:text-[#0D2137] transition-colors">{t.nav.home}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/tours" className="hover:text-[#0D2137] transition-colors">{t.nav.tours}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#1A5C52] font-bold truncate">{tourName}</span>
      </nav>

      {/* Main Tour Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="marine-badge">
            {tour.category}
          </span>
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-slate-200 text-[#0D2137] text-xs font-bold shadow-sm">
            <Star className="w-3.5 h-3.5 fill-[#C8820A] text-[#C8820A]" />
            <span>{tour.rating.toFixed(1)}</span>
            <span className="text-[#64748B]">({tour.review_count} reviews)</span>
          </div>
        </div>

        <h1 className="font-display font-black text-3xl sm:text-5xl text-[#0D2137] tracking-tight leading-tight">
          {tourName}
        </h1>

        {/* Quick Specs Bar */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-[#64748B] pt-1">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#1A5C52]" />
            <span>Duration: <strong className="text-[#0D2137]">{durationText}</strong></span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#1A5C52]" />
            <span>Capacity: <strong className="text-[#0D2137]">Up to {tour.max_guests} Guests</strong></span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#1A5C52]" />
            <span>Departure: <strong className="text-[#0D2137]">{tour.departure_location}</strong></span>
          </div>
        </div>
      </div>

      {/* Photo Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-3xl overflow-hidden">
        <div 
          className="md:col-span-2 relative aspect-[16/10] overflow-hidden rounded-2xl cursor-pointer group bg-[#0D2137]"
          onClick={() => setLightboxItem(galleryItems[0])}
        >
          <img
            src={tour.hero_image}
            alt={tourName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-xl bg-[#0D2137]/85 backdrop-blur-md text-xs text-white font-semibold flex items-center gap-1.5 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-[#C8820A]" />
            <span>Click to expand 4K photo</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
          {tour.gallery_images.slice(0, 2).map((img, idx) => (
            <div
              key={idx}
              className="relative aspect-[16/10] overflow-hidden rounded-2xl cursor-pointer group bg-[#0D2137]"
              onClick={() => setLightboxItem(galleryItems[idx + 1])}
            >
              <img
                src={img}
                alt={`${tourName} preview ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Layout with Sticky Booking Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-12">

          {/* Vessel & Marine Equipment Specification Card */}
          {tour.boat_type && (
            <div className="p-6 sm:p-7 rounded-3xl bg-[#0D2137] text-white border border-[#1A5C52]/40 shadow-card space-y-3 relative overflow-hidden" style={{backgroundImage: 'radial-gradient(ellipse at 90% 50%, rgba(26,92,82,0.3) 0%, transparent 60%)'}}>
              <div className="flex items-center gap-2">
                <Anchor className="w-5 h-5 text-[#E8704A]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#E8704A]">Vessel & Equipment Specs</span>
              </div>
              <h3 className="font-display font-extrabold text-xl sm:text-2xl text-white">
                {language === 'th' && tour.boat_type_th ? tour.boat_type_th : tour.boat_type}
              </h3>
              {tour.boat_specs && (
                <p className="text-xs sm:text-sm text-slate-300 font-mono leading-relaxed">
                  ⚙️ {language === 'th' && tour.boat_specs_th ? tour.boat_specs_th : tour.boat_specs}
                </p>
              )}
            </div>
          )}

          {/* Highlights */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-card space-y-4">
            <h3 className="font-display font-extrabold text-xl text-[#0D2137] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C8820A]" />
              <span>Tour Highlights</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {highlights.map((highlight, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-sm text-[#172126]">
                  <div className="w-5 h-5 rounded-full bg-[#E8704A]/20 text-[#1A5C52] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Overview */}
          <div className="space-y-4">
            <h3 className="font-display font-extrabold text-2xl text-[#0D2137]">
              Experience Overview
            </h3>
            <p className="text-base text-slate-700 leading-relaxed">
              {tourDesc}
            </p>
          </div>

          {/* Itinerary Timeline */}
          {tour.itinerary && tour.itinerary.length > 0 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="font-display font-extrabold text-2xl text-[#0D2137]">
                  Sample Daily Itinerary
                </h3>
                <p className="text-xs text-[#64748B]">
                  Timings may adjust slightly to give your group the best tidal and weather conditions.
                </p>
              </div>

              <div className="relative pl-6 sm:pl-8 border-l-2 border-[#E8704A]/40 space-y-8">
                {tour.itinerary.map((step, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-4 h-4 rounded-full bg-white border-2 border-[#1A5C52]" />

                    <div className="space-y-1">
                      <div className="inline-block px-2.5 py-0.5 rounded-md bg-[#EDE0CB] text-[#0D2137] font-mono text-xs font-bold border border-[#1A5C52]/20">
                        {step.time}
                      </div>
                      <h4 className="text-base font-bold text-[#0D2137] font-display">
                        {step.title}
                      </h4>
                      <p className="text-sm text-[#64748B] leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SPEEDBOAT FULL ROUTE MATRIX TABLE & REMARKS ────── */}
          {tour.slug === 'speedboat' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="font-display font-extrabold text-2xl text-[#0D2137] flex items-center gap-2">
                  <Zap className="w-6 h-6 text-[#E8704A]" />
                  <span>Private Speedboat Charter Rates (เส้นทางและราคาเหมาลำ)</span>
                </h3>
                <p className="text-xs text-[#5C6E7A]">
                  Official standard charter rates per vessel. Choose from 1-engine (8 pax) or 2-engine models with onboard marine bathroom (8 or 16 pax).
                </p>
              </div>

              {/* Comprehensive Rates Table */}
              <div className="rounded-3xl overflow-hidden border border-stone-200 shadow-card">
                <div className="grid grid-cols-12 bg-[#0D2137] text-white text-[11px] font-bold uppercase tracking-wider">
                  <div className="p-3.5 sm:p-4 col-span-5 sm:col-span-6">Trip / Destination (เส้นทาง)</div>
                  <div className="p-3 text-center border-l border-white/10 col-span-2 text-[10px] sm:text-xs">
                    <div>1 Engine</div>
                    <div className="text-[9px] text-slate-300 font-normal">8 Paxs</div>
                  </div>
                  <div className="p-3 text-center border-l border-white/10 col-span-3 sm:col-span-2 text-[10px] sm:text-xs">
                    <div>2 Engines</div>
                    <div className="text-[9px] text-[#E8704A] font-normal">16 Pax + WC</div>
                  </div>
                  <div className="p-3 text-center border-l border-white/10 col-span-2 hidden sm:block text-[10px] sm:text-xs">
                    <div>2 Engines</div>
                    <div className="text-[9px] text-[#E8704A] font-normal">8 Pax + WC</div>
                  </div>
                </div>

                {[
                  { route: 'Koh Tao & Koh Nangyuan', sub: 'Includes Lunch', r1: 22000, r2: 28000, r3: 26000, hot: true },
                  { route: 'Koh Tao & Koh Nangyuan', sub: '*Not includes Lunch', r1: 20000, r2: 26000, r3: 24000 },
                  { route: 'Angthong Marine Park', sub: 'Includes Lunch', r1: 19000, r2: 25000, r3: 23000, hot: true },
                  { route: 'Angthong Marine Park', sub: '*Not includes Lunch', r1: 17000, r2: 23000, r3: 22000 },
                  { route: 'Koh Phaluai', sub: 'Full Day Eco Escape', r1: 22000, r2: 28000, r3: 26000 },
                  { route: 'Koh Samui', sub: 'Charter / Transfer', r1: 6000, r2: 8000, r3: 7000 },
                  { route: 'Donsak', sub: 'Mainland Pier Transfer', r1: 22000, r2: 28000, r3: 26000 },
                  { route: 'Around Koh Phangan', sub: '5 Hours Coastal Cruise', r1: 14000, r2: 20000, r3: 18000, hot: true },
                  { route: 'Koh Tae & Koh Mah', sub: 'Sandbar & Snorkel Reef', r1: 12000, r2: 13000, r3: 13000 },
                  { route: 'Hin Bai (Sail Rock)', sub: 'Premier Gulf Dive/Snorkel Site', r1: 19000, r2: 25000, r3: 23000 },
                  { route: 'Sunset Cruise', sub: 'Romantic Evening Coastal Run', r1: 12000, r2: 15000, r3: 13000 },
                  { route: 'Fishing Trip (3 Hours)', sub: 'Trolling & Bottom Reef', r1: null, r2: null, r3: 9500 },
                  { route: 'Fishing Trip (5 Hours)', sub: 'Extended Sport Fishing', r1: null, r2: null, r3: 12000 },
                  { route: 'Fishing Trip (One Day)', sub: 'Grand Day Offshore Fishing', r1: null, r2: null, r3: 28000 },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`grid grid-cols-12 items-center bg-white hover:bg-stone-50 transition-colors border-b border-stone-100 ${
                      item.hot ? 'bg-[#EDE0CB]/15' : ''
                    }`}
                  >
                    <div className="p-3 sm:p-4 col-span-5 sm:col-span-6">
                      <div className="font-display font-bold text-xs sm:text-sm text-[#0D2137] flex items-center gap-1.5">
                        <span>{item.route}</span>
                        {item.hot && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#E8704A]/15 text-[#D45F3C]">
                            Popular
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#5C6E7A]">{item.sub}</div>
                    </div>

                    <div className="p-2 sm:p-3 text-center border-l border-stone-100 col-span-2">
                      {item.r1 ? (
                        <span className="font-bold text-xs sm:text-sm text-[#0D2137] font-mono">฿{item.r1.toLocaleString()}</span>
                      ) : (
                        <span className="text-[#5C6E7A] text-xs">—</span>
                      )}
                    </div>

                    <div className="p-2 sm:p-3 text-center border-l border-stone-100 col-span-3 sm:col-span-2">
                      {item.r2 ? (
                        <span className="font-extrabold text-xs sm:text-sm text-[#1A5C52] font-mono">฿{item.r2.toLocaleString()}</span>
                      ) : (
                        <span className="text-[#5C6E7A] text-xs">—</span>
                      )}
                    </div>

                    <div className="p-2 sm:p-3 text-center border-l border-stone-100 col-span-2 hidden sm:block">
                      {item.r3 ? (
                        <span className="font-bold text-xs sm:text-sm text-[#0D2137] font-mono">฿{item.r3.toLocaleString()}</span>
                      ) : (
                        <span className="text-[#5C6E7A] text-xs">—</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* ── REMARKS & CONDITIONS CARD ── */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF0E4] border border-[#C8820A]/30 space-y-5 shadow-sm">
                <h4 className="font-display font-extrabold text-lg text-[#0D2137] flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#C8820A]" />
                  <span>Remarks & Conditions (เงื่อนไขและข้อกำหนด)</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-2">
                    <div className="font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Includes (สิ่งที่รวมในราคา)</span>
                    </div>
                    <ul className="space-y-1 text-slate-700">
                      <li>• Soft drinks & chilled drinking water</li>
                      <li>• Snorkeling equipment (masks & snorkels)</li>
                      <li>• Life jackets for all sizes</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-2">
                    <div className="font-bold text-red-800 uppercase tracking-wider flex items-center gap-1.5">
                      <X className="w-4 h-4 text-red-600" />
                      <span>Excludes (สิ่งที่ไม่รวมในราคา)</span>
                    </div>
                    <ul className="space-y-1 text-slate-700">
                      <li>• Admission fees (National Park / Island)</li>
                      <li>• Transfers to/from the pier</li>
                    </ul>
                  </div>
                </div>

                {/* Specific Policies */}
                <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-3 text-xs text-[#0D2137]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-stone-100">
                    <div>
                      <span className="font-bold block text-[#1A5C52]">🏞️ Angthong Marine Park Fee:</span>
                      <span className="text-slate-600">Adult ฿300 / Child ฿150</span>
                    </div>
                    <div>
                      <span className="font-bold block text-[#1A5C52]">🏝️ Koh Nangyuan Island Fee:</span>
                      <span className="text-slate-600">Adult ฿250 / Child ฿120</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-[11px] text-slate-700">
                    <div>
                      <strong>🌙 Night Surcharge:</strong> Trips operating between 19:30 PM and 05:00 AM incur an additional charge of 1,000 Baht per trip (1,000 Baht per hour for the boat).
                    </div>
                    <div>
                      <strong>⏳ Waiting Time:</strong> The first hour of waiting for a customer is free; subsequent hours are 1,000 Baht per hour.
                    </div>
                    <div>
                      <strong>👥 Extra Passengers:</strong> Exceeding the boat's specified capacity costs an additional 500 Baht per person.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── FISHING SPECIFIC PRICING TABLE ────── */}
          {tour.slug === 'fishing' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="font-display font-extrabold text-2xl text-[#0D2137] flex items-center gap-2">
                  <Zap className="w-6 h-6 text-[#E8704A]" />
                  <span>Fishing Trip Options & Rates (ประเภทเรือและราคาตกปลา)</span>
                </h3>
                <p className="text-xs text-[#5C6E7A]">
                  Choose between our budget-friendly Small Fishing Boat (per-person pricing) or our Private 2-Engine Speedboat with onboard marine bathroom.
                </p>
              </div>

              {/* Fishing Options Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Option 1: Small Boat */}
                <div className="p-6 rounded-3xl bg-white border-2 border-[#1A5C52]/30 shadow-card space-y-4 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-[#1A5C52]/10 text-[#1A5C52] text-[10px] font-bold uppercase tracking-wider">
                      Option 1 · Best Value
                    </span>
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      คิดรายหัว
                    </span>
                  </div>

                  <div>
                    <h4 className="font-display font-black text-xl text-[#0D2137]">
                      เรือตกปลาลำเล็ก (Small Fishing Boat)
                    </h4>
                    <div className="text-xs text-[#5C6E7A] mt-1 font-mono">
                      ⏱️ ระยะเวลา 3 ชั่วโมง (3 Hours Coastal Session)
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                      <span className="text-xs font-semibold text-[#0D2137]">1 หรือ 2 ท่าน (1-2 Pax):</span>
                      <span className="font-mono font-extrabold text-base text-[#0D2137]">฿3,500 <span className="text-[10px] font-normal text-stone-500">รวม 2 คน</span></span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#1A5C52]">3 ท่านขึ้นไป (3+ Pax):</span>
                      <span className="font-mono font-extrabold text-base text-[#1A5C52]">฿1,500 <span className="text-[10px] font-normal text-stone-500">/ ท่าน</span></span>
                    </div>
                  </div>

                  <ul className="space-y-1.5 text-xs text-slate-600">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>รวมคันเบ็ด รอก เหยื่อสด และถังน้ำแข็ง</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>น้ำอัดลมและน้ำดื่มเย็นตลอดทริป</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>อุปกรณ์ดำน้ำตื้นสำหรับผู้ร่วมทริป</span>
                    </li>
                  </ul>
                </div>

                {/* Option 2: 2-Engine Speedboat with Bathroom */}
                <div className="p-6 rounded-3xl bg-[#0D2137] text-white border border-white/10 shadow-card space-y-4 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-[#E8704A]/20 text-[#E8704A] text-[10px] font-bold uppercase tracking-wider border border-[#E8704A]/30">
                      Option 2 · VIP Speedboat
                    </span>
                    <span className="text-[10px] font-bold text-slate-300">
                      มีห้องน้ำในตัว (Has WC)
                    </span>
                  </div>

                  <div>
                    <h4 className="font-display font-black text-xl text-white">
                      สปีดโบ๊ท 2 เครื่องยนต์ (เหมาลำส่วนตัว)
                    </h4>
                    <div className="text-xs text-slate-300 mt-1 font-mono">
                      🛥️ 2 Engines Speedboat · รองรับสูงสุด 8 ท่าน
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-2 text-xs">
                    <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                      <span>3 ชั่วโมง (3 Hours):</span>
                      <span className="font-mono font-extrabold text-base text-[#E8704A]">฿9,500</span>
                    </div>
                    <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                      <span>5 ชั่วโมง (5 Hours):</span>
                      <span className="font-mono font-extrabold text-base text-[#E8704A]">฿12,000</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>เต็มวัน (One Day):</span>
                      <span className="font-mono font-extrabold text-base text-[#E8704A]">฿28,000</span>
                    </div>
                  </div>

                  <ul className="space-y-1.5 text-xs text-slate-300">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>ห้องน้ำ Marine Toilet บนเรือ สะดวกสบาย</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>วิ่งเร็ว เข้าหมายตกปลาทะเลลึกไกลๆ ได้</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>บริการแล่ซาชิมิสดๆ หรือทำบาร์บีคิวบนเรือ</span>
                    </li>
                  </ul>
                </div>

              </div>
            </div>
          )}

          {/* ── GENERIC PRICING TIERS TABLE (Jet Ski, etc.) ────── */}
          {tour.pricing_tiers && tour.pricing_tiers.length > 0 && tour.slug !== 'speedboat' && tour.slug !== 'fishing' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-display font-extrabold text-2xl text-[#0D2137] flex items-center gap-2">
                  <Zap className="w-6 h-6 text-[#E8704A]" />
                  <span>Pricing by Model & Duration</span>
                </h3>
                <p className="text-xs text-[#5C6E7A]">
                  Select your preferred watercraft and session duration. All prices include fuel, guide, and safety gear.
                </p>
              </div>

              {/* Header row */}
              <div className="rounded-3xl overflow-hidden border border-stone-200 shadow-card">
                <div className="grid grid-cols-3 bg-[#0D2137] text-white text-xs font-bold uppercase tracking-wider">
                  <div className="px-5 py-3 col-span-1">Model</div>
                  <div className="px-5 py-3 text-center border-l border-white/10">
                    {tour.pricing_tiers[0].col1_title || '30 MIN'}
                  </div>
                  <div className="px-5 py-3 text-center border-l border-white/10">
                    {tour.pricing_tiers[0].col2_title || '60 MIN'}
                  </div>
                </div>

                {tour.pricing_tiers.map((tier, idx) => {
                  const modelName = language === 'th' && tier.model_th ? tier.model_th : tier.model;
                  const isLast = idx === tour.pricing_tiers!.length - 1;
                  return (
                    <div
                      key={idx}
                      className={`grid grid-cols-3 bg-white hover:bg-stone-50 transition-colors ${!isLast ? 'border-b border-stone-100' : ''}`}
                    >
                      {/* Model info */}
                      <div className="px-5 py-4 space-y-1 col-span-1">
                        <div className="font-display font-bold text-sm text-[#0D2137]">{modelName}</div>
                        {tier.specs && (
                          <div className="text-[10px] text-[#5C6E7A] font-mono">{tier.specs}</div>
                        )}
                        {tier.note && (
                          <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8704A]/15 text-[#D45F3C] border border-[#E8704A]/25">
                            {tier.note}
                          </span>
                        )}
                      </div>

                      {/* Col 1 price */}
                      <div className="px-5 py-4 border-l border-stone-100 flex flex-col items-center justify-center">
                        {tier.price_30min != null ? (
                          <>
                            <div className="text-lg sm:text-xl font-extrabold text-[#0D2137] font-mono tracking-tight">
                              ฿{tier.price_30min.toLocaleString()}
                            </div>
                            <div className="text-[10px] text-[#5C6E7A] mt-0.5">per session</div>
                          </>
                        ) : (
                          <span className="text-[#5C6E7A] text-xs">—</span>
                        )}
                      </div>

                      {/* Col 2 price */}
                      <div className="px-5 py-4 border-l border-stone-100 flex flex-col items-center justify-center">
                        {tier.price_60min != null ? (
                          <>
                            <div className="text-lg sm:text-xl font-extrabold text-[#1A5C52] font-mono tracking-tight">
                              ฿{tier.price_60min.toLocaleString()}
                            </div>
                            <div className="text-[10px] text-[#5C6E7A] mt-0.5">per session</div>
                          </>
                        ) : (
                          <span className="text-[#5C6E7A] text-xs">—</span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Footer note */}
                <div className="bg-[#EDE0CB]/60 px-5 py-3 border-t border-stone-200 flex items-center gap-2 text-[11px] text-[#5C6E7A]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1A5C52] shrink-0" />
                  <span>All prices include fuel, professional guide, safety gear & life vest.</span>
                </div>
              </div>
            </div>
          )}

          {/* Inclusions / Exclusions */}
          <div className="space-y-6">
            <h3 className="font-display font-extrabold text-2xl text-[#0D2137]">
              Inclusions & Amenities
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-white border border-emerald-500/30 shadow-card space-y-4">
                <h4 className="text-sm font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>What's Included</span>
                </h4>
                <ul className="space-y-2.5 text-sm text-[#172126]">
                  {inclusions.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-card space-y-4">
                <h4 className="text-sm font-bold text-[#0D2137] uppercase tracking-wider flex items-center gap-2">
                  <Anchor className="w-4 h-4 text-[#1A5C52]" />
                  <span>What to Bring / Excluded</span>
                </h4>
                <ul className="space-y-2.5 text-sm text-[#64748B]">
                  {tour.excluded?.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <X className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#E8704A] shrink-0 mt-0.5" />
                    <span>Swimwear, beach towel, coral-friendly sunscreen & sun protection</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Booking Card */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-marine space-y-6">
            
            {/* Price block */}
            <div className="space-y-1 pb-4 border-b border-slate-100">
              <span className="text-xs text-[#64748B]">{t.services.from}</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#0D2137] font-mono">
                  ฿{tour.price_from.toLocaleString()}
                </span>
                <span className="text-xs text-[#64748B]">
                  {tour.category === 'VIP & Private Charters' ? t.services.perGroup : t.services.perPerson}
                </span>
              </div>
            </div>

            {/* Departure Info */}
            <div className="space-y-3 text-xs text-[#172126]">
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Departure Times:</span>
                <span className="font-semibold text-[#0D2137]">{tour.departure_times.join(', ')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Free Cancellation:</span>
                <span className="font-semibold text-emerald-600">Up to 24h prior</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Instant Deposit:</span>
                <span className="font-semibold text-[#0D2137]">None (Pay later)</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <Link
                to={`/book?tour=${tour.slug}`}
                className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-[#C8820A] to-[#E8704A] text-[#0D2137] font-display font-extrabold text-sm uppercase tracking-wider shadow-lg hover:brightness-105 transition-all"
              >
                <Calendar className="w-4 h-4 text-[#0D2137] stroke-[2.5]" />
                <span>Book This Adventure</span>
              </Link>

              <a
                href={`https://wa.me/66836903666?text=Hello!%20I%20am%20interested%20in%20the%20${encodeURIComponent(tour.name)}%20tour`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Ask Question on WhatsApp</span>
              </a>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-[#64748B]">
              <ShieldCheck className="w-4 h-4 text-[#E8704A]" />
              <span>Direct reservation with local operator</span>
            </div>

          </div>
        </div>

      </div>

      <WeatherNotice />

      <LightboxModal
        item={lightboxItem}
        items={galleryItems}
        onClose={() => setLightboxItem(null)}
        onSelect={(item) => setLightboxItem(item)}
      />
    </div>
  );
};
