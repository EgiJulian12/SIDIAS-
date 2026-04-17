import pandas as pd

# Load semua file 
boys_0_2 = pd.read_excel('./datasets/lhfa_boys_0-to-2-years_zscores.xlsx')
boys_2_5 = pd.read_excel('./datasets/lhfa_boys_2-to-5-years_zscores.xlsx')
girls_0_2 = pd.read_excel('./datasets/lhfa_girls_0-to-2-years_zscores.xlsx')
girls_2_5 = pd.read_excel('./datasets/lhfa_girls_2-to-5-years_zscores.xlsx')

# Menambahkan kolom Jenis_Kelamin
boys_0_2['Jenis_Kelamin'] = 'Laki-laki'
boys_2_5['Jenis_Kelamin'] = 'Laki-laki'
girls_0_2['Jenis_Kelamin'] = 'Perempuan'
girls_2_5['Jenis_Kelamin'] = 'Perempuan'

# Menggabungkan 0-2 dan 2-5 untuk masing-masing gender
df_boys = pd.concat([boys_0_2, boys_2_5], ignore_index=True)
df_girls = pd.concat([girls_0_2, girls_2_5], ignore_index=True)

# Menggabungkan all
df_who_final = pd.concat([df_boys, df_girls], ignore_index=True)

# Simpan ke CSV 
df_who_final.to_csv('datasets/who_reference_master.csv', index=False)

print("Berhasil menggabungkan 4 file menjadi 1 master dataset!")