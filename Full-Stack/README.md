# SIDIAS - Sistem Deteksi & Analisis Stunting (Full-Stack)

Repositori ini berisi kode sumber lengkap untuk aplikasi **SIDIAS** (Sistem Deteksi & Analisis Stunting). Aplikasi ini terdiri dari:
1. **Front-End**: React + Vite + TailwindCSS
2. **Back-end**: Node.js + Express.js + PostgreSQL
3. **AI Component**: Python (Ensemble Model: Random Forest & MobileNetV2)

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
