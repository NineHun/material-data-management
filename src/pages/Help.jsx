import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, HelpCircle, BookOpenCheck, Sparkles, MessageSquare} from "lucide-react";
import { useNavigate } from "react-router-dom";
import imgLogo from "../images/Logo_pln.png";
import imgPeternakan from "../images/Peternakan.png";
import imgPengairan from "../images/Pengairan_Listrik.png";
import updlHero from "../images/updl_pandaan.png";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
};

function StepCard({ i, title, desc, img, icon }) {
  return (
    <motion.div
      custom={i}
      variants={fadeUp}
      className="group relative overflow-hidden rounded-2xl bg-white ring-1 ring-emerald-100 shadow-sm hover:shadow-md transition-all"
    >
      {/* banner */}
      <div
        className="h-44 bg-cover bg-center"
        style={{ backgroundImage: `url(${img})` }}
      />
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <h3 className="font-semibold text-emerald-800">{title}</h3>
        </div>
        <p className="text-sm text-emerald-900/80 leading-relaxed">{desc}</p>
      </div>
      <div className="pointer-events-none absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-emerald-100/60 blur-xl" />
    </motion.div>
  );
}

function ChatDemo() {
  return (
    <div className="rounded-xl ring-1 ring-emerald-100 bg-white p-4 shadow-sm">
      <div className="text-xs text-emerald-700/70 mb-2">Contoh percakapan:</div>
      <div className="space-y-2 text-sm">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          className="inline-block max-w-[80%] rounded-2xl px-3 py-2 bg-emerald-50 ring-1 ring-emerald-100 text-emerald-900"
        >
          Halo! Ada yang bisa saya bantu?
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          className="ml-auto inline-block max-w-[80%] rounded-2xl px-3 py-2 bg-emerald-600 text-white"
        >
          Berikan aku peraturan dari PLN
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          className="inline-block max-w-[80%] rounded-2xl px-3 py-2 bg-emerald-50 ring-1 ring-emerald-100 text-emerald-900"
        >
          Siap. Berikut rangkuman peraturan yang relevan…
        </motion.div>
      </div>
    </div>
  );
}

export default function Help() {
const navigate = useNavigate();
  return (
    <div className="p-6">
      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-lime-500 p-6 text-white shadow-sm"
      >
        <div className="flex items-center gap-4">
          <img src={imgLogo} alt="PLN" className="w-14 h-14 rounded bg-white p-1" />
          <div>
            <h2 className="text-2xl font-bold leading-tight">
              Panduan Singkat SIMANIS ELIA
            </h2>
            <p className="text-white/90 text-sm">
              Tur cepat untuk memahami Dashboard, alur Product → Form, dan Chatbot PLN.
            </p>
          </div>
        </div>
        <Sparkles className="absolute right-6 top-6 w-6 h-6 opacity-80" />
      </motion.div>

      {/* LANGKAH */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <StepCard
          i={0}
          img={updlHero}
          title="1) Dashboard"
          desc="Profil singkat PLN UPDL Pandaan, penjelasan aplikasi SIMANIS ELIA, dan tujuan aplikasi."
          icon={<BookOpenCheck className="w-5 h-5 text-emerald-600" />}
        />
        <StepCard
          i={1}
          img={imgPeternakan}
          title="2) Product → Pilih Produk"
          desc="Pilih salah satu dari Learning Products Electrifying Agriculture untuk memulai simulasi."
          icon={<ArrowRight className="w-5 h-5 text-emerald-600" />}
        />
        <StepCard
          i={2}
          img={imgPengairan}
          title="3) Form Pelanggan/Pekerjaan"
          desc="Isi Identitas Pelanggan, Jenis Permohonan, Data Teknik dan Data Penyulang. Gunakan tombol Save untuk ekspor ringkasan ke Excel."
          icon={<HelpCircle className="w-5 h-5 text-emerald-600" />}
        />
      </div>

      {/* CHATBOT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <motion.div
          variants={fadeUp}
          custom={3}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="rounded-2xl bg-white ring-1 ring-emerald-100 p-5 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-emerald-800">Chatbot PLN</h3>
          </div>
          <p className="text-sm text-emerald-900/80 leading-relaxed">
            Buka menu <span className="font-semibold">Chatbot</span> di sidebar
            untuk menanyakan kebijakan/peraturan PLN. Tulis pertanyaan, lalu kirim.
            Bot akan menata jawaban dalam poin-poin yang rapi.
          </p>

          <div className="mt-4">
            <ChatDemo />
          </div>
        </motion.div>

        {/* Tips ringkas */}
        <motion.div
          variants={fadeUp}
          custom={4}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="rounded-2xl bg-white ring-1 ring-emerald-100 p-5 shadow-sm"
        >
          <h3 className="font-semibold text-emerald-800 mb-3">Tips Cepat</h3>
          <ul className="list-disc pl-5 text-sm text-emerald-900/85 space-y-2">
            <li>Gunakan kolom pencarian/selektor untuk mengisi form lebih cepat.</li>
            <li>Jika permohonan “Pasang Baru”, kolom <b>Daya Lama</b> otomatis nonaktif.</li>
            <li>Gunakan tombol <b>Save</b> untuk mengekspor ringkasan ke Excel.</li>
            <li>Di halaman Product, arahkan kursor ke kartu untuk melihat deskripsi singkat.</li>
          </ul>

          <div className="mt-4 flex flex-wrap gap-3">
            <button onClick={() => navigate("/product")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Mulai dari Product <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
