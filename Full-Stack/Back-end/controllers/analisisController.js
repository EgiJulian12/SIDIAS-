import { pool } from '../config/db.js';

// Mengambil semua data analisis
export const getAllAnalisis = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM analisis ORDER BY analyzed_at DESC');
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
    const result = await pool.query('SELECT * FROM analisis WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Data analisis tidak ditemukan'
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
    const result = await pool.query('SELECT * FROM analisis WHERE data_id = $1 ORDER BY analyzed_at DESC', [data_id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Data analisis untuk balita ini tidak ditemukan'
      });
    }

    // Biasanya kita mengembalikan data yang paling baru
    // Implementasi sebelumnya menggunakan .find() yang mengembalikan kecocokan pertama.
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

    // Memastikan data balita ada
    const balitaExists = await pool.query('SELECT id FROM data_balita WHERE id = $1', [data_id]);
    if (balitaExists.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Data balita dengan data_id tersebut tidak ditemukan'
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
      `INSERT INTO analisis (data_id, status_stunting, tingkat_risiko, indikator, z_score, rekomendasi) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        data_id, 
        status_stunting, 
        tingkat_risiko || null, 
        indikator || null, 
        z_score, 
        rekomendasi || null
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
      tingkat_risiko, 
      indikator, 
      z_score, 
      rekomendasi 
    } = req.body;

    const currentAnalisis = await pool.query('SELECT * FROM analisis WHERE id = $1', [id]);

    if (currentAnalisis.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Data analisis tidak ditemukan'
      });
    }

    const result = await pool.query(
      `UPDATE analisis 
       SET status_stunting = COALESCE($1, status_stunting),
           tingkat_risiko = COALESCE($2, tingkat_risiko),
           indikator = COALESCE($3, indikator),
           z_score = COALESCE($4, z_score),
           rekomendasi = COALESCE($5, rekomendasi)
       WHERE id = $6 RETURNING *`,
      [
        status_stunting, 
        tingkat_risiko, 
        indikator, 
        z_score, 
        rekomendasi, 
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
    const result = await pool.query('DELETE FROM analisis WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Data analisis tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Data analisis berhasil dihapus',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};
