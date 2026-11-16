import { useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { getLocalStats } from "../services/localDataService";
import QuickCalculatorModal from "../components/common/QuickCalculatorModal";
import {
  FaHeartbeat,
  FaChild,
  FaClipboardCheck,
  FaShieldAlt,
  FaAppleAlt,
  FaSyringe,
  FaChartLine,
  FaArrowRight,
  FaCalculator,
  FaExclamationTriangle,
  FaUserCheck,
  FaCalendarAlt,
  FaUtensils,
  FaPrint
} from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_balita: 0,
    total_pemeriksaan: 0,
    normal_count: 0,
    stunting_count: 0,
    severe_stunting_count: 0,
    normal_percentage: 100,
    priority_children: [],
    recent_activities: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [openCalculator, setOpenCalculator] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/dashboard/stats");
        if (res.data && res.data.data) {
          setStats(res.data.data);
        } else {
          setStats(getLocalStats());
        }
      } catch (err) {
        console.warn("Backend DB offline, menghitung analitik dari data lokal:", err.message);
        setStats(getLocalStats());
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const informationData = [
    {
      icon: <FaAppleAlt />,
      title: "Protein Hewani Ganda",
      desc: "Kombinasi 2 sumber protein hewani (contoh: telur + ikan kembung) terbukti secara klinis paling efektif memicu hormon pertumbuhan tulang anak.",
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      icon: <FaShieldAlt />,
      title: "Pencegahan 1000 HPK",
      desc: "Pertumbuhan otak dan tulang 80% terjadi pada 1000 hari pertama (sejak kandungan hingga usia 2 tahun). Deteksi dini sebelum usia 2 tahun sangat krusial.",
      color: "bg-teal-50 text-teal-600 border-teal-100",
    },
    {
      icon: <FaSyringe />,
      title: "Imunisasi & Vitamin A",
      desc: "Lengkapi imunisasi dasar dan berikan kapsul vitamin A setiap Februari & Agustus untuk memperkuat dinding usus dan mencegah infeksi berulang.",
      color: "bg-sky-50 text-sky-600 border-sky-100",
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* HERO BANNER */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-teal-600 via-emerald-600 to-teal-700 p-7 md:p-10 text-white shadow-xl shadow-teal-700/10"
        >
          {/* Subtle Ambient Shapes */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-emerald-400/20 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold border border-white/20">
                <FaHeartbeat className="text-teal-200" />
                Sistem Deteksi Stunting Berbasis Antropometri WHO & AI
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
                Tumbuh Kembang Anak, <br />
                Masa Depan Indonesia.
              </h1>

              <p className="text-white/90 text-sm sm:text-base leading-relaxed max-w-xl">
                Bantu orang tua dan kader Posyandu memantau status gizi anak secara presisi dengan kurva KMS Digital berstandar WHO dan rekomendasi nutrisi adaptif.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => navigate("/diagnosis")}
                  className="bg-white text-teal-800 hover:bg-teal-50 px-6 py-3.5 rounded-2xl font-extrabold text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2.5 active:scale-95"
                >
                  <FaChild /> Mulai Pemeriksaan Balita
                  <FaArrowRight className="text-xs" />
                </button>

                <button
                  onClick={() => setOpenCalculator(true)}
                  className="bg-teal-500/30 hover:bg-teal-500/40 text-white border border-white/30 px-5 py-3.5 rounded-2xl font-bold text-sm backdrop-blur-md transition-all flex items-center gap-2"
                >
                  <FaCalculator /> Kalkulator Z-Score Cepat
                </button>
              </div>
            </div>

            {/* Right: Real Analytics Grid */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/15 space-y-1">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-lg mb-2">
                  <FaChild />
                </div>
                <h3 className="text-2xl font-black tracking-tight">{stats.total_balita}</h3>
                <p className="text-white/80 text-xs font-medium">Balita Terdata</p>
              </div>

              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/15 space-y-1">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-lg mb-2">
                  <FaClipboardCheck />
                </div>
                <h3 className="text-2xl font-black tracking-tight">{stats.total_pemeriksaan}</h3>
                <p className="text-white/80 text-xs font-medium">Total Pemeriksaan</p>
              </div>

              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/15 space-y-1">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-lg mb-2">
                  <FaChartLine />
                </div>
                <h3 className="text-2xl font-black tracking-tight">{stats.normal_percentage}%</h3>
                <p className="text-white/80 text-xs font-medium">Status Gizi Normal</p>
              </div>

              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/15 space-y-1">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-lg mb-2">
                  <FaExclamationTriangle />
                </div>
                <h3 className="text-2xl font-black tracking-tight text-amber-200">{stats.stunting_count}</h3>
                <p className="text-white/80 text-xs font-medium">Perlu Intervensi</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* PRIORITY CHILDREN ALERT WIDGET */}
        {stats.priority_children && stats.priority_children.length > 0 && (
          <div className="p-6 rounded-3xl bg-amber-50/70 border border-amber-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-lg shadow-sm">
                  <FaExclamationTriangle />
                </div>
                <div>
                  <h3 className="font-extrabold text-amber-950 text-base">Prioritas Perhatian Khusus Posyandu</h3>
                  <p className="text-xs text-amber-800">
                    Balita dengan indikator Z-score rendah yang memerlukan pemantauan intervensi kejar tumbuh.
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/history")}
                className="text-xs font-bold text-amber-900 hover:text-amber-950 underline"
              >
                Lihat Semua
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
              {stats.priority_children.map((child) => (
                <div
                  key={child.id}
                  className="p-4 rounded-2xl bg-white border border-amber-200/60 shadow-sm flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{child.nama}</h4>
                    <p className="text-xs text-slate-500">
                      Usia {child.umur_bulan} Bulan ({child.jenis_kelamin === 'L' ? 'L' : 'P'})
                    </p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-700">
                      Z-Score: {child.z_score} SD
                    </span>
                  </div>
                  <button
                    onClick={() => navigate("/history")}
                    className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-teal-600 flex items-center justify-center text-slate-500 transition-colors"
                  >
                    <FaArrowRight className="text-xs" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RECENT ACTIVITIES & QUICK ACCESS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Recent Examinations */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-800 text-lg">Pemeriksaan Terakhir</h3>
                <p className="text-xs text-slate-500">Data hasil skrining yang tercatat di Posyandu</p>
              </div>
              <button
                onClick={() => navigate("/history")}
                className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
              >
                Semua Riwayat <FaArrowRight className="text-[10px]" />
              </button>
            </div>

            {stats.recent_activities && stats.recent_activities.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {stats.recent_activities.map((item) => (
                  <div key={item.id} className="py-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm ${
                        item.status === 'Terindikasi Stunting' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {item.nama ? item.nama.charAt(0).toUpperCase() : 'B'}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{item.nama}</h4>
                        <p className="text-xs text-slate-500">
                          {item.umur_bulan} Bulan • TB {item.tinggi_badan} cm • BB {item.berat_badan} kg
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        item.status === 'Terindikasi Stunting' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {item.status}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {item.analyzed_at ? new Date(item.analyzed_at).toLocaleDateString('id-ID') : '-'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto text-2xl">
                  <FaChild />
                </div>
                <p className="text-sm font-bold text-slate-700">Belum ada pemeriksaan tercatat</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Mulai catat pertumbuhan balita pertama Anda untuk memantau status stunting di Posyandu.
                </p>
                <button
                  onClick={() => navigate("/diagnosis")}
                  className="px-5 py-2.5 rounded-2xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition-colors"
                >
                  Periksa Sekarang
                </button>
              </div>
            )}
          </div>

          {/* Right: Shortcut to MPASI & Nutritional Encyclopedia */}
          <div className="lg:col-span-5 bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100/50 rounded-3xl p-6 border border-orange-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center text-xl shadow-md shadow-orange-500/20">
                <FaUtensils />
              </div>
              <div>
                <span className="text-[11px] font-bold text-orange-700 uppercase tracking-wide">Pemberdayaan Gizi</span>
                <h3 className="font-extrabold text-slate-800 text-lg">NutriGuide & Resep MPASI</h3>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Temukan panduan lengkap resep MPASI bergizi tinggi dengan bahan pangan lokal terjangkau (hati ayam, telur puyuh, ikan kembung, tempe) yang diformulasikan untuk pencegahan stunting.
            </p>

            <div className="space-y-2 pt-1 text-xs">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/80 border border-orange-200/60 font-semibold text-slate-700">
                <span className="text-orange-500 font-black">✓</span> Tekstur & Jadwal Sesuai Usia 0–59 Bulan
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/80 border border-orange-200/60 font-semibold text-slate-700">
                <span className="text-orange-500 font-black">✓</span> Panduan Feeding Rules Mengatasi Anak GTM
              </div>
            </div>

            <button
              onClick={() => navigate("/nutriguide")}
              className="w-full py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-2"
            >
              Buka Katalog Panduan Gizi
              <FaArrowRight className="text-[10px]" />
            </button>
          </div>
        </div>

        {/* EDUKASI PENCEGAHAN STUNTING */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Pilar Pencegahan Stunting</h2>
            <p className="text-xs text-slate-500 mt-1">Edukasi ilmiah pencegahan stunting dan pola asuh optimal</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {informationData.map((item, index) => (
              <div
                key={index}
                className={`p-6 rounded-3xl border ${item.color} shadow-sm space-y-3 bg-white`}
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl bg-slate-50 border border-slate-100 shadow-sm">
                  {item.icon}
                </div>
                <h3 className="font-extrabold text-slate-800 text-base">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <QuickCalculatorModal
        isOpen={openCalculator}
        onClose={() => setOpenCalculator(false)}
      />
    </MainLayout>
  );
};

export default Dashboard;
