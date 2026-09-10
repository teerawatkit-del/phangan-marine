import type { Booking, BusinessInfo } from '../types';

export interface EmailSettings {
  provider: 'resend' | 'webhook' | 'emailjs' | 'native';
  apiKey: string;
  senderEmail: string;
  senderName: string;
  webhookEndpoint: string;
  emailjsServiceId: string;
  emailjsTemplateId: string;
  emailjsPublicKey: string;
  autoSendOnBooking: boolean;
}

export const DEFAULT_EMAIL_SETTINGS: EmailSettings = {
  provider: 'native',
  apiKey: '',
  senderEmail: 'reservations@kohphanganmarineadventures.com',
  senderName: 'Koh Phangan Marine Adventures',
  webhookEndpoint: '',
  emailjsServiceId: '',
  emailjsTemplateId: '',
  emailjsPublicKey: '',
  autoSendOnBooking: true
};

export const getEmailSettings = (): EmailSettings => {
  const saved = localStorage.getItem('phangan_email_settings');
  if (saved) {
    try {
      return { ...DEFAULT_EMAIL_SETTINGS, ...JSON.parse(saved) };
    } catch {
      return DEFAULT_EMAIL_SETTINGS;
    }
  }
  return DEFAULT_EMAIL_SETTINGS;
};

export const saveEmailSettings = (settings: EmailSettings): void => {
  localStorage.setItem('phangan_email_settings', JSON.stringify(settings));
};

/**
 * Generate a mobile-responsive HTML confirmation voucher & receipt
 */
