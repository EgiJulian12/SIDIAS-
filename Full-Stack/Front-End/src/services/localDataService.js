import { predict as predictWHO } from '../utils/ai/predict-js.js';

const STORAGE_KEY = 'sidias_local_examinations';

// Initial sample data if local storage is completely empty
const initialDemoData = [
  {
    id: 'demo-1',
    data_id: 'demo-balita-1',
    nama: 'Aditya Pratama',
    jenis_kelamin: 'L',
    tanggal_lahir: '2025-05-10',
    umur_bulan: 18,
    berat_badan: 11.2,
    tinggi_badan: 82.5,
    status_stunting: 'Tidak Stunting',
    status_detail: 'Normal & Optimal',
    tingkat_risiko: 'Rendah',
    z_score: -0.42,
    analyzed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    rekomendasi: 'Pertumbuhan anak dalam lintasan optimal.',
    rekomendasi_detail: ''
  },
  {
    id: 'demo-2',
    data_id: 'demo-balita-2',
    nama: 'Siti Rahmawati',
    jenis_kelamin: 'P',
    tanggal_lahir: '2024-11-15',
    umur_bulan: 24,
    berat_badan: 9.8,
    tinggi_badan: 77.0,
    status_stunting: 'Terindikasi Stunting',
    status_detail: 'Stunted (Pendek)',
    tingkat_risiko: 'Tinggi',
    z_score: -2.48,
    analyzed_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    rekomendasi: 'Perlu intervensi kejar tumbuh protein hewani ganda.',
    rekomendasi_detail: ''
  }
];

// Initialize initial records with full AI personalized details
initialDemoData.forEach(item => {
  const p = predictWHO(item.umur_bulan, item.jenis_kelamin, item.tinggi_badan, item.berat_badan);
  item.personalized = p.personalized;
  item.rekomendasi = p.rekomendasi;
  item.rekomendasi_detail = JSON.stringify(p.personalized);
});

export const getLocalExaminations = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDemoData));
      return initialDemoData;
    }
    const parsed = JSON.parse(raw);
    return parsed.map(item => {
      if (!item.personalized && item.rekomendasi_detail) {
        try {
          item.personalized = JSON.parse(item.rekomendasi_detail);
        } catch {
          item.personalized = null;
        }
      }
      return item;
    });
  } catch {
    return initialDemoData;
  }
};

export const saveLocalExamination = ({
  nama,
  jenis_kelamin,
  tanggal_lahir,
  umur_bulan,
  berat_badan,
  tinggi_badan,
  foto_url = null
}) => {
  const age = Number(umur_bulan) || 0;
  const h = Number(tinggi_badan) || 0;
  const w = Number(berat_badan) || 0;

  // Run pure WHO & Pediatric Advisor in frontend
  const aiResult = predictWHO(age, jenis_kelamin, h, w);

  const newRecord = {
    id: 'local-' + Date.now(),
    data_id: 'local-balita-' + Date.now(),
    nama,
    jenis_kelamin,
    tanggal_lahir,
    umur_bulan: age,
    berat_badan: w,
    tinggi_badan: h,
    foto_url,
    status_stunting: aiResult.status_stunting,
    status_detail: aiResult.status_detail,
    tingkat_risiko: aiResult.tingkat_risiko,
    tingkat_risiko_detail: aiResult.tingkat_risiko_detail,
    z_score: aiResult.z_score,
    rekomendasi: aiResult.rekomendasi,
    rekomendasi_detail: aiResult.rekomendasi_detail,
    personalized: aiResult.personalized,
    model_version: 'WHO Antropometri + Adaptive Pediatric Advisor (Offline Mode)',
    analyzed_at: new Date().toISOString()
  };

  const list = getLocalExaminations();
  list.unshift(newRecord);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));

  return newRecord;
};

export const deleteLocalExamination = (id) => {
  const list = getLocalExaminations().filter(item => item.id !== id && item.data_id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return list;
};

export const getLocalStats = () => {
  const list = getLocalExaminations();
  const totalPemeriksaan = list.length;
  const uniqueChildren = new Set(list.map(item => item.nama?.toLowerCase().trim())).size;

  let stuntingCount = 0;
  let normalCount = 0;
  let severeStuntingCount = 0;
  let maleCount = 0;
  let femaleCount = 0;

  list.forEach(item => {
    const z = parseFloat(item.z_score) || 0;
    if (item.status_stunting === 'Terindikasi Stunting') {
      stuntingCount++;
      if (z < -3.0) severeStuntingCount++;
    } else {
      normalCount++;
    }
    if (item.jenis_kelamin === 'L') maleCount++;
    else if (item.jenis_kelamin === 'P') femaleCount++;
  });

  const normalPercentage = totalPemeriksaan > 0 
    ? Math.round((normalCount / totalPemeriksaan) * 100) 
    : 100;

  const priorityChildren = list
    .filter(item => (parseFloat(item.z_score) || 0) < -1.8)
    .slice(0, 5);

  const recentActivities = list.slice(0, 5);

  return {
    total_balita: uniqueChildren,
    total_pemeriksaan: totalPemeriksaan,
    normal_count: normalCount,
    stunting_count: stuntingCount,
    severe_stunting_count: severeStuntingCount,
    normal_percentage: normalPercentage,
    gender_distribution: { laki_laki: maleCount, perempuan: femaleCount },
    priority_children: priorityChildren,
    recent_activities: recentActivities
  };
};

