import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import KKP from "../components/forms/kkp";

export default function KKPPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [data, setData] = useState(state?.kkpData || null);

  // Persist if user refreshes page
  useEffect(() => {
    if (state?.kkpData) {
      try { sessionStorage.setItem("kkpData", JSON.stringify(state.kkpData)); } catch {}
    } else if (!data) {
      try {
        const cached = sessionStorage.getItem("kkpData");
        if (cached) setData(JSON.parse(cached));
      } catch {}
    }
  }, [state, data]);

  if (!data) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-amber-200 bg-amber-50 text-amber-800 px-4 py-3 mb-4">
          Data KKP tidak ditemukan. Silakan selesaikan form terlebih dahulu.
        </div>
        <button
          className="rounded-lg border px-4 py-2 text-sm text-emerald-700 border-emerald-200 hover:bg-emerald-50"
          onClick={() => navigate("/form")}
        >
          Kembali ke Form
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <KKP 
        data={data} 
        onBack={() => navigate("/rekap", { state: { rekap: data.rekapData } })} 
      />
    </div>
  );
}
