import React, { useState, useMemo } from 'react';
import { FaCalculator, FaTimes, FaHeartbeat, FaArrowRight, FaChild, FaCalendarAlt, FaWeight, FaRulerVertical } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// WHO Table simplified for quick calculator preview
const BOYS_MEDIAN = [49.9, 54.7, 58.4, 61.4, 63.9, 65.9, 67.6, 69.2, 70.6, 72.0, 73.3, 74.5, 75.7, 76.9, 78.0, 79.1, 80.2, 81.2, 82.3, 83.2, 84.2, 85.1, 86.0, 86.9, 87.8, 88.8, 89.6, 90.4, 91.2, 91.9, 92.7, 93.4, 94.1, 94.8, 95.4, 96.1, 96.7, 97.4, 98.0, 98.6, 99.1, 99.7, 100.3, 100.9, 101.5, 102.1, 102.7, 103.3, 103.9, 104.4, 105.0, 105.6, 106.1, 106.7, 107.2, 107.8, 108.3, 108.9, 109.4, 110.0];
const GIRLS_MEDIAN = [49.1, 53.7, 57.1, 59.8, 62.1, 64.0, 65.7, 67.3, 68.7, 70.1, 71.5, 72.8, 74.0, 75.2, 76.4, 77.5, 78.6, 79.7, 80.7, 81.7, 82.7, 83.7, 84.6, 85.5, 86.6, 87.4, 88.3, 89.1, 89.9, 90.7, 91.4, 92.2, 92.9, 93.6, 94.4, 95.1, 95.7, 96.4, 97.1, 97.7, 98.4, 99.1, 99.7, 100.3, 100.9, 101.5, 102.1, 102.7, 103.3, 103.9, 104.5, 105.0, 105.6, 106.2, 106.7, 107.3, 107.8, 108.4, 108.9, 109.4];

export default function QuickCalculatorModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [sex, setSex] = useState('L');
  const [ageMonths, setAgeMonths] = useState(18);
  const [height, setHeight] = useState(82);
  const [weight, setWeight] = useState(11.5);

  const result = useMemo(() => {
    const age = Math.min(59, Math.max(0, Math.round(Number(ageMonths) || 0)));
    const h = Number(height) || 0;
    const w = Number(weight) || 0;
    if (h <= 0) return null;

    const medTable = sex === 'L' ? BOYS_MEDIAN : GIRLS_MEDIAN;
    const median = medTable[age] || 75;
    // Estimated SD spacing for height (approx 3.2cm at 0mo to 4.8cm at 60mo)
    const sdEst = 3.2 + (age / 60) * 1.6;
    const zScore = (h - median) / sdEst;
    const imt = w / Math.pow(h / 100, 2);

    let status = 'Pertumbuhan Normal';
    let badgeBg = 'bg-emerald-100 text-emerald-800 border-emerald-200';
    let ringColor = 'text-emerald-500';
    let summary = 'Tinggi dan berat badan anak seimbang sesuai standar baku WHO.';

    if (zScore < -3.0) {
      status = 'Stunting Berat (Severely Stunted)';
      badgeBg = 'bg-rose-100 text-rose-800 border-rose-200';
      ringColor = 'text-rose-500';
      summary = 'Anak membutuhkan penanganan medis segera ke Puskesmas atau Dokter Spesialis Anak.';
    } else if (zScore < -2.0) {
      status = 'Terindikasi Stunting (Pendek)';
      badgeBg = 'bg-amber-100 text-amber-800 border-amber-200';
      ringColor = 'text-amber-500';
      summary = 'Anak memerlukan intervensi protein hewani ganda dan pemantauan rutin.';
    } else if (zScore < -1.4) {
      status = 'Waspada Garis Kuning (Growth Faltering)';
      badgeBg = 'bg-orange-100 text-orange-800 border-orange-200';
      ringColor = 'text-orange-500';
      summary = 'Pertumbuhan melambat, waspada potensi stunting jika pola makan tidak diperbaiki.';
    }

    return {
      zScore: zScore.toFixed(2),
      imt: imt.toFixed(1),
      status,
      badgeBg,
      ringColor,
      summary
    };
  }, [sex, ageMonths, height, weight]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-lg">
              <FaCalculator />
            </div>
            <div>
              <h3 className="text-lg font-bold">Kalkulator Z-Score Cepat</h3>
              <p className="text-xs text-teal-100">Skrining Mandiri Berstandar WHO</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Body Form */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            {/* Jenis Kelamin */}
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1.5">Jenis Kelamin</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSex('L')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${sex === 'L' ? 'bg-teal-50 border-teal-500 text-teal-700 shadow-sm' : 'border-slate-200 text-slate-500'}`}
                >
                  👦 Laki-laki
                </button>
                <button
                  type="button"
                  onClick={() => setSex('P')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${sex === 'P' ? 'bg-rose-50 border-rose-400 text-rose-700 shadow-sm' : 'border-slate-200 text-slate-500'}`}
                >
                  👧 Perempuan
                </button>
              </div>
            </div>

            {/* Umur Bulan */}
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1.5">Usia (0–60 Bulan)</label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={ageMonths}
                  onChange={(e) => setAgeMonths(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 outline-none focus:border-teal-500"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">Bulan</span>
              </div>
            </div>

            {/* Tinggi Badan */}
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1.5">Tinggi Badan</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="40"
                  max="130"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 outline-none focus:border-teal-500"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">cm</span>
              </div>
            </div>

            {/* Berat Badan */}
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1.5">Berat Badan</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="2"
                  max="40"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 outline-none focus:border-teal-500"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">kg</span>
              </div>
            </div>
          </div>

          {/* Quick Result Preview Card */}
          {result && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${result.badgeBg}`}>
                  {result.status}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Z-Score: <span className="text-slate-800 font-extrabold">{result.zScore} SD</span>
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{result.summary}</p>
              <div className="flex gap-4 pt-1 text-[11px] text-slate-500 border-t border-slate-200/60">
                <span>IMT: <strong className="text-slate-700">{result.imt} kg/m²</strong></span>
                <span>Baku: <strong>WHO Child Growth Standard</strong></span>
              </div>
            </div>
          )}

          {/* Action to Full Examination */}
          <button
            onClick={() => {
              onClose();
              navigate('/diagnosis');
            }}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            Mulai Skrining Lengkap & Simpan Rekam Medis
            <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}

