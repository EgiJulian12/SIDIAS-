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

Sebelum memulai instalasi, pastikan Anda telah memasang perangkat lunak berikut di komputer Anda:
* **Docker** & **Docker Compose** (Disarankan Docker Desktop untuk Windows/macOS, atau Docker Engine untuk Linux)
* **Git** (Untuk mengkloning kode sumber)

---

## 🚀 Langkah Instalasi & Menjalankan Aplikasi dengan Docker

Dengan menggunakan Docker, Anda tidak perlu memasang Node.js, Python, PostgreSQL, atau library AI secara manual di komputer Anda. Semua environment beserta dependensinya sudah dikontainerisasi secara otomatis.

### 1. Kloning Repositori & Navigasi ke Folder Full-Stack
Jika Anda belum mengkloning repositori ini, jalankan perintah berikut di terminal Anda:
```bash
git clone https://github.com/EgiJulian12/SIDIAS-.git
cd SIDIAS-/Full-Stack
```

### 2. Menjalankan Aplikasi (Menggunakan Image Jadi)
Untuk mempermudah penggunaan di PC lain tanpa perlu build dari awal, silakan gunakan perintah berikut di dalam folder `Full-Stack/`:
```bash
docker compose up -d
```
*Perintah ini akan secara otomatis mengunduh (pull) image Postgres, Backend, dan Frontend dari registry Docker Hub, kemudian menginisialisasi skema database serta menjalankan aplikasinya.*

Untuk memastikan semua kontainer berjalan dengan lancar, jalankan perintah:
```bash
docker compose ps
```

### 3. Menghentikan Aplikasi
Untuk mematikan semua layanan aplikasi, jalankan perintah:
```bash
docker compose down
```

---

## ⚙️ Build Ulang Image Lokal (Khusus Developer)

Jika Anda melakukan perubahan pada kode program di Front-End atau Back-End dan ingin men-build ulang image Docker secara lokal di PC Anda, ikuti langkah berikut:

1. **Membangun Ulang (Build) Image Lokal:**
   ```bash
   docker compose -f docker-compose.build.yml build
   ```
2. **Menjalankan Hasil Build Lokal:**
   ```bash
   docker compose -f docker-compose.build.yml up -d
   ```

---

## 🔑 Akun Login Default (Admin)

Ketika database PostgreSQL pertama kali dibuat, sistem backend secara otomatis menjalankan skema database dan membuat akun admin cadangan:
* **NIK:** `admin`
* **Password:** `admin123`

---

## 🌐 Akses Layanan Aplikasi
* **Frontend Web App:** [http://localhost](http://localhost) (Port 80)
* **Backend API Base URL:** [http://localhost:5000/api](http://localhost:5000/api) (Port 5000)
* **Database PostgreSQL:** Port `5432` (Username: `postgres`, Password: `sidias_password`, Database Name: `sidias`)

---

## Tautan Model AI
Link Google Drive : https://drive.google.com/drive/folders/1ek88NugRZs3cUxqjJrG51oiQaKO582MK