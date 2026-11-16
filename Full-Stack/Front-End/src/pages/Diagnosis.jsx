import React, { useRef, useState, useMemo } from "react";
import MainLayout from "../components/layout/MainLayout";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import Webcam from "react-webcam";
import api from "../services/api";
import KmsGrowthChart from "../components/charts/KmsGrowthChart";
import PrintReportModal from "../components/common/PrintReportModal";
import {
  FaUser,
  FaWeight,
  FaRulerVertical,
  FaChild,
  FaCamera,
  FaImages,
  FaHeartbeat,
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaPrint,
  FaRedo,
  FaUtensils,
  FaGlassMartiniAlt,
  FaRunning,
  FaMoon,
  FaChartLine,
  FaInfoCircle
} from "react-icons/fa";

// Helper untuk konversi Base64 webcam ke File
const dataURLtoFile = (dataurl, filename) => {
  let arr = dataurl.split(",");
  let mime = arr[0].match(/:(.*?);/)[1];
  let bstr = atob(arr[1]);
  let n = bstr.length;
  let u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

const Diagnosis = () => {
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [openCamera, setOpenCamera] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [activeTab, setActiveTab] = useState("proyeksi");
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Result data from API
  const [analysisResult, setAnalysisResult] = useState(null);

  const webcamRef = useRef(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      nama: "",
      jenis_kelamin: "L",
      tanggal_lahir: "",
      berat: "",
      tinggi: "",
    },
  });

  // Watch form values for live preview
  const watchedBirthDate = watch("tanggal_lahir");
  const watchedSex = watch("jenis_kelamin");
  const watchedHeight = watch("tinggi");
  const watchedWeight = watch("berat");

  // Calculate live age in months
  const liveAgeMonths = useMemo(() => {
    if (!watchedBirthDate) return 0;
    const today = new Date();
    const birth = new Date(watchedBirthDate);
    let months = (today.getFullYear() - birth.getFullYear()) * 12;
    months -= birth.getMonth();
    months += today.getMonth();
    return Math.max(0, months);
  }, [watchedBirthDate]);

  // Upload image from file picker
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
      setImageFile(file);
      toast.success("Foto balita berhasil dipilih");
    }
  };

  // Capture webcam photo
  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setPreview(imageSrc);
      const file = dataURLtoFile(imageSrc, `balita_${Date.now()}.jpg`);
      setImageFile(file);
      setOpenCamera(false);
      toast.success("Foto kamera berhasil diambil");
    }
  };

  // Submit to Backend
  const onSubmit = async (data) => {
    setIsLoading(true);
    setLoadingStep("Menyimpan identitas & data antropometri balita...");

    try {
      // 1. Simpan ke tabel data_balita
      const formDataToSend = new FormData();
      formDataToSend.append("nama", data.nama);
      formDataToSend.append("jenis_kelamin", data.jenis_kelamin);
      formDataToSend.append("tanggal_lahir", data.tanggal_lahir);
      formDataToSend.append("berat_badan", data.berat);
      formDataToSend.append("tinggi_badan", data.tinggi);
      formDataToSend.append("umur_bulan", liveAgeMonths);

      if (imageFile) {
        formDataToSend.append("foto", imageFile);
      }

      const resBalita = await api.post("/data-balita", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const balitaId = resBalita.data.data.id;

      setLoadingStep("Kecerdasan Buatan (Dual-AI) sedang menganalisis...");

      // 2. Jalankan analisis AI
      const resAnalisis = await api.post("/analisis", {
        data_id: balitaId,
      });

      const fullData = {
        ...resAnalisis.data.data,
        nama: data.nama,
        jenis_kelamin: data.jenis_kelamin,
        tanggal_lahir: data.tanggal_lahir,
        umur_bulan: liveAgeMonths,
        berat_badan: data.berat,
        tinggi_badan: data.tinggi,
        foto_url: resBalita.data.data.foto_url,
      };

      // Ensure personalized object is parsed
      if (typeof fullData.rekomendasi_detail === "string") {
        try {
          fullData.personalized = JSON.parse(fullData.rekomendasi_detail);
        } catch {
          fullData.personalized = null;
        }
      }

      setAnalysisResult(fullData);
      toast.success("Analisis AI & Rekam Medis Berhasil Dibuat!");
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Gagal memproses pemeriksaan";
      toast.error(msg);
    } finally {
      setIsLoading(false);
      setLoadingStep("");
    }
  };

  const handleResetForm = () => {
    setAnalysisResult(null);
    setPreview(null);
    setImageFile(null);
    reset();
  };

  const p = analysisResult?.personalized;

  return (
    <MainLayout>
      <Toaster position="top-right" />

      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-3.5 py-1 rounded-full text-xs font-bold border border-teal-200/60 mb-2">
              <FaHeartbeat /> Pelayanan Skrining Posyandu
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
              Pemeriksaan & Diagnosis Stunting
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Evaluasi tumbuh kembang anak menggunakan baku WHO & Computer Vision MobileNetV2.
            </p>
          </div>

          {analysisResult && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPrintModalOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
              >
                <FaPrint /> Cetak Lembar Posyandu
              </button>
              <button
                onClick={handleResetForm}
                className="px-4 py-2.5 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold border border-teal-200 transition-all flex items-center gap-2"
              >
                <FaRedo /> Pemeriksaan Baru
              </button>
            </div>
          )}
        </div>

        {/* SECTION 1: FORM INPUT (Shown if no result or editing) */}
        {!analysisResult ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Left Column */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-extrabold text-slate-800">Formulir Rekam Data Balita</h3>
                <p className="text-xs text-slate-500">Lengkapi data antropometri untuk memicu analisis AI.</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Nama Anak */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <FaUser className="text-teal-600" /> Nama Lengkap Anak
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Aditya Pratama"
                      {...register("nama", { required: "Nama balita wajib diisi" })}
                      className={`w-full px-4 py-3 rounded-2xl border text-sm text-slate-800 outline-none transition-all ${
                        errors.nama ? "border-rose-400 focus:ring-2 focus:ring-rose-200" : "border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                      }`}
                    />
                    {errors.nama && <p className="text-rose-500 text-xs mt-1.5">{errors.nama.message}</p>}
                  </div>

                  {/* Jenis Kelamin */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <FaChild className="text-teal-600" /> Jenis Kelamin
                    </label>
                    <select
                      {...register("jenis_kelamin", { required: "Jenis kelamin wajib dipilih" })}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm text-slate-800 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all bg-white"
                    >
                      <option value="L">Laki-laki (L)</option>
                      <option value="P">Perempuan (P)</option>
                    </select>
                  </div>

                  {/* Tanggal Lahir */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <FaCalendarAlt className="text-teal-600" /> Tanggal Lahir
                    </label>
                    <input
                      type="date"
                      {...register("tanggal_lahir", { required: "Tanggal lahir wajib diisi" })}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm text-slate-800 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all bg-white"
                    />
                    {watchedBirthDate && (
                      <p className="text-[11px] text-teal-700 font-semibold mt-1.5">
                        Usia Terhitung: <strong>{liveAgeMonths} Bulan</strong>
                      </p>
                    )}
                  </div>

                  {/* Berat Badan */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <FaWeight className="text-teal-600" /> Berat Badan (kg)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        min="1"
                        max="40"
                        placeholder="Contoh: 11.2"
                        {...register("berat", { required: "Berat badan wajib diisi" })}
                        className="w-full px-4 py-3 pr-12 rounded-2xl border border-slate-200 text-sm text-slate-800 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
                      />
                      <span className="absolute right-4 top-3.5 text-xs text-slate-400 font-bold">Kg</span>
                    </div>
                  </div>

                  {/* Tinggi Badan */}
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <FaRulerVertical className="text-teal-600" /> Tinggi Badan (cm)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        min="35"
                        max="135"
                        placeholder="Contoh: 82.5"
                        {...register("tinggi", { required: "Tinggi badan wajib diisi" })}
                        className="w-full px-4 py-3 pr-12 rounded-2xl border border-slate-200 text-sm text-slate-800 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
                      />
                      <span className="absolute right-4 top-3.5 text-xs text-slate-400 font-bold">Cm</span>
                    </div>
                  </div>
                </div>

                {/* Upload Foto / Kamera */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-dashed border-slate-300 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Foto Balita (Opsional untuk AI MobileNetV2)</h4>
                      <p className="text-[11px] text-slate-500">Membantu verifikasi visual ciri fisik stunting tampak luar.</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setOpenCamera(true)}
                        className="px-3 py-1.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold flex items-center gap-1.5 hover:bg-teal-100 transition-all"
                      >
                        <FaCamera /> Kamera
                      </button>
                      <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-white text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-50 transition-all">
                        <FaImages /> Galeri
                        <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
                      </label>
                    </div>
                  </div>

                  {/* Preview Image */}
                  {preview && (
                    <div className="relative w-32 h-32 mx-auto rounded-2xl overflow-hidden border-2 border-teal-500 shadow-md">
                      <img src={preview} alt="Preview Balita" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setPreview(null);
                          setImageFile(null);
                        }}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-rose-500 text-white text-xs flex items-center justify-center shadow-md"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-teal-600/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{loadingStep || "Menganalisis..."}</span>
                    </>
                  ) : (
                    <>
                      <FaHeartbeat className="text-lg" />
                      <span>Jalankan Analisis AI & Deteksi Stunting</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right: Real-time Guidance & Standards */}
            <div className="lg:col-span-4 space-y-5">
              <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-teal-700 font-extrabold text-xs uppercase tracking-wide">
                  <FaInfoCircle /> Panduan Pengukuran Presisi
                </div>
                <h4 className="font-extrabold text-slate-800 text-sm">Standar Pengukuran Posyandu</h4>
                <ul className="text-xs text-slate-600 space-y-2.5 list-disc pl-4 leading-relaxed">
                  <li><strong>Usia 0–24 Bulan:</strong> Ukur panjang badan dalam posisi telentang (length-board) di atas meja datar.</li>
                  <li><strong>Usia &gt; 24 Bulan:</strong> Ukur tinggi badan dalam posisi berdiri tegak (microtoise) menempel dinding tanpa alas kaki.</li>
                  <li><strong>Berat Badan:</strong> Timbang dengan timbangan digital yang telah dikalibrasi, pakaian seringan mungkin.</li>
                </ul>
              </div>

              {/* Dynamic Live Status Card */}
              {watchedHeight > 0 && liveAgeMonths >= 0 && (
                <div className="p-6 rounded-3xl bg-gradient-to-br from-teal-50 via-emerald-50 to-teal-100/50 border border-teal-200/80 shadow-sm space-y-2">
                  <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wide">Live Preview</span>
                  <h4 className="font-extrabold text-slate-800 text-sm">
                    {watchedSex === "L" ? "Anak Laki-laki" : "Anak Perempuan"}, {liveAgeMonths} Bulan
                  </h4>
                  <p className="text-xs text-slate-600">
                    TB: <strong>{watchedHeight} cm</strong> • BB: <strong>{watchedWeight || 0} kg</strong>
                  </p>
                  <p className="text-[11px] text-teal-800 pt-1">
                    Sistem siap menghitung deviasi baku WHO dan ensemble MobileNetV2 setelah Anda menekan tombol analisis.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* SECTION 2: COMPREHENSIVE AI RESULT & TABS */
          <div className="space-y-6">
            {/* Top Overview Result Banner */}
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm ${
              analysisResult.status_stunting === "Terindikasi Stunting"
                ? "bg-gradient-to-br from-rose-50 via-amber-50 to-white border-rose-200"
                : "bg-gradient-to-br from-emerald-50 via-teal-50 to-white border-emerald-200"
            }`}>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-3.5 py-1 rounded-full text-xs font-black border ${
                      analysisResult.status_stunting === "Terindikasi Stunting"
                        ? "bg-rose-100 text-rose-800 border-rose-300"
                        : "bg-emerald-100 text-emerald-800 border-emerald-300"
                    }`}>
                      {analysisResult.status_stunting}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/80 border border-slate-200 text-slate-700">
                      Z-Score HAZ: <strong>{analysisResult.z_score} SD</strong>
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/80 border border-slate-200 text-slate-700">
                      Tingkat Risiko: <strong>{analysisResult.tingkat_risiko || "Sedang"}</strong>
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {analysisResult.nama} ({analysisResult.umur_bulan} Bulan)
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-3xl">
                    {p?.scenario_title || analysisResult.status_detail}
                  </p>
                </div>

                {/* Fast Action Buttons */}
                <div className="flex flex-wrap sm:flex-nowrap gap-3">
                  <button
                    onClick={() => setIsPrintModalOpen(true)}
                    className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <FaPrint /> Cetak Lembar Hasil
                  </button>
                  <button
                    onClick={handleResetForm}
                    className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <FaRedo /> Skrining Ulang
                  </button>
                </div>
              </div>
            </div>

            {/* TAB NAVIGATION */}
            <div className="flex overflow-x-auto gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/60 no-scrollbar">
              {[
                { id: "proyeksi", label: "Evaluasi & Proyeksi", icon: <FaInfoCircle /> },
                { id: "makanan", label: "Rekomendasi Makanan", icon: <FaUtensils /> },
                { id: "minuman", label: "Minuman & Pantangan", icon: <FaGlassMartiniAlt /> },
                { id: "olahraga", label: "Olahraga & Tulang", icon: <FaRunning /> },
                { id: "tidur", label: "Pola Tidur (HGH)", icon: <FaMoon /> },
                { id: "kms", label: "Kurva KMS Digital", icon: <FaChartLine /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-white text-teal-800 shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* TAB CONTENT PANELS */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm min-h-[350px]">
              {/* TAB 1: EVALUASI & PROYEKSI MASA DEPAN */}
              {activeTab === "proyeksi" && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-lg font-extrabold text-slate-800">Evaluasi Klinis & Proyeksi Masa Depan</h3>
                    <p className="text-xs text-slate-500">Analisis menyeluruh dampak pola asuh saat ini terhadap pertumbuhan anak.</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-teal-50/60 border border-teal-100 space-y-2">
                    <h4 className="text-xs font-bold text-teal-900 uppercase tracking-wide">
                      Proyeksi Kondisi 6 Bulan ke Depan
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                      {p?.proyeksi_masa_depan || analysisResult.rekomendasi}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <span className="text-xs font-bold text-slate-700 block">Jadwal Evaluasi Kontrol</span>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {p?.jadwal_kontrol || "Lakukan kunjungan ke posyandu setiap bulan untuk memantau kenaikan berat dan panjang badan."}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-2">
                      <span className="text-xs font-bold text-rose-800 block">Tanda Bahaya (Segera ke Faskes / Dokter)</span>
                      <ul className="text-xs text-rose-700 space-y-1 list-disc pl-4">
                        {(p?.red_flags || [
                          "Berat badan tidak naik selama 2 bulan berturut-turut.",
                          "Anak batuk lama lebih dari 2 minggu (waspada TB anak).",
                          "Kedua kaki bengkak (edema tanda gizi buruk)."
                        ]).slice(0, 3).map((rf, idx) => (
                          <li key={idx}>{rf}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: REKOMENDASI MAKANAN */}
              {activeTab === "makanan" && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-lg font-extrabold text-slate-800">Rekomendasi Nutrisi & Pola Makan Harian</h3>
                    <p className="text-xs text-slate-500">Menu pangan lokal padat gizi untuk usia {analysisResult.umur_bulan} bulan.</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-100">
                    <span className="text-xs font-bold text-orange-900 block mb-1">Target Asupan Protein Hewani:</span>
                    <p className="text-xs sm:text-sm font-semibold text-orange-950">
                      {p?.rekomendasi_makanan?.target_protein_harian || "1-2 butir telur puyuh + ikan/ayam per hari"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1.5">
                      <span className="text-xs font-extrabold text-teal-800 block">Sarapan Pagi</span>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {p?.rekomendasi_makanan?.sarapan || "Bubur beras/nasi tim + kuning telur + sup kaldu gurih."}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1.5">
                      <span className="text-xs font-extrabold text-teal-800 block">Makan Siang</span>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {p?.rekomendasi_makanan?.makan_siang || "Nasi/tim + pepes ikan kembung/lele + sayur bening kelor/bayam."}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1.5">
                      <span className="text-xs font-extrabold text-teal-800 block">Makan Malam</span>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {p?.rekomendasi_makanan?.makan_malam || "Nasi/tim + telur dadar cincang + tahu goreng empuk + sup wortel."}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-1">
                    <span className="text-xs font-bold text-amber-900 block">Camilan Padat Gizi (Selingan):</span>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {p?.rekomendasi_makanan?.camilan_sehat || "Puding santan kacang hijau, pisang bakar keju, atau alpukat kerok murni."}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 3: MINUMAN & PANTANGAN */}
              {activeTab === "minuman" && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-lg font-extrabold text-slate-800">Minuman Sehat & Larangan Pantangan</h3>
                    <p className="text-xs text-slate-500">Panduan hidrasi dan pencegahan anemia defisiensi besi pada balita.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Dianjurkan */}
                    <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-3">
                      <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-xs">
                        <FaCheckCircle className="text-emerald-600" />
                        <span>Minuman yang Sangat Dianjurkan</span>
                      </div>
                      <ul className="text-xs text-slate-700 space-y-2 list-disc pl-4 leading-relaxed">
                        {(p?.rekomendasi_minuman?.dianjurkan || [
                          "Air putih matang bersih 800-1000 ml per hari.",
                          "ASI / Susu pertumbuhan sesuai anjuran usia (maksimal 400-500 ml/hari agar tidak kenyang semu)."
                        ]).map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Dilarang */}
                    <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-100 space-y-3">
                      <div className="flex items-center gap-2 text-rose-800 font-extrabold text-xs">
                        <FaExclamationTriangle className="text-rose-600" />
                        <span>Pantangan Keras (Wajib Dihindari)</span>
                      </div>
                      <ul className="text-xs text-rose-900 space-y-2 list-disc pl-4 leading-relaxed font-medium">
                        {(p?.rekomendasi_minuman?.dilarang || [
                          "Teh manis atau teh tawar (tanin mengikat zat besi & kalsium hingga 70%).",
                          "Kental manis (bukan susu, melainkan gula pekat).",
                          "Minuman kemasan bersoda atau berpemanis buatan."
                        ]).map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: OLAHRAGA & LEMPENG TULANG */}
              {activeTab === "olahraga" && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-lg font-extrabold text-slate-800">Aktivitas Fisik & Stimulasi Tulang</h3>
                    <p className="text-xs text-slate-500">Merangsang lempeng epifisis tulang panjang untuk mendorong pertumbuhan tinggi badan.</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-teal-50 border border-teal-100 text-xs text-teal-900">
                    <strong>Durasi Harian:</strong> {p?.rekomendasi_olahraga?.durasi_harian || "30–60 menit per hari aktif bermain."}
                  </div>

                  <div className="space-y-2.5">
                    {(p?.rekomendasi_olahraga?.jenis_aktivitas || [
                      "Latihan berjalan, berlari kecil di taman berumput.",
                      "Bergelantungan ringan (hanging bar) selama 5-10 detik untuk merangsang tulang belakang.",
                      "Bermain lompat kecil dan menendang bola."
                    ]).map((act, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs text-slate-700 flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{act}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: POLA TIDUR & HGH */}
              {activeTab === "tidur" && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-lg font-extrabold text-slate-800">Pola Tidur & Optimalisasi Hormon Pertumbuhan (HGH)</h3>
                    <p className="text-xs text-slate-500">Tidur nyenyak adalah waktu di mana 70% pertumbuhan tinggi badan anak berlangsung.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
                      <span className="text-xs font-bold text-indigo-900 block">Jam Tidur Malam Ideal</span>
                      <span className="text-xl font-black text-indigo-950 mt-1 block">
                        {p?.pola_tidur_hgh?.jam_tidur_malam_ideal || "Sebelum Pukul 20.30 WIB"}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
                      <span className="text-xs font-bold text-indigo-900 block">Total Durasi Tidur Harian</span>
                      <span className="text-xl font-black text-indigo-950 mt-1 block">
                        {p?.pola_tidur_hgh?.target_jam_tidur || "11–13 Jam/Hari"}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
                    <span className="font-bold block mb-1 text-slate-800">Alasan Medis:</span>
                    {p?.pola_tidur_hgh?.alasan_medis || "Hormon pertumbuhan dilepaskan oleh kelenjar pituitari secara optimal pada fase deep sleep antara jam 21.00 hingga 01.00 dini hari."}
                  </div>
                </div>
              )}

              {/* TAB 6: KURVA KMS DIGITAL */}
              {activeTab === "kms" && (
                <div className="space-y-6 animate-fadeIn">
                  <KmsGrowthChart
                    umur_bulan={analysisResult.umur_bulan}
                    tinggi_badan={analysisResult.tinggi_badan}
                    jenis_kelamin={analysisResult.jenis_kelamin}
                    nama={analysisResult.nama}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* WEBCAM MODAL */}
      {openCamera && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl p-5 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-800 text-center">Posisikan Badan Balita Secara Tegak</h3>
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-[3/4]">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: "environment" }}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={capturePhoto}
                className="flex-1 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md"
              >
                Ambil Foto
              </button>
              <button
                type="button"
                onClick={() => setOpenCamera(false)}
                className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRINT REPORT MODAL */}
      <PrintReportModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        data={analysisResult}
      />
    </MainLayout>
  );
};

export default Diagnosis;
