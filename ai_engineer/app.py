from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
from PIL import Image
import io

app = FastAPI(title="SIDIAS AI Engine API")

# Mengaktifkan CORS agar Backend Node.js/Vercel bisa mengakses API ini tanpa diblokir
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- LANGKAH 1: ME-LOAD MODEL AI ---
# Kode ini akan otomatis membaca folder 'saved_model' yang ada di sebelah file app.py ini
try:
    MODEL_PATH = "saved_model"
    model = tf.keras.models.load_model(MODEL_PATH)
    print("Model AI SIDIAS berhasil dimuat!")
except Exception as e:
    print(f"Gagal memuat model: {str(e)}")
    model = None

# --- LANGKAH 2: ENDPOINT UTAMA (CEK STATUS) ---
@app.get("/")
def home():
    return {
        "status": "Online",
        "message": "SIDIAS AI Engine API is running perfectly on Hugging Face!"
    }

# --- LANGKAH 3: ENDPOINT PREDIKSI / DETEKSI STUNTING ---
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if model is None:
        return {"error": "Model AI tidak tersedia di server."}
    
    try:
        # 1. Membaca file gambar yang dikirim oleh kamera/browser lewat backend
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        
        # 2. Preprocessing Gambar (Sesuaikan ukuran dengan target training MobileNetV2 kamu, misal 224x224)
        image = image.resize((224, 224))
        img_array = np.array(image) / 255.0  # Normalisasi pixel menjadi 0-1
        img_array = np.expand_dims(img_array, axis=0)  # Menambah dimensi batch (1, 224, 224, 3)
        
        # 3. Eksekusi Prediksi menggunakan Model TensorFlow
        predictions = model.predict(img_array)
        score = float(predictions[0][0])  # Mengambil nilai probabilitas hasil output model
        
        # 4. Logika Penentuan Status Risiko Stunting
        # Silakan sesuaikan ambang batas (threshold) 0.5 ini dengan hasil evaluasi notebook milikmu
        status = "Stunting" if score > 0.5 else "Normal"
        confidence_percentage = round((score if status == "Stunting" else 1 - score) * 100, 2)
        
        return {
            "success": True,
            "status": status,
            "confidence": f"{confidence_percentage}%",
            "raw_score": score
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"Gagal memproses gambar: {str(e)}"
        }