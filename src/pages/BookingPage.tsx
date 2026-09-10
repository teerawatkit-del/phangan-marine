import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, 
  Users, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Clock, 
  ShieldCheck, 
  MessageCircle, 
  ArrowRight,
  AlertCircle,
  Zap,
  Copy,
  Check,
  Compass,
  Anchor
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useBookings } from '../context/BookingContext';
import { useTours } from '../context/TourContext';
import { useBusiness } from '../context/BusinessContext';
import { sendAutomatedEmail, generateEmailHtml } from '../lib/emailService';
import { charterRoutesData, charterFleet, charterRemarks } from '../data/charterRates';
import type { Booking, Language } from '../types';

export const BookingPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { addBooking } = useBookings();
  const { tours } = useTours();
  const { businessInfo, getWhatsAppUrl, getLineUrl } = useBusiness();
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);
  const [emailStatusMessage, setEmailStatusMessage] = useState<string>('');
  const [showVoucherModal, setShowVoucherModal] = useState<boolean>(false);

  const initialTourSlug = searchParams.get('tour') || 'koh-phangan-island-tour';
  const initialTour = tours.find((t) => t.slug === initialTourSlug) || tours[0];

  const [selectedTourId, setSelectedTourId] = useState<string>(initialTour.id);
  const [bookingDate, setBookingDate] = useState<string>(() => {
    const tomorrow = new Date(Date.now() + 86400000);
    return tomorrow.toISOString().split('T')[0];
  });
  const [preferredTime, setPreferredTime] = useState<string>(initialTour.departure_times[0] || '09:00 AM');
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);

  // Speedboat Charter Specific Options
  const [selectedCharterRouteId, setSelectedCharterRouteId] = useState<string>('koh-tao-lunch');
  const [selectedCharterFleetId, setSelectedCharterFleetId] = useState<string>('1-engine-8pax');

  // Jet ski & Tier options
  const [selectedModel, setSelectedModel] = useState<string>('Yamaha 1900 CC');
  const [selectedDuration, setSelectedDuration] = useState<string>('30'); // '30' or '60'
  const [craftCount, setCraftCount] = useState<number>(1);

  const [customerName, setCustomerName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [whatsapp, setWhatsapp] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [preferredLang, setPreferredLang] = useState<Language>(language);
  const [specialRequest, setSpecialRequest] = useState<string>('');

  const [validationError, setValidationError] = useState<string>('');

  const selectedTour = tours.find((t) => t.id === selectedTourId) || tours[0];
  const isSpeedboatCharter = selectedTour.slug === 'speedboat';
  const isFishingTrip = selectedTour.slug === 'fishing';
  const isJetSki = selectedTour.slug === 'jet-ski';

  // Reset or adjust when tour changes
  useEffect(() => {
    if (selectedTour.pricing_tiers && selectedTour.pricing_tiers.length > 0) {
      setSelectedModel(selectedTour.pricing_tiers[0].model);
      setSelectedDuration('30');
      setCraftCount(1);
    }
    if (selectedTour.departure_times && selectedTour.departure_times.length > 0) {
      setPreferredTime(selectedTour.departure_times[0]);
    }
  }, [selectedTourId]);

  const calculateTotalPrice = () => {
    // 1. Private Speedboat Charter
    if (isSpeedboatCharter) {
      const route = charterRoutesData.find((r) => r.id === selectedCharterRouteId) || charterRoutesData[0];
      if (selectedCharterFleetId === '1-engine-8pax') {
        return route.price_1engine_8pax || 22000;
      } else if (selectedCharterFleetId === '2-engines-16pax-wc') {
        return route.price_2engines_16pax_wc || 28000;
      } else {
        return route.price_2engines_8pax_wc || 26000;
      }
    }

    // 2. Fishing Trips
    if (isFishingTrip) {
      const isSmallBoat = selectedModel.includes('Small Fishing Boat') || selectedModel.includes('ลำเล็ก');
      if (isSmallBoat) {
        const totalGuests = adults + children;
        if (totalGuests <= 2) {
          return 3500;
        } else {
          return totalGuests * 1500;
        }
      } else {
        const tier = selectedTour.pricing_tiers?.find((t) => t.model === selectedModel);
        return tier?.price_60min || 9500;
      }
    }

    // 3. Jet Ski Safaris
    if (isJetSki && selectedTour.pricing_tiers) {
      const tier = selectedTour.pricing_tiers.find((t) => t.model === selectedModel) || selectedTour.pricing_tiers[0];
      const rate = selectedDuration === '60' ? (tier.price_60min || 6000) : (tier.price_30min || 3500);
      return rate * craftCount;
    }

    // 4. Other Tiers / Group Join Island Tours (Per person)
    if (selectedTour.pricing_tiers && selectedTour.pricing_tiers.length > 0) {
      const tier = selectedTour.pricing_tiers.find((t) => t.model === selectedModel) || selectedTour.pricing_tiers[0];
      const rate = selectedDuration === '60' ? (tier.price_60min || 6000) : (tier.price_30min || 3500);
      return rate * craftCount;
    }

    const adultTotal = adults * selectedTour.price_from;
    const childTotal = children * (selectedTour.price_from * 0.7);
    return Math.round(adultTotal + childTotal);
  };

  const totalPrice = calculateTotalPrice();

  useEffect(() => {
    window.scrollTo({ top: 120, behavior: 'smooth' });
  }, [step]);

  const handleNextStep = () => {
    setValidationError('');

    if (step === 1) {
      if (!selectedTourId) {
        setValidationError('Please select a tour experience.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!bookingDate) {
        setValidationError('Please choose a valid date.');
        return;
      }
      if (adults < 1) {
        setValidationError('At least 1 guest is required.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!customerName.trim()) {
        setValidationError('Please enter your full name.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setValidationError('Please enter a valid email address.');
        return;
      }
      if (!whatsapp.trim()) {
        setValidationError('Please enter your WhatsApp or phone number.');
        return;
      }
      if (!country.trim()) {
        setValidationError('Please specify your country / nationality.');
        return;
      }
      setStep(4);
    }
  };

  const selectedRouteObj = charterRoutesData.find((r) => r.id === selectedCharterRouteId);
  const selectedFleetObj = charterFleet.find((f) => f.id === selectedCharterFleetId);

  const getOptionDescription = () => {
    if (isSpeedboatCharter && selectedRouteObj && selectedFleetObj) {
      return `${selectedRouteObj.route} · ${selectedFleetObj.name}`;
    }
    if (isFishingTrip || isJetSki) {
      return `${selectedModel} (${selectedDuration === '60' ? 'Full Session' : 'Standard Session'}) x ${craftCount}`;
    }
    return undefined;
  };

  const handleFormSubmit = async () => {
    setIsSubmitting(true);
    setValidationError('');

    try {
      const newBooking = await addBooking({
        tour_id: selectedTour.id,
        tour_name: selectedTour.name,
        booking_date: bookingDate,
        preferred_time: preferredTime,
        adults,
        children,
        selected_model: getOptionDescription(),
        selected_duration: isSpeedboatCharter ? selectedRouteObj?.route : (selectedTour.pricing_tiers ? `${selectedDuration} Minutes` : undefined),
        craft_count: isJetSki ? craftCount : 1,
        customer_name: customerName,
        email,
        whatsapp,
        country,
        language: preferredLang,
        special_request: specialRequest,
        total_price: totalPrice
      });

      // Dispatch automated email confirmation
      try {
        const emailResult = await sendAutomatedEmail(newBooking, businessInfo);
        setEmailStatusMessage(emailResult.message);
      } catch (e) {
        console.warn('Background email dispatch notice:', e);
      }

      setConfirmedBooking(newBooking);
      setStep(5);
    } catch {
      setValidationError('An error occurred while saving your booking. Please try again or message us on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const tourDisplayName = language === 'th' && selectedTour.name_th ? selectedTour.name_th : selectedTour.name;

  // Pre-filled WhatsApp message generator
  const generateWhatsAppUrl = (booking: Booking) => {
    const summaryText = 
      `Hello ${businessInfo.companyName}! 🌊\n\n` +
      `I just submitted a booking request:\n` +
      `📌 Booking Ref: ${booking.booking_number}\n` +
      `🛥️ Tour: ${tourDisplayName}\n` +
      (booking.selected_model ? `⚡ Option / Route: ${booking.selected_model}\n` : '') +
      `📅 Date: ${booking.booking_date} at ${booking.preferred_time}\n` +
      `👥 Party: ${booking.adults} Adults${booking.children > 0 ? `, ${booking.children} Children` : ''}\n` +
      `👤 Lead Guest: ${booking.customer_name} (${booking.country})\n` +
      `📱 Contact: ${booking.whatsapp}\n` +
      `💰 Estimated Total: ฿${booking.total_price.toLocaleString()}\n` +
      (booking.special_request ? `📝 Note: "${booking.special_request}"\n` : '') +
      `\nPlease confirm boat availability and schedule. Thank you!`;

    const cleanNum = businessInfo.whatsapp.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanNum}?text=${encodeURIComponent(summaryText)}`;
  };

  const handleCopySummary = (booking: Booking) => {
    const summaryText = 
      `${businessInfo.companyName} Booking Request\n` +
      `Reference: ${booking.booking_number}\n` +
      `Tour: ${tourDisplayName}\n` +
      (booking.selected_model ? `Option / Vessel: ${booking.selected_model}\n` : '') +
      `Date & Time: ${booking.booking_date} at ${booking.preferred_time}\n` +
      `Guest: ${booking.customer_name} (${booking.whatsapp})\n` +
      `Total: ฿${booking.total_price.toLocaleString()}`;

    navigator.clipboard.writeText(summaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 3000);
  };

  return (
    <div className="pt-28 sm:pt-32 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Page Header */}
      {step < 5 && (
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="marine-badge">
            <CalendarIcon className="w-3.5 h-3.5 text-[#1A5C52]" />
            <span>Instant Reservation Request</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-[#0D2137] tracking-tight">
            {t.booking.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B]">
            {t.booking.subtitle}
          </p>
        </div>
      )}

      {/* 4-Step Progress Indicator */}
      {step < 5 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-card">
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { num: 1, label: t.booking.step1 },
              { num: 2, label: isSpeedboatCharter ? 'Route & Vessel' : isJetSki ? 'Model & Session' : t.booking.step2 },
              { num: 3, label: t.booking.step3 },
              { num: 4, label: t.booking.step4 },
            ].map((s) => {
              const isDone = step > s.num;
              const isCurrent = step === s.num;
              return (
                <div key={s.num} className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      isDone
                        ? 'bg-[#1A5C52] text-white shadow-sm'
                        : isCurrent
                        ? 'bg-[#E8704A] text-white ring-4 ring-[#E8704A]/20 shadow-md'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                  </div>
                  <span className={`text-[11px] font-semibold hidden sm:inline ${isCurrent ? 'text-[#0D2137] font-bold' : 'text-slate-400'}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Validation Error Banner */}
      {validationError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-2.5 animate-fadeIn">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* STEP 1: SELECT TOUR */}
      {step === 1 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-card space-y-6 animate-fadeIn">
          <div className="space-y-1">
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-[#0D2137]">
              {t.booking.step1}: {t.booking.selectTourPrompt}
            </h2>
            <p className="text-xs text-[#64748B]">
              Choose from private speedboat charters, guided jet ski safaris, island excursions or fishing trips.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tours.filter((t) => t.active).map((tour) => {
              const isSelected = selectedTourId === tour.id;
              const name = language === 'th' && tour.name_th ? tour.name_th : tour.name;
              const duration = language === 'th' && tour.duration_th ? tour.duration_th : tour.duration;

              return (
                <div
                  key={tour.id}
                  onClick={() => setSelectedTourId(tour.id)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'border-[#E8704A] bg-[#EDE0CB]/20 shadow-md ring-2 ring-[#E8704A]/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-[#0D2137]">
                    <img src={tour.hero_image} alt={name} className="w-full h-full object-cover" />
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-[#E8704A] text-white p-1 rounded-full shadow-md">
                        <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A5C52]">
                        {tour.category}
                      </span>
                      <span className="text-xs font-extrabold text-[#0D2137] font-mono">
                        ฿{tour.price_from.toLocaleString()}
                      </span>
                    </div>

                    <h4 className="font-display font-bold text-sm text-[#0D2137] line-clamp-1">
                      {name}
                    </h4>

                    {tour.boat_type && (
                      <div className="text-[10px] text-[#1A5C52] font-semibold line-clamp-1">
                        🛥️ {language === 'th' && tour.boat_type_th ? tour.boat_type_th : tour.boat_type}
                      </div>
                    )}

                    <div className="text-[11px] text-[#64748B] flex items-center gap-2">
                      <Clock className="w-3 h-3 text-[#E8704A]" />
                      <span>{duration}</span>
                      <span>•</span>
                      <span>Max {tour.max_guests} pax</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleNextStep}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#C8820A] to-[#E8704A] hover:brightness-105 text-[#0D2137] font-display font-extrabold text-sm uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              <span>{t.booking.next}</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: ROUTE, VESSEL & SCHEDULE */}
      {step === 2 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-card space-y-6 animate-fadeIn">
          <div className="space-y-1">
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-[#0D2137]">
              {t.booking.step2}: {isSpeedboatCharter ? 'Select Destination Route & Boat Size' : isJetSki ? 'Select Watercraft Model & Session' : 'Schedule & Party Size'}
            </h2>
            <p className="text-xs text-[#64748B]">
              Selected: <strong className="text-[#1A5C52]">{tourDisplayName}</strong>
            </p>
          </div>

          {/* ── SPEEDBOAT CHARTER: ROUTE + VESSEL SELECTOR ── */}
          {isSpeedboatCharter && (
            <div className="space-y-5 p-5 rounded-2xl bg-[#EDE0CB]/30 border border-[#1A5C52]/20">
              
              {/* 1. Destination Route */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#0D2137] flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-[#E8704A]" />
                  <span>1. Select Charter Route / Destination (เลือกเส้นทาง)</span>
                </label>
                <select
                  value={selectedCharterRouteId}
                  onChange={(e) => setSelectedCharterRouteId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-stone-300 text-[#0D2137] text-sm font-semibold focus:outline-none focus:border-[#E8704A] shadow-sm"
                >
                  {charterRoutesData.filter(r => r.category !== 'fishing').map((route) => (
                    <option key={route.id} value={route.id}>
                      {language === 'th' ? route.route_th : route.route}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Vessel Category */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#0D2137] flex items-center gap-1.5">
                  <Anchor className="w-4 h-4 text-[#E8704A]" />
                  <span>2. Select Speedboat Size & Engine Option (เลือกขนาดเรือ)</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {charterFleet.map((fleet) => {
                    const isFleetSelected = selectedCharterFleetId === fleet.id;
                    const route = charterRoutesData.find((r) => r.id === selectedCharterRouteId);
                    let priceForThisFleet = 0;
                    if (fleet.id === '1-engine-8pax') priceForThisFleet = route?.price_1engine_8pax || 0;
                    if (fleet.id === '2-engines-16pax-wc') priceForThisFleet = route?.price_2engines_16pax_wc || 0;
                    if (fleet.id === '2-engines-8pax-wc') priceForThisFleet = route?.price_2engines_8pax_wc || 0;

                    return (
                      <div
                        key={fleet.id}
                        onClick={() => setSelectedCharterFleetId(fleet.id)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                          isFleetSelected
                            ? 'border-[#E8704A] bg-white shadow-md ring-2 ring-[#E8704A]/20'
                            : 'border-stone-200 bg-white/70 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-display font-extrabold text-sm text-[#0D2137]">
                              {language === 'th' ? fleet.name_th : fleet.name}
                            </div>
                            <div className="text-[10px] text-[#5C6E7A] mt-0.5">{fleet.specs}</div>
                          </div>
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                            isFleetSelected ? 'border-[#E8704A] bg-[#E8704A] text-white' : 'border-stone-300'
                          }`}>
                            {isFleetSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                          <span className="text-[10px] text-[#5C6E7A]">Charter Total:</span>
                          <span className="font-mono font-extrabold text-sm text-[#1A5C52]">
                            ฿{priceForThisFleet.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Conditions Summary Strip */}
              <div className="p-3 rounded-xl bg-white border border-stone-200 text-[11px] text-[#5C6E7A] space-y-1">
                <div>✅ <strong>Includes:</strong> Soft drinks, quality snorkeling gear & life jackets.</div>
                <div>ℹ️ <strong>Excludes:</strong> National park fees (Angthong: ฿300/฿150, Koh Nangyuan: ฿250/฿120) & land transfers.</div>
              </div>
            </div>
          )}

          {/* ── JET SKI & FISHING MODEL / DURATION SELECTOR ── */}
          {!isSpeedboatCharter && selectedTour.pricing_tiers && selectedTour.pricing_tiers.length > 0 && (
            <div className="space-y-4 p-5 rounded-2xl bg-[#EDE0CB]/30 border border-[#1A5C52]/20">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[#0D2137] flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#E8704A]" />
                  <span>1. Choose {isFishingTrip ? 'Fishing Package' : 'Watercraft Model'}</span>
                </label>
                <span className="text-[11px] text-[#5C6E7A]">All safety gear & fuel included</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedTour.pricing_tiers.map((tier) => {
                  const isModelSelected = selectedModel === tier.model;
                  const tierName = language === 'th' && tier.model_th ? tier.model_th : tier.model;
                  return (
                    <div
                      key={tier.model}
                      onClick={() => setSelectedModel(tier.model)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        isModelSelected
                          ? 'border-[#E8704A] bg-white shadow-md ring-2 ring-[#E8704A]/20'
                          : 'border-stone-200 bg-white/70 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-display font-extrabold text-base text-[#0D2137] flex items-center gap-1.5">
                            <span>{tierName}</span>
                            {tier.note && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#E8704A]/15 text-[#D45F3C]">
                                {tier.note}
                              </span>
                            )}
                          </div>
                          {tier.specs && (
                            <div className="text-xs text-[#5C6E7A] mt-0.5 font-mono">{tier.specs}</div>
                          )}
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isModelSelected ? 'border-[#E8704A] bg-[#E8704A] text-white' : 'border-stone-300'
                        }`}>
                          {isModelSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[#5C6E7A] block text-[10px]">{tier.col1_title || '30 MIN'}</span>
                          <span className="font-bold text-[#0D2137] font-mono">
                            {isFishingTrip ? `${tier.price_30min} Hours` : `฿${tier.price_30min?.toLocaleString()}`}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[#5C6E7A] block text-[10px]">{tier.col2_title || '60 MIN'}</span>
                          <span className="font-bold text-[#1A5C52] font-mono">฿{tier.price_60min?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Jet Ski Duration Options */}
              {isJetSki && (
                <div className="pt-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#0D2137] block mb-2">
                    2. Select Session Duration
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { val: '30', label: '30 Minutes', badge: 'Standard Session' },
                      { val: '60', label: '60 Minutes', badge: 'Most Popular · Coastal Run' }
                    ].map((dur) => {
                      const isDurSelected = selectedDuration === dur.val;
                      return (
                        <button
                          type="button"
                          key={dur.val}
                          onClick={() => setSelectedDuration(dur.val)}
                          className={`p-3.5 rounded-xl border-2 font-display text-left transition-all ${
                            isDurSelected
                              ? 'border-[#0D2137] bg-[#0D2137] text-white shadow-sm'
                              : 'border-stone-200 bg-white text-[#0D2137] hover:border-stone-300'
                          }`}
                        >
                          <div className="font-extrabold text-sm flex items-center justify-between">
                            <span>{dur.label}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                              isDurSelected ? 'bg-white/20 text-white' : 'bg-stone-100 text-[#5C6E7A]'
                            }`}>
                              {dur.badge}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Number of Units / Jet skis */}
              {isJetSki && (
                <div className="pt-2">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-stone-200">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#0D2137] block">
                        Number of Jet Skis
                      </span>
                      <span className="text-[11px] text-[#5C6E7A]">
                        Tandem riding allowed (up to 2 guests per ski)
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setCraftCount(Math.max(1, craftCount - 1))}
                        className="w-8 h-8 rounded-lg bg-stone-100 border border-stone-300 text-[#0D2137] font-bold hover:bg-stone-200"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-bold text-[#0D2137] font-mono text-base">{craftCount}</span>
                      <button
                        type="button"
                        onClick={() => setCraftCount(Math.min(6, craftCount + 1))}
                        className="w-8 h-8 rounded-lg bg-stone-100 border border-stone-300 text-[#0D2137] font-bold hover:bg-stone-200"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* DATE & TIME SELECTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#172126]">
                {t.booking.dateLabel} *
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-[#172126] text-sm focus:outline-none focus:border-[#E8704A]"
              />
              <p className="text-[11px] text-[#64748B]">
                Free flexible rescheduling if weather or sea conditions change.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#172126]">
                {t.booking.timeLabel} *
              </label>
              <select
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-[#172126] text-sm focus:outline-none focus:border-[#E8704A]"
              >
                {selectedTour.departure_times.map((time, idx) => (
                  <option key={idx} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* PARTY SIZE */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <h3 className="font-display font-bold text-base text-[#0D2137] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#1A5C52]" />
              <span>Party Size & Guests</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-[#0D2137]">{t.booking.adultsLabel}</div>
                  <div className="text-xs text-[#64748B]">{isSpeedboatCharter ? 'Included in Charter' : 'Full Fare'}</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-[#0D2137] font-bold hover:bg-slate-100"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-bold text-[#0D2137] font-mono text-base">{adults}</span>
                  <button
                    type="button"
                    onClick={() => setAdults(Math.min(selectedTour.max_guests, adults + 1))}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-[#0D2137] font-bold hover:bg-slate-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-[#0D2137]">{t.booking.childrenLabel}</div>
                  <div className="text-xs text-[#64748B]">{isSpeedboatCharter ? 'Included in Charter' : '30% Discount'}</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setChildren(Math.max(0, children - 1))}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-[#0D2137] font-bold hover:bg-slate-100"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-bold text-[#0D2137] font-mono text-base">{children}</span>
                  <button
                    type="button"
                    onClick={() => setChildren(Math.min(10, children + 1))}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-[#0D2137] font-bold hover:bg-slate-100"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Price Preview Banner */}
            <div className="p-4 rounded-xl bg-stone-100 flex items-center justify-between text-sm">
              <span className="text-[#5C6E7A] font-semibold">Estimated Calculation:</span>
              <div className="text-right">
                <span className="font-mono font-extrabold text-xl text-[#0D2137]">฿{totalPrice.toLocaleString()}</span>
                {isSpeedboatCharter && selectedRouteObj && selectedFleetObj && (
                  <span className="text-[10px] text-[#5C6E7A] block">
                    ({selectedRouteObj.route} · {selectedFleetObj.name})
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-300 text-[#0D2137] text-xs font-bold transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t.booking.back}</span>
            </button>

            <button
              onClick={handleNextStep}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#C8820A] to-[#E8704A] hover:brightness-105 text-[#0D2137] font-display font-extrabold text-sm uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              <span>{t.booking.next}</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: CONTACT DETAILS */}
      {step === 3 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-card space-y-6 animate-fadeIn">
          <div className="space-y-1">
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-[#0D2137]">
              {t.booking.step3}: Contact Details
            </h2>
            <p className="text-xs text-[#64748B]">
              We use these details to coordinate hotel pickup and send written trip confirmation.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#172126]">
                  {t.booking.nameLabel} *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Johnathan Davis"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-[#172126] placeholder-slate-400 text-sm focus:outline-none focus:border-[#E8704A]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#172126]">
                  {t.booking.emailLabel} *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. john@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-[#172126] placeholder-slate-400 text-sm focus:outline-none focus:border-[#E8704A]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5 sm:col-span-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#172126]">
                  {t.booking.whatsappLabel} *
                </label>
                <input
                  type="tel"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="e.g. +44 7911 123456"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-[#172126] placeholder-slate-400 text-sm focus:outline-none focus:border-[#E8704A]"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#172126]">
                  {t.booking.countryLabel} *
                </label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. United Kingdom"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-[#172126] placeholder-slate-400 text-sm focus:outline-none focus:border-[#E8704A]"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#172126]">
                  {t.booking.languageLabel}
                </label>
                <select
                  value={preferredLang}
                  onChange={(e) => setPreferredLang(e.target.value as Language)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-[#172126] text-sm focus:outline-none focus:border-[#E8704A]"
                >
                  <option value="en">English</option>
                  <option value="th">ไทย (Thai)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#172126]">
                {t.booking.specialRequestsLabel}
              </label>
              <textarea
                rows={3}
                value={specialRequest}
                onChange={(e) => setSpecialRequest(e.target.value)}
                placeholder={t.booking.specialRequestsPlaceholder}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-[#172126] placeholder-slate-400 text-sm focus:outline-none focus:border-[#E8704A]"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-300 text-[#0D2137] text-xs font-bold transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t.booking.back}</span>
            </button>

            <button
              onClick={handleNextStep}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#C8820A] to-[#E8704A] hover:brightness-105 text-[#0D2137] font-display font-extrabold text-sm uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              <span>{t.booking.next}</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: FINAL REVIEW */}
      {step === 4 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-card space-y-6 animate-fadeIn">
          <div className="space-y-1">
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-[#0D2137]">
              {t.booking.step4}: Final Review & Summary
            </h2>
            <p className="text-xs text-[#64748B]">
              Please double-check your booking request before submitting.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs text-[#1A5C52] font-bold uppercase tracking-wider">{selectedTour.category}</span>
                <h3 className="font-display font-bold text-lg text-[#0D2137] mt-0.5">{tourDisplayName}</h3>
                {isSpeedboatCharter && selectedRouteObj && selectedFleetObj && (
                  <div className="mt-1 flex items-center gap-2 text-xs text-[#E8704A] font-bold">
                    <Compass className="w-3.5 h-3.5" />
                    <span>{selectedRouteObj.route} · {selectedFleetObj.name}</span>
                  </div>
                )}
                {isJetSki && (
                  <div className="mt-1 flex items-center gap-2 text-xs text-[#E8704A] font-bold">
                    <Zap className="w-3.5 h-3.5" />
                    <span>{selectedModel} · {selectedDuration} Minutes · {craftCount} Jet Ski(s)</span>
                  </div>
                )}
                {isFishingTrip && (
                  <div className="mt-1 flex items-center gap-2 text-xs text-[#E8704A] font-bold">
                    <Anchor className="w-3.5 h-3.5" />
                    <span>{selectedModel}</span>
                  </div>
                )}
              </div>
              <div className="text-right">
                <span className="text-xs text-[#64748B]">Estimated Total</span>
                <div className="text-2xl font-extrabold text-[#0D2137] font-mono">฿{totalPrice.toLocaleString()}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-[#64748B] block">{t.booking.date}</span>
                <span className="font-bold text-[#0D2137] text-sm">{bookingDate}</span>
              </div>
              <div>
                <span className="text-[#64748B] block">{t.booking.time}</span>
                <span className="font-bold text-[#0D2137] text-sm">{preferredTime}</span>
              </div>
              <div>
                <span className="text-[#64748B] block">{t.booking.adults}</span>
                <span className="font-bold text-[#0D2137] text-sm">{adults} Guests</span>
              </div>
              <div>
                <span className="text-[#64748B] block">{t.booking.children}</span>
                <span className="font-bold text-[#0D2137] text-sm">{children} Kids</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 text-xs text-[#172126] space-y-1">
              <div><strong>Lead Guest:</strong> {customerName} ({country})</div>
              <div><strong>Contact:</strong> {email} • WhatsApp: {whatsapp}</div>
              {specialRequest && <div><strong>Notes:</strong> "{specialRequest}"</div>}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#EDE0CB]/70 border border-[#1A5C52]/20 text-xs text-[#0D2137] flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#1A5C52] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">No Upfront Payment Required</span>
              <span>{t.booking.noPaymentNotice}</span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
            <button
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-1.5 px-6 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-300 text-[#0D2137] text-xs font-bold transition-all w-full sm:w-auto justify-center"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t.booking.back}</span>
            </button>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                disabled={isSubmitting}
                onClick={handleFormSubmit}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-300 text-[#0D2137] font-bold text-xs shadow-sm transition-all"
              >
                <span>Submit Online Only</span>
              </button>

              <button
                disabled={isSubmitting}
                onClick={async () => {
                  setIsSubmitting(true);
                  try {
                    const newBooking = await addBooking({
                      tour_id: selectedTour.id,
                      tour_name: selectedTour.name,
                      booking_date: bookingDate,
                      preferred_time: preferredTime,
                      adults,
                      children,
                      selected_model: getOptionDescription(),
                      selected_duration: isSpeedboatCharter ? selectedRouteObj?.route : (selectedTour.pricing_tiers ? `${selectedDuration} Minutes` : undefined),
                      craft_count: isJetSki ? craftCount : 1,
                      customer_name: customerName,
                      email,
                      whatsapp,
                      country,
                      language: preferredLang,
                      special_request: specialRequest,
                      total_price: totalPrice
                    });
                    setConfirmedBooking(newBooking);
                    setStep(5);
                    // Automatically open WhatsApp in new tab
                    window.open(generateWhatsAppUrl(newBooking), '_blank');
                  } catch {
                    setValidationError('Failed to submit booking. Please contact us on WhatsApp directly.');
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                className="inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-full bg-gradient-to-r from-emerald-600 to-[#1A5C52] text-white font-display font-extrabold text-sm uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>Submit & Send to WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: SUCCESS STATE WITH PRE-FILLED WHATSAPP & COPY BUTTON */}
      {step === 5 && confirmedBooking && (
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-card text-center space-y-8 animate-fadeIn">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-300 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div className="space-y-2">
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-[#0D2137]">
              {t.booking.successTitle}
            </h2>
            <div className="text-sm sm:text-base text-[#64748B]">
              {t.booking.successSub}{' '}
              <span className="font-mono font-extrabold text-[#0D2137] text-lg sm:text-xl px-3 py-1 rounded-lg bg-[#EDE0CB] border border-[#1A5C52]/30 inline-block my-1">
                {confirmedBooking.booking_number}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#64748B] max-w-lg mx-auto pt-2">
              {t.booking.successMessage}
            </p>
          </div>

          {/* Email Confirmation Notice */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">📧</span>
              <div>
                <span className="font-bold block">Confirmation Voucher Prepared</span>
                <span className="text-xs text-emerald-700">Sent to <strong>{confirmedBooking.email}</strong></span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowVoucherModal(true)}
              className="px-4 py-2 rounded-xl bg-white border border-emerald-400 text-emerald-800 text-xs font-bold shadow-sm hover:bg-emerald-100 transition-all shrink-0"
            >
              📄 View Voyage Voucher
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs sm:text-sm max-w-xl mx-auto flex items-center gap-2.5 text-left">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>{t.booking.noticeNotConfirmed}</span>
          </div>

          {/* Quick Action Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200 max-w-xl mx-auto space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0D2137]">
              🚀 1-Click Dispatch to WhatsApp ({businessInfo.whatsapp})
            </h4>
            <p className="text-xs text-[#64748B]">
              Click the button below to send your pre-formatted booking request directly to our boat operator for instant confirmation:
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={generateWhatsAppUrl(confirmedBooking)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-display font-extrabold text-sm uppercase tracking-wide shadow-lg hover:scale-[1.02] transition-all ring-4 ring-emerald-600/20"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>Send via WhatsApp ({businessInfo.whatsapp})</span>
              </a>

              <a
                href={getLineUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 py-4 px-5 rounded-2xl bg-[#06C755] hover:bg-[#05b34c] text-white font-display font-bold text-xs shadow-md hover:scale-[1.02] transition-all"
              >
                <span>Chat on LINE</span>
              </a>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleCopySummary(confirmedBooking)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-all"
              >
                {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSummary ? 'Booking Summary Copied!' : 'Copy Booking Details'}</span>
              </button>
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#1A5C52] hover:text-[#0D2137]"
            >
              <span>{t.booking.returnHome}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* VOUCHER PREVIEW MODAL */}
      {showVoucherModal && confirmedBooking && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-4 max-h-[92vh] overflow-y-auto border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-lg">📄</span>
                <h3 className="font-display font-bold text-lg text-[#0D2137]">
                  Official Voyage Voucher & Confirmation Receipt
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowVoucherModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Rendered HTML Preview Frame */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-inner bg-stone-50">
              <iframe
                title="Email Voucher Preview"
                srcDoc={generateEmailHtml(confirmedBooking, businessInfo)}
                className="w-full h-96 border-0"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setShowVoucherModal(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-6 py-2.5 rounded-xl bg-[#0D2137] hover:bg-[#1A5C52] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
              >
                <span>Print / Save as PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

