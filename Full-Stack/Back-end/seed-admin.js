import { pool } from './config/db.js';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedAdmin = async () => {
  try {
    // Check if the database tables already exist, if not run schema.sql
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'users'
      )
    `);
    
    const tablesExist = tableCheck.rows[0].exists;
    if (!tablesExist) {
      console.log('Database tables not found. Initializing schema from schema.sql...');
      const schemaPath = path.join(__dirname, 'schema.sql');
      if (fs.existsSync(schemaPath)) {
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        await pool.query(schemaSql);
        console.log('Database schema initialized successfully.');
      } else {
        console.warn('schema.sql not found! Skipping database initialization.');
      }
    } else {
      console.log('Database tables already exist. Skipping schema initialization.');
    }

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
