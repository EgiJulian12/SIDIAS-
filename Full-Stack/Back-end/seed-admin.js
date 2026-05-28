import { pool } from './config/db.js';
import bcrypt from 'bcryptjs';

const seedAdmin = async () => {
  try {
    const adminNik = 'admin';
    const adminPassword = 'admin123';
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPassword, salt);
    
    // Check if admin already exists
    const checkRes = await pool.query('SELECT nik FROM users WHERE nik = $1', [adminNik]);
    
    if (checkRes.rowCount > 0) {
      // Update existing admin
      await pool.query(
        'UPDATE users SET password_hash = $1, role = $2 WHERE nik = $3',
        [passwordHash, 'admin', adminNik]
      );
      console.log('Admin user updated successfully');
    } else {
      // Insert new admin
      await pool.query(
        'INSERT INTO users (nik, password_hash, role) VALUES ($1, $2, $3)',
        [adminNik, passwordHash, 'admin']
      );
      console.log('Admin user created successfully');
    }
    
    // Check if test_nik exists and update it too just in case they use it
    const checkTestRes = await pool.query('SELECT nik FROM users WHERE nik = $1', ['test_nik']);
    if (checkTestRes.rowCount > 0) {
      await pool.query(
        'UPDATE users SET password_hash = $1 WHERE nik = $2',
        [passwordHash, 'test_nik']
      );
      console.log('Updated test_nik user password hash as well (password is admin123)');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
};

seedAdmin();
