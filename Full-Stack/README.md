# SIDIAS - Sistem Deteksi & Analisis Stunting (Full-Stack)

Repositori ini berisi kode sumber lengkap untuk aplikasi **SIDIAS** (Sistem Deteksi & Analisis Stunting). Aplikasi ini terdiri dari:
1. **Front-End**: React + Vite + TailwindCSS
2. **Back-end**: Node.js + Express.js + PostgreSQL
3. **AI Component**: Python (Ensemble Model: Random Forest & MobileNetV2)

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
*Perintah ini akan secara otomatis mengunduh (pull) image Postgres, backend (`fairuzhere/sidias-backend:latest`), dan frontend (`fairuzhere/sidias-frontend:latest`) dari registry Docker Hub, kemudian menginisialisasi skema database serta menjalankan aplikasinya.*

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
