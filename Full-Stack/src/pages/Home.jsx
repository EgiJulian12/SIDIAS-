// src/pages/Home.jsx
import { useState } from 'react';

const Home = () => {
  const [formData, setFormData] = useState({
    nama: '',
    umur: '',
    jenisKelamin: 'laki',
    beratBadan: '',
    tinggiBadan: '',
  });
  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [hasil, setHasil] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFoto(file);
    setFotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    // Nanti disambungkan ke API
    // Sementara pakai dummy hasil
    setHasil({
      statusStunting: 'Beresiko',
      tingkatRisiko: 'Sedang',
      indikatorUtama: 'Berat Badan Kurang',
      rekomendasi: 'Perbaiki Asupan',
      detail: {
        stunting: 'Stunting',
        risikoPersen: '70% dari total indikasi',
        beratInfo: 'Berat < 7Kg',
        rekomendasiDetail: 'atau langsung ke dokter',
      },
    });
  };

  return (
    <div className="mx-auto max-w-2xl py-4">
      {/* Data Diri Balita */}
      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold text-gray-700">
          Data Diri Balita
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-600">Nama</label>
            <input
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              className="rounded border border-gray-300 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-600">Umur</label>
            <input
              name="umur"
              type="date"
              value={formData.umur}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              className="rounded border border-gray-300 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        </div>

        {/* Jenis Kelamin */}
        <div className="mt-3">
          <label className="text-xs font-medium text-green-600">
            Jenis Kelamin
          </label>
          <div className="mt-1 flex gap-4">
            <label className="flex items-center gap-1.5 text-sm text-gray-700">
              <input
                type="radio"
                name="jenisKelamin"
                value="laki"
                checked={formData.jenisKelamin === 'laki'}
                onChange={handleChange}
                className="accent-green-600"
              />
              Laki-Laki
            </label>
            <label className="flex items-center gap-1.5 text-sm text-gray-700">
              <input
                type="radio"
                name="jenisKelamin"
                value="perempuan"
                checked={formData.jenisKelamin === 'perempuan'}
                onChange={handleChange}
                className="accent-green-600"
              />
              Perempuan
            </label>
          </div>
        </div>
      </section>

      {/* Metode Pengukuran */}
      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold text-gray-700">
          Metode Pengukuran
        </h2>

        {/* Upload Foto */}
        <label className="flex cursor-pointer flex-col items-center justify-center rounded border border-gray-300 bg-gray-50 py-8 hover:bg-gray-100">
          {fotoPreview ? (
            <img
              src={fotoPreview}
              alt="preview"
              className="h-32 w-32 rounded object-cover"
            />
          ) : (
            <span className="text-sm text-gray-500">Ambil Gambar</span>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFoto}
          />
        </label>

        {/* Berat & Tinggi */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-600">Berat Badan (kg)</label>
            <input
              name="beratBadan"
              type="number"
              value={formData.beratBadan}
              onChange={handleChange}
              className="rounded border border-gray-300 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-600">Tinggi Badan (cm)</label>
            <input
              name="tinggiBadan"
              type="number"
              value={formData.tinggiBadan}
              onChange={handleChange}
              className="rounded border border-gray-300 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        </div>
      </section>

      {/* Simpan Data */}
      <button
        onClick={handleSubmit}
        className="w-full rounded border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Simpan Data
      </button>

      {/* Hasil Analisis */}
      {hasil && (
        <section className="mt-8">
          <h2 className="mb-4 text-center text-base font-bold text-gray-800">
            HASIL ANALISIS
          </h2>
          <div className="grid grid-cols-4 gap-3">
            {[
              {
                label: 'Status Stunting Bayi',
                value: hasil.statusStunting,
                sub: hasil.detail.stunting,
              },
              {
                label: 'Tingkat Risiko Stunting',
                value: hasil.tingkatRisiko,
                sub: hasil.detail.risikoPersen,
              },
              {
                label: 'Indikator Utama Stunting',
                value: hasil.indikatorUtama,
                sub: hasil.detail.beratInfo,
              },
              {
                label: 'Rekomendasi Tindak Lanjut',
                value: hasil.rekomendasi,
                sub: hasil.detail.rekomendasiDetail,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded border border-gray-200 bg-white p-3 text-center shadow-sm"
              >
                <p className="mb-2 text-xs text-gray-500">{item.label}</p>
                <p className="text-sm font-bold text-gray-800">{item.value}</p>
                <p className="mt-1 text-xs text-gray-400">{item.sub}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;