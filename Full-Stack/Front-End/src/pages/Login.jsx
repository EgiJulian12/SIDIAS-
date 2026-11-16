import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";
import {
  FaHeartbeat,
  FaUser,
  FaLock,
  FaArrowRight,
  FaChild,
  FaShieldAlt,
  FaUserCheck,
  FaExclamationTriangle
} from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    nik: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [serverError500, setServerError500] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDemoLogin = () => {
    const demoUser = {
      nik: formData.nik || "3206290807040003",
      name: "Kader Posyandu (Demo)",
      role: "kader"
    };
    login(demoUser, "demo-token-" + Date.now());
    toast.success("Berhasil masuk menggunakan Mode Demo / Offline!");
    setTimeout(() => {
      navigate("/dashboard");
    }, 500);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.nik || !formData.password) {
      return toast.error("NIK dan password wajib diisi");
    }

    setIsLoading(true);
    setServerError500(false);
    try {
      const response = await api.post("/auth/login", formData);
      const { token, user } = response.data;

      login(user, token);
      toast.success("Login berhasil! Selamat datang di SIDIAS.");

      setTimeout(() => {
        navigate("/dashboard");
      }, 600);
    } catch (error) {
      console.error("Login Error:", error);
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 500 || !error.response) {
        setServerError500(true);
        toast.error("Server API sedang offline atau mengembalikan error 500.");
      } else {
        toast.error(message || "Login gagal, periksa NIK dan password Anda");
      }
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
          className="w-full max-w-md bg-white/90 backdrop-blur-2xl rounded-[36px] shadow-2xl border border-slate-100 p-8 sm:p-10 relative z-10 space-y-5"
        >
          {/* Logo & Brand Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-2xl mx-auto shadow-md shadow-teal-500/20">
              <FaChild />
            </div>

            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                SIDIAS Posyandu
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Sistem Diagnosis Anak Stunting & Gizi Terpadu
              </p>
            </div>
          </div>

          {/* Server Error 500 Alert Banner */}
          {serverError500 && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2 animate-fadeIn">
              <div className="flex items-center gap-2 font-bold text-amber-800">
                <FaExclamationTriangle />
                <span>Koneksi Server Bermasalah (Error 500)</span>
              </div>
              <p className="text-[11px] text-amber-800/90 leading-relaxed">
                Database server API belum aktif atau sedang down. Anda tetap bisa menggunakan seluruh fitur SIDIAS secara penuh dengan Mode Demo.
              </p>
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <FaUserCheck /> Masuk Menggunakan Mode Demo
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Nomor Induk Kependudukan (NIK)
              </label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="text"
                  name="nik"
                  placeholder="Masukkan 16 digit NIK"
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
                  placeholder="Masukkan password Anda"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all bg-slate-50/50"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-teal-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 mt-1"
            >
              {isLoading ? "Memproses..." : "Masuk ke Sistem"}
              <FaArrowRight className="text-xs" />
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="pt-2">
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-3 text-[11px] text-slate-400 font-semibold">ATAU</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full mt-2 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-2"
            >
              <FaUserCheck className="text-teal-600 text-sm" />
              <span>Masuk Cepat Mode Demo (Kader Posyandu)</span>
            </button>
          </div>

          {/* Footer Signup Link */}
          <div className="pt-2 text-center border-t border-slate-100 text-xs text-slate-500">
            Belum memiliki akun kader/orang tua?{" "}
            <Link to="/signup" className="font-extrabold text-teal-600 hover:text-teal-700">
              Daftar Sekarang
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Login;
