import { pool } from '../config/db.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const userNik = req.user.nik;

    // 1. Total Balita
    const balitaQuery = isAdmin
      ? 'SELECT COUNT(*) as total FROM data_balita'
      : 'SELECT COUNT(*) as total FROM data_balita WHERE created_by = $1';
    const balitaRes = await pool.query(balitaQuery, isAdmin ? [] : [userNik]);
    const totalBalita = parseInt(balitaRes.rows[0].total, 10) || 0;

    // 2. Data Analisis & Stunting Metrics
    const analisisQuery = isAdmin
      ? `SELECT a.id, a.status_stunting, a.status_detail, a.z_score, a.tingkat_risiko, a.analyzed_at,
                db.id as balita_id, db.nama, db.jenis_kelamin, db.umur_bulan, db.berat_badan, db.tinggi_badan, db.foto_url
         FROM analisis a
         JOIN data_balita db ON a.data_id = db.id
         ORDER BY a.analyzed_at DESC`
      : `SELECT a.id, a.status_stunting, a.status_detail, a.z_score, a.tingkat_risiko, a.analyzed_at,
                db.id as balita_id, db.nama, db.jenis_kelamin, db.umur_bulan, db.berat_badan, db.tinggi_badan, db.foto_url
         FROM analisis a
         JOIN data_balita db ON a.data_id = db.id
         WHERE db.created_by = $1
         ORDER BY a.analyzed_at DESC`;
    const analisisRes = await pool.query(analisisQuery, isAdmin ? [] : [userNik]);
    const allAnalisis = analisisRes.rows;
    const totalPemeriksaan = allAnalisis.length;

    let stuntingCount = 0;
    let normalCount = 0;
    let severeStuntingCount = 0;
    let warningFalteringCount = 0;
    let maleCount = 0;
    let femaleCount = 0;

    allAnalisis.forEach(item => {
      const z = parseFloat(item.z_score) || 0;
      if (item.status_stunting === 'Terindikasi Stunting') {
        stuntingCount++;
        if (z < -3.0) {
          severeStuntingCount++;
        }
      } else {
        normalCount++;
        if (z < -1.4) {
          warningFalteringCount++;
        }
      }

      if (item.jenis_kelamin === 'L') {
        maleCount++;
      } else if (item.jenis_kelamin === 'P') {
        femaleCount++;
      }
    });

    const normalPercentage = totalPemeriksaan > 0 
      ? Math.round((normalCount / totalPemeriksaan) * 100) 
      : 0;

    // 3. Anak Prioritas Perhatian (Z-Score < -1.8)
    const priorityChildren = allAnalisis
      .filter(item => (parseFloat(item.z_score) || 0) < -1.8)
      .slice(0, 5)
      .map(item => ({
        id: item.balita_id,
        analisis_id: item.id,
        nama: item.nama,
        umur_bulan: item.umur_bulan,
        jenis_kelamin: item.jenis_kelamin,
        z_score: parseFloat(item.z_score) || 0,
        status: item.status_stunting,
        tingkat_risiko: item.tingkat_risiko,
        analyzed_at: item.analyzed_at
      }));

    // 4. Pemeriksaan Terbaru (5 item)
    const recentActivities = allAnalisis.slice(0, 5).map(item => ({
      id: item.id,
      nama: item.nama,
      jenis_kelamin: item.jenis_kelamin,
      umur_bulan: item.umur_bulan,
      tinggi_badan: item.tinggi_badan,
      berat_badan: item.berat_badan,
      z_score: parseFloat(item.z_score) || 0,
      status: item.status_stunting,
      analyzed_at: item.analyzed_at
    }));

    res.status(200).json({
      success: true,
      data: {
        total_balita: totalBalita,
        total_pemeriksaan: totalPemeriksaan,
        normal_count: normalCount,
        stunting_count: stuntingCount,
        severe_stunting_count: severeStuntingCount,
        warning_faltering_count: warningFalteringCount,
        normal_percentage: normalPercentage,
        gender_distribution: {
          laki_laki: maleCount,
          perempuan: femaleCount
        },
        priority_children: priorityChildren,
        recent_activities: recentActivities
      }
    });
  } catch (error) {
    next(error);
  }
};

