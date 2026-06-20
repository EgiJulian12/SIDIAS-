# Menggunakan base image resmi Python yang stabil
FROM python:3.9

# Mengatur folder kerja utama di dalam kontainer virtual
WORKDIR /code

# Menyalin file requirements terlebih dahulu agar bisa di-cache oleh Docker
COPY ./requirements.txt /code/requirements.txt

# Menginstal seluruh library yang tertera di requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Menyalin seluruh file sisa (app.py, folder saved_model) ke dalam kontainer
COPY . .

# Menjalankan server uvicorn pada port 7860 (Port wajib untuk Hugging Face Spaces)
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]