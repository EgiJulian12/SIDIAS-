import { useState } from "react";

import Sidebar from "../ui/Sidebar";
import Navbar from "../ui/Navbar";

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f4fbfb] relative overflow-hidden">

      {/* Background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-teal-300/20 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2" />

      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-300/20 blur-3xl rounded-full translate-x-1/3 translate-y-1/3" />

      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main */}
      <div className="lg:ml-72 min-h-screen flex flex-col relative z-10">

        {/* Navbar */}
        <Navbar
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Content */}
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;