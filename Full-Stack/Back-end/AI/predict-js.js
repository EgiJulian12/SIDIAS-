/**
 * SIDIAS AI Prediction Module (JavaScript)
 * Replaces Python predict.py for serverless deployment.
 *
 * Uses WHO Child Growth Standards for Height-for-Age Z-score calculation.
 * This is the gold standard for stunting detection used by WHO, UNICEF, and Kemenkes RI.
 */

// ======================================================================
// WHO Height-for-Age Reference Data (0–60 months)
// Format per month: [−3SD, −2SD, −1SD, Median, +1SD, +2SD, +3SD]  (cm)
// Source: WHO Child Growth Standards (2006)
// ======================================================================

const BOYS_HFA = [
  [44.2,46.1,48.0,49.9,51.8,53.7,55.6],
  [48.9,50.8,52.8,54.7,56.7,58.6,60.6],
  [52.4,54.4,56.4,58.4,60.4,62.4,64.4],
  [55.3,57.3,59.4,61.4,63.5,65.5,67.6],
  [57.6,59.7,61.8,63.9,66.0,68.0,70.1],
  [59.6,61.7,63.8,65.9,68.0,70.1,72.2],
  [61.2,63.3,65.5,67.6,69.8,71.9,74.0],
  [62.7,64.8,67.0,69.2,71.3,73.5,75.7],
  [64.0,66.2,68.4,70.6,72.8,75.0,77.2],
  [65.2,67.5,69.7,72.0,74.2,76.5,78.7],
  [66.4,68.7,71.0,73.3,75.6,77.9,80.1],
  [67.6,69.9,72.2,74.5,76.9,79.2,81.5],
  [68.6,71.0,73.4,75.7,78.1,80.5,82.9],
  [69.6,72.1,74.5,76.9,79.3,81.8,84.2],
  [70.6,73.1,75.6,78.0,80.5,83.0,85.5],
  [71.6,74.1,76.6,79.1,81.7,84.2,86.7],
  [72.5,75.0,77.6,80.2,82.8,85.4,88.0],
  [73.3,76.0,78.6,81.2,83.9,86.5,89.2],
  [74.2,76.9,79.6,82.3,85.0,87.7,90.4],
  [75.0,77.7,80.5,83.2,86.0,88.8,91.5],
  [75.8,78.6,81.4,84.2,87.0,89.8,92.6],
  [76.5,79.4,82.3,85.1,88.0,90.9,93.8],
  [77.2,80.2,83.1,86.0,89.0,91.9,94.9],
  [78.0,81.0,83.9,86.9,89.9,92.9,95.9],
  [78.0,81.0,84.1,87.1,90.2,93.2,96.3],
  [78.6,81.7,84.9,88.0,91.1,94.2,97.3],
  [79.3,82.5,85.6,88.8,92.0,95.2,98.3],
  [79.9,83.1,86.4,89.6,92.9,96.1,99.3],
  [80.5,83.8,87.1,90.4,93.7,97.0,100.3],
  [81.1,84.5,87.8,91.2,94.5,97.9,101.2],
  [81.7,85.1,88.5,91.9,95.3,98.7,102.1],
  [82.3,85.7,89.2,92.7,96.1,99.6,103.0],
  [82.8,86.4,89.9,93.4,96.9,100.4,103.9],
  [83.4,86.9,90.5,94.1,97.6,101.2,104.8],
  [83.9,87.5,91.1,94.8,98.4,102.0,105.6],
  [84.4,88.1,91.8,95.4,99.1,102.7,106.4],
  [85.0,88.7,92.4,96.1,99.8,103.5,107.2],
  [85.5,89.2,93.0,96.7,100.5,104.2,108.0],
  [86.0,89.8,93.6,97.4,101.2,105.0,108.8],
  [86.5,90.3,94.2,98.0,101.8,105.7,109.5],
  [87.0,90.9,94.7,98.6,102.5,106.4,110.3],
  [87.5,91.4,95.3,99.2,103.2,107.1,111.0],
  [88.0,91.9,95.9,99.9,103.8,107.8,111.7],
  [88.4,92.4,96.4,100.4,104.5,108.5,112.5],
  [88.9,93.0,97.0,101.0,105.1,109.1,113.2],
  [89.4,93.5,97.5,101.6,105.7,109.8,113.9],
  [89.8,94.0,98.1,102.2,106.3,110.4,114.6],
  [90.3,94.4,98.6,102.8,106.9,111.1,115.2],
  [90.7,94.9,99.1,103.3,107.5,111.7,115.9],
  [91.2,95.4,99.7,103.9,108.1,112.4,116.6],
  [91.6,95.9,100.2,104.4,108.7,113.0,117.3],
  [92.1,96.4,100.7,105.0,109.3,113.6,117.9],
  [92.5,96.9,101.2,105.6,109.9,114.2,118.6],
  [93.0,97.4,101.7,106.1,110.5,114.9,119.2],
  [93.4,97.8,102.3,106.7,111.1,115.5,119.9],
  [93.9,98.3,102.8,107.2,111.7,116.1,120.6],
  [94.3,98.8,103.3,107.8,112.3,116.8,121.2],
  [94.7,99.3,103.8,108.3,112.8,117.4,121.9],
  [95.2,99.7,104.3,108.9,113.4,118.0,122.6],
  [95.6,100.2,104.8,109.4,114.0,118.6,123.2],
  [96.1,100.7,105.3,110.0,114.6,119.2,123.9],
];

