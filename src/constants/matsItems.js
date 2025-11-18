// src/constants/matsItems.js

// Data Pole Supporter Packages
export const POLE_SUPPORTER_PACKAGES = {
  guy_wire_tr: {
    name: "Guy Wire TR",
    price: 1384057,
    materials: [
      { name: "Preformed Termination 35 mm (542/u/2009)", qty: 4, unit: "bh" },
      { name: "Galvanized Steel Wire 35 mm - HDG", qty: 12, unit: "meter" },
      { name: "Beton Block 400 x 400 x 100 - kotak", qty: 1, unit: "Set" },
      { name: "U - Bolt + Steel Plate TM/TR Bolt M.18 + 2 nut", qty: 1, unit: "Set" },
      { name: "Guy Wire Rod 5/8\" (15 mm) - 1.800 mm - TR", qty: 1, unit: "bh" },
      { name: "Single Guy Wire Band 9\" - (t = 6 mm x 35 mm) HDG TR lengkap Nut-HDG", qty: 1, unit: "bh" },
      { name: "Pipa Galvanized 3/4\" - 2 m (tebal= 1,6 mm) u/Pipa Pelindung", qty: 1, unit: "bh" },
      { name: "Guy Wire Timble (t=2,5 mm)", qty: 3, unit: "bh" },
      { name: "Turn Buckle TR 5/8\" (4000 kg) - TR - (t=33 mm, t=6 mm)", qty: 1, unit: "Set" },
      { name: "Wire Clip M10 (35 mm)", qty: 1, unit: "Set" },
      { name: "Bolt & Nut M.16 x 75 - HDG", qty: 4, unit: "bh" },
    ]
  },
  stroot_pole: {
    name: "Stroot Pole",
    price: 1062506,
    materials: [
      { name: "Single Guy", qty: 4, unit: "bh" },
      { name: "Bolt & Nut", qty: 11, unit: "bh" },
      { name: "Square Wa", qty: 2, unit: "bh" },
      { name: "Strut Tie 20", qty: 1, unit: "bh" },
      { name: "Single Arm", qty: 1, unit: "bh" },
      { name: "Strut Arm T", qty: 1, unit: "bh" },
    ]
  }
};

// Data Grounding Packages
export const GROUNDING_PACKAGES = {
  grounding_luar: {
    name: "Grounding Luar",
    price: 875119,
    materials: [
      { name: "Earthing Rod 16 mm - 1,5 m+clamp - TR- besi As, Electroplatting tembaga", qty: 1, unit: "bh" },
      { name: "AAAC - 70 sq mm", qty: 9, unit: "meter" },
      { name: "Insulated Tension Joint 70 mm", qty: 1, unit: "bh" },
      { name: "Terminal Lug 70 mm - Cu 1 Hole", qty: 2, unit: "bh" },
      { name: "Pipa Galvanized 3/4\" - 2 m (tebal= 1,6 mm) u/Pipa Pelindung", qty: 1, unit: "bh" },
      { name: "Stainless Steel Strip non magnetic", qty: 4, unit: "bh" },
      { name: "Stoping Buckle non magnetic", qty: 4, unit: "bh" },
      { name: "Link - HDG", qty: 4, unit: "bh" },
    ]
  },
  grounding_dalam: {
    name: "Grounding Dalam",
    price: 521098,
    materials: [
      { name: "Earthing Rod 16 mm - 1,5 m+clamp - TR- besi As, Electroplatting tembaga", qty: 1, unit: "bh" },
      { name: "AAAC - 70 sq mm", qty: 2, unit: "meter" },
      { name: "Line Tap Connector Press / CCO 50-70/50-70 mm BERINSULASI PITA", qty: 1, unit: "bh" },
      { name: "Terminal Lug 70 mm - Al 1 Hole", qty: 2, unit: "bh" },
      { name: "Terminal Lug 70 mm - Al/Cu 1 Hole", qty: 1, unit: "bh" },
      { name: "Bolt & Nut M.16 x 50 - HDG", qty: 2, unit: "bh" },
    ]
  }
};

// Data Pondasi Packages
export const PONDASI_PACKAGES = {
  pondasi_type_a: {
    name: "Pondasi type A (1 tiang)",
    price: 3331415,
    materials: [
      { name: "Pole Block Band 12\" - TM (557/u/2009)", qty: 3, unit: "Bh" },
      { name: "Pole block (504/U/2009)", qty: 3, unit: "Bh" },
    ]
  }
};

