import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, MessageCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useBusiness } from '../../context/BusinessContext';

export const StickyMobileBar: React.FC = () => {
  const { t } = useLanguage();
  const { getWhatsAppUrl, getLineUrl } = useBusiness();
  const location = useLocation();

  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <aside aria-label="Mobile quick actions" className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0D2137]/98 backdrop-blur-xl border-t border-[#E8704A]/30 p-2.5 px-3 shadow-2xl safe-area-bottom">
      <div className="flex items-center gap-2 max-w-md mx-auto">
        <a
          href={getWhatsAppUrl('Hello! I am interested in Koh Phangan tours')}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center min-w-[62px] h-12 rounded-xl bg-emerald-600 text-white active:scale-95 transition-transform"
          aria-label="WhatsApp"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">{t.mobileBar.whatsapp}</span>
        </a>

        <a
          href={getLineUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center min-w-[58px] h-12 rounded-xl bg-[#06C755] text-white active:scale-95 transition-transform"
          aria-label="LINE"
        >
          <span className="font-extrabold text-sm tracking-tighter">LINE</span>
          <span className="text-[10px] font-bold mt-0.5">{t.mobileBar.line}</span>
        </a>

        <Link
          to="/book"
          className="flex-1 h-12 rounded-xl bg-gradient-to-r from-[#C8820A] to-[#E8704A] text-[#0D2137] font-display font-extrabold text-sm uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all"
        >
          <Calendar className="w-4 h-4 text-[#0D2137] stroke-[2.5]" />
          <span>{t.mobileBar.bookNow}</span>
        </Link>
      </div>
    </aside>
  );
};
