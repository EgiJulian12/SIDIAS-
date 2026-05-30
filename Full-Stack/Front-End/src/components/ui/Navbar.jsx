import { useState, useEffect, useRef } from "react";

import {
  FaBell,
  FaCheckCircle,
  FaHeartbeat,
  FaInfoCircle,
  FaExclamationCircle,
} from "react-icons/fa";

const Navbar = () => {
  const [openNotif, setOpenNotif] = useState(false);

  const notifRef = useRef(null);

  const [notifications, setNotifications] = useState([]);

  // LOAD NOTIF
  useEffect(() => {
    const storedNotif =
      JSON.parse(localStorage.getItem("sidias_notifications")) || [];

    if (storedNotif.length === 0) {
      const dummyNotif = [
        {
          id: 1,
          title: "Pemeriksaan Berhasil",
          message:
            "Data pemeriksaan anak berhasil disimpan ke riwayat.",
          type: "success",
          time: "Baru saja",
          read: false,
        },
        {
          id: 2,
          title: "Reminder Posyandu",
          message:
            "Jangan lupa lakukan pemeriksaan rutin bulan ini.",
          type: "info",
          time: "1 jam lalu",
          read: false,
        },
      ];

      localStorage.setItem(
        "sidias_notifications",
        JSON.stringify(dummyNotif)
      );

      setNotifications(dummyNotif);
    } else {
      setNotifications(storedNotif);
    }
  }, []);

  // CLOSE NOTIF SAAT KLIK LUAR
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target)
      ) {
        setOpenNotif(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // MARK ALL READ
  const markAllAsRead = () => {
    const updatedNotif = notifications.map((item) => ({
      ...item,
      read: true,
    }));

    setNotifications(updatedNotif);

    localStorage.setItem(
      "sidias_notifications",
      JSON.stringify(updatedNotif)
    );
  };

  const unreadCount = notifications.filter(
    (item) => !item.read
  ).length;

  // ICON
  const renderIcon = (type) => {
    switch (type) {
      case "success":
        return (
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <FaCheckCircle />
          </div>
        );

      case "health":
        return (
          <div className="w-11 h-11 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center">
            <FaHeartbeat />
          </div>
        );

      default:
        return (
          <div className="w-11 h-11 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
            <FaInfoCircle />
          </div>
        );
    }
  };

  return (
    <div className="w-full flex items-center justify-between mt-8 mb-3 px-2 md:px-4">

      {/* LEFT */}
      <div className="ml-2 md:ml-4">

        <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
          Dashboard SIDIAS
        </h1>

        <p className="text-slate-500 mt-1 text-sm md:text-base">
          Sistem Deteksi Stunting Anak
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3 md:gap-4">

        {/* NOTIFICATION */}
        <div className="relative" ref={notifRef}>

          <button
            onClick={() => setOpenNotif(!openNotif)}
            className="relative w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white shadow-lg border border-slate-100 flex items-center justify-center text-slate-700 hover:scale-105 transition-all"
          >
            <FaBell className="text-lg md:text-xl" />

            {/* BADGE */}
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 min-w-[22px] h-5 px-1 rounded-full bg-red-500 text-white text-[11px] flex items-center justify-center font-bold shadow-lg">
                {unreadCount}
              </div>
            )}
          </button>

          {/* DROPDOWN */}
          {openNotif && (
            <div className="absolute right-0 mt-4 w-[360px] bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden z-[999]">

              {/* HEADER */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">

                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    Notifikasi
                  </h2>

                  <p className="text-slate-500 text-sm mt-1">
                    Informasi pelayanan & kesehatan
                  </p>
                </div>

                {notifications.length > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm font-semibold text-teal-600 hover:text-teal-700"
                  >
                    Tandai Dibaca
                  </button>
                )}
              </div>

              {/* CONTENT */}
              <div className="max-h-[450px] overflow-y-auto">

                {notifications.length === 0 ? (
                  <div className="p-10 text-center">

                    <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-3xl text-slate-400 mb-5">
                      <FaExclamationCircle />
                    </div>

                    <h3 className="text-xl font-bold text-slate-700">
                      Belum Ada Notifikasi
                    </h3>

                    <p className="text-slate-500 mt-2">
                      Informasi terbaru akan muncul di sini.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 space-y-4">

                    {notifications.map((item) => (
                      <div
                        key={item.id}
                        className={`rounded-3xl p-5 border transition-all ${item.read
                            ? "bg-slate-50 border-slate-100"
                            : "bg-teal-50 border-teal-100"
                          }`}
                      >

                        <div className="flex gap-4">

                          {renderIcon(item.type)}

                          <div className="flex-1">

                            <div className="flex items-start justify-between gap-3">

                              <h3 className="font-bold text-slate-800 text-base leading-tight">
                                {item.title}
                              </h3>

                              {!item.read && (
                                <div className="w-3 h-3 rounded-full bg-teal-500 mt-1"></div>
                              )}
                            </div>

                            <p className="text-slate-600 mt-2 leading-relaxed text-sm">
                              {item.message}
                            </p>

                            <p className="text-xs text-slate-400 mt-3">
                              {item.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* PROFILE / LOGIN */}
        {localStorage.getItem("sidias_login") ? (

          <div className="hidden md:flex items-center gap-3 bg-white px-4 py-2 rounded-2xl shadow-lg border border-slate-100">

            {/* AVATAR */}
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 text-white flex items-center justify-center font-bold text-base shadow-md">
              {JSON.parse(localStorage.getItem("sidias_user"))?.name?.charAt(0) || "U"}
            </div>

            {/* TEXT */}
            <div className="leading-tight">

              <h3 className="font-bold text-slate-800 text-base">
                {JSON.parse(localStorage.getItem("sidias_user"))?.name || "User"}
              </h3>

              <p className="text-sm text-slate-500">
                SIDIAS Healthcare
              </p>
            </div>

            {/* LOGOUT */}
            <button
              onClick={() => {
                localStorage.removeItem("sidias_login");

                window.location.reload();
              }}
              className="ml-2 text-sm font-semibold text-red-500 hover:text-red-600"
            >
              Logout
            </button>
          </div>

        ) : (

          <button
            onClick={() => window.location.href = "/login"}
            className="hidden md:flex items-center justify-center h-12 px-6 rounded-2xl bg-gradient-to-r from-teal-400 to-cyan-500 text-white font-semibold shadow-lg hover:scale-105 transition-all"
          >
            Login
          </button>

        )}
      </div>
    </div>
  );
};

export default Navbar;