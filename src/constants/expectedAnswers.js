// src/constants/expectedAnswers.js
export const EXPECTED_IDENTITAS = {
  namaPelanggan: "kebun nurul huda", // bandingkan lowercase agar toleran penulisan
  jenisPermohonan: "baru",           // "Pasang Baru" di UI-mu bernilai "baru" di state :contentReference[oaicite:6]{index=6}
  dayaBaru: 11000
};

// Dataset target untuk tugas chart (diambil dari dokumen studi kasus) :contentReference[oaicite:7]{index=7}
export const CHART_TARGET = {
  type: "bar", // peserta harus pilih Bar Chart
  series: [
    { year: 2022, value: 655000 },
    { year: 2023, value: 445000 },
    { year: 2024, value: 550000 } // "rata-rata 550.000 kg" aku jadikan nilai 2024 agar tugas punya 3 titik data
  ],
  tolerance: 0 // harus cocok persis; ubah ke 5000 jika mau toleransi ±5.000
};

// Kunci jawaban untuk tugas Chart (titik A–D)
// Nilai menggunakan key dari KONSTRUKSI_OPTIONS (bukan label),
// sehingga SelectDown <option value={opt.key}> akan cocok dengan kunci ini.
// Mapping yang diminta:
// - Titik A → TR-7
// - Titik B → TR-1
// - Titik C → TR-1
// - Titik D → TR-3
export const EXPECTED_CHART_ANSWERS = {
  A: "TR_7",
  B: "TR_1",
  C: "TR_1",
  D: "TR_3",
};

// Nilai contoh untuk mengisi otomatis form Identitas melalui fitur "cheat"
// Pastikan field-name sesuai dengan input pada IdentitasPelanggan.jsx
export const EXPECTED_INFO_PELANGGAN = {
  // Unit & Agenda
  unitUpAsal: "12100",
  unitUpTujuan: "12200",
  idPelanggan: "12345678901",
  noAgenda: "AGD-001/2024",
  tanggalAgenda: "2024-06-01T09:00",

  // Identitas pelanggan
  namaPelanggan: "kebun nurul huda",
  telp: "081234567890",
  alamatPelanggan: "Jl. Mawar No. 1, Bandung",

  // Data pemohon
  namaPemohon: "kebun nurul huda",
  alamatPemohon: "Jl. Mawar No. 1, Bandung",
  asalMohon: "PLN MOBILE",
  keperluan: "Permohonan Pasang Baru",
  paketSar: "PRABAYAR (PREPAID) SATU ARAH",

  // Dokumen
  nik: "3201010101010001",
  noKk: "3201010101010001",
  npwp: "",
  noRegister: "REG-2024-0001",

  // Tarif/Daya Baru
  dayaBaru: 11000,
};
