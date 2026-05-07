import { balitaData } from '../config/db.js';

// GET /api/balita
export const getAllBalita = (req, res) => {
  res.status(200).json({
    success: true,
    count: balitaData.length,
    data: balitaData
  });
};

// GET /api/balita/:id
export const getBalitaById = (req, res) => {
  const balita = balitaData.find(b => b.id === parseInt(req.params.id));

  if (!balita) {
    return res.status(404).json({
      success: false,
      message: 'Data balita tidak ditemukan'
    });
  }

  res.status(200).json({
    success: true,
    data: balita
  });
};

// POST /api/balita
export const createBalita = (req, res) => {
  const { nama, umur_bulan, berat_kg, tinggi_cm } = req.body;

  if (!nama || !umur_bulan || !berat_kg || !tinggi_cm) {
    return res.status(400).json({
      success: false,
      message: 'Semua field (nama, umur_bulan, berat_kg, tinggi_cm) wajib diisi'
    });
  }

  const newBalita = {
    id: balitaData.length > 0 ? balitaData[balitaData.length - 1].id + 1 : 1,
    nama,
    umur_bulan,
    berat_kg,
    tinggi_cm
  };

  balitaData.push(newBalita);

  res.status(201).json({
    success: true,
    message: 'Data balita berhasil ditambahkan',
    data: newBalita
  });
};

// PUT /api/balita/:id
export const updateBalita = (req, res) => {
  const balitaIndex = balitaData.findIndex(b => b.id === parseInt(req.params.id));

  if (balitaIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Data balita tidak ditemukan'
    });
  }

  const { nama, umur_bulan, berat_kg, tinggi_cm } = req.body;

  balitaData[balitaIndex] = {
    ...balitaData[balitaIndex],
    nama: nama || balitaData[balitaIndex].nama,
    umur_bulan: umur_bulan || balitaData[balitaIndex].umur_bulan,
    berat_kg: berat_kg || balitaData[balitaIndex].berat_kg,
    tinggi_cm: tinggi_cm || balitaData[balitaIndex].tinggi_cm
  };

  res.status(200).json({
    success: true,
    message: 'Data balita berhasil diperbarui',
    data: balitaData[balitaIndex]
  });
};

// DELETE /api/balita/:id
export const deleteBalita = (req, res) => {
  const balitaIndex = balitaData.findIndex(b => b.id === parseInt(req.params.id));

  if (balitaIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Data balita tidak ditemukan'
    });
  }

  const deletedData = balitaData.splice(balitaIndex, 1);

  res.status(200).json({
    success: true,
    message: 'Data balita berhasil dihapus',
    data: deletedData[0]
  });
};
