import * as XLSX from "xlsx";

export function saveWorkbook({ user, formData, penyulangData, teknikData }) {
  const now = new Date();
  const wb = XLSX.utils.book_new();

  const aoa = [
    ["RINGKASAN SIBEA", ""],
    [
      "Tanggal Export",
      new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeStyle: "short" }).format(now),
    ],
    ["User", user?.name || "-"],
    [""],
    ["Jenis Permohonan", formData?.jenisPermohonan || "-"],
    ["Daya Lama", formData?.jenisPermohonan === "Pasang Baru" ? "-" : formData?.dayaLama || "-"],
    ["Daya Baru", formData?.dayaBaru || "-"],
    [""],
    ["Penyulang", penyulangData?.penyulang || "-"],
    [
      "Beban Penyulang",
      `${penyulangData?.bebanPenyulangPersen || "-"}% , ${penyulangData?.bebanPenyulangAmpere || "-"} A`,
    ],
    ["Gardu Induk", penyulangData?.garduInduk || "-"],
    [
      "Beban Trafo",
      `${penyulangData?.bebanTrafoPersen || "-"}% , ${penyulangData?.bebanTrafoAmpere || "-"} A`,
    ],
    [
      "Data Penyulang (Bulan/Tahun)",
      `${penyulangData?.penyulangBulan || "-"} ${penyulangData?.penyulangTahun || ""}`,
    ],
    ["Panjang Penyulang (kms)", penyulangData?.panjangPenyulangKms || "-"],
    ["I set (A)", penyulangData?.isetA || "-"],
    ["Trafo (MVA)", penyulangData?.trafoMVA || "-"],
    ["I set Trafo (A)", penyulangData?.isetTrafoA || "-"],
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet(aoa);
  XLSX.utils.book_append_sheet(wb, wsSummary, "Ringkasan");

  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet([formData || {}]), "Form");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet([penyulangData || {}]), "DataPenyulang");
  if (teknikData) {
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet([teknikData]), "DataTeknik");
  }

  const fileName = `SIMANIS-${now.toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

export function saveRekapExcel(rekap) {
  if (!rekap) return;

  const { customer, jtr, sr, material, totalSum, ppn, totalAfterPpn, details } = rekap;

  const AOA = [];

  // Title
  AOA.push(["Rekap Investasi"]);
  AOA.push([]); // spacer

  // Customer info
  AOA.push(["Plg An.", `${(customer?.nama || "-")}${customer?.daya ? `, ${customer.daya} VA` : ""}`, "", "", "No. WO", customer?.noWO || "-", "", "", ""]);
  AOA.push(["Alamat", customer?.alamat || "-", "", "", "Tahun Anggaran", customer?.year || "", "", "", ""]);
  AOA.push([]); // spacer

  // Header (2 baris dengan merge)
  AOA.push([
    "No.",
    "Uraian",
    "Volume",
    "Satuan",
    "Nilai Satuan (Rp)",
    "",
    "Nilai Jumlah (Rp)",
    "",
    "Jumlah Total",
  ]);
  AOA.push(["", "", "", "", "Material", "Jasa", "Material", "Jasa", ""]);

  // Baris data
  const rows = [
    { name: "Pembangunan JTR", mat: jtr?.material || 0, jasa: jtr?.jasa || 0 },
    { name: "Pemasangan SR", mat: sr?.material || 0, jasa: sr?.jasa || 0 },
    { name: "Material", mat: material?.material || 0, jasa: 0 },
  ];

  rows.forEach((r, i) => {
    const unitMat = r.mat;
    const unitJasa = r.jasa;
    const jmlMat = unitMat; // volume = 1
    const jmlJasa = unitJasa;
    const total = jmlMat + jmlJasa;
    AOA.push([i + 1, r.name, 1, "Lot", unitMat, unitJasa, jmlMat, jmlJasa, total]);
  });

  // Footer totals
  AOA.push([]);
  AOA.push(["", "", "", "", "", "", "JUMLAH", "", totalSum || 0]);
  AOA.push(["", "", "", "", "", "", "PPN 11 %", "", ppn || 0]);
  AOA.push(["", "", "", "", "", "", "JUMLAH SETELAH PPN", "", totalAfterPpn || 0]);

  const ws = XLSX.utils.aoa_to_sheet(AOA);

  // Merges
  ws["!merges"] = [
    XLSX.utils.decode_range("A1:I1"),
    XLSX.utils.decode_range("E6:F6"),
    XLSX.utils.decode_range("G6:H6"),
  ];

  // Column widths
  ws["!cols"] = [
    { wch: 4 },  // No
    { wch: 36 }, // Uraian
    { wch: 8 },  // Volume
    { wch: 8 },  // Satuan
    { wch: 14 }, // Nilai Satuan Mat
    { wch: 14 }, // Nilai Satuan Jasa
    { wch: 14 }, // Nilai Jumlah Mat
    { wch: 14 }, // Nilai Jumlah Jasa
    { wch: 16 }, // Jumlah Total
  ];

  // Number format
  Object.keys(ws).forEach((k) => {
    if (!/^[A-Z]+[0-9]+$/.test(k)) return;
    const cell = ws[k];
    if (cell && cell.t === "n") cell.z = "#,##0";
  });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Rekap Investasi");

  // Sheet detail Material - Konduktor & Tiang saja
  const konduktorTiang = [
    ...(details?.material?.konduktor || []),
    ...(details?.material?.tiang || [])
  ];
  if (konduktorTiang.length > 0) {
    const s = [["Material","Unit","Qty","Harga Satuan","Subtotal"]];
    konduktorTiang.forEach(d=>s.push([d.name,d.unit,d.qty,d.unitPrice,d.subtotal]));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(s), "Material");
  }

  // Sheet detail Pole Supporter Package
  if (details?.material?.poleSupporter) {
    const pkg = details.material.poleSupporter;
    const s = [
      ["Paket Pole Supporter", pkg.name],
      ["Harga Paket", pkg.price],
      [],
      ["Material","Unit","Jumlah"]
    ];
    (pkg.materials || []).forEach(m => s.push([m.name, m.unit, m.qty]));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(s), "Pole Supporter");
  }

  // Sheet detail Grounding Package
  if (details?.material?.grounding) {
    const pkg = details.material.grounding;
    const s = [
      ["Paket Grounding", pkg.name],
      ["Harga Paket", pkg.price],
      [],
      ["Material","Unit","Jumlah"]
    ];
    (pkg.materials || []).forEach(m => s.push([m.name, m.unit, m.qty]));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(s), "Grounding");
  }

  // Sheet detail Pondasi Package
  if (details?.material?.pondasi) {
    const pkg = details.material.pondasi;
    const s = [
      ["Paket Pondasi", pkg.name],
      ["Harga Paket", pkg.price],
      [],
      ["Material","Unit","Jumlah"]
    ];
    (pkg.materials || []).forEach(m => s.push([m.name, m.unit, m.qty]));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(s), "Pondasi");
  }

  // Sheet detail SAR SR
  if (details?.sarSr?.sr?.length || details?.sarSr?.app?.length) {
    const s = [["Bagian","Material","Unit","Qty PLN","Qty Rekanan","Harga Mat","Harga Jasa","Subtot Mat","Subtot Jasa"]];
    (details?.sarSr?.sr||[]).forEach(d=>s.push(["SR",d.name,d.unit,d.qtyPln,d.qtyRekanan,d.unitPriceMaterial,d.unitPriceJasa,d.subMaterial,d.subJasa]));
    (details?.sarSr?.app||[]).forEach(d=>s.push(["APP",d.name,d.unit,d.qtyPln,d.qtyRekanan,d.unitPriceMaterial,d.unitPriceJasa,d.subMaterial,d.subJasa]));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(s), "SAR SR");
  }

  // Removed SAR TR and KHS sheets

  const nama = (customer?.nama || "pelanggan").toString().replace(/[\\/:*?"<>|]/g, "_").replace(/\s+/g, "_");
  const fn = `rekap_investasi_${nama}.xlsx`;
  XLSX.writeFile(wb, fn);
}
