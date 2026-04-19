# import library
import pandas as pd
import os

# Folder tempat semua file dataset disimpan
folder_datasets = "data_science/datasets"

# Nama file hasil penggabungan yang akan kita buat
file_output = os.path.join(folder_datasets, "who_reference_master.csv")


daftar_file = [
    # File LHFA
    ("lhfa_boys_0-to-2-years_zscores.xlsx", "boys", "length_height_for_age", "0-2"),
    ("lhfa_boys_2-to-5-years_zscores.xlsx", "boys", "length_height_for_age", "2-5"),
    ("lhfa_girls_0-to-2-years_zscores.xlsx", "girls", "length_height_for_age", "0-2"),
    ("lhfa_girls_2-to-5-years_zscores.xlsx", "girls", "length_height_for_age", "2-5"),

    # File WFA
    ("wfa_boys_0-to-5-years_zscores.xlsx", "boys", "weight_for_age", "0-5"),
    ("wfa_girls_0-to-5-years_zscores.xlsx", "girls", "weight_for_age", "0-5"),

    # File WFH 
    ("wfh_boys_2-to-5-years_zscores.xlsx", "boys",  "weight_for_height", "2-5"),
    ("wfh_girls_2-to-5-years_zscores.xlsx", "girls", "weight_for_height", "2-5"),
]

# Tempat menyimpan data dari setiap file sebelum digabung
semua_data = []

for nama_file, jenis_kelamin, indikator, rentang_usia in daftar_file:

    path_file = os.path.join(folder_datasets, nama_file)

    data = pd.read_excel(path_file)
    # Rapikan nama kolom
    data.columns = data.columns.str.strip().str.lower().str.replace(" ", "_")

    # Tambahkan kolom baru sebagai penanda asal data
    data["jenis_kelamin"] = jenis_kelamin
    data["indicator"] = indikator       
    data["rentang_usia"] = rentang_usia  
    semua_data.append(data)  

    # Gabungkan semua tabel menjadi satu tabel besar
    data_gabungan = pd.concat(semua_data, ignore_index=True, sort=False)

    # Susun ulang urutan kolom supaya kolom penanda tampil di depan,
    kolom_depan   = ["indicator", "jenis_kelamin", "rentang_usia"]
    kolom_sisanya = [k for k in data_gabungan.columns if k not in kolom_depan]
    data_gabungan = data_gabungan[kolom_depan + kolom_sisanya]

    # index=False -> supaya nomor baris tidak ikut tersimpan
    data_gabungan.to_csv(file_output, index=False)

# Tampilkan informasi bahwa proses penggabungan dan penyimpanan file berhasil
print(f"  File berhasil disimpan!")
print(f"  Nama file  : who_reference_master.csv")