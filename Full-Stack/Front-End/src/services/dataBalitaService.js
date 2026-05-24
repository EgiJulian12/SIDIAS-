import api from './api';

// Fungsi untuk mengirim data balita ke backend
export const createDataBalita = async (data) => {
  try {
    const response = await api.post('/data-balita', data);
    return response.data;
  } catch (error) {
    console.error('Error saat menyimpan data balita:', error);
    throw error;
  }
};
