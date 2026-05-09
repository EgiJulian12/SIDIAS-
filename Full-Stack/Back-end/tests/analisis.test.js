import request from 'supertest';
import app from '../app.js';
import { analisisData, dataBalita } from '../config/db.js';

describe('Analisis API Endpoints', () => {
  const mockBalita = {
    id: 'data-uuid-1',
    nama: 'Budi',
    jenis_kelamin: 'L',
    tanggal_lahir: '2023-01-01'
  };

  const initialAnalisis = {
    id: 'analisis-uuid-1',
    data_id: 'data-uuid-1',
    status_stunting: 'Normal',
    tingkat_risiko: 'Rendah',
    indikator: 'Berat badan dan tinggi sesuai',
    z_score: 0.5,
    rekomendasi: 'Lanjutkan nutrisi seimbang',
    created_at: '2024-05-01T00:00:00.000Z'
  };

  beforeEach(() => {
    dataBalita.length = 0;
    dataBalita.push({ ...mockBalita });

    analisisData.length = 0;
    analisisData.push({ ...initialAnalisis });
  });

  describe('GET /api/analisis', () => {
    it('should return all analisis', async () => {
      const res = await request(app).get('/api/analisis');
      expect(res.statusCode).toBe(200);
      expect(res.body.count).toBe(1);
    });
  });

  describe('GET /api/analisis/:id', () => {
    it('should return specific analisis', async () => {
      const res = await request(app).get('/api/analisis/analisis-uuid-1');
      expect(res.statusCode).toBe(200);
      expect(res.body.data.status_stunting).toBe('Normal');
    });
  });

  describe('GET /api/analisis/data-balita/:data_id', () => {
    it('should return analisis by data_id', async () => {
      const res = await request(app).get('/api/analisis/data-balita/data-uuid-1');
      expect(res.statusCode).toBe(200);
      expect(res.body.data.id).toBe('analisis-uuid-1');
    });
  });

  describe('POST /api/analisis', () => {
    it('should create new analisis', async () => {
      // Add a new balita first so we can analyze it
      dataBalita.push({
        id: 'data-uuid-2',
        nama: 'Siti',
        jenis_kelamin: 'P',
        tanggal_lahir: '2023-05-01'
      });

      const newAnalisis = {
        data_id: 'data-uuid-2',
        status_stunting: 'Stunting',
        z_score: -2.5
      };

      const res = await request(app)
        .post('/api/analisis')
        .send(newAnalisis);

      expect(res.statusCode).toBe(201);
      expect(res.body.data.data_id).toBe('data-uuid-2');
    });

    it('should return 404 if data_id does not exist', async () => {
      const res = await request(app)
        .post('/api/analisis')
        .send({
          data_id: 'non-existent',
          status_stunting: 'Normal',
          z_score: 0
        });

      expect(res.statusCode).toBe(404);
    });

    it('should return 400 if analysis already exists for data_id', async () => {
      const res = await request(app)
        .post('/api/analisis')
        .send({
          data_id: 'data-uuid-1',
          status_stunting: 'Normal',
          z_score: 0
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('PUT /api/analisis/:id', () => {
    it('should update existing analisis', async () => {
      const res = await request(app)
        .put('/api/analisis/analisis-uuid-1')
        .send({ z_score: 1.0 });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.z_score).toBe(1.0);
    });
  });

  describe('DELETE /api/analisis/:id', () => {
    it('should delete analisis', async () => {
      const res = await request(app).delete('/api/analisis/analisis-uuid-1');
      expect(res.statusCode).toBe(200);
      expect(analisisData.length).toBe(0);
    });
  });
});
