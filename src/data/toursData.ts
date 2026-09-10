import type { Tour } from '../types';

export const toursData: Tour[] = [
  {
    id: 't-1',
    name: 'Koh Phangan Island Tour & Secret Beaches',
    name_th: 'ทัวร์รอบเกาะพะงันและหาดลับ',
    slug: 'koh-phangan-island-tour',
    category: 'Island Escapes',
    boat_type: '38ft Coastal Speedboat Cruiser',
    boat_type_th: 'เรือสปีดโบ๊ทครุยเซอร์ 38 ฟุต',
    boat_specs: 'Twin 250HP Yamaha · Shaded Seating · Swim Ladder · Bluetooth Audio',
    boat_specs_th: 'เครื่องยนต์คู่ Yamaha 250HP · ที่นั่งเบาะนุ่มพร้อมหลังคากันแดด · บันไดว่ายน้ำ · เครื่องเสียงบลูทูธ',
    short_description: 'Cruise along dramatic granite coastlines, visit hidden coves, Bottle Beach, and snorkel in pristine turquoise bays on our comfortable 38ft twin-engine vessel.',
    short_description_th: 'ล่องเรือชมแนวหน้าผาหินแกรนิต เยือนหาดยอดนิยมและหาดลับ เช่น หาดขวด หาดคม พร้อมดำน้ำดูปะการัง บนเรือสปีดโบ๊ท 38 ฟุต 2 เครื่องยนต์',
    description: 'Experience Koh Phangan from its most breathtaking vantage point — the open sea. This full-day island cruise takes you past remote granite cliffs, secluded lagoons, and iconic coastal hotspots including Haad Rin, Thong Nai Pan, and Bottle Beach (Haad Khuat), inaccessible by standard vehicles. Stop for world-class reef snorkeling at Haad Khom and relax on white sand with refreshing tropical fruits aboard our custom 38ft twin-engine vessel with shaded seating and fresh water rinse.',
    description_th: 'สัมผัสความงดงามของเกาะพะงันจากมุมมองทางทะเล ล่องเรือสปีดโบ๊ท 38 ฟุต ปรับแต่งพิเศษ นั่งสบายไม่กระแทก ผ่านหน้าผาหินแกรนิตสูงตระหง่าน แวะพักผ่อนที่หาดขวดและหาดท้องนายปาน ดำน้ำตื้นชมแนวปะการังที่หาดคม พร้อมบริการผลไม้สดและเครื่องดื่มตลอดทริป',
    duration: '6 - 7 Hours',
    duration_th: '6 - 7 ชั่วโมง',
    price_from: 2500,
    max_guests: 14,
    featured: true,
    active: true,
    rating: 4.9,
    review_count: 128,
    departure_location: 'Thong Sala Pier or Chaloklum Pier',
    departure_times: ['09:00 AM', '10:00 AM'],
    included: [
      'Quality Snorkeling Mask & Sanitized Snorkel',
      'Life Jackets for All Sizes (Adults & Kids)',
      'Fresh Tropical Fruits & Iced Drinking Water',
      'Experienced English & Thai Speaking Marine Guide',
      'Accident Marine Passenger Insurance',
      'Complimentary Roundtrip Hotel Pier Transfer'
    ],
    included_th: [
      'อุปกรณ์ดำน้ำตื้น (หน้ากาก & ท่อหายใจฆ่าเชื้อ)',
      'เสื้อชูชีพทุกขนาดสำหรับเด็กและผู้ใหญ่',
      'ผลไม้สดตามฤดูกาลและน้ำดื่มเย็นฉ่ำ',
      'กัปตันและไกด์นำเที่ยวสองภาษา (ไทย/อังกฤษ)',
      'ประกันภัยอุบัติเหตุทางน้ำตามกฎหมาย',
      'บริการรถรับ-ส่งจากโรงแรมถึงท่าเรือ'
    ],
    excluded: [
      'Alcoholic Beverages (Available for Purchase or Bring Your Own)',
      'Personal Beach Towels & Sunscreen'
    ],
    highlights: [
      '38ft twin-engine speedboat cruiser with deep-cushioned shaded seats',
      'Cruise around the entire rugged coastline of Koh Phangan',
      'Snorkel among colorful corals and parrotfish at Haad Khom Reef',
      'Relax at world-famous secluded Bottle Beach (Haad Khuat)',
      'Scenic photography at Thong Nai Pan Bay & Than Sadet waterfall cove'
    ],
    highlights_th: [
      'เรือสปีดโบ๊ท 38 ฟุต 2 เครื่องยนต์ เบาะนุ่มกันกระแทก มีหลังคาบังแดดรอบลำ',
      'ล่องเรือชมทัศนียภาพรอบเกาะพะงันแบบพาโนรามา',
      'ดำน้ำชมฝูงปลาและปะการังหลากสีที่หาดคม',
      'พักผ่อนบนหาดทรายขาวละเอียดที่หาดขวด',
      'ถ่ายภาพวิวหน้าผาหินแกรนิตและอ่าวท้องนายปาน'
    ],
    itinerary: [
      { time: '08:30 AM', title: 'Hotel Pickup & Check-in', description: 'Air-conditioned transfer from your resort to the departure marina with briefing and fresh coffee.' },
      { time: '09:15 AM', title: 'Depart for North Coast', description: 'Cruising past Koh Ma sandbar and secret cliffside fishing coves.' },
      { time: '10:30 AM', title: 'Haad Khom Coral Snorkeling', description: 'Explore live coral gardens teeming with tropical reef fish and sea anemones.' },
      { time: '12:15 PM', title: 'Bottle Beach Landing & Thai Lunch', description: 'Drop anchor at secluded Bottle Beach for swimming, relaxing, and beachside lunch.' },
      { time: '02:30 PM', title: 'East Coast & Than Sadet Cove', description: 'Cruise past dramatic rocky bays where Thai royalty historically visited.' },
      { time: '04:00 PM', title: 'Return & Pier Transfer', description: 'Scenic return voyage back to pier and transfer back to your accommodation.' }
    ],
    hero_image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80'
    ],
    suitable_for: ['Couples', 'Families', 'Solo Travelers', 'Photographers']
  },
  {
    id: 't-2',
    name: 'Jet Ski Guided Coastal Adventure',
    name_th: 'ทริปขับเจ็ทสกีผจญภัยเลียบชายฝั่ง',
    slug: 'jet-ski',
    category: 'Adrenaline & Thrills',
    boat_type: 'High-Output Performance Jet Skis',
    boat_type_th: 'เจ็ทสกีสมรรถนะสูงรุ่นใหม่ล่าสุด',
    boat_specs: 'Yamaha 1900 CC (130 HP) & Sea-Doo SVHO (300 HP Supercharged)',
    boat_specs_th: 'Yamaha 1900 CC (130 แรงม้า) และ Sea-Doo SVHO (300 แรงม้า ซูเปอร์ชาร์จ)',
    short_description: 'High-speed ocean adventure on modern Yamaha 1900 CC or Sea-Doo SVHO craft. Choose 30 or 60 minutes with a professional guide along Koh Phangan\'s stunning coastline.',
    short_description_th: 'ผจญภัยความเร็วสูงบนเจ็ทสกี Yamaha 1900 CC หรือ Sea-Doo SVHO พร้อมไกด์นำทาง เลือกได้ 30 หรือ 60 นาที',
    description: 'Feel the pure adrenaline of high-horsepower watercraft while exploring Koh Phangan\'s spectacular coastline. Choose your machine — the reliable Yamaha 1900 CC for classic jet ski fun, or upgrade to the Sea-Doo SVHO for maximum power and performance. Accompanied by experienced safety marshals, you will carve across crystal turquoise waters, blast along secret sandbars, navigate rocky passages, and reach secluded bays that cannot be accessed by foot. Available in 30-minute and 60-minute sessions. Perfect for both beginners and experienced riders.',
    description_th: 'สัมผัสความตื่นเต้นของการขับขี่เจ็ทสกีสมรรถนะสูงตามแนวชายฝั่งสวยงามของเกาะพะงัน เลือกรุ่น Yamaha 1900 CC สำหรับประสบการณ์คลาสสิก หรืออัปเกรดเป็น Sea-Doo SVHO สำหรับพลังงานสูงสุด มีให้เลือกทั้ง 30 นาที และ 60 นาที',
    duration: '30 or 60 Minutes',
    duration_th: '30 หรือ 60 นาที',
    price_from: 3500,
    max_guests: 8,
    featured: true,
    active: true,
    rating: 5.0,
    review_count: 94,
    departure_location: 'Baan Tai Beach / Chaloklum Bay',
    departure_times: ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:30 PM (Sunset)'],
    included: [
      'Choice of Yamaha 1900 CC or Sea-Doo SVHO Jet Ski',
      'Full Fuel Included',
      'Safety Life Vest & Gear',
      'Professional Lead Guide & Safety Marshal Boat',
      'Waterproof Phone Case',
      'Full Safety Briefing & Riding Instruction',
    ],
    included_th: [
      'เจ็ทสกี Yamaha 1900 CC หรือ Sea-Doo SVHO ตามที่เลือก',
      'รวมค่าน้ำมันเชื้อเพลิง',
      'เสื้อชูชีพและอุปกรณ์เซฟตี้ครบชุด',
      'ไกด์นำขบวนมืออาชีพและเรือซัพพอร์ต',
      'ซองกันน้ำสำหรับโทรศัพท์มือถือ',
      'การอบรมขับขี่และความปลอดภัยก่อนออกทะเล',
    ],
    excluded: [
      'Personal Action Camera (Rentals Available)',
      'Damage Deposit / Waiver (Standard terms apply)',
    ],
    highlights: [
      'Yamaha 1900 CC — 30 min ฿3,500 · 60 min ฿6,000',
      'Sea-Doo SVHO — 30 min ฿5,500 · 60 min ฿10,000',
      'Solo or tandem riding (2 persons per ski at no extra charge)',
      'Golden hour sunset session available daily',
    ],
    highlights_th: [
      'Yamaha 1900 CC — 30 นาที ฿3,500 · 60 นาที ฿6,000',
      'Sea-Doo SVHO — 30 นาที ฿5,500 · 60 นาที ฿10,000',
      'ขับเดี่ยวหรือนั่งซ้อน 2 ท่านต่อลำ (ไม่คิดเพิ่ม)',
      'ทริปพิเศษช่วงพระอาทิตย์ตกดินทุกวัน',
    ],
    pricing_tiers: [
      {
        model: 'Yamaha 1900 CC',
        model_th: 'ยามาฮ่า 1900 CC',
        specs: '130 HP · Standard Performance · Beginner Friendly',
        col1_title: '30 Minutes',
        col2_title: '60 Minutes',
        price_30min: 3500,
        price_60min: 6000,
      },
      {
        model: 'Sea-Doo SVHO',
        model_th: 'ซี-ดู SVHO',
        specs: '300 HP · Supercharged · Maximum Power',
        col1_title: '30 Minutes',
        col2_title: '60 Minutes',
        price_30min: 5500,
        price_60min: 10000,
        note: 'High adrenaline / Supercharged',
      },
    ],
    itinerary: [
      { time: '00:00', title: 'Safety Briefing & Equipment Setup', description: 'Learn throttle control, emergency stop functions, safety distance protocols, and route map.' },
      { time: '00:10', title: 'Open Water Warm-Up', description: 'Get comfortable on your machine in the calm bay before heading out.' },
      { time: '00:20', title: 'Coastal Route & Points of Interest', description: 'Carve along the coastline visiting sandbars, rocky outcrops, and secluded coves.' },
      { time: '00:50', title: 'Return & Photo Stop', description: 'Final run back to base with a photo opportunity at the best coastal vantage point.' },
    ],
    hero_image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1600&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1000&q=80'
    ],
    suitable_for: ['Adrenaline Seekers', 'Couples', 'Friend Groups', 'Adventure Travelers']
  },
  {
    id: 't-3',
    name: 'Koh Tao & Koh Nang Yuan Day Trip',
    name_th: 'วันเดย์ทริปเกาะเต่า & เกาะนางยวน',
    slug: 'koh-tao',
    category: 'Island Escapes',
    boat_type: '42ft Triple-Engine Offshore Speedboat',
    boat_type_th: 'เรือสปีดโบ๊ทข้ามฟาก 42 ฟุต 3 เครื่องยนต์',
    boat_specs: '3x 300HP Yamaha (900 HP) · Deep-V Wave-Cutting Hull · Marine Head (Toilet) · Shaded Cabin',
    boat_specs_th: '3 เครื่องยนต์ Yamaha 300HP (รวม 900 แรงม้า) · ตัวเรือ Deep-V ตัดคลื่นนุ่มนวล · มีห้องน้ำในเรือ · ห้องโดยสารบังแดด',
    short_description: 'World-renowned snorkeling and diving trip to Thailand\'s turtle island and the famous sandbar of Koh Nang Yuan aboard our fast 900HP triple-engine speedboat.',
    short_description_th: 'ทริปดำน้ำตื้นระดับโลกสู่เกาะเต่า สวรรค์ของเต่าทะเล และสันทรายเชื่อมสามเกาะของเกาะนางยวน ด้วยเรือสปีดโบ๊ท 900 แรงม้า 3 เครื่องยนต์ นุ่มนวลและรวดเร็ว',
    description: 'Set sail from Koh Phangan on a high-speed maritime journey to Koh Tao, Asia\'s premier snorkeling and scuba diving haven. Our 42ft triple-engine speedboat (900 HP) cuts through open-water swells smoothly and swiftly in just 45 minutes. Swim alongside gentle green sea turtles at Shark Bay, witness thriving coral gardens at Mango Bay and Hin Wong Bay, and climb to the iconic viewpoint overlooking the white sandbar connecting the three islets of Koh Nang Yuan.',
    description_th: 'ออกเดินทางจากเกาะพะงันสู่เกาะเต่าและเกาะนางยวน ด้วยเรือสปีดโบ๊ทข้ามฟากสมรรถนะสูง 42 ฟุต 3 เครื่องยนต์ (900 แรงม้า) วิ่งตัดคลื่นอย่างมั่นคงและปลอดภัยเพียง 45 นาที ดำน้ำชมเต่าทะเลที่อ่าวฉลาม สัมผัสแนวปะการังอันอุดมสมบูรณ์ที่อ่าวมะม่วง และขึ้นจุดชมวิวเกาะนางยวนที่สวยงามติดอันดับโลก',
    duration: 'Full Day (8 Hours)',
    duration_th: 'เต็มวัน (8 ชั่วโมง)',
    price_from: 3200,
    max_guests: 18,
    featured: true,
    active: true,
    rating: 4.9,
    review_count: 215,
    departure_location: 'Thong Sala Pier / Chaloklum Pier',
    departure_times: ['08:00 AM'],
    included: [
      'High-Speed 900HP Triple-Engine Speedboat Crossing (Smooth Deep-V Hull)',
      'Professional Snorkeling Gear & Sanitized Silicone Mouthpieces',
      'Delicious Beachfront Thai Buffet Lunch on Koh Tao',
      'Koh Nang Yuan Island Landing & Environmental Entrance Fees',
      'Accident Marine Passenger Insurance',
      'Dedicated Marine Naturalist Guide & Fresh Water Rinse'
    ],
    included_th: [
      'เรือสปีดโบ๊ท 900 แรงม้า 3 เครื่องยนต์ ข้ามฟากอย่างรวดเร็วและนุ่มนวล',
      'อุปกรณ์ดำน้ำตื้นเกรดพรีเมียม ทำความสะอาดฆ่าเชื้อทุกครั้ง',
      'บุฟเฟต์อาหารกลางวันริมหาดบนเกาะเต่า',
      'ค่าธรรมเนียมขึ้นเกาะนางยวนและการอนุรักษ์สิ่งแวดล้อม',
      'ประกันภัยอุบัติเหตุทางน้ำ',
      'ไกด์ผู้เชี่ยวชาญการดำน้ำและระบบนิเวศน์ทางทะเล พร้อมน้ำจืดล้างตัว'
    ],
    excluded: [
      'Scuba Diving Equipment (Available as add-on for certified divers)',
      'Alcoholic Beverages'
    ],
    highlights: [
      'High-powered 900HP 3-engine speedboat ensures fast, stable open-ocean crossing',
      'High probability of swimming with sea turtles and blacktip reef sharks',
      'Iconic Koh Nang Yuan viewpoint hike with 360-degree sandbar view',
      'Multiple snorkeling sites selected on the day based on optimal visibility',
      'Onboard marine toilet and fresh water shower'
    ],
    highlights_th: [
      'เรือสปีดโบ๊ท 3 เครื่องยนต์ 900 แรงม้า ข้ามฟากมั่นคง ปลอดภัยสูง',
      'โอกาสสูงในการว่ายน้ำเคียงข้างเต่าทะเลและฉลามครีบดำ',
      'เดินขึ้นจุดชมวิวเกาะนางยวน ชมสันทรายเชื่อมเกาะ 360 องศา',
      'จุดดำน้ำที่ดีที่สุด 2-3 จุด โดยเลือกตามทิศทางลมและความใสของน้ำ',
      'มีห้องสุขาและน้ำจืดล้างตัวบนเรือ'
    ],
    itinerary: [
      { time: '07:30 AM', title: 'Resort Pickup', description: 'Transfer to pier for check-in and light morning refreshments.' },
      { time: '08:15 AM', title: 'Speedboat Departure to Koh Tao', description: 'Scenic 45-minute cruise across the Gulf with views of Sail Rock.' },
      { time: '09:15 AM', title: 'Shark Bay / Mango Bay Snorkeling', description: 'First deep-water snorkeling session in crystalline turquoise waters.' },
      { time: '11:45 AM', title: 'Koh Nang Yuan Island Exploration', description: 'Climb to the famous viewpoint, swim at the Japanese Garden reef, and relax.' },
      { time: '01:15 PM', title: 'Beachside Thai Buffet Lunch', description: 'Enjoy authentic local cuisine at a shaded beach restaurant.' },
      { time: '02:30 PM', title: 'Hin Wong Bay Coral Reef Exploration', description: 'Final snorkel session exploring soft corals and large schools of fish.' },
      { time: '04:30 PM', title: 'Return to Koh Phangan', description: 'Arrival back at Thong Sala / Chaloklum and transfer to your resort.' }
    ],
    hero_image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1600&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80'
    ],
    suitable_for: ['Snorkelers', 'Couples', 'Families', 'Nature Enthusiasts']
  },
  {
    id: 't-4',
    name: 'Ang Thong National Marine Park Expedition',
    name_th: 'ทัวร์อุทยานแห่งชาติหมู่เกาะอ่างทอง',
    slug: 'ang-thong',
    category: 'Nature & Wildlife',
    boat_type: '36ft Offshore Speedboat with Kayak Rack',
    boat_type_th: 'เรือสปีดโบ๊ท 36 ฟุต พร้อมแร็คบรรทุกเรือคายัค',
    boat_specs: 'Twin 250HP (500 HP) · Ocean Kayaks Included · Shaded Salon · Swim Platform',
    boat_specs_th: 'เครื่องยนต์คู่ 250HP (รวม 500 แรงม้า) · บรรทุกเรือคายัคทะเลในตัว · มีหลังคาบังแดด · บันไดขึ้น-ลงสะดวก',
    short_description: 'Explore 42 limestone islands, emerald lagoons, sea caves, sea kayaking, and panoramic mountain summit viewpoints on our twin-engine expedition boat.',
    short_description_th: 'สำรวจหมู่เกาะหินปูน 42 เกาะ ทะเลในมรกต พายคายัคลอดถ้ำ และปีนสู่จุดชมวิวผาจันทร์จรัส ด้วยเรือสปีดโบ๊ท 2 เครื่องยนต์พร้อมคายัคครบชุด',
    description: 'Step into a prehistoric paradise made famous by Alex Garland\'s "The Beach". Ang Thong National Marine Park is an archipelago of 42 protected limestone islands rising dramatically from turquoise shallows. Climb the wooden stairway to the mysterious saltwater Emerald Lake (Talay Nai), paddle sea kayaks along soaring karst cliffs, and hike to the breathtaking 500m viewpoint over the entire park.',
    description_th: 'เดินทางสู่หมู่เกาะอ่างทอง ดินแดนแห่งเกาะหินปูน 42 เกาะกลางอ่าวไทย ขึ้นชมทะเลใน (Emerald Lake) ทะเลสาบน้ำเค็มสีมรกตกลางหุบเขา พายเรือคายัคสำรวจแนวหน้าผาและถ้ำทะเล และเดินป่าสู่จุดชมวิวผาจันทร์จรัสที่มองเห็นหมู่เกาะเรียงรายสุดสายตา',
    duration: 'Full Day (7.5 Hours)',
    duration_th: 'เต็มวัน (7.5 ชั่วโมง)',
    price_from: 2800,
    max_guests: 16,
    featured: true,
    active: true,
    rating: 4.9,
    review_count: 180,
    departure_location: 'Thong Sala Pier',
    departure_times: ['08:30 AM'],
    included: [
      'High-Speed Twin-Engine Speedboat (500 HP)',
      'Double Ocean Kayaks, Paddles & Dry Bags On Board',
      'Full Snorkeling Equipment & Life Jackets',
      'Delicious Thai Buffet Lunch & Fresh Tropical Fruits',
      'Park Certified Tour Guide',
      'Hotel Roundtrip Transfers'
    ],
    included_th: [
      'เรือสปีดโบ๊ท 2 เครื่องยนต์ 500 แรงม้า วิ่งเร็ว นั่งสบาย',
      'เรือคายัคคู่ ไม้พาย และกระเป๋ากันน้ำบนเรือ',
      'อุปกรณ์ดำน้ำตื้นและเสื้อชูชีพครบชุด',
      'อาหารกลางวันแบบบุฟเฟต์ไทยและผลไม้สด',
      'ไกด์นำเที่ยวที่ผ่านการรับรองจากอุทยานฯ',
      'รถรับ-ส่งจากที่พักถึงท่าเรือ'
    ],
    excluded: [
      'National Park Entrance Fee (Adult ฿300 / Child ฿150 payable on site)',
      'Personal Towels'
    ],
    highlights: [
      'Twin-engine 500HP vessel equipped with on-board ocean kayaks',
      'Viewpoint hike overlooking the 42-island archipelago',
      'Emerald Lake (Talay Nai) inland marine crater lagoon',
      'Sea kayaking through limestone sea tunnels and archways',
      'White powder beach relaxation at Koh Wao and Koh Mae Ko'
    ],
    highlights_th: [
      'เรือสปีดโบ๊ท 500 แรงม้า พร้อมเรือคายัคทะเลในตัว',
      'จุดชมวิวผาจันทร์จรัส มองเห็นเกาะทั้ง 42 เกาะ',
      'ทะเลใน (Talay Nai) ทะเลสาบน้ำเค็มมรกตกลางเกาะ',
      'พายเรือคายัคลอดซุ้มหินปูนและถ้ำธรรมชาติ',
      'พักผ่อนบนหาดทรายขาวบริสุทธิ์ของเกาะวัวตาหลับและเกาะแม่เกาะ'
    ],
    itinerary: [
      { time: '08:00 AM', title: 'Pickup & Pier Briefing', description: 'Check-in with coffee, light toast, and park briefing.' },
      { time: '08:45 AM', title: 'Speedboat Cruise to Ang Thong', description: 'Cruise across open waters into the northern islands of the park.' },
      { time: '09:45 AM', title: 'Snorkeling at Koh Wao / Koh Tay Plaao', description: 'Crystal-clear reef snorkeling with abundant marine life.' },
      { time: '11:15 AM', title: 'Koh Mae Ko & Emerald Lake', description: 'Ascend the stairways to view the enclosed turquoise lagoon.' },
      { time: '12:30 PM', title: 'Beach Buffet Lunch on Koh Wua Ta Lap', description: 'Enjoy lunch under tropical coconut palms.' },
      { time: '01:30 PM', title: 'Sea Kayaking & Viewpoint Hike', description: 'Kayak along towering cliff walls or challenge the 500m viewpoint hike.' },
      { time: '03:45 PM', title: 'Return Journey to Koh Phangan', description: 'Relaxing boat ride back to Thong Sala.' }
    ],
    hero_image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1600&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1000&q=80'
    ],
    suitable_for: ['Hikers', 'Kayakers', 'Families', 'Adventure Travelers', 'Photographers']
  },
  {
    id: 't-5',
    name: 'Deep Sea & Sport Fishing Adventure',
    name_th: 'ทริปตกปลาทะเลและตกหมึก (เรือเล็ก & สปีดโบ๊ท VIP)',
    slug: 'fishing',
    category: 'Angling & Sport',
    boat_type: 'Small Coastal Fishing Boat / 2-Engines Speedboat (with Bathroom)',
    boat_type_th: 'เรือตกปลาลำเล็ก / เรือสปีดโบ๊ท 2 เครื่องยนต์ (มีห้องน้ำในตัว)',
    boat_specs: 'Live Bait Well · Rod Holders · High-Quality Shimano/Penn Reels · Snorkel Gear · Soft Drinks · Ice Box',
    boat_specs_th: 'บ่อขังเหยื่อเป็น · คันเบ็ดและรอก Shimano/Penn · หน้ากากดำน้ำ · น้ำอัดลมเย็น · ถังน้ำแข็งแช่ปลา',
    short_description: 'Authentic local fishing trips. Choose our Small Boat (฿3,500 for 1-2 pax, or ฿1,500/person for 3+ pax) or Private 2-Engine Speedboat with bathroom.',
    short_description_th: 'ทริปตกปลาทะเลกับไต๋เรือท้องถิ่น เลือกได้ทั้ง เรือลำเล็ก 3 ชม. (1-2 ท่าน ฿3,500 / 3 ท่านขึ้นไป ฿1,500/ท่าน) หรือ เรือสปีดโบ๊ท 2 เครื่องยนต์มีห้องน้ำ (3 ชม. ฿9,500 / 5 ชม. ฿12,000 / เต็มวัน ฿28,000)',
    description: 'Experience authentic fishing around Koh Phangan with generational local captains. We offer two great options: (1) Small Coastal Fishing Boat (3 Hours) at only ฿3,500 for 1 or 2 guests, and just ฿1,500 per person for 3+ guests; or (2) Private 2-Engine Speedboat equipped with onboard marine bathroom (3h ฿9,500 / 5h ฿12,000 / One Day ฿28,000). Soft drinks, full fishing tackle, fresh bait, and snorkeling masks are all included. We even prepare your catch as fresh sashimi on board or pack it on ice for you!',
    description_th: 'สัมผัสการตกปลาทะเลกับไต๋เรือผู้เชี่ยวชาญ มีให้เลือก 2 แบบ: (1) เรือลำเล็ก (3 ชั่วโมง) เหมาะสำหรับสายชิล เริ่มต้น 1-2 คนเพียง 3,500 บาท (หากมา 3 คนขึ้นไปคิดรายหัวเพียงท่านละ 1,500 บาท); หรือ (2) เรือสปีดโบ๊ท 2 เครื่องยนต์พร้อมห้องน้ำในตัว (3 ชม. ฿9,500 / 5 ชม. ฿12,000 / เต็มวัน ฿28,000) รวมน้ำอัดลม คันเบ็ด เหยื่อสด และอุปกรณ์ดำน้ำครบครัน',
    duration: '3 Hr / 5 Hr / One Day',
    duration_th: '3 ชม. / 5 ชม. / เต็มวัน',
    price_from: 1500,
    max_guests: 8,
    featured: false,
    active: true,
    rating: 4.9,
    review_count: 84,
    departure_location: 'Thong Sala Pier / Chaloklum Fishing Pier',
    departure_times: ['08:00 AM (Morning)', '01:30 PM (Afternoon)', '05:30 PM (Sunset / Night Squid)'],
    included: [
      'Quality Shimano & Penn Rods, Reels, Rigs & Fresh Bait',
      'Soft Drinks & Chilled Drinking Water',
      'Quality Snorkeling Equipment (Masks & Snorkels)',
      'Life Jackets for All Passengers',
      'Local Experienced Captain & Fishing Mate',
      'Fresh Catch Preparation (Sashimi on board or Ice-packed)'
    ],
    included_th: [
      'คันเบ็ดและรอกคุณภาพสูง Shimano / Penn พร้อมเหยื่อสดครบชุด',
      'น้ำอัดลมและน้ำดื่มเย็นฉ่ำตลอดทริป',
      'อุปกรณ์ดำน้ำตื้นคุณภาพดี (หน้ากาก & ท่อหายใจ)',
      'เสื้อชูชีพสำหรับผู้โดยสารทุกขนาด',
      'ไต๋เรือและผู้ช่วยมืออาชีพดูแลประกบข้างตลอดทริป',
      'บริการแล่ซาชิมิสดบนเรือ หรือแช่น้ำแข็งนำกลับที่พัก'
    ],
    excluded: [
      'National Park and Island Admission Fees (if entering protected zones)',
      'Land Transfers to / from the Pier'
    ],
    highlights: [
      'Small Fishing Boat (3h): 1-2 Pax = ฿3,500 total · 3+ Pax = ฿1,500 / person',
      '2-Engine Speedboat (3h w/ WC): ฿9,500 (Private boat up to 8 pax)',
      '2-Engine Speedboat (5h w/ WC): ฿12,000 (Private boat up to 8 pax)',
      '2-Engine Speedboat (One Day w/ WC): ฿28,000 (Private boat up to 8 pax)',
      'Includes soft drinks, snorkeling masks, tackle, and live bait',
      'Catch Barracuda, Queenfish, Red Snapper, Grouper, and Trevally'
    ],
    highlights_th: [
      'เรือลำเล็ก (3 ชม.): เริ่มต้น 1-2 ท่าน ฿3,500 · 3 ท่านขึ้นไป ท่านละ ฿1,500',
      'สปีดโบ๊ท 2 เครื่องยนต์ (3 ชม. มีห้องน้ำ): ฿9,500 (เหมาลำไม่เกิน 8 ท่าน)',
      'สปีดโบ๊ท 2 เครื่องยนต์ (5 ชม. มีห้องน้ำ): ฿12,000 (เหมาลำไม่เกิน 8 ท่าน)',
      'สปีดโบ๊ท 2 เครื่องยนต์ (เต็มวัน มีห้องน้ำ): ฿28,000 (เหมาลำไม่เกิน 8 ท่าน)',
      'รวมน้ำอัดลม อุปกรณ์ดำน้ำตื้น คันเบ็ด และเหยื่อสดครบชุด',
      'ตกปลาสาก ปลากะพงแดง ปลาเก๋า ปลาสีกุน และปลากระมง'
    ],
    pricing_tiers: [
      {
        model: 'Small Fishing Boat (3 Hours)',
        model_th: 'เรือตกปลาลำเล็ก (3 ชั่วโมง)',
        specs: '1-2 Guests ฿3,500 total · 3+ Guests ฿1,500/person · Snorkel gear & soft drinks',
        col1_title: '1-2 Guests',
        col2_title: '3+ Guests (Per Pax)',
        price_30min: 3500,
        price_60min: 1500,
        note: 'Best Value / คิดรายหัว',
      },
      {
        model: '2-Engine Speedboat (3 Hours w/ WC)',
        model_th: 'เรือสปีดโบ๊ท 2 เครื่องยนต์ (3 ชั่วโมง มีห้องน้ำ)',
        specs: 'Private 2-engine boat with toilet · Up to 8 pax · Soft drinks & gear included',
        col1_title: 'Duration',
        col2_title: 'Total Boat Rate',
        price_30min: 3,
        price_60min: 9500,
        note: 'Private Speedboat',
      },
      {
        model: '2-Engine Speedboat (5 Hours w/ WC)',
        model_th: 'เรือสปีดโบ๊ท 2 เครื่องยนต์ (5 ชั่วโมง มีห้องน้ำ)',
        specs: 'Extended 5h trip · Trolling & deep reef marks · Up to 8 pax',
        col1_title: 'Duration',
        col2_title: 'Total Boat Rate',
        price_30min: 5,
        price_60min: 12000,
        note: 'Most Popular',
      },
      {
        model: '2-Engine Speedboat (One Day w/ WC)',
        model_th: 'เรือสปีดโบ๊ท 2 เครื่องยนต์ (เต็มวัน One Day มีห้องน้ำ)',
        specs: 'Grand day offshore expedition · Distant channels & trophy marks · Up to 8 pax',
        col1_title: 'Duration',
        col2_title: 'Total Boat Rate',
        price_30min: 8,
        price_60min: 28000,
        note: 'Full Day Expedition',
      },
    ],
    itinerary: [
      { time: '08:00 AM / 01:30 PM / 05:30 PM', title: 'Boarding at Pier', description: 'Meet the captain and setup tackle at the departure pier.' },
      { time: '+30 mins', title: 'Trolling for Pelagic Species', description: 'Deploy deep lures for King Mackerel, Barracuda, and Queenfish.' },
      { time: '+1.5 hours', title: 'Bottom Reef Fishing', description: 'Drop fresh bait over secret coral marks for Grouper and Snapper (or squid jigging at sunset).' },
      { time: 'Finish', title: 'Catch Packed on Ice & Return', description: 'Return to pier with your cleaned fresh catch on ice.' }
    ],
    hero_image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80'
    ],
    suitable_for: ['Anglers', 'Beginners', 'Families', 'Food Lovers']
  },
  {
    id: 't-6',
    name: 'Private VIP Speedboat Charter',
    name_th: 'เหมาลำเรือสปีดโบ๊ทส่วนตัว VIP',
    slug: 'speedboat',
    category: 'VIP & Private Charters',
    boat_type: 'Private Fleet: 1 Engine (8p) / 2 Engines (16p WC) / 2 Engines (8p VIP)',
    boat_type_th: 'กองเรือเหมาลำ: 1 เครื่อง (8 ท่าน) / 2 เครื่อง (16 ท่าน มีห้องน้ำ) / 2 เครื่อง (8 ท่าน VIP)',
    boat_specs: 'Yamaha Engines · Shaded Seating · Marine Bathroom (on 2-Engine models) · Snorkel Gear · Soft Drinks',
    boat_specs_th: 'เครื่องยนต์ Yamaha · หลังคาบังแดด · มีห้องน้ำในตัว (รุ่น 2 เครื่องยนต์) · หน้ากากดำน้ำ · น้ำอัดลม',
    short_description: 'Exclusive private speedboat charters to Koh Tao, Angthong Marine Park, Koh Phaluai, Sail Rock, Around Phangan or Koh Samui transfer.',
    short_description_th: 'บริการเหมาลำเรือสปีดโบ๊ทส่วนตัวสู่เกาะเต่า หมู่เกาะอ่างทอง เกาะพะลวย หินใบ รอบเกาะพะงัน หรือรับ-ส่งเกาะสมุย',
    description: 'Experience the Gulf of Thailand completely on your own schedule with our private speedboat charter fleet. Choose from 3 vessel categories: 1 Engine (8 Pax), 2 Engines with Bathroom (16 Pax), or 2 Engines with Bathroom (8 Pax VIP). Sail to world-class destinations including Koh Tao & Nangyuan, Angthong Marine Park, Koh Phaluai, Hin Bai (Sail Rock), Around Koh Phangan (5h), Koh Tae & Koh Mah, or Sunset Cruise. Includes soft drinks, premium snorkeling gear, and life jackets.',
    description_th: 'สัมผัสประสบการณ์ท่องเที่ยวทางทะเลแบบไร้ขีดจำกัดด้วยเรือสปีดโบ๊ทเหมาลำส่วนตัว มีเรือให้เลือก 3 สเปก: 1 เครื่องยนต์ (8 ท่าน), 2 เครื่องยนต์พร้อมห้องน้ำ (16 ท่าน) และ 2 เครื่องยนต์พร้อมห้องน้ำ (8 ท่าน VIP) เดินทางสู่เกาะเต่า & เกาะนางยวน, อุทยานฯ หมู่เกาะอ่างทอง, เกาะพะลวย, หินใบ, รอบเกาะพะงัน, เกาะแต้ & เกาะม้า, ชมพระอาทิตย์ตก หรือรับ-ส่งเกาะสมุย/ดอนสัก',
    duration: 'Custom (Half Day / 5 Hours / Full Day)',
    duration_th: 'ปรับแต่งได้ (ครึ่งวัน / 5 ชั่วโมง / เต็มวัน)',
    price_from: 6000,
    max_guests: 16,
    featured: true,
    active: true,
    rating: 5.0,
    review_count: 142,
    departure_location: 'Thong Sala Pier / Chaloklum Pier / Any Pier on Koh Phangan',
    departure_times: ['Flexible (Any time from 07:00 AM to 05:00 PM)'],
    included: [
      '100% Exclusive Private Speedboat for Your Group',
      'Licensed Captain & Dedicated Boat Crew',
      'Soft Drinks & Chilled Drinking Water',
      'Quality Snorkeling Equipment (Masks & Snorkels)',
      'Life Jackets for All Passenger Sizes',
      'Full Marine Passenger Insurance'
    ],
    included_th: [
      'เรือสปีดโบ๊ทส่วนตัว 100% สำหรับกลุ่มของคุณเท่านั้น',
      'กัปตันผู้มีใบอนุญาตและลูกเรือคอยบริการตลอดทริป',
      'น้ำอัดลมและน้ำดื่มเย็นฉ่ำตลอดทริป',
      'อุปกรณ์ดำน้ำตื้นเกรดพรีเมียม (หน้ากาก & ท่อหายใจ)',
      'เสื้อชูชีพสำหรับผู้โดยสารทุกขนาด',
      'ประกันภัยอุบัติเหตุทางน้ำตามกฎหมาย'
    ],
    excluded: [
      'National Park and Island Admission Fees (Angthong: Adult ฿300/Child ฿150; Koh Nangyuan: Adult ฿250/Child ฿120)',
      'Land Transfers to / from the Pier',
      'Lunch (Optional add-on available for Koh Tao and Angthong)'
    ],
    highlights: [
      'Koh Tao & Nangyuan: ฿20,000 - ฿28,000 (1-2 Engines · With/Without Lunch)',
      'Angthong Marine Park: ฿17,000 - ฿25,000 (1-2 Engines · With/Without Lunch)',
      'Around Koh Phangan (5 hr): ฿14,000 (1 Engine) · ฿18,000-฿20,000 (2 Engines w/ WC)',
      'Sunset Cruise / Koh Tae & Koh Mah: ฿12,000 - ฿15,000',
      'Koh Samui Transfer / Charter: ฿6,000 - ฿8,000'
    ],
    highlights_th: [
      'เกาะเต่า & นางยวน: ฿20,000 - ฿28,000 (1-2 เครื่องยนต์ · รวม/ไม่รวมอาหาร)',
      'หมู่เกาะอ่างทอง: ฿17,000 - ฿25,000 (1-2 เครื่องยนต์ · รวม/ไม่รวมอาหาร)',
      'รอบเกาะพะงัน (5 ชม.): ฿14,000 (1 เครื่อง) · ฿18,000-฿20,000 (2 เครื่อง มีห้องน้ำ)',
      'Sunset Cruise / เกาะแต้ & เกาะม้า: ฿12,000 - ฿15,000',
      'รับ-ส่งเกาะสมุย (Charter/Transfer): ฿6,000 - ฿8,000'
    ],
    pricing_tiers: [
      {
        model: '1 Engine for 8 Paxs',
        model_th: 'เรือ 1 เครื่องยนต์ (8 ท่าน)',
        specs: 'Single Yamaha 250HP · Shaded Seating · Snorkel Gear & Soft Drinks',
        col1_title: 'Koh Samui',
        col2_title: 'Koh Tao (w/ Lunch)',
        price_30min: 6000,
        price_60min: 22000,
        note: 'Best Value for Small Groups',
      },
      {
        model: '2 Engines for 16 Paxs (Has Bathroom)',
        model_th: 'เรือ 2 เครื่องยนต์ (16 ท่าน มีห้องน้ำ)',
        specs: 'Twin Yamaha 500HP · Marine Bathroom · Shaded Cabin · Fast & Stable',
        col1_title: 'Koh Samui',
        col2_title: 'Koh Tao (w/ Lunch)',
        price_30min: 8000,
        price_60min: 28000,
        note: 'Most Popular for Large Groups',
      },
      {
        model: '2 Engines for 8 Paxs (Has Bathroom)',
        model_th: 'เรือ 2 เครื่องยนต์ (8 ท่าน มีห้องน้ำ)',
        specs: 'Twin Yamaha 500HP · Marine Bathroom · VIP Private Comfort · Fast & Smooth',
        col1_title: 'Koh Samui',
        col2_title: 'Koh Tao (w/ Lunch)',
        price_30min: 7000,
        price_60min: 26000,
        note: 'VIP Fast Cruiser',
      },
    ],
    itinerary: [
      { time: 'Flexible', title: 'Departure from Pier', description: 'Board your private vessel at your preferred morning or afternoon departure time.' },
      { time: 'Custom', title: 'Tailored Island Exploration', description: 'Cruise to your chosen destinations — Koh Tao, Angthong, Around Phangan, or Sail Rock.' },
      { time: 'Custom', title: 'Private Sandbar & Reef Anchorage', description: 'Anchor at quiet lagoons for snorkeling, swimming, and relaxing.' },
      { time: 'Finish', title: 'Scenic Return Voyage', description: 'Relaxing boat ride back to the harbor.' }
    ],
    hero_image: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d17?auto=format&fit=crop&w=1600&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80'
    ],
    suitable_for: ['Couples', 'VIP Travelers', 'Families', 'Private Groups', 'Celebrations']
  }
];

