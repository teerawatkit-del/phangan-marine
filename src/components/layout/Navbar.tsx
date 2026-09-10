import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Anchor, 
  Compass, 
  Menu, 
  X, 
  ChevronDown, 
  Globe, 
  Calendar,
  Sparkles,
  ShieldCheck,
  Sailboat
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { toursData } from '../../data/toursData';

export const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toursDropdownOpen, setToursDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setToursDropdownOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#0D2137]/95 backdrop-blur-md border-b border-[#E8704A]/25 py-3 shadow-marine' 
          : 'bg-gradient-to-b from-[#0D2137]/90 via-[#0D2137]/50 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E8704A] to-[#1A5C52] flex items-center justify-center shadow-lg shadow-[#E8704A]/25 group-hover:scale-105 transition-transform duration-300">
              <Anchor className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1.5">
                KOH PHANGAN
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8704A]/20 text-[#E8704A] border border-[#E8704A]/40 hidden sm:inline-block">
                  SEA SAFARI
                </span>
              </span>
              <span className="text-[11px] font-medium tracking-widest uppercase text-[#C8820A]">
                Marine & Island Escapes
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                isActive('/') && location.pathname === '/'
                  ? 'text-[#E8704A] bg-white/10 font-bold' 
                  : 'text-slate-100 hover:text-white hover:bg-white/5'
              }`}
            >
              {t.nav.home}
            </Link>

            {/* Tours Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setToursDropdownOpen(true)}
              onMouseLeave={() => setToursDropdownOpen(false)}
            >
              <button
                onClick={() => setToursDropdownOpen(!toursDropdownOpen)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive('/tours') 
                    ? 'text-[#E8704A] bg-white/10 font-bold' 
                    : 'text-slate-100 hover:text-white hover:bg-white/5'
                }`}
              >
                <Compass className="w-4 h-4 text-[#E8704A]" />
                {t.nav.tours}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${toursDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {toursDropdownOpen && (
                <div className="absolute top-full left-0 w-80 pt-2 z-50 animate-fadeIn">
                  <div className="bg-[#0D2137] border border-[#E8704A]/30 rounded-2xl p-2 shadow-2xl">
                    <Link
                      to="/tours"
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 text-xs font-semibold uppercase tracking-wider text-[#E8704A] border-b border-white/10 mb-1"
                    >
                      <span>{t.nav.allTours}</span>
                      <Sparkles className="w-3.5 h-3.5 text-[#C8820A]" />
                    </Link>
                    <div className="space-y-0.5">
                      {toursData.map((tour) => (
                        <Link
                          key={tour.id}
                          to={`/tours/${tour.slug}`}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 group transition-colors"
                        >
                          <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 mt-0.5">
                            <img src={tour.hero_image} alt={tour.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white group-hover:text-[#E8704A] transition-colors line-clamp-1">
                              {language === 'th' && tour.name_th ? tour.name_th : tour.name}
                            </div>
                            <div className="text-xs text-slate-300 flex items-center gap-2 mt-0.5">
                              <span className="font-bold text-[#C8820A]">฿{tour.price_from.toLocaleString()}</span>
                              <span>•</span>
                              <span>{tour.duration}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/about"
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                isActive('/about') ? 'text-[#E8704A] bg-white/10 font-bold' : 'text-slate-100 hover:text-white hover:bg-white/5'
              }`}
            >
              {t.nav.about}
            </Link>

            <Link
              to="/gallery"
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                isActive('/gallery') ? 'text-[#E8704A] bg-white/10 font-bold' : 'text-slate-100 hover:text-white hover:bg-white/5'
              }`}
            >
              {t.nav.gallery}
            </Link>

            <Link
              to="/faq"
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                isActive('/faq') ? 'text-[#E8704A] bg-white/10 font-bold' : 'text-slate-100 hover:text-white hover:bg-white/5'
              }`}
            >
              {t.nav.faq}
            </Link>

            <Link
              to="/contact"
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                isActive('/contact') ? 'text-[#E8704A] bg-white/10 font-bold' : 'text-slate-100 hover:text-white hover:bg-white/5'
              }`}
            >
              {t.nav.contact}
            </Link>
          </nav>

          {/* Right Action Bar */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language Switcher */}
            <div className="flex items-center bg-[#081629] border border-white/15 rounded-full p-0.5 text-xs font-semibold">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-full transition-all ${
                  language === 'en'
                    ? 'bg-[#E8704A] text-[#0D2137] font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('th')}
                className={`px-2.5 py-1 rounded-full transition-all ${
                  language === 'th'
                    ? 'bg-[#E8704A] text-[#0D2137] font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                TH
              </button>
            </div>

            {/* Direct Book CTA */}
            <Link
              to="/book"
              className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-display font-bold text-sm text-[#0D2137] bg-gradient-to-r from-[#C8820A] to-[#E8704A] hover:brightness-110 shadow-lg shadow-[#E8704A]/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <Calendar className="w-4 h-4 text-[#0D2137] stroke-[2.5]" />
              <span>{t.nav.bookNow}</span>
            </Link>
          </div>

          {/* Mobile Menu & Language Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setLanguage(language === 'en' ? 'th' : 'en')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/20 text-xs font-bold text-[#E8704A]"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language.toUpperCase()}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[60px] bg-[#0D2137]/98 backdrop-blur-2xl border-b border-[#E8704A]/30 max-h-[85vh] overflow-y-auto px-5 py-6 shadow-2xl animate-fadeIn">
          <div className="flex flex-col space-y-3">
            <Link
              to="/"
              className={`p-3 rounded-xl text-base font-medium flex items-center justify-between ${
                isActive('/') && location.pathname === '/' ? 'bg-white/15 text-[#E8704A] font-bold' : 'text-slate-100 hover:bg-white/5'
              }`}
            >
              <span>{t.nav.home}</span>
              <Sailboat className="w-4 h-4 text-[#E8704A]" />
            </Link>

            <div className="py-2 border-y border-white/10 space-y-1">
              <Link
                to="/tours"
                className="p-3 rounded-xl text-base font-semibold text-[#E8704A] flex items-center justify-between hover:bg-white/10"
              >
                <span>{t.nav.allTours}</span>
                <Compass className="w-4 h-4 text-[#C8820A]" />
              </Link>
              <div className="grid grid-cols-1 gap-1 pl-3">
                {toursData.map((tour) => (
                  <Link
                    key={tour.id}
                    to={`/tours/${tour.slug}`}
                    className="p-2 rounded-lg text-sm text-slate-200 hover:text-[#E8704A] hover:bg-white/5 flex items-center justify-between"
                  >
                    <span>{language === 'th' && tour.name_th ? tour.name_th : tour.name}</span>
                    <span className="text-xs text-[#C8820A] font-mono font-bold">฿{tour.price_from.toLocaleString()}</span>
                  </Link>
                ))}
              </div>
            </div>

            <Link
              to="/about"
              className={`p-3 rounded-xl text-base font-medium ${
                isActive('/about') ? 'bg-white/15 text-[#E8704A] font-bold' : 'text-slate-100 hover:bg-white/5'
              }`}
            >
              {t.nav.about}
            </Link>

            <Link
              to="/gallery"
              className={`p-3 rounded-xl text-base font-medium ${
                isActive('/gallery') ? 'bg-white/15 text-[#E8704A] font-bold' : 'text-slate-100 hover:bg-white/5'
              }`}
            >
              {t.nav.gallery}
            </Link>

            <Link
              to="/faq"
              className={`p-3 rounded-xl text-base font-medium ${
                isActive('/faq') ? 'bg-white/15 text-[#E8704A] font-bold' : 'text-slate-100 hover:bg-white/5'
              }`}
            >
              {t.nav.faq}
            </Link>

            <Link
              to="/contact"
              className={`p-3 rounded-xl text-base font-medium ${
                isActive('/contact') ? 'bg-white/15 text-[#E8704A] font-bold' : 'text-slate-100 hover:bg-white/5'
              }`}
            >
              {t.nav.contact}
            </Link>

            <Link
              to="/admin"
              className="p-3 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              <span>{t.nav.admin}</span>
            </Link>

            <div className="pt-4">
              <Link
                to="/book"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-display font-bold text-[#0D2137] bg-gradient-to-r from-[#C8820A] to-[#E8704A] shadow-lg"
              >
                <Calendar className="w-5 h-5 text-[#0D2137]" />
                <span>{t.nav.bookNow}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
