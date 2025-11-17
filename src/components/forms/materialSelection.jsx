import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { PackagePlus, MinusCircle, Zap, Building2, Anchor, Layers, Box } from "lucide-react";
import { motion } from "framer-motion";
import { MATS_ITEMS, POLE_SUPPORTER_PACKAGES, GROUNDING_PACKAGES, PONDASI_PACKAGES, CONDUCTOR_ACCESSORIES_PACKAGES, COMMISSIONING_PACKAGE, POLE_TOP_ARRANGEMENT_PACKAGE } from "../../constants/matsItems";
import SelectDown from "../ui/SelectDown";
import {
  EXPECTED_KONDUKTOR,
  EXPECTED_TIANG_BETON,
} from "../../constants/expectedAnswerMats";

// tema select/input mengikuti SarSelection
const clsSelect =
  "w-full h-11 rounded-xl border border-gray-200 bg-white px-3.5 text-[15px] outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 overflow-hidden whitespace-nowrap text-ellipsis";
const clsInput =
  "w-full h-11 rounded-xl border border-gray-200 px-3.5 text-[15px] focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400";

// ForwardRef agar parent bisa memanggil fillExpected untuk mode cheat
export default forwardRef(function MaterialSelection({ onValidate }, ref) {
  // Collapse dihilangkan: konten selalu terlihat
  // separate rows for each category
  const [rowsKonduktor, setRowsKonduktor] = useState([]);
  const [selectedPoleSupporter, setSelectedPoleSupporter] = useState(""); // Pilihan paket Pole Supporter
  const [rowsTiang, setRowsTiang] = useState([]);
  const [selectedGrounding, setSelectedGrounding] = useState(""); // Pilihan paket Grounding
  const [selectedPondasi, setSelectedPondasi] = useState(""); // Pilihan paket Pondasi
  const [rowsConductorAccessories, setRowsConductorAccessories] = useState([]); // Rows untuk Conductor Accessories
  const [selectedKumisan, setSelectedKumisan] = useState(""); // Pilihan paket Kumisan
  const [qtyKumisan, setQtyKumisan] = useState(4); // Default qty untuk Kumisan adalah 4
  const [selectedCommissioning, setSelectedCommissioning] = useState(""); // Pilihan paket Commissioning
  const [selectedPoleTopArrangement, setSelectedPoleTopArrangement] = useState(""); // Pilihan paket Pole Top Arrangement

  // Filter items by category
  const itemsKonduktor = MATS_ITEMS.filter((it) => it.category === "konduktor");
  const itemsTiang = MATS_ITEMS.filter((it) => it.category === "tiang");
  const itemsConductorAccessories = MATS_ITEMS.filter((it) => it.category === "conductor_accessories");

  // helper normalisasi nama (lebih robust) → sama dengan di versi cheat
  const norm = (s) =>
    String(s || "")
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u2010-\u2015]/g, "-") // variasi dash jadi hyphen
      .replace(/[^a-z0-9+./ -]/g, " ") // buang simbol asing kecuali + . / - spasi
      .replace(/\s+/g, " ")
      .trim();
  const findIdByName = (name) => {
    const n = norm(name);
    // exact match
  let it = MATS_ITEMS.find((x) => norm(x.name) === n);
    if (it) return String(it.id);
    // fuzzy: contains
  const cands = MATS_ITEMS.filter((x) => {
      const nx = norm(x.name);
      return nx.includes(n) || n.includes(nx);
    });
    cands.sort((a, b) => norm(b.name).length - norm(a.name).length);
    if (cands[0]) return String(cands[0].id);
    return "";
  };

  // expose methods to parent via ref: auto‑fill expected answers and get totals
  useImperativeHandle(ref, () => ({
    fillExpected: () => {
      const konduktor = EXPECTED_KONDUKTOR.map((e) => ({
        itemId: findIdByName(e.name),
        qty: e.qty,
      })).filter((r) => r.itemId);
      const tiang = EXPECTED_TIANG_BETON.map((e) => ({
        itemId: findIdByName(e.name),
        qty: e.qty,
      })).filter((r) => r.itemId);
      setRowsKonduktor(konduktor);
      setRowsTiang(tiang);
    },
    getTotals: () => {
      // map ke detail
      const mapDetail = (rows, isKonduktor = false) =>
        rows
          .map((r) => {
            const item = MATS_ITEMS.find((it) => String(it.id) === String(r.itemId));
            const qtyInput = Number(r.qty) || 0;
            // Untuk konduktor, qty dikalikan 1.05 (ms + 5% = mtr) dan dibulatkan
            const qty = isKonduktor ? Math.round(qtyInput * 1.05) : qtyInput;
            const unitPrice = item?.price || 0;
            return {
              id: item?.id,
              name: item?.name || "",
              unit: item?.unit || "-",
              qty,
              unitPrice,
              subtotal: unitPrice * qty,
            };
          })
          .filter((d) => d.id && d.qty > 0);

  const detKonduktor = mapDetail(rowsKonduktor, true);
  const detTiang = mapDetail(rowsTiang, false);
  const detConductorAccessories = mapDetail(rowsConductorAccessories, false);

  const totalKonduktor = detKonduktor.reduce((s, d) => s + d.subtotal, 0);
    const totalTiang = detTiang.reduce((s, d) => s + d.subtotal, 0);
    const totalConductorAccessories = detConductorAccessories.reduce((s, d) => s + d.subtotal, 0);
    
      // Pole Supporter total
      const totalPoleSupporter = selectedPoleSupporter 
        ? POLE_SUPPORTER_PACKAGES[selectedPoleSupporter]?.price || 0 
        : 0;
      
      // Grounding total
      const totalGrounding = selectedGrounding 
        ? GROUNDING_PACKAGES[selectedGrounding]?.price || 0 
        : 0;
      
      // Pondasi total
      const totalPondasi = selectedPondasi 
        ? PONDASI_PACKAGES[selectedPondasi]?.price || 0 
        : 0;

      // Kumisan total (harga paket dikali qty)
      const totalKumisan = selectedKumisan 
        ? (CONDUCTOR_ACCESSORIES_PACKAGES[selectedKumisan]?.price || 0) * qtyKumisan
        : 0;

      // Commissioning total
      const totalCommissioning = selectedCommissioning 
        ? COMMISSIONING_PACKAGE[selectedCommissioning]?.price || 0 
        : 0;

      // Pole Top Arrangement total
      const totalPoleTopArrangement = selectedPoleTopArrangement 
        ? POLE_TOP_ARRANGEMENT_PACKAGE[selectedPoleTopArrangement]?.price || 0 
        : 0;

      return {
        konduktor: totalKonduktor,
        poleSupporter: totalPoleSupporter,
        tiang: totalTiang,
    grounding: totalGrounding,
    pondasi: totalPondasi,
    conductorAccessories: totalConductorAccessories,
    kumisan: totalKumisan,
    commissioning: totalCommissioning,
    poleTopArrangement: totalPoleTopArrangement,
    total: totalKonduktor + totalPoleSupporter + totalTiang + totalGrounding + totalPondasi + totalConductorAccessories + totalKumisan + totalCommissioning + totalPoleTopArrangement,
  details: { 
          konduktor: detKonduktor, 
          poleSupporter: selectedPoleSupporter ? {
            package: selectedPoleSupporter,
            name: POLE_SUPPORTER_PACKAGES[selectedPoleSupporter]?.name,
            price: POLE_SUPPORTER_PACKAGES[selectedPoleSupporter]?.price,
            materials: POLE_SUPPORTER_PACKAGES[selectedPoleSupporter]?.materials
          } : null,
          tiang: detTiang, 
          grounding: selectedGrounding ? {
            package: selectedGrounding,
            name: GROUNDING_PACKAGES[selectedGrounding]?.name,
            price: GROUNDING_PACKAGES[selectedGrounding]?.price,
            materials: GROUNDING_PACKAGES[selectedGrounding]?.materials
          } : null,
          pondasi: selectedPondasi ? {
            package: selectedPondasi,
            name: PONDASI_PACKAGES[selectedPondasi]?.name,
            price: PONDASI_PACKAGES[selectedPondasi]?.price,
            materials: PONDASI_PACKAGES[selectedPondasi]?.materials
          } : null,
          conductorAccessories: detConductorAccessories,
          kumisan: selectedKumisan ? {
            package: selectedKumisan,
            name: CONDUCTOR_ACCESSORIES_PACKAGES[selectedKumisan]?.name,
            price: CONDUCTOR_ACCESSORIES_PACKAGES[selectedKumisan]?.price,
            qty: qtyKumisan,
            materials: CONDUCTOR_ACCESSORIES_PACKAGES[selectedKumisan]?.materials.map(mat => ({
              ...mat,
              calculatedQty: mat.qtyPerSet * qtyKumisan
            }))
          } : null,
          commissioning: selectedCommissioning ? {
            package: selectedCommissioning,
            name: COMMISSIONING_PACKAGE[selectedCommissioning]?.name,
            price: COMMISSIONING_PACKAGE[selectedCommissioning]?.price,
            materials: COMMISSIONING_PACKAGE[selectedCommissioning]?.materials
          } : null,
          poleTopArrangement: selectedPoleTopArrangement ? {
            package: selectedPoleTopArrangement,
            name: POLE_TOP_ARRANGEMENT_PACKAGE[selectedPoleTopArrangement]?.name,
            price: POLE_TOP_ARRANGEMENT_PACKAGE[selectedPoleTopArrangement]?.price,
            materials: POLE_TOP_ARRANGEMENT_PACKAGE[selectedPoleTopArrangement]?.materials
          } : null
        },
      };
    },
  }));

    // Whenever rows change, recompute validity and notify parent
  useEffect(() => {
    // Validasi: SEMUA kategori harus terisi
    const hasKonduktor = rowsKonduktor.length > 0 && rowsKonduktor.every((r) => r.itemId && Number(r.qty) > 0);
    const hasTiang = rowsTiang.length > 0 && rowsTiang.every((r) => r.itemId && Number(r.qty) > 0);
    const hasConductorAccessories = rowsConductorAccessories.length > 0 && rowsConductorAccessories.every((r) => r.itemId && Number(r.qty) > 0);
    const hasPoleSupporter = selectedPoleSupporter !== "";
    const hasGrounding = selectedGrounding !== "";
    const hasPondasi = selectedPondasi !== "";
    const hasKumisan = selectedKumisan !== "" && qtyKumisan > 0;
    const hasCommissioning = selectedCommissioning !== "";
    const hasPoleTopArrangement = selectedPoleTopArrangement !== "";
    
    // Semua harus terisi untuk valid
    const isValid = hasKonduktor && hasTiang && hasConductorAccessories && hasPoleSupporter && hasGrounding && hasPondasi && hasKumisan && hasCommissioning && hasPoleTopArrangement;
    
    onValidate?.(isValid);
  }, [rowsKonduktor, rowsTiang, rowsConductorAccessories, selectedPoleSupporter, selectedGrounding, selectedPondasi, selectedKumisan, qtyKumisan, selectedCommissioning, selectedPoleTopArrangement, onValidate]);

  // Add a blank row to the specified category
  const addRow = (category) => {
    if (category === "konduktor") {
      setRowsKonduktor((prev) => [...prev, { itemId: "", qty: 1 }]);
    } else if (category === "tiang") {
      setRowsTiang((prev) => [...prev, { itemId: "", qty: 1 }]);
    } else if (category === "conductor_accessories") {
      setRowsConductorAccessories((prev) => [...prev, { itemId: "", qty: 1 }]);
    }
  };

  // Remove row by index from specified category
  const removeRow = (category, index) => {
    if (category === "konduktor") {
      setRowsKonduktor((prev) => prev.filter((_, i) => i !== index));
    } else if (category === "tiang") {
      setRowsTiang((prev) => prev.filter((_, i) => i !== index));
    } else if (category === "conductor_accessories") {
      setRowsConductorAccessories((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Update row field in specified category
  const updateRow = (category, index, field, value) => {
    if (category === "konduktor") {
      setRowsKonduktor((prev) =>
        prev.map((r, i) => (i === index ? { ...r, [field]: value } : r))
      );
    } else if (category === "tiang") {
      setRowsTiang((prev) =>
        prev.map((r, i) => (i === index ? { ...r, [field]: value } : r))
      );
    } else if (category === "conductor_accessories") {
      setRowsConductorAccessories((prev) =>
        prev.map((r, i) => (i === index ? { ...r, [field]: value } : r))
      );
    }
  };

  // Compute total cost for display
  const totalCostKonduktor = rowsKonduktor.reduce((sum, r) => {
    const item = MATS_ITEMS.find((it) => String(it.id) === String(r.itemId));
    const qtyMs = Number(r.qty) || 0;
    const qtyMtr = Math.round(qtyMs * 1.05); // Konversi: ms + 5% = mtr, dibulatkan
    return sum + (item ? item.price * qtyMtr : 0);
  }, 0);
  const totalCostTiang = rowsTiang.reduce((sum, r) => {
    const item = MATS_ITEMS.find((it) => String(it.id) === String(r.itemId));
    const qty = Number(r.qty) || 0;
    return sum + (item ? item.price * qty : 0);
  }, 0);
  const totalCostConductorAccessories = rowsConductorAccessories.reduce((sum, r) => {
    const item = MATS_ITEMS.find((it) => String(it.id) === String(r.itemId));
    const qty = Number(r.qty) || 0;
    return sum + (item ? item.price * qty : 0);
  }, 0);
  const totalCostPoleSupporter = selectedPoleSupporter 
    ? POLE_SUPPORTER_PACKAGES[selectedPoleSupporter]?.price || 0 
    : 0;
  const totalCostGrounding = selectedGrounding 
    ? GROUNDING_PACKAGES[selectedGrounding]?.price || 0 
    : 0;
  const totalCostPondasi = selectedPondasi 
    ? PONDASI_PACKAGES[selectedPondasi]?.price || 0 
    : 0;
  const totalCostKumisan = selectedKumisan 
    ? (CONDUCTOR_ACCESSORIES_PACKAGES[selectedKumisan]?.price || 0) * qtyKumisan
    : 0;
  const totalCostCommissioning = selectedCommissioning 
    ? COMMISSIONING_PACKAGE[selectedCommissioning]?.price || 0 
    : 0;
  const totalCostPoleTopArrangement = selectedPoleTopArrangement 
    ? POLE_TOP_ARRANGEMENT_PACKAGE[selectedPoleTopArrangement]?.price || 0 
    : 0;
  const totalCost = totalCostKonduktor + totalCostPoleSupporter + totalCostTiang + totalCostGrounding + totalCostPondasi + totalCostConductorAccessories + totalCostKumisan + totalCostCommissioning + totalCostPoleTopArrangement;

  return (
    <motion.section
      whileHover={{ boxShadow: "0 12px 48px 0 rgba(16,185,129,0.16)" }}
      className="w-full rounded-3xl border-2 border-emerald-200/60 bg-gradient-to-br from-white via-emerald-50/30 to-white shadow-xl"
      style={{ boxShadow: "0 8px 32px 0 rgba(16,185,129,0.12)" }}
    >
      {/* Header with enhanced gradient */}
      <div className="flex items-center gap-4 rounded-t-3xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-sky-500 px-6 py-5 shadow-lg">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/20 backdrop-blur-sm text-white shadow-lg">
          <PackagePlus className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-white flex-1 tracking-wide">
          Kebutuhan Material (MDU)
        </h3>
      </div>
      {/* Body (selalu terlihat) */}
  <div id="material-body">
        <div className="p-6 md:p-8 space-y-6">
          
          {/* GROUP 1: Material Input Manual */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b-2 border-emerald-200">
              <Box className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-emerald-900">Material Detail</h3>
              <span className="text-xs text-emerald-600 ml-auto">Input manual</span>
            </div>

          {/* Section: Konduktor */}
          <div className="rounded-xl border-2 border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-semibold text-gray-800">Konduktor</h4>
              </div>
            </div>
            <div className="p-4 bg-white space-y-3">
            {rowsKonduktor.length > 0 && (
              <table className="w-full text-sm border-collapse table-fixed">
                <colgroup>
                  <col className="w-[40%]" />  {/* Material */}
                  <col className="w-20" />     {/* Qty ms */}
                  <col className="w-16" />     {/* Satuan ms */}
                  <col className="w-20" />     {/* Qty mtr */}
                  <col className="w-16" />     {/* Satuan mtr */}
                  <col className="w-28" />     {/* Harga satuan */}
                  <col className="w-28" />     {/* Subtotal */}
                  <col className="w-12" />     {/* Aksi */}
                </colgroup>
                <thead>
                  <tr className="border-b border-gray-200 text-gray-600">
                    <th className="py-2 text-left">Material</th>
                    <th className="py-2">Qty</th>
                    <th className="py-2">Satuan</th>
                    <th className="py-2">Qty</th>
                    <th className="py-2">Satuan</th>
                    <th className="py-2">Harga satuan</th>
                    <th className="py-2">Subtotal</th>
                    <th className="py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {rowsKonduktor.map((row, idx) => {
                    const item = MATS_ITEMS.find((it) => String(it.id) === String(row.itemId));
                    const qtyMs = Number(row.qty) || 0;
                    const qtyMtr = Math.round(qtyMs * 1.05); // Konversi: ms + 5% = mtr, dibulatkan
                    const price = item ? item.price : 0;
                    return (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-1.5 pr-2 min-w-0">
                          <div className="min-w-0">
                            <SelectDown
                              value={row.itemId}
                              onChange={(e) => updateRow("konduktor", idx, "itemId", e.target.value)}
                              className={clsSelect + " max-w-full"}
                            >
                              <option value="" disabled hidden>
                                — Pilih Material —
                              </option>
                              {itemsKonduktor.map((it) => (
                                <option key={it.id} value={it.id}>
                                  {it.name}
                                </option>
                              ))}
                            </SelectDown>
                          </div>
                        </td>
                        <td className="py-1.5 px-1 w-20">
                          <input
                            type="number"
                            min="1"
                            value={row.qty}
                            onChange={(e) => updateRow("konduktor", idx, "qty", e.target.value)}
                            className={clsInput}
                          />
                        </td>
                        <td className="py-1.5 text-center text-gray-700">
                          ms
                        </td>
                        <td className="py-1.5 text-center text-emerald-700 font-semibold">
                          {qtyMtr}
                        </td>
                        <td className="py-1.5 text-center text-gray-700">
                          mtr
                        </td>
                        <td className="py-1.5 text-right text-gray-700">
                          {item ? `Rp${item.price.toLocaleString("id-ID")}` : "-"}
                        </td>
                        <td className="py-1.5 text-right text-gray-700">
                          {item ? `Rp${(price * qtyMtr).toLocaleString("id-ID")}` : "-"}
                        </td>
                        <td className="py-1.5 text-center">
                          <button
                            type="button"
                            onClick={() => removeRow("konduktor", idx)}
                            className="inline-flex items-center justify-center text-rose-500 hover:text-rose-600"
                          >
                            <MinusCircle className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
            <button
              type="button"
              onClick={() => addRow("konduktor")}
              className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors"
            >
              <PackagePlus className="h-4 w-4" /> Tambah Konduktor
            </button>
            {rowsKonduktor.length > 0 && (
              <div className="rounded-lg bg-blue-50 border border-blue-200 px-4 py-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-800">Total:</span>
                  <span className="text-base font-bold text-blue-900">
                    Rp{totalCostKonduktor.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            )}
            </div>
          </div>

          {/* Section: Tiang Beton */}
          <div className="rounded-xl border-2 border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-600" />
                <h4 className="text-sm font-semibold text-gray-800">Tiang Beton</h4>
              </div>
            </div>
            <div className="p-4 bg-white space-y-3">
            {rowsTiang.length > 0 && (
              <table className="w-full text-sm border-collapse table-fixed">
                <colgroup>
                  <col className="w-[52%]" />  {/* Material */}
                  <col className="w-24" />     {/* Qty */}
                  <col className="w-20" />     {/* Satuan */}
                  <col className="w-32" />     {/* Harga satuan */}
                  <col className="w-32" />     {/* Subtotal */}
                  <col className="w-12" />     {/* Aksi */}
                </colgroup>
                <thead>
                  <tr className="border-b border-gray-200 text-gray-600">
                    <th className="py-2 text-left">Material</th>
                    <th className="py-2">Qty</th>
                    <th className="py-2">Satuan</th>
                    <th className="py-2">Harga satuan</th>
                    <th className="py-2">Subtotal</th>
                    <th className="py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {rowsTiang.map((row, idx) => {
                    const item = MATS_ITEMS.find((it) => String(it.id) === String(row.itemId));
                    const qty = Number(row.qty) || 0;
                    const price = item ? item.price : 0;
                    return (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-1.5 pr-2 min-w-0">
                          <div className="min-w-0">
                            <SelectDown
                              value={row.itemId}
                              onChange={(e) => updateRow("tiang", idx, "itemId", e.target.value)}
                              className={clsSelect + " max-w-full"}
                            >
                              <option value="" disabled hidden>
                                — Pilih Material —
                              </option>
                              {itemsTiang.map((it) => (
                                <option key={it.id} value={it.id}>
                                  {it.name}
                                </option>
                              ))}
                            </SelectDown>
                          </div>
                        </td>
                        <td className="py-1.5 px-1 w-24">
                          <input
                            type="number"
                            min="1"
                            value={row.qty}
                            onChange={(e) => updateRow("tiang", idx, "qty", e.target.value)}
                            className={clsInput}
                          />
                        </td>
                        <td className="py-1.5 text-center text-gray-700">
                          {item?.unit || "-"}
                        </td>
                        <td className="py-1.5 text-right text-gray-700">
                          {item ? `Rp${item.price.toLocaleString("id-ID")}` : "-"}
                        </td>
                        <td className="py-1.5 text-right text-gray-700">
                          {item ? `Rp${(price * qty).toLocaleString("id-ID")}` : "-"}
                        </td>
                        <td className="py-1.5 text-center">
                          <button
                            type="button"
                            onClick={() => removeRow("tiang", idx)}
                            className="inline-flex items-center justify-center text-rose-500 hover:text-rose-600"
                          >
                            <MinusCircle className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
            <button
              type="button"
              onClick={() => addRow("tiang")}
              className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700 hover:bg-amber-100 transition-colors"
            >
              <PackagePlus className="h-4 w-4" /> Tambah Material Tiang Beton
            </button>
            {rowsTiang.length > 0 && (
              <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-amber-800">Total:</span>
                  <span className="text-base font-bold text-amber-900">
                    Rp{totalCostTiang.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            )}
            </div>
          </div>

          {/* Section: Conductor Accessories */}
          <div className="rounded-xl border-2 border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-600" />
                <h4 className="text-sm font-semibold text-gray-800">Conductor Accessories</h4>
              </div>
            </div>
            <div className="p-4 bg-white space-y-3">
            {rowsConductorAccessories.length > 0 && (
              <table className="w-full text-sm border-collapse table-fixed">
                <colgroup>
                  <col className="w-[52%]" />  {/* Material */}
                  <col className="w-24" />     {/* Qty */}
                  <col className="w-20" />     {/* Satuan */}
                  <col className="w-32" />     {/* Harga satuan */}
                  <col className="w-32" />     {/* Subtotal */}
                  <col className="w-12" />     {/* Aksi */}
                </colgroup>
                <thead>
                  <tr className="border-b border-gray-200 text-gray-600">
                    <th className="py-2 text-left">Material</th>
                    <th className="py-2">Qty</th>
                    <th className="py-2">Satuan</th>
                    <th className="py-2">Harga satuan</th>
                    <th className="py-2">Subtotal</th>
                    <th className="py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {rowsConductorAccessories.map((row, idx) => {
                    const item = MATS_ITEMS.find((it) => String(it.id) === String(row.itemId));
                    const qty = Number(row.qty) || 0;
                    const price = item ? item.price : 0;
                    return (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-1.5 pr-2 min-w-0">
                          <div className="min-w-0">
                            <SelectDown
                              value={row.itemId}
                              onChange={(e) => updateRow("conductor_accessories", idx, "itemId", e.target.value)}
                              className={clsSelect + " max-w-full"}
                            >
                              <option value="" disabled hidden>
                                — Pilih Material —
                              </option>
                              {itemsConductorAccessories.map((it) => (
                                <option key={it.id} value={it.id}>
                                  {it.name}
                                </option>
                              ))}
                            </SelectDown>
                          </div>
                        </td>
                        <td className="py-1.5 px-1 w-24">
                          <input
                            type="number"
                            min="1"
                            value={row.qty}
                            onChange={(e) => updateRow("conductor_accessories", idx, "qty", e.target.value)}
                            className={clsInput}
                          />
                        </td>
                        <td className="py-1.5 text-center text-gray-700">
                          {item ? item.unit : "-"}
                        </td>
                        <td className="py-1.5 text-right text-gray-700">
                          {item ? `Rp${item.price.toLocaleString("id-ID")}` : "-"}
                        </td>
                        <td className="py-1.5 text-right text-gray-700">
                          {item ? `Rp${(price * qty).toLocaleString("id-ID")}` : "-"}
                        </td>
                        <td className="py-1.5 text-center">
                          <button
                            type="button"
                            onClick={() => removeRow("conductor_accessories", idx)}
                            className="inline-flex items-center justify-center text-rose-500 hover:text-rose-600"
                          >
                            <MinusCircle className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
            <button
              type="button"
              onClick={() => addRow("conductor_accessories")}
              className="inline-flex items-center gap-2 rounded-xl border border-purple-200 bg-purple-50 px-4 py-2.5 text-sm font-medium text-purple-700 hover:bg-purple-100 transition-colors"
            >
              <PackagePlus className="h-4 w-4" /> Tambah Conductor Accessories
            </button>
            {rowsConductorAccessories.length > 0 && (
              <div className="rounded-lg bg-purple-50 border border-purple-200 px-4 py-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-purple-800">Total:</span>
                  <span className="text-base font-bold text-purple-900">
                    Rp{totalCostConductorAccessories.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            )}
            </div>
          </div>

          {/* Section: Kumisan (Paket Conductor Accessories) */}
          <div className="rounded-xl border-2 border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Box className="w-4 h-4 text-indigo-600" />
                <h4 className="text-sm font-semibold text-gray-800">Kumisan (Paket)</h4>
              </div>
            </div>
            <div className="p-4 bg-white space-y-3">
              <div className="flex gap-3">
                <div className="flex-1">
                  <SelectDown
                    value={selectedKumisan}
                    onChange={(e) => {
                      setSelectedKumisan(e.target.value);
                      // Set default qty to 4 when user first selects Kumisan
                      if (e.target.value && !selectedKumisan) {
                        setQtyKumisan(4);
                      }
                    }}
                    className={clsSelect}
                  >
                    <option value="" disabled hidden>— Pilih Paket Kumisan —</option>
                    <option value="kumisan">Kumisan</option>
                  </SelectDown>
                </div>
                {selectedKumisan && (
                  <div className="w-32">
                    <input
                      type="number"
                      min="1"
                      value={qtyKumisan}
                      onChange={(e) => setQtyKumisan(Number(e.target.value) || 1)}
                      className={clsInput}
                      placeholder="Qty Set"
                    />
                  </div>
                )}
              </div>

              {selectedKumisan && (
                <>
                  <div className="rounded-lg border border-indigo-100 bg-indigo-50/30 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <h5 className="text-xs font-semibold text-indigo-900">
                        {CONDUCTOR_ACCESSORIES_PACKAGES[selectedKumisan]?.name}
                      </h5>
                      <div className="text-right">
                        <div className="text-xs text-indigo-600">Qty: {qtyKumisan} set</div>
                        <div className="text-xs font-bold text-indigo-700">
                          Rp{(CONDUCTOR_ACCESSORIES_PACKAGES[selectedKumisan]?.price * qtyKumisan).toLocaleString("id-ID")}
                        </div>
                      </div>
                    </div>
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-indigo-200 text-gray-600">
                          <th className="py-1.5 text-left">Material</th>
                          <th className="py-1.5 text-center w-16">Per Set</th>
                          <th className="py-1.5 text-center w-16">Total</th>
                          <th className="py-1.5 text-center w-12">Unit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {CONDUCTOR_ACCESSORIES_PACKAGES[selectedKumisan]?.materials.map((mat, idx) => (
                          <tr key={idx} className="border-b border-indigo-100">
                            <td className="py-1.5 text-gray-700">{mat.name}</td>
                            <td className="py-1.5 text-center text-gray-700">{mat.qtyPerSet}</td>
                            <td className="py-1.5 text-center text-indigo-700 font-semibold">
                              {mat.qtyPerSet * qtyKumisan}
                            </td>
                            <td className="py-1.5 text-center text-gray-700">{mat.unit}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="rounded-lg bg-indigo-50 border border-indigo-200 px-3 py-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-indigo-800">Total:</span>
                      <span className="text-sm font-bold text-indigo-900">
                        Rp{totalCostKumisan.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          </div>

          {/* GROUP 2: Paket Material */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b-2 border-emerald-200">
              <Box className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-emerald-900">Paket Material</h3>
              <span className="text-xs text-emerald-600 ml-auto">Pilih paket</span>
            </div>

            {/* Grid layout untuk 3 paket */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              
              {/* Pole Supporter */}
              <div className="rounded-xl border-2 border-gray-200 overflow-visible">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3 border-b border-gray-200 rounded-t-xl">
                  <div className="flex items-center gap-2">
                    <Anchor className="w-4 h-4 text-green-600" />
                    <h4 className="text-sm font-semibold text-gray-800">Pole Supporter</h4>
                  </div>
                </div>
                <div className="p-4 bg-white space-y-3 rounded-b-xl">
                  <SelectDown
                    value={selectedPoleSupporter}
                    onChange={(e) => setSelectedPoleSupporter(e.target.value)}
                    className={clsSelect}
                  >
                    <option value="" disabled hidden>— Pilih Paket —</option>
                    <option value="guy_wire_tr">Guy Wire TR</option>
                    <option value="stroot_pole">Stroot Pole</option>
                  </SelectDown>

                  {selectedPoleSupporter && (
                    <>
                      <div className="rounded-lg border border-green-100 bg-green-50/30 p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <h5 className="text-xs font-semibold text-green-900">
                            {POLE_SUPPORTER_PACKAGES[selectedPoleSupporter]?.name}
                          </h5>
                          <span className="text-xs font-bold text-green-700">
                            Rp{POLE_SUPPORTER_PACKAGES[selectedPoleSupporter]?.price.toLocaleString("id-ID")}
                          </span>
                        </div>
                        <table className="w-full text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-green-200 text-gray-600">
                              <th className="py-1.5 text-left">Material</th>
                              <th className="py-1.5 text-center w-12">Qty</th>
                              <th className="py-1.5 text-center w-12">Unit</th>
                            </tr>
                          </thead>
                          <tbody>
                            {POLE_SUPPORTER_PACKAGES[selectedPoleSupporter]?.materials.map((mat, idx) => (
                              <tr key={idx} className="border-b border-green-100">
                                <td className="py-1.5 text-gray-700">{mat.name}</td>
                                <td className="py-1.5 text-center text-gray-700">{mat.qty}</td>
                                <td className="py-1.5 text-center text-gray-700">{mat.unit}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="rounded-lg bg-green-50 border border-green-200 px-3 py-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-green-800">Total:</span>
                          <span className="text-sm font-bold text-green-900">
                            Rp{totalCostPoleSupporter.toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              {/* Grounding */}
              <div className="rounded-xl border-2 border-gray-200 overflow-visible">
                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 px-4 py-3 border-b border-gray-200 rounded-t-xl">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-teal-600" />
                    <h4 className="text-sm font-semibold text-gray-800">Grounding</h4>
                  </div>
                </div>
                <div className="p-4 bg-white space-y-3 rounded-b-xl">
                  <SelectDown
                    value={selectedGrounding}
                    onChange={(e) => setSelectedGrounding(e.target.value)}
                    className={clsSelect}
                  >
                    <option value="" disabled hidden>— Pilih Paket —</option>
                    <option value="grounding_luar">Grounding Luar</option>
                    <option value="grounding_dalam">Grounding Dalam</option>
                  </SelectDown>

                  {selectedGrounding && (
                    <>
                      <div className="rounded-lg border border-teal-100 bg-teal-50/30 p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <h5 className="text-xs font-semibold text-teal-900">
                            {GROUNDING_PACKAGES[selectedGrounding]?.name}
                          </h5>
                          <span className="text-xs font-bold text-teal-700">
                            Rp{GROUNDING_PACKAGES[selectedGrounding]?.price.toLocaleString("id-ID")}
                          </span>
                        </div>
                        <table className="w-full text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-teal-200 text-gray-600">
                              <th className="py-1.5 text-left">Material</th>
                              <th className="py-1.5 text-center w-12">Qty</th>
                              <th className="py-1.5 text-center w-12">Unit</th>
                            </tr>
                          </thead>
                          <tbody>
                            {GROUNDING_PACKAGES[selectedGrounding]?.materials.map((mat, idx) => (
                              <tr key={idx} className="border-b border-teal-100">
                                <td className="py-1.5 text-gray-700">{mat.name}</td>
                                <td className="py-1.5 text-center text-gray-700">{mat.qty}</td>
                                <td className="py-1.5 text-center text-gray-700">{mat.unit}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="rounded-lg bg-teal-50 border border-teal-200 px-3 py-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-teal-800">Total:</span>
                          <span className="text-sm font-bold text-teal-900">
                            Rp{totalCostGrounding.toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Pondasi */}
              <div className="rounded-xl border-2 border-gray-200 overflow-visible">
                <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-4 py-3 border-b border-gray-200 rounded-t-xl">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-600" />
                    <h4 className="text-sm font-semibold text-gray-800">Pondasi</h4>
                  </div>
                </div>
                <div className="p-4 bg-white space-y-3 rounded-b-xl">
                  <SelectDown
                    value={selectedPondasi}
                    onChange={(e) => setSelectedPondasi(e.target.value)}
                    className={clsSelect}
                  >
                    <option value="" disabled hidden>— Pilih Paket —</option>
                    <option value="pondasi_type_a">Pondasi type A (1 tiang)</option>
                  </SelectDown>

                  {selectedPondasi && (
                    <>
                      <div className="rounded-lg border border-slate-100 bg-slate-50/30 p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <h5 className="text-xs font-semibold text-slate-900">
                            {PONDASI_PACKAGES[selectedPondasi]?.name}
                          </h5>
                          <span className="text-xs font-bold text-slate-700">
                            Rp{PONDASI_PACKAGES[selectedPondasi]?.price.toLocaleString("id-ID")}
                          </span>
                        </div>
                        <table className="w-full text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-slate-200 text-gray-600">
                              <th className="py-1.5 text-left">Material</th>
                              <th className="py-1.5 text-center w-12">Qty</th>
                              <th className="py-1.5 text-center w-12">Unit</th>
                            </tr>
                          </thead>
                          <tbody>
                            {PONDASI_PACKAGES[selectedPondasi]?.materials.map((mat, idx) => (
                              <tr key={idx} className="border-b border-slate-100">
                                <td className="py-1.5 text-gray-700">{mat.name}</td>
                                <td className="py-1.5 text-center text-gray-700">{mat.qty}</td>
                                <td className="py-1.5 text-center text-gray-700">{mat.unit}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-slate-800">Total:</span>
                          <span className="text-sm font-bold text-slate-900">
                            Rp{totalCostPondasi.toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Card 4: Commissioning */}
              <div className="rounded-xl border-2 border-orange-200 bg-white shadow-sm overflow-visible">
                <div className="rounded-t-xl bg-gradient-to-r from-orange-50 to-orange-100/40 px-4 py-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-600" />
                  <h4 className="text-sm font-semibold text-orange-900">Commissioning</h4>
                </div>
                
                <div className="p-4 space-y-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-700">Pilih Paket Commissioning</label>
                    <SelectDown
                      className={clsSelect}
                      value={selectedCommissioning}
                      onChange={(e) => setSelectedCommissioning(e.target.value)}
                    >
                      <option value="" disabled>— Pilih Paket —</option>
                      {Object.entries(COMMISSIONING_PACKAGE).map(([key, pkg]) => (
                        <option key={key} value={key}>
                          {pkg.name}
                        </option>
                      ))}
                    </SelectDown>
                  </div>
                  
                  {selectedCommissioning && COMMISSIONING_PACKAGE[selectedCommissioning] && (
                    <>
                      <div className="rounded-lg border border-orange-200 bg-orange-50/30 p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-xs font-semibold text-orange-900">
                            {COMMISSIONING_PACKAGE[selectedCommissioning]?.name}
                          </h5>
                        </div>
                        <div className="text-sm text-gray-600">
                          Paket commissioning untuk pengujian dan komisioning JTR termasuk NIDI.
                        </div>
                      </div>
                      
                      <div className="rounded-lg bg-orange-50 border border-orange-200 px-3 py-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-orange-800">Total:</span>
                          <span className="text-sm font-bold text-orange-900">
                            Rp{totalCostCommissioning.toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Card 5: Pole Top Arrangement */}
              <div className="rounded-xl border-2 border-blue-200 bg-white shadow-sm overflow-visible">
                <div className="rounded-t-xl bg-gradient-to-r from-blue-50 to-blue-100/40 px-4 py-3 flex items-center gap-2">
                  <Anchor className="w-5 h-5 text-blue-600" />
                  <h4 className="text-sm font-semibold text-blue-900">Pole Top Arrangement</h4>
                </div>
                
                <div className="p-4 space-y-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-700">Pilih Paket Pole Top Arrangement</label>
                    <SelectDown
                      className={clsSelect}
                      value={selectedPoleTopArrangement}
                      onChange={(e) => setSelectedPoleTopArrangement(e.target.value)}
                    >
                      <option value="" disabled>— Pilih Paket —</option>
                      {Object.entries(POLE_TOP_ARRANGEMENT_PACKAGE).map(([key, pkg]) => (
                        <option key={key} value={key}>
                          {pkg.name}
                        </option>
                      ))}
                    </SelectDown>
                  </div>
                  
                  {selectedPoleTopArrangement && POLE_TOP_ARRANGEMENT_PACKAGE[selectedPoleTopArrangement] && (
                    <>
                      <div className="rounded-lg border border-blue-200 bg-blue-50/30 p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-xs font-semibold text-blue-900">
                            {POLE_TOP_ARRANGEMENT_PACKAGE[selectedPoleTopArrangement]?.name}
                          </h5>
                        </div>
                        <table className="w-full text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-blue-200 text-gray-600">
                              <th className="py-1.5 text-left">Material</th>
                              <th className="py-1.5 text-center w-16">Qty</th>
                              <th className="py-1.5 text-center w-16">Satuan</th>
                            </tr>
                          </thead>
                          <tbody>
                            {POLE_TOP_ARRANGEMENT_PACKAGE[selectedPoleTopArrangement]?.materials.map((mat, idx) => (
                              <tr key={idx} className="border-b border-blue-100">
                                <td className="py-1.5 text-gray-700">{mat.name}</td>
                                <td className="py-1.5 text-center text-gray-700">{mat.qty}</td>
                                <td className="py-1.5 text-center text-gray-700">{mat.unit}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="rounded-lg bg-blue-50 border border-blue-200 px-3 py-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-blue-800">Total:</span>
                          <span className="text-sm font-bold text-blue-900">
                            Rp{totalCostPoleTopArrangement.toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Footer dengan total keseluruhan - sama seperti SarSelection */}
      {totalCost > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-b-3xl border-t-2 border-emerald-200 bg-gradient-to-r from-emerald-500 via-emerald-600 to-sky-500 px-6 py-5 shadow-lg"
        >
          <div className="flex justify-between items-center">
            <span className="text-base font-bold text-white tracking-wide">Total Semua Material:</span>
            <span className="text-2xl font-bold text-white drop-shadow-lg">
              Rp{totalCost.toLocaleString("id-ID")}
            </span>
          </div>
        </motion.div>
      )}
    </motion.section>
  );
});