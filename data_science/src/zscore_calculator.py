import pandas as pd
import numpy as np

class StuntingCalculator:
    def __init__(self, master_data_path):
        # Memuat data master yang sudah dibersihkan
        self.df_master = pd.read_csv(master_data_path)
        
    def calculate_z_score(self, measurement, l, m, s):
        z_score = (((measurement / m)**l) - 1) / (l * s)
        return round(z_score, 2)

    def get_status(self, z_score, indicator):
        # Logika kategori berdasarkan standar WHO
        if indicator == "TB/U":
            if z_score < -3: return "Sangat Pendek (Severely Stunted)"
            elif -3 <= z_score < -2: return "Pendek (Stunted)"
            elif -2 <= z_score <= 3: return "Normal"
            else: return "Tinggi"
        elif indicator == "BB/U":
            if z_score < -3: return "Berat Badan Sangat Kurang"
            elif -3 <= z_score < -2: return "Berat Badan Kurang"
            elif -2 <= z_score <= 2: return "Berat Badan Normal"
            else: return "Risiko Berat Badan Lebih"
        return "Unknown"

    def detect_stunting(self, nama, jenis_kelamin, usia_bulan, tinggi_cm, berat_kg):
        # 1. Ambil Parameter TB/U (Stunting) dari Data Master
        # Filter berdasarkan indikator, gender, dan bulan
        ref_tbu = self.df_master[
            (self.df_master['indicator'] == 'TB/U') & 
            (self.df_master['jenis_kelamin'] == jenis_kelamin) & 
            (self.df_master['month'] == float(usia_bulan))
        ]

        if ref_tbu.empty:
            return f"Data referensi tidak ditemukan untuk usia {usia_bulan} bulan."

        # Ambil nilai L, M, S dari sumber data [1, 4-6]
        l = ref_tbu['l'].values[0]
        m = ref_tbu['m'].values[0]
        s = ref_tbu['s'].values[0]
        
        # 2. Hitung Z-Score
        z_tbu = self.calculate_z_score(tinggi_cm, l, m, s)
        status = self.get_status(z_tbu, "TB/U")

        # 3. Output Prediksi & Saran
        print(f"--- Hasil Analisis Balita: {nama} ---")
        print(f"Z-Score TB/U: {z_tbu}")
        print(f"Status: {status}")
        
        if z_tbu < -2:
            print("Peringatan: Balita terdeteksi Stunting/Rentan. Disarankan konsultasi ahli gizi.")
        else:
            print("Status: Pertumbuhan tinggi badan saat ini terpantau Aman.")
        
        return {"z_score": z_tbu, "status": status}

# --- PENGGUNAAN ---
# Inisialisasi kalkulator dengan data master
calc = StuntingCalculator("data_science/data/processed/who_reference_master.csv")

# Contoh input aplikasi Anda
calc.detect_stunting(
    nama="Budi", 
    jenis_kelamin="Laki-laki", 
    usia_bulan=24.0, 
    tinggi_cm=80.0, 
    berat_kg=12.0
)