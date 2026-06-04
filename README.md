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

## Penjelasan Singkat SIDIAS

**SIDIAS** adalah sebuah platform berbasis *Artificial Intelligence* (AI) multimodal yang dirancang untuk mendeteksi dan memprediksi potensi risiko stunting pada balita secara dini, cepat, dan akurat. Platform ini menggabungkan analisis data klinis antropometri dan analisis visual fisik balita guna memberikan pendekatan screening yang komprehensif bagi orang tua, kader posyandu, dan tenaga medis.

---

## 🚀 Fitur Utama & Pendekatan AI Multimodal

SIDIAS menggunakan pendekatan **Ensemble Model Architecture** untuk mengolah dua jenis modalitas data yang berbeda (*Multimodal Dataset*):

* **Tabular Stunting Detection (Data Klinis):** Memprediksi status stunting menggunakan algoritma **Random Forest Classifier** berdasarkan data antropometri anak (Usia, Jenis Kelamin, Tinggi Badan, Berat Badan) serta fitur buatan klinis (*Feature Engineering*) seperti Indeks Massa Tubuh (IMT) dan Rasio Tinggi per Usia. Masalah *class imbalance* pada data diatasi menggunakan teknik **SMOTE**.
* **Visual Stunting Detection (Data Gambar):** Melakukan analisis karakteristik fisik luar balita melalui input foto secara langsung menggunakan arsitektur *Deep Learning* **MobileNetV2** yang efisien dan optimal untuk dijalankan di lingkungan web/mobile.

---

## 🛠️ Alur Kerja Sistem (Data Pipeline & Integration)

1.  **Form Input & Capture:** Pengguna memasukkan data antropometri dan mengunggah foto fisik balita melalui antarmuka web.
2.  **Preprocessing & Feature Engineering (Tabular):** Sistem secara otomatis menghitung nilai klinis IMT dan Rasio Tinggi per Usia berdasarkan input mentah (*data clean*).
3.  **Data Standardization:** Data tabular disinkronisasikan menggunakan komponen `StandardScaler` (`scaler.pkl`) ke dalam format *Z-Score* desimal sebelum diproses oleh model.
4.  **AI Dual Inference:** * Data klinis diproses oleh `random_forest_stunting_model.pkl`.
    * Data visual foto diproses oleh model `MobileNetV2` (`.h5` / SavedModel).
5.  **Ensemble Output:** Sistem mengombinasikan hasil prediksi untuk mengeluarkan diagnosis akhir status stunting balita beserta tingkat keyakinan (probabilitas) AI.

---

## 💻 Tech Stack Proyek

Arsitektur aplikasi dibangun dengan ekosistem modern yang terbagi menjadi tiga komponen utama:

* **Front-End:** React.js, Vite, dan TailwindCSS (Memberikan antarmuka yang responsif, cepat, dan *user-friendly*).
* **Back-End:** Node.js, Express.js, dan PostgreSQL (Sebagai basis data relasional untuk menyimpan riwayat rekam medis deteksi balita).
* **AI Component:** Python, Scikit-Learn (Random Forest & Preprocessing), TensorFlow/Keras (MobileNetV2), Pandas, dan Joblib.

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

---

## Tautan Model AI
Link Google Drive : https://drive.google.com/drive/folders/1ek88NugRZs3cUxqjJrG51oiQaKO582MK