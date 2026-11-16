import React, { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import {
  FaUtensils,
  FaEgg,
  FaFish,
  FaCheck,
  FaTimes,
  FaClock,
  FaHeartbeat,
  FaInfoCircle,
  FaSearch,
  FaAppleAlt,
  FaShieldAlt
} from "react-icons/fa";

const recipes = [
  {
    id: 1,
    title: "Bubur Hati Ayam & Santan Gurih",
    age: "6_8",
    ageLabel: "6–8 Bulan",
    texture: "Bubur Halus Saring Kental",
    proteinSource: "Hati Ayam & Santan",
    estCost: "Rp 5.000 / Porsi",
    calories: "145 kkal",
    protein: "6.5 gram",
    ingredients: [
      "30 gr hati ayam kampung (cuci bersih, rebus daun salam)",
      "2 sdm beras putih pulen",
      "1 sdt santan murni matang",
      "1 potong kecil wortel manis parut halus",
      "1 sdt minyak kelapa / margarin"
    ],
    steps: "Rebus beras bersama hati ayam dan wortel hingga menjadi bubur lunak. Masukkan santan dan minyak kelapa menjelang matang. Saring di atas saringan kawat (jangan gunakan blender agar tidak terlalu encer)."
  },
  {
    id: 2,
    title: "Nasi Tim Ikan Lele & Telur Puyuh",
    age: "9_11",
    ageLabel: "9–11 Bulan",
    texture: "Nasi Tim Cincang Lembut (Finger Food)",
    proteinSource: "Ikan Lele & Telur Puyuh",
    estCost: "Rp 6.000 / Porsi",
    calories: "180 kkal",
    protein: "8.2 gram",
    ingredients: [
      "40 gr fillet daging ikan lele bersih duri",
      "2 butir telur puyuh rebus cincang",
      "3 sdm nasi putih",
      "1 iris labu siam manis cincang",
      "Kaldu tulang ayam kampung alami"
    ],
    steps: "Kukus ikan lele bersama bumbu bawang putih dan jahe agar harum. Campurkan nasi, labu siam, dan kaldu, masak tim hingga lembik. Taburi cincangan telur puyuh rebus di atasnya."
  },
  {
    id: 3,
    title: "Pepes Ikan Kembung Bumbu Kuning",
    age: "12_23",
    ageLabel: "12–23 Bulan",
    texture: "Makanan Keluarga Cincang",
    proteinSource: "Ikan Kembung (Omega-3 Tinggi)",
    estCost: "Rp 8.000 / Porsi",
    calories: "220 kkal",
    protein: "12.0 gram",
    ingredients: [
      "1 ekor ikan kembung segar (fillet bebas duri)",
      "1 butir telur ayam kocok",
      "1 buah tomat merah iris halus",
      "Bumbu kuning halus (kunyit, bawang merah, bawang putih, kemiri)",
      "Daun pisang untuk membungkus"
    ],
    steps: "Lumuri ikan dengan bumbu kuning halus dan kocokan telur. Bungkus rapat dengan daun pisang, lalu kukus selama 25 menit hingga bumbu meresap sempurna. Sajikan bersama nasi hangat."
  },
  {
    id: 4,
    title: "Sup Bola Ayam Tahu Sayur Warna-Warni",
    age: "12_23",
    ageLabel: "12–23 Bulan",
    texture: "Makanan Keluarga Lembut",
    proteinSource: "Daging Ayam & Tahu",
    estCost: "Rp 7.500 / Porsi",
    calories: "195 kkal",
    protein: "9.5 gram",
    ingredients: [
      "50 gr daging ayam giling",
      "1/2 kotak tahu putih remas",
      "1 butir putih telur sebagai perekat",
      "Wortel dan brokoli potong kuntum kecil",
      "Kuah kaldu bawang bombai gurih alami"
    ],
    steps: "Campur ayam giling, tahu, dan putih telur, bentuk bola-bola kecil. Rebus kuah kaldu bersama wortel, masukkan bola ayam hingga terapung. Taburi daun seledri segar."
  },
  {
    id: 5,
    title: "Puding Santan Kacang Hijau Padat Gizi",
    age: "all",
    ageLabel: "Semua Usia (>8 Bulan)",
    texture: "Camilan Sehat Lembut",
    proteinSource: "Kacang Hijau & Santan Murni",
    estCost: "Rp 4.000 / Porsi",
    calories: "160 kkal",
    protein: "5.0 gram",
    ingredients: [
      "50 gr kacang hijau (rendam semalaman, rebus empuk)",
      "65 ml santan kental matang",
      "1/2 sdt bubuk agar-agar tawar",
      "Sedikit gula aren asli (hanya untuk rasa samar)"
    ],
    steps: "Haluskan kacang hijau empuk bersama santan. Masak bersama bubuk agar-agar hingga mendidih kecil. Tuang ke cetakan kecil dan dinginkan. Sangat disukai balita yang sedang mogok makan (GTM)."
  },
  {
    id: 6,
    title: "Nasi Orak-Arik Telur & Tempe Cincang",
    age: "24_59",
    ageLabel: "2–5 Tahun",
    texture: "Makanan Keluarga Aktif",
    proteinSource: "Telur Ayam & Tempe Kedelai",
    estCost: "Rp 6.500 / Porsi",
    calories: "280 kkal",
    protein: "13.5 gram",
    ingredients: [
      "1 butir telur ayam segar",
      "2 potong tempe kedelai kukus cincang",
      "1 piring nasi pulen sedang",
      "Daun bayam iris halus",
      "1 sdt minyak kelapa untuk menumis"
    ],
    steps: "Tumis bawang merah dan tempe cincang dengan sedikit minyak kelapa. Masukkan telur, buat orak-arik hingga matang. Masukkan nasi dan irisan bayam, aduk rata dengan api kecil."
  }
];

const feedingRules = [
  {
    title: "Jadwal Teratur",
    desc: "Buat jadwal makan teratur 3 kali makan utama dan 2 kali camilan sehat. Waktu makan tidak boleh lebih dari 30 menit agar anak fokus.",
  },
  {
    title: "Lingkungan Menyenangkan",
    desc: "Matikan gadget, televisi, dan hindari distraksi mainan saat makan. Jangan paksa anak makan jika menolak, tapi ajak duduk bersama di meja makan keluarga.",
  },
  {
    title: "Prosedur Bertahap",
    desc: "Tawarkan porsi kecil terlebih dahulu, beri pujian jika anak mencoba makanan baru, dan tawarkan minum hanya setelah selesai makan agar perut tidak kenyang air.",
  },
];

const mythsAndFacts = [
  {
    myth: "MPASI jangan diberi minyak, santan, atau lemak karena takut batuk/gemuk.",
    fact: "SALAH. Lemak sehat dari santan dan minyak kelapa sangat esensial untuk perkembangan jaringan otak anak dan menambah densitas kalori pencegah stunting.",
  },
  {
    myth: "Stunting adalah faktor genetik keturunan orang tua yang pendek.",
    fact: "SALAH. Faktor genetik hanya berpengaruh sekitar 15%. Sekitar 80–85% tinggi badan anak dipengaruhi oleh asupan gizi protein hewani pada 1000 Hari Pertama Kehidupan (HPK).",
  },
  {
    myth: "Susu kental manis (SKM) baik untuk menambah berat badan balita.",
    fact: "BAHAYA! SKM mengandung gula sangat tinggi (di atas 50%) dengan protein sangat rendah. Memberikan SKM pada balita justru memicu kerusakan gigi dan malnutrisi gizi buruk.",
  },
];

export default function NutriGuide() {
  const [selectedAge, setSelectedAge] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRecipes = recipes.filter((r) => {
    const matchAge = selectedAge === "all" || r.age === selectedAge || r.age === "all";
    const matchSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        r.proteinSource.toLowerCase().includes(searchTerm.toLowerCase());
    return matchAge && matchSearch;
  });

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header Banner */}
        <div className="p-7 sm:p-10 rounded-[36px] bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white shadow-xl shadow-orange-500/10 relative overflow-hidden">
          <div className="relative z-10 space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold border border-white/25">
              <FaUtensils /> NutriGuide SIDIAS
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Katalog Gizi MPASI & Resep Pangan Lokal
            </h1>
            <p className="text-white/90 text-xs sm:text-sm leading-relaxed">
              Kumpulan resep padat gizi berbasis protein hewani murah & lokal (hati ayam, telur puyuh, ikan kembung, santan) yang diformulasikan khusus untuk akselerasi pertumbuhan tinggi badan balita.
            </p>
          </div>
        </div>

        {/* Search & Filter Age Tabs */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-3.5 text-slate-400 text-sm" />
              <input
                type="text"
                placeholder="Cari bahan makanan (contoh: ikan, hati ayam, telur)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 shadow-sm transition-all"
              />
            </div>

            <div className="flex overflow-x-auto gap-1.5 p-1 bg-white rounded-2xl border border-slate-200 shadow-sm no-scrollbar self-start">
              {[
                { id: "all", label: "Semua Usia" },
                { id: "6_8", label: "6–8 Bulan" },
                { id: "9_11", label: "9–11 Bulan" },
                { id: "12_23", label: "12–23 Bulan" },
                { id: "24_59", label: "2–5 Tahun" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedAge(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    selectedAge === tab.id
                      ? "bg-orange-500 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recipe Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRecipes.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-orange-50 text-orange-700 border border-orange-200">
                    {item.ageLabel}
                  </span>
                  <span className="text-xs font-bold text-slate-500">{item.estCost}</span>
                </div>

                <h3 className="font-extrabold text-slate-800 text-base leading-snug">{item.title}</h3>
                <p className="text-xs text-slate-500">Tekstur: <strong>{item.texture}</strong></p>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Protein: <strong className="text-orange-600">{item.protein}</strong></span>
                  <span>Kalori: <strong className="text-slate-900">{item.calories}</strong></span>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-700 block mb-1">Bahan Utama:</span>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                    {item.ingredients.slice(0, 3).map((ing, i) => (
                      <li key={i}>{ing}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 leading-relaxed bg-orange-50/40 p-3 rounded-2xl">
                <strong className="text-orange-950 block mb-1">Cara Buat:</strong>
                <p className="line-clamp-3">{item.steps}</p>
              </div>
            </div>
          ))}
        </div>

        {/* FEEDING RULES SECTION */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-5">
          <div>
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wide">Standar IDAI & Kemenkes</span>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight mt-1">
              Aturan Pemberian Makan Balita (Feeding Rules)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Kunci utama mengatasi anak Gerakan Tutup Mulut (GTM) dan sulit makan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {feedingRules.map((rule, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-teal-600 text-white font-black text-xs flex items-center justify-center">
                  0{idx + 1}
                </div>
                <h4 className="font-extrabold text-slate-800 text-sm">{rule.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{rule.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* MITOS VS FAKTA GIZI */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-5">
          <div>
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wide">Edukasi Ilmiah</span>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight mt-1">
              Mitos vs Fakta Stunting & Nutrisi Anak
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Meluruskan pemahaman yang sering keliru di masyarakat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mythsAndFacts.map((mf, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-slate-100 space-y-3 bg-slate-50/50">
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                    <FaTimes /> Mitos
                  </span>
                  <p className="text-xs font-bold text-slate-800 pt-1 leading-snug">"{mf.myth}"</p>
                </div>
                <div className="space-y-1 pt-2 border-t border-slate-200/60">
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <FaCheck /> Fakta Medis
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">{mf.fact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

