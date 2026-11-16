import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaHeartbeat,
  FaHistory,
  FaUtensils,
  FaTimes,
  FaShieldAlt,
  FaChild
} from "react-icons/fa";

const menus = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <FaHome />,
    badge: null
  },
  {
    name: "Skrining Anak",
    path: "/diagnosis",
    icon: <FaHeartbeat />,
    badge: "AI Dual"
  },
  {
    name: "Riwayat Rekam",
    path: "/history",
    icon: <FaHistory />,
    badge: null
  },
  {
    name: "Panduan Gizi & MPASI",
    path: "/nutriguide",
    icon: <FaUtensils />,
    badge: "Baru"
  },
];

const SidebarContent = ({ setIsSidebarOpen }) => (
  <div className="w-full h-full bg-white/90 backdrop-blur-2xl border border-slate-100 shadow-xl rounded-r-[36px] lg:rounded-[36px] p-6 flex flex-col justify-between">
    <div>
      {/* Brand Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-xl shadow-md">
            <FaChild />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">SIDIAS</h2>
            <p className="text-[11px] text-teal-700 font-semibold">Posyandu & Gizi Anak</p>
          </div>
        </div>

        {/* Mobile Close Button */}
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
        >
          <FaTimes />
        </button>
      </div>

      {/* Navigation Menus */}
      <nav className="space-y-1.5">
        {menus.map((menu) => (
          <NavLink
            key={menu.path}
            to={menu.path}
            onClick={() => setIsSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-xs transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-md shadow-teal-500/20"
                  : "text-slate-600 hover:bg-teal-50/60 hover:text-teal-700"
              }`
            }
          >
            <div className="flex items-center gap-3">
              <span className="text-base">{menu.icon}</span>
              <span>{menu.name}</span>
            </div>
            {menu.badge && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-white/20 text-white border border-white/30">
                {menu.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </div>

    {/* Bottom Posyandu Support Card */}
    <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 border border-teal-100 text-slate-700 space-y-2 mt-6">
      <div className="flex items-center gap-2 text-teal-800 font-bold text-xs">
        <FaShieldAlt className="text-sm" />
        <span>Pencegahan Stunting</span>
      </div>
      <p className="text-[11px] text-slate-600 leading-relaxed">
        1000 Hari Pertama Kehidupan (HPK) adalah masa emas pencegahan stunting permanen.
      </p>
      <div className="pt-1 flex items-center justify-between text-[10px] text-teal-700 font-bold">
        <span>Buku KIA & KMS</span>
        <span>Kemenkes RI</span>
      </div>
    </div>
  </div>
);

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block fixed left-6 top-6 bottom-6 w-64 z-40">
        <SidebarContent setIsSidebarOpen={setIsSidebarOpen} />
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 animate-fadeIn"
        />
      )}

      {/* Mobile Drawer Panel */}
      <aside
        className={`lg:hidden fixed left-0 top-0 bottom-0 w-72 z-50 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent setIsSidebarOpen={setIsSidebarOpen} />
      </aside>
    </>
  );
};

export default Sidebar;
