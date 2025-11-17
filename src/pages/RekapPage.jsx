import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RekapInvestasi from "../components/forms/RekapInvestasi";

export default function RekapPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [data, setData] = useState(state?.rekap || null);

  // Persist if user refreshes page
  useEffect(() => {
    if (state?.rekap) {
      try { sessionStorage.setItem("rekapData", JSON.stringify(state.rekap)); } catch {}
    } else if (!data) {
      try {
        const cached = sessionStorage.getItem("rekapData");
        if (cached) setData(JSON.parse(cached));
      } catch {}
    }
  }, [state, data]);

  if (!data) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-amber-200 bg-amber-50 text-amber-800 px-4 py-3 mb-4">
          Data rekap tidak ditemukan. Silakan selesaikan form terlebih dahulu.
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
      <RekapInvestasi 
        data={data} 
        onReset={() => navigate("/form", { state: { returnToStep: 6 } })} 
      />
    </div>
  );
}