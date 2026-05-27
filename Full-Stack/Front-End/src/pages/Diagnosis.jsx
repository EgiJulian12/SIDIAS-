import MainLayout from "../components/layouts/MainLayout";

import { useRef, useState } from "react";

import { useForm } from "react-hook-form";

import { motion } from "framer-motion";

import toast, { Toaster } from "react-hot-toast";

import Webcam from "react-webcam";

import {
  FaUser,
  FaWeight,
  FaRulerVertical,
  FaChild,
  FaCamera,
  FaImages,
  FaHeartbeat,
} from "react-icons/fa";

const Diagnosis = () => {
  const [preview, setPreview] = useState(null);

  const [result, setResult] = useState(null);

  const [openCamera, setOpenCamera] = useState(false);

  const webcamRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Upload dari galeri
  const handleImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);

      setPreview(imageUrl);

      toast.success("Foto berhasil dipilih");
    }
  };

  // Capture webcam
  const capturePhoto = () => {
    const imageSrc =
      webcamRef.current.getScreenshot();

    setPreview(imageSrc);

    setOpenCamera(false);

    toast.success("Foto berhasil diambil");
  };

  // Submit
  const onSubmit = (data) => {
    if (!preview) {
      toast.error("Foto anak wajib diupload");
      return;
    }

    const tinggiMeter = data.tinggi / 100;

    const bmi =
      data.berat / (tinggiMeter * tinggiMeter);

    let status = "";
    let prediction = "";
    let recommendation = "";

    // Simulasi Deteksi
    if (bmi < 14) {
      status = "Terindikasi Stunting";

      prediction =
        "Anak memiliki risiko mengalami stunting apabila pertumbuhan tidak dipantau dan kebutuhan gizi tidak terpenuhi.";

      recommendation =
        "Tingkatkan konsumsi protein, susu, vitamin, makanan bergizi seimbang, dan lakukan pemeriksaan rutin ke posyandu.";
    } else {
      status = "Tidak Stunting";

      prediction =
        "Pertumbuhan anak saat ini tergolong baik dan stabil berdasarkan data yang dimasukkan.";

      recommendation =
        "Pertahankan pola makan sehat, aktivitas fisik, nutrisi seimbang, dan pemeriksaan rutin setiap bulan.";
    }

    // Simpan History
    const newHistory = {
      id: Date.now(),
      nama: data.nama,
      umur: `${data.umur} Bulan`,
      berat: `${data.berat} Kg`,
      tinggi: `${data.tinggi} Cm`,
      tanggal: new Date().toLocaleDateString("id-ID"),
      status,
      prediction,
      recommendation,
      image: preview,
    };

    const existingHistory =
      JSON.parse(localStorage.getItem("historyData")) || [];

    localStorage.setItem(
      "historyData",
      JSON.stringify([newHistory, ...existingHistory])
    );

    // Set Result
    setResult({
      status,
      prediction,
      recommendation,
    });

    toast.success("Analisis berhasil dilakukan");

    reset();
  };

  return (
    <MainLayout>
      <Toaster position="top-right" />

      <div className="space-y-8">

        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full font-medium mb-4">
            Pelayanan Posyandu
          </div>

          <h1 className="text-4xl font-bold text-slate-800">
            Analisis Pertumbuhan Anak
          </h1>

          <p className="mt-3 text-slate-500 text-lg leading-relaxed max-w-2xl">
            Input data anak untuk melakukan analisis pertumbuhan dan deteksi risiko stunting secara modern.
          </p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-[36px] shadow-2xl p-6 md:p-10"
        >

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8"
          >

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Nama */}
              <div>
                <label className="text-slate-700 font-semibold mb-3 flex items-center gap-2">
                  <FaUser className="text-teal-500" />
                  Nama Anak
                </label>

                <input
                  type="text"
                  placeholder="Masukkan nama anak"
                  {...register("nama", {
                    required: "Nama wajib diisi",
                  })}
                  className={`w-full rounded-2xl border px-5 py-4 text-slate-700 outline-none transition-all ${
                    errors.nama
                      ? "border-red-400 focus:ring-4 focus:ring-red-100"
                      : "border-slate-200 focus:ring-4 focus:ring-teal-100"
                  }`}
                />

                {errors.nama && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.nama.message}
                  </p>
                )}
              </div>

              {/* Umur */}
              <div>
                <label className="text-slate-700 font-semibold mb-3 flex items-center gap-2">
                  <FaChild className="text-teal-500" />
                  Umur Anak
                </label>

                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    placeholder="Contoh: 24"
                    {...register("umur", {
                      required: "Umur wajib diisi",
                      min: {
                        value: 0,
                        message: "Umur tidak boleh negatif",
                      },
                    })}
                    className={`w-full rounded-2xl border px-5 py-4 pr-24 text-slate-700 outline-none transition-all ${
                      errors.umur
                        ? "border-red-400 focus:ring-4 focus:ring-red-100"
                        : "border-slate-200 focus:ring-4 focus:ring-teal-100"
                    }`}
                  />

                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                    Bulan
                  </span>
                </div>

                {errors.umur && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.umur.message}
                  </p>
                )}
              </div>

              {/* Berat */}
              <div>
                <label className="text-slate-700 font-semibold mb-3 flex items-center gap-2">
                  <FaWeight className="text-teal-500" />
                  Berat Badan
                </label>

                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    placeholder="Contoh: 12"
                    {...register("berat", {
                      required: "Berat badan wajib diisi",
                      min: {
                        value: 0,
                        message: "Berat badan tidak boleh negatif",
                      },
                    })}
                    className={`w-full rounded-2xl border px-5 py-4 pr-20 text-slate-700 outline-none transition-all ${
                      errors.berat
                        ? "border-red-400 focus:ring-4 focus:ring-red-100"
                        : "border-slate-200 focus:ring-4 focus:ring-teal-100"
                    }`}
                  />

                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                    Kg
                  </span>
                </div>

                {errors.berat && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.berat.message}
                  </p>
                )}
              </div>

              {/* Tinggi */}
              <div>
                <label className="text-slate-700 font-semibold mb-3 flex items-center gap-2">
                  <FaRulerVertical className="text-teal-500" />
                  Tinggi Badan
                </label>

                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    placeholder="Contoh: 85"
                    {...register("tinggi", {
                      required: "Tinggi badan wajib diisi",
                      min: {
                        value: 0,
                        message: "Tinggi badan tidak boleh negatif",
                      },
                    })}
                    className={`w-full rounded-2xl border px-5 py-4 pr-20 text-slate-700 outline-none transition-all ${
                      errors.tinggi
                        ? "border-red-400 focus:ring-4 focus:ring-red-100"
                        : "border-slate-200 focus:ring-4 focus:ring-teal-100"
                    }`}
                  />

                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                    Cm
                  </span>
                </div>

                {errors.tinggi && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.tinggi.message}
                  </p>
                )}
              </div>
            </div>

            {/* Upload Foto */}
            <div className="bg-slate-50 border border-dashed border-slate-300 rounded-[32px] p-8 text-center">

              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center mx-auto text-white text-4xl shadow-xl mb-6">
                📸
              </div>

              <h2 className="text-2xl font-bold text-slate-700">
                Upload Foto Anak
              </h2>

              <p className="text-slate-500 mt-3 mb-8">
                Ambil foto langsung dari kamera atau pilih dari galeri.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">

                {/* Kamera */}
                <button
                  type="button"
                  onClick={() => setOpenCamera(true)}
                  className="bg-gradient-to-r from-teal-400 to-cyan-500 text-white px-6 py-4 rounded-2xl font-semibold shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-3"
                >
                  <FaCamera />
                  Buka Kamera
                </button>

                {/* Galeri */}
                <label className="cursor-pointer bg-white border border-slate-200 text-slate-700 px-6 py-4 rounded-2xl font-semibold shadow-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-3">

                  <FaImages />

                  Pilih Dari Galeri

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Preview */}
              {preview && (
                <div className="mt-8">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-48 h-48 object-cover rounded-[32px] mx-auto shadow-xl border-4 border-white"
                  />
                </div>
              )}
            </div>

            {/* Result */}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-teal-400 to-cyan-500 rounded-[36px] p-8 text-white shadow-2xl"
              >

                <div className="flex items-center gap-3 mb-8">
                  <FaHeartbeat className="text-3xl" />

                  <h2 className="text-3xl font-bold">
                    Hasil Analisis Anak
                  </h2>
                </div>

                <div className="space-y-6">

                  <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6">
                    <h3 className="text-xl font-bold mb-3">
                      Status Deteksi
                    </h3>

                    <p className="text-white/90 leading-relaxed text-lg">
                      {result.status}
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6">
                    <h3 className="text-xl font-bold mb-3">
                      Prediksi Kedepan
                    </h3>

                    <p className="text-white/90 leading-relaxed text-lg">
                      {result.prediction}
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6">
                    <h3 className="text-xl font-bold mb-3">
                      Rekomendasi
                    </h3>

                    <p className="text-white/90 leading-relaxed text-lg">
                      {result.recommendation}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-400 to-cyan-500 text-white py-5 rounded-3xl text-lg font-semibold shadow-xl hover:scale-[1.01] transition-all"
            >
              Simpan & Analisis Data Anak
            </button>
          </form>
        </motion.div>
      </div>

      {/* Camera Modal */}
      {openCamera && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[999] flex items-center justify-center p-4">

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[36px] p-6 w-full max-w-2xl shadow-2xl"
          >

            {/* Header */}
            <div className="flex items-center justify-between mb-6">

              <h2 className="text-2xl font-bold text-slate-800">
                Kamera Anak
              </h2>

              <button
                type="button"
                onClick={() => setOpenCamera(false)}
                className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 hover:bg-red-100 transition-all"
              >
                ✕
              </button>
            </div>

            {/* Webcam */}
            <div className="overflow-hidden rounded-[32px] shadow-xl">

              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full"
                videoConstraints={{
                  facingMode: "environment",
                }}
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">

              <button
                type="button"
                onClick={capturePhoto}
                className="flex-1 bg-gradient-to-r from-teal-400 to-cyan-500 text-white py-4 rounded-2xl font-semibold shadow-lg hover:scale-[1.02] transition-all"
              >
                📸 Ambil Foto
              </button>

              <button
                type="button"
                onClick={() => setOpenCamera(false)}
                className="flex-1 bg-slate-100 text-slate-700 py-4 rounded-2xl font-semibold hover:bg-slate-200 transition-all"
              >
                Tutup
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </MainLayout>
  );
};

export default Diagnosis;