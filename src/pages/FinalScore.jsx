// src/pages/FinalScore.jsx
import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, AlertCircle, Trophy, Target, ArrowLeft, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function FinalScore() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ambil semua data dari sessionStorage
  useEffect(() => {
    try {
      const formData = sessionStorage.getItem("formEvaluationData");
      const kkpData = sessionStorage.getItem("kkpDataForScore");
      
      if (formData && kkpData) {
        const parsedFormData = JSON.parse(formData);
        const parsedKkpData = JSON.parse(kkpData);
        
        setData({
          identitas: parsedFormData.identitas,
          chartAnswers: parsedFormData.chartAnswers,
          sarData: parsedFormData.sarData,
          materialData: parsedFormData.materialData,
          kkpData: parsedKkpData,
        });
      }
      setLoading(false);
    } catch (error) {
      console.error("Error loading data:", error);
      setLoading(false);
    }
  }, []);

  // Evaluasi setiap bagian
  const evaluation = useMemo(() => {
    if (!data) return null;

    const results = {
      sections: [],
      totalScore: 0,
      maxScore: 100,
      isPerfect: false,
      grade: "",
      feedback: "",
    };

    // 1. EVALUASI DATA PELANGGAN (Bobot: 5 poin)
    const expectedTarif = "B-2/TR|5.501 VA – 200 kVA";
    const pelangganCorrect = data.identitas?.tarif === expectedTarif && 
                             data.identitas?.daya === 11000;
    results.sections.push({
      name: "Data Pelanggan",
      maxScore: 5,
      score: pelangganCorrect ? 5 : 0,
      isCorrect: pelangganCorrect,
      details: [
        {
          label: "Tarif",
          userAnswer: data.identitas?.tarif ? data.identitas.tarif.replace('|', ' - ') : "-",
          correctAnswer: "B-2/TR - 5.501 VA – 200 kVA",
          isCorrect: data.identitas?.tarif === expectedTarif,
          feedback: data.identitas?.tarif !== expectedTarif
            ? "Tarif yang dipilih tidak sesuai dengan kebutuhan pelanggan. Untuk daya 11000 VA, seharusnya menggunakan tarif B-2/TR (5.501 VA – 200 kVA)."
            : "Tarif sudah sesuai dengan klasifikasi pelanggan."
        },
        {
          label: "Daya",
          userAnswer: `${data.identitas?.daya || 0} VA`,
          correctAnswer: "11000 VA",
          isCorrect: data.identitas?.daya === 11000,
          feedback: data.identitas?.daya !== 11000
            ? "Daya yang diinput tidak sesuai. Berdasarkan kebutuhan pelanggan, daya yang diperlukan adalah 11000 VA."
            : "Daya sudah sesuai dengan kebutuhan pelanggan."
        }
      ]
    });

    // 2. EVALUASI CHART ANALYSIS (Bobot: 10 poin)
    const chartAnswers = data.chartAnswers || {};
    const expectedChart = { A: "TR_7", B: "TR_1", C: "TR_1", D: "TR_3" };
    const chartCorrectCount = Object.keys(expectedChart).filter(k => chartAnswers[k] === expectedChart[k]).length;
    const chartScore = (chartCorrectCount / 4) * 10;
    
    results.sections.push({
      name: "Analisis Gambar Jaringan",
      maxScore: 10,
      score: chartScore,
      isCorrect: chartScore === 10,
      details: Object.keys(expectedChart).map(point => ({
        label: `Titik ${point}`,
        userAnswer: chartAnswers[point] ? `TR-${chartAnswers[point].split('_')[1]}` : "Tidak dijawab",
        correctAnswer: `TR-${expectedChart[point].split('_')[1]}`,
        isCorrect: chartAnswers[point] === expectedChart[point],
        feedback: chartAnswers[point] !== expectedChart[point]
          ? `Konstruksi TR yang dipilih tidak tepat untuk titik ${point}. Seharusnya menggunakan TR-${expectedChart[point].split('_')[1]} berdasarkan analisis gambar jaringan.`
          : `Konstruksi TR untuk titik ${point} sudah benar.`
      }))
    });

    // 3. EVALUASI SR & APP (Bobot: 15 poin)
    const sarData = data.sarData || {};
    const sarDetails = sarData.details || {};
    
    let sarTotalScore = 0;
    const sarEvalDetails = [];
    
    // Paket SR (5 poin: 3 untuk jenis, 2 untuk qty)
    let srScore = 0;
    let srFeedback = "";
    
    if (sarDetails.sr?.length > 0 && sarDetails.sr[0]?.packageKey === "sr_3_phasa") {
      srScore += 3; // Jenis benar
      const qty = sarDetails.sr[0]?.setQty || 0;
      
      if (qty === 1) {
        srScore += 2; // Qty sempurna
        srFeedback = "Paket SR sudah tepat (jenis dan kuantitas sesuai).";
      } else if (qty === 2) {
        srScore += 1; // Qty lebih sedikit
        srFeedback = "Paket SR benar, namun kuantitas 2 set berlebih. Seharusnya 1 set.";
      } else if (qty > 0) {
        srFeedback = `Paket SR benar, namun kuantitas ${qty} set tidak sesuai standar 1 set.`;
      } else {
        srFeedback = "Paket SR benar, namun kuantitas tidak diisi.";
      }
    } else {
      srFeedback = "Paket SR yang dipilih tidak sesuai. Untuk instalasi 3 phasa dengan daya 11000 VA, gunakan paket SR 3 Phasa sebanyak 1 set.";
    }
    
    sarTotalScore += srScore;
    sarEvalDetails.push({
      label: "Paket SR",
      userAnswer: sarDetails.sr?.[0]?.packageName ? `${sarDetails.sr[0].packageName} (${sarDetails.sr[0].setQty} set)` : "Tidak dipilih",
      correctAnswer: "SR 3 Phasa (1 set)",
      isCorrect: srScore === 5,
      score: srScore,
      maxScore: 5,
      feedback: srFeedback
    });
    
    // Konduktor NFA 2X (5 poin: 3 untuk ada tidaknya, 2 untuk qty)
    let konduktorSarScore = 0;
    let konduktorSarFeedback = "";
    
    if (sarDetails.konduktor?.qtyMs > 0) {
      konduktorSarScore += 3; // Ada konduktor
      const qty = sarDetails.konduktor.qtyMs;
      
      if (qty === 25) {
        konduktorSarScore += 2; // Qty sempurna
        konduktorSarFeedback = "Jumlah konduktor sudah sesuai dengan kebutuhan.";
      } else if (qty >= 23 && qty <= 27) {
        konduktorSarScore += 1.5; // Qty mendekati
        konduktorSarFeedback = `Jumlah konduktor ${qty} ms mendekati standar 25 ms. Masih dapat diterima.`;
      } else if (qty >= 20 && qty < 23) {
        konduktorSarScore += 1; // Qty kurang
        konduktorSarFeedback = `Jumlah konduktor ${qty} ms kurang dari standar 25 ms.`;
      } else if (qty > 27 && qty <= 30) {
        konduktorSarScore += 1; // Qty lebih
        konduktorSarFeedback = `Jumlah konduktor ${qty} ms lebih dari standar 25 ms.`;
      } else {
        konduktorSarFeedback = `Jumlah konduktor ${qty} ms tidak sesuai standar 25 ms (akan menjadi 26 mtr setelah +5%).`;
      }
    } else {
      konduktorSarFeedback = "Jumlah konduktor yang diinput tidak sesuai standar. Untuk instalasi ini diperlukan konduktor NFA 2X - T 4 x 35 mm² sebanyak 25 ms (akan menjadi 26 mtr setelah +5%).";
    }
    
    sarTotalScore += konduktorSarScore;
    sarEvalDetails.push({
      label: "Konduktor NFA 2X",
      userAnswer: `${sarDetails.konduktor?.qtyMs || 0} ms`,
      correctAnswer: "25 ms",
      isCorrect: konduktorSarScore === 5,
      score: konduktorSarScore,
      maxScore: 5,
      feedback: konduktorSarFeedback
    });
    
    // Paket APP (5 poin: 3 untuk jenis, 2 untuk qty)
    let appScore = 0;
    let appFeedback = "";
    
    if (sarDetails.app?.length > 0 && sarDetails.app[0]?.packageKey === "app_3_phasa_langsung") {
      appScore += 3; // Jenis benar
      const qty = sarDetails.app[0]?.setQty || 0;
      
      if (qty === 1) {
        appScore += 2; // Qty sempurna
        appFeedback = "Paket APP sudah sesuai standar (jenis dan kuantitas tepat).";
      } else if (qty === 2) {
        appScore += 1; // Qty lebih sedikit
        appFeedback = "Paket APP benar, namun kuantitas 2 set berlebih. Seharusnya 1 set.";
      } else if (qty > 0) {
        appFeedback = `Paket APP benar, namun kuantitas ${qty} set tidak sesuai standar 1 set.`;
      } else {
        appFeedback = "Paket APP benar, namun kuantitas tidak diisi.";
      }
    } else {
      appFeedback = "Paket APP yang dipilih tidak tepat. Untuk sistem 3 phasa pengukuran langsung diperlukan 1 set APP.";
    }
    
    sarTotalScore += appScore;
    sarEvalDetails.push({
      label: "Paket APP",
      userAnswer: sarDetails.app?.[0]?.packageName ? `${sarDetails.app[0].packageName} (${sarDetails.app[0].setQty} set)` : "Tidak dipilih",
      correctAnswer: "3 Phasa Pengukuran Langsung (1 set)",
      isCorrect: appScore === 5,
      score: appScore,
      maxScore: 5,
      feedback: appFeedback
    });
    
    results.sections.push({
      name: "Pemasangan SR & APP",
      maxScore: 15,
      score: sarTotalScore,
      isCorrect: sarTotalScore === 15,
      details: sarEvalDetails
    });

    // 4. EVALUASI MATERIAL MDU (Bobot: 40 poin - paling penting)
    const materialData = data.materialData || {};
    const materialDetails = materialData.details || {};
    
    let materialScore = 0;
    const materialEval = [];

    // Konduktor (8 poin: 5 untuk jenis, 3 untuk qty)
    const konduktorMaterial = materialDetails.konduktor || [];
    const konduktorExpected = "NFA2X-T;3x70 + 1x70 mm2";
    const konduktorQtyExpected = 110; // ms (akan jadi 116 mtr)
    
    let konduktorScore = 0;
    let konduktorFeedback = "";
    let konduktorStatus = "";
    
    const konduktorItem = konduktorMaterial.find(k => 
      k.name?.includes("NFA2X") && k.name?.includes("3x70")
    );
    
    if (konduktorItem) {
      // Jenis benar: +5 poin
      konduktorScore += 5;
      
      const qty = konduktorItem.qty || 0;
      const qtyDiff = Math.abs(qty - 116); // Bandingkan dengan 116 mtr (110 ms + 5%)
      
      if (qty >= 110) {
        // Qty sempurna (110-122 mtr): +3 poin
        konduktorScore += 3;
        konduktorFeedback = "Konduktor sudah sesuai dengan spesifikasi teknis (jenis dan kuantitas tepat).";
        konduktorStatus = "perfect";
      } else if (qty >= 100 && qty < 110) {
        // Qty mendekati tapi kurang: +2 poin
        konduktorScore += 2;
        konduktorFeedback = `Jenis konduktor sudah benar, namun kuantitas ${qty} mtr sedikit kurang dari standar 110 ms (116 mtr). Masih dapat diterima.`;
        konduktorStatus = "partial";
      } else if (qty > 122 && qty <= 130) {
        // Qty mendekati tapi lebih: +2 poin
        konduktorScore += 2;
        konduktorFeedback = `Jenis konduktor sudah benar, namun kuantitas ${qty} mtr sedikit berlebih dari standar 110 ms (116 mtr). Masih dapat diterima.`;
        konduktorStatus = "partial";
      } else if (qty > 90 && qty < 100) {
        // Qty jauh kurang: +1 poin
        konduktorScore += 1;
        konduktorFeedback = `Jenis konduktor sudah benar, namun kuantitas ${qty} mtr kurang dari standar. Seharusnya 110 ms (116 mtr).`;
        konduktorStatus = "partial";
      } else if (qty > 130) {
        // Qty terlalu banyak: +1 poin
        konduktorScore += 1;
        konduktorFeedback = `Jenis konduktor sudah benar, namun kuantitas ${qty} mtr terlalu banyak. Seharusnya 110 ms (116 mtr).`;
        konduktorStatus = "partial";
      } else {
        // Qty sangat tidak sesuai: hanya dapat poin jenis
        konduktorFeedback = `Jenis konduktor benar, namun kuantitas ${qty} mtr sangat tidak sesuai standar 110 ms (116 mtr).`;
        konduktorStatus = "partial";
      }
    } else {
      // Jenis salah atau tidak dipilih
      konduktorFeedback = "Konduktor yang dipilih tidak sesuai spesifikasi. Gunakan NFA2X-T;3x70 + 1x70 mm2 sebanyak 110 ms untuk instalasi ini.";
      konduktorStatus = "wrong";
    }
    
    materialScore += konduktorScore;
    
    materialEval.push({
      label: "Konduktor",
      userAnswer: konduktorMaterial.map(k => `${k.name} (${k.qty} mtr)`).join(", ") || "Tidak dipilih",
      correctAnswer: `${konduktorExpected} (110 ms → 116 mtr)`,
      isCorrect: konduktorScore === 8,
      score: konduktorScore,
      maxScore: 8,
      feedback: konduktorFeedback
    });

    // Tiang Beton (8 poin: 5 untuk jenis, 3 untuk qty)
    const tiangMaterial = materialDetails.tiang || [];
    const tiangExpected = "Tiang beton 9 meter - 200 daN + E";
    const tiangQtyExpected = 3;
    
    let tiangScore = 0;
    let tiangFeedback = "";
    
    const tiangItem = tiangMaterial.find(t => 
      t.name?.includes("9 meter") && t.name?.includes("200 daN")
    );
    
    if (tiangItem) {
      tiangScore += 5; // Jenis benar
      const qty = tiangItem.qty || 0;
      
      if (qty === 3) {
        tiangScore += 3; // Qty sempurna
        tiangFeedback = "Tiang beton sudah sesuai dengan kebutuhan konstruksi (jenis dan kuantitas tepat).";
      } else if (qty === 2 || qty === 4) {
        tiangScore += 2; // Qty mendekati
        tiangFeedback = `Jenis tiang sudah benar, namun kuantitas ${qty} batang ${qty < 3 ? 'kurang' : 'lebih'} 1 dari standar 3 batang. Masih dapat diterima.`;
      } else if (qty === 2 || qty === 6) {
        tiangScore += 1; // Qty cukup jauh
        tiangFeedback = `Jenis tiang sudah benar, namun kuantitas ${qty} batang ${qty < 3 ? 'kurang' : 'berlebih'}. Seharusnya 3 batang.`;
      } else if (qty > 0) {
        tiangFeedback = `Jenis tiang benar, namun kuantitas ${qty} batang sangat tidak sesuai standar 3 batang.`;
      } else {
        tiangFeedback = "Jenis tiang benar, namun kuantitas tidak diisi.";
      }
    } else {
      tiangFeedback = "Tiang beton yang dipilih tidak memenuhi standar. Untuk instalasi ini diperlukan Tiang beton 9 meter - 200 daN + E sebanyak 4 batang.";
    }
    
    materialScore += tiangScore;
    
    materialEval.push({
      label: "Tiang Beton",
      userAnswer: tiangMaterial.map(t => `${t.name} (${t.qty} Btg)`).join(", ") || "Tidak dipilih",
      correctAnswer: `${tiangExpected} (${tiangQtyExpected} Btg)`,
      isCorrect: tiangScore === 8,
      score: tiangScore,
      maxScore: 8,
      feedback: tiangFeedback
    });

    // Conductor Accessories (6 poin)
    const conductorAcc = materialDetails.conductorAccessories || [];
    const conductorAccExpected = "Line Tap Connector Press / CCO 50 - 70 / 50 - 70 mm BERINSULASI PITA";
    const conductorAccMatch = conductorAcc.some(c => 
      c.name?.includes("Line Tap Connector") || c.name?.includes("CCO")
    );
    if (conductorAccMatch) materialScore += 6;
    
    materialEval.push({
      label: "Conductor Accessories",
      userAnswer: conductorAcc.map(c => `${c.name} (${c.qty})`).join(", ") || "Tidak dipilih",
      correctAnswer: `${conductorAccExpected} (4 pcs)`,
      isCorrect: conductorAccMatch,
      feedback: !conductorAccMatch
        ? "Conductor Accessories yang dipilih kurang tepat. Gunakan Line Tap Connector Press / CCO 50-70 / 50-70 mm berinsulasi pita."
        : "Conductor Accessories sudah sesuai standar teknis."
    });

    // Pole Supporter (4 poin)
    const poleSupporter = materialDetails.poleSupporter;
    const poleSupporterCorrect = poleSupporter?.package === "guy_wire_tr";
    if (poleSupporterCorrect) materialScore += 4;
    
    materialEval.push({
      label: "Pole Supporter",
      userAnswer: poleSupporter?.name || "Tidak dipilih",
      correctAnswer: "Guy Wire TR",
      isCorrect: poleSupporterCorrect,
      feedback: !poleSupporterCorrect
        ? "Pole Supporter yang dipilih tidak sesuai. Untuk konstruksi TR gunakan Guy Wire TR sebagai penyangga tiang."
        : "Pole Supporter sudah sesuai dengan kebutuhan konstruksi."
    });

    // Grounding (4 poin)
    const grounding = materialDetails.grounding;
    const groundingCorrect = grounding?.package === "grounding_dalam";
    if (groundingCorrect) materialScore += 4;
    
    materialEval.push({
      label: "Grounding",
      userAnswer: grounding?.name || "Tidak dipilih",
      correctAnswer: "Grounding Dalam",
      isCorrect: groundingCorrect,
      feedback: !groundingCorrect
        ? "Sistem grounding yang dipilih kurang tepat. Gunakan Grounding Dalam untuk instalasi TR yang aman."
        : "Sistem grounding sudah sesuai standar keselamatan."
    });

    // Pondasi (4 poin)
    const pondasi = materialDetails.pondasi;
    const pondasiCorrect = pondasi?.package === "pondasi_type_a";
    if (pondasiCorrect) materialScore += 4;
    
    materialEval.push({
      label: "Pondasi",
      userAnswer: pondasi?.name || "Tidak dipilih",
      correctAnswer: "Pondasi type A (1 tiang)",
      isCorrect: pondasiCorrect,
      feedback: !pondasiCorrect
        ? "Pondasi yang dipilih tidak sesuai. Gunakan Pondasi type A (1 tiang) untuk pondasi tiang."
        : "Pondasi sudah sesuai dengan kebutuhan konstruksi."
    });

    // Kumisan (2 poin: 1 untuk jenis, 1 untuk qty)
    const kumisan = materialDetails.kumisan;
    
    let kumisanScore = 0;
    let kumisanFeedback = "";
    
    if (kumisan?.package === "kumisan") {
      kumisanScore += 1; // Jenis benar
      const qty = kumisan.qty || 0;
      
      if (qty === 4) {
        kumisanScore += 1; // Qty sempurna
        kumisanFeedback = "Paket Kumisan sudah sesuai kebutuhan (jenis dan kuantitas tepat).";
      } else if (qty === 3 || qty === 5) {
        kumisanScore += 0.5; // Qty mendekati
        kumisanFeedback = `Paket Kumisan benar, namun kuantitas ${qty} set ${qty < 4 ? 'kurang' : 'lebih'} dari standar 4 set.`;
      } else if (qty > 0) {
        kumisanFeedback = `Paket Kumisan benar, namun kuantitas ${qty} set tidak sesuai standar 4 set.`;
      } else {
        kumisanFeedback = "Paket Kumisan benar, namun kuantitas tidak diisi.";
      }
    } else {
      kumisanFeedback = "Paket Kumisan yang dipilih tidak tepat. Gunakan Kumisan sebanyak 4 set.";
    }
    
    materialScore += kumisanScore;
    
    materialEval.push({
      label: "Kumisan (Paket)",
      userAnswer: kumisan ? `${kumisan.name} (${kumisan.qty} set)` : "Tidak dipilih",
      correctAnswer: "Kumisan (4 set)",
      isCorrect: kumisanScore === 2,
      score: kumisanScore,
      maxScore: 2,
      feedback: kumisanFeedback
    });

    // Commissioning (2 poin)
    const commissioning = materialDetails.commissioning;
    const commissioningCorrect = commissioning?.package === "commissioning_test";
    if (commissioningCorrect) materialScore += 2;
    
    materialEval.push({
      label: "Commissioning",
      userAnswer: commissioning?.name || "Tidak dipilih",
      correctAnswer: "Opsi Cuma 1",
      isCorrect: commissioningCorrect,
      feedback: !commissioningCorrect
        ? "Paket Commissioning yang dipilih tidak sesuai. Pilih Opsi Cuma 1 untuk pengujian dan komisioning."
        : "Paket Commissioning sudah benar."
    });

    // Pole Top Arrangement (2 poin)
    const poleTop = materialDetails.poleTopArrangement;
    const poleTopCorrect = poleTop?.package === "pole_top_arrangement";
    if (poleTopCorrect) materialScore += 2;
    
    materialEval.push({
      label: "Pole Top Arrangement",
      userAnswer: poleTop?.name || "Tidak dipilih",
      correctAnswer: "Opsi Cuma 1",
      isCorrect: poleTopCorrect,
      feedback: !poleTopCorrect
        ? "Pole Top Arrangement yang dipilih tidak tepat. Pilih Opsi Cuma 1 untuk pengaturan puncak tiang."
        : "Pole Top Arrangement sudah sesuai."
    });

    results.sections.push({
      name: "Kebutuhan Material (MDU)",
      maxScore: 40,
      score: materialScore,
      isCorrect: materialScore === 40,
      details: materialEval
    });

    // 5. EVALUASI KKP (Bobot: 30 poin)
    const kkpData = data.kkpData || {};
    const kkpStatus = kkpData.status_final;
    const kkpMetrics = kkpData.metrics || {};
    
    let kkpScore = 0;
    const kkpEval = [];

    // Status Kelayakan (15 poin)
    const isKkpLayak = kkpStatus === "Layak";
    if (isKkpLayak) kkpScore += 15;
    
    kkpEval.push({
      label: "Status Kelayakan",
      userAnswer: kkpStatus || "Tidak tersedia",
      correctAnswer: "Layak",
      isCorrect: isKkpLayak,
      feedback: !isKkpLayak
        ? `Proyek dinyatakan ${kkpStatus || 'tidak layak'}. ${kkpData.reason || 'Tinjau kembali perhitungan biaya dan kelayakan finansial.'}. Pastikan semua material dan biaya sudah sesuai standar.`
        : "Status kelayakan proyek sudah sesuai dengan kriteria PLN."
    });

    // NPV > 0 (5 poin)
    const npvCorrect = kkpMetrics.npv_mc > 0;
    if (npvCorrect) kkpScore += 5;
    
    kkpEval.push({
      label: "NPV (Net Present Value)",
      userAnswer: kkpMetrics.npv_mc ? `Rp${kkpMetrics.npv_mc.toLocaleString("id-ID")}` : "N/A",
      correctAnswer: "> 0 (Positif)",
      isCorrect: npvCorrect,
      feedback: !npvCorrect
        ? "NPV negatif atau nol menunjukkan proyek tidak menguntungkan secara finansial. Periksa kembali biaya investasi dan proyeksi pendapatan."
        : "NPV positif menunjukkan proyek menguntungkan."
    });

    // IRR > WACC (5 poin)
    const irrCorrect = kkpMetrics.irr_mc > kkpMetrics.wacc;
    if (irrCorrect) kkpScore += 5;
    
    kkpEval.push({
      label: "IRR vs WACC",
      userAnswer: kkpMetrics.irr_mc && kkpMetrics.wacc 
        ? `IRR: ${(kkpMetrics.irr_mc * 100).toFixed(2)}% vs WACC: ${(kkpMetrics.wacc * 100).toFixed(2)}%`
        : "N/A",
      correctAnswer: "IRR > WACC",
      isCorrect: irrCorrect,
      feedback: !irrCorrect
        ? "IRR lebih rendah dari WACC menunjukkan return investasi tidak mencukupi. Evaluasi kembali struktur biaya dan pendapatan."
        : "IRR lebih tinggi dari WACC, menunjukkan investasi menguntungkan."
    });

    // Payback Period <= 5.07 tahun (5 poin)
    const paybackCorrect = kkpMetrics.payback_mc_years_decimal > 0 && 
                          kkpMetrics.payback_mc_years_decimal <= 5.07;
    if (paybackCorrect) kkpScore += 5;
    
    kkpEval.push({
      label: "Payback Period",
      userAnswer: kkpMetrics.payback_mc_text || "N/A",
      correctAnswer: "≤ 5.07 tahun",
      isCorrect: paybackCorrect,
      feedback: !paybackCorrect
        ? `Payback period ${kkpMetrics.payback_mc_text || 'terlalu lama atau tidak valid'}. Periode pengembalian modal tidak boleh melebihi 5.07 tahun.`
        : "Payback period sudah memenuhi kriteria maksimal 5.07 tahun."
    });

    results.sections.push({
      name: "Kriteria Kelayakan Proyek (KKP)",
      maxScore: 30,
      score: kkpScore,
      isCorrect: kkpScore === 30,
      details: kkpEval
    });

    // Hitung total score
    results.totalScore = results.sections.reduce((sum, section) => sum + section.score, 0);
    results.isPerfect = results.totalScore === 100;

    // Tentukan grade dan feedback
    if (results.totalScore >= 95) {
      results.grade = "A+";
      results.feedback = "Sempurna! Anda telah menguasai semua aspek perencanaan elektrifikasi dengan sangat baik.";
    } else if (results.totalScore >= 90) {
      results.grade = "A";
      results.feedback = "Sangat Baik! Pemahaman Anda terhadap perencanaan elektrifikasi sudah sangat komprehensif.";
    } else if (results.totalScore >= 85) {
      results.grade = "A-";
      results.feedback = "Baik Sekali! Anda sudah menguasai sebagian besar konsep dengan baik, namun masih ada beberapa area yang perlu ditingkatkan.";
    } else if (results.totalScore >= 80) {
      results.grade = "B+";
      results.feedback = "Baik! Pemahaman Anda cukup solid, tetapi perlu perhatian lebih pada detail-detail teknis.";
    } else if (results.totalScore >= 75) {
      results.grade = "B";
      results.feedback = "Cukup Baik. Masih ada beberapa konsep yang perlu dipelajari lebih mendalam.";
    } else if (results.totalScore >= 70) {
      results.grade = "B-";
      results.feedback = "Cukup. Anda memahami dasar-dasarnya, namun perlu banyak perbaikan di berbagai aspek.";
    } else if (results.totalScore >= 65) {
      results.grade = "C+";
      results.feedback = "Kurang. Banyak aspek yang perlu diperbaiki dan dipelajari kembali.";
    } else if (results.totalScore >= 60) {
      results.grade = "C";
      results.feedback = "Kurang Memadai. Perlu belajar lebih banyak tentang standar dan prosedur perencanaan.";
    } else {
      results.grade = "D";
      results.feedback = "Tidak Memadai. Disarankan untuk mempelajari kembali semua materi dari awal.";
    }

    return results;
  }, [data]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-sky-50 to-teal-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Memuat data evaluasi...</p>
        </div>
      </div>
    );
  }

  // No data available
  if (!data || !evaluation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-sky-50 to-teal-50">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Data Tidak Tersedia</h2>
          <p className="text-gray-600 mb-6">
            Silakan selesaikan semua form terlebih dahulu untuk melihat skor akhir.
          </p>
          <button
            onClick={() => navigate("/form")}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 px-6 py-3 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali ke Form
          </button>
        </div>
      </div>
    );
  }

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'from-emerald-500 to-green-500';
    if (grade.startsWith('B')) return 'from-blue-500 to-cyan-500';
    if (grade.startsWith('C')) return 'from-amber-500 to-orange-500';
    return 'from-red-500 to-rose-500';
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-sky-50 to-teal-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <button
            onClick={() => navigate("/form")}
            className="flex items-center gap-2 text-emerald-700 hover:text-emerald-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Kembali</span>
          </button>
          
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">
            Final Score & Evaluasi
          </h1>
          <p className="text-gray-600">Hasil evaluasi komprehensif dari simulasi perencanaan elektrifikasi Anda</p>
        </motion.div>

        {/* Score Summary Card */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          className={`rounded-3xl bg-gradient-to-r ${getGradeColor(evaluation.grade)} p-8 mb-8 shadow-2xl`}
        >
          <div className="flex items-center justify-between text-white">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-10 h-10" />
                <h2 className="text-3xl font-bold">Nilai Akhir</h2>
              </div>
              <p className="text-white/90 text-lg mb-4">{evaluation.feedback}</p>
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-white/80 text-sm">Total Score</p>
                  <p className="text-5xl font-bold">{evaluation.totalScore}<span className="text-2xl">/100</span></p>
                </div>
                <div>
                  <p className="text-white/80 text-sm">Grade</p>
                  <p className="text-5xl font-bold">{evaluation.grade}</p>
                </div>
              </div>
            </div>
            {evaluation.isPerfect && (
              <div className="text-right">
                <Trophy className="w-32 h-32 text-yellow-300 animate-pulse" />
                <p className="text-yellow-200 font-bold text-xl mt-2">Perfect Score!</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Sections Breakdown */}
        <div className="space-y-6 mb-8">
          {evaluation.sections.map((section, idx) => (
            <motion.div
              key={section.name}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 + idx * 0.1 }}
              className="rounded-2xl bg-white border-2 border-emerald-200/60 shadow-lg overflow-hidden"
            >
              {/* Section Header */}
              <div className={`px-6 py-4 ${section.isCorrect ? 'bg-gradient-to-r from-emerald-500 to-green-500' : 'bg-gradient-to-r from-gray-500 to-gray-600'}`}>
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    {section.isCorrect ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <XCircle className="w-6 h-6" />
                    )}
                    <h3 className="text-xl font-bold">{section.name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white/80">Score</p>
                    <p className="text-2xl font-bold">{section.score}/{section.maxScore}</p>
                  </div>
                </div>
              </div>

              {/* Section Details */}
              <div className="p-6 space-y-4">
                {section.details.map((detail, detailIdx) => {
                  // Determine status color based on score
                  const hasPartialScore = detail.score !== undefined && detail.maxScore !== undefined;
                  const scorePercentage = hasPartialScore ? (detail.score / detail.maxScore) * 100 : 0;
                  
                  let borderColor, bgColor, iconColor, textColor, feedbackBg, feedbackBorder, feedbackText;
                  
                  if (detail.isCorrect) {
                    // Perfect score
                    borderColor = 'border-emerald-200';
                    bgColor = 'bg-emerald-50/30';
                    iconColor = 'text-emerald-600';
                    textColor = 'text-emerald-700';
                    feedbackBg = 'bg-emerald-100';
                    feedbackBorder = 'border-emerald-200';
                    feedbackText = 'text-emerald-800';
                  } else if (hasPartialScore && detail.score > 0) {
                    // Partial score
                    if (scorePercentage >= 75) {
                      borderColor = 'border-blue-200';
                      bgColor = 'bg-blue-50/30';
                      iconColor = 'text-blue-600';
                      textColor = 'text-blue-700';
                      feedbackBg = 'bg-blue-100';
                      feedbackBorder = 'border-blue-200';
                      feedbackText = 'text-blue-800';
                    } else if (scorePercentage >= 50) {
                      borderColor = 'border-amber-200';
                      bgColor = 'bg-amber-50/30';
                      iconColor = 'text-amber-600';
                      textColor = 'text-amber-700';
                      feedbackBg = 'bg-amber-100';
                      feedbackBorder = 'border-amber-200';
                      feedbackText = 'text-amber-800';
                    } else {
                      borderColor = 'border-orange-200';
                      bgColor = 'bg-orange-50/30';
                      iconColor = 'text-orange-600';
                      textColor = 'text-orange-700';
                      feedbackBg = 'bg-orange-100';
                      feedbackBorder = 'border-orange-200';
                      feedbackText = 'text-orange-800';
                    }
                  } else {
                    // Wrong/no score
                    borderColor = 'border-red-200';
                    bgColor = 'bg-red-50/30';
                    iconColor = 'text-red-600';
                    textColor = 'text-red-700';
                    feedbackBg = 'bg-red-100';
                    feedbackBorder = 'border-red-200';
                    feedbackText = 'text-red-800';
                  }
                  
                  return (
                  <div
                    key={detailIdx}
                    className={`rounded-xl p-4 border-2 ${borderColor} ${bgColor}`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      {detail.isCorrect ? (
                        <CheckCircle2 className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
                      ) : hasPartialScore && detail.score > 0 ? (
                        <AlertCircle className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
                      ) : (
                        <XCircle className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{detail.label}</h4>
                          {hasPartialScore && (
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                              detail.isCorrect 
                                ? 'bg-emerald-500 text-white' 
                                : detail.score > 0 
                                  ? scorePercentage >= 75 
                                    ? 'bg-blue-500 text-white'
                                    : scorePercentage >= 50
                                      ? 'bg-amber-500 text-white'
                                      : 'bg-orange-500 text-white'
                                  : 'bg-red-500 text-white'
                            }`}>
                              {detail.score}/{detail.maxScore} poin
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Jawaban Anda:</p>
                            <p className={`text-sm font-medium ${textColor}`}>
                              {detail.userAnswer}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Jawaban yang Benar:</p>
                            <p className="text-sm font-medium text-gray-900">
                              {detail.correctAnswer}
                            </p>
                          </div>
                        </div>
                        <div className={`rounded-lg p-3 ${feedbackBg} border ${feedbackBorder}`}>
                          <p className={`text-sm ${feedbackText}`}>
                            {detail.feedback}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.8 }}
          className="flex gap-4 justify-center mb-8"
        >
          <button
            onClick={() => navigate("/form")}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
          >
            Coba Lagi
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white border-2 border-emerald-500 text-emerald-700 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
          >
            <Download className="w-5 h-5" />
            Download Laporan
          </button>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.9 }}
          className="rounded-2xl bg-gradient-to-r from-sky-100 to-emerald-100 p-6 border-2 border-sky-200"
        >
          <div className="flex items-start gap-3">
            <Target className="w-6 h-6 text-sky-700 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-sky-900 mb-2">Catatan Penting</h4>
              <p className="text-sm text-sky-800 leading-relaxed">
                Evaluasi ini bertujuan untuk mengukur pemahaman Anda terhadap standar perencanaan elektrifikasi PLN. 
                Setiap kesalahan yang teridentifikasi perlu dipelajari untuk meningkatkan kompetensi. 
                Jika ada pertanyaan, silakan gunakan fitur Help atau konsultasi dengan instruktur.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
