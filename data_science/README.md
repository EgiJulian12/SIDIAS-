## 📁 Data Dictionary (Kamus Data) — Proyek SIDIAS

Proyek SIDIAS menggunakan pendekatan *Hybrid/Multi-modal Analysis*, menggabungkan data rekam medis antropometri anak berbentuk tabular berukuran ~40.000 baris data yang divalidasi silang menggunakan standar referensi tabel pertumbuhan anak World Health Organization (WHO) 2006 untuk analisis makro dan dataset citra/gambar untuk pelatihan model klasifikasi berbasis *Deep Learning*. Berikut adalah detail dokumentasi struktur data yang digunakan:

### 1. Data Primer Lapangan (Raw Data Tabular - `.csv`)
Data mentah hasil pencatatan antropometri balita dari lapangan yang digunakan sebagai basis fitur utama.

| Nama Kolom | Tipe Data | Deskripsi | Batasan / Contoh Nilai |
| :--- | :--- | :--- | :--- |
| `jenis_kelamin` | Categorical (String) | Jenis kelamin dari balita yang diperiksa. | `Laki-laki`, `Perempuan` |
| `usia_bulan` | Numeric (Float) | Usia balita pada saat pengukuran dilakukan (dalam satuan bulan). | `0.0` s/d `60.0` |
| `tinggi_badan` | Numeric (Float) | Tinggi atau panjang badan balita saat pemeriksaan (dalam satuan cm). | `45.0` s/d `120.0` |
| `berat_badan` | Numeric (Float) | Berat badan balita saat pemeriksaan (dalam satuan kg). | `2.0` s/d `30.0` |
| `zscore_tb_u` | Numeric (Float) | Nilai *Z-Score* antropometri asli dari lapangan untuk indeks Tinggi Badan menurut Umur (TB/U). | Angka desimal (Contoh: `-2.45`, `1.20`) |
| `status_tb_u` | Categorical (String) | Status klinis pertumbuhan fisik anak berdasarkan indeks TB/U standar lapangan. | `Normal`, `Stunting` |
| `zscore_bb_u` | Numeric (Float) | Nilai *Z-Score* asli lapangan untuk indeks Berat Badan menurut Umur (BB/U). | Angka desimal (Contoh: `-1.80`) |
| `status_bb_u` | Categorical (String) | Status kondisi berat badan balita berdasarkan indeks BB/U (indikator gizi umum). | `Normal`, `Gizi Kurang`, `Gizi Buruk` |
| `zscore_bb_tb` | Numeric (Float) | Nilai *Z-Score* asli lapangan untuk indeks Berat Badan menurut Tinggi Badan (BB/TB). | Angka desimal (Contoh: `0.15`) |
| `status_bb_tb` | Categorical (String) | Status klinis kedaruratan gizi akut (*wasting*) berdasarkan indeks BB/TB. | `Normal`, `Kurus`, `Sangat Kurus` |

### 2. Fitur Rekayasa & Referensi Baku WHO (*Engineered & Reference Features*)
Fitur baru yang ditransformasikan dan dihasilkan melalui proses kalkulasi internal (*ETL/EDA Pipeline*) berbasis parameter LMS standar WHO 2006.

| Nama Kolom | Tipe Data | Deskripsi | Batasan / Contoh Nilai |
| :--- | :--- | :--- | :--- |
| `usia_int` | Numeric (Integer) | Pembulatan nilai `usia_bulan` ke bilangan bulat terdekat untuk kebutuhan integrasi (*merging*) data WHO. | `0` s/d `60` |
| `kelompok` | Categorical (Ordinal) | Pengelompokan umur balita ke dalam interval 6 bulanan untuk kebutuhan analisis tren fluktuasi usia (Q1). | `'0-6'`, `'6-12'`, ..., `'54-60'` |
| `l` / `m` / `s` | Numeric (Float) | Parameter Lambda (*skewness*), Median, dan Sigma (*coefficient of variation*) resmi dari WHO baku untuk kalkulasi rumus Z-Score ideal. | Angka desimal baku WHO |
| `who_zscore` | Numeric (Float) | Nilai *Z-Score* murni hasil kalkulasi rumus LMS WHO sebagai validasi data lapangan. | Angka desimal (Contoh: `-2.58`) |
| `selisih_z` | Numeric (Float) | Nilai selisih (deviasi) antara Z-Score lapangan dengan Z-Score ideal WHO untuk mendeteksi tingkat galat alat ukur (Q3). | Angka desimal (Contoh: `0.13`) |
| `kondisi` | Categorical (String) | Fitur komposit multi-dimensi untuk memetakan irisan klaster penyakit penyerta / beban ganda malnutrisi (Q4). | `Normal semua`, `Stunting saja`, `Stunting + Gizi buruk`, `Triple burden` |
| `zona_who` | Categorical (Ordinal) | Klasterisasi zonasi pertumbuhan masa *Golden Age* (<24 bulan) untuk mendeteksi risiko stunting tersembunyi (Q5). | `Severely Stunted`, `Stunting`, `Zona Waspada`, `Normal Bawah`, `Normal`, `Tinggi` |
| `flag_stunting` | Boolean (Binary) | Penanda biner status stunting (1 = Stunting, 0 = Tidak) untuk mempermudah operasi statistik agregat dan pemodelan. | `1`, `0` |
| `flag_gizi_buruk`| Boolean (Binary) | Penanda biner status masalah gizi berat (1 = Gizi Buruk/Kurang, 0 = Normal). | `1`, `0` |
| `flag_kurus` | Boolean (Binary) | Penanda biner status anak kurus (1 = Kurus/Sangat Kurus, 0 = Normal). | `1`, `0` |

### 3. Dataset Citra / Gambar (Input Pemodelan CNN)
Dokumentasi metadata, anotasi kelas, dan skema *data splitting* untuk berkas gambar citra fisik/grafik antropometri yang dilatih menggunakan model Convolutional Neural Network (CNN).

#### A. Spesifikasi Teknis Gambar
* **Format Berkas:** `.jpg``
* **Dimensi Resolusi Input:** $224 \times 224$ piksel (Standard Image Net Input)
* **Saluran Warna:** RGB (3 Channels)
* **Total Keseluruhan Gambar:** *2.199* Gambar

#### B. Distribusi Pembagian Dataset (*Data Splitting*)
| Subset Data | Persentase | Jumlah Gambar | Deskripsi Fungsi |
| :--- | :--- | :--- | :--- |
| **Training Set** | 80% | *1.695* | Data utama yang digunakan arsitektur CNN untuk ekstraksi fitur visual dan pembaruan bobot (*weights*) model. |
| **Validation Set**| 10% | *334* | Data independen yang dievaluasi pada setiap akhir *epoch* untuk memantau proses training dan mencegah *overfitting*. |
| **Testing Set** | 10% | *170* | Data uji final yang belum pernah dilihat oleh model untuk mengukur metrik akurasi (*evaluation metrics*) akhir. |
