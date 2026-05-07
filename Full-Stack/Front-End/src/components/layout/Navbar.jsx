// src/components/layout/Navbar.jsx
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="bg-gray-100 border-b border-gray-200">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-gray-400" />
          <span className="font-bold text-gray-800">SIDIAS</span>
        </div>

        {/* Nav Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/')}
            className={`rounded px-4 py-1.5 text-sm font-medium transition-all ${
              location.pathname === '/'
                ? 'bg-green-400 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            + Input Data
          </button>
          <button
            onClick={() => navigate('/history')}
            className={`rounded px-4 py-1.5 text-sm font-medium transition-all ${
              location.pathname === '/history'
                ? 'bg-green-400 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            Riwayat
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;