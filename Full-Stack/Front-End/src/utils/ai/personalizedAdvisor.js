/**
 * SIDIAS Personalized Pediatric AI Advisor
 * 
 * Menghasilkan rekomendasi gaya hidup, nutrisi, olahraga, dan pola tidur
 * yang dipersonalisasi secara adaptif berdasarkan:
 * 1. 5 Klaster Usia (0-5, 6-8, 9-11, 12-23, 24-59 bulan)
 * 2. 4 Skenario Klinis & Proyeksi Masa Depan:
 *    - Skenario A: Stunting Kejar Tumbuh (Catch-up Growth)
 *    - Skenario B: Sehat Berisiko Menuju Stunting (Growth Faltering Warning)
 *    - Skenario C: Stunting tapi Aktif & Sehat (Lifestyle Optimization)
 *    - Skenario D: Pertumbuhan Sehat & Optimal
 * 3. Analisis Multivariat (Tinggi vs Berat vs IMT)
 */

export function generatePersonalizedAdvice({
  umur_bulan,
  jenis_kelamin,
  tinggi_badan,
  berat_badan,
  zScore,
  imt,
  visualDetail = ''
}) {
  const age = Math.max(0, Math.round(Number(umur_bulan) || 0));
  const z = Number(zScore) || 0;
  const bmi = Number(imt) || (berat_badan / Math.pow(tinggi_badan / 100, 2));
  const sexLabel = (jenis_kelamin || 'L').toUpperCase() === 'L' ? 'Laki-laki' : 'Perempuan';

  // 1. Tentukan Klaster Usia
  let ageBracket = '0_5';
  let ageBracketLabel = '0–5 Bulan (Fase ASI Eksklusif)';
  if (age >= 6 && age <= 8) {
    ageBracket = '6_8';
    ageBracketLabel = '6–8 Bulan (Fase MPASI Awal / Tekstur Saring)';
  } else if (age >= 9 && age <= 11) {
    ageBracket = '9_11';
    ageBracketLabel = '9–11 Bulan (Fase MPASI Lanjutan / Tekstur Cincang)';
  } else if (age >= 12 && age <= 23) {
    ageBracket = '12_23';
    ageBracketLabel = '12–23 Bulan (Fase Makanan Keluarga & 1000 HPK)';
  } else if (age >= 24) {
    ageBracket = '24_59';
    ageBracketLabel = `${Math.floor(age / 12)} Tahun ${age % 12} Bulan (Fase Balita & Prasekolah)`;
  }

  // 2. Evaluasi Skenario Klinis
  let scenario = 'optimal_growth';
  let scenarioTitle = 'Pertumbuhan Sehat & Optimal';
  let badgeColor = 'emerald';

  if (z < -3.0) {
    scenario = 'stunting_catchup';
    scenarioTitle = 'Stunting Berat: Butuh Akselerasi Kejar Tumbuh (Catch-up Growth)';
    badgeColor = 'rose';
  } else if (z < -2.0) {
    // Cek apakah anak bugar (BMI normal atau di atas median) vs kurus
    if (bmi >= 15.0 && bmi <= 18.0) {
      scenario = 'stunted_active_healthy';
      scenarioTitle = 'Terindikasi Stunting tapi Bugar & Aktif';
      badgeColor = 'amber';
    } else {
      scenario = 'stunting_catchup';
      scenarioTitle = 'Terindikasi Stunting: Perlu Intervensi Kejar Tumbuh';
      badgeColor = 'rose';
    }
  } else if (z >= -2.0 && z < -1.4) {
    // Ambang batas garis kuning (growth faltering)
    scenario = 'growth_faltering_risk';
    scenarioTitle = 'Tampak Sehat Namun Berisiko Menuju Stunting (Waspada Garis Kuning)';
    badgeColor = 'orange';
  } else {
    scenario = 'optimal_growth';
    scenarioTitle = 'Pertumbuhan Normal & Optimal';
    badgeColor = 'emerald';
  }

  // 3. Proyeksi Masa Depan (Future Projection)
  let proyeksiMasaDepan = '';
  if (scenario === 'stunting_catchup') {
    proyeksiMasaDepan = `Saat ini nilai Z-score tinggi badan anak (${z.toFixed(2)} SD) berada jauh di bawah kurva standar WHO. Jika kondisi ini dibiarkan tanpa intervensi nutrisi intensif, dalam 6–12 bulan ke depan anak berisiko mengalami keterlambatan perkembangan kognitif, penurunan imunitas tubuh terhadap infeksi berulang, dan tinggi badan dewasa yang tidak maksimal. Namun, jika intervensi protein hewani ganda dan pola tidur lelap diterapkan mulai hari ini, anak masih memiliki peluang kejar tumbuh (catch-up growth) hingga 80-90% sebelum lempeng tulang menutup.`;
  } else if (scenario === 'growth_faltering_risk') {
    proyeksiMasaDepan = `Peringatan Dini: Meskipun saat ini fisik anak tampak cukup sehat, posisi tinggi badan (${z.toFixed(2)} SD) berada di batas ambang kritis (-2 SD). Jika pola makan anak saat ini (termasuk kebiasaan memilih-milih makanan atau ngemil manis) diteruskan, anak diperkirakan akan tergelincir masuk ke kategori Stunting dalam 2 hingga 4 bulan ke depan. Intervensi sekarang adalah saat yang paling tepat dan paling mudah untuk mengembalikan lintasan pertumbuhan ke zona hijau.`;
  } else if (scenario === 'stunted_active_healthy') {
    proyeksiMasaDepan = `Anak menunjukkan daya tahan fisik dan metabolisme yang baik (berat badan dan indeks massa tubuh ${bmi.toFixed(1)} berada dalam rentang wajar dan aktif). Namun, tinggi badannya (${tinggi_badan} cm) tertinggal dari rata-rata anak seusianya. Jika dibiarkan, anak tetap sehat tetapi potensi tinggi genetik dan volume jaringan otaknya tidak tereksplorasi penuh. Dengan fokus pada mikronutrien pemanjang tulang (Kalsium, Zinc, Vitamin D3) dan olahraga lempeng tulang, tinggi badan anak dapat diakselerasi tanpa menimbulkan kegemukan.`;
  } else {
    proyeksiMasaDepan = `Kabar gembira! Laju pertumbuhan tinggi dan berat badan anak saat ini (${z.toFixed(2)} SD) berada di zona aman standar WHO. Jika pola makan gizi seimbang dan stimulasi aktif ini terus dipertahankan secara konsisten, anak memiliki peluang tinggi untuk tumbuh dengan kecerdasan optimal, imunitas kuat, dan postur tubuh yang ideal sesuai potensi genetiknya.`;
  }

  // 4. Rekomendasi Makanan Spesifik Berdasarkan Usia & Skenario
  let makanan = {
    fokus_utama: '',
    sarapan: '',
    makan_siang: '',
    makan_malam: '',
    camilan_sehat: '',
    target_protein_harian: ''
  };

  if (ageBracket === '0_5') {
    makanan.fokus_utama = 'ASI Eksklusif sesuai permintaan bayi (on-demand), minimal 8–12 kali per hari tanpa tambahan air putih, madu, formula, atau makanan padat apapun.';
    makanan.sarapan = 'ASI langsung dari payudara ibu (minimal 15-20 menit per payudara untuk mendapatkan hindmilk kaya lemak).';
    makanan.makan_siang = 'ASI langsung atau ASI perah higienis.';
    makanan.makan_malam = 'ASI sebelum tidur malam dan saat bayi terbangun di malam hari.';
    makanan.camilan_sehat = 'Tidak diperbolehkan camilan apapun. Nutrisi ibu yang menyusui harus diperkaya telur, ikan, daging, dan sayuran hijau.';
    makanan.target_protein_harian = 'ASI eksklusif ad-libitum (memastikan popok basah minimal 6x per hari sebagai tanda kecukupan cairan & kalori).';
  } else if (ageBracket === '6_8') {
    makanan.fokus_utama = 'MPASI pertama tekstur bubur lumat saring kental (tidak tumpah saat sendok dimiringkan). Wajib mengandung protein hewani dan lemak tambahan.';
    makanan.sarapan = 'Bubur beras putih + hati ayam kampung cincang saring + bayam halus + 1 sdt minyak kelapa/santan matang.';
    makanan.makan_siang = 'Bubur kentang + kuning telur rebus lumat + labu kuning halus + 1 sdt minyak zaitun/margarin.';
    makanan.makan_malam = 'Bubur beras + daging ikan kembung/lele kukus saring + wortel lumat + santan peras murni.';
    makanan.camilan_sehat = 'Puree pisang ambon matang atau alpukat kerok lumat (1 kali sehari di antara jam makan).';
    makanan.target_protein_harian = '1 butir telur utuh ATAU 30 gram hati ayam/ikan kembung setiap hari.';
  } else if (ageBracket === '9_11') {
    makanan.fokus_utama = 'MPASI lanjutan dengan tekstur cincang halus atau nasi tim lembik, disertai finger food bergizi untuk melatih motorik oral dan refleks kunyah.';
    makanan.sarapan = 'Nasi tim ayam cincang + wortel parut + sup kaldu tulang sapi hangat.';
    makanan.makan_siang = 'Nasi tim ikan lele goreng tepung cincang + tumis labu siam santan + tahu tempe halus.';
    makanan.makan_malam = 'Nasi lembik + telur dadar cincang lembut + sup bayam jagung manis.';
    makanan.camilan_sehat = 'Finger food: potongan kukus wortel manis, pisang raja iris, atau puding santan kacang hijau buatan rumah.';
    makanan.target_protein_harian = '1-2 butir telur puyuh + 40 gram ikan/daging ayam cincang setiap hari.';
  } else if (ageBracket === '12_23') {
    makanan.fokus_utama = 'Makanan keluarga gizi seimbang dengan porsi piring makan anak. Terapkan strategi protein hewani ganda (2 jenis sumber protein hewani dalam sehari).';
    makanan.sarapan = 'Nasi pulen + telur mata sapi setengah matang/matang + kuah sup sayur oyong dan bakso ikan.';
    makanan.makan_siang = 'Nasi + pepes ikan kembung bumbu kuning + perkedel tahu daging cincang + lalap mentimun rebus.';
    makanan.makan_malam = 'Nasi + ayam ungkep bumbu rempah goreng + tempe mendoan + sayur bening kelor/bayam.';
    makanan.camilan_sehat = 'Ubi jalar kukus tabur keju parut, buah potong semangka/pepaya segar, atau jagung susu keju homemade.';
    makanan.target_protein_harian = '2 jenis protein hewani: misal 1 butir telur ayam + 1 potong ikan kembung/ayam (total minimal 15-20 gram protein murni/hari).';
  } else {
    // 24 - 59 bulan
    makanan.fokus_utama = 'Pola makan gizi seimbang 3 kali makan utama dan 2 kali camilan sehat. Penuhi prinsip Isi Piringku: 1/3 karbohidrat, 1/3 sayur & buah, 1/3 lauk pauk kaya protein hewani.';
    makanan.sarapan = 'Nasi goreng kampung telur orak-arik + suwiran daging ayam + potongan tomat segar.';
    makanan.makan_siang = 'Nasi putih + semur daging sapi/ayam empuk + perkedel kentang + tumis buncis wortel.';
    makanan.makan_malam = 'Nasi + ikan lele bakar mentega + tahu goreng gurih + sayur lodeh sayuran.';
    makanan.camilan_sehat = 'Roti bakar selai kacang/keju, pisang panggang madu, atau bakpao kukus isi daging cincang.';
    makanan.target_protein_harian = 'Minimal 20–25 gram protein hewani per hari (kombinasi telur, ikan, susu, daging, unggas).';
  }

  // Modifikasi makanan jika kasus stunting_catchup
  if (scenario === 'stunting_catchup') {
    makanan.fokus_utama += ' [AKSELERASI]: Tambahkan 1 sdt santan murni atau minyak kelapa sawit/kelapa ke dalam setiap porsi nasi tim untuk mendongkrak kalori hingga 100-150 kkal tanpa membuat perut begah.';
  }

  // 5. Rekomendasi Minuman (Dianjurkan vs Dilarang)
  let minuman = {
    dianjurkan: [],
    dilarang: [],
    catatan_hidrasi: ''
  };

  if (age < 6) {
    minuman.dianjurkan = [
      'ASI Eksklusif langsung dari payudara ibu atau ASI perah steril.',
      'Tidak perlu air putih, jus, madu, ataupun teh manis.'
    ];
    minuman.dilarang = [
      'Air tajin / air putih berlebih (dapat memicu hiponatremia dan membuat kenyang semu).',
      'Susu formula tanpa rekomendasi indikasi medis dari dokter anak.',
      'Madu (risiko botulisme pada bayi di bawah 1 tahun).'
    ];
    minuman.catatan_hidrasi = 'Kebutuhan cairan 100% tercukupi lewat ASI.';
  } else if (age < 12) {
    minuman.dianjurkan = [
      'ASI diteruskan sebagai sumber cairan dan antibodi utama.',
      'Air putih matang hangat 50–100 ml setelah makan untuk membilas mulut dan mencegah konstipasi.',
      'Air kaldu daging/ayam murni tanpa MSG berlebih.'
    ];
    minuman.dilarang = [
      'Teh manis atau teh tawar (mengandung tanin yang mengikat zat besi dan kalsium hingga 70%).',
      'Kopi atau minuman herbal racikan.',
      'Kental manis (bukan susu, melainkan gula pekat dengan sedikit susu).',
      'Minuman sari buah kemasan berpemanis buatan.'
    ];
    minuman.catatan_hidrasi = 'Berikan air putih sedikit demi sedikit setelah makan, jangan berikan sebelum makan agar nafsu makan tidak turun.';
  } else {
    minuman.dianjurkan = [
      'Air putih matang bersih minimal 800–1200 ml per hari (4–5 gelas).',
      'Susu sapi murni / susu pertumbuhan / UHT plain terfortifikasi kalsium dan vitamin D (maksimal 400–500 ml/hari).',
      'Jus buah segar asli tanpa gula tambahan (misal jeruk, melon, jambu biji kaya vitamin C).'
    ];
    minuman.dilarang = [
      'Teh manis (sering diberikan orang tua sebagai pengganti air putih; sangat berbahaya memicu anemia defisiensi besi).',
      'Minuman bersoda atau minuman serbuk kemasan dengan pewarna & pemanis buatan.',
      'Kental manis dijadikan susu utama (dapat memicu kerusakan gigi dan malnutrisi gizi salah).',
      'Minuman berkafein atau boba/minuman kekinian.'
    ];
    minuman.catatan_hidrasi = 'Jangan biarkan anak memegang botol susu sepanjang hari. Batasi konsumsi susu agar anak merasa lapar pada jam makan makanan utama.';
  }

  // 6. Rekomendasi Olahraga & Aktivitas Fisik (Perangsang Lempeng Tulang)
  let olahraga = {
    durasi_harian: '30–60 menit per hari (dibagi menjadi sesi pagi dan sore)',
    jenis_aktivitas: [],
    tujuan_stimulasi: 'Menstimulasi lempeng epifisis (lempeng pertumbuhan tulang panjang) dan memperkuat kepadatan mineral tulang.'
  };

  if (age < 6) {
    olahraga.jenis_aktivitas = [
      'Tummy Time (tengkurap teratur): 3–5 menit sebanyak 2–3 kali sehari di atas matras datar untuk melatih otot leher, bahu, dan punggung.',
      'Gerakan gowes sepeda perlahan pada kedua kaki bayi untuk melatih kelenturan panggul dan melancarkan pencernaan.',
      'Meraba dan menggenggam mainan kerincingan (rattle) untuk stimulasi sensorik-motorik halus.'
    ];
  } else if (age < 12) {
    olahraga.jenis_aktivitas = [
      'Merangkak aktif mengejar bola atau mainan bersuara di atas lantai beralas matras empuk.',
      'Latihan berdiri berpegangan pada sofa atau meja kokoh (cruising) untuk merangsang beban pada tulang paha dan betis.',
      'Bermain cilukba dan menjatuhkan-mengambil balok mainan untuk melatih kekuatan otot inti tubuh.',
      'Berenang atau bermain air dengan pelampung leher/badan di kolam renang anak hangat.'
    ];
  } else if (age < 24) {
    olahraga.jenis_aktivitas = [
      'Berjalan dan berlari kecil di halaman berumput atau taman terbuka tanpa alas kaki sesekali untuk melatih lengkung telapak kaki.',
      'Latihan menaiki dan menuruni anak tangga pendek dengan pengawasan orang tua.',
      'Menendang bola plastik dan melempar bola ke dalam keranjang.',
      'Bergelantungan ringan (hanging) pada palang kayu rendah dengan tangan disangga orang tua selama 5–10 detik (sangat efektif merangsang pemanjangan tulang belakang).'
    ];
  } else {
    // 2-5 tahun
    olahraga.jenis_aktivitas = [
      'Lompat tali / melompati rintangan bantal rendah (gerakan melompat memberikan gaya kompresi dinamis pada lempeng epifisis lutut yang merangsang pertumbuhan tinggi).',
      'Bermain di perosotan, ayunan, dan monkey bar (bergelantungan) di taman bermain.',
      'Mengayuh sepeda roda tiga atau push-bike (balance bike) selama 20–30 menit.',
      'Berenang secara teratur 1–2 kali seminggu untuk melenturkan seluruh persendian tubuh.',
      'Bermain kejar-kejaran dan menari mengikuti irama musik anak-anak.'
    ];
  }

  // 7. Pola Tidur & Kebiasaan Sehat (Optimalisasi Human Growth Hormone - HGH)
  let polaTidur = {
    target_jam_tidur: age < 12 ? '12–14 jam sehari (termasuk 2x tidur siang)' : (age < 24 ? '11–13 jam sehari (termasuk 1x tidur siang)' : '10–12 jam sehari'),
    jam_tidur_malam_ideal: 'Maksimal pukul 20.30–21.00 WIB',
    alasan_medis: 'Hormon Pertumbuhan (Human Growth Hormone / HGH) dilepaskan oleh kelenjar pituitari secara maksimal pada fase Deep Sleep (tidur lelap gelombang lambat) antara pukul 21.00 hingga 01.00 dini hari. Jika anak sering tidur larut malam (> jam 22.00), pelepasan HGH berkurang drastis sehingga pertumbuhan tinggi badan terhambat.',
    tips_kebiasaan: [
      'Matikan lampu kamar tidur atau gunakan lampu tidur temaram hangat untuk merangsang produksi hormon melatonin alami.',
      'Hentikan paparan layar gadget/ponsel/televisi minimal 1 jam sebelum tidur (sinar biru layar mengacaukan ritme sirkadian anak).',
      'Terapkan rutinitas tidur yang tenang: cuci kaki & tangan, gosok gigi, dan membaca dongeng atau bernyanyi lembut bersama ibu.',
      'Paparan sinar matahari pagi (pukul 07.30–08.30) selama 15–20 menit untuk mengaktifkan sintesis Vitamin D3 alami pada kulit yang mengikat kalsium ke tulang.'
    ]
  };

  // 8. Suplementasi & Protokol Medis Kemenkes
  let suplementasi = [];
  if (age >= 6) {
    suplementasi.push('Kapsul Vitamin A dosis tinggi: 100.000 IU (kapsul biru) untuk usia 6–11 bulan; 200.000 IU (kapsul merah) untuk usia 12–59 bulan setiap bulan Februari dan Agustus di Posyandu/Puskesmas.');
  }
  if (scenario === 'stunting_catchup') {
    suplementasi.push('Suplemen Taburia (micronutrient powder) atau Sirup Zinc & Zat Besi (Fe) sesuai resep dan anjuran dokter anak/puskesmas.');
    suplementasi.push('Obat cacing (Albendazole) dosis terukur untuk anak di atas 1 tahun untuk mencegah cacingan yang menyedot nutrisi darah.');
  } else {
    suplementasi.push('Lengkapi seluruh imunisasi dasar dan lanjutan sesuai jadwal IDAI/Kemenkes.');
    suplementasi.push('Pemberian obat cacing rutin tiap 6 bulan sekali bagi anak usia di atas 1 tahun.');
  }

  // 9. Tanda Bahaya (Red Flags)
  let redFlags = [
    'Berat badan anak turun selama 2 bulan berturut-turut atau grafik KMS memotong garis merah ke bawah (2T).',
    'Anak sering demam tanpa sebab jelas, batuk lebih dari 2 minggu (waspada Tuberkulosis / TB anak yang menjadi pemicu stunting nomor 1).',
    'Kedua punggung kaki anak tampak bengkak/sembab jika ditekan (edema tanda gizi buruk kwashiorkor).',
    'Anak sangat lemas, pasif, menolak makan dan minum sama sekali (letargi).'
  ];

  return {
    scenario,
    scenario_title: scenarioTitle,
    badge_color: badgeColor,
    age_bracket: ageBracket,
    age_bracket_label: ageBracketLabel,
    sex_label: sexLabel,
    proyeksi_masa_depan: proyeksiMasaDepan,
    rekomendasi_makanan: makanan,
    rekomendasi_minuman: minuman,
    rekomendasi_olahraga: olahraga,
    pola_tidur_hgh: polaTidur,
    suplementasi: suplementasi,
    red_flags: redFlags,
    jadwal_kontrol: scenario === 'stunting_catchup' 
      ? 'Evaluasi berat badan setiap 2 minggu sekali dan tinggi badan setiap 1 bulan sekali di Posyandu/Puskesmas terdekat.'
      : 'Pemeriksaan rutin setiap 1 bulan sekali di Posyandu sesuai jadwal penimbangan bulanan.'
  };
}

