import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { createDataBalita, getDataBalitaById } from '../services/dataBalitaService';
import { getAnalisisByDataId } from '../services/analisisService';

const Diagnosis = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const idParam = searchParams.get('id');

  const [formData, setFormData] = useState({
    nama: '',
    jenis_kelamin: 'L',
    tanggal_lahir: '',
    berat_badan: '',
    tinggi_badan: '',
    umur_bulan: '',
    foto: null
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // State untuk Panel Analisis
  const [dataId, setDataId] = useState(null);
  const [analisisLoading, setAnalisisLoading] = useState(false);
  const [analisisResult, setAnalisisResult] = useState(null);
  const [analisisError, setAnalisisError] = useState('');
  
  const pollingInterval = useRef(null);

  // Bersihkan interval saat komponen unmount
  useEffect(() => {
    return () => {
      if (pollingInterval.current) clearInterval(pollingInterval.current);
    };
  }, []);

  // Memuat data dari riwayat jika parameter ID tersedia
  useEffect(() => {
    if (idParam) {
      const loadPreviousData = async () => {
        try {
          setAnalisisLoading(true);
          setAnalisisResult(null);
          setAnalisisError('');
          setDataId(idParam);

          // 1. Ambil data balita
          const balitaRes = await getDataBalitaById(idParam);
          if (balitaRes && balitaRes.success && balitaRes.data) {
            const b = balitaRes.data;
            const formattedDate = b.tanggal_lahir ? new Date(b.tanggal_lahir).toISOString().split('T')[0] : '';
            setFormData({
              nama: b.nama || '',
              jenis_kelamin: b.jenis_kelamin || 'L',
              tanggal_lahir: formattedDate,
              berat_badan: b.berat_badan || '',
              tinggi_badan: b.tinggi_badan || '',
              umur_bulan: b.umur_bulan || '',
              foto: null
            });
          }

          // 2. Ambil data analisis
          const result = await getAnalisisByDataId(idParam);
          if (result && result.data) {
            setAnalisisResult(result.data);
          } else {
            setAnalisisError('Tidak ada data');
          }
        } catch (err) {
          console.error('Error loading previous analysis:', err);
          setAnalisisError('Tidak ada data');
        } finally {
          setAnalisisLoading(false);
        }
      };

      loadPreviousData();
    } else {
      // Jika parameter id kosong, reset state form ke kosong
      setFormData({
        nama: '',
        jenis_kelamin: 'L',
        tanggal_lahir: '',
        berat_badan: '',
        tinggi_badan: '',
        umur_bulan: '',
        foto: null
      });
      setDataId(null);
      setAnalisisResult(null);
      setAnalisisError('');
    }
  }, [idParam]);

  // Fungsi untuk menangani perubahan input
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'foto') {
      setFormData((prev) => ({ ...prev, foto: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const startPollingAnalisis = (id) => {
    setAnalisisLoading(true);
    setAnalisisResult(null);
    setAnalisisError('');
    
    let attempts = 0;
    const maxAttempts = 5; // 5 * 2 detik = 10 detik

    const poll = async () => {
      attempts++;
      try {
        const result = await getAnalisisByDataId(id);
        if (result && result.data) {
          setAnalisisResult(result.data);
          setAnalisisLoading(false);
          clearInterval(pollingInterval.current);
          return;
        }
      } catch (err) {
        // Abaikan error saat polling (misal 404 karena belum ada)
      }
      
      if (attempts >= maxAttempts) {
        setAnalisisError('Tidak ada data');
        setAnalisisLoading(false);
        clearInterval(pollingInterval.current);
      }
    };

    // Polling setiap 2 detik
    pollingInterval.current = setInterval(poll, 2000);
    // Jalankan segera percobaan pertama
    poll();
  };

  // Fungsi untuk mengirim data saat form disubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    setDataId(null);
    setAnalisisResult(null);
    setAnalisisError('');

    try {
      const data = new FormData();
      data.append('nama', formData.nama);
      data.append('jenis_kelamin', formData.jenis_kelamin);
      data.append('tanggal_lahir', formData.tanggal_lahir);
      data.append('berat_badan', formData.berat_badan);
      data.append('tinggi_badan', formData.tinggi_badan);
      data.append('umur_bulan', formData.umur_bulan);
      if (formData.foto) {
        data.append('foto', formData.foto);
      }

      // Mengirim request ke backend
      const response = await createDataBalita(data);
      setMessage({ type: 'success', text: 'Data balita berhasil disimpan!' });
      
      if (response.data && response.data.id) {
        setDataId(response.data.id);
        startPollingAnalisis(response.data.id);
      }

      // Reset form
      setFormData({
        nama: '',
        jenis_kelamin: 'L',
        tanggal_lahir: '',
        berat_badan: '',
        tinggi_badan: '',
        umur_bulan: '',
        foto: null
      });
      // Reset file input
      const fileInput = document.getElementById('foto_upload');
      if (fileInput) fileInput.value = '';

    } catch (error) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan saat menyimpan data.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-100 mt-8 mb-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Input Data Balita</h1>
      
      {idParam && (
        <div className="p-4 mb-6 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-150 flex items-center justify-between">
          <p className="text-sm font-medium">
            🔍 Mode Riwayat: Menampilkan data pemeriksaan sebelumnya.
          </p>
          <button
            onClick={() => setSearchParams({})}
            className="text-xs bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-1.5 px-3 rounded shadow-sm transition duration-300"
          >
            Mulai Input Baru
          </button>
        </div>
      )}

      {message.text && (
        <div className={`p-4 mb-6 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Balita</label>
          <input
            type="text"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            required
            disabled={!!idParam}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-600"
            placeholder="Masukkan nama lengkap"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
            <select
              name="jenis_kelamin"
              value={formData.jenis_kelamin}
              onChange={handleChange}
              disabled={!!idParam}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-600"
            >
              <option value="L">Laki-laki (L)</option>
              <option value="P">Perempuan (P)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label>
            <input
              type="date"
              name="tanggal_lahir"
              value={formData.tanggal_lahir}
              onChange={handleChange}
              required
              disabled={!!idParam}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Berat Badan (kg)</label>
            <input
              type="number"
              step="0.01"
              name="berat_badan"
              value={formData.berat_badan}
              onChange={handleChange}
              required
              disabled={!!idParam}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-600"
              placeholder="Contoh: 12.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tinggi Badan (cm)</label>
            <input
              type="number"
              step="0.01"
              name="tinggi_badan"
              value={formData.tinggi_badan}
              onChange={handleChange}
              required
              disabled={!!idParam}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-600"
              placeholder="Contoh: 85.0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Umur (Bulan)</label>
            <input
              type="number"
              name="umur_bulan"
              value={formData.umur_bulan}
              onChange={handleChange}
              required
              disabled={!!idParam}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-600"
              placeholder="Contoh: 24"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Foto Balita (Opsional)</label>
          <input
            id="foto_upload"
            type="file"
            name="foto"
            accept="image/*"
            onChange={handleChange}
            disabled={!!idParam}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white disabled:bg-gray-100 disabled:text-gray-600"
          />
          <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG. Maksimal 5MB.</p>
        </div>

        {idParam ? (
          <button
            type="button"
            onClick={() => setSearchParams({})}
            className="w-full py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold transition duration-300 shadow-sm"
          >
            Mulai Input Baru
          </button>
        ) : (
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition duration-300 ${
              loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Menyimpan...' : 'Simpan Data'}
          </button>
        )}
      </form>

      {/* PANEL ANALISIS */}
      {dataId && (
        <div className="mt-10 p-6 bg-gray-50 rounded-xl border border-gray-250 transition-all duration-500 ease-in-out">
          {analisisLoading ? (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-blue-700 font-medium">Sedang memproses analisis AI...</p>
              <p className="text-blue-500 text-sm mt-1">Harap tunggu maksimal 10 detik</p>
            </div>
          ) : analisisError ? (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-500 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-gray-600 font-medium text-lg">({analisisError})</p>
              <p className="text-gray-500 text-sm mt-1">Data analisis tidak ditemukan untuk balita ini.</p>
            </div>
          ) : analisisResult ? (
            <div>
              <h2 className="mb-6 text-center text-lg font-bold text-gray-800 tracking-wider">
                HASIL ANALISIS
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    label: 'Status Stunting Bayi',
                    value: analisisResult.status_stunting,
                    sub: analisisResult.status_detail || '-',
                  },
                  {
                    label: 'Tingkat Risiko Stunting',
                    value: analisisResult.tingkat_risiko || '-',
                    sub: analisisResult.tingkat_risiko_detail || '-',
                  },
                  {
                    label: 'Indikator Utama Stunting',
                    value: analisisResult.indikator || '-',
                    sub: analisisResult.indikator_detail || '-',
                  },
                  {
                    label: 'Rekomendasi Tindak Lanjut',
                    value: analisisResult.rekomendasi || '-',
                    sub: analisisResult.rekomendasi_detail || '-',
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-gray-250 bg-white p-4 text-center shadow-sm flex flex-col justify-center min-h-[120px]"
                  >
                    <p className="mb-2 text-xs text-gray-500 font-medium">{item.label}</p>
                    <p className="text-sm font-bold text-gray-800">{item.value}</p>
                    <p className="mt-1 text-xs text-gray-400">{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Diagnosis;