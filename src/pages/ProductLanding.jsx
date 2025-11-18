// src/pages/ProductLanding.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sprout, ArrowLeft } from "lucide-react";
import imgPeternakan from "../images/Peternakan.png";
import imgPerangkap from "../images/Lampu_Perangkap.png";
import imgPenggiling from "../images/Penggiling_Padi.png";
import imgTraktor from "../images/Traktor.png";
import imgPengairan from "../images/Pengairan_Listrik.png";
import imgLampuUltra from "../images/Lampu_Ultra.png";
import imgDistribusi from "../images/Distribusi.jpeg";
import imgProyek from "../images/Proyek.png";
import imgNiaga from "../images/Niaga.png";
import imgTransmisi from "../images/Transmisi.jpg";
import imgPembangkit from "../images/Pembangkit.png";
import imgHelp from "../images/Help.png";

const mainCards = [
  {
    title: "Distribusi",
    img: imgDistribusi,
    desc: "Solusi distribusi energi yang efisien.",
    key: "distribusi",
    disabled: false,
  },
  {
    title: "Retail & Niaga",
    img: imgNiaga, 
    desc: "Produk-produk elektrifikasi untuk kebutuhan Perencanaan Distribusi.",
    key: "niaga",
    disabled: true,
  },
  {
    title: "Proyek",
    img: imgProyek,
    desc: "Berbagai proyek elektrifikasi unggulan.",
    key: "proyek",
    disabled: true,
  },
  {
    title: "Pembangkit",
    img: imgPembangkit,
    desc: "Inovasi pembangkit listrik ramah lingkungan.",
    key: "pembangkit",
    disabled: true,
  },
  // {
  //   title: "Transmisi",
  //   img: imgTransmisi,
  //   desc: "Teknologi transmisi listrik modern.",
  //   key: "transmisi",
  // },
  // {
  //   title: "Tolong !!",
  //   img: imgHelp,
  //   desc: "Tata cara penggunaan aplikasi dan bantuan.",
  //   key: "help",
  // },
];

const cards = [
  {
    title: "Mesin Pengairan / Irigasi Listrik",
    img: imgPengairan,
    desc: "Pompa irigasi bertenaga listrik untuk suplai air yang stabil.",
    disabled: false,
  },
  {
    title: "Mesin Penghangat Ternak Ayam",
    img: imgPeternakan,
    desc: "Menjaga suhu kandang stabil agar ternak sehat dan produktif.",
    disabled: true,
  },
  {
    title: "Lampu Perangkap Hama",
    img: imgPerangkap,
    desc: "Mengurangi serangan hama di lahan dengan penarikan cahaya.",
    disabled: true,
  },
  {
    title: "Mesin Penggiling Padi",
    img: imgPenggiling,
    desc: "Proses penggilingan padi efisien dengan konsumsi energi hemat.",
    disabled: true,
  },
  {
    title: "Traktor/Bajak Listrik",
    img: imgTraktor,
    desc: "Alat olah tanah bertenaga listrik yang ramah lingkungan.",
    disabled: true,
  },
  {
    title: "Lampu Ultraviolet Untuk Pertanian",
    img: imgLampuUltra,
    desc: "Mendukung pertumbuhan tanaman di rumah tanam modern.",
    disabled: true,
  },
];

