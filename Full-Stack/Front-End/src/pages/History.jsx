import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllDataBalita } from '../services/dataBalitaService';

const History = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [riwayatList, setRiwayatList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getAllDataBalita();
        if (res.success && res.data) {
          setRiwayatList(res.data);
        }
      } catch (err) {
        console.error(err);
        setError('Gagal memuat data riwayat pemeriksaan.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = riwayatList.filter((item) =>
    item.nama.toLowerCase().includes(search.toLowerCase())
  );

  const apiHost = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';

  return (
    <div className="mx-auto max-w-2xl py-4">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Riwayat Pemeriksaan</h2>
          <p className="text-xs text-gray-550 mt-1">
            Terdaftar <span className="font-semibold text-green-600">{riwayatList.length} data</span> balita
          </p>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama balita..."
          className="rounded border border-gray-300 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-green-400 w-full sm:w-64 shadow-sm"
        />
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mb-4"></div>
          <p className="text-gray-500 text-sm">Memuat riwayat...</p>
        </div>
      ) : error ? (
        <div className="py-16 text-center text-sm text-red-500 bg-red-50 rounded-lg border border-red-100">
          {error}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-sm text-gray-400 bg-white rounded-lg border border-gray-200">
          Belum ada data. Tambahkan pemeriksaan baru terlebih dahulu.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/?id=${item.id}`)}
              className="group flex gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md hover:border-green-300 transition-all duration-300 cursor-pointer"
            >
              {/* Photo Thumbnail */}
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                {item.foto_url ? (
                  <img
                    src={`${apiHost}${item.foto_url}`}
                    alt={item.nama}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <svg className="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </div>

              {/* Balita Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-gray-800 text-sm group-hover:text-green-600 transition-colors truncate">
                    {item.nama}
                  </h3>
                  {item.status_stunting && (
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                      item.status_stunting.toLowerCase().includes('stunting') || item.status_stunting.toLowerCase().includes('resiko')
                        ? 'bg-red-50 text-red-700 border border-red-150'
                        : 'bg-green-50 text-green-700 border border-green-150'
                    }`}>
                      {item.status_stunting}
                    </span>
                  )}
                </div>
                
                <p className="text-xs text-gray-500 mt-1">
                  Lahir: {new Date(item.tanggal_lahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} ({item.umur_bulan} Bulan)
                </p>
                <div className="mt-2 flex gap-3 text-xs text-gray-650 font-medium">
                  <span>BB: <strong className="text-gray-800">{item.berat_badan} kg</strong></span>
                  <span className="text-gray-300">|</span>
                  <span>TB: <strong className="text-gray-800">{item.tinggi_badan} cm</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;