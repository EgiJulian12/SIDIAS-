import os
import sys

# Suppress TensorFlow C++ logs and oneDNN warnings before importing TensorFlow
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

import warnings
warnings.filterwarnings("ignore")

import json
import numpy as np
from PIL import Image

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Path gambar tidak disediakan. Dibutuhkan: path_gambar"}))
        sys.exit(1)

    img_path = sys.argv[1]

    if not os.path.exists(img_path):
        print(json.dumps({"error": f"File gambar tidak ditemukan di path: {img_path}"}))
        sys.exit(1)

    # Tentukan path model
    base_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(base_dir, 'saved_model_mobilenet')

    if not os.path.exists(model_path):
        print(json.dumps({"error": "Folder model MobileNetV2 tidak ditemukan di Back-End/AI."}))
        sys.exit(1)

    try:
        # Import tensorflow secara dinamis agar program utama tetap cepat saat error argumen
        import tensorflow as tf
        
        # Load model secara native (SavedModel format)
        model = tf.saved_model.load(model_path)
        infer = model.signatures["serving_default"]

        # Load dan preprocess gambar (Resize ke 224x224)
        img = Image.open(img_path).convert('RGB')
        img = img.resize((224, 224))
        
        # Convert ke numpy array dan normalisasi
        img_array = np.array(img, dtype=np.float32)
        img_array = img_array / 255.0  # Sesuai pre-processing di Jupyter Notebook (img_array / 255.0)
        
        # Tambahkan dimensi batch (1, 224, 224, 3)
        img_array = np.expand_dims(img_array, axis=0)

        # Konversi ke tensor dan jalankan inferensi secara native
        input_tensor = tf.convert_to_tensor(img_array, dtype=tf.float32)
        prediction = infer(keras_tensor=input_tensor)
        
        # Ambil output tensor 'output_0' dan ubah ke numpy array
        output_val = prediction['output_0'].numpy()
        
        # Label kelas
        class_names = ['MalNutrisi', 'Normal', 'Stunting']
        predicted_class_idx = np.argmax(output_val[0])
        confidence = float(output_val[0][predicted_class_idx])
        status = class_names[predicted_class_idx]

        # Buat detail & rekomendasi berdasarkan kelas
        if status == "Stunting":
            tingkat_risiko = "Tinggi"
            status_detail = "Terindikasi Stunting"
            prediction_detail = f"Gambar menunjukkan indikasi stunting dengan tingkat keyakinan {confidence * 100:.2f}%. Segera hubungi dokter spesialis anak atau Posyandu terdekat untuk konsultasi gizi."
            recommendation = "Tingkatkan asupan protein hewani (telur, ikan, daging), susu formula sesuai petunjuk medis, dampingi tumbuh kembang anak, dan ikuti posyandu bulanan."
        elif status == "MalNutrisi":
            tingkat_risiko = "Sedang"
            status_detail = "Terindikasi Malnutrisi"
            prediction_detail = f"Gambar menunjukkan indikasi malnutrisi dengan tingkat keyakinan {confidence * 100:.2f}%. Pola makan anak perlu dievaluasi."
            recommendation = "Penuhi gizi seimbang (karbohidrat, lemak sehat, protein, vitamin), periksakan berat badan secara teratur, dan berikan suplemen gizi jika disarankan faskes."
        else:
            tingkat_risiko = "Rendah"
            status_detail = "Normal"
            prediction_detail = f"Pertumbuhan anak secara visual tergolong normal dan stabil dengan tingkat keyakinan {confidence * 100:.2f}%."
            recommendation = "Pertahankan pola asuh yang baik, berikan makanan sehat seimbang, pastikan imunisasi lengkap, dan terus pantau tumbuh kembang bulanan."

        # Output JSON ke stdout
        result = {
            "status_stunting": status_detail,
            "status_detail": prediction_detail,
            "tingkat_risiko": tingkat_risiko,
            "tingkat_risiko_detail": prediction_detail,
            "indikator": "Analisis Gambar (MobileNetV2)",
            "indikator_detail": f"Confidence Score: {confidence:.4f}",
            "z_score": float(f"{confidence:.2f}"), # Menggunakan confidence score sebagai representasi nilai z_score/confidence di tabel
            "rekomendasi": recommendation,
            "rekomendasi_detail": recommendation
        }

        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({"error": f"Terjadi kesalahan saat inferensi MobileNetV2: {str(e)}"}))
        sys.exit(1)

if __name__ == '__main__':
    main()
