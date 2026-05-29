import request from 'supertest';
import app from '../app.js';
import { pool } from '../config/db.js';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

const token = jwt.sign({ nik: 'admin', role: 'admin' }, process.env.JWT_SECRET || 'supersecretkey123');
const authHeader = `Bearer ${token}`;

describe('Data Balita API Endpoints (Integration Testing)', () => {
  let createdBalitaId;

  beforeAll(async () => {
    // Pastikan schema tabel ada. Jika tidak, akan dibuat
    try {
      const schemaPath = path.resolve(process.cwd(), 'schema.sql');
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await pool.query(schemaSql);
    } catch (err) {
      console.log('Error setting up schema in test:', err.message);
      // Abaikan jika tabel sudah ada
      // Untuk keamanan, biarkan jika gagal
    }
  });

  beforeEach(async () => {
    // Bersihkan tabel data_balita sebelum tiap test
    await pool.query('TRUNCATE TABLE analisis CASCADE'); // Bersihkan relasi terlebih dahulu
    await pool.query('TRUNCATE TABLE data_balita CASCADE');
    
    // Masukkan data awal (seed)
    const res = await pool.query(`
      INSERT INTO data_balita (nama, jenis_kelamin, tanggal_lahir, berat_badan, tinggi_badan, umur_bulan)
      VALUES ('Budi', 'L', '2023-01-01', 10.5, 80, 16)
      RETURNING id
    `);
    createdBalitaId = res.rows[0].id;
  });

  afterAll(async () => {
    await pool.end(); // Tutup koneksi DB
  });

  describe('GET /api/data-balita', () => {
    it('should return all data balita', async () => {
      const res = await request(app)
        .get('/api/data-balita')
        .set('Authorization', authHeader);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(1);
      expect(res.body.data[0].nama).toBe('Budi');
    });
  });

  describe('GET /api/data-balita/:id', () => {
    it('should return a specific data balita by ID', async () => {
      const res = await request(app)
        .get(`/api/data-balita/${createdBalitaId}`)
        .set('Authorization', authHeader);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.nama).toBe('Budi');
    });

    it('should return 404 if data not found', async () => {
      // Hasilkan UUID acak yang tidak ada di database
      const randomUUID = '123e4567-e89b-12d3-a456-426614174000';
      const res = await request(app)
        .get(`/api/data-balita/${randomUUID}`)
        .set('Authorization', authHeader);
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
        .set('Authorization', authHeader)
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
        .set('Authorization', authHeader)
        .send({ nama: 'Siti' }); // Kekurangan jenis_kelamin, tanggal_lahir

      expect(res.statusCode).toBe(400);
    });

    it('should return 400 if jenis_kelamin is invalid', async () => {
      const res = await request(app)
        .post('/api/data-balita')
        .set('Authorization', authHeader)
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
        .put(`/api/data-balita/${createdBalitaId}`)
        .set('Authorization', authHeader)
        .send({ berat_badan: 11.0 });

      expect(res.statusCode).toBe(200);
      // Di PG, tipe desimal dikembalikan sebagai string kecuali di-cast
      expect(parseFloat(res.body.data.berat_badan)).toBe(11.0);
    });
  });

  describe('DELETE /api/data-balita/:id', () => {
    it('should delete a data balita', async () => {
      const res = await request(app)
        .delete(`/api/data-balita/${createdBalitaId}`)
        .set('Authorization', authHeader);
      expect(res.statusCode).toBe(200);
      
      // Verifikasi penghapusan
      const checkRes = await pool.query('SELECT * FROM data_balita WHERE id = $1', [createdBalitaId]);
      expect(checkRes.rowCount).toBe(0);
    });
  });
});
