# Backend Sistem Deteksi Stunting API

Backend starter project berbasis Node.js dan Express.js untuk **SIDIAS**. Project ini dibangun dirancang khusus untuk memproses parameter pertumbuhan anak (usia, berat badan, dan tinggi badan) sebagai fondasi algoritma indikator stunting. Seluruh endpoint juga telah dilengkapi dengan *automated testing* (TDD).

## Log Aktivitas & Dokumentasi

### [7 Mei 2026] - Setup Awal & Konfigurasi TDD
- **Inisialisasi Project**: Setup Node.js menggunakan sistem modul modern (`ES Modules`).
- **Express Server**: Pembuatan arsitektur server MVC dasar (Routes, Controllers, Middleware, Config).
- **RESTful API**: Implementasi operasi CRUD untuk entitas `Balita` menggunakan *mock data* (memory array sementara).
  - `GET /api/balita` (Mendapatkan semua data)
  - `GET /api/balita/:id` (Mendapatkan data spesifik)
  - `POST /api/balita` (Menambahkan data baru)
  - `PUT /api/balita/:id` (Mengubah data)
  - `DELETE /api/balita/:id` (Menghapus data)
- **Test-Driven Development (TDD)**: Konfigurasi alat pengujian otomatis menggunakan **Jest** dan **Supertest**. Menyusun 9 skenario pengujian dengan hasil kelulusan 100% (*Green*).
- **Refactoring Server**: Pemisahan instance Express ke `app.js` dan listening server ke `server.js` untuk mencegah bentrok port saat eksekusi *automated testing*.

dan nanti diupdate lagi
---

## Panduan Penggunaan

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
