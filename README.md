# SIDIAS: Sistem Diagnosis Anak Stunting Berbasis Computer Vision dan AI untuk Penanganan Gizi Terpadu

**Tema Capstone:** Healthy Lives & Well-being  
**ID Tim Capstone Project:** CC26-PSU020

## 👥 Tim Kami
| ID Peserta | Nama | Role | Status |
|---|---|---|---|
| CFCC438D6Y1813 | Fairuz Istighfar | Full Stack | Aktif |
| CFCC482D6X1288 | Dela Deliansyah | Full Stack | Aktif |
| CDCC482D6Y0599 | Egi Julian | Data Science | Aktif |
| CDCC319D6X1000 | Dini Arya Putri | Data Science | Aktif |
| CACC482D6Y2469 | Mohammad Bisri Musthafa | AI Engineer | Aktif |
| CACC404D6X0172 | Elisabeth Margaretta | AI Engineer | Aktif |

---

## 📌 Ringkasan Eksekutif

### Latar Belakang & Alasan Pemilihan Proyek
Prevalensi stunting di Indonesia (21,6%) masih tertinggal dari target pemerintah (14%). Pemantauan gizi di posyandu mayoritas masih dieksekusi secara manual, sehingga rentan terhadap *human error* dan berisiko memicu kesalahan diagnosis. 

Sistem ini dirancang untuk mengotomatisasi ekstraksi digit alat ukur dan analisis biometrik wajah balita melalui algoritma **Computer Vision** secara non-invasif. Klasifikasi risiko gizi kemudian diproses menggunakan model **Machine Learning**. 

Guna mengatasi kendala sinyal di wilayah terpencil, SIDIAS diimplementasikan sebagai **Progressive Web App (PWA)** berarsitektur *offline-first*. Inovasi ini menjamin proses pendataan tetap berjalan penuh tanpa internet, memberikan manfaat efisiensi dan akurasi maksimal bagi instansi kesehatan.

---

## 🎯 Problem Statement (5W + 1H)
- **What:** Risiko ketidakakuratan diagnosis stunting akibat inkonsistensi pencatatan data dan subjektivitas dalam penilaian visual gejala fisik balita.
- **Who:** Berdampak pada keterlambatan penanganan bagi balita berisiko serta penurunan kualitas validitas data laporan kesehatan nasional. 
- **Where:** Di fasilitas pelayanan kesehatan primer dan Posyandu yang membutuhkan alat verifikasi klinis pendukung secara cepat. 
- **When:** Terjadi pada setiap periode pelaksanaan skrining tumbuh kembang rutin bulanan.
- **Why:** Metode konvensional belum memiliki sistem verifikasi visual otomatis untuk mendeteksi indikator malnutrisi melalui biometrik tubuh.
- **How:** Membangun aplikasi web yang memproses data input manual dan melakukan analisis citra biometrik wajah serta struktur fisik melalui kamera gawai.

---

## 🚀 Cakupan Proyek dan Hasil Kerja

### Garis Besar Batas-batas Proyek dan Metode Pemecahan Tugas
Cakupan proyek SIDIAS dibatasi pada pengembangan aplikasi berbasis web yang dioptimalkan untuk memindai angka pada alat ukur fisik dan menganalisis status gizi balita. 

Tugas perancangan sistem dipecahkan melalui pendekatan modular yang komprehensif, di mana pekerjaan dibagi ke dalam tiga jalur Learning Path:
- 💻 **Full Stack Development**
- 📊 **Data Science**
- 🤖 **AI Engineering**

Setiap jalur akan bekerja secara paralel dan terintegrasi untuk memastikan proyek dapat diserahkan secara utuh dan fungsional.

---

## 🛠️ Prasyarat Instalasi (Prerequisites)

Sebelum memulai instalasi lokal, pastikan Anda telah memasang perangkat lunak berikut di komputer Anda:
* **Node.js** (Rekomendasi versi LTS 18.x atau 20.x)
* **Python 3.10+** (Lengkap dengan `pip`)
* **PostgreSQL Database Server**
* **Git**

