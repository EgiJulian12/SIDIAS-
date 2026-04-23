import pandas as pd
import os

# Folder tempat semua file dataset disimpan
folder_datasets = "data_science/data/raw/who_source"

# Nama file hasil penggabungan
file_output = os.path.join(folder_datasets, "who_reference_master.csv")

# Mapping untuk mengubah nilai string ke Bahasa Indonesia
mapping_gender = {
    "boys": "Laki-laki",
    "girls": "Perempuan"
}

mapping_indicator = {
    "length_height_for_age": "TB/U",  # Tinggi Badan menurut Umur
    "weight_for_age": "BB/U",         # Berat Badan menurut Umur
    "weight_for_height": "BB/TB"      # Berat Badan menurut Tinggi Badan
}

daftar_file = [
    # File LHFA
    ("lhfa_boys_0-to-2-years_zscores.csv", "boys", "length_height_for_age", "0-2"),
    ("lhfa_boys_2-to-5-years_zscores.csv", "boys", "length_height_for_age", "2-5"),
    ("lhfa_girls_0-to-2-years_zscores.csv", "girls", "length_height_for_age", "0-2"),
    ("lhfa_girls_2-to-5-years_zscores.csv", "girls", "length_height_for_age", "2-5"),

    # File WFA
    ("wfa_boys_0-to-5-years_zscores.csv", "boys", "weight_for_age", "0-5"),
    ("wfa_girls_0-to-5-years_zscores.csv", "girls", "weight_for_age", "0-5"),

    # File WFH 
    ("wfh_boys_2-to-5-years_zscores.csv", "boys",  "weight_for_height", "2-5"),
    ("wfh_girls_2-to-5-years_zscores.csv", "girls", "weight_for_height", "2-5"),
]

semua_data = []

for nama_file, jenis_kelamin, indikator, rentang_usia in daftar_file:
    path_file = os.path.join(folder_datasets, nama_file)
    
    # Membaca file CSV
    data = pd.read_csv(path_file)
    
    # Rapikan nama kolom
    data.columns = data.columns.str.strip().str.lower().str.replace(" ", "_")

    # --- PENYESUAIAN STRING KE BAHASA INDONESIA ---
    # Menggunakan .get() agar jika tidak ada di mapping, tetap menggunakan nilai asli
    data["jenis_kelamin"] = mapping_gender.get(jenis_kelamin, jenis_kelamin)
    data["indicator"] = mapping_indicator.get(indikator, indikator)
    data["rentang_usia"] = rentang_usia  
    
    semua_data.append(data)  

# Gabungkan semua tabel menjadi satu tabel besar setelah semua file dibaca
data_gabungan = pd.concat(semua_data, ignore_index=True, sort=False)

# Susun ulang urutan kolom
kolom_depan   = ["indicator", "jenis_kelamin", "rentang_usia"]
kolom_sisanya = [k for k in data_gabungan.columns if k not in kolom_depan]
data_gabungan = data_gabungan[kolom_depan + kolom_sisanya]

# Simpan ke CSV
data_gabungan.to_csv(file_output, index=False)

print(f"File berhasil disimpan dengan konten bahasa Indonesia!")
print(f"Nama file : who_reference_master.csv")