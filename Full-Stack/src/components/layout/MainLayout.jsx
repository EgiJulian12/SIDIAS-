// src/components/layout/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

// Outlet = placeholder, diisi oleh halaman yang aktif
const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 px-4 py-6 md:px-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;