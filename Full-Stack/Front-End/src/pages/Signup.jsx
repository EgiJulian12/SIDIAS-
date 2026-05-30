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
} from "react-icons/fa";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nik: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (
      !formData.nik ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      return toast.error("Semua field wajib diisi");
    }

    if (formData.nik.length < 16) {
      return toast.error("NIK harus minimal 16 digit");
    }

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Password dan konfirmasi password tidak cocok");
    }

    try {
      await api.post("/auth/register", {
        nik: formData.nik,
        password: formData.password,
      });

      toast.success("Akun berhasil dibuat. Silakan login.");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      const message = error.response?.data?.message || "Registrasi gagal";
      toast.error(message);
    }
  };

  return (
    <>
      <Toaster position="top-right" />

      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-sky-100 flex items-center justify-center p-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[40px] shadow-2xl border border-white/40 p-8"
        >

          {/* LOGO */}
          <div className="text-center mb-8">

            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white text-4xl mx-auto shadow-xl">
              <FaHeartbeat />
            </div>

            <h1 className="text-4xl font-bold text-slate-800 mt-6">
              Buat Akun
            </h1>

            <p className="text-slate-500 mt-3">
              Daftar untuk menggunakan SIDIAS
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSignup} className="space-y-5">

            {/* NIK */}
            <div>

              <label className="text-slate-700 font-semibold block mb-2">
                NIK (16 Digit)
              </label>

              <div className="relative">

                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  name="nik"
                  placeholder="Masukkan NIK Anda"
                  value={formData.nik}
                  onChange={handleChange}
                  maxLength={16}
                  className="w-full h-14 rounded-2xl border border-slate-200 bg-white px-12 outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>

              <label className="text-slate-700 font-semibold block mb-2">
                Password
              </label>

              <div className="relative">

                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  type="password"
                  name="password"
                  placeholder="Masukkan password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full h-14 rounded-2xl border border-slate-200 bg-white px-12 outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div>

              <label className="text-slate-700 font-semibold block mb-2">
                Konfirmasi Password
              </label>

              <div className="relative">

                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Ulangi password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full h-14 rounded-2xl border border-slate-200 bg-white px-12 outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-teal-400 to-cyan-500 text-white font-bold text-lg shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
            >
              Daftar
              <FaArrowRight />
            </button>
          </form>

          {/* FOOTER */}
          <p className="text-center text-slate-500 mt-8">
            Sudah punya akun?
            <Link
              to="/login"
              className="text-teal-600 font-bold ml-2"
            >
              Login
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default Signup;