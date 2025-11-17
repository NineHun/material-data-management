import React, { useEffect, useMemo, useState, forwardRef, useImperativeHandle } from "react";
import { KONSTRUKSI_OPTIONS, KONSTRUKSI_PRESETS, KONSTRUKSI_PRICES } from "../../constants/consItems";
import { Plus, Trash2, MapPin } from "lucide-react";
import SelectDown from "../../components/ui/SelectDown";

export default forwardRef(function ConsSelection({ onValidate, chartAnswers = {} }, ref) {

  const [selectedPresets, setSelectedPresets] = useState([]); 

  const [selectKey, setSelectKey] = useState("");

  const [rows, setRows] = useState([]);
  
  const [showChartUpdateNotice, setShowChartUpdateNotice] = useState(false);


  const clsSelect =
    "w-full h-11 rounded-xl border border-gray-200 bg-white px-3.5 text-[15px] outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 overflow-hidden whitespace-nowrap text-ellipsis";
  const clsInput =
    "w-full h-11 rounded-xl border border-gray-200 px-3.5 text-[15px] focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400";


  const applyPreset = (key) => {
    if (!key) return;

    const id = `${key}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const defPrice = KONSTRUKSI_PRICES[key] || { unit: "Set", hargaSatuan: 0, hargaJasa: 0 };
    const items = (KONSTRUKSI_PRESETS[key] || []).map((it) => ({
      _presetKey: key,
      _presetId: id,
      material: it.name,
      unit: it.unit,
      qty: it.qty,
      price: 0,
    }));
    setRows((prev) => [...prev, ...items]);
    setSelectedPresets((prev) => [...prev, { id, key, hargaSatuan: defPrice.hargaSatuan || 0, hargaJasa: defPrice.hargaJasa || 0 }]);
  };

  const removePreset = (id) => {
    setSelectedPresets((prev) => prev.filter((p) => p.id !== id));
    setRows((prev) => prev.filter((r) => r._presetId !== id));
  };

  const addRow = () => {
    setRows((p) => [
      ...p,
      { _presetKey: "manual", material: "", unit: "Set", qty: 1, price: 0 },
    ]);
  };

  const removeRow = (idx) => {
    setRows((p) => p.filter((_, i) => i !== idx));
  };

  const updateRow = (idx, field, value) => {
    setRows((p) => p.map((r, i) => (i === idx ? { ...r, [field]: value } : r)));
  };

  // Total dihitung dari harga per set konstruksi (hargaSatuan + hargaJasa) per instance
  const total = useMemo(
    () => selectedPresets.reduce((sum, p) => sum + (Number(p.hargaSatuan) || 0) + (Number(p.hargaJasa) || 0), 0),
    [selectedPresets]
  );

  // group rows by preset for display to avoid collisions
  const rowsByPreset = useMemo(() => {
    const map = new Map();
    rows.forEach((r) => {
      const k = r._presetId || (r._presetKey || "manual");
      if (!map.has(k)) map.set(k, []);
      map.get(k).push(r);
    });
    return map;
  }, [rows]);

  // Hitung pemenuhan syarat minimal konstruksi: TR-7 x1, TR-1 x2, TR-3 x1
  const requirement = useMemo(() => {
    const need = { TR_7: 1, TR_1: 2, TR_3: 1 };
    const counts = selectedPresets.reduce((m, p) => {
      m[p.key] = (m[p.key] || 0) + 1;
      return m;
    }, {});
    const meets = Object.entries(need).every(([k, n]) => (counts[k] || 0) >= n);
    return { need, counts, meets };
  }, [selectedPresets]);

  // valid bila: minimal 1 preset dipilih, tiap preset punya harga satuan & jasa > 0, dan syarat minimal jenis terpenuhi
  useEffect(() => {
    const pricesOk = selectedPresets.length > 0 && selectedPresets.every((p) => Number(p.hargaSatuan) > 0 && Number(p.hargaJasa) > 0);
    const ok = pricesOk && requirement.meets;
    onValidate?.(ok);
  }, [selectedPresets, requirement, onValidate]);

  // housekeeping: jika seluruh baris dari sebuah preset terhapus manual, buang preset dari daftar terpilih
  useEffect(() => {
    setSelectedPresets((prev) => prev.filter((p) => rows.some((r) => r._presetId === p.id)));
  }, [rows]);

  // Auto-fill saat chartAnswers berubah (dari ChartChallenge)
  useEffect(() => {
    if (!chartAnswers || Object.keys(chartAnswers).length === 0) return;
    
    // Hitung jumlah jawaban yang terisi
    const filledAnswers = Object.values(chartAnswers).filter(v => v && v.trim()).length;
    if (filledAnswers === 0) return; // Tidak ada jawaban yang terisi, skip
    
    // Hapus semua preset yang berasal dari chart sebelumnya
    setSelectedPresets((prev) => prev.filter(p => !p.fromChart));
    setRows((prev) => prev.filter(r => !r._chartPoint));
    
    // Tambahkan preset baru untuk setiap jawaban yang terisi
    const newPresets = [];
    const newRows = [];
    
    Object.entries(chartAnswers).forEach(([point, trType]) => {
      if (trType && trType.trim()) {
        // Konversi format TR-1 menjadi TR_1
        const presetKey = trType.replace('-', '_');
        const id = `chart_${point}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        const defPrice = KONSTRUKSI_PRICES[presetKey] || { unit: "Set", hargaSatuan: 0, hargaJasa: 0 };
        const items = (KONSTRUKSI_PRESETS[presetKey] || []).map((it) => ({
          _presetKey: presetKey,
          _presetId: id,
          _chartPoint: point, // Tambah penanda titik dari chart
          material: it.name,
          unit: it.unit,
          qty: it.qty,
          price: 0,
        }));
        
        newRows.push(...items);
        newPresets.push({ 
          id, 
          key: presetKey, 
          chartPoint: point, // Simpan info titik
          fromChart: true, // Tandai bahwa ini dari chart
          hargaSatuan: defPrice.hargaSatuan || 0, 
          hargaJasa: defPrice.hargaJasa || 0 
        });
      }
    });
    
    // Tambahkan preset dan rows baru
    if (newPresets.length > 0) {
      setSelectedPresets((prev) => [...prev, ...newPresets]);
      setRows((prev) => [...prev, ...newRows]);
      
      // Tampilkan notifikasi update
      setShowChartUpdateNotice(true);
      setTimeout(() => setShowChartUpdateNotice(false), 3000);
    }
  }, [chartAnswers]);

  // expose untuk rekap
  useImperativeHandle(ref, () => ({
    getTotals: () => ({
      // untuk kompatibilitas: kembalikan array key (duplikat dipertahankan)
      presets: selectedPresets.map((p) => p.key),
      presetInstances: selectedPresets,
      items: rows.map((r) => ({
        nama: r.material,
        unit: r.unit,
        qty: Number(r.qty) || 0,
        harga: 0,
        subtotal: 0,
        presetKey: r._presetKey || null,
        presetId: r._presetId || null,
      })),
      presetPrices: selectedPresets.map((p) => ({
        id: p.id,
        key: p.key,
        hargaSatuan: Number(p.hargaSatuan) || 0,
        hargaJasa: Number(p.hargaJasa) || 0,
        totalPerSet: (Number(p.hargaSatuan) || 0) + (Number(p.hargaJasa) || 0),
      })),
      total,
    }),
    clear: () => { setSelectedPresets([]); setSelectKey(""); setRows([]); },
    applyPreset,
  }));

  return (
    <div className="rounded-2xl bg-white ring-1 ring-emerald-100 shadow-sm">
      {/* header */}
      <div className="w-full flex items-center justify-between p-4">
        <div className="text-left">
          <div className="text-sm font-semibold text-emerald-800">Kebutuhan Konstruksi TR</div>
          <div className="text-xs text-emerald-700/70">
            Konstruksi dari Chart akan terisi otomatis. Anda dapat menambah atau mengedit sesuai kebutuhan.
          </div>
        </div>
      </div>

      <div className="p-4 pt-0 space-y-4">
          {/* Notifikasi update dari chart */}
          {showChartUpdateNotice && (
            <div className="rounded-xl border border-blue-300 bg-blue-50 px-4 py-3 animate-pulse">
              <span className="text-sm text-blue-700">✓ Konstruksi telah diperbarui berdasarkan pilihan di Chart!</span>
            </div>
          )}
          
          {/* toolbar atas: hanya tombol tambah material manual */}
          <div className="flex items-end justify-end">
            <button
              type="button"
              onClick={addRow}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Tambah Material
            </button>
          </div>

          {/* table */}
          <div className="rounded-xl overflow-hidden ring-1 ring-gray-200">
            <div className="grid grid-cols-[1fr,100px,100px,40px] bg-emerald-50 text-emerald-900 text-sm font-medium">
              <div className="px-3 py-2">Nama Material</div>
              <div className="px-3 py-2">SAT</div>
              <div className="px-3 py-2">Jumlah</div>
              <div className="px-3 py-2" />
            </div>
            <div className="divide-y">
              {rows.length === 0 ? (
                <div className="text-sm text-gray-500 p-3">Belum ada material. Pilih jenis konstruksi atau tambah baris manual.</div>
              ) : (
                <>
                  {/* render tiap preset terpilih sebagai grup tersendiri */}
                  {selectedPresets.map((preset, idx) => {
                    const groupRows = rowsByPreset.get(preset.id) || [];
                    const label = KONSTRUKSI_OPTIONS.find((o) => o.key === preset.key)?.label || preset.key;
                    if (groupRows.length === 0) return null;
                    return (
                      <React.Fragment key={preset.id}>
                        {/* group header + harga per set */}
                        <div className="w-full bg-emerald-50/60 text-emerald-900 text-[13px] font-medium">
                          <div className="px-3 pt-2 flex flex-wrap items-center gap-3 justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{label}</span>
                              {preset.chartPoint && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-[11px] font-semibold border border-blue-200">
                                  <MapPin className="w-3 h-3" />
                                  Titik {preset.chartPoint}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-[12px] text-emerald-800">Harga Satuan</div>
                              <div className="h-8 rounded-lg border border-emerald-200 bg-emerald-50 px-3 flex items-center text-[12px] text-emerald-800 tabular-nums select-none">
                                Rp&nbsp;{Number(preset.hargaSatuan || 0).toLocaleString("id-ID")}
                              </div>
                              <div className="text-[12px] text-emerald-800">Harga Jasa</div>
                              <div className="h-8 rounded-lg border border-emerald-200 bg-emerald-50 px-3 flex items-center text-[12px] text-emerald-800 tabular-nums select-none">
                                Rp&nbsp;{Number(preset.hargaJasa || 0).toLocaleString("id-ID")}
                              </div>
                              <button
                                type="button"
                                onClick={() => removePreset(preset.id)}
                                className="ml-2 px-2 py-1 rounded text-emerald-700 hover:bg-emerald-100"
                                title="Hapus preset ini"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                          <div className="grid grid-cols-[1fr,100px,100px,40px]">
                            <div className="px-3 pb-2 col-span-4 text-[12px] text-emerald-700">Rincian material </div>
                          </div>
                        </div>
                        {groupRows.map((r, iGlobal) => {
                          // index global diperlukan untuk operasi updateRow/removeRow; gunakan index di array rows
                          const idx = rows.findIndex((rr) => rr === r);
                          return (
                            <div key={idx} className="grid grid-cols-[1fr,100px,100px,40px] items-center text-sm">
                              <div className="px-2 py-1 min-w-0">
                                <div className="h-10 flex items-center px-3.5 rounded-xl border border-gray-200 bg-gray-50 text-[15px] text-gray-600 select-none">
                                  <span className="truncate" title={r.material}>{r.material}</span>
                                </div>
                              </div>
                              <div className="px-2 py-1">
                                <input
                                  className={`${clsInput} h-10`}
                                  value={r.unit}
                                  onChange={(e) => updateRow(idx, "unit", e.target.value)}
                                  placeholder="SAT"
                                />
                              </div>
                              <div className="px-2 py-1">
                                <input
                                  type="number"
                                  min={0}
                                  className={`${clsInput} h-10 text-right`}
                                  value={r.qty}
                                  onChange={(e) => updateRow(idx, "qty", e.target.value)}
                                />
                              </div>
                              <div className="px-1 py-1 flex items-center justify-center">
                                <button
                                  type="button"
                                  onClick={() => removeRow(idx)}
                                  className="p-1 rounded hover:bg-red-50 text-red-600"
                                  title="Hapus baris"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </React.Fragment>
                    );
                  })}

                  {/* group manual jika ada */}
                  {(rowsByPreset.get("manual") || []).length > 0 && (
                    <>
                      <div className="grid grid-cols-[1fr,100px,100px,40px] bg-gray-50 text-gray-700 text-[13px] font-medium">
                        <div className="px-3 py-2 col-span-3">Material Manual</div>
                        <div className="px-1 py-1 flex items-center justify-center">
                          <button
                            type="button"
                            onClick={addRow}
                            className="px-2 py-1 rounded text-gray-700 hover:bg-gray-100"
                            title="Tambah baris manual"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {(rowsByPreset.get("manual") || []).map((r) => {
                        const idx = rows.findIndex((rr) => rr === r);
                        return (
                          <div key={idx} className="grid grid-cols-[1fr,100px,100px,40px] items-center text-sm">
                            <div className="px-2 py-1 min-w-0">
                              <input
                                className={`${clsInput} h-10`}
                                value={r.material}
                                onChange={(e) => updateRow(idx, "material", e.target.value)}
                                placeholder="Nama material"
                              />
                            </div>
                            <div className="px-2 py-1">
                              <input
                                className={`${clsInput} h-10`}
                                value={r.unit}
                                onChange={(e) => updateRow(idx, "unit", e.target.value)}
                                placeholder="SAT"
                              />
                            </div>
                            <div className="px-2 py-1">
                              <input
                                type="number"
                                min={0}
                                className={`${clsInput} h-10 text-right`}
                                value={r.qty}
                                onChange={(e) => updateRow(idx, "qty", e.target.value)}
                              />
                            </div>
                            <div className="px-1 py-1 flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => removeRow(idx)}
                                className="p-1 rounded hover:bg-red-50 text-red-600"
                                title="Hapus baris"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* kontrol: Tambah jenis konstruksi (dipindah ke bagian bawah) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
            <div className="md:col-span-2">
              <label className="block text-[13px] text-gray-600 mb-1">Tambah jenis konstruksi</label>
              <div className="flex gap-2">
                <SelectDown
                  value={selectKey}
                  onChange={(e) => setSelectKey(e.target.value)}
                  className={clsSelect}
                >
                  <option value="" disabled hidden>
                    — Pilih jenis konstruksi —
                  </option>
                  {KONSTRUKSI_OPTIONS.map((opt) => (
                    <option key={opt.key} value={opt.key}>
                      {opt.label}
                    </option>
                  ))}
                </SelectDown>
                <button
                  type="button"
                  onClick={() => applyPreset(selectKey)}
                  disabled={!selectKey}
                  className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm shadow-sm ${
                    !selectKey
                      ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50"
                  }`}
                  title={!selectKey ? "Pilih jenis konstruksi dulu" : "Tambah preset"}
                >
                  <Plus className="w-4 h-4" /> Tambah
                </button>
              </div>
              {!requirement.meets && (
                <div className="mt-2 text-[12px] text-emerald-700/80">
                </div>
              )}
            </div>
            <div className="flex items-center justify-end">
              <div className="rounded-lg bg-emerald-50 border border-emerald-100 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-emerald-800">Total:</span>
                  <span className="text-base font-semibold text-emerald-900 tabular-nums">
                    Rp{total.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Total baris: {rows.length}</div>
          </div>
      </div>
    </div>
  );
});
