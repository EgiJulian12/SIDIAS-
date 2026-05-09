import { dataBalita } from '../config/db.js';
import crypto from 'crypto';

// Helper function to calculate age in months if not provided
const calculateUmurBulan = (tanggal_lahir) => {
  const birthDate = new Date(tanggal_lahir);
  const today = new Date();
  const yearsDifference = today.getFullYear() - birthDate.getFullYear();
  const monthsDifference = today.getMonth() - birthDate.getMonth();
  return (yearsDifference * 12) + monthsDifference;
};

// GET /api/data-balita
export const getAllDataBalita = (req, res) => {
  res.status(200).json({
    success: true,
    count: dataBalita.length,
    data: dataBalita
  });
};

// GET /api/data-balita/:id
export const getDataBalitaById = (req, res) => {
  const balita = dataBalita.find(b => b.id === req.params.id);

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

// POST /api/data-balita
export const createDataBalita = (req, res) => {
  const { 
    nama, 
    jenis_kelamin, 
    tanggal_lahir, 
    berat_badan, 
    tinggi_badan, 
    umur_bulan, 
    foto_url, 
    created_by 
  } = req.body;

  if (!nama || !jenis_kelamin || !tanggal_lahir) {
    return res.status(400).json({
      success: false,
      message: 'Field nama, jenis_kelamin, dan tanggal_lahir wajib diisi'
    });
  }

  if (jenis_kelamin !== 'L' && jenis_kelamin !== 'P') {
    return res.status(400).json({
      success: false,
      message: 'jenis_kelamin harus "L" atau "P"'
    });
  }

  const calculatedUmur = umur_bulan !== undefined ? umur_bulan : calculateUmurBulan(tanggal_lahir);

  const newData = {
    id: crypto.randomUUID(),
    nama,
    jenis_kelamin,
    tanggal_lahir,
    berat_badan: berat_badan || null,
    tinggi_badan: tinggi_badan || null,
    umur_bulan: calculatedUmur,
    foto_url: foto_url || null,
    created_by: created_by || 'system',
    created_at: new Date().toISOString()
  };

  dataBalita.push(newData);

  res.status(201).json({
    success: true,
    message: 'Data balita berhasil ditambahkan',
    data: newData
  });
};

// PUT /api/data-balita/:id
export const updateDataBalita = (req, res) => {
  const balitaIndex = dataBalita.findIndex(b => b.id === req.params.id);

  if (balitaIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Data balita tidak ditemukan'
    });
  }

  const { 
    nama, 
    jenis_kelamin, 
    tanggal_lahir, 
    berat_badan, 
    tinggi_badan, 
    umur_bulan, 
    foto_url 
  } = req.body;

  if (jenis_kelamin && jenis_kelamin !== 'L' && jenis_kelamin !== 'P') {
    return res.status(400).json({
      success: false,
      message: 'jenis_kelamin harus "L" atau "P"'
    });
  }

  const existingData = dataBalita[balitaIndex];
  
  let updatedUmur = existingData.umur_bulan;
  if (umur_bulan !== undefined) {
    updatedUmur = umur_bulan;
  } else if (tanggal_lahir && tanggal_lahir !== existingData.tanggal_lahir) {
    updatedUmur = calculateUmurBulan(tanggal_lahir);
  }

  dataBalita[balitaIndex] = {
    ...existingData,
    nama: nama || existingData.nama,
    jenis_kelamin: jenis_kelamin || existingData.jenis_kelamin,
    tanggal_lahir: tanggal_lahir || existingData.tanggal_lahir,
    berat_badan: berat_badan !== undefined ? berat_badan : existingData.berat_badan,
    tinggi_badan: tinggi_badan !== undefined ? tinggi_badan : existingData.tinggi_badan,
    umur_bulan: updatedUmur,
    foto_url: foto_url !== undefined ? foto_url : existingData.foto_url
  };

  res.status(200).json({
    success: true,
    message: 'Data balita berhasil diperbarui',
    data: dataBalita[balitaIndex]
  });
};

// DELETE /api/data-balita/:id
export const deleteDataBalita = (req, res) => {
  const balitaIndex = dataBalita.findIndex(b => b.id === req.params.id);

  if (balitaIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Data balita tidak ditemukan'
    });
  }

  const deletedData = dataBalita.splice(balitaIndex, 1);

  res.status(200).json({
    success: true,
    message: 'Data balita berhasil dihapus',
    data: deletedData[0]
  });
};
