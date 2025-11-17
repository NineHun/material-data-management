// src/constants/dayaOptions.js

export const ULP_OPTIONS = [
  "PASURUAN KOTA",
  "GONDANG WETAN",
  "GRATI",
  "BANGIL",
  "PANDAAN",
  "PRIGEN",
  "PROBOLINGGO",
  "KRAKSAAN",
  "SUKOREJO",
  "PASURUAN, GONDANGWETAN, GRATI",
  "BANGIL, PANDAAN, PRIGEN, SUKOREJO",
  "PROBOLINGGO KRAKSAAN",
];


export const DAYA_OPTIONS = [
  {
    golongan: "R-1/TR",
    batas: [
      { label: "0 – 450 VA", value: "0-450", min: 0, max: 450, biaya: 169 },
      { label: "451 – 900 VA", value: "451-900", min: 451, max: 900, biaya: 274 },
      { label: "901 – 1.300 VA", value: "901-1300", min: 901, max: 1300, biaya: 1444.7 },
      { label: "1.301 – 2.200 VA", value: "1301-2200", min: 1301, max: 2200, biaya: 1444.7 },
      { label: "2.201 VA – 5.500 VA", value: "2201-5500", min: 2201, max: 5500, biaya: 1444.7 },
    ],
  },
  {
    golongan: "R-1M/TR",
    batas: [
      { label: "451 – 900 VA", value: "451-900", min: 451, max: 900, biaya: 1352 },
    ],
  },
  {
    golongan: "R-3/TR",
    batas: [
      { label: "> 5.501 VA", value: "5501-up", min: 5501, max: 999999, biaya: 1444.7 },
    ],
  },
  {
    golongan: "B-1/TR",
    batas: [
      { label: "0 – 450 VA", value: "0-450", min: 0, max: 450, biaya: 254 },
      { label: "451 – 900 VA", value: "451-900", min: 451, max: 900, biaya: 420 },
      { label: "901 – 1.300 VA", value: "901-1300", min: 901, max: 1300, biaya: 966 },
      { label: "1.301 – 5.500 VA", value: "1301-5500", min: 1301, max: 5500, biaya: 1100 },
    ],
  },
  {
    golongan: "B-2/TR",
    batas: [
      { label: "5.501 VA – 200 kVA", value: "5501-200000", min: 5501, max: 200000, biaya: 1444.7 },
    ],
  },
  {
    golongan: "B-3/TM",
    batas: [
      { label: "> 200 kVA", value: "200001-up", min: 200001, max: 999999, biaya: 1114.74 },
    ],
  },
  {
    golongan: "I-1/TR",
    batas: [
      { label: "0 – 450 VA", value: "0-450", min: 0, max: 450, biaya: 160 },
      { label: "450 – 900 VA", value: "451-900", min: 451, max: 900, biaya: 315 },
      { label: "900 – 1.300 VA", value: "901-1300", min: 901, max: 1300, biaya: 930 },
      { label: "1.301 – 2.200 VA", value: "1301-2200", min: 1301, max: 2200, biaya: 960 },
      { label: "3.500 – 14.000 VA", value: "3500-14000", min: 3500, max: 14000, biaya: 1112 },
    ],
  },
  {
    golongan: "I-2/TR",
    batas: [
      { label: "14.001 – 200 kVA", value: "14001-200000", min: 14001, max: 200000, biaya: 972 },
    ],
  },
  {
    golongan: "I-3P/TM",
    batas: [
      { label: "> 200 kVA", value: "200001-up", min: 200001, max: 999999, biaya: 1114.74 },
    ],
  },
  {
    golongan: "I-3/TM",
    batas: [
      { label: "> 200 kVA", value: "200001-up", min: 200001, max: 999999, biaya: 1114.74 },
    ],
  },
  {
    golongan: "I-4/TT",
    batas: [
      { label: "> 2.000 kVA", value: "2001-up", min: 2001, max: 999999, biaya: 996.74 },
    ],
  },
  {
    golongan: "P-1/TR",
    batas: [
      { label: "0 – 450 VA", value: "0-450", min: 0, max: 450, biaya: 575 },
      { label: "451 – 900 VA", value: "451-900", min: 451, max: 900, biaya: 600 },
      { label: "1.300 VA", value: "1300", min: 1300, max: 1300, biaya: 1049 },
      { label: "2.200 – 5.500 VA", value: "2200-5500", min: 2200, max: 5500, biaya: 1076 },
      { label: "5.501 – 200 kVA", value: "5501-200000", min: 5501, max: 200000, biaya: 1444.7 },
    ],
  },
  {
    golongan: "P-2/TR",
    batas: [
      { label: "> 200 kVA", value: "200001-up", min: 200001, max: 999999, biaya: 1035.78 },
    ],
  },
];
