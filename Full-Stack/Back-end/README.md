# Backend Sistem Deteksi Stunting API

Backend API untuk sistem deteksi stunting SIDIAS menggunakan Node.js dan Express.js.

Project ini masih berada pada tahap pengembangan awal dan saat ini difokuskan untuk pengelolaan data balita serta pondasi sistem analisis indikator stunting berdasarkan data pertumbuhan anak seperti usia, berat badan, dan tinggi badan.

## Fitur Saat Ini

- REST API CRUD data balita
- Validasi input data
- Perhitungan umur otomatis dari tanggal lahir
- Struktur project Express.js
- Automated testing menggunakan Jest dan Supertest
- Dokumentasi testing menggunakan Postman Collection

---

## Development Log

### 7 Mei 2026

- Setup awal project Node.js dengan ES Modules
- Membuat struktur backend Express.js
- Implementasi CRUD data balita menggunakan mock data sementara
- Setup testing menggunakan Jest dan Supertest
- Memisahkan `app.js` dan `server.js` agar testing tidak bentrok dengan server

### 9 Mei 2026

- Menambahkan validasi input pada endpoint POST dan PUT
- Menambahkan perhitungan otomatis umur balita berdasarkan tanggal lahir
- Penyesuaian controller dan routing
- Menambahkan Postman Collection untuk testing manual API
- implementasi in memory testing menggunakan Jest dan Supertest
- Setup database dan controller untuk menyimpan analisis data stunting dan riwayat pengukuran

### 19 Mei 2026

- Migrasi penyimpanan data dari in-memory (array) ke database PostgreSQL
- Pembuatan _DDL schema_ (`schema.sql`) untuk tabel dan relasi sesuai ERD
- Implementasi koneksi pool menggunakan `pg` dan pengaturan konfigurasi via `.env`
- Refaktor seluruh fungsi controller untuk menjalankan operasi SQL (`pool.query`) secara asinkron
- Memperbarui test suite (TDD) menjadi Integration Testing yang langsung berinteraksi dengan PostgreSQL
- Merapikan komentar di backend agar lebih jelas

### 24 Mei 2026

- Mengintegrasikan Frontend (React/Vite) dengan Backend (Node.js/Express)
- Menambahkan middleware `cors` pada Backend agar dapat menerima request HTTP dari origin Frontend
- Membuat konfigurasi `.env` pada Frontend untuk menyimpan URL API Backend
- Membuat API Service `dataBalitaService.js` untuk menangani *POST request*
- Merombak halaman `Diagnosis.jsx` menjadi *Form Input Data Balita* yang estetik menggunakan Tailwind CSS
- Menguji alur *End-to-End* (E2E) untuk memastikan data dari form UI Frontend berhasil tersimpan ke dalam database PostgreSQL

### 27 Mei 2026

- **Unggah Foto & Boundary multipart/form-data**: Menyelaraskan konfigurasi penyimpanan foto menggunakan `multer` di Backend dan `Content-Type: undefined` di Frontend Axios untuk penanganan multipart form data.
- **Penyempurnaan Skema Database (`analisis`)**: Menambahkan 4 kolom detail baru (`status_detail`, `tingkat_risiko_detail`, `indikator_detail`, dan `rekomendasi_detail`) ke skema database PostgreSQL (`schema.sql`).
- **Refaktor Controller Analisis**: Memperbarui controller analisis (`createAnalisis` dan `updateAnalisis`) agar dapat menyimpan dan mengembalikan data detail baru dari database.
- **Join Query Riwayat Balita**: Memperbarui fungsi `getAllDataBalita` menggunakan query `LEFT JOIN` ke tabel `analisis` agar data status analisis langsung tersaji saat mengambil riwayat balita.

### 28 Mei 2026

