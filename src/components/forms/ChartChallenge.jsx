import React, { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from "react";
import { motion } from "framer-motion";
import { BarChart as BarIcon, Download } from "lucide-react";
import { KONSTRUKSI_OPTIONS } from "../../constants/consItems";
import SelectDown from "../ui/SelectDown";
import chartImg from "../../images/ChartCons.jpg";
import { EXPECTED_CHART_ANSWERS } from "../../constants/expectedAnswers";

export default forwardRef(function ChartChallenge({ cheatTrigger = 0, onValidate, onCorrectImage, onAnswersChange }, ref) {
  const [answers, setAnswers] = useState({ A: "", B: "", C: "", D: "" });
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  // Beritahu parent gambar referensi untuk ditampilkan di langkah Material
  useEffect(() => { onCorrectImage?.(chartImg); }, [onCorrectImage]);

  const allFilled = Boolean(answers.A && answers.B && answers.C && answers.D);

  const handleChange = (key, value) => {
    setAnswers((p) => ({ ...p, [key]: value }));
  };

  // Kirim data answers ke parent setiap kali berubah
  useEffect(() => {
    onAnswersChange?.(answers);
  }, [answers, onAnswersChange]);

  // Auto-validate ketika semua field terisi
  useEffect(() => {
    if (allFilled && !submitted) {
      setSubmitted(true);
      setIsCorrect(true);
      onValidate?.(true);
    }
  }, [allFilled, submitted, onValidate]);

  // Cheat: auto-isi 4 box dengan 4 opsi pertama
  useEffect(() => {
    if (cheatTrigger > 0) {
      setAnswers({ ...EXPECTED_CHART_ANSWERS });
    }
  }, [cheatTrigger]);

  // API untuk dipanggil dari App.js
  useImperativeHandle(ref, () => ({
    cheat: () => {
      setAnswers({ ...EXPECTED_CHART_ANSWERS });
      setTimeout(() => onValidate?.(true), 0);
    },
  }));

  // ==== Canvas zoom/pan viewer for ChartCons.jpg ====
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const [userScale, setUserScale] = useState(1);
  const [fitScale, setFitScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ w: 0, h: 0 });
  const MIN_Z = 0.5;
  const MAX_Z = 4;

  // load image once (from src/images)
  useEffect(() => {
    const img = new Image();
    img.src = chartImg;
    img.onload = () => {
      imgRef.current = img;
      // trigger initial layout
      handleResize();
    };
    return () => { imgRef.current = null; };
  }, []);

  const handleResize = useCallback(() => {
    if (!containerRef.current || !imgRef.current) return;
    const cw = containerRef.current.clientWidth;
    const ch = containerRef.current.clientHeight;
    setSize({ w: cw, h: ch });
    const fs = Math.min(cw / imgRef.current.width, ch / imgRef.current.height);
    setFitScale(fs || 1);
    // center image
    const x = (cw - imgRef.current.width * fs) / 2;
    const y = (ch - imgRef.current.height * fs) / 2;
    setOffset({ x, y });
    setUserScale(1);
  }, []);

  useEffect(() => {
    const on = () => handleResize();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, [handleResize]);

  // draw when deps change
  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(cw * dpr));
    canvas.height = Math.max(1, Math.floor(ch * dpr));
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // clear
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // use CSS pixel space
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const s = fitScale * userScale;
    ctx.setTransform(dpr * s, 0, 0, dpr * s, dpr * offset.x, dpr * offset.y);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0);
  }, [userScale, fitScale, offset, size]);

  const zoomAt = useCallback((factor, clientX, clientY) => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = clientX - rect.left;
    const cy = clientY - rect.top;
    const prev = userScale;
    const next = Math.max(MIN_Z, Math.min(MAX_Z, prev * factor));
    const sPrev = fitScale * prev;
    const sNext = fitScale * next;
    // world coords under cursor
    const wx = (cx - offset.x) / sPrev;
    const wy = (cy - offset.y) / sPrev;
    const nx = cx - wx * sNext;
    const ny = cy - wy * sNext;
    setOffset({ x: nx, y: ny });
    setUserScale(next);
  }, [fitScale, offset.x, offset.y, userScale]);

  const onWheel = useCallback((e) => {
    // Zoom hanya saat Ctrl ditekan; jika tidak, biarkan halaman menggulir normal
    if (!e.ctrlKey) return;
    e.preventDefault();
    const factor = e.deltaY > 0 ? 1 / 1.2 : 1.2;
    zoomAt(factor, e.clientX, e.clientY);
  }, [zoomAt]);

  // drag to pan
  const dragRef = useRef({ active: false, sx: 0, sy: 0, ox: 0, oy: 0 });
  const onMouseDown = (e) => {
    dragRef.current = { active: true, sx: e.clientX, sy: e.clientY, ox: offset.x, oy: offset.y };
  };
  const onMouseMove = (e) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.sx;
    const dy = e.clientY - dragRef.current.sy;
    setOffset({ x: dragRef.current.ox + dx, y: dragRef.current.oy + dy });
  };
  const endDrag = () => { dragRef.current.active = false; };

  const resetView = () => handleResize();

  // Download gambar chart
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = chartImg;
    link.download = 'Chart_Jaringan.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.section
      whileHover={{ boxShadow: "0 10px 40px 0 rgba(16,185,129,0.14)" }}
      className="w-full rounded-2xl border border-emerald-100 bg-white shadow-sm mb-6 md:mb-8"
      style={{ boxShadow: "0 6px 26px 0 rgba(16,185,129,0.08)" }}
    >
      {/* Header (non-collapsible) */}
      <div className="flex items-center gap-3 rounded-t-2xl bg-gradient-to-r from-emerald-50 to-emerald-100/40 px-6 py-4 border-b border-emerald-100">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600">
          <BarIcon className="h-5 w-5" />
        </div>
        <h3 className="text-base font-semibold text-emerald-900">Tugas Analisis Gambar Jaringan</h3>
      </div>

      {/* Body */}
      <div id="chart-body">
        <div className="p-6 md:p-8 space-y-5">
          <p className="text-sm text-emerald-900/80">
            Analisis gambar jaringan di bawah, kemudian tentukan jenis TR (Tegangan Rendah) yang tepat untuk masing-masing titik A, B, C, dan D.
          </p>

          {/* Gambar tunggal pada canvas dengan zoom/pan */}
          <div
            ref={containerRef}
            className="rounded-xl border border-emerald-100 overflow-hidden bg-black h-[60vh]"
          >
            <canvas
              ref={canvasRef}
              onWheel={onWheel}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={endDrag}
              onMouseLeave={endDrag}
              className="w-full h-full block select-none cursor-grab active:cursor-grabbing"
              aria-label="Canvas Chart Konsruksi"
            />
          </div>

          {/* Controls zoom */}
          <div className="flex items-center justify-between -mt-1">
            <div className="flex gap-2">
            <button
              type="button"
              onClick={() => zoomAt(1.2, canvasRef.current?.getBoundingClientRect().left + (canvasRef.current?.clientWidth||0)/2, canvasRef.current?.getBoundingClientRect().top + (canvasRef.current?.clientHeight||0)/2)}
              className="px-3 py-1.5 text-sm rounded border border-emerald-200 bg-white hover:bg-emerald-50"
            >
              Zoom +
            </button>
            <button
              type="button"
              onClick={() => zoomAt(1/1.2, canvasRef.current?.getBoundingClientRect().left + (canvasRef.current?.clientWidth||0)/2, canvasRef.current?.getBoundingClientRect().top + (canvasRef.current?.clientHeight||0)/2)}
              className="px-3 py-1.5 text-sm rounded border border-emerald-200 bg-white hover:bg-emerald-50"
            >
              Zoom -
            </button>
            <button
              type="button"
              onClick={resetView}
              className="px-3 py-1.5 text-sm rounded border border-emerald-200 bg-white hover:bg-emerald-50"
            >
              Reset
            </button>
            </div>
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-1.5 text-sm rounded border border-emerald-500 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium"
            >
              <Download className="w-4 h-4" />
              Download Gambar
            </button>
          </div>

          {/* Empat Titik jawaban */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["A", "B", "C", "D"].map((k) => (
              <div key={k} className="rounded-xl border border-gray-200 p-3">
                <div className="text-sm font-medium text-emerald-800 mb-2">Titik {k}</div>
                <SelectDown
                  name={k}
                  value={answers[k]}
                  onChange={(e) => handleChange(k, e.target.value)}
                  className="h-11"
                >
                  <option value="" disabled hidden>Pilih TR…</option>
                  {KONSTRUKSI_OPTIONS.map((opt) => (
                    <option key={opt.key} value={opt.key}>{opt.label}</option>
                  ))}
                </SelectDown>
              </div>
            ))}
          </div>

          {/* Pesan sukses otomatis */}
          {submitted && (
            <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 mt-4">
              <span className="text-sm text-emerald-700">✓ Semua titik telah diisi. Lanjutkan ke langkah berikutnya.</span>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
});