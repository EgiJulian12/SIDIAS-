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

---

## Tools

- Node.js
- Express.js
- Jest
- Supertest
- Nodemon
- Postman

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