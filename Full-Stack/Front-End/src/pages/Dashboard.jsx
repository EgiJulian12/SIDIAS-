import MainLayout from "../components/layouts/MainLayout";
import Footer from "../components/ui/Footer";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";


import {
  FaHeartbeat,
  FaChild,
  FaClipboardCheck,
  FaShieldAlt,
  FaAppleAlt,
  FaSyringe,
  FaChartLine,
  FaArrowRight,
} from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();
  const isLogin = localStorage.getItem("sidias_login");
  navigate("/login");
  navigate("/diagnosis");

  const informationData = [
    {
      icon: <FaAppleAlt />,
      title: "Nutrisi Seimbang",
      desc: "Pastikan anak mendapatkan protein, vitamin, zat besi, dan mineral yang cukup setiap hari untuk mendukung pertumbuhan optimal.",
      bg: "from-orange-400 to-amber-400",
    },
    {
      icon: <FaShieldAlt />,
      title: "Pencegahan Stunting",
      desc: "Pemantauan rutin pertumbuhan anak membantu mendeteksi risiko stunting lebih awal sejak dini.",
      bg: "from-teal-400 to-cyan-500",
    },
    {
      icon: <FaSyringe />,
      title: "Imunisasi Lengkap",
      desc: "Lengkapi imunisasi anak sesuai jadwal untuk menjaga kesehatan dan daya tahan tubuh.",
      bg: "from-sky-400 to-blue-500",
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-8">

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-teal-400 via-cyan-500 to-sky-500 p-8 md:p-12 text-white shadow-2xl"
        >

          {/* Blur Background */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">

            {/* LEFT */}
            <div>

              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-full mb-6">
                <FaHeartbeat />
                SIDIAS Healthcare Dashboard
              </div>

              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Sistem Deteksi
                <br />
                Stunting Anak
              </h1>

              <p className="mt-6 text-white/90 text-lg leading-relaxed max-w-2xl">
                Platform pelayanan posyandu modern untuk membantu kader dan orang tua memantau pertumbuhan anak secara cepat, praktis, dan informatif.
              </p>

              {/* BUTTON */}
              <div className="mt-8">
                <button
                  onClick={() => {
                    const isLogin = localStorage.getItem("sidias_login");

                    if (!isLogin) {
                      return navigate("/login");
                    }

                    navigate("/diagnosis");
                  }}
                  className="bg-white text-teal-600 px-7 py-4 rounded-2xl font-semibold shadow-xl hover:scale-105 transition-all flex items-center gap-3"
                >
                  Mulai Pemeriksaan
                  <FaArrowRight />
                </button>
              </div>
            </div>

            {/* RIGHT STATS */}
            <div className="grid grid-cols-2 gap-5">

              <div className="bg-white/15 backdrop-blur-lg rounded-3xl p-6 border border-white/10">
                <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-2xl mb-4">
                  <FaChild />
                </div>

                <h2 className="text-3xl font-bold">
                  128
                </h2>

                <p className="text-white/80 mt-2">
                  Data Anak
                </p>
              </div>

              <div className="bg-white/15 backdrop-blur-lg rounded-3xl p-6 border border-white/10">
                <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-2xl mb-4">
                  <FaClipboardCheck />
                </div>

                <h2 className="text-3xl font-bold">
                  96
                </h2>

                <p className="text-white/80 mt-2">
                  Pemeriksaan
                </p>
              </div>

              <div className="bg-white/15 backdrop-blur-lg rounded-3xl p-6 border border-white/10">
                <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-2xl mb-4">
                  <FaChartLine />
                </div>

                <h2 className="text-3xl font-bold">
                  82%
                </h2>

                <p className="text-white/80 mt-2">
                  Pertumbuhan Baik
                </p>
              </div>

              <div className="bg-white/15 backdrop-blur-lg rounded-3xl p-6 border border-white/10">
                <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-2xl mb-4">
                  <FaHeartbeat />
                </div>

                <h2 className="text-3xl font-bold">
                  Aktif
                </h2>

                <p className="text-white/80 mt-2">
                  Monitoring
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* INFORMASI KESEHATAN */}
        <div>

          <div className="mb-6">

            <h2 className="text-3xl font-bold text-slate-800">
              Informasi Kesehatan Anak
            </h2>

            <p className="text-slate-500 mt-2">
              Edukasi singkat untuk membantu menjaga pertumbuhan anak tetap optimal.
            </p>
          </div>

          {/* CARDS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {informationData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-[32px] p-7 shadow-xl hover:-translate-y-2 transition-all duration-300"
              >

                <div
                  className={`w-16 h-16 rounded-3xl bg-gradient-to-br ${item.bg} flex items-center justify-center text-white text-2xl shadow-lg mb-6`}
                >
                  {item.icon}
                </div>

                <h3 className="text-2xl font-bold text-slate-800">
                  {item.title}
                </h3>

                <p className="text-slate-500 leading-relaxed mt-4">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* INFORMASI GIZI */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-[36px] p-8 shadow-xl"
        >

          {/* HEADER */}
          <div className="mb-8">

            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full mb-5">
              🍽️ Gizi & Pola Makan Anak
            </div>

            <h2 className="text-3xl font-bold text-slate-800">
              Rekomendasi Nutrisi Pencegahan Stunting
            </h2>

            <p className="text-slate-500 mt-3 leading-relaxed max-w-3xl">
              Asupan nutrisi yang baik membantu meningkatkan pertumbuhan tinggi badan, perkembangan otak, dan daya tahan tubuh anak.
            </p>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Protein */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-[32px] p-6 border border-orange-100">

              <div className="text-5xl mb-5">
                🍗
              </div>

              <h3 className="text-2xl font-bold text-slate-800">
                Protein Tinggi
              </h3>

              <p className="text-slate-600 mt-4 leading-relaxed">
                Protein membantu pertumbuhan otot dan tinggi badan anak.
              </p>

              <div className="flex flex-wrap gap-3 mt-5">

                <span className="bg-white px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                  Telur
                </span>

                <span className="bg-white px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                  Ikan
                </span>

                <span className="bg-white px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                  Ayam
                </span>

                <span className="bg-white px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                  Tempe
                </span>

                <span className="bg-white px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                  Tahu
                </span>
              </div>
            </div>

            {/* Vitamin */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-[32px] p-6 border border-emerald-100">

              <div className="text-5xl mb-5">
                🥦
              </div>

              <h3 className="text-2xl font-bold text-slate-800">
                Vitamin & Mineral
              </h3>

              <p className="text-slate-600 mt-4 leading-relaxed">
                Membantu meningkatkan daya tahan tubuh dan perkembangan anak.
              </p>

              <div className="flex flex-wrap gap-3 mt-5">

                <span className="bg-white px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                  Bayam
                </span>

                <span className="bg-white px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                  Wortel
                </span>

                <span className="bg-white px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                  Brokoli
                </span>

                <span className="bg-white px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                  Pisang
                </span>

                <span className="bg-white px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                  Jeruk
                </span>
              </div>
            </div>

            {/* Pola Makan */}
            <div className="bg-gradient-to-br from-sky-50 to-cyan-50 rounded-[32px] p-6 border border-cyan-100">

              <div className="text-5xl mb-5">
                ⏰
              </div>

              <h3 className="text-2xl font-bold text-slate-800">
                Pola Makan Sehat
              </h3>

              <p className="text-slate-600 mt-4 leading-relaxed">
                Anak disarankan makan secara teratur dan tidak melewatkan waktu makan utama.
              </p>

              <ul className="space-y-3 mt-5 text-slate-600">

                <li>✅ Sarapan pagi setiap hari</li>

                <li>✅ Makan 3x sehari</li>

                <li>✅ Konsumsi susu & buah</li>

                <li>✅ Kurangi makanan instan</li>

                <li>✅ Minum air putih cukup</li>
              </ul>
            </div>

            {/* Pemeriksaan */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-[32px] p-6 border border-teal-100">

              <div className="text-5xl mb-5">
                🩺
              </div>

              <h3 className="text-2xl font-bold text-slate-800">
                Pemeriksaan Rutin
              </h3>

              <p className="text-slate-600 mt-4 leading-relaxed">
                Pemeriksaan rutin membantu memantau pertumbuhan anak sejak dini.
              </p>

              <ul className="space-y-3 mt-5 text-slate-600">

                <li>📏 Ukur tinggi badan</li>

                <li>⚖️ Cek berat badan</li>

                <li>📅 Datang ke posyandu tiap bulan</li>

                <li>💉 Lengkapi imunisasi</li>

                <li>❤️ Konsultasi dengan kader</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* EDUKASI TAMBAHAN */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-[36px] p-8 shadow-xl"
        >

          <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">

            {/* LEFT */}
            <div className="max-w-3xl">

              <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full mb-5">
                ❤️ Edukasi Posyandu
              </div>

              <h2 className="text-3xl font-bold text-slate-800 leading-tight">
                Pemantauan Rutin Membantu
                Pencegahan Stunting Lebih Dini
              </h2>

              <p className="text-slate-500 mt-5 leading-relaxed text-lg">
                Pemeriksaan rutin berat badan dan tinggi badan anak membantu kader posyandu dan orang tua memantau tumbuh kembang anak secara optimal serta mencegah risiko stunting sejak dini.
              </p>
            </div>

            {/* RIGHT */}
            <div className="flex-shrink-0">

              <button
                onClick={() => navigate("/diagnosis")}
                className="bg-gradient-to-r from-teal-400 to-cyan-500 text-white px-8 py-5 rounded-3xl font-semibold shadow-xl hover:scale-105 transition-all"
              >
                Mulai Pemeriksaan
              </button>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </MainLayout>
  );
};

export default Dashboard;