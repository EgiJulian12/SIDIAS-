import { pool } from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mendaftarkan user baru (default role: user)
export const registerUser = async (req, res, next) => {
  try {
    const { nik, password } = req.body;

    if (!nik || !password) {
      return res.status(400).json({
        success: false,
        message: 'NIK dan password wajib diisi'
      });
    }

    if (nik.length < 16) {
      return res.status(400).json({
        success: false,
        message: 'NIK harus minimal 16 karakter'
      });
    }

    // Periksa apakah user sudah terdaftar
    const userExists = await pool.query('SELECT nik FROM users WHERE nik = $1', [nik]);
    if (userExists.rowCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'NIK sudah terdaftar'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Simpan user baru (role default 'user')
    const result = await pool.query(
      'INSERT INTO users (nik, password_hash, role) VALUES ($1, $2, $3) RETURNING nik, role, created_at',
      [nik, passwordHash, 'user']
    );

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// Login user
export const loginUser = async (req, res, next) => {
  try {
    const { nik, password } = req.body;

    if (!nik || !password) {
      return res.status(400).json({
        success: false,
        message: 'NIK dan password wajib diisi'
      });
    }

    // Cari user di database
    const result = await pool.query('SELECT * FROM users WHERE nik = $1', [nik]);
    if (result.rowCount === 0) {
      return res.status(401).json({
        success: false,
        message: 'NIK tidak terdaftar'
      });
    }

    const user = result.rows[0];

    // Cek password hash
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Password salah'
      });
    }

    // Buat JWT Token
    const token = jwt.sign(
      { nik: user.nik, role: user.role },
      process.env.JWT_SECRET || 'supersecretkey123',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login berhasil',
      token,
      user: {
        nik: user.nik,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};