- **Sistem Autentikasi JWT**: Mengimplementasikan sistem registrasi (menggunakan `bcryptjs` untuk hashing password) dan login dengan penerbitan JWT token (`jsonwebtoken`) terenkripsi di rute `/api/auth`.
- **Middleware Keamanan Backend**: Membuat `authMiddleware.js` untuk melindungi seluruh endpoint `/api/data-balita` dan `/api/analisis`.
- **Role-Based Access Control (RBAC)**: Mengimplementasikan filter NIK (`created_by`) di controller balita dan analisis. Akun dengan peran `user` hanya dapat mengakses dan mengelola data miliknya sendiri, sementara akun `admin` (seperti akun default `admin` / `admin123`) memiliki akses global untuk melihat seluruh data posyandu di sistem.
- **Skrip Seeding Database**: Membuat skrip `seed-admin.js` untuk menginisialisasi akun admin dengan password ter-hash secara otomatis ke database PostgreSQL.
- **Pembersihan Codebase**: Melakukan audit dan pembersihan berkas-berkas sisa/sia-sia pada frontend (`authService.js`, `Home.jsx`, dan `NotFound.jsx`) agar proyek lebih tertata dan optimal.

### 29 Mei 2026

- **Integrasi AI Random Forest**: Mengintegrasikan model prediksi stunting berbasis Random Forest (`predict.py`) ke dalam alur `createAnalisis`. Backend menjalankan skrip Python via `child_process.exec` secara otomatis saat data balita baru dianalisis, menghasilkan status stunting, tingkat risiko, indikator, z-score, dan rekomendasi.
- **Otorisasi Hapus Berbasis Kepemilikan (Ownership-Based Delete)**: Memperbarui logika `deleteAnalisis` dan `deleteDataBalita` dengan validasi kepemilikan yang lebih robust — menggunakan konversi eksplisit `String().trim()` pada perbandingan NIK untuk mencegah ketidakcocokan tipe data antara database dan JWT payload.
- **Penghapusan Fitur Hapus di Frontend**: Menghapus seluruh UI fitur hapus (tombol 3 titik, dropdown menu, dan handler `handleDelete`) dari halaman `History.jsx` atas permintaan pengguna. Endpoint `DELETE /api/analisis/:id` tetap tersedia di backend untuk keperluan API.
- **Hasil TDD**: Seluruh 17 test case (2 test suites: `analisis.test.js` dan `dataBalita.test.js`) berhasil lulus 100%.

### 31 Mei 2026

- **Integrasi Model Deep Learning MobileNetV2**: Memindahkan model visual MobileNetV2 ke `Back-End/AI/saved_model_mobilenet/` dan membuat skrip inferensi `predict_mobilenet.py` untuk mengklasifikasi status gizi visual balita dari gambar (224x224).
- **Logika Ensemble (Random Forest + MobileNetV2)**: Memperbarui `analisisController.js` agar menjalankan kedua model AI secara paralel menggunakan `Promise.all` ketika foto di-upload. Hasil analisis klinis (Random Forest) dan visual (MobileNetV2) digabungkan secara logis untuk memberikan diagnosis gizi yang komprehensif.
- **Pencegahan Overflow Database**: Menambahkan mekanisme *defensive clamping* pada `z_score` (membatasinya pada rentang `-99.99` hingga `99.99`) untuk menghindari galat *numeric field overflow* pada kolom `DECIMAL(4,2)` database PostgreSQL ketika memproses nilai IMT ekstrem.
- **Penyederhanaan Form (Upload Foto Opsional)**: Mengubah validasi form di Front-End (`Diagnosis.jsx`) agar upload foto bersifat opsional. Jika foto tidak diunggah, backend akan otomatis menggunakan model fallback tunggal Random Forest.
- **Hasil Pengujian**: Seluruh 17 tes integrasi backend tetap lulus 100% dan verifikasi fungsional end-to-end menunjukkan penggabungan hasil ensemble berjalan normal di database.

---

## Tools

- Node.js
- Express.js
- Jest
- Supertest
- Nodemon
- Postman
- PostgreSQL
- pg (node-postgres)
- CORS

---

## Cara Menjalankan Project

**1. Install Dependencies**

```bash
npm install
```

**2. Jalankan Development Server**
Menggunakan nodemon agar server otomatis me-restart saat ada perubahan file:

```bash
npm run dev
```

**3. Jalankan Automated Tests**
Mengeksekusi skenario TDD dengan Jest:

```bash
npm test
```
