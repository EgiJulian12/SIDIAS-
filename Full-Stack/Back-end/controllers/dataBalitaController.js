import { pool } from '../config/db.js';

// Menghitung umur dalam bulan jika tidak diberikan
const calculateUmurBulan = (tanggal_lahir) => {
  const birthDate = new Date(tanggal_lahir);
  const today = new Date();
  const yearsDifference = today.getFullYear() - birthDate.getFullYear();
  const monthsDifference = today.getMonth() - birthDate.getMonth();
  return (yearsDifference * 12) + monthsDifference;
};

// Mengambil semua data balita
export const getAllDataBalita = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM data_balita ORDER BY created_at DESC');
    res.status(200).json({
      success: true,
      count: result.rowCount,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
};

// Mengambil data balita berdasarkan ID
export const getDataBalitaById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM data_balita WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Data balita tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// Menambahkan data balita baru
export const createDataBalita = async (req, res, next) => {
  try {
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

    const result = await pool.query(
      `INSERT INTO data_balita (nama, jenis_kelamin, tanggal_lahir, berat_badan, tinggi_badan, umur_bulan, foto_url, created_by) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        nama, 
        jenis_kelamin, 
        tanggal_lahir, 
        berat_badan || null, 
        tinggi_badan || null, 
        calculatedUmur, 
        foto_url || null, 
        created_by || null // Mungkin belum ada user saat testing
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Data balita berhasil ditambahkan',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// Memperbarui data balita berdasarkan ID
export const updateDataBalita = async (req, res, next) => {
  try {
    const { id } = req.params;
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

    const currentDataRes = await pool.query('SELECT * FROM data_balita WHERE id = $1', [id]);
    
    if (currentDataRes.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Data balita tidak ditemukan'
      });
    }

    const currentData = currentDataRes.rows[0];

    let updatedUmur = currentData.umur_bulan;
    if (umur_bulan !== undefined) {
      updatedUmur = umur_bulan;
    } else if (tanggal_lahir && tanggal_lahir !== new Date(currentData.tanggal_lahir).toISOString().split('T')[0]) {
      updatedUmur = calculateUmurBulan(tanggal_lahir);
    }

    const result = await pool.query(
      `UPDATE data_balita 
       SET nama = COALESCE($1, nama), 
           jenis_kelamin = COALESCE($2, jenis_kelamin), 
           tanggal_lahir = COALESCE($3, tanggal_lahir), 
           berat_badan = COALESCE($4, berat_badan), 
           tinggi_badan = COALESCE($5, tinggi_badan), 
           umur_bulan = $6, 
           foto_url = COALESCE($7, foto_url) 
       WHERE id = $8 RETURNING *`,
      [
        nama, 
        jenis_kelamin, 
        tanggal_lahir, 
        berat_badan, 
        tinggi_badan, 
        updatedUmur, 
        foto_url, 
        id
      ]
    );

    res.status(200).json({
      success: true,
      message: 'Data balita berhasil diperbarui',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// Menghapus data balita berdasarkan ID
export const deleteDataBalita = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM data_balita WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Data balita tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Data balita berhasil dihapus',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};
