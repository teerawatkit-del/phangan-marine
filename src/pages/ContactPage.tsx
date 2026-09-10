import React, { useState } from 'react';
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  Compass,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useBusiness } from '../context/BusinessContext';

export const ContactPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { businessInfo, getWhatsAppUrl, getLineUrl, getPhoneTelUrl } = useBusiness();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <div className="pt-28 sm:pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="marine-badge">
          <MessageCircle className="w-3.5 h-3.5 text-[#1A5C52]" />
          <span>{t.contact.badge}</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-[#0D2137] tracking-tight">
          {t.contact.title}
        </h1>
        <p className="text-sm sm:text-base text-[#64748B]">
          {t.contact.subtitle}
        </p>
      </div>

      {/* Main Grid: Direct Contacts + Inquiry Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Direct channels */}
        <div className="lg:col-span-5 space-y-6">
          
          <a
            href={getWhatsAppUrl('Hello! I am interested in Koh Phangan boat tours')}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-5 rounded-3xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md hover:scale-[1.01] transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-normal text-emerald-100 uppercase tracking-wider">Fastest Response</div>
              <div className="text-base sm:text-lg font-display">WhatsApp Concierge</div>
              <div className="text-xs text-emerald-200">{businessInfo.whatsapp}</div>
            </div>
          </a>

          <a
            href={getLineUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-5 rounded-3xl bg-[#06C755] hover:bg-[#05b34c] text-white font-bold shadow-md hover:scale-[1.01] transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <span className="font-extrabold text-sm tracking-tight">LINE</span>
            </div>
            <div>
              <div className="text-xs font-normal text-emerald-100 uppercase tracking-wider">LINE Official ID</div>
              <div className="text-base sm:text-lg font-display">{businessInfo.lineId}</div>
              <div className="text-xs text-emerald-200">Chat with local Thai / English team</div>
            </div>
          </a>

          {/* Contact Details Card */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-card space-y-4">
            <h3 className="font-display font-bold text-lg text-[#0D2137]">Office & Departure Bases</h3>
            
            <div className="space-y-3.5 text-xs sm:text-sm text-[#64748B]">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#1A5C52] shrink-0 mt-1" />
                <div>
                  <span className="font-semibold text-[#0D2137] block">Main Marina Base:</span>
                  <span>{language === 'th' ? businessInfo.mainBaseTh : businessInfo.mainBase}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Compass className="w-4 h-4 text-[#1A5C52] shrink-0 mt-1" />
                <div>
                  <span className="font-semibold text-[#0D2137] block">North Coast Base:</span>
                  <span>{language === 'th' ? businessInfo.northBaseTh : businessInfo.northBase}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#1A5C52] shrink-0" />
                <div>
                  <span className="font-semibold text-[#0D2137]">Hours: </span>
                  <span>{language === 'th' ? businessInfo.operatingHoursTh : businessInfo.operatingHours}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#1A5C52] shrink-0" />
                <div>
                  <span className="font-semibold text-[#0D2137]">Phone: </span>
                  <a href={getPhoneTelUrl()} className="hover:underline text-[#0D2137] font-semibold">{businessInfo.phone}</a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#1A5C52] shrink-0" />
                <div>
                  <span className="font-semibold text-[#0D2137]">Email: </span>
                  <a href={`mailto:${businessInfo.email}`} className="hover:underline">{businessInfo.email}</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Inquiry Form */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-card space-y-6">
            <div>
              <h3 className="font-display font-extrabold text-2xl text-[#0D2137]">
                {t.contact.quickInquiry}
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                Fill out this quick form and our boat dispatcher will reply within 30 minutes.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-[#EDE0CB]/80 border border-[#1A5C52]/30 text-center space-y-3 animate-fadeIn">
                <CheckCircle2 className="w-12 h-12 text-[#1A5C52] mx-auto" />
                <h4 className="font-display font-bold text-xl text-[#0D2137]">Message Sent Successfully!</h4>
                <p className="text-xs sm:text-sm text-[#172126]/80 max-w-md mx-auto">
                  {t.contact.sentSuccess}
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', whatsapp: '', message: '' });
                  }}
                  className="mt-2 text-xs font-bold text-[#1A5C52] underline hover:text-[#0D2137]"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#172126]">{t.contact.name} *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Liam Smith"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-[#172126] placeholder-slate-400 text-sm focus:outline-none focus:border-[#E8704A]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#172126]">{t.contact.email} *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. liam@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-[#172126] placeholder-slate-400 text-sm focus:outline-none focus:border-[#E8704A]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#172126]">{t.contact.whatsapp} (optional)</label>
                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="e.g. +44 7911 123456"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-[#172126] placeholder-slate-400 text-sm focus:outline-none focus:border-[#E8704A]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#172126]">{t.contact.message} *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your tour request, desired dates, group size, or questions..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-[#172126] placeholder-slate-400 text-sm focus:outline-none focus:border-[#E8704A]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#E8704A] to-[#1A5C52] hover:brightness-105 text-white font-display font-extrabold text-sm uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-white" />
                  <span>{t.contact.send}</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

      {/* Map & Location Area */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-4 shadow-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="space-y-1">
            <h3 className="font-display font-bold text-lg text-[#0D2137]">Koh Phangan Marina & Departure Map</h3>
            <p className="text-xs text-[#64748B]">Convenient pickup points at Thong Sala, Baan Tai, and Chaloklum Bay.</p>
          </div>
          <a
            href="https://maps.google.com/?q=Koh+Phangan+Surat+Thani+Thailand"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1A5C52] hover:text-[#0D2137]"
          >
            <span>Open in Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="w-full h-64 sm:h-80 rounded-2xl bg-[#0D2137] border border-slate-200 relative overflow-hidden flex items-center justify-center text-center p-6 text-white">
          <div className="space-y-3 max-w-md">
            <div className="w-12 h-12 rounded-full bg-[#E8704A]/20 text-[#E8704A] flex items-center justify-center mx-auto">
              <MapPin className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">Thong Sala Harbor Pier • Chaloklum Marina</h4>
            <p className="text-xs text-slate-300">
              Coordinates: 9.7126° N, 100.0078° E (Surat Thani, Thailand). Free private parking available at our dispatch lounge.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
