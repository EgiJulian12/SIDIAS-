import sys
import os
import json
import joblib
import pandas as pd
import numpy as np
import warnings

# Suppress sklearn and other warnings to avoid cluttering stdout/stderr
warnings.filterwarnings("ignore")

def main():
    if len(sys.argv) < 5:
        print(json.dumps({"error": "Argumen tidak lengkap. Dibutuhkan: usia_bulan jenis_kelamin tinggi_badan berat_badan"}))
        sys.exit(1)

    try:
        # 1. Parse input arguments
        usia_bulan = float(sys.argv[1])
        jenis_kelamin = sys.argv[2].strip().upper() # 'L' atau 'P'
        tinggi_badan = float(sys.argv[3])
        berat_badan = float(sys.argv[4])
    except Exception as e:
        print(json.dumps({"error": f"Gagal memparsing argumen: {str(e)}"}))
        sys.exit(1)

    # Determine absolute path to the directory of this script to avoid path issues
    base_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(base_dir, 'random_forest_stunting_model.pkl')
    scaler_path = os.path.join(base_dir, 'scaler.pkl')

    if not os.path.exists(model_path) or not os.path.exists(scaler_path):
        print(json.dumps({"error": "File model (.pkl) atau scaler (.pkl) tidak ditemukan di folder AI."}))
        sys.exit(1)

    try:
        # 2. Load model & scaler
        model = joblib.load(model_path)
        scaler = joblib.load(scaler_path)

        # 3. Feature engineering
        # L -> 0, P -> 1
        jenis_kelamin_encoded = 0 if jenis_kelamin == 'L' else 1
        
        # IMT: BB / (TB/100)^2
        imt = berat_badan / ((tinggi_badan / 100) ** 2)
        
        # Tinggi per usia: TB / (Usia + 1)
        tinggi_per_usia = tinggi_badan / (usia_bulan + 1)

        # Susun fitur: ['usia_bulan', 'jenis_kelamin_encoded', 'tinggi_badan', 'berat_badan', 'imt', 'tinggi_per_usia']
        feature_names = ['usia_bulan', 'jenis_kelamin_encoded', 'tinggi_badan', 'berat_badan', 'imt', 'tinggi_per_usia']
        features = pd.DataFrame([[usia_bulan, jenis_kelamin_encoded, tinggi_badan, berat_badan, imt, tinggi_per_usia]], columns=feature_names)

        # 4. Transform / Scale features
        features_scaled = scaler.transform(features)
        features_scaled_df = pd.DataFrame(features_scaled, columns=feature_names)

        # 5. Predict (0 = Stunting, 1 = Tidak Stunting)
        pred = int(model.predict(features_scaled_df)[0])

        # 6. Generate details & recommendations
        if pred == 0:
            status = "Terindikasi Stunting"
            tingkat_risiko = "Tinggi"
            prediction_detail = "Anak memiliki risiko mengalami stunting apabila pertumbuhan tidak dipantau dan kebutuhan gizi tidak terpenuhi."
            recommendation = "Tingkatkan konsumsi protein, susu, vitamin, makanan bergizi seimbang, dan lakukan pemeriksaan rutin ke posyandu."
        else:
            status = "Tidak Stunting"
            tingkat_risiko = "Rendah"
            prediction_detail = "Pertumbuhan anak saat ini tergolong baik dan stabil berdasarkan data yang dimasukkan."
            recommendation = "Pertahankan pola makan sehat, aktivitas fisik, nutrisi seimbang, dan pemeriksaan rutin setiap bulan."

        # Output JSON
        result = {
            "status_stunting": status,
            "status_detail": status,
            "tingkat_risiko": tingkat_risiko,
            "tingkat_risiko_detail": prediction_detail,
            "indikator": "BMI untuk Umur",
            "indikator_detail": f"BMI Anak: {imt:.2f}",
            "z_score": float(f"{imt:.2f}"),
            "rekomendasi": recommendation,
            "rekomendasi_detail": recommendation
        }
        
        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({"error": f"Terjadi kesalahan saat inferensi AI: {str(e)}"}))
        sys.exit(1)

if __name__ == '__main__':
    main()
