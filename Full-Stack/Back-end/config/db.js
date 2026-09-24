import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

// Support DATABASE_URL (for Supabase / Vercel) or individual environment variables (for local dev)
const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes('localhost')
        ? false
        : { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000,
      max: 10,
    }
  : {
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'sidias',
      password: process.env.DB_PASSWORD || '12345',
      port: process.env.DB_PORT || 5432,
      connectionTimeoutMillis: 10000,
    };

export const pool = new Pool(poolConfig);

pool.on('connect', () => {
  console.log('Connected to the PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});
