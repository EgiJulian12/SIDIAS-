// src/services/diagnosisService.js — contoh service

import api from './api';

// Satu fungsi = satu endpoint, selalu async/await
export const uploadDiagnosis = async (formData) => {
  const response = await api.post('/diagnosis', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getDiagnosisHistory = async () => {
  const response = await api.get('/diagnosis/history');
  return response.data;
};