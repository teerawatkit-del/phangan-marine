export interface CharterRouteRate {
  id: string;
  route: string;
  route_th: string;
  category?: 'islands' | 'coastal' | 'transfer' | 'fishing';
  includes_lunch?: boolean;
  price_1engine_8pax?: number;          // 1 Engine for 8 Paxs
  price_2engines_16pax_wc?: number;     // 2 Engines for 16 Paxs (Has Bathroom)
  price_2engines_8pax_wc?: number;      // 2 Engines for 8 Paxs (Has Bathroom)
}

export const charterFleet = [
  {
    id: '1-engine-8pax',
    name: '1 Engine (8 Pax)',
    name_th: 'เรือ 1 เครื่องยนต์ (8 ท่าน)',
    capacity: 8,
    specs: 'Single Yamaha 250HP · Shaded Seating · Snorkel Gear · Soft Drinks',
    has_bathroom: false,
  },
  {
    id: '2-engines-16pax-wc',
    name: '2 Engines (16 Pax) + WC',
    name_th: 'เรือ 2 เครื่องยนต์ (16 ท่าน) + ห้องน้ำ',
    capacity: 16,
    specs: 'Twin Yamaha 500HP · Marine Bathroom · Shaded Cabin · Snorkel Gear',
    has_bathroom: true,
  },
  {
    id: '2-engines-8pax-wc',
    name: '2 Engines (8 Pax) + WC',
    name_th: 'เรือ 2 เครื่องยนต์ (8 ท่าน) + ห้องน้ำ',
    capacity: 8,
    specs: 'Twin Yamaha 500HP · Marine Bathroom · VIP Private Comfort · Fast & Smooth',
    has_bathroom: true,
  },
];

export const charterRoutesData: CharterRouteRate[] = [
  {
    id: 'koh-tao-lunch',
    route: 'Koh Tao & Koh Nangyuan (Includes Lunch)',
    route_th: 'เกาะเต่า & เกาะนางยวน (รวมอาหารกลางวัน)',
    category: 'islands',
    includes_lunch: true,
    price_1engine_8pax: 22000,
    price_2engines_16pax_wc: 28000,
    price_2engines_8pax_wc: 26000,
  },
  {
    id: 'koh-tao-no-lunch',
    route: 'Koh Tao & Koh Nangyuan (Not includes Lunch)',
    route_th: 'เกาะเต่า & เกาะนางยวน (*ไม่รวมอาหารกลางวัน)',
    category: 'islands',
    includes_lunch: false,
    price_1engine_8pax: 20000,
    price_2engines_16pax_wc: 26000,
    price_2engines_8pax_wc: 24000,
  },
  {
    id: 'angthong-lunch',
    route: 'Angthong Marine Park (Includes Lunch)',
    route_th: 'อุทยานแห่งชาติหมู่เกาะอ่างทอง (รวมอาหารกลางวัน)',
    category: 'islands',
    includes_lunch: true,
    price_1engine_8pax: 19000,
    price_2engines_16pax_wc: 25000,
    price_2engines_8pax_wc: 23000,
  },
  {
    id: 'angthong-no-lunch',
    route: 'Angthong Marine Park (Not includes Lunch)',
    route_th: 'อุทยานแห่งชาติหมู่เกาะอ่างทอง (*ไม่รวมอาหารกลางวัน)',
    category: 'islands',
    includes_lunch: false,
    price_1engine_8pax: 17000,
    price_2engines_16pax_wc: 23000,
    price_2engines_8pax_wc: 22000,
  },
  {
    id: 'koh-phaluai',
    route: 'Koh Phaluai',
    route_th: 'เกาะพะลวย',
    category: 'islands',
    price_1engine_8pax: 22000,
    price_2engines_16pax_wc: 28000,
    price_2engines_8pax_wc: 26000,
  },
  {
    id: 'hin-bai',
    route: 'Hin Bai (Sail Rock)',
    route_th: 'หินใบ (Sail Rock)',
    category: 'islands',
    price_1engine_8pax: 19000,
    price_2engines_16pax_wc: 25000,
    price_2engines_8pax_wc: 23000,
  },
  {
    id: 'around-phangan',
    route: 'Around Koh Phangan (5 Hours)',
    route_th: 'รอบเกาะพะงัน (5 ชั่วโมง)',
    category: 'coastal',
    price_1engine_8pax: 14000,
    price_2engines_16pax_wc: 20000,
    price_2engines_8pax_wc: 18000,
  },
  {
    id: 'sunset-cruise',
    route: 'Sunset Cruise',
    route_th: 'ล่องเรือชมพระอาทิตย์ตก (Sunset Cruise)',
    category: 'coastal',
    price_1engine_8pax: 12000,
    price_2engines_16pax_wc: 15000,
    price_2engines_8pax_wc: 13000,
  },
  {
    id: 'koh-tae-koh-mah',
    route: 'Koh Tae & Koh Mah',
    route_th: 'เกาะแต้ & เกาะม้า',
    category: 'coastal',
    price_1engine_8pax: 12000,
    price_2engines_16pax_wc: 13000,
    price_2engines_8pax_wc: 13000,
  },
  {
    id: 'koh-samui-transfer',
    route: 'Koh Samui (Charter / Transfer)',
    route_th: 'เกาะสมุย (เหมาลำ / รับ-ส่ง)',
    category: 'transfer',
    price_1engine_8pax: 6000,
    price_2engines_16pax_wc: 8000,
    price_2engines_8pax_wc: 7000,
  },
  {
    id: 'donsak-transfer',
    route: 'Donsak (Mainland Transfer)',
    route_th: 'ดอนสัก (ข้ามฝั่งแผ่นดินใหญ่)',
    category: 'transfer',
    price_1engine_8pax: 22000,
    price_2engines_16pax_wc: 28000,
    price_2engines_8pax_wc: 26000,
  },
  {
    id: 'fishing-3hr',
    route: 'Fishing Trip (3 Hours)',
    route_th: 'ทริปตกปลา (3 ชั่วโมง)',
    category: 'fishing',
    price_2engines_8pax_wc: 9500,
  },
  {
    id: 'fishing-5hr',
    route: 'Fishing Trip (5 Hours)',
    route_th: 'ทริปตกปลา (5 ชั่วโมง)',
    category: 'fishing',
    price_2engines_8pax_wc: 12000,
  },
  {
    id: 'fishing-one-day',
    route: 'Fishing Trip (One Day)',
    route_th: 'ทริปตกปลาเต็มวัน (One Day)',
    category: 'fishing',
    price_2engines_8pax_wc: 28000,
  },
];