// Data Conductor Accessories Packages (Kumisan)
export const CONDUCTOR_ACCESSORIES_PACKAGES = {
  kumisan: {
    name: "Kumisan",
    price: 44360,
    materials: [
      { 
        name: "TC 3 x 50 + 1 x 35 sq mm (SPLN)", 
        qtyPerSet: 0.5, // 0.5 mtr per set
        unit: "mtr",
        itemId: 401 // ID dari MATS_ITEMS untuk Compression Joint Sleeve
      },
      { 
        name: "Line Tap Connector (type press) 35-70/35-70 mm + scoth", 
        qtyPerSet: 4, // 4 Bh per set
        unit: "Bh",
        itemId: 402 // ID dari MATS_ITEMS untuk Line Tap Connector
      },
    ]
  }
};

// Data Commissioning Package
export const COMMISSIONING_PACKAGE = {
  commissioning_test: {
    name: "Commissioning test JTR termasuk NIDI",
    price: 318710,
    materials: []
  }
};

// Data Pole Top Arrangement Package
export const POLE_TOP_ARRANGEMENT_PACKAGE = {
  pole_top_arrangement: {
    name: "Pole Top Arrangement",
    price: 754103,
    materials: [
      { name: "Small Angle Assembly (SAA) + komplit", qty: 2, unit: "Set" },
      { name: "Bundled End Assembly (BEA) - komplit", qty: 1, unit: "Set" },
      { name: "Dead End Assembly (DEA) - komplit", qty: 2, unit: "Set" },
      { name: "Dead End Tubes/Bundled End Protection + komplit", qty: 1, unit: "Set" },
    ]
  }
};

