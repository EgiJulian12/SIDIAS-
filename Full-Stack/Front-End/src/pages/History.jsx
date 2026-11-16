import React, { useEffect, useState, useMemo } from "react";
import MainLayout from "../components/layout/MainLayout";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import api from "../services/api";
import KmsGrowthChart from "../components/charts/KmsGrowthChart";
import PrintReportModal from "../components/common/PrintReportModal";
import {
  FaSearch,
  FaCalendarAlt,
  FaWeight,
  FaRulerVertical,
  FaChartLine,
  FaTrash,
  FaPrint,
  FaEye,
  FaTimes,
  FaChild,
  FaExclamationTriangle,
  FaCheckCircle,
  FaFilter,
  FaUtensils,
  FaGlassMartiniAlt,
  FaRunning,
  FaMoon
} from "react-icons/fa";

const History = () => {
  const [historyData, setHistoryData] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Detail Modal State
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailTab, setDetailTab] = useState("proyeksi");

  // Print Modal State
  const [printData, setPrintData] = useState(null);
  const [isPrintOpen, setIsPrintOpen] = useState(false);

  // Delete Confirmation State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/analisis");
      if (response.data && response.data.data) {
        setHistoryData(response.data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat riwayat rekam medis");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Filter Search & Status
  const filteredData = useMemo(() => {
    return historyData.filter((item) => {
      const matchesSearch = item.nama?.toLowerCase().includes(search.toLowerCase());
      if (!matchesSearch) return false;

      if (statusFilter === "all") return true;
      if (statusFilter === "stunting") return item.status_stunting === "Terindikasi Stunting";
      if (statusFilter === "normal") return item.status_stunting === "Tidak Stunting";
      return true;
    });
  }, [historyData, search, statusFilter]);

  // Handle Delete Data Balita
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      // Menghapus data_balita (cascade menghapus analisis)
      await api.delete(`/data-balita/${deleteTarget.data_id || deleteTarget.id}`);
      toast.success("Rekam data berhasil dihapus");
      setHistoryData((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      setDeleteTarget(null);
      if (selectedItem?.id === deleteTarget.id) {
        setSelectedItem(null);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Gagal menghapus data");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenPrint = (item) => {
    // Ensure personalized object is parsed if string
    const clone = { ...item };
    if (typeof clone.rekomendasi_detail === "string") {
      try {
        clone.personalized = JSON.parse(clone.rekomendasi_detail);
      } catch {
        clone.personalized = null;
      }
    }
    setPrintData(clone);
    setIsPrintOpen(true);
  };

  const p = selectedItem?.personalized;

  return (
    <MainLayout>
      <Toaster position="top-right" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-3.5 py-1 rounded-full text-xs font-bold border border-teal-200/60 mb-2">
              <FaChartLine /> Arsip Posyandu
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
              Riwayat Skrining Balita
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Pantau histori pertumbuhan dan rekam medis digital balita secara komprehensif.
            </p>
          </div>

          <div className="text-xs font-bold text-slate-500 bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-sm self-start sm:self-auto">
            Total Tercatat: <strong className="text-teal-700 font-extrabold">{historyData.length} Data</strong>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-3.5 text-slate-400 text-sm" />
            <input
              type="text"
              placeholder="Cari nama balita..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all shadow-sm"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Status Tabs */}
          <div className="flex gap-1.5 p-1 bg-white rounded-2xl border border-slate-200 shadow-sm self-start">
            {[
              { id: "all", label: "Semua" },
              { id: "normal", label: "Normal" },
              { id: "stunting", label: "Stunting" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  statusFilter === f.id
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content List */}
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-3 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-medium">Memuat rekam data balita...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-100 shadow-sm space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto text-2xl">
              <FaChild />
            </div>
            <h3 className="font-bold text-slate-800 text-base">Tidak Ada Data Ditemukan</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {search
                ? `Tidak ditemukan balita dengan nama "${search}".`
                : "Belum ada rekam skrining yang tersimpan di sistem."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredData.map((item) => {
              const isStunted = item.status_stunting === "Terindikasi Stunting";
              const z = parseFloat(item.z_score) || 0;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all space-y-4"
                >
                  {/* Top Bar: Name & Status Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base ${
                        isStunted ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
                      }`}>
                        {item.nama ? item.nama.charAt(0).toUpperCase() : "B"}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-base">{item.nama}</h3>
                        <p className="text-xs text-slate-500">
                          {item.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"} • {item.umur_bulan} Bulan
                        </p>
                      </div>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      isStunted
                        ? "bg-rose-50 text-rose-700 border-rose-200"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}>
                      {item.status_stunting}
                    </span>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-50/80 p-3 rounded-2xl border border-slate-100 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">TINGGI</span>
                      <span className="text-xs sm:text-sm font-extrabold text-slate-800">{item.tinggi_badan} cm</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">BERAT</span>
                      <span className="text-xs sm:text-sm font-extrabold text-slate-800">{item.berat_badan} kg</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">Z-SCORE</span>
                      <span className={`text-xs sm:text-sm font-extrabold ${z < -2 ? "text-rose-600" : "text-emerald-600"}`}>
                        {z.toFixed(2)} SD
                      </span>
                    </div>
                  </div>

                  {/* Summary Snippet */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.personalized?.proyeksi_masa_depan || item.rekomendasi || item.status_detail}
                  </p>

                  {/* Footer Action Buttons */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      {item.analyzed_at ? new Date(item.analyzed_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-"}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <FaEye /> Detail
                      </button>

                      <button
                        onClick={() => handleOpenPrint(item)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <FaPrint /> Cetak
                      </button>

                      <button
                        onClick={() => setDeleteTarget(item)}
                        className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors"
                        title="Hapus Rekam Data"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* DETAIL MODAL WITH TABS & KMS */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-fadeIn max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg font-black ${
                  selectedItem.status_stunting === "Terindikasi Stunting" ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
                }`}>
                  <FaChild />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-base">{selectedItem.nama}</h3>
                  <p className="text-xs text-slate-500">
                    Usia: {selectedItem.umur_bulan} Bulan • TB: {selectedItem.tinggi_badan} cm • BB: {selectedItem.berat_badan} kg
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenPrint(selectedItem)}
                  className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <FaPrint /> Cetak
                </button>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* Modal Tabs */}
            <div className="flex overflow-x-auto gap-2 px-6 pt-3 bg-white border-b border-slate-100 no-scrollbar">
              {[
                { id: "proyeksi", label: "Evaluasi & Proyeksi", icon: <FaChartLine /> },
                { id: "makanan", label: "Makanan", icon: <FaUtensils /> },
                { id: "minuman", label: "Minuman", icon: <FaGlassMartiniAlt /> },
                { id: "olahraga", label: "Olahraga", icon: <FaRunning /> },
                { id: "kms", label: "Kurva KMS", icon: <FaChartLine /> },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setDetailTab(t.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-t-xl text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                    detailTab === t.id
                      ? "border-teal-600 text-teal-700"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            {/* Modal Tab Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {detailTab === "proyeksi" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-100 space-y-1">
                    <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wide">Diagnosis & Skenario</span>
                    <h4 className="font-extrabold text-slate-800 text-sm">{p?.scenario_title || selectedItem.status_detail}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed pt-1">
                      {p?.proyeksi_masa_depan || selectedItem.rekomendasi}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                    <span className="font-bold text-slate-800 block">Jadwal Kontrol Posyandu:</span>
                    <p>{p?.jadwal_kontrol || "Pemeriksaan rutin setiap bulan di Posyandu."}</p>
                  </div>
                </div>
              )}

              {detailTab === "makanan" && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-100 text-xs">
                    <span className="font-bold text-orange-950 block">Target Protein Harian:</span>
                    <p className="text-orange-900">{p?.rekomendasi_makanan?.target_protein_harian || "1-2 butir telur puyuh + ikan/ayam per hari"}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="font-bold text-teal-800 block">Pagi</span>
                      <p className="text-slate-600">{p?.rekomendasi_makanan?.sarapan || "Nasi tim/bubur + kuning telur"}</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="font-bold text-teal-800 block">Siang</span>
                      <p className="text-slate-600">{p?.rekomendasi_makanan?.makan_siang || "Nasi tim + pepes ikan kembung"}</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="font-bold text-teal-800 block">Malam</span>
                      <p className="text-slate-600">{p?.rekomendasi_makanan?.makan_malam || "Nasi tim + ayam cincang"}</p>
                    </div>
                  </div>
                </div>
              )}

              {detailTab === "minuman" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-2">
                    <span className="font-bold text-emerald-900 block">Dianjurkan:</span>
                    <ul className="list-disc pl-4 space-y-1 text-slate-700">
                      {(p?.rekomendasi_minuman?.dianjurkan || ["Air putih matang dan ASI/susu sesuai usia"]).map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100 space-y-2">
                    <span className="font-bold text-rose-900 block">Pantangan Keras:</span>
                    <ul className="list-disc pl-4 space-y-1 text-rose-800 font-medium">
                      {(p?.rekomendasi_minuman?.dilarang || ["Teh manis, kopi, dan minuman bersoda"]).map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {detailTab === "olahraga" && (
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-100 text-teal-900">
                    <strong>Durasi Harian:</strong> {p?.rekomendasi_olahraga?.durasi_harian || "30-60 menit/hari"}
                  </div>
                  <div className="space-y-2">
                    {(p?.rekomendasi_olahraga?.jenis_aktivitas || [
                      "Latihan berjalan, berlari kecil di halaman terbuka.",
                      "Bergelantungan ringan (hanging bar) 5-10 detik."
                    ]).map((act, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                        {act}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {detailTab === "kms" && (
                <div>
                  <KmsGrowthChart
                    umur_bulan={selectedItem.umur_bulan}
                    tinggi_badan={selectedItem.tinggi_badan}
                    jenis_kelamin={selectedItem.jenis_kelamin}
                    nama={selectedItem.nama}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION DELETE DIALOG */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-xl">
              <FaTrash />
            </div>
            <h3 className="font-extrabold text-slate-800 text-base">Hapus Rekam Balita?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Data pemeriksaan untuk <strong className="text-slate-700">{deleteTarget.nama}</strong> akan dihapus permanen dari riwayat Posyandu.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition-colors disabled:opacity-50"
              >
                {isDeleting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRINT REPORT MODAL */}
      <PrintReportModal
        isOpen={isPrintOpen}
        onClose={() => setIsPrintOpen(false)}
        data={printData}
      />
    </MainLayout>
  );
};

export default History;
