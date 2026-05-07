import request from 'supertest';
import app from '../app.js';
import { balitaData } from '../config/db.js';

describe('Balita API Endpoints', () => {
  // Simpan initial data untuk reset
  const initialData = [
    { id: 1, nama: "Budi", umur_bulan: 12, berat_kg: 9.5, tinggi_cm: 75 },
    { id: 2, nama: "Siti", umur_bulan: 24, berat_kg: 12.0, tinggi_cm: 85 }
  ];

  beforeEach(() => {
    // Reset data sebelum setiap test
    balitaData.length = 0;
    initialData.forEach(item => balitaData.push({ ...item }));
  });

  describe('GET /api/balita', () => {
    it('should return all balita data', async () => {
      const res = await request(app).get('/api/balita');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(2);
      expect(res.body.data.length).toBe(2);
    });
  });

  describe('GET /api/balita/:id', () => {
    it('should return a specific balita by ID', async () => {
      const res = await request(app).get('/api/balita/1');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.nama).toBe('Budi');
    });

    it('should return 404 if balita not found', async () => {
      const res = await request(app).get('/api/balita/999');
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/balita', () => {
    it('should create a new balita', async () => {
      const newBalita = {
        nama: 'Andi',
        umur_bulan: 8,
        berat_kg: 7.5,
        tinggi_cm: 68
      };
      const res = await request(app)
        .post('/api/balita')
        .send(newBalita);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(3);
      expect(res.body.data.nama).toBe('Andi');
      expect(balitaData.length).toBe(3);
    });

    it('should return 400 if required fields are missing', async () => {
      const invalidData = { nama: 'Andi' }; // Missing other fields
      const res = await request(app)
        .post('/api/balita')
        .send(invalidData);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/balita/:id', () => {
    it('should update an existing balita', async () => {
      const res = await request(app)
        .put('/api/balita/1')
        .send({ berat_kg: 10.2 });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.berat_kg).toBe(10.2);
      expect(res.body.data.nama).toBe('Budi'); // Should not change
    });

    it('should return 404 if updating non-existent balita', async () => {
      const res = await request(app)
        .put('/api/balita/999')
        .send({ berat_kg: 10.2 });

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/balita/:id', () => {
    it('should delete a balita by ID', async () => {
      const res = await request(app).delete('/api/balita/1');
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(balitaData.length).toBe(1);
    });

    it('should return 404 if deleting non-existent balita', async () => {
      const res = await request(app).delete('/api/balita/999');
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
