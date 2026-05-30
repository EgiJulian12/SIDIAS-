import {
  FaHeartbeat,
  FaInstagram,
  FaFacebook,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  // HANDLE PROTECTED ROUTE
  const handleProtectedNavigation = (path) => {
    const isLogin = localStorage.getItem("sidias_login");

    if (!isLogin) {
      return navigate("/login");
    }

    navigate(path);
  };

  return (
    <footer className="mt-16">

      {/* MAIN FOOTER */}
      <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-teal-500 via-cyan-500 to-sky-500 p-10 md:p-14 shadow-[0_20px_80px_rgba(0,0,0,0.15)]">

        {/* BLUR EFFECT */}
        <div className="absolute top-0 right-0 w-[320px] h-[320px] bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* BRAND */}
          <div>

            <div className="flex items-center gap-4">

              <div className="w-16 h-16 rounded-3xl bg-white/15 backdrop-blur-xl flex items-center justify-center text-white text-3xl shadow-xl">
                <FaHeartbeat />
              </div>

              <div>

                <h1 className="text-3xl font-black text-white">
                  SIDIAS
                </h1>

                <p className="text-white/80 mt-1">
                  Sistem Deteksi Stunting Anak
                </p>
              </div>
            </div>

            <p className="text-white/80 leading-relaxed mt-8 max-w-md">
              Platform pelayanan kesehatan posyandu modern untuk membantu kader dan orang tua memantau pertumbuhan anak secara cepat, aman, dan informatif.
            </p>

            {/* SOCIAL */}
            <div className="flex items-center gap-4 mt-8">

              <button className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-xl text-white flex items-center justify-center hover:scale-110 transition-all">
                <FaInstagram />
              </button>

              <button className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-xl text-white flex items-center justify-center hover:scale-110 transition-all">
                <FaFacebook />
              </button>

              <button className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-xl text-white flex items-center justify-center hover:scale-110 transition-all">
                <FaEnvelope />
              </button>
            </div>
          </div>

          {/* NAVIGATION */}
          <div>

            <h2 className="text-2xl font-bold text-white mb-6">
              Navigasi
            </h2>

            <div className="space-y-4">

              {/* DASHBOARD */}
              <button
                onClick={() => navigate("/")}
                className="block text-white/80 hover:text-white transition-all text-left"
              >
                Dashboard
              </button>

              {/* PEMERIKSAAN */}
              <button
                onClick={() =>
                  handleProtectedNavigation("/diagnosis")
                }
                className="block text-white/80 hover:text-white transition-all text-left"
              >
                Pelayanan
              </button>

              {/* RIWAYAT */}
              <button
                onClick={() =>
                  handleProtectedNavigation("/history")
                }
                className="block text-white/80 hover:text-white transition-all text-left"
              >
                Riwayat
              </button>


              {/* LOGIN */}
              {!localStorage.getItem("sidias_login") && (
                <button
                  onClick={() => navigate("/login")}
                  className="block text-white/80 hover:text-white transition-all text-left"
                >
                  Login
                </button>
              )}
            </div>
          </div>

          {/* CONTACT */}
          <div>

            <h2 className="text-2xl font-bold text-white mb-6">
              Kontak
            </h2>

            <div className="space-y-5">

              {/* LOCATION */}
              <div className="flex items-start gap-4">

                <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-xl text-white flex items-center justify-center">
                  <FaMapMarkerAlt />
                </div>

                <div>

                  <h3 className="text-white font-semibold">
                    Lokasi
                  </h3>

                  <p className="text-white/80 mt-1 leading-relaxed">
                    Posyandu Indonesia Healthcare Center
                  </p>
                </div>
              </div>

              {/* PHONE */}
              <div className="flex items-start gap-4">

                <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-xl text-white flex items-center justify-center">
                  <FaPhoneAlt />
                </div>

                <div>

                  <h3 className="text-white font-semibold">
                    Telepon
                  </h3>

                  <p className="text-white/80 mt-1">
                    +62 812-3456-7890
                  </p>
                </div>
              </div>

              {/* EMAIL */}
              <div className="flex items-start gap-4">

                <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-xl text-white flex items-center justify-center">
                  <FaEnvelope />
                </div>

                <div>

                  <h3 className="text-white font-semibold">
                    Email
                  </h3>

                  <p className="text-white/80 mt-1">
                    sidiashealthcare@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-white/70 text-sm text-center md:text-left">
            © 2026 SIDIAS Healthcare. All rights reserved.
          </p>

          <p className="text-white/70 text-sm text-center md:text-right">
            Designed for Posyandu & Child Healthcare Monitoring
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;