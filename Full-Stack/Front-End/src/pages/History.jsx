import MainLayout from "../components/layout/MainLayout";

import { motion } from "framer-motion";

import { useEffect, useState } from "react";

import toast, { Toaster } from "react-hot-toast";

import api from "../services/api";

import {
  FaSearch,
  FaCalendarAlt,
  FaWeight,
  FaRulerVertical,
  FaChartLine,
} from "react-icons/fa";

const History = () => {
  const [historyData, setHistoryData] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Ambil data dari backend API
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get("/analisis");
        setHistoryData(response.data.data);
      } catch (error) {
        console.error(error);
        toast.error("Gagal mengambil data riwayat");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // Filter Search berdasarkan nama anak
  const filteredData = historyData.filter((item) =>
    item.nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="space-y-8">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

          <div>
            <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full font-medium mb-4">
              Riwayat Pelayanan
            </div>

            <h1 className="text-4xl font-bold text-slate-800">
              Data Riwayat Anak
            </h1>

            <p className="mt-3 text-slate-500 text-lg leading-relaxed max-w-2xl">
              Pantau seluruh hasil pemeriksaan dan analisis kesehatan anak secara modern dan realtime.
            </p>
          </div>

          {/* Search */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl px-5 py-4 shadow-lg flex items-center gap-4 w-full lg:w-[380px]">
            <FaSearch className="text-slate-400 text-lg" />

            <input
              type="text"
              placeholder="Cari nama anak..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
            <p className="text-slate-500 mt-4">Memuat data riwayat...</p>
          </div>
        ) : filteredData.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

            {filteredData.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-[32px] p-6 shadow-xl hover:-translate-y-1 transition-all duration-300"
              >

                {/* Top */}
                <div className="flex items-start justify-between">

                  <div className="flex items-center gap-4">

                    {/* Image */}
                    {item.foto_url ? (
                      <img
                        src={`${import.meta.env.VITE_API_BASE_URL || ''}${item.foto_url}`}
                        alt={item.nama}
                        className="w-16 h-16 rounded-3xl object-cover shadow-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        {item.nama.charAt(0)}
                      </div>
                    )}

                    <div>
                      <h2 className="text-2xl font-bold text-slate-800">
                        {item.nama}
                      </h2>

                      <p className="text-slate-500 mt-1">
                        Pemeriksaan Anak
                      </p>
                    </div>
                  </div>


                </div>

                {/* Status */}
                <div
                  className={`mt-6 inline-flex items-center px-4 py-2 rounded-full font-semibold text-sm ${
                    item.status_stunting === "Tidak Stunting"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.status_stunting}
                </div>

                {/* Grid Info */}
                <div className="grid grid-cols-2 gap-4 mt-6">

                  {/* Umur */}
                  <div className="bg-slate-50 rounded-2xl p-5">
                    <div className="flex items-center gap-2 text-slate-500 mb-2">
                      <FaCalendarAlt />
                      <span className="text-sm">
                        Umur
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-800">
                      {item.umur_bulan} Bulan
                    </h3>
                  </div>

                  {/* Berat */}
                  <div className="bg-slate-50 rounded-2xl p-5">
                    <div className="flex items-center gap-2 text-slate-500 mb-2">
                      <FaWeight />
                      <span className="text-sm">
                        Berat
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-800">
                      {item.berat_badan} Kg
                    </h3>
                  </div>

                  {/* Tinggi */}
                  <div className="bg-slate-50 rounded-2xl p-5">
                    <div className="flex items-center gap-2 text-slate-500 mb-2">
                      <FaRulerVertical />
                      <span className="text-sm">
                        Tinggi
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-800">
                      {item.tinggi_badan} Cm
                    </h3>
                  </div>

                  {/* Tanggal */}
                  <div className="bg-slate-50 rounded-2xl p-5">
                    <div className="flex items-center gap-2 text-slate-500 mb-2">
                      <FaChartLine />
                      <span className="text-sm">
                        Tanggal Analisis
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-800">
                      {new Date(item.analyzed_at).toLocaleDateString("id-ID")}
                    </h3>
                  </div>
                </div>

                {/* Prediction */}
                <div className="mt-6 bg-cyan-50 border border-cyan-100 rounded-3xl p-5">
                  <h3 className="font-bold text-cyan-700 mb-3">
                    Prediksi
                  </h3>

                  <p className="text-slate-600 leading-relaxed">
                    {item.tingkat_risiko_detail}
                  </p>
                </div>

                {/* Recommendation */}
                <div className="mt-5 bg-teal-50 border border-teal-100 rounded-3xl p-5">
                  <h3 className="font-bold text-teal-700 mb-3">
                    Rekomendasi
                  </h3>

                  <p className="text-slate-600 leading-relaxed">
                    {item.rekomendasi}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white/70 backdrop-blur-xl border border-dashed border-slate-200 rounded-[32px] p-10 text-center">

            <div className="w-24 h-24 rounded-full bg-teal-100 flex items-center justify-center mx-auto text-4xl text-teal-500 mb-6">
              📋
            </div>

            <h2 className="text-2xl font-bold text-slate-700">
              Riwayat Belum Tersedia
            </h2>

            <p className="text-slate-500 mt-3 max-w-xl mx-auto leading-relaxed">
              Data pelayanan anak yang sudah dianalisis akan muncul secara otomatis pada halaman ini.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default History;