function ProductTile({ title, img, onClick, onHover, desc, animate, disabled }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => onHover(desc)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(desc)}
      onBlur={() => onHover(null)}
      onTouchStart={() => onHover(desc)}
      disabled={disabled}
      className={`group relative w-full h-full overflow-hidden rounded-2xl shadow-lg transition-all duration-500
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-2xl hover:-translate-y-1 cursor-pointer"}
        ${animate ? "animate-fadein-scale" : ""}
      `}
      style={{ animationDelay: animate ? `${animate * 80}ms` : undefined }}
    >
      {/* background image */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 ${disabled ? "" : "group-hover:scale-110"}`}
        style={{
          backgroundImage: img ? `url(${img})` : undefined,
          backgroundColor: img ? undefined : "#eaf8f1",
        }}
      />
      {!img && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Sprout className="w-16 h-16 text-emerald-400/70" />
        </div>
      )}

      {/* gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-emerald-800/40 to-transparent ${disabled ? "opacity-60" : "group-hover:from-emerald-900/90 group-hover:via-emerald-800/50"} transition-all duration-500`} />

      {/* shimmer effect on hover */}
      {!disabled && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/0 group-hover:via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      )}

      {/* title with enhanced styling */}
      <div className="absolute left-5 right-5 bottom-6">
        <p className="text-white font-bold text-lg drop-shadow-lg leading-tight tracking-wide">
          {title}
        </p>
        {!disabled && (
          <div className="mt-2 h-1 w-0 bg-gradient-to-r from-emerald-400 to-sky-400 rounded-full group-hover:w-16 transition-all duration-500" />
        )}
      </div>

      {/* border glow effect */}
      <div className={`pointer-events-none absolute inset-0 rounded-2xl ring-0 ${disabled ? "" : "group-hover:ring-2 ring-emerald-300/60 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"} transition-all duration-500`} />
      
      {/* disabled badge */}
      {disabled && (
        <div className="absolute top-3 right-3 bg-gray-800/80 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
          Coming Soon
        </div>
      )}
    </button>
  );
}

export default function ProductLanding({ onSelect }) {
  const navigate = useNavigate();
  const [activeDesc, setActiveDesc] = useState("");
  const [typed, setTyped] = useState("");
  const [mode, setMode] = useState("main"); // 'main' | 'niaga'
  const timerRef = useRef(null);

  const TYPE_MS = 15;

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTyped("");

    if (!activeDesc) return; 

    let i = 0;
    timerRef.current = setInterval(() => {
      i += 1;
      setTyped(activeDesc.slice(0, i));
      if (i >= activeDesc.length) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }, TYPE_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeDesc]);

  const goToForm = () => navigate("/form");

  // Handler klik pada mainCards
  const handleMainCardClick = (key, disabled) => {
    if (disabled) return;
    if (key === "distribusi") setMode("niaga");
    else if (key === "help") navigate("/help");
  };

  // Handler tombol kembali
  const handleBack = () => setMode("main");

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-sky-50 to-teal-50 flex flex-col">
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="max-w-7xl mx-auto h-full flex flex-col">
          {/* Header with gradient text */}
          <div className="mb-4 flex-shrink-0">
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">
              Learning Products
            </h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full" />
          </div>

          {/* Back button with enhanced design */}
          {mode !== "main" && (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 mb-4 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 transition-all duration-300 text-white font-bold text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex-shrink-0 w-fit"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="tracking-wide">Distribusi</span>
            </button>
          )}
          
          {/* Cards Grid - flex-1 to take remaining space */}
          <div className="flex-1 mb-4">
            <div className={`grid gap-4 h-full ${
              mode === "main" 
                ? "grid-cols-1 md:grid-cols-2 grid-rows-2" 
                : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 grid-rows-2"
            }`}>
              {mode === "main"
                ? mainCards.map((c, idx) => (
                    <ProductTile
                      key={c.key}
                      title={c.title}
                      img={c.img}
                      desc={c.desc}
                      onHover={setActiveDesc}
                      onClick={() => handleMainCardClick(c.key, c.disabled)}
                      animate={idx}
                      disabled={c.disabled}
                    />
                  ))
                : cards.map((c, idx) => (
                    <ProductTile
                      key={c.title}
                      title={c.title}
                      img={c.img}
                      desc={c.desc}
                      onHover={setActiveDesc}
                      onClick={goToForm}
                      animate={idx}
                      disabled={c.disabled}
                    />
                  ))}
            </div>
          </div>

          {/* Description box with modern design - fixed at bottom */}
          <div className="flex-shrink-0">
            <div className="rounded-2xl bg-gradient-to-r from-white/95 to-emerald-50/95 backdrop-blur-xl border-2 border-emerald-100/50 p-4 shadow-2xl shadow-emerald-500/10">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 animate-pulse" />
                </div>
                <p className="text-emerald-900 font-medium text-sm min-h-[1.2rem] flex-1">
                  {typed || (
                    <span className="text-emerald-600/80">
                      Arahkan kursor ke salah satu produk untuk melihat penjelasan.
                    </span>
                  )}
                  <span className="inline-block w-[2px] h-4 align-[-2px] ml-1.5 bg-gradient-to-b from-emerald-600 to-sky-600 animate-pulse" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
