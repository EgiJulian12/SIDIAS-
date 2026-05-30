import request from 'supertest';
import app from '../app.js';
import { pool } from '../config/db.js';
import jwt from 'jsonwebtoken';

const token = jwt.sign({ nik: 'admin', role: 'admin' }, process.env.JWT_SECRET || 'supersecretkey123');
const authHeader = `Bearer ${token}`;

describe('Analisis API Endpoints (Integration Testing)', () => {
  let createdBalitaId;
  let createdAnalisisId;

  beforeAll(async () => {
    // Skema diasumsikan sudah ada atau ditangani oleh tes pertama
  });

  beforeEach(async () => {
    await pool.query('TRUNCATE TABLE analisis CASCADE');
    await pool.query('TRUNCATE TABLE data_balita CASCADE');

    // Buat balita sementara untuk foreign key
    const balitaRes = await pool.query(`
      INSERT INTO data_balita (nama, jenis_kelamin, tanggal_lahir, berat_badan, tinggi_badan, umur_bulan)
      VALUES ('Test Balita', 'L', '2023-01-01', 10.5, 80, 16)
      RETURNING id
    `);
    createdBalitaId = balitaRes.rows[0].id;

    const analisisRes = await pool.query(`
      INSERT INTO analisis (data_id, status_stunting, tingkat_risiko, indikator, z_score, rekomendasi)
      VALUES ($1, 'Stunting', 'Tinggi', 'TB/U', -2.5, 'Segera rujuk ke faskes')
      RETURNING id
    `, [createdBalitaId]);
    createdAnalisisId = analisisRes.rows[0].id;
  });

  afterAll(async () => {
    // Karena pool dibagikan, kita tutup agar proses jest bisa selesai
    await pool.end();
  });

  describe('GET /api/analisis', () => {
    it('should return all data analisis', async () => {
      const res = await request(app)
        .get('/api/analisis')
        .set('Authorization', authHeader);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(1);
    });
  });

  describe('GET /api/analisis/:id', () => {
    it('should return a specific data analisis by ID', async () => {
      const res = await request(app)
        .get(`/api/analisis/${createdAnalisisId}`)
        .set('Authorization', authHeader);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status_stunting).toBe('Stunting');
    });

    it('should return 404 if data not found', async () => {
      const randomUUID = '123e4567-e89b-12d3-a456-426614174001';
      const res = await request(app)
        .get(`/api/analisis/${randomUUID}`)
        .set('Authorization', authHeader);
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/analisis/data-balita/:data_id', () => {
    it('should return analisis for a specific balita', async () => {
      const res = await request(app)
        .get(`/api/analisis/data-balita/${createdBalitaId}`)
        .set('Authorization', authHeader);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.data_id).toBe(createdBalitaId);
    });
  });

  describe('POST /api/analisis', () => {
    it('should create a new data analisis using AI', async () => {
      // Buat balita lain terlebih dahulu
      const anotherBalita = await pool.query(`
        INSERT INTO data_balita (nama, jenis_kelamin, tanggal_lahir, berat_badan, tinggi_badan, umur_bulan)
        VALUES ('Another Balita', 'P', '2023-01-01', 9.5, 75, 16)
        RETURNING id
      `);
      
      const newDataId = anotherBalita.rows[0].id;
      
      const res = await request(app)
        .post('/api/analisis')
        .set('Authorization', authHeader)
        .send({ data_id: newDataId });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status_stunting).toBeDefined();
    });

    it('should return 400 if data_id is missing', async () => {
      const res = await request(app)
        .post('/api/analisis')
        .set('Authorization', authHeader)
        .send({}); 

      expect(res.statusCode).toBe(400);
    });

    it('should return 404 if data_id does not exist in data_balita', async () => {
      const randomUUID = '123e4567-e89b-12d3-a456-426614174002';
      const res = await request(app)
        .post('/api/analisis')
        .set('Authorization', authHeader)
        .send({ data_id: randomUUID });

      expect(res.statusCode).toBe(404);
    });
  });

  describe('PUT /api/analisis/:id', () => {
    it('should update an existing data analisis', async () => {
      const res = await request(app)
        .put(`/api/analisis/${createdAnalisisId}`)
        .set('Authorization', authHeader)
        .send({ status_stunting: 'Normal' });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.status_stunting).toBe('Normal');
    });
  });

  describe('DELETE /api/analisis/:id', () => {
    it('should delete a data analisis', async () => {
      const res = await request(app)
        .delete(`/api/analisis/${createdAnalisisId}`)
        .set('Authorization', authHeader);
      expect(res.statusCode).toBe(200);
      
      const checkRes = await pool.query('SELECT * FROM analisis WHERE id = $1', [createdAnalisisId]);
      expect(checkRes.rowCount).toBe(0);
    });
  });
});
