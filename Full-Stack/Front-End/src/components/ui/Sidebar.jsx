import { NavLink } from "react-router-dom";

import {
  FaHome,
  FaHeartbeat,
  FaHistory,
  FaClipboardList,
  FaTimes,
} from "react-icons/fa";

import { motion, AnimatePresence } from "framer-motion";

const menus = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <FaHome />,
  },
  {
    name: "Pelayanan",
    path: "/diagnosis",
    icon: <FaHeartbeat />,
  },
  {
    name: "Riwayat",
    path: "/history",
    icon: <FaHistory />,
  },
];

const SidebarContent = ({ setIsSidebarOpen }) => (
  <div className="w-full h-full bg-white/85 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-[32px] p-6 flex flex-col">

    {/* Top */}
    <div className="flex items-center justify-between mb-10">

      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white text-2xl shadow-lg">
          <FaClipboardList />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            SIDIAS
          </h1>

          <p className="text-sm text-slate-500">
            Sistem Diagnosis Anak Stunting
          </p>
        </div>
      </div>

      {/* Close Mobile */}
      <button
        onClick={() => setIsSidebarOpen(false)}
        className="lg:hidden w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600"
      >
        <FaTimes />
      </button>
    </div>

    {/* Menu */}
    <nav className="flex flex-col gap-3">

      {menus.map((menu) => (
        <NavLink
          key={menu.path}
          to={menu.path}
          onClick={() => setIsSidebarOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-medium ${
              isActive
                ? "bg-gradient-to-r from-teal-400 to-cyan-500 text-white shadow-lg"
                : "text-slate-600 hover:bg-teal-50"
            }`
          }
        >
          <span className="text-xl">
            {menu.icon}
          </span>

          <span>
            {menu.name}
          </span>
        </NavLink>
      ))}
    </nav>

    {/* Bottom Card */}
    <div className="mt-auto">

      <div className="rounded-[28px] bg-gradient-to-br from-teal-400 to-cyan-500 p-6 text-white shadow-xl relative overflow-hidden">

        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-3">
            Posyandu Sehat
          </h3>

          <p className="text-sm leading-relaxed text-white/90">
            Membantu kader dan orang tua memantau perkembangan anak dengan lebih mudah dan modern.
          </p>
        </div>
      </div>
    </div>
  </div>
);

const Sidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-72 p-5 z-50">
        <SidebarContent setIsSidebarOpen={setIsSidebarOpen} />
      </aside>

      {/* Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ duration: 0.3 }}
              className="fixed left-0 top-0 h-screen w-72 p-5 z-50 lg:hidden"
            >
              <SidebarContent
                setIsSidebarOpen={setIsSidebarOpen}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;