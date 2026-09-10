import React from 'react';
import { CloudSun, ShieldCheck, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const WeatherNotice: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="rounded-3xl bg-[#EDE0CB]/70 border border-[#1A5C52]/20 p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0D2137] flex items-center justify-center shrink-0 text-[#E8704A] shadow-sm">
            <CloudSun className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm sm:text-base font-bold text-[#0D2137] font-display flex items-center gap-2">
              <span>{language === 'th' ? 'การันตีความปลอดภัยและนโยบายสภาพอากาศ' : '100% Weather Safety & Rescheduling Guarantee'}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#E8704A]/20 text-[#0D2137] border border-[#E8704A]/30">
                Peace of Mind
              </span>
            </h4>
            <p className="text-xs sm:text-sm text-[#172126]/80 leading-relaxed max-w-3xl">
              {language === 'th'
                ? 'ทะเลอ่าวไทยมีความสวยงามตลอดทั้งปี หากวันเดินทางมีคลื่นลมแรงเกินเกณฑ์ความปลอดภัยของกรมเจ้าท่า คุณสามารถเลือกเลื่อนวันเดินทางได้ฟรี หรือเลือกรับเงินคืนเต็มจำนวน 100%'
                : 'Tropical weather in the Gulf of Thailand is closely monitored 24/7 by our certified captains. If sea conditions are ever unsuitable on your tour date, you have free flexible rescheduling or a 100% full refund guarantee.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center text-xs font-semibold text-[#0D2137]">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#1A5C52]/20 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-[#E8704A]" />
            <span>Insurance Included</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#1A5C52]/20 shadow-sm">
            <RefreshCw className="w-4 h-4 text-[#E8704A]" />
            <span>Free Date Change</span>
          </div>
        </div>
      </div>
    </div>
  );
};
