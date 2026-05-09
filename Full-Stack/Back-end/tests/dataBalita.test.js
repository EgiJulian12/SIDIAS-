import request from 'supertest';
import app from '../app.js';
import { dataBalita } from '../config/db.js';

describe('Data Balita API Endpoints', () => {
  const initialData = [
    {
      id: 'uuid-1',
      nama: 'Budi',
      jenis_kelamin: 'L',
      tanggal_lahir: '2023-01-01',
      berat_badan: 10.5,
      tinggi_badan: 80,
      umur_bulan: 16,
      foto_url: 'http://example.com/budi.jpg',
      created_by: 'system',
      created_at: '2024-05-01T00:00:00.000Z'
    }
  ];

  beforeEach(() => {
    dataBalita.length = 0;
    initialData.forEach(item => dataBalita.push({ ...item }));
  });

  describe('GET /api/data-balita', () => {
    it('should return all data balita', async () => {
      const res = await request(app).get('/api/data-balita');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(1);
    });
  });

  describe('GET /api/data-balita/:id', () => {
    it('should return a specific data balita by ID', async () => {
      const res = await request(app).get('/api/data-balita/uuid-1');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.nama).toBe('Budi');
    });

    it('should return 404 if data not found', async () => {
      const res = await request(app).get('/api/data-balita/not-found-id');
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/data-balita', () => {
    it('should create a new data balita', async () => {
      const newData = {
        nama: 'Siti',
        jenis_kelamin: 'P',
        tanggal_lahir: '2023-05-01',
        berat_badan: 8.5,
        tinggi_badan: 75
      };
      
      const res = await request(app)
        .post('/api/data-balita')
        .send(newData);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.nama).toBe('Siti');
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.umur_bulan).toBeDefined();
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/data-balita')
        .send({ nama: 'Siti' }); // Missing jenis_kelamin, tanggal_lahir

      expect(res.statusCode).toBe(400);
    });

    it('should return 400 if jenis_kelamin is invalid', async () => {
      const res = await request(app)
        .post('/api/data-balita')
        .send({ 
          nama: 'Siti', 
          jenis_kelamin: 'X', 
          tanggal_lahir: '2023-05-01' 
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('PUT /api/data-balita/:id', () => {
    it('should update an existing data balita', async () => {
      const res = await request(app)
        .put('/api/data-balita/uuid-1')
        .send({ berat_badan: 11.0 });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.berat_badan).toBe(11.0);
    });
  });

  describe('DELETE /api/data-balita/:id', () => {
    it('should delete a data balita', async () => {
      const res = await request(app).delete('/api/data-balita/uuid-1');
      expect(res.statusCode).toBe(200);
      expect(dataBalita.length).toBe(0);
    });
  });
});
