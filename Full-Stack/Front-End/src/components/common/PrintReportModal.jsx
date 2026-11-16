import React from 'react';
import { FaPrint, FaTimes, FaHeartbeat, FaChild, FaCalendarAlt, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

export default function PrintReportModal({ isOpen, onClose, data }) {
  if (!isOpen || !data) return null;

  const handlePrint = () => {
    window.print();
  };

  const p = data.personalized || {};
  const makanan = p.rekomendasi_makanan || {};
  const minuman = p.rekomendasi_minuman || {};
  const olahraga = p.rekomendasi_olahraga || {};
  const tidur = p.pola_tidur_hgh || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 print:m-0 print:border-none print:shadow-none">
        {/* Header - Not printed controls */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800 text-white print:hidden">
          <div className="flex items-center gap-2">
            <FaPrint />
            <span className="font-bold text-sm">Lembar Pemeriksaan Posyandu SIDIAS</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-teal-500 hover:bg-teal-600 rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
            >
              <FaPrint /> Cetak / Unduh PDF
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-xs"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Printable Medical Sheet */}
        <div className="p-8 space-y-6 text-slate-800" id="printable-sheet">
          {/* Posyandu Official Header */}
          <div className="flex items-center justify-between border-b-2 border-teal-600 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center text-2xl font-bold">
                <FaHeartbeat />
              </div>
              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-slate-900">SIDIAS HEALTHCARE</h2>
                <p className="text-xs text-slate-500 font-medium">Sistem Diagnosis Anak Stunting & Gizi Terpadu</p>
                <p className="text-[11px] text-teal-700 font-semibold">Standar Baku WHO & Kemenkes RI</p>
              </div>
            </div>
            <div className="text-right text-xs text-slate-500">
              <p className="font-bold text-slate-700">LEMBAR HASIL SKRINING</p>
              <p>Tanggal: {new Date(data.analyzed_at || Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p className="text-[10px]">ID: {data.id ? data.id.substring(0, 8).toUpperCase() : 'DOC-NEW'}</p>
            </div>
          </div>

          {/* Child Identity Table */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] font-semibold uppercase">Nama Anak</span>
              <span className="font-bold text-slate-800 text-sm">{data.nama || 'Balita'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-semibold uppercase">Jenis Kelamin</span>
              <span className="font-semibold text-slate-700">{data.jenis_kelamin === 'L' ? 'Laki-laki (L)' : 'Perempuan (P)'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-semibold uppercase">Usia Saat Periksa</span>
              <span className="font-semibold text-slate-700">{data.umur_bulan} Bulan</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-semibold uppercase">Tanggal Lahir</span>
              <span className="font-semibold text-slate-700">{data.tanggal_lahir ? new Date(data.tanggal_lahir).toLocaleDateString('id-ID') : '-'}</span>
            </div>
          </div>

          {/* Anthropometric Measurements & Z-Score */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-teal-50/70 border border-teal-100 text-center">
              <span className="text-[11px] font-semibold text-teal-700 block">Tinggi Badan</span>
              <span className="text-xl font-black text-teal-900">{data.tinggi_badan} <span className="text-xs font-semibold">cm</span></span>
            </div>
            <div className="p-3 rounded-2xl bg-teal-50/70 border border-teal-100 text-center">
              <span className="text-[11px] font-semibold text-teal-700 block">Berat Badan</span>
              <span className="text-xl font-black text-teal-900">{data.berat_badan} <span className="text-xs font-semibold">kg</span></span>
            </div>
            <div className="p-3 rounded-2xl bg-teal-50/70 border border-teal-100 text-center">
              <span className="text-[11px] font-semibold text-teal-700 block">Z-Score (HAZ)</span>
              <span className={`text-xl font-black ${Number(data.z_score) < -2 ? 'text-rose-700' : 'text-emerald-700'}`}>
                {Number(data.z_score || 0).toFixed(2)} <span className="text-xs font-semibold">SD</span>
              </span>
            </div>
          </div>

          {/* AI Clinical Diagnosis */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Hasil Diagnosis AI</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${data.status_stunting === 'Terindikasi Stunting' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
                {data.status_stunting}
              </span>
            </div>
            <h4 className="font-bold text-slate-800 text-sm">{data.status_detail || 'Hasil Skrining Standar WHO'}</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{p.proyeksi_masa_depan || data.rekomendasi}</p>
          </div>

          {/* Personalized Lifestyle & Medical Directives */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-800 border-b border-slate-200 pb-1.5 uppercase tracking-wide text-[11px]">
              Rencana Intervensi Gizi & Gaya Hidup Terpadu
            </h4>

            {/* Makanan */}
            <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-100 space-y-1">
              <span className="font-bold text-orange-900 block">🍲 Rekomendasi Nutrisi & Target Protein</span>
              <p className="text-slate-700">{makanan.fokus_utama || 'Pemberian makanan bergizi seimbang kaya protein hewani.'}</p>
              {makanan.target_protein_harian && (
                <p className="font-semibold text-orange-800">Target Harian: {makanan.target_protein_harian}</p>
              )}
            </div>

            {/* Minuman */}
            <div className="p-3 rounded-xl bg-sky-50/60 border border-sky-100 space-y-1">
              <span className="font-bold text-sky-900 block">🥛 Minuman Sehat & Larangan</span>
              <p className="text-slate-700">Dianjurkan: {minuman.dianjurkan?.[0] || 'Air putih matang dan ASI/susu sesuai usia.'}</p>
              <p className="text-rose-700 font-semibold">Pantangan Keras: {minuman.dilarang?.[0] || 'Hindari teh manis dan minuman sachet berpemanis buatan.'}</p>
            </div>

            {/* Olahraga & Tidur */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                <span className="font-bold text-emerald-900 block">🏃 Olahraga / Stimulasi Tulang</span>
                <p className="text-slate-700">{olahraga.jenis_aktivitas?.[0] || 'Aktivitas fisik aktif 30-60 menit sehari.'}</p>
              </div>
              <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-1">
                <span className="font-bold text-indigo-900 block">🌙 Pola Tidur & Hormon HGH</span>
                <p className="text-slate-700">Jam Tidur: {tidur.jam_tidur_malam_ideal || 'Maksimal pukul 20.30 WIB'}</p>
                <p className="text-slate-500 text-[10px]">Total tidur: {tidur.target_jam_tidur || '11-13 jam/hari'}</p>
              </div>
            </div>
          </div>

          {/* Footer Signature */}
          <div className="pt-6 border-t border-slate-200 flex justify-between items-end text-xs text-slate-500">
            <div>
              <p className="font-semibold text-slate-700">Posyandu & Layanan Kesehatan</p>
              <p className="text-[10px]">Dicetak secara otomatis melalui Sistem SIDIAS</p>
            </div>
            <div className="text-center w-40">
              <p className="mb-12 text-[10px]">Kader Posyandu / Pemeriksa,</p>
              <div className="border-t border-slate-400 pt-1 font-bold text-slate-800">
                ( ..................................... )
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

