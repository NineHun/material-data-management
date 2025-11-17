// src/components/LoginPage.jsx
import React, { useState } from "react";
import { User as UserIcon, Lock } from "lucide-react";
import img1 from "../images/Logo_pln.png";

const DEMO_USERS = {
  admin: { password: "admin123", name: "Admin" },
  naufa: { password: "pln123", name: "Naufa" },
  jhon:  { password: "jhon123", name: "Jhon Titor" },
};

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");

  const submit = (e) => {
    e.preventDefault();
    const key = username.trim().toLowerCase();
    const found = DEMO_USERS[key];
    if (found && found.password === password) onLogin({ username: key, name: found.name });
    else setError("Username atau password salah.");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center font-[Poppins]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
      `}</style>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm ring-1 ring-gray-200 p-6 md:p-8">
        <div className="flex items-center gap-4 mb-6">
          <img src={img1} alt="Logo PLN" className="w-12 h-12 object-contain" />
          <div>
            <h1 className="text-2xl font-semibold">SIMANIS ELIA</h1>
            <p className="text-sm text-gray-500">Simulasi Bisnis Electrifyng Agriculture</p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input className="border rounded w-full p-2 pl-9" placeholder="Username"
              value={username} onChange={e=>setUsername(e.target.value)} autoFocus />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="password" className="border rounded w-full p-2 pl-9" placeholder="Password"
              value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button type="submit" className="w-full bg-black text-white rounded py-2 hover:opacity-90">Masuk</button>
        </form>

        <div className="mt-4 text-xs text-gray-400">
          Demo: <span className="font-medium text-gray-600">admin/admin123</span>,{" "}
          <span className="font-medium text-gray-600">naufa/pln123</span>,{" "}
          <span className="font-medium text-gray-600">jhon/jhon123</span>
        </div>
      </div>
    </div>
  );
}
