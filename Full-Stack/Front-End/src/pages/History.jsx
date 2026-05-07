// src/pages/History.jsx
import { useState } from 'react';

const dummyData = []; // nanti diisi dari API

const History = () => {
  const [search, setSearch] = useState('');

  const filtered = dummyData.filter((item) =>
    item.nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-2xl py-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Riwayat Pemeriksaan{' '}
          <span className="font-semibold">{dummyData.length} data</span>
        </p>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari Nama..."
          className="rounded border border-gray-300 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-sm text-gray-400">
          Belum ada data. Tambahkan pemeriksaan baru terlebih dahulu.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item, i) => (
            <div
              key={i}
              className="rounded border border-gray-200 bg-white p-4 shadow-sm"
            >
              <p className="font-semibold text-gray-800">{item.nama}</p>
              <p className="text-xs text-gray-500">{item.tanggal}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;