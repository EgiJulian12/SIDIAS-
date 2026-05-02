// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Diagnosis from './pages/Diagnosis';
import History from './pages/History';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Semua halaman yang pakai Navbar & Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/diagnosis" element={<Diagnosis />} />
          <Route path="/history" element={<History />} />
        </Route>

        {/* Halaman 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;