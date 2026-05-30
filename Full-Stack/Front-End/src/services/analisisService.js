import api from './api';

export const getAnalisisByDataId = async (dataId) => {
  try {
    const response = await api.get(`/analisis/data-balita/${dataId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null; // Tidak ditemukan
    }
    console.error('Error saat mengambil data analisis:', error);
    throw error;
  }
};
