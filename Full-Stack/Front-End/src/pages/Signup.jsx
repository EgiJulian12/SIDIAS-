import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import api from "../services/api";
import {
  FaHeartbeat,
  FaUser,
  FaLock,
  FaArrowRight,
  FaChild,
  FaCheck
} from "react-icons/fa";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nik: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!formData.nik || !formData.password || !formData.confirmPassword) {
      return toast.error("Semua field wajib diisi");
    }

    if (formData.nik.length < 16) {
      return toast.error("NIK harus 16 digit sesuai KTP/KK");
    }

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Konfirmasi password tidak cocok");
    }

    setIsLoading(true);
    try {
      await api.post("/auth/register", {
        nik: formData.nik,
        password: formData.password,
      });

      toast.success("Akun berhasil dibuat! Silakan masuk.");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      const message = error.response?.data?.message || "Registrasi gagal";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />

      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Ambient background blurs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-teal-200/40 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200/40 blur-3xl rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white/90 backdrop-blur-2xl rounded-[36px] shadow-2xl border border-slate-100 p-8 sm:p-10 relative z-10 space-y-6"
        >
          {/* Logo & Brand Header */}
          <div className="text-center space-y-3">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-3xl mx-auto shadow-lg shadow-teal-500/20">
              <FaChild />
            </div>

            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                Pendaftaran Akun
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Daftar sebagai Kader Posyandu atau Orang Tua
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Nomor Induk Kependudukan (NIK)
              </label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="text"
                  name="nik"
                  placeholder="16 digit NIK KTP / KK"
                  value={formData.nik}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all bg-slate-50/50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="password"
                  name="password"
                  placeholder="Buat password minimal 6 karakter"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all bg-slate-50/50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Konfirmasi Kata Sandi
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Ulangi password di atas"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all bg-slate-50/50"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-teal-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 mt-2"
            >
              {isLoading ? "Mendaftarkan..." : "Daftar Akun Baru"}
              <FaArrowRight className="text-xs" />
            </button>
          </form>

          {/* Footer Link */}
          <div className="pt-2 text-center border-t border-slate-100 text-xs text-slate-500">
            Sudah memiliki akun?{" "}
            <Link to="/login" className="font-extrabold text-teal-600 hover:text-teal-700">
              Masuk di Sini
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Signup;