export const MATS_ITEMS = [
  // --------- Konduktor ---------
  {
    id: 1,
    name: "NFA2X-T;3x70 + 1x70 mm2",
    unit: "m",
    qty: 110,
    price: 56800,
    category: "konduktor",
  },
  // {
  //   id: 2,
  //   name: "Tiang Beton 11 Meter - 200 daN",
  //   unit: "Btg",
  //   price: 5002681,
  //   category: "perluasan",
  // },
  // {
  //   id: 3,
  //   name: "Tiang Beton 13 Meter - 350 daN",
  //   unit: "Btg",
  //   price: 7524890,
  //   category: "perluasan",
  // },
  // {
  //   id: 4,
  //   name: "MVTIC 3X150 + 1X95",
  //   unit: "MTR",
  //   price: 311500,
  //   category: "perluasan",
  // },
  // {
  //   id: 5,
  //   name: "NFA2XSEY‑T 3 x 240 + 1 x 95 mm² - CWS",
  //   unit: "MTR",
  //   price: 379000,
  //   category: "perluasan",
  // },
  // {
  //   id: 6,
  //   name: "AAACS150",
  //   unit: "MTR",
  //   price: 27000,
  //   category: "perluasan",
  // },
  // {
  //   id: 7,
  //   name: "AAAC - 70 sq mm",
  //   unit: "MTR",
  //   price: 13300,
  //   category: "perluasan",
  // },
  // {
  //   id: 8,
  //   name: "Insulator – Pin Post Insulator 20 kV; 12.5 kN – Porcelain (Tumpu)",
  //   unit: "BH",
  //   price: 223000,
  //   category: "perluasan",
  // },
  // {
  //   id: 9,
  //   name: "Insulator – Strain Insulator 20 kV lengkap (SIR) Porcelain (Tarik)",
  //   unit: "BH",
  //   price: 517950,
  //   category: "perluasan",
  // },
  // {
  //   id: 10,
  //   name: "Lightning Arrester 24 kV – 10 kA",
  //   unit: "BH",
  //   price: 630613,
  //   category: "perluasan",
  // },
  // {
  //   id: 11,
  //   name: "Polymer Cut Out Switch 24 kV + Fuse",
  //   unit: "BH",
  //   price: 1135000,
  //   category: "perluasan",
  // },
  // {
  //   id: 12,
  //   name: "NA2XSEYBY3X150",
  //   unit: "MTR",
  //   price: 413820,
  //   category: "perluasan",
  // },
  // {
  //   id: 13,
  //   name: "NA2XSEYBY; 3X240MM2; 20KV; UG",
  //   unit: "MTR",
  //   price: 516120,
  //   category: "perluasan",
  // },
  // {
  //   id: 14,
  //   name: "Termination OD 3 X 150 MM2",
  //   unit: "Set",
  //   price: 7462150,
  //   category: "perluasan",
  // },
  // {
  //   id: 15,
  //   name: "Termination ID 3 X 150 MM2",
  //   unit: "Set",
  //   price: 5842300,
  //   category: "perluasan",
  // },
  // {
  //   id: 16,
  //   name: "Disconnecting Switch 25,8 kV – 800 A out door (3 phasa)",
  //   unit: "BH",
  //   price: 16095000,
  //   category: "perluasan",
  // },
  // {
  //   id: 17,
  //   name: "Termination Out Door 3 X 240 + 1 x 95 mm u/MVTIC",
  //   unit: "Set",
  //   price: 6780000,
  //   category: "perluasan",
  // },
  // {
  //   id: 18,
  //   name: "NFA3X70 + 1x70",
  //   unit: "MTR",
  //   price: 56800,
  //   category: "perluasan",
  // },
  // --------- Tiang Beton ---------
  {
    id: 101,
    name: "Tiang beton 9 meter - 200 daN + E",
    unit: "Btg",
    qty: 3,
    price: 3676242,
    category: "tiang",
  },
  {
    id: 102,
    name: "Tiang Beton 11 Meter - 200 daN + E",
    unit: "Btg",
    qty: 1,
    price: 5002681,
    category: "tiang",
  },
  {
    id: 103,
    name: "Tiang Beton 13 Meter - 350 daN + E",
    unit: "Btg",
    qty: 1,
    price: 7524890,
    category: "tiang",
  },
  // {
  //   id: 102,
  //   name: "MCB; 230/400V; 1P; 4–25A; 50Hz",
  //   unit: "BH",
  //   price: 36000,
  //   category: "3phasa",
  // },
  // {
  //   id: 103,
  //   name: "Cable Power NFA2X; 2×10mm²; 0.6/1kV; OH",
  //   unit: "BH",
  //   price: 4480,
  //   category: "3phasa",
  // },
  // {
  //   id: 104,
  //   name: "NFA2X‑T; 3×35 + 35mm²; 0.6/1kV",
  //   unit: "Mtr",
  //   price: 32630,
  //   category: "3phasa",
  // },
  // {
  //   id: 105,
  //   name: "kWh meter 3 phs. 220/380 V – 20/60 A ST Clas 1 Elektronik",
  //   unit: "BH",
  //   price: 1633745,
  //   category: "3phasa",
  // },
  // {
  //   id: 106,
  //   name: "MCB 3 phs. 230 V – 10 A s/d 50 A",
  //   unit: "BH",
  //   price: 470518,
  //   category: "3phasa",
  // },
  // --------- Grounding ---------
  {
    id: 201,
    name: "Grounding Dalam",
    unit: "Set",
    price: 300700,
    category: "grounding",
  },
  {
    id: 202,
    name: "Grounding Luar",
    unit: "Set",
    price: 300700,
    category: "grounding",
  },
  // --------- Pondasi ---------
  {
    id: 301,
    name: "Pondasi type A (1 tiang) (91/u/2009)",
    unit: "Set",
    price: 716111,
    jasa: 3943361,
    category: "pondasi",
  },
  // --------- Conductor Accessories ---------
  {
    id: 401,
    name: "Compression Joint Sleeve Non Tension 70 mm - Al-Cu",
    unit: "Bh",
    price: 95510,
    category: "conductor_accessories",
  },
  {
    id: 402,
    name: "Line Tap Connector Press / CCO 50-70/50-70 mm BERINSULASI PITA",
    unit: "Bh",
    price: 41105,
    category: "conductor_accessories",
  },
  // {
  //   id: 302,
  //   name: 'Pole Block Band 12" - TM (557/u/2009)',
  //   unit: "Bh",
  //   price: 73984,
  //   jasa: 23061,
  //   category: "pondasi",
  // },
  // {
  //   id: 303,
  //   name: "Pole block (504/U/2009)",
  //   unit: "Bh",
  //   price: 149890,
  //   jasa: 75967,
  //   category: "pondasi",
  // },
];