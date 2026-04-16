import pandas as pd

def hitung_status_stunting(umur_bulan, tinggi_badan_cm, jenis_kelamin, posisi_ukur):
    
    # Load Master Data Referensi
    try:
        df_who = pd.read_csv('./data_science/datasets/who_reference_master.csv')
    except FileNotFoundError:
        return {"error": "File master WHO tidak ditemukan."}

    # Koreksi Posisi Ukur 
    # Standar WHO: < 24 bulan diukur telentang, >= 24 bulan diukur berdiri
    tinggi_koreksi = tinggi_badan_cm
    if umur_bulan < 24 and posisi_ukur.lower() == 'berdiri':
        tinggi_koreksi += 0.7
    elif umur_bulan >= 24 and posisi_ukur.lower() == 'telentang':
        tinggi_koreksi -= 0.7

    # Cari Baris Referensi yang Cocok
    referensi = df_who[(df_who['Jenis_Kelamin'] == jenis_kelamin) & (df_who['Month'] == umur_bulan)]
    
    if referensi.empty:
        return {"error": "Data referensi untuk umur/kelamin tersebut tidak ditemukan."}
    
    ref_data = referensi.iloc[0]
    
    # Hitung Z-Score
    median = ref_data['M']  
    
    # Menentukan nilai pembagi SD berdasarkan posisi tinggi anak terhadap median
    if tinggi_koreksi < median:
        sd_value = median - ref_data['SD1neg']
    else:
        sd_value = ref_data['SD1'] - median
        
    z_score = (tinggi_koreksi - median) / sd_value

    # Menentukan Status Gizi (Berdasarkan Z-Score WHO)
    if z_score < -3.0:
        status = "Severely Stunted (Sangat Pendek)"
    elif -3.0 <= z_score < -2.0:
        status = "Stunted (Pendek)"
    elif -2.0 <= z_score <= 3.0:
        status = "Normal"
    else:
        status = "Tinggi"

    # Kembalikan hasil dalam bentuk Dictionary (Format JSON-ready untuk Backend)
    return {
        "umur_bulan": umur_bulan,
        "jenis_kelamin": jenis_kelamin,
        "tinggi_input": tinggi_badan_cm,
        "tinggi_koreksi": round(tinggi_koreksi, 2),
        "z_score": round(z_score, 2),
        "status_stunting": status
    }

# (TESTING)
if __name__ == "__main__":
    # Skenario Tes: Anak Laki-laki, 24 Bulan, Tinggi 81 cm, diukur Telentang
    print("Menguji Kalkulator SIDIAS\n")
    
    hasil_tes = hitung_status_stunting(
        umur_bulan=12, 
        tinggi_badan_cm=81.0, 
        jenis_kelamin="Laki-laki", 
        posisi_ukur="Telentang"
    )
    
    for key, value in hasil_tes.items():
        print(f"{key}: {value}")