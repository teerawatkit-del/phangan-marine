import React, { useState } from 'react';
import { Compass, Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTours } from '../context/TourContext';
import { TourCard } from '../components/ui/TourCard';
import { WeatherNotice } from '../components/ui/WeatherNotice';

export const ToursPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { tours } = useTours();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'All',
    'Island Escapes',
    'Adrenaline & Thrills',
    'Nature & Wildlife',
    'Angling & Sport',
    'VIP & Private Charters'
  ];

  const activeTours = tours.filter((tour) => tour.active);

  const filteredTours = activeTours.filter((tour) => {
    const matchesCategory = selectedCategory === 'All' || tour.category === selectedCategory;
    const tourName = (language === 'th' && tour.name_th ? tour.name_th : tour.name).toLowerCase();
    const tourDesc = (language === 'th' && tour.short_description_th ? tour.short_description_th : tour.short_description).toLowerCase();
    const matchesSearch = searchQuery === '' || 
      tourName.includes(searchQuery.toLowerCase()) || 
      tourDesc.includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-28 sm:pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="marine-badge">
          <Compass className="w-3.5 h-3.5 text-[#1A5C52]" />
          <span>{t.nav.tours}</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-[#0D2137] tracking-tight">
          {language === 'th' ? 'ทัวร์และการผจญภัยทางทะเลทั้งหมด' : 'All Tours & Marine Adventures'}
        </h1>
        <p className="text-sm sm:text-base text-[#64748B]">
          {language === 'th'
            ? 'เลือกทริปที่ตอบโจทย์สไตล์ของคุณ ตั้งแต่ทัวร์เกาะเต่า อ่างทอง ขับเจ็ทสกี ตกปลา ไปจนถึงเหมาลำเรือส่วนตัว'
            : 'Explore our full fleet of island excursions, private speedboat charters, jet ski safaris, and deep-sea fishing trips in the Gulf of Thailand.'}
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-card space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#1A5C52] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'th' ? 'ค้นหาทัวร์หรือสถานที่...' : 'Search tours, locations...'}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[#172126] placeholder-slate-400 text-sm focus:outline-none focus:border-[#E8704A] transition-colors"
            />
          </div>

          <div className="text-xs text-[#64748B] self-start md:self-center font-mono">
            Showing <span className="text-[#0D2137] font-bold">{filteredTours.length}</span> adventures
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#0D2137] text-white font-bold shadow-sm'
                  : 'bg-slate-100 text-[#64748B] hover:text-[#0D2137] hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tours Grid */}
      {filteredTours.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      ) : (
        <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-3 shadow-card">
          <Compass className="w-10 h-10 text-[#1A5C52] mx-auto" />
          <h3 className="text-lg font-bold text-[#0D2137]">No tours match your search</h3>
          <p className="text-sm text-[#64748B]">Try adjusting your keyword or clearing the category filter.</p>
          <button
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
            className="px-4 py-2 rounded-xl bg-[#0D2137] text-white text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Safety Notice */}
      <WeatherNotice />
    </div>
  );
};
