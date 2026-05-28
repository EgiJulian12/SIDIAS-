import { pool } from '../config/db.js';

// Mengambil semua data analisis (Admin mendapat semua, User hanya yang ia buat)
export const getAllAnalisis = async (req, res, next) => {
  try {
    let result;
    if (req.user.role === 'admin') {
      result = await pool.query(`
        SELECT a.*, 
               db.nama, 
               db.jenis_kelamin, 
               db.tanggal_lahir, 
               db.berat_badan, 
               db.tinggi_badan, 
               db.umur_bulan, 
               db.foto_url, 
               db.created_by
        FROM analisis a
        JOIN data_balita db ON a.data_id = db.id
        ORDER BY a.analyzed_at DESC
      `);
    } else {
      result = await pool.query(`
        SELECT a.*, 
               db.nama, 
               db.jenis_kelamin, 
               db.tanggal_lahir, 
               db.berat_badan, 
               db.tinggi_badan, 
               db.umur_bulan, 
               db.foto_url, 
               db.created_by
        FROM analisis a
        JOIN data_balita db ON a.data_id = db.id
        WHERE db.created_by = $1
        ORDER BY a.analyzed_at DESC
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

// Mengambil data analisis berdasarkan ID
export const getAnalisisById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let result;
    if (req.user.role === 'admin') {
      result = await pool.query('SELECT * FROM analisis WHERE id = $1', [id]);
    } else {
      result = await pool.query(`
        SELECT a.* 
        FROM analisis a
        JOIN data_balita db ON a.data_id = db.id
        WHERE a.id = $1 AND db.created_by = $2
      `, [id, req.user.nik]);
    }

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Data analisis tidak ditemukan atau Anda tidak memiliki akses'
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

// Mengambil analisis berdasarkan ID balita
export const getAnalisisByDataId = async (req, res, next) => {
  try {
    const { data_id } = req.params;
    let result;
    if (req.user.role === 'admin') {
      result = await pool.query('SELECT * FROM analisis WHERE data_id = $1 ORDER BY analyzed_at DESC', [data_id]);
    } else {
      result = await pool.query(`
        SELECT a.* 
        FROM analisis a
        JOIN data_balita db ON a.data_id = db.id
        WHERE a.data_id = $1 AND db.created_by = $2 
        ORDER BY a.analyzed_at DESC
      `, [data_id, req.user.nik]);
    }

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Data analisis untuk balita ini tidak ditemukan atau Anda tidak memiliki akses'
      });
    }

    // Biasanya kita mengembalikan data yang paling baru
    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// Menambahkan data analisis baru
export const createAnalisis = async (req, res, next) => {
  try {
    const { 
      data_id, 
      status_stunting, 
      status_detail,
      tingkat_risiko, 
      tingkat_risiko_detail,
      indikator, 
      indikator_detail,
      z_score, 
      rekomendasi,
      rekomendasi_detail
    } = req.body;

    if (!data_id || !status_stunting || z_score === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Field data_id, status_stunting, dan z_score wajib diisi'
      });
    }

    // Memastikan data balita ada dan milik user (jika bukan admin)
    let balitaExists;
    if (req.user.role === 'admin') {
      balitaExists = await pool.query('SELECT id FROM data_balita WHERE id = $1', [data_id]);
    } else {
      balitaExists = await pool.query('SELECT id FROM data_balita WHERE id = $1 AND created_by = $2', [data_id, req.user.nik]);
    }

    if (balitaExists.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Data balita tidak ditemukan atau Anda tidak memiliki akses'
      });
    }

    // Memastikan analisis untuk balita belum ada (jika relasinya 1-to-1)
    const existingAnalisis = await pool.query('SELECT id FROM analisis WHERE data_id = $1', [data_id]);
    if (existingAnalisis.rowCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Analisis untuk data balita ini sudah ada'
      });
    }

    const result = await pool.query(
      `INSERT INTO analisis (data_id, status_stunting, status_detail, tingkat_risiko, tingkat_risiko_detail, indikator, indikator_detail, z_score, rekomendasi, rekomendasi_detail) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        data_id, 
        status_stunting, 
        status_detail || null,
        tingkat_risiko || null, 
        tingkat_risiko_detail || null,
        indikator || null, 
        indikator_detail || null,
        z_score, 
        rekomendasi || null,
        rekomendasi_detail || null
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Data analisis berhasil ditambahkan',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// Memperbarui data analisis berdasarkan ID
export const updateAnalisis = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { 
      status_stunting, 
      status_detail,
      tingkat_risiko, 
      tingkat_risiko_detail,
      indikator, 
      indikator_detail,
      z_score, 
      rekomendasi,
      rekomendasi_detail
    } = req.body;

    // Cek kepemilikan
    const checkRes = await pool.query(`
      SELECT a.*, db.created_by 
      FROM analisis a
      JOIN data_balita db ON a.data_id = db.id
      WHERE a.id = $1
    `, [id]);

    if (checkRes.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Data analisis tidak ditemukan'
      });
    }

    if (req.user.role !== 'admin' && checkRes.rows[0].created_by !== req.user.nik) {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak. Ini bukan data analisis balita Anda.'
      });
    }

    const result = await pool.query(
      `UPDATE analisis 
       SET status_stunting = COALESCE($1, status_stunting),
           status_detail = COALESCE($2, status_detail),
           tingkat_risiko = COALESCE($3, tingkat_risiko),
           tingkat_risiko_detail = COALESCE($4, tingkat_risiko_detail),
           indikator = COALESCE($5, indikator),
           indikator_detail = COALESCE($6, indikator_detail),
           z_score = COALESCE($7, z_score),
           rekomendasi = COALESCE($8, rekomendasi),
           rekomendasi_detail = COALESCE($9, rekomendasi_detail)
       WHERE id = $10 RETURNING *`,
      [
        status_stunting, 
        status_detail,
        tingkat_risiko, 
        tingkat_risiko_detail,
        indikator, 
        indikator_detail,
        z_score, 
        rekomendasi, 
        rekomendasi_detail,
        id
      ]
    );

    res.status(200).json({
      success: true,
      message: 'Data analisis berhasil diperbarui',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// Menghapus data analisis berdasarkan ID
export const deleteAnalisis = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Cek kepemilikan
    const checkRes = await pool.query(`
      SELECT a.*, db.created_by 
      FROM analisis a
      JOIN data_balita db ON a.data_id = db.id
      WHERE a.id = $1
    `, [id]);

    if (checkRes.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Data analisis tidak ditemukan'
      });
    }

    if (req.user.role !== 'admin' && checkRes.rows[0].created_by !== req.user.nik) {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak. Ini bukan data analisis balita Anda.'
      });
    }

    const result = await pool.query('DELETE FROM analisis WHERE id = $1 RETURNING *', [id]);

    res.status(200).json({
      success: true,
      message: 'Data analisis berhasil dihapus',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};
