import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Zap } from "lucide-react";
import { motion } from "framer-motion";
import { SR_PACKAGES, APP_PACKAGES } from "../../constants/sarItems";
import SelectDown from "../ui/SelectDown";

const clsInput = "w-full h-11 rounded-xl border border-gray-200 px-3.5 text-[15px] focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400";
const clsSelect = "w-full h-11 rounded-xl border border-gray-200 bg-white px-3.5 text-[15px] outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400";
const clsLabel = "mb-1.5 block text-sm font-medium text-gray-700";

export default forwardRef(function SarSelection(props, ref) {
  const { onValidate } = props;

  const [selectedSrPackage, setSelectedSrPackage] = useState("");
  const [srSetQty, setSrSetQty] = useState(1);
  const [selectedAppPackage, setSelectedAppPackage] = useState("");
  const [appSetQty, setAppSetQty] = useState(1);
  
  // State untuk konduktor NFA 2X - T 4 x 35 mm²
  const [konduktorQtyMs, setKonduktorQtyMs] = useState(25); // Default 25 ms

  useEffect(() => {
    if (onValidate) {
      // Validasi: semua bagian harus diisi
      const hasSrPackage = selectedSrPackage !== "" && srSetQty > 0;
      const hasAppPackage = selectedAppPackage !== "" && appSetQty > 0;
      const hasKonduktor = konduktorQtyMs > 0;
      
      const isValid = hasSrPackage && hasAppPackage && hasKonduktor;
      onValidate(isValid);
    }
  }, [selectedSrPackage, srSetQty, selectedAppPackage, appSetQty, konduktorQtyMs, onValidate]);

  const calculateTotals = () => {
    let srMaterial = 0;
    let srJasa = 0;
    let appMaterial = 0;
    let appJasa = 0;
    const srDetails = [];
    const appDetails = [];

    if (selectedSrPackage && SR_PACKAGES[selectedSrPackage]) {
      const pkg = SR_PACKAGES[selectedSrPackage];
      const qty = Number(srSetQty) || 0;
      const totalPrice = pkg.price * qty;

      srJasa += totalPrice;

      srDetails.push({
        packageKey: selectedSrPackage,
        packageName: pkg.name,
        setQty: qty,
        pricePerSet: pkg.price,
        totalPrice: totalPrice,
        materials: pkg.materials.map((mat) => ({
          name: mat.name,
          qtyPerSet: mat.qty,
          totalQty: mat.qty * qty,
          unit: mat.unit,
        })),
      });
    }

    // Hitung konduktor NFA 2X - T 4 x 35 mm²
    const konduktorPrice = 32630;
    const qtyMs = Number(konduktorQtyMs) || 0;
    const qtyMtr = Math.round(qtyMs * 1.05); // Konversi: ms + 5% = mtr, dibulatkan
    const konduktorTotalPrice = konduktorPrice * qtyMtr;
    
    if (qtyMs > 0) {
      srMaterial += konduktorTotalPrice;
    }

    if (selectedAppPackage && APP_PACKAGES[selectedAppPackage]) {
      const pkg = APP_PACKAGES[selectedAppPackage];
      const qty = Number(appSetQty) || 0;
      const totalPrice = pkg.price * qty;

      appJasa += totalPrice;

      appDetails.push({
        packageKey: selectedAppPackage,
        packageName: pkg.name,
        setQty: qty,
        pricePerSet: pkg.price,
        totalPrice: totalPrice,
        materials: pkg.materials.map((mat) => ({
          name: mat.name,
          qtyPerSet: mat.qty,
          totalQty: mat.qty * qty,
          unit: mat.unit,
        })),
      });
    }

    return {
      srMaterial,
      srJasa,
      appMaterial,
      appJasa,
      totalMaterial: srMaterial + appMaterial,
      totalJasa: srJasa + appJasa,
      details: { 
        sr: srDetails, 
        app: appDetails,
        konduktor: qtyMs > 0 ? {
          name: "NFA 2X - T 4 x 35 mm²",
          qtyMs: qtyMs,
          qtyMtr: qtyMtr,
          unitPrice: konduktorPrice,
          totalPrice: konduktorTotalPrice,
          unit: "mtr"
        } : null
      },
    };
  };

  useImperativeHandle(ref, () => ({
    getTotals: calculateTotals,
  }));

  const konduktorPrice = 32630;
  const qtyMs = Number(konduktorQtyMs) || 0;
  const qtyMtr = Math.round(qtyMs * 1.05);
  const konduktorTotalCost = konduktorPrice * qtyMtr;

  // Total untuk SR Package saja (tanpa konduktor)
  const totalCostSrPackage = selectedSrPackage && srSetQty > 0
    ? SR_PACKAGES[selectedSrPackage].price * srSetQty
    : 0;
  
  // Total SR keseluruhan (package + konduktor)
  const totalCostSr = totalCostSrPackage + konduktorTotalCost;

  const totalCostApp = selectedAppPackage && appSetQty > 0
    ? APP_PACKAGES[selectedAppPackage].price * appSetQty
    : 0;

  const totalCost = totalCostSr + totalCostApp;

  return (
    <motion.section
      whileHover={{ boxShadow: "0 12px 48px 0 rgba(16,185,129,0.16)" }}
      className="w-full rounded-3xl border-2 border-emerald-200/60 bg-gradient-to-br from-white via-emerald-50/30 to-white shadow-xl"
      style={{ boxShadow: "0 8px 32px 0 rgba(16,185,129,0.12)" }}
    >
      {/* Header with enhanced gradient */}
      <div className="flex items-center gap-4 rounded-t-3xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-sky-500 px-6 py-5 shadow-lg">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/20 backdrop-blur-sm text-white shadow-lg">
          <Zap className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-white flex-1 tracking-wide">
          Pemasangan SR & APP
        </h3>
      </div>

      {/* Body */}
      <div className="p-6 md:p-8 space-y-8">
        {/* Section: SR */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-1 w-1 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500"></div>
            <h4 className="text-base font-bold bg-gradient-to-r from-emerald-700 to-sky-600 bg-clip-text text-transparent">
              Pemasangan SR
            </h4>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={clsLabel}>Pilih Paket SR</label>
                <SelectDown
                  className={clsSelect + " hover:border-emerald-400 transition-all duration-300"}
                  value={selectedSrPackage}
                  onChange={(e) => setSelectedSrPackage(e.target.value)}
                >
                  <option value="" disabled hidden>— Pilih Paket SR —</option>
                  {Object.entries(SR_PACKAGES).map(([key, pkg]) => (
                    <option key={key} value={key}>
                      {pkg.name}
                    </option>
                  ))}
                </SelectDown>
              </div>
              <div>
                <label className={clsLabel}>Jumlah Set</label>
                <input
                  type="number"
                  min="0"
                  className={clsInput + " hover:border-emerald-400 transition-all duration-300"}
                  value={srSetQty}
                  onChange={(e) => setSrSetQty(Number(e.target.value))}
                  placeholder="Masukkan jumlah set"
                />
              </div>
            </div>

            {selectedSrPackage && SR_PACKAGES[selectedSrPackage] && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-sky-50/50 p-5 shadow-md"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h5 className="text-sm font-bold text-emerald-900">
                    {SR_PACKAGES[selectedSrPackage]?.name}
                  </h5>
                  <span className="rounded-full bg-white px-4 py-1.5 text-sm font-bold text-emerald-700 shadow-sm border border-emerald-200">
                    Rp{SR_PACKAGES[selectedSrPackage]?.price.toLocaleString("id-ID")}
                    {srSetQty > 0 && ` × ${srSetQty} = Rp${totalCostSrPackage.toLocaleString("id-ID")}`}
                  </span>
                </div>
                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b-2 border-emerald-200 text-gray-600">
                        <th className="py-2.5 text-left font-semibold">Material</th>
                        <th className="py-2.5 text-center w-20 font-semibold">Volume (qty)</th>
                        {srSetQty > 0 && <th className="py-2.5 text-center w-24 font-semibold">Total Qty</th>}
                        <th className="py-2.5 text-center w-20 font-semibold">Satuan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SR_PACKAGES[selectedSrPackage]?.materials.map((mat, idx) => (
                        <tr key={idx} className="border-b border-emerald-100 hover:bg-emerald-50/50 transition-colors">
                          <td className="py-2.5 text-gray-700">{mat.name}</td>
                          <td className="py-2.5 text-center text-gray-700">{mat.qty}</td>
                          {srSetQty > 0 && (
                            <td className="py-2.5 text-center text-emerald-700 font-bold">
                              {mat.qty * srSetQty}
                            </td>
                          )}
                          <td className="py-2.5 text-center text-gray-700">{mat.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
            
            {selectedSrPackage && (
              <div className="rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 p-[2px] shadow-lg">
                <div className="rounded-xl bg-white px-5 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-emerald-800">Total SR:</span>
                    <span className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">
                      Rp{totalCostSr.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Input Konduktor NFA 2X - T 4 x 35 mm² */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border-2 border-sky-200 bg-gradient-to-br from-sky-50 to-emerald-50/50 p-5 shadow-md space-y-4"
            >
              <div className="flex items-center gap-2">
                <div className="h-8 w-1 bg-gradient-to-b from-sky-500 to-emerald-500 rounded-full"></div>
                <h5 className="text-sm font-bold text-sky-900">
                  Konduktor NFA 2X - T 4 x 35 mm²
                </h5>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={clsLabel}>Qty (ms)</label>
                  <input
                    type="number"
                    min="0"
                    className={clsInput + " hover:border-sky-400 transition-all duration-300"}
                    value={konduktorQtyMs}
                    onChange={(e) => setKonduktorQtyMs(Number(e.target.value))}
                    placeholder="Masukkan qty dalam ms"
                  />
                </div>
                <div>
                  <label className={clsLabel}>Qty (mtr) - setelah +5%</label>
                  <input
                    type="text"
                    className={clsInput + " bg-gradient-to-r from-sky-50 to-emerald-50 text-sky-700 font-semibold"}
                    value={Math.round(konduktorQtyMs * 1.05)}
                    readOnly
                  />
                </div>
              </div>
              <div className="rounded-xl bg-white p-4 shadow-sm border border-sky-100">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-sky-200 text-gray-600">
                      <th className="py-2.5 text-left font-semibold">Material</th>
                      <th className="py-2.5 text-center w-20 font-semibold">Qty (ms)</th>
                      <th className="py-2.5 text-center w-24 font-semibold">Qty (mtr)</th>
                      <th className="py-2.5 text-center w-20 font-semibold">Satuan</th>
                      <th className="py-2.5 text-right w-32 font-semibold">Harga Satuan</th>
                      <th className="py-2.5 text-right w-32 font-semibold">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-sky-100 hover:bg-sky-50/50 transition-colors">
                      <td className="py-2.5 text-gray-700 font-medium">NFA 2X - T 4 x 35 mm²</td>
                      <td className="py-2.5 text-center text-gray-700">{konduktorQtyMs}</td>
                      <td className="py-2.5 text-center text-sky-700 font-bold">
                        {Math.round(konduktorQtyMs * 1.05)}
                      </td>
                      <td className="py-2.5 text-center text-gray-700">mtr</td>
                      <td className="py-2.5 text-right text-gray-700">
                        Rp{(32630).toLocaleString("id-ID")}
                      </td>
                      <td className="py-2.5 text-right text-sky-700 font-bold">
                        Rp{(32630 * Math.round(konduktorQtyMs * 1.05)).toLocaleString("id-ID")}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Section: APP */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-1 w-1 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500"></div>
            <h4 className="text-base font-bold bg-gradient-to-r from-sky-700 to-emerald-600 bg-clip-text text-transparent">
              Pemasangan APP
            </h4>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={clsLabel}>Pilih Paket APP</label>
                <SelectDown
                  className={clsSelect + " hover:border-sky-400 transition-all duration-300"}
                  value={selectedAppPackage}
                  onChange={(e) => setSelectedAppPackage(e.target.value)}
                >
                  <option value="" disabled hidden>— Pilih Paket APP —</option>
                  {Object.entries(APP_PACKAGES).map(([key, pkg]) => (
                    <option key={key} value={key}>
                      {pkg.name}
                    </option>
                  ))}
                </SelectDown>
              </div>
              <div>
                <label className={clsLabel}>Jumlah Set</label>
                <input
                  type="number"
                  min="0"
                  className={clsInput + " hover:border-sky-400 transition-all duration-300"}
                  value={appSetQty}
                  onChange={(e) => setAppSetQty(Number(e.target.value))}
                  placeholder="Masukkan jumlah set"
                />
              </div>
            </div>

            {selectedAppPackage && APP_PACKAGES[selectedAppPackage] && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border-2 border-sky-200 bg-gradient-to-br from-sky-50 to-emerald-50/50 p-5 shadow-md"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h5 className="text-sm font-bold text-sky-900">
                    {APP_PACKAGES[selectedAppPackage]?.name}
                  </h5>
                  <span className="rounded-full bg-white px-4 py-1.5 text-sm font-bold text-sky-700 shadow-sm border border-sky-200">
                    Rp{APP_PACKAGES[selectedAppPackage]?.price.toLocaleString("id-ID")}
                    {appSetQty > 0 && ` × ${appSetQty} = Rp${totalCostApp.toLocaleString("id-ID")}`}
                  </span>
                </div>
                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b-2 border-sky-200 text-gray-600">
                        <th className="py-2.5 text-left font-semibold">Material</th>
                        <th className="py-2.5 text-center w-20 font-semibold">Volume (qty)</th>
                        {appSetQty > 0 && <th className="py-2.5 text-center w-24 font-semibold">Total Qty</th>}
                        <th className="py-2.5 text-center w-20 font-semibold">Satuan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {APP_PACKAGES[selectedAppPackage]?.materials.map((mat, idx) => (
                        <tr key={idx} className="border-b border-sky-100 hover:bg-sky-50/50 transition-colors">
                          <td className="py-2.5 text-gray-700">{mat.name}</td>
                          <td className="py-2.5 text-center text-gray-700">{mat.qty}</td>
                          {appSetQty > 0 && (
                            <td className="py-2.5 text-center text-sky-700 font-bold">
                              {mat.qty * appSetQty}
                            </td>
                          )}
                          <td className="py-2.5 text-center text-gray-700">{mat.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
            
            {selectedAppPackage && (
              <div className="rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 p-[2px] shadow-lg">
                <div className="rounded-xl bg-white px-5 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-sky-800">Total APP:</span>
                    <span className="text-lg font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
                      Rp{totalCostApp.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer dengan total keseluruhan */}
      {totalCost > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-b-3xl border-t-2 border-emerald-200 bg-gradient-to-r from-emerald-500 via-emerald-600 to-sky-500 px-6 py-5 shadow-lg"
        >
          <div className="flex justify-between items-center">
            <span className="text-base font-bold text-white tracking-wide">Total Biaya SR & APP:</span>
            <span className="text-2xl font-bold text-white drop-shadow-lg">
              Rp{totalCost.toLocaleString("id-ID")}
            </span>
          </div>
        </motion.div>
      )}
    </motion.section>
  );
});
