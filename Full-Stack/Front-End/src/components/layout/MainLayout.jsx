import { useState } from "react";
import Sidebar from "../ui/Sidebar";
import Navbar from "../ui/Navbar";
import { NavLink } from "react-router-dom";
import { FaHome, FaHeartbeat, FaHistory, FaUtensils } from "react-icons/fa";

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const bottomNavItems = [
    { name: "Beranda", path: "/dashboard", icon: <FaHome /> },
    { name: "Skrining", path: "/diagnosis", icon: <FaHeartbeat /> },
    { name: "Riwayat", path: "/history", icon: <FaHistory /> },
    { name: "Gizi MPASI", path: "/nutriguide", icon: <FaUtensils /> },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 relative selection:bg-teal-100 selection:text-teal-800">
      {/* Decorative ambient background blurs */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-teal-200/25 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-emerald-100/35 blur-3xl rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none" />

      {/* Sidebar Component */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="lg:ml-72 min-h-screen flex flex-col relative z-10 pb-20 lg:pb-8">
        <Navbar setIsSidebarOpen={setIsSidebarOpen} />

        <main className="flex-1 px-4 py-6 md:px-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Thumb Friendly) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200/70 py-2 px-6 z-40 flex items-center justify-around shadow-lg">
        {bottomNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-[10px] font-bold transition-colors py-1 ${
                isActive ? "text-teal-600 font-extrabold" : "text-slate-500 hover:text-slate-800"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default MainLayout;
