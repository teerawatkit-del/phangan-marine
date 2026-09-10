import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useBusiness } from '../../context/BusinessContext';

export const FloatingContactWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();
  const { businessInfo, getWhatsAppUrl, getLineUrl } = useBusiness();

  return (
    <aside aria-label="Floating contact chat" className="hidden lg:block fixed bottom-6 right-6 z-40">
      {isOpen && (
        <div className="mb-3 w-80 rounded-2xl bg-[#0D2137] border border-[#E8704A]/40 p-4 shadow-2xl animate-fadeIn text-white">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full bg-[#E8704A] animate-ping" />
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Marine Concierge Online
                </h4>
                <p className="text-[11px] text-[#E8704A]">
                  {language === 'th' ? 'ตอบกลับภายใน 5-15 นาที' : 'Typically replies in 5-15 mins'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
              aria-label="Close concierge widget"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-3 text-xs text-slate-200 space-y-2">
            <p>
              {language === 'th'
                ? 'สวัสดีครับ! สนใจทัวร์เรือส่วนตัว เจ็ทสกี หรือเช็คสภาพคลื่นลมทะเลวันนี้ สอบถามได้เลยครับ'
                : 'Sawadee krap! Planning an island trip or want live weather updates? Chat with our captain & team:'}
            </p>
          </div>

          <div className="space-y-2 pt-1">
            <a
              href={getWhatsAppUrl('Hello! I have a question about Koh Phangan tours')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Chat ({businessInfo.whatsapp})</span>
            </a>

            <a
              href={getLineUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#06C755] hover:bg-[#05b34c] text-white text-xs font-bold shadow-md transition-colors"
            >
              <span>LINE Official ({businessInfo.lineId})</span>
            </a>
          </div>
        </div>
      )}

      {/* Floating Trigger Bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#E8704A] to-[#1A5C52] text-white flex items-center justify-center shadow-marine-lg hover:scale-105 active:scale-95 transition-all duration-300 group"
        aria-label="Live Chat Concierge"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white stroke-[2.5]" />
        ) : (
          <div className="relative">
            <MessageCircle className="w-7 h-7 text-white stroke-[2.2] group-hover:rotate-6 transition-transform" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#C8820A] border-2 border-[#0D2137] rounded-full" />
          </div>
        )}
      </button>
    </aside>
  );
};
