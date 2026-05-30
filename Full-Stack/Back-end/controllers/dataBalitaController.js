import { pool } from '../config/db.js';

// Menghitung umur dalam bulan jika tidak diberikan
const calculateUmurBulan = (tanggal_lahir) => {
  const birthDate = new Date(tanggal_lahir);
  const today = new Date();
  const yearsDifference = today.getFullYear() - birthDate.getFullYear();
  const monthsDifference = today.getMonth() - birthDate.getMonth();
  return (yearsDifference * 12) + monthsDifference;
};

// Mengambil semua data balita (Admin mendapat semua, User hanya yang ia buat)
export const getAllDataBalita = async (req, res, next) => {
  try {
    let result;
    if (req.user.role === 'admin') {
      result = await pool.query(`
        SELECT db.*, 
               a.id as analisis_id,
               a.status_stunting,
               a.status_detail,
               a.tingkat_risiko,
               a.tingkat_risiko_detail,
               a.indikator,
               a.indikator_detail,
               a.z_score,
               a.rekomendasi,
               a.rekomendasi_detail
        FROM data_balita db
        LEFT JOIN analisis a ON db.id = a.data_id
        ORDER BY db.created_at DESC
      `);
    } else {
      result = await pool.query(`
        SELECT db.*, 
               a.id as analisis_id,
               a.status_stunting,
               a.status_detail,
               a.tingkat_risiko,
               a.tingkat_risiko_detail,
               a.indikator,
               a.indikator_detail,
               a.z_score,
               a.rekomendasi,
               a.rekomendasi_detail
        FROM data_balita db
        LEFT JOIN analisis a ON db.id = a.data_id
        WHERE db.created_by = $1
        ORDER BY db.created_at DESC
      `, [req.user.nik]);
    }
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
    let result;
    if (req.user.role === 'admin') {
      result = await pool.query('SELECT * FROM data_balita WHERE id = $1', [id]);
    } else {
      result = await pool.query('SELECT * FROM data_balita WHERE id = $1 AND created_by = $2', [id, req.user.nik]);
    }

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Data balita tidak ditemukan atau Anda tidak memiliki akses'
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
      umur_bulan
    } = req.body;

    const foto_url = req.file ? `/uploads/${req.file.filename}` : null;

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
        req.user.nik // Gunakan NIK dari user yang login
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

    // Cek kepemilikan
    if (req.user.role !== 'admin' && currentData.created_by !== req.user.nik) {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak. Ini bukan data balita Anda.'
      });
    }

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

    // Periksa kepemilikan dulu
    const checkRes = await pool.query('SELECT * FROM data_balita WHERE id = $1', [id]);
    if (checkRes.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Data balita tidak ditemukan'
      });
    }

    const ownerNik = checkRes.rows[0].created_by ? String(checkRes.rows[0].created_by).trim() : null;
    const userNik = req.user.nik ? String(req.user.nik).trim() : null;

    console.log(`[DeleteDataBalita] ID: ${id}, Role: ${req.user.role}, Owner NIK: '${ownerNik}', User NIK: '${userNik}'`);

    if (req.user.role !== 'admin' && ownerNik !== userNik) {
      return res.status(403).json({
        success: false,
        message: `Akses ditolak. Ini bukan data balita Anda. (Owner: ${ownerNik}, Anda: ${userNik})`
      });
    }

    const result = await pool.query('DELETE FROM data_balita WHERE id = $1 RETURNING *', [id]);

    res.status(200).json({
      success: true,
      message: 'Data balita berhasil dihapus',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};
