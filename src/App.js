// src/App.js
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation, Outlet } from "react-router-dom";
import { Leaf, ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import Dashboard from "./pages/Dashboard";
import ProductLanding from "./pages/ProductLanding";
import Chatbot from "./pages/Chatbot";
import LoginPage from "./components/LoginPage";
import Help from "./pages/Help";
import Sidebar from "./components/layout/Sidebar";
import IdentitasPelanggan from "./components/forms/IdentitasPelanggan";
import SoalPembelajaran from "./components/forms/soalPembelajaran"; // tambahkan import
import FallingLeaves from "./components/anim/FallingLeaves";
import { fadeUp } from "./animations/variants";
import { DAYA_OPTIONS } from "./constants/dayaOptions";
import ChartChallenge from "./components/forms/ChartChallenge";
import MaterialSelection from "./components/forms/materialSelection";
import SarSelection from "./components/forms/SarSelection";
// Removed SR TR and KHS steps
import RekapPage from "./pages/RekapPage";
import KKPPage from "./pages/KKPPage";
import FinalScore from "./pages/FinalScore";
import MaterialData from "./pages/MaterialData";
import ConsSelection from "./components/forms/ConsSelection";
import { EXPECTED_IDENTITAS, EXPECTED_INFO_PELANGGAN } from "./constants/expectedAnswers";


function ProtectedLayout({ user, onLogout, greetTitle, greetSubtitle }) {
  if (!user) return <Navigate to="/login" replace />;

  return (
  <div className="flex h-screen overflow-hidden font-[Poppins] bg-gradient-to-b from-teal-100 via-emerald-100 to-white relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        :root, html, body, #root, #app { font-family: 'Poppins', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif !important; }
        *, *::before, *::after { font-family: inherit !important; }
      `}</style>

      {/* background */}
      <FallingLeaves count={25} />
      <Leaf className="hidden md:block w-32 h-32 text-emerald-100 absolute -top-6 -right-6 rotate-12" />
      <Leaf className="hidden md:block w-24 h-24 text-lime-100 absolute bottom-8 -left-8 -rotate-12" />

      {/* sidebar */}
      <Sidebar
        user={user}
        onLogout={onLogout}
        greetTitle={greetTitle}
        greetSubtitle={greetSubtitle}
      />

      {/* konten halaman */}
      <main className="flex-1 p-6 ml-64 overflow-y-auto overflow-x-hidden relative z-10">
        <Outlet />
      </main>
    </div>
  );
}


function FormScreen({
  navigate,
  formData,
  handleChange,
  teknikData,
  handleTeknikChange,
  penyulangData,
  handlePenyulangChange,
  initialStep = 1,
}) {
  // refs untuk interaksi antar card
  const chartRef = React.useRef(null);
  const consRef = React.useRef(null);
  const materialRef = React.useRef(null);
  const sarRef = React.useRef(null);
  // removed: sarTrRef, khsRef

  // state tambahan yang digunakan
  const [cheatTrigger, setCheatTrigger] = React.useState(0);
  const [chartImage, setChartImage] = React.useState(null);
  const [chartAnswers, setChartAnswers] = React.useState({});

  const [identitasChecked, setIdentitasChecked] = React.useState(false);
  const [identitasValid, setIdentitasValid] = React.useState(false);
  const [chartValid, setChartValid] = React.useState(false);
  const [consValid, setConsValid] = React.useState(false);
  const [materialsValid, setMaterialsValid] = React.useState(false);
  const [sarValid, setSarValid] = React.useState(false);
  // rekap dipindah ke halaman tersendiri

  // Jika initialStep >= 6 (kembali dari rekap ke SAR Selection), set semua validasi true
  React.useEffect(() => {
    if (initialStep >= 6) {
      setIdentitasValid(true);
      setChartValid(true);
      setConsValid(true);
      setMaterialsValid(true);
      setSarValid(true);
      setIdentitasChecked(true);
    }
  }, [initialStep]);

  // Handle final submission: compute totals and prepare rekap data
  const handleSubmitFinal = () => {
    // Validasi: pastikan SAR SR sudah terisi
    if (!sarValid) {
      alert("Mohon lengkapi semua data SAR SR terlebih dahulu sebelum submit.");
      return;
    }

    // Konfirmasi sebelum submit
    const confirmSubmit = window.confirm(
      "Apakah Anda yakin ingin mengirim jawaban? Pastikan semua data sudah benar."
    );
    
    if (!confirmSubmit) {
      return; // Batalkan submit jika user memilih Cancel
    }

    // Izinkan rekap meski sebagian belum valid/terisi.
    // Ambil totals dari masing‑masing kartu berdasarkan input saat ini.
    // (Jika kartu belum terisi, getTotals() fallback ke 0.)
    const matsTotals = materialRef.current?.getTotals?.() || {
      konduktor: 0,
      poleSupporter: 0,
      tiang: 0,
      grounding: 0,
      pondasi: 0,
      total: 0,
      details: { konduktor: [], poleSupporter: null, tiang: [], grounding: null, pondasi: null }
    };
  const consTotals = consRef.current?.getTotals?.() || { total: 0, items: [], presets: [], presetPrices: [] };
    const sarTotals = sarRef.current?.getTotals?.() || {
      srMaterial: 0,
      srJasa: 0,
      totalMaterial: 0,
      totalJasa: 0,
      total: 0,
      details: { sr: [], app: [] }
    };
    // SR TR and KHS are removed from calculation

  // hitung nilai Pembangunan JTR (pisahkan material dan jasa dari konstruksi TR)
  const presetPrices = Array.isArray(consTotals.presetPrices) ? consTotals.presetPrices : [];
  const jtrMaterial = presetPrices.reduce((s, p) => s + (Number(p.hargaSatuan) || 0), 0);
  const jtrJasa = presetPrices.reduce((s, p) => s + (Number(p.hargaJasa) || 0), 0);
  const jtrTotal = jtrMaterial + jtrJasa;
    // hitung nilai Pemasangan SR (gabungan SR & APP)
    const srMaterial = sarTotals.totalMaterial || 0;
    const srJasa = sarTotals.totalJasa || 0;
    const srTotal = sarTotals.total || (srMaterial + srJasa);
  // hitung nilai material (Konduktor, Pole Supporter, Tiang Beton, Grounding, Pondasi)
    const konduktor = matsTotals.konduktor || 0;
    const poleSupporter = matsTotals.poleSupporter || 0;
    const tiangBeton = matsTotals.tiang || 0;
  const grounding = matsTotals.grounding || 0;
  const pondasi = matsTotals.pondasi || 0;
  // total material = JTR + SR + semua material (konduktor+poleSupporter+tiang+grounding+pondasi)
  const materialTotal = konduktor + poleSupporter + tiangBeton + grounding + pondasi;
  const totalMaterial = jtrMaterial + srMaterial + materialTotal;
  // total jasa = hanya dari SR (JTR jasa 0, material tidak ada jasa)
  const totalJasa = jtrJasa + srJasa; // effectively srJasa
    // jumlah sebelum PPN = total semua material + total semua jasa
    const totalSum = totalMaterial + totalJasa;
    // hitung PPN 11%
    const ppn = totalSum * 0.11;
    const totalAfterPpn = totalSum + ppn;
    // gather customer info
    const plgName = formData.namaPelanggan || "-";
    const plgDaya = formData.dayaBaru || "";
    const customerInfo = {
      nama: plgName,
      daya: plgDaya,
      alamat: formData.alamatPelanggan || formData.alamatPemohon || "",
      noWO: formData.noAgenda || "", // using noAgenda as work order if provided
      year: (() => {
        // derive year from tanggalAgenda or current year
        const tgl = formData.tanggalAgenda;
        if (tgl) {
          const d = new Date(tgl);
          if (!isNaN(d.getTime())) return d.getFullYear();
        }
        return new Date().getFullYear();
      })(),
    };
    // assemble rekap data
    const rekap = {
  customer: customerInfo,
  // Pembangunan JTR berasal dari Konstruksi TR (ConsSelection)
      jtr: {
        material: jtrMaterial,
        jasa: jtrJasa,
        total: jtrTotal,
      },
      // Pemasangan SR berasal dari total SAR SR (SR + APP)
      sr: {
        material: srMaterial,
        jasa: srJasa,
        total: srTotal,
      },
      // Material (gabungan Konduktor, Pole Supporter, Tiang, Grounding, Pondasi)
      material: {
        material: materialTotal,
        total: materialTotal,
        breakdown: {
          konduktor,
          poleSupporter,
          tiangBeton,
          grounding,
          pondasi,
        }
      },
      totalMaterial,
      totalJasa,
      totalSum,
      ppn,
      totalAfterPpn,
      details: {
        konstruksi: consTotals,
        material: matsTotals.details,
        sarSr: {
          sr: sarTotals.details?.sr || [],
          app: sarTotals.details?.app || [],
        },
        // removed sarTr and khs details
      },
    };
    // simpan sementara dan navigasi ke halaman rekap
    try { sessionStorage.setItem("rekapData", JSON.stringify(rekap)); } catch {}
    
    // Simpan data lengkap untuk Final Score (identitas, chart, SAR, material)
    try {
      const comprehensiveData = {
        identitas: {
          tarif: formData.tarifBaru || formData.tarifLama || "",
          daya: Number(formData.dayaBaru || formData.dayaLama || 0),
          namaPelanggan: formData.namaPelanggan || "",
          alamat: formData.alamatPelanggan || formData.alamatPemohon || ""
        },
        chartAnswers: chartAnswers,
        sarData: sarTotals,
        materialData: matsTotals,
      };
      sessionStorage.setItem("formEvaluationData", JSON.stringify(comprehensiveData));
    } catch {}
    
    navigate("/rekap", { state: { rekap } });
  };

  const validateIdentitas = React.useCallback(() => {
    // Validasi sederhana: cukup cek apakah field daya sudah diisi
    const jenisOk = formData.jenisPermohonan === "baru" || formData.jenisPermohonan === "lama";
    const dayaOk = formData.jenisPermohonan === "baru" 
      ? Number(formData.dayaBaru || 0) > 0 
      : Number(formData.dayaLama || 0) > 0;

    const ok = jenisOk && dayaOk;
    setIdentitasChecked(true);
    setIdentitasValid(ok);
  }, [formData]);

  const identitasBanner = identitasChecked ? (
    <div className={`rounded-xl border px-4 py-3 ${identitasValid
        ? "border-emerald-300 bg-emerald-50 text-emerald-800"
        : "border-rose-300 bg-rose-50 text-rose-800"
      }`}>
      {identitasValid
        ? "Data pelanggan sudah lengkap. Lanjutkan ke tugas chart di bawah."
        : "Mohon lengkapi data pelanggan. Pilih Jenis Permohonan dan isi Daya untuk melanjutkan."}
    </div>
  ) : null;

  // >>> Fungsi cheat: isi identitas sesuai EXPECTED + pilih tarif yang memuat 10.600 VA
  const runCheat = React.useCallback(() => {
    const TARGET_DAYA = 10600;
    const golI1 = DAYA_OPTIONS.find(d => d.golongan === "B-2/TR");
    const batasI1 = golI1?.batas.find(b => b.min <= TARGET_DAYA && TARGET_DAYA <= b.max);
    const tarifBaruVal = batasI1 ? `${golI1.golongan}|${batasI1.label}` : "";

    const patch = (name, value) => handleChange({ target: { name, value } });

    patch("jenisPermohonan", "baru");
    patch("namaPelanggan", "kebun nurul huda");
    patch("dayaBaru", String(TARGET_DAYA));
    if (tarifBaruVal) patch("tarifBaru", tarifBaruVal);

    // tampilkan kartu chart & auto-isi chart
    setCheatTrigger(t => t + 1);

    // jalankan validasi identitas
    setTimeout(() => validateIdentitas(), 0);
  }, [handleChange, validateIdentitas]);

  // >>> Shortcut keyboard: Ctrl+Shift+C
  React.useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === "KeyC") {
        e.preventDefault();
        runCheat();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [runCheat]);

  // CHEAT: isi Identitas benar
  const cheatIdentitas = React.useCallback(() => {
    const E = EXPECTED_INFO_PELANGGAN;

    // cari tarif yang memuat 10.600 VA
    const TARGET_DAYA = E.dayaBaru ?? EXPECTED_IDENTITAS.dayaBaru;
    const golI1 = DAYA_OPTIONS.find((d) => d.golongan === "B-2/TR");
    const batasI1 = golI1?.batas.find((b) => b.min <= TARGET_DAYA && TARGET_DAYA <= b.max);
    const tarifBaruVal = batasI1 ? `${golI1.golongan}|${batasI1.label}` : "";

    const patch = (name, value) => handleChange({ target: { name, value } });

    // Unit & Agenda
    patch("unitUpAsal", E.unitUpAsal);
    patch("unitUpTujuan", E.unitUpTujuan);
    patch("idPelanggan", E.idPelanggan);
    patch("noAgenda", E.noAgenda);
    patch("tanggalAgenda", E.tanggalAgenda);

    // Identitas pelanggan
    patch("namaPelanggan", E.namaPelanggan);
    patch("telp", E.telp);
    patch("alamatPelanggan", E.alamatPelanggan);

    // Data pemohon
    patch("namaPemohon", E.namaPemohon);
    patch("alamatPemohon", E.alamatPemohon);
    patch("asalMohon", E.asalMohon);
    patch("keperluan", E.keperluan);
    patch("paketSar", E.paketSar);

    // Dokumen
    patch("nik", E.nik);
    patch("noKk", E.noKk);
    patch("npwp", E.npwp);
    patch("noRegister", E.noRegister);

    // Tarif/Daya Baru
    patch("jenisPermohonan", "baru");
    patch("dayaBaru", String(TARGET_DAYA));
    if (tarifBaruVal) patch("tarifBaru", tarifBaruVal);

    // validasi minimal (nama/jenis/daya) tetap seperti sebelumnya
    setTimeout(() => validateIdentitas(), 0);
  }, [handleChange, validateIdentitas]);

  // CHEAT: pilih C dan submit Chart
  const cheatChart = React.useCallback(() => {
    if (!identitasValid) {
      cheatIdentitas();
      setTimeout(() => chartRef.current?.cheat?.(), 80);
    } else {
      chartRef.current?.cheat?.();
    }
  }, [identitasValid, cheatIdentitas]);

  // CHEAT: isi Material sesuai kunci jawaban
  const cheatMaterials = React.useCallback(() => {
    if (!chartValid) {
      cheatChart();
      setTimeout(() => materialRef.current?.fillExpected?.(), 140);
    } else {
      materialRef.current?.fillExpected?.();
    }
  }, [chartValid, cheatChart]);

  // CHEAT: semua (Identitas, Chart, Material)
  const cheatAll = React.useCallback(() => {
    cheatIdentitas();
    setTimeout(() => chartRef.current?.cheat?.(), 80);
    setTimeout(() => materialRef.current?.fillExpected?.(), 160);
  }, [cheatIdentitas]);

  // Shortcuts: Ctrl+Shift+1/2/3/0 + Ctrl+Shift+M (Material)
  React.useEffect(() => {
    const onKey = (e) => {
      if (!(e.ctrlKey || e.metaKey) || !e.shiftKey) return;
      if (e.code === "Digit1") { e.preventDefault(); cheatIdentitas(); }
      if (e.code === "Digit2") { e.preventDefault(); cheatChart(); }
  if (e.code === "Digit3" || e.code === "KeyM") { e.preventDefault(); cheatMaterials(); }
      if (e.code === "Digit0") { e.preventDefault(); cheatAll(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cheatIdentitas, cheatChart, cheatMaterials, cheatAll]);

  const [step, setStep] = React.useState(initialStep);

  const maxStep = React.useMemo(() => {
    let m = 2;                     // Soal -> Identitas selalu boleh
    if (identitasValid) m = Math.max(m, 3); // buka Chart
    if (chartValid)    m = Math.max(m, 4);  // buka Konstruksi
    if (consValid)     m = Math.max(m, 5);  // setelah konstruksi valid, boleh ke Material
    if (materialsValid)      m = Math.max(m, 6);   // setelah Material valid, buka SR saja
    return m;
  }, [identitasValid, chartValid, consValid, materialsValid]);

  const tryGoTo = React.useCallback((target) => {
    const clamped = Math.max(1, Math.min(target, maxStep));
    setStep(clamped);
  }, [maxStep]);

  React.useEffect(() => { if (step > maxStep) setStep(maxStep); }, [maxStep, step]);

  // swipe handlers (touch)
  const startXRef = React.useRef(0);
  const deltaRef = React.useRef(0);
  const onTouchStart = (e) => { startXRef.current = e.touches[0].clientX; deltaRef.current = 0; };
  const onTouchMove = (e) => { deltaRef.current = e.touches[0].clientX - startXRef.current; };
  const onTouchEnd = () => {
    const d = deltaRef.current;
    const TH = 60; // threshold px
    if (d < -TH) tryGoTo(step + 1);
    if (d > TH) tryGoTo(step - 1);
    startXRef.current = 0; deltaRef.current = 0;
  };

  // bangun isi tiap slide
  const slides = [
    // 0) Soal (informasi)
    (
      <motion.div variants={fadeUp} className="w-full">
        <SoalPembelajaran formData={formData} onChange={handleChange} />
      </motion.div>
    ),
    // 1) Identitas
    (
      <motion.div variants={fadeUp} className="w-full space-y-4">
        <IdentitasPelanggan
          formData={formData}
          onChange={handleChange}
          onSubmit={validateIdentitas}
          statusBanner={identitasBanner}
        />
      </motion.div>
    ),
    // 2) Chart
    (
      <motion.div variants={fadeUp} className="w-full space-y-4">
        <ChartChallenge
          ref={chartRef}
          cheatTrigger={cheatTrigger}
          onValidate={(ok) => setChartValid(ok)}
          onCorrectImage={(img) => setChartImage(img)}
          onAnswersChange={(answers) => setChartAnswers(answers)}
        />
      </motion.div>
    ),
    // 3) Konstruksi TR (baru)
    (
      <motion.div variants={fadeUp} className="w-full space-y-4">
        <ConsSelection
          ref={consRef}
          onValidate={(ok) => setConsValid(ok)}
          chartAnswers={chartAnswers}
        />
      </motion.div>
    ),
    // 4) Material
    (
      <motion.div variants={fadeUp} className="w-full space-y-4">
        <MaterialSelection
          ref={materialRef}
          referenceImage={chartImage}
          onValidate={(ok) => setMaterialsValid(ok)}
        />
      </motion.div>
    ),
    // 5) SAR SR
    (
      <motion.div variants={fadeUp} className="w-full space-y-4">
        <SarSelection ref={sarRef} onValidate={(ok) => setSarValid(ok)} />
      </motion.div>
    ),
    // 6) SAR SR is last step now; no SAR TR or KHS
  ];

  // progress untuk 8 slide (Soal→KHS). Step 1=Soal → 0%, terakhir=100%.
  const stepTitles = ["Soal", "Identitas", "Chart", "Konstruksi", "Material", "SAR SR"];
  const progressPct = Math.max(0, Math.min(100, ((step - 1) / (slides.length - 1)) * 100));

  return (
    <div className="relative w-full h-full">
      {/* Progress header (sticky) */}
  <div className="sticky top-0 z-30 py-3 border-b border-emerald-100/60">
        <div className="flex items-center justify-between mb-2 px-1 md:px-0">
          <div className="text-[13px] font-medium text-emerald-900">
            Langkah {step} / {slides.length}
            <span className="mx-1">—</span>
            <span className="text-emerald-600">{stepTitles[step - 1] || ""}</span>
          </div>
          <div className="text-[12px] text-emerald-700/70">{Math.round(progressPct)}%</div>
        </div>
        <div className="relative h-3 w-full rounded-full bg-emerald-100/70 ring-1 ring-emerald-200/60 overflow-hidden">
          {/* filled bar */}
          <div
            className="absolute inset-y-0 left-0 transition-[width] duration-300 bg-gradient-to-r from-emerald-600 via-emerald-500 to-lime-500 shadow-[inset_0_0_6px_rgba(255,255,255,0.5)]"
            style={{ width: `${progressPct}%` }}
          >
            {/* subtle stripes overlay */}
            <div className="absolute inset-0 opacity-15 bg-[linear-gradient(45deg,rgba(255,255,255,0.65)_0,rgba(255,255,255,0.65)_10px,transparent_10px,transparent_20px)]" />
          </div>
          {/* step tick marks */}
          {slides.map((_, i) => (
            <span
              key={i}
              className={`pointer-events-none absolute top-0 bottom-0 w-px ${i < step ? "bg-emerald-500/60" : "bg-emerald-300/60"}`}
              style={{ left: `calc(${(i / (slides.length - 1)) * 100}% - 0.5px)` }}
            />
          ))}
        </div>
      </div>

      {/* Viewport konten: card mengisi layar di bawah progress (CROSSFADE, bukan slide)
         Untuk menjaga scroll bar tetap sejajar dengan batas bawah card, padding bawah
         dipindahkan ke wrapper luar sehingga area scroll tidak menghitung ruang tombol. */}
      <div className="relative w-full h-[calc(100vh-140px)]">
        {/* Tambahkan padding‑bottom di wrapper ini, bukan di elemen overflow, agar scroll bar berakhir di tepi kartu */}
        <div className="absolute inset-0 px-2 md:px-0 pb-24 md:pb-20">
          <div className="h-full w-full">
            <div
              className="h-full w-full rounded-2xl relative"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {slides.map((el, i) => (
                <div
                  key={i}
                  className={`absolute inset-0 transition-opacity duration-300 ${
                    step === i + 1 ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                  }`}
                >
                  {/* Hilangkan padding bottom dari area scroll; sekarang diberikan oleh wrapper luarnya */}
                  <div className="w-full h-full overflow-auto">
                    {el}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Indicator dots (opsional, tetap di bawah) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-40">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => tryGoTo(i + 1)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              step === i + 1 ? "bg-emerald-600 scale-110" : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}

      </div>

      {/* Tombol Kembali + Next mengambang */}
      <div className="fixed bottom-6 left-6 md:left-[calc(16rem+1.5rem)] z-40">
        <button
          onClick={() => tryGoTo(step - 1)}
          disabled={step <= 1}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white/90 backdrop-blur px-4 py-2 text-sm text-gray-700 hover:bg-white disabled:opacity-50 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>
      </div>
      <div className="fixed bottom-6 right-6 z-40">
        {(() => {
          const isLastStep = step === slides.length;
          const canAdvance = step < maxStep; // only relevant when not last step
          const enabled = isLastStep ? sarValid : canAdvance;
          const onClick = () => (isLastStep ? handleSubmitFinal() : tryGoTo(step + 1));
          const title = isLastStep
            ? sarValid
              ? "Kirim dan buka halaman rekap"
              : "Lengkapi semua data SAR SR terlebih dahulu"
            : canAdvance
            ? "Lanjut"
            : "Lengkapi langkah ini dulu";
          return (
            <button
              onClick={onClick}
              disabled={!enabled}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold shadow-md transition ${
                enabled
                  ? "bg-gradient-to-r from-emerald-600 to-lime-500 text-white hover:from-emerald-700 hover:to-lime-600"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
              title={title}
            >
              {isLastStep ? "Submit" : "Lanjut"}
              <ArrowRight className="w-5 h-5" />
            </button>
          );
        })()}
      </div>
    </div>
  );
}

// Wrapper sederhana untuk halaman Form (menyediakan state & handler minimal)
function FormWrapper() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({});
  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  // placeholder jika nanti butuh
  const [teknikData, setTeknikData] = useState(null);
  const [penyulangData, setPenyulangData] = useState(null);

  // Restore state saat kembali dari rekap
  const initialStep = location.state?.returnToStep || 1;

  return (
    <FormScreen
      navigate={navigate}
      formData={formData}
      handleChange={handleChange}
      teknikData={teknikData}
      handleTeknikChange={setTeknikData}
      penyulangData={penyulangData}
      handlePenyulangChange={setPenyulangData}
      initialStep={initialStep}
    />
  );
}

export default function App() {
  const nav = useNavigate();
  const [user, setUser] = useState(null);
  const [greetTitle, setGreetTitle] = useState("");
  const [greetSubtitle, setGreetSubtitle] = useState("");

  // Catatan: Hilangkan auto-login agar aplikasi selalu membuka halaman Login saat start.
  // Jika ingin mempertahankan sesi, gunakan localStorage/sessionStorage di sini.

  // dipanggil oleh LoginPage
  const handleLogin = (payload) => {
    const loggedInUser = payload?.user || {
      name: payload?.username || "Admin",
      email: "admin@example.com",
      role: "admin",
    };
    setUser(loggedInUser);
    setGreetTitle(`Selamat Datang, ${loggedInUser.name}`);
    setGreetSubtitle("Apa yang bisa kami bantu hari ini?");
    nav("/dashboard", { replace: true });
  };

  const handleLogout = () => {
    setUser(null);
    setGreetTitle("");
    setGreetSubtitle("");
    // arahkan kembali ke login setelah logout
    nav("/login", { replace: true });
  };

  return (
    <Routes>
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
      <Route
        path="/"
        element={
          <ProtectedLayout
            user={user}
            onLogout={handleLogout}
            greetTitle={greetTitle}
            greetSubtitle={greetSubtitle}
          />
        }
      >
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* Tambah alias /product dan halaman form */}
        <Route path="product" element={<ProductLanding />} />
        <Route path="product-landing" element={<ProductLanding />} />
        <Route path="form" element={<FormWrapper />} />

        <Route path="chatbot" element={<Chatbot />} />
        <Route path="help" element={<Help />} />
        <Route path="material-data" element={<MaterialData />} />
        <Route path="rekap" element={<RekapPage />} />
        <Route path="kkp" element={<KKPPage />} />
        <Route path="final-score" element={<FinalScore />} />
        <Route path="*" element={<div>404 - Not Found</div>} />
      </Route>
    </Routes>
  );
}