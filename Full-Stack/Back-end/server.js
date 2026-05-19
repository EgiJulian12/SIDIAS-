// File utama untuk menjalankan server aplikasi
import app from './app.js';

// Menentukan port yang digunakan server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
