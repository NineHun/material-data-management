import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Plug, Box, Building2, ListTree, ArrowLeft, ArrowRight } from "lucide-react";
import { saveRekapExcel } from "../../utils/xlsx";
import { saveRekapPdfFromElement } from "../../utils/pdf";
import { KONSTRUKSI_OPTIONS } from "../../constants/consItems";

export default function RekapInvestasi({ data, onReset }) {
  const navigate = useNavigate();
  // reference to the main section; kept for backward compatibility but no longer used for PDF export
  const sectionRef = useRef(null);
  // reference to the printable content; used when exporting to PDF so the action buttons are excluded
  const contentRef = useRef(null);
  if (!data) return null;
  const {
    customer,
    jtr,
    sr,
  material,
    totalMaterial,
    totalJasa,
    totalSum,
    ppn,
    totalAfterPpn,
    details,
  } = data || {};

  const fmt = (v) => (v !== undefined && v !== null ? `Rp${Number(v).toLocaleString("id-ID")}` : "-");

  // Build konstruksi detail groups from ConsSelection
  const kons = data?.details?.konstruksi || {};
  const presetInstances = Array.isArray(kons?.presetInstances) ? kons.presetInstances : [];
  const konsItems = Array.isArray(kons?.items) ? kons.items : [];
  const labelOf = (key) => KONSTRUKSI_OPTIONS.find((o) => o.key === key)?.label || String(key).replace(/_/g, "-");
  const konsGroups = presetInstances.map((pi) => ({
    id: pi.id,
    key: pi.key,
    label: labelOf(pi.key),
    hargaSatuan: Number(pi.hargaSatuan) || 0,
    hargaJasa: Number(pi.hargaJasa) || 0,
    totalPerSet: (Number(pi.hargaSatuan) || 0) + (Number(pi.hargaJasa) || 0),
    rows: konsItems
      .filter((it) => it.presetId === pi.id)
      .map((it) => ({ name: it.nama, unit: it.unit, qty: it.qty })),
  }));

  return (
    <section ref={sectionRef} className="w-full min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-6">
      {/* Header + actions */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
          <div className="flex-1">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
              Rekap Investasi
            </h3>
            <p className="text-sm text-gray-600 mt-1">Rencana Anggaran Biaya (RAB)</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => saveRekapPdfFromElement(contentRef.current)}
              className="inline-flex items-center gap-2 rounded-xl bg-white border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:shadow-md hover:border-sky-300 transition-all"
            >
              📄 Unduh PDF
            </button>
            <button
              type="button"
              onClick={() => saveRekapExcel(data)}
              className="inline-flex items-center gap-2 rounded-xl bg-white border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all"
            >
              📊 Unduh Excel
            </button>
            <button
              type="button"
              onClick={() => navigate("/kkp", { state: { kkpData: { rekapData: data } } })}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all"
            >
              Lanjut ke KKP
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* All printable content */}
      <div ref={contentRef} className="max-w-7xl mx-auto space-y-6"
        style={{ background: 'white', padding: '2rem', borderRadius: '1rem' }}>
        
        {/* Header Card dengan Customer Info */}
        <div className="bg-gradient-to-r from-sky-500 to-emerald-500 rounded-2xl shadow-xl p-8 text-white">
          <h2 className="text-2xl font-bold text-center mb-6">
            REKAP RENCANA ANGGARAN BIAYA (RAB)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="font-semibold min-w-[140px]">Pelanggan An.</span>
                <span className="flex-1">
                  : {customer?.nama}
                  {customer?.daya ? `, ${customer.daya} VA` : ""}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-semibold min-w-[140px]">Alamat</span>
                <span className="flex-1">: {customer?.alamat || "-"}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="font-semibold min-w-[140px]">No. WO</span>
                <span className="flex-1">: {customer?.noWO || "-"}</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-semibold min-w-[140px]">Tahun Anggaran</span>
                <span className="flex-1">: {customer?.year || "-"}</span>
              </div>
            </div>
          </div>
        </div>
        {/* Tabel utama dengan desain modern */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="overflow-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-sky-600 to-emerald-600">
                  <th className="px-4 py-4 text-left text-white font-semibold text-sm">No.</th>
                  <th className="px-4 py-4 text-left text-white font-semibold text-sm">Uraian</th>
                  <th className="px-4 py-4 text-center text-white font-semibold text-sm">Volume</th>
                  <th className="px-4 py-4 text-center text-white font-semibold text-sm">Satuan</th>
                  <th className="px-4 py-4 text-right text-white font-semibold text-sm">Jumlah Total (Rp)</th>
                </tr>
              </thead>
              <tbody>
                {/* Baris 1: Kebutuhan Kontruksi TR */}
                <tr className="border-b border-gray-100 hover:bg-sky-50/50 transition-colors">
                  <td className="px-4 py-4 text-center font-medium text-gray-900">1</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-sky-100">
                        <Building2 className="w-5 h-5 text-sky-600" />
                      </div>
                      <span className="font-medium text-gray-900">Kebutuhan Kontruksi TR</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center text-gray-700">1</td>
                  <td className="px-4 py-4 text-center text-gray-700">Lot</td>
                  <td className="px-4 py-4 text-right font-semibold text-gray-900 whitespace-nowrap">{fmt(jtr.total)}</td>
                </tr>
                {/* Baris 2: Kebutuhan SR & APP */}
                <tr className="border-b border-gray-100 hover:bg-emerald-50/50 transition-colors">
                  <td className="px-4 py-4 text-center font-medium text-gray-900">2</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-100">
                        <Plug className="w-5 h-5 text-emerald-600" />
                      </div>
                      <span className="font-medium text-gray-900">Kebutuhan SR & APP</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center text-gray-700">1</td>
                  <td className="px-4 py-4 text-center text-gray-700">Lot</td>
                  <td className="px-4 py-4 text-right font-semibold text-gray-900 whitespace-nowrap">{fmt(sr.total)}</td>
                </tr>
                {/* Baris 3: Material MDU */}
                <tr className="border-b border-gray-100 hover:bg-amber-50/50 transition-colors">
                  <td className="px-4 py-4 text-center font-medium text-gray-900">3</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-amber-100">
                        <Box className="w-5 h-5 text-amber-600" />
                      </div>
                      <span className="font-medium text-gray-900">Kebutuhan MDU</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center text-gray-700">1</td>
                  <td className="px-4 py-4 text-center text-gray-700">Lot</td>
                  <td className="px-4 py-4 text-right font-semibold text-gray-900 whitespace-nowrap">{fmt(material.total)}</td>
                </tr>
                {/* Baris JUMLAH */}
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-y-2 border-gray-200">
                  <td className="px-4 py-4 text-center font-bold text-gray-900" colSpan={4}>
                    JUMLAH
                  </td>
                  <td className="px-4 py-4 text-right font-bold text-lg text-gray-900 whitespace-nowrap">{fmt(totalSum)}</td>
                </tr>
                {/* Baris PPN */}
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 text-center font-semibold text-gray-700" colSpan={4}>
                    PPN (11%)
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900 whitespace-nowrap">{fmt(ppn)}</td>
                </tr>
                {/* Baris JUMLAH SETELAH PPN */}
                <tr className="bg-gradient-to-r from-emerald-500 to-sky-500">
                  <td className="px-4 py-5 text-center font-bold text-white text-base" colSpan={4}>
                    JUMLAH SETELAH PPN
                  </td>
                  <td className="px-4 py-5 text-right font-bold text-xl text-white whitespace-nowrap">{fmt(totalAfterPpn)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* DETAIL MATERIAL TERPILIH */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b-2 border-gradient-to-r from-sky-500 to-emerald-500">
            <div className="p-2 rounded-lg bg-gradient-to-br from-sky-500 to-emerald-500">
              <ListTree className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
              Detail Material Terpilih
            </h3>
          </div>

          {/* Konstruksi TR (dipilih) */}
          {konsGroups.length > 0 && (
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-sky-100 to-sky-50 px-5 py-4 border-b border-sky-200">
                <h4 className="font-bold text-sky-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5" /> Detail Konstruksi TR
                </h4>
              </div>
              <div className="p-5 space-y-4">
                {konsGroups.map((g) => (
                  <div key={g.id} className="rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 flex flex-wrap items-center justify-between text-sm border-b border-gray-200">
                      <div className="font-semibold text-gray-900">{g.label}</div>
                      <div className="flex flex-wrap items-center gap-4 text-gray-700">
                        <span className="bg-white px-3 py-1 rounded-full text-xs">
                          Material: <strong className="tabular-nums text-sky-600">{fmt(g.hargaSatuan)}</strong>
                        </span>
                        <span className="bg-white px-3 py-1 rounded-full text-xs">
                          Jasa: <strong className="tabular-nums text-emerald-600">{fmt(g.hargaJasa)}</strong>
                        </span>
                        <span className="bg-gradient-to-r from-sky-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          Total: {fmt(g.totalPerSet)}
                        </span>
                      </div>
                    </div>
                    {g.rows.length > 0 && (
                      <div className="overflow-auto">
                        <table className="w-full text-sm divide-y divide-gray-200">
                          <thead className="bg-white">
                            <tr>
                              <th className="px-2 py-1 text-left">Material</th>
                              <th className="px-2 py-1 text-center">Unit</th>
                              <th className="px-2 py-1 text-right">Jumlah</th>
                            </tr>
                          </thead>
                          <tbody>
                            {g.rows.map((r, i) => (
                              <tr key={i} className="odd:bg-white even:bg-gray-50">
                                <td className="px-2 py-1">{r.name}</td>
                                <td className="px-2 py-1 text-center">{r.unit}</td>
                                <td className="px-2 py-1 text-right tabular-nums">{r.qty}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detail SR & APP */}
          {(details?.sarSr?.sr?.length > 0 || details?.sarSr?.app?.length > 0 || details?.sarSr?.konduktor) && (
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-100 to-emerald-50 px-5 py-4 border-b border-emerald-200">
                <h4 className="font-bold text-emerald-900 flex items-center gap-2">
                  <Plug className="w-5 h-5" /> Detail Kebutuhan SR & APP
                </h4>
              </div>
              <div className="p-5 space-y-4">
                {/* Detail Konduktor NFA 2X - T 4 x 35 mm² */}
                {details.sarSr.konduktor && (
                  <div className="rounded-lg border border-emerald-200 bg-gradient-to-r from-emerald-50 to-white overflow-hidden hover:shadow-md transition-shadow">
                    <div className="px-4 py-3 flex flex-wrap items-center justify-between text-sm">
                      <div className="font-semibold text-gray-900 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        {details.sarSr.konduktor.name}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-gray-700">
                        <span className="bg-white px-3 py-1 rounded-full text-xs border border-emerald-200">
                          Qty (ms): <strong className="tabular-nums text-emerald-600">{details.sarSr.konduktor.qtyMs}</strong>
                        </span>
                        <span className="bg-white px-3 py-1 rounded-full text-xs border border-emerald-200">
                          Qty (mtr): <strong className="tabular-nums text-emerald-600">{details.sarSr.konduktor.qtyMtr}</strong>
                        </span>
                        <span className="bg-white px-3 py-1 rounded-full text-xs border border-emerald-200">
                          @ {fmt(details.sarSr.konduktor.unitPrice)}
                        </span>
                        <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          Total: {fmt(details.sarSr.konduktor.totalPrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Detail SR */}
                {details.sarSr.sr?.map((srPackage, idx) => (
                  <div key={`sr-${idx}`} className="rounded-lg border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-3 py-2 flex flex-wrap items-center justify-between text-sm">
                      <div className="font-medium text-gray-800">{srPackage.packageName}</div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <span>Harga per Set: <strong className="tabular-nums">{fmt(srPackage.pricePerSet)}</strong></span>
                        <span>Qty Set: <strong className="tabular-nums">{srPackage.setQty}</strong></span>
                        <span>Total: <strong className="tabular-nums">{fmt(srPackage.totalPrice)}</strong></span>
                      </div>
                    </div>
                    {srPackage.materials?.length > 0 && (
                      <div className="overflow-auto">
                        <table className="w-full text-sm divide-y divide-gray-200">
                          <thead className="bg-white">
                            <tr>
                              <th className="px-2 py-1 text-left">Material</th>
                              <th className="px-2 py-1 text-center">Qty/Set</th>
                              <th className="px-2 py-1 text-center">Total Qty</th>
                              <th className="px-2 py-1 text-center">Unit</th>
                            </tr>
                          </thead>
                          <tbody>
                            {srPackage.materials.map((mat, i) => (
                              <tr key={i} className="odd:bg-white even:bg-gray-50">
                                <td className="px-2 py-1">{mat.name}</td>
                                <td className="px-2 py-1 text-center tabular-nums">{mat.qtyPerSet}</td>
                                <td className="px-2 py-1 text-center tabular-nums">{mat.totalQty}</td>
                                <td className="px-2 py-1 text-center">{mat.unit}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))}

                {/* Detail APP */}
                {details.sarSr.app?.map((appPackage, idx) => (
                  <div key={`app-${idx}`} className="rounded-lg border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-3 py-2 flex flex-wrap items-center justify-between text-sm">
                      <div className="font-medium text-gray-800">{appPackage.packageName}</div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <span>Harga per Set: <strong className="tabular-nums">{fmt(appPackage.pricePerSet)}</strong></span>
                        <span>Qty Set: <strong className="tabular-nums">{appPackage.setQty}</strong></span>
                        <span>Total: <strong className="tabular-nums">{fmt(appPackage.totalPrice)}</strong></span>
                      </div>
                    </div>
                    {appPackage.materials?.length > 0 && (
                      <div className="overflow-auto">
                        <table className="w-full text-sm divide-y divide-gray-200">
                          <thead className="bg-white">
                            <tr>
                              <th className="px-2 py-1 text-left">Material</th>
                              <th className="px-2 py-1 text-center">Qty/Set</th>
                              <th className="px-2 py-1 text-center">Total Qty</th>
                              <th className="px-2 py-1 text-center">Unit</th>
                            </tr>
                          </thead>
                          <tbody>
                            {appPackage.materials.map((mat, i) => (
                              <tr key={i} className="odd:bg-white even:bg-gray-50">
                                <td className="px-2 py-1">{mat.name}</td>
                                <td className="px-2 py-1 text-center tabular-nums">{mat.qtyPerSet}</td>
                                <td className="px-2 py-1 text-center tabular-nums">{mat.totalQty}</td>
                                <td className="px-2 py-1 text-center">{mat.unit}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Material Konduktor & Tiang */}
          {(details?.material?.konduktor?.length > 0 || details?.material?.tiang?.length > 0) && (
            <div>
              <h4 className="font-semibold text-sky-800 mb-2">Detail Material (Konduktor & Tiang)</h4>
              <div className="overflow-auto">
                <table className="w-full text-sm divide-y divide-gray-200 rounded-lg shadow-sm">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-2 py-1 text-left">Material</th>
                      <th className="px-2 py-1">Unit</th>
                      <th className="px-2 py-1 text-right">Qty</th>
                      <th className="px-2 py-1 text-right">Harga Satuan</th>
                      <th className="px-2 py-1 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {[...(details.material?.konduktor || []), ...(details.material?.tiang || [])].map((it, i) => (
                      <tr key={i} className="odd:bg-white even:bg-gray-50">
                        <td className="border px-2 py-1">{it.name}</td>
                        <td className="border px-2 py-1 text-center">{it.unit}</td>
                        <td className="border px-2 py-1 text-right">{it.qty}</td>
                        <td className="border px-2 py-1 text-right">{fmt(it.unitPrice)}</td>
                        <td className="border px-2 py-1 text-right">{fmt(it.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pole Supporter Package */}
          {details?.material?.poleSupporter && (
            <div>
              <h4 className="font-semibold text-sky-800 mb-2 flex items-center gap-2">
                <ListTree className="w-4 h-4" /> Detail Pole Supporter
              </h4>
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-3 py-2 flex flex-wrap items-center justify-between text-sm">
                  <div className="font-medium text-gray-800">{details.material.poleSupporter.name}</div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <span>Harga Paket: <strong className="tabular-nums">{fmt(details.material.poleSupporter.price)}</strong></span>
                  </div>
                </div>
                {details.material.poleSupporter.materials?.length > 0 && (
                  <div className="overflow-auto">
                    <table className="w-full text-sm divide-y divide-gray-200">
                      <thead className="bg-white">
                        <tr>
                          <th className="px-2 py-1 text-left">Material</th>
                          <th className="px-2 py-1 text-center">Unit</th>
                          <th className="px-2 py-1 text-right">Jumlah</th>
                        </tr>
                      </thead>
                      <tbody>
                        {details.material.poleSupporter.materials.map((mat, i) => (
                          <tr key={i} className="odd:bg-white even:bg-gray-50">
                            <td className="px-2 py-1">{mat.name}</td>
                            <td className="px-2 py-1 text-center">{mat.unit}</td>
                            <td className="px-2 py-1 text-right tabular-nums">{mat.qty}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Grounding Package */}
          {details?.material?.grounding && (
            <div>
              <h4 className="font-semibold text-sky-800 mb-2 flex items-center gap-2">
                <ListTree className="w-4 h-4" /> Detail Grounding
              </h4>
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-3 py-2 flex flex-wrap items-center justify-between text-sm">
                  <div className="font-medium text-gray-800">{details.material.grounding.name}</div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <span>Harga Paket: <strong className="tabular-nums">{fmt(details.material.grounding.price)}</strong></span>
                  </div>
                </div>
                {details.material.grounding.materials?.length > 0 && (
                  <div className="overflow-auto">
                    <table className="w-full text-sm divide-y divide-gray-200">
                      <thead className="bg-white">
                        <tr>
                          <th className="px-2 py-1 text-left">Material</th>
                          <th className="px-2 py-1 text-center">Unit</th>
                          <th className="px-2 py-1 text-right">Jumlah</th>
                        </tr>
                      </thead>
                      <tbody>
                        {details.material.grounding.materials.map((mat, i) => (
                          <tr key={i} className="odd:bg-white even:bg-gray-50">
                            <td className="px-2 py-1">{mat.name}</td>
                            <td className="px-2 py-1 text-center">{mat.unit}</td>
                            <td className="px-2 py-1 text-right tabular-nums">{mat.qty}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Pondasi Package */}
          {details?.material?.pondasi && (
            <div>
              <h4 className="font-semibold text-sky-800 mb-2 flex items-center gap-2">
                <ListTree className="w-4 h-4" /> Detail Pondasi
              </h4>
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-3 py-2 flex flex-wrap items-center justify-between text-sm">
                  <div className="font-medium text-gray-800">{details.material.pondasi.name}</div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <span>Harga Paket: <strong className="tabular-nums">{fmt(details.material.pondasi.price)}</strong></span>
                  </div>
                </div>
                {details.material.pondasi.materials?.length > 0 && (
                  <div className="overflow-auto">
                    <table className="w-full text-sm divide-y divide-gray-200">
                      <thead className="bg-white">
                        <tr>
                          <th className="px-2 py-1 text-left">Material</th>
                          <th className="px-2 py-1 text-center">Unit</th>
                          <th className="px-2 py-1 text-right">Jumlah</th>
                        </tr>
                      </thead>
                      <tbody>
                        {details.material.pondasi.materials.map((mat, i) => (
                          <tr key={i} className="odd:bg-white even:bg-gray-50">
                            <td className="px-2 py-1">{mat.name}</td>
                            <td className="px-2 py-1 text-center">{mat.unit}</td>
                            <td className="px-2 py-1 text-right tabular-nums">{mat.qty}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Conductor Accessories */}
          {details?.material?.conductorAccessories?.length > 0 && (
            <div>
              <h4 className="font-semibold text-sky-800 mb-2 flex items-center gap-2">
                <Box className="w-4 h-4" /> Detail Conductor Accessories
              </h4>
              <div className="overflow-auto">
                <table className="w-full text-sm divide-y divide-gray-200 rounded-lg shadow-sm">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-2 py-1 text-left">Material</th>
                      <th className="px-2 py-1">Unit</th>
                      <th className="px-2 py-1 text-right">Qty</th>
                      <th className="px-2 py-1 text-right">Harga Satuan</th>
                      <th className="px-2 py-1 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {details.material.conductorAccessories.map((it, i) => (
                      <tr key={i} className="odd:bg-white even:bg-gray-50">
                        <td className="border px-2 py-1">{it.name}</td>
                        <td className="border px-2 py-1 text-center">{it.unit}</td>
                        <td className="border px-2 py-1 text-right">{it.qty}</td>
                        <td className="border px-2 py-1 text-right">{fmt(it.unitPrice)}</td>
                        <td className="border px-2 py-1 text-right">{fmt(it.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Kumisan Package */}
          {details?.material?.kumisan && (
            <div>
              <h4 className="font-semibold text-sky-800 mb-2 flex items-center gap-2">
                <ListTree className="w-4 h-4" /> Detail Kumisan
              </h4>
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-3 py-2 flex flex-wrap items-center justify-between text-sm">
                  <div className="font-medium text-gray-800">{details.material.kumisan.name}</div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <span>Harga per Set: <strong className="tabular-nums">{fmt(details.material.kumisan.price)}</strong></span>
                    <span>Qty Set: <strong className="tabular-nums">{details.material.kumisan.qty}</strong></span>
                    <span>Total: <strong className="tabular-nums">{fmt(details.material.kumisan.price * details.material.kumisan.qty)}</strong></span>
                  </div>
                </div>
                {details.material.kumisan.materials?.length > 0 && (
                  <div className="overflow-auto">
                    <table className="w-full text-sm divide-y divide-gray-200">
                      <thead className="bg-white">
                        <tr>
                          <th className="px-2 py-1 text-left">Material</th>
                          <th className="px-2 py-1 text-center">Qty/Set</th>
                          <th className="px-2 py-1 text-center">Total Qty</th>
                          <th className="px-2 py-1 text-center">Unit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {details.material.kumisan.materials.map((mat, i) => (
                          <tr key={i} className="odd:bg-white even:bg-gray-50">
                            <td className="px-2 py-1">{mat.name}</td>
                            <td className="px-2 py-1 text-center tabular-nums">{mat.qtyPerSet}</td>
                            <td className="px-2 py-1 text-center tabular-nums">{mat.calculatedQty}</td>
                            <td className="px-2 py-1 text-center">{mat.unit}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Commissioning Package */}
          {details?.material?.commissioning && (
            <div>
              <h4 className="font-semibold text-sky-800 mb-2 flex items-center gap-2">
                <ListTree className="w-4 h-4" /> Detail Commissioning
              </h4>
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-3 py-2 flex flex-wrap items-center justify-between text-sm">
                  <div className="font-medium text-gray-800">{details.material.commissioning.name}</div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <span>Harga Paket: <strong className="tabular-nums">{fmt(details.material.commissioning.price)}</strong></span>
                  </div>
                </div>
                <div className="px-3 py-2 text-sm text-gray-600">
                  Paket commissioning untuk pengujian dan komisioning JTR termasuk NIDI.
                </div>
              </div>
            </div>
          )}

          {/* Pole Top Arrangement Package */}
          {details?.material?.poleTopArrangement && (
            <div>
              <h4 className="font-semibold text-sky-800 mb-2 flex items-center gap-2">
                <ListTree className="w-4 h-4" /> Detail Pole Top Arrangement
              </h4>
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-3 py-2 flex flex-wrap items-center justify-between text-sm">
                  <div className="font-medium text-gray-800">{details.material.poleTopArrangement.name}</div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <span>Harga Paket: <strong className="tabular-nums">{fmt(details.material.poleTopArrangement.price)}</strong></span>
                  </div>
                </div>
                {details.material.poleTopArrangement.materials?.length > 0 && (
                  <div className="overflow-auto">
                    <table className="w-full text-sm divide-y divide-gray-200">
                      <thead className="bg-white">
                        <tr>
                          <th className="px-2 py-1 text-left">Material</th>
                          <th className="px-2 py-1 text-center">Unit</th>
                          <th className="px-2 py-1 text-right">Jumlah</th>
                        </tr>
                      </thead>
                      <tbody>
                        {details.material.poleTopArrangement.materials.map((mat, i) => (
                          <tr key={i} className="odd:bg-white even:bg-gray-50">
                            <td className="px-2 py-1">{mat.name}</td>
                            <td className="px-2 py-1 text-center">{mat.unit}</td>
                            <td className="px-2 py-1 text-right tabular-nums">{mat.qty}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Removed old SAR SR table - replaced with new Detail Kebutuhan SR & APP section above */}
          {/* Removed SAR TR and KHS detail sections */}
        </div>
      </div>
    </section>
  );
}