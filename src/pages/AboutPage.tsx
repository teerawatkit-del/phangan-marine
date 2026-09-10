import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Anchor, 
  ShieldCheck, 
  Waves, 
  HeartHandshake, 
  Sparkles,
  ArrowRight,
  LifeBuoy
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { WeatherNotice } from '../components/ui/WeatherNotice';

export const AboutPage: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <div className="pt-28 sm:pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="marine-badge">
          <Anchor className="w-3.5 h-3.5 text-[#1A5C52]" />
          <span>{t.nav.about}</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-[#0D2137] tracking-tight leading-tight">
          {language === 'th' ? 'เรื่องราวและความตั้งใจของเรา' : 'Born on the Island. Dedicated to the Sea.'}
        </h1>
        <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
          {language === 'th'
            ? 'เราคือทีมชาวเรือและผู้เชี่ยวชาญการเดินเรือท้องถิ่นเกาะพะงัน ที่มุ่งมั่นส่งมอบประสบการณ์ทางทะเลระดับพรีเมียม ปลอดภัย และน่าประทับใจที่สุด'
            : 'We are a collective of native island captains, marine guides, and ocean enthusiasts providing international travelers with safe, unforgettable seafaring adventures.'}
        </p>
      </div>

      {/* Origin Story */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 relative rounded-3xl overflow-hidden shadow-2xl border border-[#1A5C52]/20 aspect-[4/3] bg-[#0D2137]">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
            alt="Koh Phangan Coastal Horizon"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D2137]/80 via-transparent to-transparent" />
        </div>

        <div className="lg:col-span-6 space-y-6">
          <div className="marine-badge">
            <Sparkles className="w-3.5 h-3.5 text-[#1A5C52]" />
            <span>Our Heritage</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-[#0D2137] tracking-tight">
            Preserving Island Culture with Modern Marine Standards
          </h2>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Koh Phangan is world-famous for its full moon, but its most magnificent treasure lies in its pristine bays, jagged granite cliffs, and untouched marine sanctuaries.
          </p>
          <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
            Founded by local sailors with deep ancestral roots on the island, our mission is to showcase the true hidden gems of the Gulf of Thailand without overcrowded tourist boats. Every vessel in our fleet is maintained to rigorous maritime standards, equipped with modern navigation and first aid systems.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="text-2xl font-extrabold text-[#1A5C52] font-mono">15+</div>
              <div className="text-xs text-[#64748B] mt-1">Years Operating on Koh Phangan</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="text-2xl font-extrabold text-[#1A5C52] font-mono">10,000+</div>
              <div className="text-xs text-[#64748B] mt-1">Happy Voyagers Hosted</div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[#0D2137]">
            Our Core Commitments
          </h3>
          <p className="text-xs sm:text-sm text-[#64748B]">
            What sets our voyages apart from conventional mass tourism agencies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-card space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0D2137] text-[#E8704A] flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-[#0D2137] font-display">Safety Above All</h4>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              Every passenger is covered by maritime insurance. We never compromise on safety for profits and maintain daily equipment audits.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-card space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0D2137] text-[#E8704A] flex items-center justify-center shadow-sm">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-[#0D2137] font-display">Genuine Local Hospitality</h4>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              Our guides treat guests like personal friends, providing authentic insights into island history and marine biodiversity.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-card space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0D2137] text-[#E8704A] flex items-center justify-center shadow-sm">
              <Waves className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-[#0D2137] font-display">Eco-Conscious Cruising</h4>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              We practice strict reef-safe snorkeling guidelines, leave-no-trace beach visits, and support local coral conservation efforts.
            </p>
          </div>
        </div>
      </div>

      {/* Fleet Showcase */}
      <div className="p-8 sm:p-12 rounded-3xl bg-[#0D2137] border border-[#E8704A]/30 shadow-2xl space-y-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-[#E8704A] border border-[#E8704A]/30">
              <LifeBuoy className="w-3.5 h-3.5" />
              <span>Modern Fleet</span>
            </div>
            <h3 className="font-display font-extrabold text-2xl sm:text-4xl text-white">
              The Fleet & Watercraft
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              From nimble jet skis to deep-V hull luxury twin-engine speedboats and dedicated fishing vessels.
            </p>
          </div>

          <Link
            to="/book"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#C8820A] to-[#E8704A] text-[#0D2137] font-display font-extrabold text-xs uppercase tracking-wider shrink-0 shadow-lg hover:brightness-105"
          >
            <span>Book a Vessel</span>
            <ArrowRight className="w-4 h-4 text-[#0D2137]" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-[#081629] border border-white/10 p-5 space-y-2">
            <h5 className="text-base font-bold text-white font-display">Custom Speedboats</h5>
            <p className="text-xs text-slate-300">Twin 250HP Suzuki outboards, cushioned shade seating, Bluetooth audio & freshwater shower.</p>
          </div>

          <div className="rounded-2xl bg-[#081629] border border-white/10 p-5 space-y-2">
            <h5 className="text-base font-bold text-white font-display">Sea-Doo & Yamaha Jet Skis</h5>
            <p className="text-xs text-slate-300">High-output 130-170HP craft with intelligent brake and reverse (iBR) for effortless control.</p>
          </div>

          <div className="rounded-2xl bg-[#081629] border border-white/10 p-5 space-y-2">
            <h5 className="text-base font-bold text-white font-display">Traditional Fishing Cruisers</h5>
            <p className="text-xs text-slate-300">Equipped with Garmin fishfinder sonar, live bait wells, high-grade outriggers, and cooking grill.</p>
          </div>
        </div>
      </div>

      <WeatherNotice />
    </div>
  );
};
