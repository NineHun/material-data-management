import React, { useMemo, useState } from "react";
import { TrendingUp, ArrowLeft, CheckCircle2, XCircle, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function KKP({ data, onBack }) {
  const navigate = useNavigate();
  // Konstanta
  const TAX_RATE = 0.25;
  const BP_MULTIPLIER = 969;
  const REQUIRED_ROE = 0.13;
  const INTEREST_RATE = 0.12;
  const PAYBACK_THRESHOLD = 5;
  
  // Extract data
  const rekapData = data?.rekapData || {};
  const customer = rekapData?.customer || {};
  
  // ========== FUNGSI UTILITY KKP ==========
  
  const hitungKKP = (input) => {
    const {
      daya_awal,
      daya_akhir,
      bp_tariff_per_va,
      ai_rp,
      equity_rp,
      required_roe,
      interest_rate,
      tax_rate = 0.25,
      cashflows_mc,
      override
    } = input;

    // 1) RAB & BP
    const daya_va = daya_akhir - daya_awal;
    const bp_rp = daya_va * bp_tariff_per_va;
    
    // 2) Pembiayaan
    const project_value = ai_rp;
    const debt = project_value - equity_rp;
    const bp_rab_flag = debt < 0;

    // 3) WACC
    const wE = equity_rp / project_value;
    const wD = debt / project_value;
    const wacc = wE * required_roe + (1 - tax_rate) * wD * interest_rate;

    // 4) NPV
    // Excel NPV assumes all cash flows start from period 1 (not period 0)
    // Formula: NPV = sum(CF_t / (1+rate)^t) for t=1 to N
    function calculateNPV(rate, cashflows) {
      return cashflows.reduce((sum, cf, index) => {
        const t = index + 1;  // Period starts from 1, not 0
        return sum + cf / Math.pow(1 + rate, t);
      }, 0);
    }

    // 5) IRR (Newton-Raphson)
    function calculateIRR(cashflows, guess) {
      console.log('🔍 IRR CALCULATION DEBUG:');
      console.log('Cash flows for IRR:', cashflows.slice(0, 6).map(v => v.toLocaleString('id-ID')));
      console.log('Initial guess:', (guess * 100).toFixed(2) + '%');
      
      let rate = guess;
      const maxIter = 100;
      const tolerance = 0.00001;

      for (let i = 0; i < maxIter; i++) {
        let npv = 0;
        let dnpv = 0;

        cashflows.forEach((cf, t) => {
          npv += cf / Math.pow(1 + rate, t);
          dnpv -= t * cf / Math.pow(1 + rate, t + 1);
        });

        if (Math.abs(npv) < tolerance) {
          console.log('IRR converged after', i, 'iterations');
          console.log('Final IRR:', (rate * 100).toFixed(2) + '%');
          break;
        }
        if (dnpv === 0) {
          console.log('IRR calculation failed: derivative = 0');
          return 0;
        }

        rate = rate - npv / dnpv;
      }

      return rate;
    }

    // 6) Payback
    function calculatePayback(cashflows) {
      const N = cashflows.length;
      const cumulative = [];
      
      // Build cumulative array (JUMLAH NET BENEFIT)
      cumulative[0] = cashflows[0];
      for (let t = 1; t < N; t++) {
        cumulative[t] = cumulative[t - 1] + cashflows[t];
      }

      // Count negative periods
      let negCount = 0;
      for (let t = 0; t < N; t++) {
        if (cumulative[t] < 0) negCount++;
      }
      
      // DEBUG PAYBACK
      console.log('🔍 PAYBACK DEBUG:');
      console.log('Cash flows[0-5]:', cashflows.slice(0, 6).map(v => v.toLocaleString('id-ID')));
      console.log('Cumulative[0-5]:', cumulative.slice(0, 6).map(v => v.toLocaleString('id-ID')));
      console.log('Negative count:', negCount);

      // Edge cases
      if (negCount === N) {
        return { decimal: 16.0, years: 16, months: 0, text: "16 thn" };
      }

      if (negCount === 0) {
        return { decimal: 0, years: 0, months: 0, text: "0 thn" };
      }

      // Crossing point: first period where cumulative becomes positive
      const tCross = negCount;  // Period index where it crosses zero
      const negBefore = Math.abs(cumulative[tCross - 1]);  // Negative value before crossing
      const cfNext = cashflows[tCross];  // Cash flow at crossing period

      console.log('tCross (first positive period):', tCross + 1, '(index:', tCross + ')');
      console.log('Cumulative[tCross-1]:', cumulative[tCross - 1].toLocaleString('id-ID'));
      console.log('negBefore:', negBefore.toLocaleString('id-ID'));
      console.log('cfNext:', cfNext.toLocaleString('id-ID'));

      if (cfNext <= 0) {
        return {
          decimal: tCross * 1.0,
          years: tCross,
          months: 0,
          text: `${tCross} thn`
        };
      }

      // Fraction of year needed in the crossing period
      // Formula Excel: fraksi tahun = |kumulatif neg. terakhir| / arus kas periode sesudahnya
      const fracYear = negBefore / cfNext;
      
      // Payback period: tCross is already the period number (1-indexed in Excel, but 0-indexed here)
      // So tCross = 5 means array index 5, which is period 6 in Excel
      // But we want payback in years, and cashflows start from period 1
      // So: payback_years = tCross (as period number) + fracYear
      const pbDecimal = tCross + fracYear;
      
      // Convert to years and months properly
      const pbYears = Math.floor(pbDecimal);
      const pbMonths = Math.round((pbDecimal - pbYears) * 12);
      
      console.log('fracYear:', fracYear.toFixed(4));
      console.log('pbDecimal:', pbDecimal.toFixed(4));
      console.log('pbYears:', pbYears, 'pbMonths:', pbMonths);
      console.log('Result:', `${pbYears} thn ${pbMonths} bln`);

      return {
        decimal: pbDecimal,
        years: pbYears,
        months: pbMonths,
        text: `${pbYears} thn ${pbMonths} bln`
      };
    }

    // Generate cumulative cash flows (Bulan B1-B16) for IRR and NPV
    // Excel uses CUMULATIVE, not direct cash flows!
    const cumulativeCF = [];
    cumulativeCF[0] = cashflows_mc[0];
    for (let i = 1; i < cashflows_mc.length; i++) {
      cumulativeCF[i] = cumulativeCF[i - 1] + cashflows_mc[i];
    }
    
    console.log('📊 CUMULATIVE CASH FLOWS (for IRR/NPV):');
    console.log('First 6:', cumulativeCF.slice(0, 6).map(v => v.toLocaleString('id-ID')));

    const npv_mc = calculateNPV(wacc, cumulativeCF);
    const irr_mc = calculateIRR(cumulativeCF, wacc);
    const payback = calculatePayback(cashflows_mc);

    // 7) Status Decision
    let status_final;
    let branch;
    let reason;

    if (override?.q7 != null && override?.u5 != null && override.q7 === override.u5) {
      status_final = "Override";
      branch = "override";
      reason = "Status mengikuti override dari referensi";
    } else if (bp_rab_flag) {
      status_final = "Tidak Layak";
      branch = "bp_rab";
      reason = "Biaya penyambungan melebihi RAB (debt negatif)";
    } else if (payback.decimal === 0) {
      status_final = "Layak";
      branch = "pb_zero";
      reason = "Payback period instan (langsung balik modal)";
    } else if (
      payback.decimal > 0 &&
      payback.decimal <= 5.07 &&
      npv_mc > 0 &&
      irr_mc > wacc
    ) {
      status_final = "Layak";
      branch = "window_ok";
      reason = "Memenuhi semua kriteria kelayakan finansial";
    } else {
      status_final = "Tidak Layak";
      branch = "not_eligible";
      reason = "Tidak memenuhi kriteria kelayakan (PB>5.07 atau NPV≤0 atau IRR≤WACC)";
    }

    // 8) Badges & Notes
    const badges = [];
    if (irr_mc > wacc) badges.push("IRR>WACC");
    if (npv_mc > 0) badges.push("NPV+");
    if (payback.decimal > 0 && payback.decimal <= 5) badges.push("PB≤5th");
    if (debt >= 0) badges.push("BP≤RAB");

    const notes = [];
    if (payback.decimal > 5) {
      notes.push(`Payback period ${payback.text} melebihi batas maksimal 5 tahun`);
    }
    if (npv_mc <= 0) {
      notes.push("NPV negatif menunjukkan proyek tidak menguntungkan");
    }
    if (irr_mc <= wacc) {
      notes.push("IRR lebih rendah dari WACC (biaya modal)");
    }

    return {
      kkp: {
        status_final,
        branch,
        reason,
        metrics: {
          wacc: Math.round(wacc * 10000) / 10000,
          irr_mc: Math.round(irr_mc * 10000) / 10000,
          npv_mc: Math.round(npv_mc * 10000) / 10000,
          payback_mc_years_decimal: Math.round(payback.decimal * 10000) / 10000,
          payback_mc_text: payback.text,
          debt: Math.round(debt * 10000) / 10000
        },
        rab: {
          daya_akhir,
          daya_awal,
          daya_va,
          bp_rp,
          project_value,
          equity_rp
        },
        badges: badges.slice(0, 4),
        notes: notes.slice(0, 3)
      }
    };
  };

  // ========== GENERATE CASH FLOWS (fallback jika tidak ada data) ==========
  
  const generateCashFlows = (debt, daya) => {
    const flows = [];
    
    // Parameter dari Excel
    const HARGA_JUAL = 1467.28;  // Rp/kWh
    const MC = 540.98;           // Rp/kWh (Marginal Cost)
    const JAM_NYALA = 91;        // jam
    
    // Hitung parameter energi
    const dayaKVA = daya / 1000;  // VA to kVA (10600 -> 10.6)
    const energiJual = dayaKVA * JAM_NYALA * 0.8;  // kWh
    const energiProduksi = energiJual / (1 - 0.025);  // kWh (dengan losses 2.5%)
    
    const equity = potensi_bp;  // Equity = BP
    const nilaiProyek = debt + equity;  // Nilai Proyek
    
    // Hitung BIAYA per bulan (Bulan 1-16)
    const biaya = [];
    
    // Bulan 1: =(Equity) + (1.428571428571428% * Debt) + (Nilai Proyek * 0.02)
    biaya[1] = equity + (0.01428571428571428 * debt) + (nilaiProyek * 0.02);
    
    // Bulan 2: =(61.8655462184874% * Debt) + (Energi Produksi * MC * 12) + (Nilai Proyek * 0.02)
    biaya[2] = (0.618655462184874 * debt) + (energiProduksi * MC * 12) + (nilaiProyek * 0.02);
    
    // Bulan 3: =(48.7058823529412% * Debt) + (Energi Produksi * MC * 12) + (Nilai Proyek * 0.02)
    biaya[3] = (0.487058823529412 * debt) + (energiProduksi * MC * 12) + (nilaiProyek * 0.02);
    
    // Bulan 4-16: =(Energi Produksi * MC * 12) + (Nilai Proyek * 0.02) [KONSTAN]
    const biayaKonstan = (energiProduksi * MC * 12) + (nilaiProyek * 0.02);
    for (let i = 4; i <= 16; i++) {
      biaya[i] = biayaKonstan;
    }
    
    // Hitung NET BENEFIT per bulan (Bulan A1-A16)
    const netBenefit = [];
    
    // Bulan A1: = Equity - Bulan 1
    netBenefit[1] = equity - biaya[1];
    
    // Bulan A2-A16: =(Energi Jual * Harga Jual * 12) - Bulan[i]
    const pendapatanTahunan = energiJual * HARGA_JUAL * 12;
    for (let i = 2; i <= 16; i++) {
      netBenefit[i] = pendapatanTahunan - biaya[i];
    }
    
    // Cash flows untuk IRR/NPV adalah netBenefit (bukan kumulatif)
    // Array dimulai dari index 0
    for (let i = 1; i <= 16; i++) {
      flows.push(netBenefit[i]);
    }
    
    // Debug: Log cash flow generation
    console.log('>>> GENERATE CASH FLOW DEBUG (EXACT EXCEL FORMULA) <<<');
    console.log('Parameters:');
    console.log('  Daya (VA):', daya);
    console.log('  Daya (kVA):', dayaKVA.toFixed(2));
    console.log('  Energi Jual (kWh):', energiJual.toFixed(2));
    console.log('  Energi Produksi (kWh):', energiProduksi.toFixed(2));
    console.log('  Harga Jual (Rp/kWh):', HARGA_JUAL.toLocaleString('id-ID'));
    console.log('  MC (Rp/kWh):', MC.toLocaleString('id-ID'));
    console.log('  Pendapatan Tahunan:', pendapatanTahunan.toLocaleString('id-ID'));
    console.log('');
    console.log('Financing:');
    console.log('  Equity:', equity.toLocaleString('id-ID'));
    console.log('  Debt:', debt.toLocaleString('id-ID'));
    console.log('  Nilai Proyek:', nilaiProyek.toLocaleString('id-ID'));
    console.log('');
    console.log('BIAYA (Bulan 1-4):');
    console.log('  Bulan 1:', biaya[1].toLocaleString('id-ID'));
    console.log('  Bulan 2:', biaya[2].toLocaleString('id-ID'));
    console.log('  Bulan 3:', biaya[3].toLocaleString('id-ID'));
    console.log('  Bulan 4-16 (konstan):', biayaKonstan.toLocaleString('id-ID'));
    console.log('');
    console.log('NET BENEFIT (Bulan A1-A4):');
    console.log('  Bulan A1:', netBenefit[1].toLocaleString('id-ID'));
    console.log('  Bulan A2:', netBenefit[2].toLocaleString('id-ID'));
    console.log('  Bulan A3:', netBenefit[3].toLocaleString('id-ID'));
    console.log('  Bulan A4:', netBenefit[4].toLocaleString('id-ID'));
    console.log('');
    console.log('Cash Flows (first 6 periods):', flows.slice(0, 6).map(v => v.toLocaleString('id-ID')));
    console.log('Total periods:', flows.length);
    
    return flows;
  };

  // ========== PREPARE INPUT DATA ==========
  
  const dayaAwal = 0;
  const dayaAkhir = parseInt(customer?.daya?.replace(/[^0-9]/g, '')) || 10600;
  const daya = dayaAkhir - dayaAwal;
  const potensi_bp = daya * BP_MULTIPLIER;
  
  // Nilai Proyek = Total Investasi + 3.300.000 (sesuai Excel)
  const totalInvestasi = rekapData?.totalAfterPpn || 37296104;
  const nilai_proyek = totalInvestasi + 3300000;
  
  const equity = potensi_bp;
  const debt = nilai_proyek - equity;

  // Check if cash flows are provided in data, otherwise generate
  const cashflows_mc = data?.cashflows_mc || generateCashFlows(debt, daya);

  const input = {
    daya_awal: dayaAwal,
    daya_akhir: dayaAkhir,
    bp_tariff_per_va: BP_MULTIPLIER,
    ai_rp: nilai_proyek,
    equity_rp: equity,
    required_roe: REQUIRED_ROE,
    interest_rate: INTEREST_RATE,
    tax_rate: TAX_RATE,
    cashflows_mc: cashflows_mc,
    override: data?.override || null
  };

  // ========== CALCULATE KKP ==========
  
  const result = useMemo(() => hitungKKP(input), [nilai_proyek, equity, JSON.stringify(cashflows_mc)]);
  const { kkp } = result;

  // Debug logging
  console.log('=== KKP CALCULATION DEBUG ===');
  console.log('Input:', {
    nilai_proyek: nilai_proyek.toLocaleString('id-ID'),
    equity: equity.toLocaleString('id-ID'),
    debt: kkp.metrics.debt.toLocaleString('id-ID'),
    daya: daya + ' VA'
  });
  console.log('Cash Flow MC (first 3):', cashflows_mc.slice(0, 3).map(v => v.toLocaleString('id-ID')));
  console.log('Metrics:', {
    wacc: (kkp.metrics.wacc * 100).toFixed(2) + '%',
    irr_mc: (kkp.metrics.irr_mc * 100).toFixed(2) + '%',
    npv_mc: 'Rp ' + Math.round(kkp.metrics.npv_mc).toLocaleString('id-ID'),
    payback: kkp.metrics.payback_mc_text
  });
  console.log('Status:', kkp.status_final, `(${kkp.branch})`);
  console.log('Reason:', kkp.reason);
  console.log('============================');

  const isLayak = kkp.status_final === "Layak";
  
  // Kriteria kelayakan untuk indikator
  const criteria = {
    debtValid: kkp.metrics.debt >= 0,
    paybackValid: kkp.metrics.payback_mc_years_decimal > 0 && kkp.metrics.payback_mc_years_decimal <= PAYBACK_THRESHOLD,
    npvValid: kkp.metrics.npv_mc > 0,
    irrValid: kkp.metrics.irr_mc > kkp.metrics.wacc
  };
  
  // Format helpers
  const fmt = (v) => (v !== undefined && v !== null ? `Rp${Math.round(v).toLocaleString("id-ID")}` : "-");
  const pct = (v) => (v !== undefined && v !== null ? `${(v * 100).toFixed(2)}%` : "-");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Rekap
          </button>
          <h2 className="text-2xl font-bold text-gray-800">
            Kajian Kelayakan Proyek (KKP)
          </h2>
        </div>
      </div>

      {/* Status Banner */}
      <div className={`rounded-xl border px-6 py-4 ${
        isLayak 
          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
          : 'bg-red-50 border-red-200 text-red-800'
      }`}>
        <div className="flex items-center gap-3">
          <TrendingUp className="h-6 w-6" />
          <div>
            <div className="font-semibold text-lg">Status Kelayakan Investasi: {kkp.status_final}</div>
            <div className="text-sm mt-1">{kkp.reason}</div>
          </div>
        </div>
      </div>

      {/* Tombol Final Score */}
      <div className="flex justify-center">
        <button
          onClick={() => {
            // Simpan kkpData ke sessionStorage untuk Final Score
            try {
              sessionStorage.setItem("kkpDataForScore", JSON.stringify(kkp));
            } catch {}
            navigate("/final-score");
          }}
          className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/40 hover:scale-105 transition-all"
        >
          <Trophy className="h-6 w-6" />
          Lihat Skor Akhir
        </button>
      </div>

      {/* Indikator Kriteria Kelayakan */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">Kriteria Kelayakan (Semua harus ✓)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Kriteria 1: Debt Valid */}
          <div className="flex items-start gap-3">
            {criteria.debtValid ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <div className="font-medium text-sm flex items-center gap-1">
                <span className="text-emerald-600">BP</span>
                {' ≤ '}
                <span className="text-emerald-600">RAB</span>
                {' (Debt ≥ 0)'}
              </div>
              <div className="text-xs text-gray-500 italic mt-0.5">
                BP (Biaya Penyambungan) ≤ RAB (Rencana Anggaran Biaya)
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Debt: {fmt(kkp.metrics.debt)} {criteria.debtValid ? '✓' : '✗'}
              </div>
            </div>
          </div>

          {/* Kriteria 2: Payback */}
          <div className="flex items-start gap-3">
            {criteria.paybackValid ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <div className="font-medium text-sm">Payback Period ≤ 5 tahun</div>
              <div className="text-xs text-gray-600 mt-1">
                Aktual: {kkp.metrics.payback_mc_text} ({kkp.metrics.payback_mc_years_decimal.toFixed(2)} thn) {criteria.paybackValid ? '✓' : '✗'}
              </div>
            </div>
          </div>

          {/* Kriteria 3: NPV */}
          <div className="flex items-start gap-3">
            {criteria.npvValid ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <div className="font-medium text-sm flex items-center gap-1">
                <span className="text-emerald-600">NPV</span>
                {' > 0'}
              </div>
              <div className="text-xs text-gray-500 italic mt-0.5">
                NPV (Net Present Value - Nilai Sekarang Bersih)
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Aktual: {fmt(kkp.metrics.npv_mc)} {criteria.npvValid ? '✓' : '✗'}
              </div>
            </div>
          </div>

          {/* Kriteria 4: IRR */}
          <div className="flex items-start gap-3">
            {criteria.irrValid ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <div className="font-medium text-sm flex items-center gap-1">
                <span className="text-emerald-600">IRR</span>
                {' > '}
                <span className="text-emerald-600">WACC</span>
              </div>
              <div className="text-xs text-gray-500 italic mt-0.5">
                IRR (Internal Rate of Return) &gt; WACC (Weighted Average Cost of Capital)
              </div>
              <div className="text-xs text-gray-600 mt-1">
                IRR: {pct(kkp.metrics.irr_mc)} vs WACC: {pct(kkp.metrics.wacc)} {criteria.irrValid ? '✓' : '✗'}
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {kkp.notes.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm font-medium text-gray-700 mb-2">Catatan:</div>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              {kkp.notes.map((note, idx) => (
                <li key={idx}>{note}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Informasi Pelanggan */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">Informasi Pelanggan</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-600">Nama</div>
            <div className="font-medium">{customer?.nama || '-'}</div>
          </div>
          <div>
            <div className="text-gray-600">Alamat</div>
            <div className="font-medium">{customer?.alamat || '-'}</div>
          </div>
          <div>
            <div className="text-gray-600">No. WO</div>
            <div className="font-medium">{customer?.noWO || '-'}</div>
          </div>
          <div>
            <div className="text-gray-600">Tahun Anggaran</div>
            <div className="font-medium">{customer?.year || '-'}</div>
          </div>
        </div>
      </div>

      {/* Input Dasar & RAB */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-2">
          Input Dasar & <span className="text-emerald-600">RAB</span>
        </h3>
        <p className="text-xs text-gray-500 italic mb-4">
          RAB = Rencana Anggaran Biaya
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Parameter</th>
                <th className="px-4 py-2 text-right">Nilai</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2">Daya Awal (VA)</td>
                <td className="px-4 py-2 text-right">{kkp.rab.daya_awal.toLocaleString("id-ID")}</td>
              </tr>
              <tr>
                <td className="px-4 py-2">Daya Akhir (VA)</td>
                <td className="px-4 py-2 text-right">{kkp.rab.daya_akhir.toLocaleString("id-ID")}</td>
              </tr>
              <tr className="bg-gray-50 font-semibold">
                <td className="px-4 py-2">Daya (VA)</td>
                <td className="px-4 py-2 text-right">{kkp.rab.daya_va.toLocaleString("id-ID")}</td>
              </tr>
              <tr>
                <td className="px-4 py-2">
                  Potensi <span className="text-emerald-600">BP</span>
                  <span className="text-xs text-gray-500 italic ml-1">(Biaya Penyambungan)</span>
                </td>
                <td className="px-4 py-2 text-right">{fmt(kkp.rab.bp_rp)}</td>
              </tr>
              <tr>
                <td className="px-4 py-2">Nilai Investasi</td>
                <td className="px-4 py-2 text-right">{fmt(rekapData?.totalAfterPpn || 0)}</td>
              </tr>
              <tr className="bg-emerald-50 font-semibold">
                <td className="px-4 py-2">Nilai Proyek (AI)</td>
                <td className="px-4 py-2 text-right">{fmt(kkp.rab.project_value)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Struktur Pembiayaan */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">Struktur Pembiayaan</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Komponen</th>
                <th className="px-4 py-2 text-right">Nilai</th>
                <th className="px-4 py-2 text-right">Proporsi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2">Equity (Modal Sendiri)</td>
                <td className="px-4 py-2 text-right">{fmt(kkp.rab.equity_rp)}</td>
                <td className="px-4 py-2 text-right">
                  {((kkp.rab.equity_rp / kkp.rab.project_value) * 100).toFixed(2)}%
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2">Debt (Pinjaman)</td>
                <td className="px-4 py-2 text-right">{fmt(kkp.metrics.debt)}</td>
                <td className="px-4 py-2 text-right">
                  {((kkp.metrics.debt / kkp.rab.project_value) * 100).toFixed(2)}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">Metrik Finansial (Marginal Cost Scenario)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-xs text-blue-600 font-medium mb-1">
              WACC
            </div>
            <div className="text-[10px] text-blue-500 italic -mt-0.5 mb-1">
              Weighted Average Cost of Capital
            </div>
            <div className="text-lg font-bold text-blue-900">{pct(kkp.metrics.wacc)}</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-xs text-purple-600 font-medium mb-1">
              IRR
            </div>
            <div className="text-[10px] text-purple-500 italic -mt-0.5 mb-1">
              Internal Rate of Return
            </div>
            <div className="text-lg font-bold text-purple-900">{pct(kkp.metrics.irr_mc)}</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-xs text-green-600 font-medium mb-1">
              NPV
            </div>
            <div className="text-[10px] text-green-500 italic -mt-0.5 mb-1">
              Net Present Value
            </div>
            <div className="text-lg font-bold text-green-900">{fmt(kkp.metrics.npv_mc)}</div>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <div className="text-xs text-orange-600 font-medium mb-1">Payback Period</div>
            <div className="text-lg font-bold text-orange-900">{kkp.metrics.payback_mc_text}</div>
          </div>
        </div>
      </div>

      {/* Badges */}
      {kkp.badges.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {kkp.badges.map((badge, idx) => (
            <span key={idx} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
              {badge}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
