import React, { useState } from 'react';
import { Search, ChevronDown, MessageCircle, HelpCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useBusiness } from '../context/BusinessContext';
import { faqData } from '../data/faqData';
import { WeatherNotice } from '../components/ui/WeatherNotice';

export const FaqPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { businessInfo, getWhatsAppUrl, getLineUrl } = useBusiness();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [openIndexes, setOpenIndexes] = useState<number[]>([0, 1]);

  const categories = ['All', 'Equipment', 'General', 'Safety & Weather', 'Booking & Cancellation'];

  const toggleFaq = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const filteredFaqs = faqData.filter((faq) => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const q = (language === 'th' ? faq.question_th : faq.question).toLowerCase();
    const a = (language === 'th' ? faq.answer_th : faq.answer).toLowerCase();
    const matchesSearch = searchQuery === '' || q.includes(searchQuery.toLowerCase()) || a.includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-28 sm:pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="marine-badge">
          <HelpCircle className="w-3.5 h-3.5 text-[#1A5C52]" />
          <span>{t.faq.badge}</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-[#0D2137] tracking-tight">
          {t.faq.title}
        </h1>
        <p className="text-sm sm:text-base text-[#64748B]">
          {t.faq.subtitle}
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-5 h-5 text-[#1A5C52] absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.faq.searchPlaceholder}
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 text-[#172126] placeholder-slate-400 text-sm focus:outline-none focus:border-[#E8704A] transition-colors shadow-card"
        />
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2 justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-[#0D2137] text-white font-bold shadow-sm'
                : 'bg-white text-[#64748B] hover:text-[#0D2137] border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordions */}
      <div className="space-y-3.5">
        {filteredFaqs.map((faq, index) => {
          const isOpen = openIndexes.includes(index);
          const questionText = language === 'th' ? faq.question_th : faq.question;
          const answerText = language === 'th' ? faq.answer_th : faq.answer;

          return (
            <div
              key={faq.id}
              className="rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-card transition-all"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-display font-bold text-base sm:text-lg text-[#0D2137] hover:text-[#1A5C52] transition-colors"
              >
                <span>{questionText}</span>
                <ChevronDown
                  className={`w-5 h-5 text-[#E8704A] shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm text-slate-700 leading-relaxed border-t border-slate-100 pt-4 animate-fadeIn">
                  {answerText}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <WeatherNotice />

      {/* Still need help CTA */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-4 shadow-card">
        <h3 className="font-display font-bold text-xl text-[#0D2137]">Still have a question?</h3>
        <p className="text-xs sm:text-sm text-[#64748B] max-w-md mx-auto">
          Our local concierge is on standby to help you with customized routes, special dietary needs, or live weather reports.
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <a
            href={getWhatsAppUrl('Hello! I have a question about Koh Phangan tour options')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp ({businessInfo.whatsapp})</span>
          </a>
          <a
            href={getLineUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#06C755] hover:bg-[#05b34c] text-white text-xs font-bold transition-colors"
          >
            <span>Connect on LINE ({businessInfo.lineId})</span>
          </a>
        </div>
      </div>
    </div>
  );
};