const GIRLS_HFA = [
  [43.6,45.4,47.3,49.1,51.0,52.9,54.7],
  [47.8,49.8,51.7,53.7,55.6,57.6,59.5],
  [51.0,53.0,55.0,57.1,59.1,61.1,63.2],
  [53.5,55.6,57.7,59.8,61.9,64.0,66.1],
  [55.6,57.8,59.9,62.1,64.3,66.4,68.6],
  [57.4,59.6,61.8,64.0,66.2,68.5,70.7],
  [58.9,61.2,63.5,65.7,68.0,70.3,72.5],
  [60.3,62.7,65.0,67.3,69.6,71.9,74.2],
  [61.7,64.0,66.4,68.7,71.1,73.5,75.8],
  [62.9,65.3,67.7,70.1,72.6,75.0,77.4],
  [64.1,66.5,69.0,71.5,73.9,76.4,78.9],
  [65.2,67.7,70.3,72.8,75.3,77.8,80.3],
  [66.3,68.9,71.4,74.0,76.6,79.2,81.7],
  [67.3,70.0,72.6,75.2,77.8,80.5,83.1],
  [68.3,71.0,73.7,76.4,79.1,81.7,84.4],
  [69.3,72.0,74.8,77.5,80.2,83.0,85.7],
  [70.2,73.0,75.8,78.6,81.4,84.2,87.0],
  [71.1,74.0,76.8,79.7,82.5,85.4,88.2],
  [72.0,74.9,77.8,80.7,83.6,86.5,89.4],
  [72.8,75.8,78.8,81.7,84.7,87.6,90.6],
  [73.7,76.7,79.7,82.7,85.7,88.7,91.7],
  [74.5,77.5,80.6,83.7,86.7,89.8,92.9],
  [75.2,78.4,81.5,84.6,87.7,90.8,93.9],
  [76.0,79.2,82.3,85.5,88.7,91.9,95.0],
  [76.0,79.3,82.5,85.7,88.9,92.2,95.4],
  [76.8,80.0,83.3,86.6,89.9,93.1,96.4],
  [77.5,80.8,84.1,87.4,90.8,94.1,97.4],
  [78.1,81.5,84.9,88.3,91.7,95.0,98.4],
  [78.8,82.2,85.7,89.1,92.5,96.0,99.4],
  [79.5,82.9,86.4,89.9,93.4,96.9,100.3],
  [80.1,83.6,87.1,90.7,94.2,97.7,101.3],
  [80.7,84.3,87.9,91.4,95.0,98.6,102.2],
  [81.3,84.9,88.6,92.2,95.8,99.4,103.1],
  [81.9,85.6,89.3,92.9,96.6,100.3,103.9],
  [82.5,86.2,89.9,93.6,97.4,101.1,104.8],
  [83.1,86.8,90.6,94.4,98.1,101.9,105.6],
  [83.6,87.4,91.2,95.1,98.9,102.7,106.5],
  [84.2,88.0,91.9,95.7,99.6,103.4,107.3],
  [84.7,88.6,92.5,96.4,100.3,104.2,108.1],
  [85.3,89.2,93.1,97.1,101.0,105.0,108.9],
  [85.8,89.8,93.8,97.7,101.7,105.7,109.7],
  [86.3,90.4,94.4,98.4,102.4,106.4,110.5],
  [86.8,90.9,95.0,99.1,103.1,107.2,111.2],
  [87.4,91.5,95.6,99.7,103.8,107.9,112.0],
  [87.9,92.0,96.2,100.3,104.5,108.6,112.7],
  [88.4,92.5,96.7,100.9,105.1,109.3,113.5],
  [88.9,93.1,97.3,101.5,105.8,110.0,114.2],
  [89.3,93.6,97.9,102.1,106.4,110.7,114.9],
  [89.8,94.1,98.4,102.7,107.0,111.3,115.7],
  [90.3,94.6,99.0,103.3,107.7,112.0,116.4],
  [90.7,95.1,99.5,103.9,108.3,112.7,117.1],
  [91.2,95.6,100.1,104.5,108.9,113.3,117.7],
  [91.7,96.1,100.6,105.0,109.5,114.0,118.4],
  [92.1,96.6,101.1,105.6,110.1,114.6,119.1],
  [92.6,97.1,101.6,106.2,110.7,115.2,119.8],
  [93.0,97.6,102.2,106.7,111.3,115.9,120.4],
  [93.4,98.1,102.7,107.3,111.9,116.5,121.1],
  [93.9,98.5,103.2,107.8,112.5,117.1,121.8],
  [94.3,99.0,103.7,108.4,113.0,117.7,122.4],
  [94.7,99.5,104.2,108.9,113.6,118.3,123.1],
  [95.2,99.9,104.7,109.4,114.2,118.9,123.7],
];

