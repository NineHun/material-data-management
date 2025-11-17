import React, { useEffect, useMemo } from "react";
import { User2, Copy } from "lucide-react";
import { motion } from "framer-motion";
import SelectDown from "../../components/ui/SelectDown";
import { DAYA_OPTIONS } from "../../constants/dayaOptions";

/**
 * IdentitasPelanggan — refined UI
 * - Clear sectioning with fieldsets
 * - Better spacing, readable labels, consistent inputs
 * - Accessible focus states & helpers
 * - Responsive 2-col layout (1-col on small screens)
 */
export default function IdentitasPelanggan({ formData, onChange, onSubmit, statusBanner }) {
  const isPasangBaru = formData.jenisPermohonan === "baru";
  const isPasangLama = formData.jenisPermohonan === "lama";
  // Collapse dihilangkan: konten selalu terlihat

  // Compose selectable tarif options from DAYA_OPTIONS
  const tarifOptions = useMemo(() => {
    const options = [];
    DAYA_OPTIONS.forEach((opt) => {
      opt.batas.forEach((batas) => {
        options.push({
          value: `${opt.golongan}|${batas.label}`,
          golongan: opt.golongan,
          label: batas.label,
          min: batas.min,
          max: batas.max,
          biaya: batas.biaya,
        });
      });
    });
    return options;
  }, []);

  const selectedTarifLama = useMemo(
    () => tarifOptions.find((t) => t.value === formData.tarifLama),
    [tarifOptions, formData.tarifLama]
  );
  const selectedTarifBaru = useMemo(
    () => tarifOptions.find((t) => t.value === formData.tarifBaru),
    [tarifOptions, formData.tarifBaru]
  );

  // Auto-generate ID pelanggan once
  useEffect(() => {
    if (!formData.idPelanggan) {
      const randomId =
        Date.now().toString().slice(-6) +
        Math.floor(10000 + Math.random() * 90000).toString();
      onChange({ target: { name: "idPelanggan", value: randomId } });
    }
  }, [formData.idPelanggan, onChange]);

  // Auto-validate identitas: panggil onSubmit setiap field kunci berubah
  useEffect(() => {
    if (typeof onSubmit === "function") {
      onSubmit();
    }
  }, [onSubmit, formData.namaPelanggan, formData.jenisPermohonan, formData.dayaBaru]);

  // ---------- UI helpers ----------
  const labelCls = "block text-xs font-medium tracking-wide text-emerald-900/70 mb-1";
  const inputCls =
    "w-full h-11 rounded-xl border border-gray-200 bg-white px-3.5 text-[15px] outline-none transition " +
    "placeholder:text-gray-400 focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400";
  const readOnlyCls = "bg-gray-50 text-gray-600";
  const areaCls = inputCls + " py-2.5 h-auto";

  return (
    <motion.section
      whileHover={{ boxShadow: "0 10px 40px 0 rgba(16,185,129,0.14)" }}
      className="w-full rounded-2xl border border-emerald-100 bg-white shadow-sm"
      style={{ boxShadow: "0 6px 26px 0 rgba(16,185,129,0.08)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 rounded-t-2xl bg-gradient-to-r from-emerald-50 to-emerald-100/40 px-6 py-4">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600">
          <User2 className="h-5 w-5" />
        </div>
        <h3 className="text-base font-semibold text-emerald-900 flex-1">
          Data Pelanggan
        </h3>
      </div>

      {/* Body (selalu terlihat) */}
      <div id="identitas-body">
        <div className="p-6 md:p-8 space-y-8">
          {/* SECTION: Unit & Agenda */}
          <fieldset className="space-y-5">
            <legend className="text-sm font-semibold text-emerald-800/90">Unit & Agenda</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Unit UP (Asal)</label>
                <input
                  type="number"
                  name="unitUpAsal"
                  className={inputCls}
                  value={formData.unitUpAsal || ""}
                  onChange={onChange}
                  placeholder="Masukkan kode Unit UP asal"
                />
              </div>
              <div>
                <label className={labelCls}>Unit UP (Tujuan)</label>
                <input
                  type="number"
                  name="unitUpTujuan"
                  className={inputCls}
                  value={formData.unitUpTujuan || ""}
                  onChange={onChange}
                  placeholder="Masukkan kode Unit UP tujuan"
                />
              </div>
              <div className="relative">
                <label className={labelCls}>ID Pelanggan</label>
                <input
                  type="text"
                  name="idPelanggan"
                  className={`${inputCls} ${readOnlyCls} pr-12`}
                  value={formData.idPelanggan || ""}
                  readOnly
                  placeholder="Otomatis tergenerate"
                />
                <button
                  type="button"
                  className="absolute right-2.5 top-7 inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-700 hover:bg-gray-50"
                  onClick={() => navigator.clipboard?.writeText(formData.idPelanggan || "")}
                  aria-label="Salin ID Pelanggan"
                >
                  <Copy className="h-3.5 w-3.5" /> Salin
                </button>
              </div>
              <div>
                <label className={labelCls}>No Agenda</label>
                <input
                  type="text"
                  name="noAgenda"
                  className={inputCls}
                  value={formData.noAgenda || ""}
                  onChange={onChange}
                  placeholder="Masukkan No Agenda"
                />
              </div>
              <div>
                <label className={labelCls}>Tanggal Agenda</label>
                <input
                  type="datetime-local"
                  name="tanggalAgenda"
                  className={inputCls}
                  value={formData.tanggalAgenda || ""}
                  onChange={onChange}
                />
                <p className="mt-1 text-[11px] text-gray-500">Gunakan tanggal & jam rencana kunjungan.</p>
              </div>
              <div>
                <label className={labelCls}>Jenis Permohonan</label>
                <SelectDown name="jenisPermohonan" value={formData.jenisPermohonan || ""} onChange={onChange} className={inputCls}>
                  <option value="" disabled hidden>
                    — Pilih Jenis Permohonan —
                  </option>
                  <option value="baru">Pasang Baru</option>
                  <option value="lama">Pasang Lama</option>
                </SelectDown>
              </div>
            </div>
          </fieldset>

          {/* SECTION: Identitas Pelanggan */}
          <fieldset className="space-y-5">
            <legend className="text-sm font-semibold text-emerald-800/90">Identitas Pelanggan</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Nama Pelanggan</label>
                <input
                  type="text"
                  name="namaPelanggan"
                  className={inputCls}
                  value={formData.namaPelanggan || ""}
                  onChange={onChange}
                  placeholder="Masukkan nama pelanggan"
                />
              </div>
              <div>
                <label className={labelCls}>Telp/HP</label>
                <input
                  type="text"
                  name="telp"
                  className={inputCls}
                  value={formData.telp || ""}
                  onChange={onChange}
                  placeholder="08xxxxxxxxxx"
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>Alamat Pelanggan</label>
                <textarea
                  name="alamatPelanggan"
                  className={areaCls}
                  rows={2}
                  value={formData.alamatPelanggan || ""}
                  onChange={onChange}
                  placeholder="Nama jalan, RT/RW, kelurahan, kecamatan, kota"
                />
              </div>
            </div>
          </fieldset>

          {/* SECTION: Data Pemohon */}
          <fieldset className="space-y-5">
            <legend className="text-sm font-semibold text-emerald-800/90">Data Pemohon</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Nama Pemohon</label>
                <input
                  type="text"
                  name="namaPemohon"
                  className={inputCls}
                  value={formData.namaPemohon || ""}
                  onChange={onChange}
                  placeholder="Masukkan nama pemohon"
                />
              </div>
              <div>
                <label className={labelCls}>Asal Mohon</label>
                <SelectDown name="asalMohon" value={formData.asalMohon || ""} onChange={onChange} className={inputCls}>
                  <option value="" disabled hidden>
                    — Pilih Asal Mohon —
                  </option>
                  <option value="PLN MOBILE">PLN MOBILE</option>
                </SelectDown>
              </div>
              <div>
                <label className={labelCls}>Alamat Pemohon</label>
                <input
                  type="text"
                  name="alamatPemohon"
                  className={inputCls}
                  value={formData.alamatPemohon || ""}
                  onChange={onChange}
                  placeholder="Masukkan alamat pemohon"
                />
              </div>
              <div>
                <label className={labelCls}>Keperluan</label>
                <input
                  type="text"
                  name="keperluan"
                  className={inputCls}
                  value={formData.keperluan || ""}
                  onChange={onChange}
                  placeholder="Contoh: Permohonan Pasang Baru"
                />
              </div>
            </div>
          </fieldset>

          {/* SECTION: Dokumen & Tarif/Daya */}
          <fieldset className="space-y-5">
            <legend className="text-sm font-semibold text-emerald-800/90">Dokumen & Tarif/Daya</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>NIK</label>
                <input type="text" name="nik" className={inputCls} value={formData.nik || ""} onChange={onChange} placeholder="16 digit NIK" />
              </div>
              <div>
                <label className={labelCls}>No Kartu Keluarga</label>
                <input type="text" name="noKk" className={inputCls} value={formData.noKk || ""} onChange={onChange} placeholder="Nomor KK" />
              </div>
              <div>
                <label className={labelCls}>NPWP</label>
                <input type="text" name="npwp" className={inputCls} value={formData.npwp || ""} onChange={onChange} placeholder="(opsional)" />
              </div>
              <div>
                <label className={labelCls}>No Register</label>
                <input type="text" name="noRegister" className={inputCls} value={formData.noRegister || ""} onChange={onChange} placeholder="Masukkan nomor register" />
              </div>

              <div>
                <label className={labelCls}>Paket SAR</label>
                <SelectDown name="paketSar" value={formData.paketSar || ""} onChange={onChange} className={inputCls}>
                  <option value="" disabled hidden>
                    — Pilih Paket SAR —
                  </option>
                  <option value="PRABAYAR (PREPAID) SATU ARAH">PRABAYAR (PREPAID) SATU ARAH</option>
                </SelectDown>
              </div>
              <div>
                <label className={labelCls}>Kapasitas Output Inverter System PLTS Atap</label>
                <input type="text" name="kapasitasOutput" className={inputCls} value={formData.kapasitasOutput || ""} onChange={onChange} placeholder="Contoh: 3.3 kW" />
              </div>

              {/* Tarif/Daya Lama */}
              <div className={isPasangBaru ? "opacity-60" : ""}>
                <label className={labelCls}>Tarif (Lama)</label>
                <SelectDown
                  name="tarifLama"
                  value={formData.tarifLama || ""}
                  onChange={onChange}
                  disabled={isPasangBaru}
                  className={inputCls}
                >
                  <option value="" disabled hidden>
                    — Pilih Tarif Lama —
                  </option>
                  {tarifOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.golongan} - {opt.label} (Rp {opt.biaya.toLocaleString("id-ID")}/kWh)
                    </option>
                  ))}
                </SelectDown>
              </div>
              <div className={isPasangBaru ? "opacity-60" : ""}>
                <label className={labelCls}>Daya (Lama)</label>
                <input
                  type="number"
                  name="dayaLama"
                  className={inputCls}
                  value={formData.dayaLama || ""}
                  onChange={onChange}
                  disabled={isPasangBaru}
                  min={selectedTarifLama ? selectedTarifLama.min : undefined}
                  max={selectedTarifLama ? selectedTarifLama.max : undefined}
                  placeholder={selectedTarifLama ? `Batas: ${selectedTarifLama.label}` : "Input harus berupa angka"}
                />
              </div>
              <div className={isPasangBaru ? "opacity-60" : ""}>
                <label className={labelCls}>KDPT (Lama)</label>
                <input type="text" name="kdptLama" className={inputCls} value={formData.kdptLama || ""} onChange={onChange} disabled={isPasangBaru} placeholder="Masukkan KDPT lama" />
              </div>
              <div className={isPasangBaru ? "opacity-60" : ""}>
                <label className={labelCls}>KDPT_2 (Lama)</label>
                <input type="text" name="kdpt2Lama" className={inputCls} value={formData.kdpt2Lama || ""} onChange={onChange} disabled={isPasangBaru} placeholder="Masukkan KDPT_2 lama" />
              </div>

              {/* Tarif/Daya Baru */}
              <div className={isPasangLama ? "opacity-60" : ""}>
                <label className={labelCls}>Tarif (Baru)</label>
                <SelectDown
                  name="tarifBaru"
                  value={formData.tarifBaru || ""}
                  onChange={onChange}
                  disabled={isPasangLama}
                  className={inputCls}
                >
                  <option value="" disabled hidden>
                    — Pilih Tarif Baru —
                  </option>
                  {tarifOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.golongan} - {opt.label} (Rp {opt.biaya.toLocaleString("id-ID")}/kWh)
                    </option>
                  ))}
                </SelectDown>
              </div>
              <div className={isPasangLama ? "opacity-60" : ""}>
                <label className={labelCls}>Daya (Baru)</label>
                <input
                  type="number"
                  name="dayaBaru"
                  className={inputCls}
                  value={formData.dayaBaru || ""}
                  onChange={onChange}
                  disabled={isPasangLama}
                  min={selectedTarifBaru ? selectedTarifBaru.min : undefined}
                  max={selectedTarifBaru ? selectedTarifBaru.max : undefined}
                  placeholder={selectedTarifBaru ? `Batas: ${selectedTarifBaru.label}` : "Input harus berupa angka"}
                />
              </div>
              <div className={isPasangLama ? "opacity-60" : ""}>
                <label className={labelCls}>KDPT (Baru)</label>
                <input type="text" name="kdptBaru" className={inputCls} value={formData.kdptBaru || ""} onChange={onChange} disabled={isPasangLama} placeholder="Masukkan KDPT baru" />
              </div>
              <div className={isPasangLama ? "opacity-60" : ""}>
                <label className={labelCls}>KDPT_2 (Baru)</label>
                <input type="text" name="kdpt2Baru" className={inputCls} value={formData.kdpt2Baru || ""} onChange={onChange} disabled={isPasangLama} placeholder="Masukkan KDPT_2 baru" />
              </div>
            </div>
          </fieldset>

          {/* Status banner (validation hasil otomatis) */}
          <div className="pt-2">{statusBanner}</div>
        </div>
      </div>
    </motion.section>
  );
}
