import { useState } from 'react';
import { createDataBalita } from '../services/dataBalitaService';

const Diagnosis = () => {
  const [formData, setFormData] = useState({
    nama: '',
    jenis_kelamin: 'L',
    tanggal_lahir: '',
    berat_badan: '',
    tinggi_badan: '',
    umur_bulan: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fungsi untuk menangani perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Fungsi untuk mengirim data saat form disubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Mengirim request ke backend
      const response = await createDataBalita(formData);
      setMessage({ type: 'success', text: 'Data balita berhasil disimpan!' });
      // Reset form
      setFormData({
        nama: '',
        jenis_kelamin: 'L',
        tanggal_lahir: '',
        berat_badan: '',
        tinggi_badan: '',
        umur_bulan: ''
      });
    } catch (error) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan saat menyimpan data.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-100 mt-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Input Data Balita</h1>
      
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Contoh: 24"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold transition duration-300 ${
            loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Menyimpan...' : 'Simpan Data'}
        </button>
      </form>
    </div>
  );
};

export default Diagnosis;