// ======================================================================
// Z-Score Calculation
// ======================================================================

/**
 * Calculate approximate Z-score using WHO reference data.
 * Uses linear interpolation between SD lines.
 */
function calculateZScore(height, refData) {
  const [neg3, neg2, neg1, median, pos1, pos2, pos3] = refData;

  if (height >= median) {
    if (height >= pos3) return 3 + (height - pos3) / (pos3 - pos2);
    if (height >= pos2) return 2 + (height - pos2) / (pos3 - pos2);
    if (height >= pos1) return 1 + (height - pos1) / (pos2 - pos1);
    return (height - median) / (pos1 - median);
  } else {
    if (height < neg3) return -3 - (neg3 - height) / (neg2 - neg3);
    if (height < neg2) return -3 + (height - neg3) / (neg2 - neg3);
    if (height < neg1) return -2 + (height - neg2) / (neg1 - neg2);
    return -1 + (height - neg1) / (median - neg1);
  }
}

/**
 * Get WHO reference data with interpolation for fractional months.
 */
function getRefData(table, ageMonths) {
  const maxMonth = table.length - 1;
  const clampedAge = Math.max(0, Math.min(ageMonths, maxMonth));
  const lowerMonth = Math.floor(clampedAge);
  const upperMonth = Math.min(lowerMonth + 1, maxMonth);
  const fraction = clampedAge - lowerMonth;

  if (fraction === 0 || lowerMonth === upperMonth) {
    return table[lowerMonth];
  }

  // Linear interpolation between months
  return table[lowerMonth].map((val, i) =>
    val + fraction * (table[upperMonth][i] - val)
  );
}

// ======================================================================
// Main Prediction Function — exported for the controller
// ======================================================================

