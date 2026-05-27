import { useState } from "react";

import { motion } from "framer-motion";

import { Link, useNavigate } from "react-router-dom";

import toast, { Toaster } from "react-hot-toast";

import {
  FaHeartbeat,
  FaEnvelope,
  FaLock,
  FaArrowRight,
} from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return toast.error("Semua field wajib diisi");
    }

    // SIMULASI LOGIN
    localStorage.setItem("sidias_login", true);

    localStorage.setItem(
      "sidias_user",
      JSON.stringify({
        email: formData.email,
      })
    );

    toast.success("Login berhasil");

    setTimeout(() => {
      navigate("/");
    }, 1500);
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
              SIDIAS
            </h1>

            <p className="text-slate-500 mt-3">
              Sistem Deteksi Stunting Anak
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleLogin} className="space-y-5">

            {/* EMAIL */}
            <div>

              <label className="text-slate-700 font-semibold block mb-2">
                Email
              </label>

              <div className="relative">

                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  type="email"
                  name="email"
                  placeholder="Masukkan email"
                  value={formData.email}
                  onChange={handleChange}
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

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-teal-400 to-cyan-500 text-white font-bold text-lg shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
            >
              Login
              <FaArrowRight />
            </button>
          </form>

          {/* FOOTER */}
          <p className="text-center text-slate-500 mt-8">
            Belum punya akun?
            <Link
              to="/signup"
              className="text-teal-600 font-bold ml-2"
            >
              Daftar
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default Login;