// src/constants/expectedAnswerMats.js

/**
 * Kunci jawaban untuk pemilihan material.
 *
 * File ini mendefinisikan daftar material beserta jumlah yang benar
 * untuk kategori: Konduktor dan Tiang Beton. Digunakan oleh
 * komponen MaterialSelection saat mode cheat dijalankan.
 */

// KONDUKTOR — item dengan jumlah > 0
export const EXPECTED_KONDUKTOR = [
  { name: "Tiang beton 9 meter - 200 daN", qty: 3, unit: "Btg" },
  { name: "AAAC - 70 sq mm", qty: 9, unit: "mtr" },
  { name: "NFA3X70+1x70", qty: 116, unit: "mtr" },
];

// TIANG BETON — item dengan jumlah > 0
export const EXPECTED_TIANG_BETON = [
  { name: "NFA2X-T;3X35 + 35MM2;0.6/1KV", qty: 25, unit: "mtr" },
  { name: "kWh m 3 phs. 220/380 V - 20/60 A ST Clas 1 Elektronik", qty: 1, unit: "BH" },
  { name: "MCB 3 phs. 230 V - 10 A s/d 50 A", qty: 1, unit: "BH" },
];

const norm = (s) => String(s || "").toLowerCase().replace(/\s+/g, " ").trim();

export function checkMaterialAnswers({ konduktorRows = [], tiangRows = [], items = [] }) {
  // rows bentuknya [{ itemId, qty }]; items = MATS_ITEMS (punya {id,name})
  const byName = Object.fromEntries(items.map((it) => [norm(it.name), String(it.id)]));

  const normRows = (rows) =>
    rows
      .filter((r) => r.itemId && Number(r.qty) > 0)
      .map((r) => {
        const it = items.find((i) => String(i.id) === String(r.itemId));
        return { name: it?.name || "", qty: Number(r.qty) || 0 };
      });

  const sameSet = (userRows, expected) => {
    if (userRows.length !== expected.length) return false;
    const a = [...userRows].sort((x, y) => norm(x.name).localeCompare(norm(y.name)));
    const b = [...expected].sort((x, y) => norm(x.name).localeCompare(norm(y.name)));
    return a.every((r, i) => norm(r.name) === norm(b[i].name) && Number(r.qty) === Number(b[i].qty));
  };

  const okKonduktor = sameSet(normRows(konduktorRows), EXPECTED_KONDUKTOR);
  const okTiang = sameSet(normRows(tiangRows), EXPECTED_TIANG_BETON);

  return { okKonduktor, okTiang, okAll: okKonduktor && okTiang };
}
