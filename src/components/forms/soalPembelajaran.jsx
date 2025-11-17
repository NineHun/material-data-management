import React from "react";
import { FileDown, BookOpenCheck } from "lucide-react";

export default function SoalPembelajaranKasus({ onNext, fileUrl }) {
  // Download dokumen soal
  const handleDownload = async () => {
    try {
      const url =
        fileUrl ||
        `${import.meta?.env?.BASE_URL || "/"}files/soal_study_kasus_perencanaan_distribusi.docx`;
      const res = await fetch(url, { mode: "same-origin" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const o = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = o;
      a.download = "soal_study_kasus_perencanaan_distribusi.docx";
      a.click();
      URL.revokeObjectURL(o);
    } catch (e) {
      alert("File tidak ditemukan. Pastikan berada di public/files/ …");
      console.error(e);
    }
  };

  return (
    <section className="w-full [background:linear-gradient(180deg,rgba(16,185,129,.06),rgba(255,255,255,0))]">
      <div className="rounded-2xl p-[1.2px] bg-gradient-to-br from-emerald-300/60 via-emerald-500/30 to-emerald-200/40 shadow-[0_10px_35px_-12px_rgba(16,185,129,.35)]">
        <div className="rounded-2xl bg-white border border-emerald-100">
          {/* Header */}
          <div className="flex items-center gap-3 rounded-t-2xl bg-gradient-to-r from-emerald-50 to-emerald-100/40 px-6 py-4 border-b border-emerald-100">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <BookOpenCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-emerald-900">Soal Studi Kasus</h3>
          </div>

          {/* Konten */}
          <div className="p-6 md:p-8 space-y-6">
            <p className="text-sm text-emerald-900/80">
              Berikut adalah soal studi kasus perencanaan distribusi pada proyek pertanian. Bacalah uraian kasus dengan saksama sebelum menganalisis.
            </p>

            {/* Ringkasan metadata kasus */}
            <div className="grid grid-cols-[max-content,1fr] gap-x-3 gap-y-1 text-sm text-gray-700">
              <span className="font-semibold">Thema</span>
              <span>Simulasi Pasang Baru Agriculture (Proses Perencanaan Bidang Teknik)</span>
              <span className="font-semibold">Audience</span>
              <span>TL Teknik dan TL Perencanaan Sistem</span>
              <span className="font-semibold">Unit Bisnis</span>
              <span>PLN Distribusi</span>
              <span className="font-semibold">Penulis</span>
              <span>PT PLN (Persero) UPDL Pandaan</span>
              <span className="font-semibold">Pembahasan</span>
              <span>Probing Agriculture</span>
            </div>

            {/* Uraian kasus */}
            <div className="space-y-4 text-[15px] text-gray-800 leading-relaxed">
              <p>
                <strong>Uraian singkat:</strong> Bima adalah Manajer Unit Pelayanan Pelanggan (ULP) di wilayah barat
                UID Jawa Timur yang berbatasan dengan UID Jawa Tengah dan DIY. ULP tersebut mengelola sekitar
                97&nbsp;ribu pelanggan, dengan sekitar 86&nbsp;% di antaranya pelanggan rumah tangga. Wilayah kerja ULP
                berupa daerah perdesaan dan membawahi enam kecamatan.
              </p>
              <p>
                Memasuki awal tahun 2024, kondisi ekonomi mulai bangkit seiring meredanya pandemi Covid‑19 dan
                pelonggaran kebijakan PPKM. Aktivitas eksplorasi minyak/gas di beberapa kecamatan kembali normal
                sehingga mendorong pertumbuhan UMKM; warga mendirikan home industry, bisnis rumah kost,
                penginapan, warung kuliner, dan sebagainya. Luasnya lahan pertanian di Jawa Timur membuka
                peluang penambahan pelanggan serta peningkatan kWh&nbsp;jual dan pendapatan di ULP. Bima optimis
                target kinerja tersebut dapat tercapai pada Desember&nbsp;2024. Selain itu, pemerintah meluncurkan
                program irigasi dan perairan yang menarik minat pelanggan di unitnya. Bima berencana menggandeng
                dinas pertanian untuk merumuskan skema pelaksanaan yang efektif dan positif.
              </p>
              <p>
                Bima telah berdiskusi dengan kelompok desa tani <em>“Maju Sejahtera”</em>. Dalam diskusi tersebut, disepakati
                beberapa poin berikut:
              </p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  <strong>Lokasi proyek.</strong> Lahan pertanian seluas 10&nbsp;hektar berlokasi di Mojolali. Saat ini,
                  pertanian eksisting berupa penanaman padi dengan siklus panen enam bulan sekali.
                </li>
                <li>
                  <strong>Potensi hasil dan tren panen.</strong> Rata‑rata pendapatan dari padi sekitar 550&nbsp;ribu&nbsp;kg per musim.
                  Tren produksi menunjukkan hasil 655&nbsp;ribu&nbsp;kg pada 2022 dan 445&nbsp;ribu&nbsp;kg pada 2023. Harga rata‑rata
                  gabah berkisar Rp10&nbsp;ribu per kilogram.
                </li>
                <li>
                  <strong>Kondisi irigasi.</strong> Mojolali terkenal subur namun memiliki irigasi dan perairan yang kurang baik.
                  Warga melaporkan panen periode 2022–2024 terus menurun akibat kesulitan perairan.
                </li>
                <li>
                  <strong>Kondisi finansial petani.</strong> Kelompok tani mengalami keterbatasan modal sehingga masih
                  menggunakan metode tanam tradisional. Dinas pertanian berupaya memberikan trobosan pada
                  2024 dan mengupayakan kerja sama dengan perbankan dengan bunga kompetitif.
                </li>
                <li>
                  <strong>Waktu realisasi.</strong> Dinas pertanian menargetkan realisasi irigasi dan perairan dapat dilaksanakan
                  paling lambat 30&nbsp;hari kerja setelah kesepakatan.
                </li>
                <li>
                  <strong>Kebutuhan listrik.</strong> Survey internal PLN menunjukkan kebutuhan pemasangan baru berupa
                  perluasan tiga gawang Tegangan Rendah (TR) sepanjang 119&nbsp;meter dengan daya 11.000&nbsp;VA untuk
                  kebun jeruk. Nama pelanggan untuk kelompok tani tersebut disepakati “Kebun&nbsp;Nurul&nbsp;Huda”.
                </li>
                <li>
                  <strong>Rencana kerja.</strong> Meski peluang sudah ada di depan mata, Bima harus menyusun rencana kerja
                  terperinci dan mempertimbangkan berbagai aspek agar target kinerja tercapai. Persiapan proyek
                  agriculture harus dikawal dengan baik.
                </li>
              </ol>
              <p>
                <strong>Tugas Anda:</strong> Berdasarkan kasus di atas, analisis kelayakan investasi pemasangan baru (perluasan
                jaringan) serta rancang strategi untuk mengoptimalkan potensi pertanian dan kebutuhan pelanggan.
              </p>
            </div>

            {/* Petunjuk analisis */}
            <div>
              <h4 className="font-semibold text-emerald-900 mb-2">Langkah analisis yang dianjurkan:</h4>
              <ul className="list-disc pl-5 text-[15px] text-gray-800 space-y-2">
                <li>Membaca dan memahami latar belakang kasus perencanaan distribusi (UPDL Pandaan, proyek Agriculture).</li>
                <li>Mengidentifikasi masalah teknis, finansial, dan sosial dari kasus tersebut.</li>
                <li>Menganalisis kelayakan investasi pemasangan baru berdasarkan data kebutuhan listrik dan potensi hasil.</li>
                <li>Menyusun rekomendasi singkat dan strategi berbasis data untuk mendukung keberhasilan proyek.</li>
              </ul>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
              >
                <FileDown className="h-4 w-4" /> Unduh Soal Studi Kasus (.docx)
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
