import { useState, useEffect, useRef } from "react";
import {
  FaBell,
  FaCheckCircle,
  FaHeartbeat,
  FaInfoCircle,
  FaExclamationCircle,
  FaCalculator,
  FaUserCircle,
  FaSignOutAlt,
  FaBars
} from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import QuickCalculatorModal from "../common/QuickCalculatorModal";

const Navbar = ({ setIsSidebarOpen }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [openNotif, setOpenNotif] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openCalculator, setOpenCalculator] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const storedNotif = JSON.parse(localStorage.getItem("sidias_notifications")) || [];
    if (storedNotif.length === 0) {
      const dummyNotif = [
        {
          id: 1,
          title: "Sistem AI Siap Digunakan",
          message: "SIDIAS kini dilengkapi rekomendasi nutrisi adaptif & kurva KMS Digital WHO.",
          type: "success",
          time: "Hari ini",
          read: false,
        },
        {
          id: 2,
          title: "Pengingat Posyandu",
          message: "Jadwal penimbangan balita dan vitamin A Posyandu rutin bulan ini.",
          type: "info",
          time: "Kemarin",
          read: false,
        },
      ];
      localStorage.setItem("sidias_notifications", JSON.stringify(dummyNotif));
      setNotifications(dummyNotif);
    } else {
      setNotifications(storedNotif);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setOpenNotif(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setOpenProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem("sidias_notifications", JSON.stringify(updated));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const displayName = user?.name || user?.nik || "Kader Posyandu";
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <>
      <header className="w-full flex items-center justify-between py-4 px-4 md:px-8 bg-white/70 backdrop-blur-xl border-b border-slate-100/80 sticky top-0 z-30">
        {/* Left: Mobile hamburger & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="lg:hidden w-10 h-10 rounded-2xl bg-white shadow-sm border border-slate-200/60 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <FaBars className="text-base" />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              SIDIAS <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-teal-50 text-teal-700 border border-teal-200/60">Healthcare</span>
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block">
              Sistem Diagnosis Stunting & Pelayanan Gizi Terpadu
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Calculator Shortcut */}
          <button
            onClick={() => setOpenCalculator(true)}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold border border-teal-200/80 transition-all shadow-sm"
          >
            <FaCalculator />
            <span>Kalkulator Cepat</span>
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setOpenNotif(!openNotif)}
              className="relative w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-white shadow-sm border border-slate-200/60 flex items-center justify-center text-slate-600 hover:text-teal-600 hover:border-teal-200 transition-all"
            >
              <FaBell className="text-base" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center shadow-md animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {openNotif && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-fadeIn">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <h3 className="font-bold text-slate-800 text-sm">Notifikasi</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs font-semibold text-teal-600 hover:text-teal-700"
                    >
                      Tandai Dibaca
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-4 transition-colors ${n.read ? "bg-white" : "bg-teal-50/40"}`}
                    >
                      <div className="flex gap-3 items-start">
                        <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center flex-shrink-0 text-sm mt-0.5">
                          <FaCheckCircle />
                        </div>
                        <div className="flex-1 text-xs">
                          <p className="font-bold text-slate-800">{n.title}</p>
                          <p className="text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                          <p className="text-[10px] text-slate-400 mt-2">{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          {isAuthenticated ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setOpenProfile(!openProfile)}
                className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/60 shadow-sm transition-all"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                  {userInitial}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-bold text-slate-800 truncate max-w-[110px]">{displayName}</p>
                  <p className="text-[10px] text-teal-600 font-medium capitalize">{user?.role || "Kader"}</p>
                </div>
              </button>

              {/* Profile Dropdown */}
              {openProfile && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-3xl shadow-2xl border border-slate-100 py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800">{displayName}</p>
                    <p className="text-[11px] text-slate-400 truncate">NIK: {user?.nik || '-'}</p>
                  </div>
                  <button
                    onClick={() => {
                      setOpenProfile(false);
                      setOpenCalculator(true);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors font-medium sm:hidden"
                  >
                    <FaCalculator className="text-teal-600" />
                    Kalkulator Z-Score
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors font-bold"
                  >
                    <FaSignOutAlt />
                    Keluar (Logout)
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white text-xs font-bold shadow-md transition-all"
            >
              Masuk
            </button>
          )}
        </div>
      </header>

      {/* Quick Calculator Modal */}
      <QuickCalculatorModal
        isOpen={openCalculator}
        onClose={() => setOpenCalculator(false)}
      />
    </>
  );
};

export default Navbar;
