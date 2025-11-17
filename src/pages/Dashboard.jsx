// src/pages/Dashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, Target, CheckCircle2 } from "lucide-react";

import FallingLeaves from "../components/anim/FallingLeaves";
import plnLogo from "../images/Logo_pln.png";
import updlHero from "../images/updl_pandaan.png"; // simpan gambar ke path ini

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function Dashboard({ user }) {
  const navigate = useNavigate();

  return (
    <div className="relative p-6">

      <FallingLeaves count={14} />
      <Leaf className="hidden md:block w-24 h-24 text-emerald-100 absolute -top-4 -right-4 rotate-12" />

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="relative overflow-hidden rounded-2xl ring-1 ring-emerald-100 shadow-sm h-64 md:h-80"
      >
        <img
          src={updlHero}
          alt="PLN UPDL Pandaan"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/70 via-emerald-800/40 to-emerald-700/20" />

        <div className="relative p-6 md:p-10 flex flex-col md:flex-row md:items-center gap-6">
          <img
            src={plnLogo}
            alt="Logo PLN"
            className="w-16 h-16 md:w-20 md:h-20 rounded-md shadow bg-white/90 p-1"
          />

          <div className="text-white max-w-3xl">
            <p className="text-sm md:text-base opacity-90">
              {user ? `Halo, ${user.name}!` : "Halo!"}
            </p>
            <h1 className="text-2xl md:text-3xl font-extrabold leading-tight">
              Selamat datang di <span className="tracking-wide">SIMANIS ELIA {"\n"} </span>
              <span className="whitespace-nowrap"> PT PLN (Persero) UPDL Pandaan</span>
            </h1>

            <div className="mt-4 flex items-center gap-3">
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2 kartu kecil informasi */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="rounded-2xl ring-1 ring-emerald-100 bg-white p-5 shadow-sm"
        >
          <h3 className="font-semibold text-emerald-800">Tentang PT PLN (Persero) UPDL Pandaan</h3>
          <p className="mt-2 text-gray-600">
            PT PLN (Persero) UPDL Pandaan merupakan salah satu unit pelaksana pusat pendidikan 
            dan pelatihan <em className="italic">(Corporate University) </em>
            yang melaksanakan kegiatan pembelajaran pegawai <em className="italic">holding </em> dan <em className="italic">sub holding</em> PT PLN (Persero) di bidang distribusi, retail, dan niaga.
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="rounded-2xl ring-1 ring-emerald-100 bg-white p-5 shadow-sm"
        >
          <h3 className="font-semibold text-emerald-800">Apa itu SIMANIS ELIA?</h3>
          <p className="mt-2 text-gray-600">
            Merupakan <em className="italic">platform </em> simulasi bisnis yang digunakan untuk mendukung 
            pembelajaran di bidang perencanaan distribusi terkait layanan pasang baru <em className="italic">Electrifying Agriculture</em>.
          </p>
        </motion.div>
      </div>
        <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-6 rounded-2xl ring-1 ring-emerald-100 bg-white p-5 md:p-6 shadow-sm"
            >
            <div className="flex items-start gap-3">
                <div className="shrink-0 rounded-full bg-emerald-50 p-2 ring-1 ring-emerald-100">
                    <Target className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                    <h3 className="font-semibold text-emerald-800">Tujuan</h3>
                    <ol className="mt-3 space-y-2 list-decimal list-inside text-gray-700">
                        <li className="leading-relaxed">
                        Membantu efektifitas proses pembelajaran terkait{" "}
                        <em className="italic">Electrifying Agriculture</em>.
                        </li>
                        <li className="leading-relaxed">
                        Membantu peserta pembelajaran dalam proses simulasi bisnis dan kelayakan investasi
                        <em className="italic"> Electrifying Agriculture</em>.
                        </li>
                        <li className="leading-relaxed">
                        Membantu peserta pembelajaran dalam proses perencanaan dan operasional
                        terkait pasang baru <em className="italic">Electrifying Agriculture</em>.
                        </li>
                    </ol>
                </div>
            </div>
        </motion.div>
    </div>
  );
}