export const charterRemarks = {
  includes: [
    'Soft drinks & chilled drinking water',
    'Quality snorkeling equipment (masks & snorkels)',
    'Life jackets for all passenger sizes'
  ],
  includes_th: [
    'น้ำอัดลมและน้ำดื่มเย็นฉ่ำตลอดทริป',
    'อุปกรณ์ดำน้ำตื้นคุณภาพดี (หน้ากาก & ท่อหายใจ)',
    'เสื้อชูชีพทุกขนาดสำหรับผู้โดยสาร'
  ],
  excludes: [
    'National park and island admission fees',
    'Land transfers to/from the departure pier'
  ],
  excludes_th: [
    'ค่าธรรมเนียมเข้าอุทยานแห่งชาติและค่าขึ้นเกาะ',
    'รถรับ-ส่งจากโรงแรมถึงท่าเรือ'
  ],
  admission_fees: [
    {
      name: 'Angthong Marine Park',
      name_th: 'อุทยานแห่งชาติหมู่เกาะอ่างทอง',
      adult: 300,
      child: 150
    },
    {
      name: 'Koh Nangyuan',
      name_th: 'เกาะนางยวน',
      adult: 250,
      child: 120
    }
  ],
  night_surcharge: {
    en: 'Trips operating between 19:30 PM and 05:00 AM incur an additional charge of 1,000 Baht per trip (1,000 Baht per hour for the boat).',
    th: 'การเดินทางช่วงเวลา 19:30 น. ถึง 05:00 น. มีค่าบริการกลางคืนเพิ่ม 1,000 บาทต่อทริป (คิด 1,000 บาท/ชม. สำหรับเรือ)'
  },
  waiting_time: {
    en: 'The first hour of waiting for a customer is free; subsequent hours are charged at 1,000 Baht per hour.',
    th: 'ฟรีเวลารอลูกค้า 1 ชั่วโมงแรก ชั่วโมงถัดไปคิดค่ารอ 1,000 บาทต่อชั่วโมง'
  },
  extra_passengers: {
    en: 'Exceeding the boat\'s specified capacity costs an additional 500 Baht per person.',
    th: 'กรณีผู้โดยสารเกินจำนวนความจุมาตรฐานของเรือ คิดเพิ่ม 500 บาทต่อท่าน'
  }
};