export const generateEmailHtml = (booking: Booking, businessInfo: BusinessInfo): string => {
  const formattedPrice = `฿${(Number(booking.total_price) || 0).toLocaleString()}`;
  const totalGuests = booking.adults + (booking.children || 0);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation - ${booking.booking_number}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #FAF7F2;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1A1A2E;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #FAF7F2;
      padding: 30px 15px;
      box-sizing: border-box;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #FFFFFF;
      border-radius: 24px;
      overflow: hidden;
      border: 1px solid #EDE0CB;
      box-shadow: 0 10px 30px rgba(13, 33, 55, 0.08);
    }
    .header {
      background: linear-gradient(135deg, #0D2137 0%, #1A5C52 100%);
      padding: 40px 30px;
      text-align: center;
      color: #FFFFFF;
    }
    .badge {
      display: inline-block;
      padding: 6px 16px;
      background: rgba(232, 112, 74, 0.2);
      border: 1px solid #E8704A;
      color: #E8704A;
      border-radius: 50px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 12px;
    }
    .brand-title {
      margin: 0;
      font-size: 24px;
      font-weight: 900;
      letter-spacing: -0.5px;
      color: #FFFFFF;
    }
    .brand-subtitle {
      margin: 5px 0 0 0;
      font-size: 12px;
      color: #C8820A;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .ref-box {
      margin-top: 25px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      padding: 15px 20px;
      display: inline-block;
      border: 1px solid rgba(255, 255, 255, 0.15);
    }
    .ref-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #EDE0CB;
      margin-bottom: 4px;
    }
    .ref-number {
      font-size: 20px;
      font-weight: 800;
      font-family: monospace;
      color: #FFFFFF;
      letter-spacing: 2px;
    }
    .content {
      padding: 35px 30px;
    }
    .greeting {
      font-size: 18px;
      font-weight: 800;
      color: #0D2137;
      margin-top: 0;
      margin-bottom: 10px;
    }
    .intro-text {
      font-size: 14px;
      line-height: 1.6;
      color: #5C6E7A;
      margin-bottom: 25px;
    }
    .itinerary-card {
      background-color: #FAF7F2;
      border: 1px solid #EDE0CB;
      border-radius: 18px;
      padding: 22px;
      margin-bottom: 25px;
    }
    .card-heading {
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #1A5C52;
      margin-top: 0;
      margin-bottom: 15px;
      border-bottom: 1px solid #EDE0CB;
      padding-bottom: 8px;
    }
    .grid-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      font-size: 13px;
    }
    .grid-row:last-child {
      margin-bottom: 0;
    }
    .label {
      color: #64748B;
      font-weight: 500;
    }
    .value {
      color: #0D2137;
      font-weight: 700;
      text-align: right;
    }
    .highlight-value {
      color: #E8704A;
      font-weight: 800;
    }
    .price-box {
      background-color: #0D2137;
      color: #FFFFFF;
      border-radius: 16px;
      padding: 20px 24px;
      margin-bottom: 25px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .price-label {
      font-size: 12px;
      color: #EDE0CB;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .price-sub {
      font-size: 11px;
      color: #64748B;
      margin-top: 2px;
    }
    .price-amount {
      font-size: 26px;
      font-weight: 900;
      font-family: monospace;
      color: #E8704A;
      text-align: right;
    }
    .tips-box {
      background-color: #FFFFFF;
      border: 1px dashed #C8820A;
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 25px;
    }
    .tips-title {
      font-size: 13px;
      font-weight: 800;
      color: #C8820A;
      margin-top: 0;
      margin-bottom: 8px;
    }
    .tips-list {
      margin: 0;
      padding-left: 18px;
      font-size: 12px;
      color: #5C6E7A;
      line-height: 1.6;
    }
    .btn-container {
      text-align: center;
      margin: 30px 0 10px 0;
    }
    .cta-btn {
      display: inline-block;
      background: linear-gradient(135deg, #1A5C52 0%, #0D2137 100%);
      color: #FFFFFF !important;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 50px;
      font-size: 13px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      box-shadow: 0 4px 15px rgba(26, 92, 82, 0.3);
    }
    .whatsapp-btn {
      display: inline-block;
      background-color: #25D366;
      color: #FFFFFF !important;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 50px;
      font-size: 12px;
      font-weight: 700;
      margin-top: 10px;
    }
    .footer {
      background-color: #FAF7F2;
      border-top: 1px solid #EDE0CB;
      padding: 25px 30px;
      text-align: center;
      font-size: 11px;
      color: #64748B;
      line-height: 1.5;
    }
    .footer-license {
      color: #1A5C52;
      font-weight: 600;
      margin-bottom: 6px;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <!-- Header -->
      <div class="header">
        <div class="badge">Official Voyage Confirmation</div>
        <h1 class="brand-title">${businessInfo.companyName}</h1>
        <p class="brand-subtitle">Koh Phangan Marine & Island Escapes</p>
        
        <div class="ref-box">
          <div class="ref-label">Booking Reference #</div>
          <div class="ref-number">${booking.booking_number}</div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="content">
        <h2 class="greeting">Sawadee Krap, ${booking.customer_name}! 🌊</h2>
        <p class="intro-text">
          Thank you for choosing ${businessInfo.companyName}. We have received and confirmed your booking request. Our captain and marine crew are preparing your vessel for an unforgettable adventure.
        </p>

        <!-- Itinerary Summary -->
        <div class="itinerary-card">
          <h3 class="card-heading">Voyage & Departure Information</h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #EDE0CB; height: 32px;">
              <td style="color: #64748B; font-size: 12px;">Tour Package:</td>
              <td style="color: #0D2137; font-weight: 700; font-size: 13px; text-align: right;">${booking.tour_name || 'Island Adventure'}</td>
            </tr>
            ${booking.selected_model ? `
            <tr style="border-bottom: 1px solid #EDE0CB; height: 32px;">
              <td style="color: #64748B; font-size: 12px;">Vessel / Option:</td>
              <td style="color: #E8704A; font-weight: 700; font-size: 12px; text-align: right;">${booking.selected_model}</td>
            </tr>` : ''}
            <tr style="border-bottom: 1px solid #EDE0CB; height: 32px;">
              <td style="color: #64748B; font-size: 12px;">Scheduled Date:</td>
              <td style="color: #0D2137; font-weight: 700; font-size: 13px; text-align: right;">${booking.booking_date}</td>
            </tr>
            <tr style="border-bottom: 1px solid #EDE0CB; height: 32px;">
              <td style="color: #64748B; font-size: 12px;">Departure Time:</td>
              <td style="color: #0D2137; font-weight: 700; font-size: 13px; text-align: right;">${booking.preferred_time}</td>
            </tr>
            <tr style="border-bottom: 1px solid #EDE0CB; height: 32px;">
              <td style="color: #64748B; font-size: 12px;">Party Size:</td>
              <td style="color: #0D2137; font-weight: 700; font-size: 13px; text-align: right;">${booking.adults} Adults${booking.children > 0 ? `, ${booking.children} Children` : ''} (${totalGuests} Total)</td>
            </tr>
            <tr style="border-bottom: 1px solid #EDE0CB; height: 32px;">
              <td style="color: #64748B; font-size: 12px;">Marina Departure Pier:</td>
              <td style="color: #1A5C52; font-weight: 700; font-size: 12px; text-align: right;">${businessInfo.mainBase}</td>
            </tr>
            <tr style="height: 32px;">
              <td style="color: #64748B; font-size: 12px;">Contact Phone / WhatsApp:</td>
              <td style="color: #0D2137; font-weight: 700; font-size: 12px; text-align: right;">${booking.whatsapp}</td>
            </tr>
          </table>
        </div>

        <!-- Price Breakdown -->
        <table style="width: 100%; background-color: #0D2137; border-radius: 16px; margin-bottom: 25px; padding: 18px 22px;">
          <tr>
            <td>
              <div style="color: #EDE0CB; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Total Price (THB)</div>
              <div style="color: #8BA1B3; font-size: 11px; margin-top: 3px;">Includes fuel, crew & safety gear</div>
            </td>
            <td style="text-align: right;">
              <div style="color: #E8704A; font-size: 24px; font-weight: 900; font-family: monospace;">${formattedPrice}</div>
            </td>
          </tr>
        </table>

        <!-- Special Request If Any -->
        ${booking.special_request ? `
        <div style="background-color: #FAF7F2; border-left: 3px solid #E8704A; padding: 12px 16px; border-radius: 8px; margin-bottom: 25px;">
          <strong style="font-size: 12px; color: #0D2137; display: block; margin-bottom: 3px;">Your Special Notes:</strong>
          <span style="font-size: 12px; color: #5C6E7A; font-style: italic;">"${booking.special_request}"</span>
        </div>` : ''}

        <!-- What to bring -->
        <div class="tips-box">
          <h4 class="tips-title">☀️ What to Bring on Board:</h4>
          <ul class="tips-list">
            <li>Swimwear, beach towels, and sun protection (reef-safe sunscreen & sunglasses)</li>
            <li>Waterproof dry bag for mobile devices and cameras</li>
            <li>Passport copy or ID for marine harbor registration</li>
            <li>Motion sickness pills if sensitive to open ocean swells</li>
          </ul>
        </div>

        <!-- Action Links -->
        <div class="btn-container">
          <a href="${businessInfo.googleMapsUrl}" target="_blank" class="cta-btn">
            📍 Open Pier Map in Google Maps
          </a>
          <br/>
          <a href="https://wa.me/${businessInfo.whatsapp.replace(/[^0-9]/g, '')}?text=Hello!%20I%20am%20asking%20about%20booking%20${booking.booking_number}" target="_blank" class="whatsapp-btn">
            💬 Chat with Dispatch Concierge (+66 83 690 3666)
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <div class="footer-license">Thai Marine Department License #${businessInfo.licenseNumber}</div>
        <div>${businessInfo.companyName} · Pier Base: Thong Sala Harbor, Koh Phangan, Surat Thani 84280</div>
        <div>Direct Hotline: ${businessInfo.phone} · Email: ${businessInfo.email}</div>
        <div style="margin-top: 10px; font-size: 10px; color: #94A3B8;">
          © ${new Date().getFullYear()} ${businessInfo.companyName}. All rights reserved.
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
};

/**
 * Generate Plain Text confirmation message
 */
export const generateEmailText = (booking: Booking, businessInfo: BusinessInfo): string => {
  return `KOH PHANGAN MARINE ADVENTURES - BOOKING CONFIRMATION
==================================================
Booking Reference: ${booking.booking_number}
Lead Passenger: ${booking.customer_name} (${booking.country})
Tour: ${booking.tour_name || 'Marine Island Tour'}
${booking.selected_model ? `Option: ${booking.selected_model}\n` : ''}Date: ${booking.booking_date}
Departure Time: ${booking.preferred_time}
Party Size: ${booking.adults} Adults, ${booking.children || 0} Children
Total Amount: ฿${(Number(booking.total_price) || 0).toLocaleString()} THB
Marina Pier Base: ${businessInfo.mainBase}
Emergency WhatsApp: ${businessInfo.whatsapp}
==================================================
What to Bring:
- Swimsuit, towel, reef-safe sunscreen, sunglasses
- Waterproof bag for mobile phone and valuables
- ID or passport copy for harbor register

For any changes or questions, chat with us on WhatsApp: ${businessInfo.whatsapp}
Safe sailing!`;
};

/**
 * Generate a prefilled mailto: link for native 1-click email client dispatch
 */
export const generateMailtoLink = (booking: Booking, businessInfo: BusinessInfo): string => {
  const subject = `Booking Confirmation #${booking.booking_number} - ${businessInfo.companyName}`;
  const body = generateEmailText(booking, businessInfo);
  return `mailto:${booking.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

/**
 * Automated Email Dispatch Service
 * Handles Resend API, Webhook, EmailJS, or Mailto fallback
 */
export const sendAutomatedEmail = async (
  booking: Booking,
  businessInfo: BusinessInfo
): Promise<{ success: boolean; message: string }> => {
  const settings = getEmailSettings();

  // 1. Resend API Dispatch
  if (settings.provider === 'resend' && settings.apiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${settings.apiKey.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: `${settings.senderName} <${settings.senderEmail}>`,
          to: [booking.email],
          subject: `Booking Confirmation #${booking.booking_number} - ${booking.tour_name || businessInfo.companyName}`,
          html: generateEmailHtml(booking, businessInfo)
        })
      });

      if (res.ok) {
        return { success: true, message: `Confirmation email dispatched to ${booking.email} via Resend API.` };
      } else {
        const errData = await res.json().catch(() => ({}));
        return { success: false, message: `Resend API Error: ${errData.message || res.statusText}` };
      }
    } catch (err: any) {
      return { success: false, message: `Resend network error: ${err.message}` };
    }
  }

  // 2. Custom Webhook Dispatch (Make.com / Zapier / SendGrid proxy)
  if (settings.provider === 'webhook' && settings.webhookEndpoint) {
    try {
      const res = await fetch(settings.webhookEndpoint.trim(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'send_email_confirmation',
          to: booking.email,
          customer_name: booking.customer_name,
          booking_number: booking.booking_number,
          tour_name: booking.tour_name,
          booking_date: booking.booking_date,
          preferred_time: booking.preferred_time,
          total_price: booking.total_price,
          html_content: generateEmailHtml(booking, businessInfo),
          text_content: generateEmailText(booking, businessInfo)
        })
      });

      if (res.ok) {
        return { success: true, message: `Confirmation webhook dispatched for ${booking.email}.` };
      } else {
        return { success: false, message: `Webhook responded with status ${res.status}` };
      }
    } catch (err: any) {
      return { success: false, message: `Webhook dispatch failed: ${err.message}` };
    }
  }

  // 3. EmailJS Dispatch
  if (settings.provider === 'emailjs' && settings.emailjsServiceId && settings.emailjsTemplateId) {
    try {
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: settings.emailjsServiceId,
          template_id: settings.emailjsTemplateId,
          user_id: settings.emailjsPublicKey,
          template_params: {
            to_email: booking.email,
            to_name: booking.customer_name,
            booking_number: booking.booking_number,
            tour_name: booking.tour_name,
            booking_date: booking.booking_date,
            preferred_time: booking.preferred_time,
            total_price: `฿${(Number(booking.total_price) || 0).toLocaleString()}`,
            message: generateEmailText(booking, businessInfo)
          }
        })
      });

      if (res.ok) {
        return { success: true, message: `Email dispatched via EmailJS to ${booking.email}` };
      } else {
        return { success: false, message: `EmailJS responded with status ${res.status}` };
      }
    } catch (err: any) {
      return { success: false, message: `EmailJS network error: ${err.message}` };
    }
  }

  // 4. Default Native fallback (Simulated / Ready for mailto)
  return { 
    success: true, 
    message: `Email confirmation prepared for ${booking.email}. (Native Mailto mode active)` 
  };
};

/**
 * Test send email function
 */
export const sendTestEmail = async (
  targetEmail: string,
  businessInfo: BusinessInfo
): Promise<{ success: boolean; message: string }> => {
  const dummyBooking: Booking = {
    id: 'test-demo',
    booking_number: 'BK-TEST' + Math.floor(1000 + Math.random() * 9000),
    tour_id: 't-1',
    tour_name: 'Koh Phangan Island Tour & Secret Beaches',
    booking_date: new Date().toISOString().split('T')[0],
    preferred_time: '09:00 AM',
    adults: 2,
    children: 1,
    customer_name: 'Test Passenger',
    email: targetEmail.trim(),
    whatsapp: '+66 83 690 3666',
    country: 'Thailand',
    language: 'en',
    total_price: 6250,
    status: 'confirmed',
    created_at: new Date().toISOString()
  };

  return sendAutomatedEmail(dummyBooking, businessInfo);
};
