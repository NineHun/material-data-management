import React from "react";
import { NavLink } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Box, Database, HelpCircle, Leaf, LogOut, MessageSquareText } from "lucide-react";
import img1 from "../../images/Logo_pln.png";

export default function Sidebar({ user, onLogout, greetTitle, greetSubtitle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const productActive = location.pathname.startsWith("/product") || location.pathname.startsWith("/form");

  const linkCls = ({ isActive }) =>
    `flex items-center gap-3 w-full text-left p-2 rounded-lg transition-colors ${
      isActive
        ? "bg-gradient-to-r from-emerald-500 to-lime-400 text-white shadow-sm"
        : "hover:bg-emerald-50 hover:text-emerald-700"
    }`;

  return (
    <aside className="w-64 border-r p-6 flex flex-col justify-between bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 fixed top-0 bottom-0 left-0 z-20">
      <div>
        <div className="flex items-center mb-10">
          <img src={img1} alt="Logo PLN" className="w-11 h-11 md:w-16 md:h-16 mr-1 object-contain rounded-sm shrink-0" />
          <div>
            <h1 className="font-bold text-x2 tracking-wide text-emerald-700 flex items-center gap-2">
              SIMANIS ELIA <Leaf className="w-5 h-5 text-emerald-500" />
            </h1>
            <p className="text-xs text-emerald-600/70">Simulasi Bisnis <em className="italic">Electrifying Agriculture</em></p>
          </div>
        </div>

        <nav className="space-y-2">
          <NavLink to="/dashboard" className={linkCls}>
            <Home className="w-5 h-5" /> Dashboard
          </NavLink>
          <NavLink to="/product" className={linkCls}>
            <Box className="w-5 h-5" /> Learning Products
          </NavLink>
          <NavLink to="/chatbot" className={linkCls}>
            <MessageSquareText className="w-5 h-5" /> Chatbot
          </NavLink>
          <NavLink to="/material-data" className={linkCls}>
            <Database className="w-5 h-5" /> Material Data
          </NavLink>
          <NavLink to="/help" className={linkCls}>
            <HelpCircle className="w-5 h-5" /> Help
          </NavLink>
        </nav>
      </div>

      <div className="mt-10">
        <div className="p-4 bg-gradient-to-r from-emerald-600 to-lime-500 rounded-xl text-center shadow-sm">
          <p className="text-white mb-1 font-semibold">{greetTitle}</p>
          <p className="text-white/90 text-xs">{greetSubtitle}</p>
          <button className="mt-2 bg-white text-emerald-700 px-4 py-1 rounded font-semibold shadow hover:shadow-md transition">
            {user?.name}
          </button>
        </div>

        <div className="mt-6 flex items-center">
          <img src="/user.png" alt="user" className="w-10 h-10 rounded-full mr-2" />
          <div>
            <p className="font-semibold">{user?.name}</p>
            <p className="text-sm text-gray-500">Pegawai</p>
          </div>
        </div>

        <button onClick={onLogout} className="mt-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-700 transition-colors">
          <LogOut className="w-4 h-4" /> Keluar
        </button>
      </div>
    </aside>
  );
}
