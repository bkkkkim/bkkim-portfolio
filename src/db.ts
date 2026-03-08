import { Pool } from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Helper for running queries
export const query = (text: string, params?: any[]) => pool.query(text, params);

// Initialize tables and seed data
export const initDb = async () => {
  try {
    const client = await pool.connect();
    try {
      console.log('Connected to Postgres DB');

      // Read and execute schema SQL
      const schemaPath = path.resolve('supabase_schema.sql');
      if (fs.existsSync(schemaPath)) {
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        await client.query(schemaSql);
        console.log('Database schema initialized from supabase_schema.sql');
      } else {
        console.warn('supabase_schema.sql not found, skipping schema initialization from file.');
      }

      // Seed initial data
      const configCount = await client.query('SELECT count(*) FROM site_config');
      if (parseInt(configCount.rows[0].count) === 0) {
        await client.query(`
          INSERT INTO site_config (key, value) VALUES 
          ('hero_title', 'Forward from the Basics'),
          ('hero_subtitle', 'Good design is as little as possible.'),
          ('hero_description', 'Building experiences by stacking layers of expertise on a solid foundation of basics.'),
          ('logo_text', 'Basics.'),
          ('contact_email', 'qhrud4611@gmail.com')
        `);
      }

      const aboutCount = await client.query('SELECT count(*) FROM about');
      if (parseInt(aboutCount.rows[0].count) === 0) {
        await client.query(`
          INSERT INTO about (id, content, skills, experience) VALUES (1, $1, $2, $3)
        `, [
          'I am a UX Service Planner focused on fundamental values.',
          JSON.stringify(['UX Planning', 'Service Design', 'Data Analysis', 'Prototyping']),
          JSON.stringify([
            { role: 'UX Planner', company: 'Company A', period: '2022 - Present', description: 'Led service planning for...' },
            { role: 'Service Designer', company: 'Company B', period: '2020 - 2022', description: 'Designed core features for...' }
          ])
        ]);
      }
      
      // We don't seed works anymore because the user wants to manage them strictly.
      // Or we can keep it for initial setup only.

    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Failed to initialize DB:', err);
    // Don't exit process, just log error. The app might still work if tables exist.
  }
};

export default pool;