/**
 * Predict stunting status using WHO Height-for-Age Z-score standard.
 *
 * @param {number} umur_bulan  – Age in months (0–60)
 * @param {string} jenis_kelamin – 'L' (male) or 'P' (female)
 * @param {number} tinggi_badan  – Height in cm
 * @param {number} berat_badan   – Weight in kg
 * @returns {object} Analysis result matching the original Python output format
 */
export function predict(umur_bulan, jenis_kelamin, tinggi_badan, berat_badan) {
  const sex = (jenis_kelamin || '').toString().trim().toUpperCase();
  const table = sex === 'L' ? BOYS_HFA : GIRLS_HFA;
  const refData = getRefData(table, umur_bulan);
  const zScore = calculateZScore(tinggi_badan, refData);
  const imt = berat_badan / ((tinggi_badan / 100) ** 2);

  // WHO classification thresholds
  let status_stunting, status_detail, tingkat_risiko, tingkat_risiko_detail, rekomendasi, rekomendasi_detail;

  if (zScore < -3) {
    status_stunting = 'Terindikasi Stunting';
    status_detail = 'Severely Stunted (Sangat Pendek)';
    tingkat_risiko = 'Tinggi';
    tingkat_risiko_detail = `Z-Score HAZ: ${zScore.toFixed(2)} (< −3 SD). Anak mengalami stunting berat dan membutuhkan penanganan segera.`;
    rekomendasi = 'Segera konsultasikan ke dokter spesialis anak atau puskesmas. Tingkatkan asupan protein hewani, susu, telur, ikan, dan makanan bergizi seimbang setiap hari.';
    rekomendasi_detail = 'Lakukan kunjungan ke posyandu/puskesmas setiap bulan. Berikan makanan tinggi protein (telur, ikan, daging, susu). Pastikan anak mendapat vitamin A dan suplemen gizi. Periksakan kesehatan secara menyeluruh untuk mendeteksi penyakit penyerta.';
  } else if (zScore < -2) {
    status_stunting = 'Terindikasi Stunting';
    status_detail = 'Stunted (Pendek)';
    tingkat_risiko = 'Sedang';
    tingkat_risiko_detail = `Z-Score HAZ: ${zScore.toFixed(2)} (−3 SD ≤ Z < −2 SD). Anak terindikasi stunting dan perlu pemantauan intensif.`;
    rekomendasi = 'Tingkatkan konsumsi protein, susu, vitamin, makanan bergizi seimbang, dan lakukan pemeriksaan rutin ke posyandu.';
    rekomendasi_detail = 'Berikan makanan pendamping ASI yang kaya gizi. Tingkatkan frekuensi makan dengan porsi kecil tapi sering. Pastikan imunisasi lengkap. Kontrol ke posyandu setiap bulan untuk pemantauan berat dan tinggi badan.';
  } else {
    status_stunting = 'Tidak Stunting';
    status_detail = 'Normal';
    tingkat_risiko = 'Rendah';
    tingkat_risiko_detail = `Z-Score HAZ: ${zScore.toFixed(2)} (≥ −2 SD). Pertumbuhan anak saat ini tergolong normal.`;
    rekomendasi = 'Pertahankan pola makan sehat, aktivitas fisik, nutrisi seimbang, dan pemeriksaan rutin setiap bulan.';
    rekomendasi_detail = 'Pertahankan pola asuh yang baik. Berikan makanan sehat dan seimbang setiap hari. Pastikan anak aktif bermain dan cukup istirahat. Lakukan pemeriksaan rutin di posyandu.';
  }

  return {
    status_stunting,
    status_detail,
    tingkat_risiko,
    tingkat_risiko_detail,
    indikator: 'WHO Height-for-Age (HAZ)',
    indikator_detail: `Z-Score: ${zScore.toFixed(2)} | BMI: ${imt.toFixed(2)} | TB: ${tinggi_badan} cm | BB: ${berat_badan} kg | Umur: ${umur_bulan} bulan`,
    z_score: parseFloat(zScore.toFixed(2)),
    rekomendasi,
    rekomendasi_detail,
  };
}
