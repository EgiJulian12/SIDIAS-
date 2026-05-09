import { analisisData, dataBalita } from '../config/db.js';
import crypto from 'crypto';

// GET /api/analisis
export const getAllAnalisis = (req, res) => {
  res.status(200).json({
    success: true,
    count: analisisData.length,
    data: analisisData
  });
};

// GET /api/analisis/:id
export const getAnalisisById = (req, res) => {
  const analisis = analisisData.find(a => a.id === req.params.id);

  if (!analisis) {
    return res.status(404).json({
      success: false,
      message: 'Data analisis tidak ditemukan'
    });
  }

  res.status(200).json({
    success: true,
    data: analisis
  });
};

// GET /api/analisis/data-balita/:data_id
export const getAnalisisByDataId = (req, res) => {
  const analisis = analisisData.find(a => a.data_id === req.params.data_id);

  if (!analisis) {
    return res.status(404).json({
      success: false,
      message: 'Data analisis untuk balita ini tidak ditemukan'
    });
  }

  res.status(200).json({
    success: true,
    data: analisis
  });
};

// POST /api/analisis
export const createAnalisis = (req, res) => {
  const { 
    data_id, 
    status_stunting, 
    tingkat_risiko, 
    indikator, 
    z_score, 
    rekomendasi 
  } = req.body;

  if (!data_id || !status_stunting || z_score === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Field data_id, status_stunting, dan z_score wajib diisi'
    });
  }

  // Validate data_id exists in dataBalita
  const balitaExists = dataBalita.find(b => b.id === data_id);
  if (!balitaExists) {
    return res.status(404).json({
      success: false,
      message: 'Data balita dengan data_id tersebut tidak ditemukan'
    });
  }

  // Check unique data_id constraint
  const existingAnalisis = analisisData.find(a => a.data_id === data_id);
  if (existingAnalisis) {
    return res.status(400).json({
      success: false,
      message: 'Analisis untuk data balita ini sudah ada'
    });
  }

  const newAnalisis = {
    id: crypto.randomUUID(),
    data_id,
    status_stunting,
    tingkat_risiko: tingkat_risiko || null,
    indikator: indikator || null,
    z_score,
    rekomendasi: rekomendasi || null,
    created_at: new Date().toISOString()
  };

  analisisData.push(newAnalisis);

  res.status(201).json({
    success: true,
    message: 'Data analisis berhasil ditambahkan',
    data: newAnalisis
  });
};

// PUT /api/analisis/:id
export const updateAnalisis = (req, res) => {
  const analisisIndex = analisisData.findIndex(a => a.id === req.params.id);

  if (analisisIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Data analisis tidak ditemukan'
    });
  }

  const { 
    status_stunting, 
    tingkat_risiko, 
    indikator, 
    z_score, 
    rekomendasi 
  } = req.body;

  const existingData = analisisData[analisisIndex];

  analisisData[analisisIndex] = {
    ...existingData,
    status_stunting: status_stunting || existingData.status_stunting,
    tingkat_risiko: tingkat_risiko !== undefined ? tingkat_risiko : existingData.tingkat_risiko,
    indikator: indikator !== undefined ? indikator : existingData.indikator,
    z_score: z_score !== undefined ? z_score : existingData.z_score,
    rekomendasi: rekomendasi !== undefined ? rekomendasi : existingData.rekomendasi
  };

  res.status(200).json({
    success: true,
    message: 'Data analisis berhasil diperbarui',
    data: analisisData[analisisIndex]
  });
};

// DELETE /api/analisis/:id
export const deleteAnalisis = (req, res) => {
  const analisisIndex = analisisData.findIndex(a => a.id === req.params.id);

  if (analisisIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Data analisis tidak ditemukan'
    });
  }

  const deletedData = analisisData.splice(analisisIndex, 1);

  res.status(200).json({
    success: true,
    message: 'Data analisis berhasil dihapus',
    data: deletedData[0]
  });
};
