import api from './api';

// Fungsi untuk mengirim data balita ke backend
export const createDataBalita = async (data) => {
  try {
    const isFormData = data instanceof FormData;
    const response = await api.post('/data-balita', data, {
      headers: isFormData ? { 'Content-Type': undefined } : {}
    });
    return response.data;
  } catch (error) {
    console.error('Error saat menyimpan data balita:', error);
    throw error;
  }
};

// Fungsi untuk mengambil semua data balita
export const getAllDataBalita = async () => {
  try {
    const response = await api.get('/data-balita');
    return response.data;
  } catch (error) {
    console.error('Error saat mengambil semua data balita:', error);
    throw error;
  }
};

// Fungsi untuk mengambil detail data balita berdasarkan ID
export const getDataBalitaById = async (id) => {
  try {
    const response = await api.get(`/data-balita/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error saat mengambil data balita berdasarkan ID:', error);
    throw error;
  }
};
