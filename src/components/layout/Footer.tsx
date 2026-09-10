import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Anchor, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  MessageCircle, 
  ChevronRight,
  Waves
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useBusiness } from '../../context/BusinessContext';
import { toursData } from '../../data/toursData';

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();
  const { businessInfo, getWhatsAppUrl, getLineUrl, getPhoneTelUrl } = useBusiness();

  return (
    <footer className="bg-[#0D2137] text-slate-200 border-t border-[#E8704A]/25 relative overflow-hidden pt-16 pb-24 lg:pb-16">
      {/* Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#E8704A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#1A5C52]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E8704A] to-[#1A5C52] flex items-center justify-center shadow-lg shadow-[#E8704A]/25">
                <Anchor className="w-5 h-5 text-white stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg text-white tracking-tight">
                  {language === 'th' ? businessInfo.companyNameTh : businessInfo.companyName}
                </span>
                <span className="text-[10px] font-semibold tracking-widest uppercase text-[#C8820A]">
                  ISLAND ADVENTURES
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-300 leading-relaxed">
              {language === 'th' ? businessInfo.taglineTh : businessInfo.tagline}
            </p>

            <div className="p-3.5 rounded-xl bg-[#081629] border border-[#E8704A]/30 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#E8704A]">
                <ShieldCheck className="w-4 h-4 text-[#E8704A] shrink-0" />
                <span>Fully Licensed & Insured Marine Operator</span>
              </div>
              <p className="text-[11px] text-slate-300 font-mono">
                Thai Marine Department License: #{businessInfo.licenseNumber}
              </p>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-white font-display font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E8704A]" />
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-slate-300 hover:text-[#E8704A] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#E8704A]" />
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link to="/tours" className="text-slate-300 hover:text-[#E8704A] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#E8704A]" />
                  {t.nav.tours}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-300 hover:text-[#E8704A] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#E8704A]" />
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-slate-300 hover:text-[#E8704A] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#E8704A]" />
                  {t.nav.gallery}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-slate-300 hover:text-[#E8704A] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#E8704A]" />
                  {t.nav.faq}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-300 hover:text-[#E8704A] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#E8704A]" />
                  {t.nav.contact}
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs pt-1">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  {t.nav.admin}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Tours */}
          <div>
            <h4 className="text-white font-display font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E8704A]" />
              {t.footer.tours}
            </h4>
            <ul className="space-y-2.5 text-sm">
              {toursData.map((tour) => (
                <li key={tour.id}>
                  <Link 
                    to={`/tours/${tour.slug}`}
                    className="text-slate-300 hover:text-[#E8704A] transition-colors line-clamp-1 flex items-center gap-1.5"
                  >
                    <Waves className="w-3 h-3 text-[#E8704A] shrink-0" />
                    <span>{language === 'th' && tour.name_th ? tour.name_th : tour.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contacts */}
          <div className="space-y-4">
            <h4 className="text-white font-display font-semibold text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E8704A]" />
              {t.footer.contactInfo}
            </h4>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E8704A] shrink-0 mt-0.5" />
                <span>{language === 'th' ? businessInfo.mainBaseTh : businessInfo.mainBase}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#E8704A] shrink-0" />
                <span>{language === 'th' ? businessInfo.operatingHoursTh : businessInfo.operatingHours}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#E8704A] shrink-0" />
                <a href={getPhoneTelUrl()} className="hover:underline">{businessInfo.phone}</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#E8704A] shrink-0" />
                <a href={`mailto:${businessInfo.email}`} className="hover:underline">{businessInfo.email}</a>
              </div>
            </div>

            {/* Messaging Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <a
                href={getWhatsAppUrl('Hello! I would like to inquire about Koh Phangan tours')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
              <a
                href={getLineUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#06C755] hover:bg-[#05b34c] text-white text-xs font-bold shadow-md transition-colors"
              >
                <span>LINE Official</span>
              </a>
            </div>
          </div>

        </div>

        {/* Weather & Guarantee Notice */}
        <div className="p-4 rounded-2xl bg-[#081629] border border-[#E8704A]/30 text-center text-xs text-slate-200 mb-8">
          <p>{t.footer.weatherNotice}</p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Koh Phangan Island Adventure. {t.footer.copyright}</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>Maritime Safety Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
