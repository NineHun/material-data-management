// src/constants/sarItems.js

// Data Paket SR
export const SR_PACKAGES = {
  sr_1_phasa_sdes_1: {
    name: "Pasang Baru SDES - 1 (SR 1 Phasa)",
    price: 576550,
    materials: [
      { name: "Jasa Kegiatan", qty: 1, unit: "Lot" },
      { name: "Pole Bracket 3-6\"", qty: 1, unit: "Bh" },
      { name: "Service wedge clamp 2/4 x 6/10 mm", qty: 2, unit: "Bh" },
      { name: "Strainhook / ekor babi", qty: 1, unit: "Bh" },
      { name: "Cable suport (508/U/2009)", qty: 5, unit: "Bh" },
      { name: "Conn. press AL/AL type 10-16 mm2 / 50-70 mm2 + Scoot + Cover", qty: 2, unit: "Bh" },
      { name: "MTR;kWH E-PR;;1P;230V;5-60A;1;;2W", qty: 1, unit: "Bh" },
      { name: "MCB;230/400V;1P; 4-25A;50Hz;", qty: 1, unit: "Bh" },
      { name: "CABLE PWR;NFA2X;2X10mm2;0.6/1kV;OH", qty: 30, unit: "mtr" },
    ]
  },
  sr_1_phasa_sdes_2: {
    name: "Pasang Baru SDES - 2 (SR 1 Phasa)",
    price: 560550,
    materials: [
      { name: "Jasa Kegiatan", qty: 1, unit: "Lot" },
      { name: "Service wedge clamp 2/4 x 6/10 mm", qty: 2, unit: "Bh" },
      { name: "Strainhook / ekor babi", qty: 1, unit: "Bh" },
      { name: "Cable suport (508/U/2009)", qty: 5, unit: "Bh" },
      { name: "Conn. press AL/AL type 10-16 mm2 / 10-16 mm2 + Scoot + Cover", qty: 2, unit: "Bh" },
      { name: "MTR;kWH E-PR;;1P;230V;5-60A;1;;2W", qty: 1, unit: "Bh" },
      { name: "MCB;230/400V;1P; 4-25A;50Hz;", qty: 1, unit: "Bh" },
      { name: "CABLE PWR;NFA2X;2X10mm2;0.6/1kV;OH", qty: 30, unit: "mtr" },
    ]
  },
  sr_3_phasa: {
    name: "SR 3 Phasa",
    price: 805362,
    materials: [
      { name: "Line Tap Connector (type press) 6-25/35-70 mm + heatshrink", qty: 4, unit: "BH" },
      { name: "Cable Power ; NFA2X ; 4 x 16 mm", qty: 25, unit: "mtr" },
      { name: "Service wedge clamp 4/4 x 10/16 mm", qty: 2, unit: "BH" },
      { name: "Pole Bracket 3 - 4\" lengkap Bolt & Nut - HDG", qty: 1, unit: "BH" },
    ]
  }
};

// Data Paket APP
export const APP_PACKAGES = {
  app_1_phasa: {
    name: "1 Phasa",
    price: 7792560,
    materials: [
      { name: "MTR;kWH E-PR;;1P;230V;5-60A;1;;2W", qty: 1, unit: "bh" },
      { name: "MCB;230/400V;1P; 4-25A;50Hz", qty: 1, unit: "bh" },
      { name: "Box APP 1 Phasa", qty: 1, unit: "BH" },
    ]
  },
  app_3_phasa_langsung: {
    name: "3 Phasa Pengukuran Langsung",
    price: 5998246,
    materials: [
      { name: "Jasa Perakitan APP", qty: 1, unit: "Set" },
      { name: "NYAF / NYA 2,5 mm² ( SPLN )", qty: 3, unit: "Mtr" },
      { name: "kWh m 3 phs. 220/380 V - 20/60 A ST Clas 1 Elektronik", qty: 1, unit: "Set" },
      { name: "-Pelapisan NYAF dengan Timah solder + pasta", qty: 1, unit: "BH" },
      { name: "MCB 3 phs. 230 V - 10 A s/d 50 A", qty: 1, unit: "BH" },
      { name: "Baut mata", qty: 1, unit: "BH" },
      { name: "Klem kabel/Cable suport (508/u/2009)", qty: 5, unit: "BH" },
      { name: "Bolt & Nut 3/16 x 0,5\"", qty: 3, unit: "BH" },
      { name: "Bolt & Nut M.16 x 120 - HDG", qty: 2, unit: "BH" },
      { name: "Kawat Segel @ 15 cm", qty: 7, unit: "Bh" },
      { name: "Timah Segel", qty: 7, unit: "Bh" },
      { name: "OA Kast type III lengkap cat powder coating (Box App)", qty: 1, unit: "BH" },
    ]
  },
  app_3_phasa_tidak_langsung: {
    name: "3 Phasa Pengukuran Tidak Langsung",
    price: 9586030,
    materials: [
      { name: "MTR;KWH E; 3P;230/400V; 5-10A; 1; 4W", qty: 1, unit: "bh" },
      { name: "MCCB 63-300 A, 18 kA, 3 Phs (Fixed)", qty: 1, unit: "bh" },
      { name: "CT - TR Class 0,5S", qty: 3, unit: "bh" },
      { name: "Modem", qty: 1, unit: "bh" },
      { name: "Box APP 3 Phasa Pengukuran Tidak Langsung", qty: 1, unit: "BH" },
    ]
  }
};

// Legacy items untuk backward compatibility
export const SAR_ITEMS = [
  // --------- Material SR ---------
  // Konduktor
  {
    id: 1,
    name: "NFA 2X-T 4 x 10 mm²",
    unit: "ms",
    priceMaterial: 150000,
    priceJasa: 50000,
    category: "sr",
    subCategory: "konduktor",
  },
  // Phasa SR
  {
    id: 2,
    name: "SR 1 Phasa",
    unit: "Set",
    priceMaterial: 200000,
    priceJasa: 100000,
    category: "sr",
    subCategory: "phasa",
  },
  {
    id: 3,
    name: "SR 3 Phasa",
    unit: "Set",
    priceMaterial: 400000,
    priceJasa: 200000,
    category: "sr",
    subCategory: "phasa",
  },

  // --------- Material APP ---------
  // Phasa APP
  {
    id: 101,
    name: "1 Phasa",
    unit: "set",
    priceMaterial: 300000,
    priceJasa: 150000,
    category: "app",
    subCategory: "phasa",
  },
  {
    id: 102,
    name: "3 Phasa Pengukuran Langsung",
    unit: "set",
    priceMaterial: 500000,
    priceJasa: 250000,
    category: "app",
    subCategory: "phasa",
  },
  {
    id: 103,
    name: "3 Phasa Pengukuran Tidak Langsung",
    unit: "set",
    priceMaterial: 600000,
    priceJasa: 300000,
    category: "app",
    subCategory: "phasa",
  },
];