---

## 🚀 Langkah Instalasi & Menjalankan Aplikasi di Lokal

Ikuti langkah-langkah di bawah ini secara berurutan:

### 1. Kloning Repositori
Jika Anda belum mengkloning repositori ini, jalankan perintah berikut di terminal Anda:
```bash
git clone https://github.com/username/repositori-anda.git
cd nama-folder-project/Full-Stack
```

---

### 2. Konfigurasi & Setup Database (PostgreSQL)

1. Buka PostgreSQL client (seperti pgAdmin, DBeaver, atau via terminal `psql`).
2. Buat database baru bernama `sidias`:
   ```sql
   CREATE DATABASE sidias;
   ```
3. Buat tabel-tabel database dengan mengimpor skema dari file `Back-end/schema.sql`. 
   * **Jika menggunakan terminal (CLI):**
     ```bash
     psql -U postgres -d sidias -f Back-end/schema.sql
     ```
   * **Jika menggunakan pgAdmin/DBeaver:** Buka Query Tool, lalu salin isi dari berkas `Back-end/schema.sql` dan jalankan (Execute).

---

### 3. Setup & Menjalankan Back-end (Node.js & Python AI)

1. Masuk ke folder `Back-end` melalui terminal:
   ```bash
   cd Back-end
   ```
2. Pasang semua dependensi Node.js:
   ```bash
   npm install
   ```
3. Buat file `.env` di dalam folder `Back-end` dengan menyalin template atau membuat baru:
   ```env
   # Server Configuration
   PORT=5000

   # Database Configuration
   DB_USER=postgres
   DB_HOST=127.0.0.1
   DB_NAME=sidias
   DB_PASSWORD=12345   # Ganti dengan password PostgreSQL lokal Anda
   DB_PORT=5432

   # JWT Secret Key
   JWT_SECRET=supersecretkey123
   ```
4. **Setup Virtual Environment untuk Python AI:**
   * **Buat virtual environment (venv) baru:**
     ```bash
     python -m venv AI/venv
     ```
   * **Aktifkan virtual environment:**
     * **Windows (Command Prompt / CMD):**
       ```cmd
       AI\venv\Scripts\activate
       ```
     * **Windows (PowerShell):**
       ```powershell
       .\AI\venv\Scripts\activate.ps1
       ```
     * **macOS / Linux:**
       ```bash
       source AI/venv/bin/activate
       ```
   * **Install library Python yang dibutuhkan:**
     ```bash
     pip install -r AI/requirements.txt
     ```
5. **Jalankan Seed Admin** (membuat akun administrator awal di database):
   ```bash
   node seed-admin.js
   ```
6. **Jalankan Server Back-end:**
   ```bash
   npm run dev
   ```
   *Server backend akan berjalan di http://localhost:5000.*

---

### 4. Setup & Menjalankan Front-End (React Vite)

1. Buka terminal baru dan masuk ke folder `Front-End`:
   ```bash
   cd Front-End
   ```
2. Pasang semua dependensi frontend:
   ```bash
   npm install
   ```
3. Buat file `.env.development` di dalam folder `Front-End` untuk mengarahkan API secara lokal:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_API_BASE_URL=http://localhost:5000
   ```
4. Jalankan Server Front-end:
   ```bash
   npm run dev
   ```
   *Aplikasi frontend akan berjalan di http://localhost:5173 (atau port default lainnya yang tertera di terminal).*

---

## 🔑 Akun Login Default (Admin)

Setelah Anda menjalankan `node seed-admin.js` di langkah Back-end, gunakan kredensial berikut untuk masuk ke dashboard:
* **NIK:** `admin`
* **Password:** `admin123`

---

## 📌 Catatan Tambahan
* Jika Anda menjalankan aplikasi secara lokal untuk keperluan pengembangan, pastikan backend (`port 5000`) dan frontend (`port 5173`) berjalan secara bersamaan di terminal terpisah.
* Pastikan virtual environment Python (`venv`) telah diaktifkan saat menjalankan server backend agar model AI dapat memproses data dengan benar.
