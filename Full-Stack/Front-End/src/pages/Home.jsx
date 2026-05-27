import { useState } from 'react';
import { User, Calendar, Scale, Ruler, Camera, BarChart3 } from 'lucide-react';

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
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
        
        {/* Header Visual */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-6 text-white text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">SIDIAS</h1>
          <p className="text-emerald-50/90 text-sm sm:text-base mt-1 font-medium">Asisten Cerdas Cek Risiko Stunting Buah Hati</p>
        </div>

        <div className="p-6 sm:p-10 space-y-8">
          {/* SEKSI 1: Data Diri Balita */}
          <section className="space-y-5">
            <h2 className="text-lg font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-emerald-500 rounded-full inline-block"></span>
              Data Diri Balita
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-base font-semibold text-slate-600">Nama</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                    <User size={18} />
                  </span>
                  <input
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none text-base font-medium shadow-inner transition-all"
                    placeholder="Nama anak"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-base font-semibold text-slate-600">Tanggal Lahir</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                    <Calendar size={18} />
                  </span>
                  <input
                    name="umur"
                    type="date"
                    value={formData.umur}
                    onChange={handleChange}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none text-base font-medium transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Pilihan Jenis Kelamin Custom (Bukan Radio Default Kecil) */}
            <div className="space-y-2">
              <label className="text-base font-bold text-emerald-600 block">Jenis Kelamin</label>
              <div className="grid grid-cols-2 gap-4 h-[50px]">
                <label className={`flex items-center justify-center gap-2 border-2 rounded-2xl cursor-pointer text-base font-bold transition-all ${
                  formData.jenisKelamin === 'laki'
                    ? 'border-emerald-500 bg-emerald-50/30 text-emerald-700 shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}>
                  <input
                    type="radio"
                    name="jenisKelamin"
                    value="laki"
                    checked={formData.jenisKelamin === 'laki'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span>👦 Laki-Laki</span>
                </label>
                <label className={`flex items-center justify-center gap-2 border-2 rounded-2xl cursor-pointer text-base font-bold transition-all ${
                  formData.jenisKelamin === 'perempuan'
                    ? 'border-emerald-500 bg-emerald-50/30 text-emerald-700 shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}>
                  <input
                    type="radio"
                    name="jenisKelamin"
                    value="perempuan"
                    checked={formData.jenisKelamin === 'perempuan'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span>👧 Perempuan</span>
                </label>
              </div>
            </div>
          </section>

          {/* SEKSI 2: Metode Pengukuran */}
          <section className="space-y-5">
            <h2 className="text-lg font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-emerald-500 rounded-full inline-block"></span>
              Metode Pengukuran
            </h2>

            {/* Kotak Ambil Gambar */}
            <label className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 hover:border-emerald-400 bg-slate-50/50 hover:bg-emerald-50/10 py-6 px-4 transition-all text-center min-h-[150px]">
              {fotoPreview ? (
                <div className="relative">
                  <img
                    src={fotoPreview}
                    alt="preview"
                    className="h-32 w-32 rounded-2xl object-cover border-4 border-white shadow-md"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-lg shadow">
                    <Camera size={14} />
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 group-hover:text-emerald-500 group-hover:scale-105 shadow-sm border transition-all">
                    <Camera size={22} />
                  </div>
                  <span className="mt-2.5 text-base font-bold text-slate-700 group-hover:text-emerald-600">Ambil Gambar / Foto Balita</span>
                  <span className="text-xs text-slate-400 mt-0.5">Ketuk di sini untuk upload atau memotret langsung</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFoto}
              />
            </label>

            {/* Input Berat & Tinggi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-base font-semibold text-slate-600">Berat Badan (kg)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                    <Scale size={18} />
                  </span>
                  <input
                    name="beratBadan"
                    type="number"
                    value={formData.beratBadan}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none text-base font-semibold shadow-inner"
                    placeholder="0.0"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-base font-semibold text-slate-600">Tinggi Badan (cm)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                    <Ruler size={18} />
                  </span>
                  <input
                    name="tinggiBadan"
                    type="number"
                    value={formData.tinggiBadan}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none text-base font-semibold shadow-inner"
                    placeholder="0.0"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Tombol Aksi Simpan */}
          <button
            onClick={handleSubmit}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:scale-[0.99] text-white text-lg font-bold rounded-2xl shadow-xl shadow-emerald-500/20 transition-all duration-200"
          >
            Simpan & Analisis Data
          </button>
        </div>
      </div>

      {/* HASIL ANALISIS (Kombinasi Elegan Dark-Dashboard) */}
      {hasil && (
        <section className="mt-8 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 animate-fadeIn">
          <div className="text-center mb-6 border-b border-slate-800 pb-4 flex flex-col items-center justify-center">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl mb-2">
              <BarChart3 size={24} />
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-wide text-emerald-400 uppercase">
              Hasil Analisis Stunting
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Status Stunting Bayi', value: hasil.statusStunting, sub: hasil.detail.stunting, bg: 'border-rose-500/30 bg-rose-500/5' },
              { label: 'Tingkat Risiko Stunting', value: hasil.tingkatRisiko, sub: hasil.detail.risikoPersen, bg: 'border-amber-500/30 bg-amber-500/5' },
              { label: 'Indikator Utama Stunting', value: hasil.indikatorUtama, sub: hasil.detail.beratInfo, bg: 'border-indigo-500/30 bg-indigo-500/5' },
              { label: 'Rekomendasi Tindak Lanjut', value: hasil.rekomendasi, sub: hasil.detail.rekomendasiDetail, bg: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400' },
            ].map((item, i) => (
              <div key={i} className={`rounded-2xl border p-4 shadow-sm flex flex-col justify-between ${item.bg}`}>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{item.label}</p>
                <p className="text-lg font-bold mt-2 text-slate-100">{item.value}</p>
                <p className="mt-1 text-sm text-slate-400 font-medium">{item.sub}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;