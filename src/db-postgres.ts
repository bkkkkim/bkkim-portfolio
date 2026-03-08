import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export const initDB = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Site Config
    await client.query(`
      CREATE TABLE IF NOT EXISTS site_config (
        key TEXT PRIMARY KEY,
        value TEXT
      );
    `);

    // Works
    // Note: Using quotes to preserve camelCase for frontend compatibility
    await client.query(`
      CREATE TABLE IF NOT EXISTS works (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        content TEXT,
        category TEXT,
        "imageUrl" TEXT,
        link TEXT,
        "displayOrder" INTEGER DEFAULT 0
      );
    `);

    // About
    await client.query(`
      CREATE TABLE IF NOT EXISTS about (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        content TEXT,
        skills TEXT,
        experience TEXT
      );
    `);

    // Messages
    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT,
        message TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed Config
    const { rows: configRows } = await client.query('SELECT count(*) as count FROM site_config');
    if (parseInt(configRows[0].count) === 0) {
      await client.query(`
        INSERT INTO site_config (key, value) VALUES
        ('hero_title', 'Forward from the Basics'),
        ('hero_subtitle', 'Good design is as little as possible.'),
        ('hero_description', 'Building experiences by stacking layers of expertise on a solid foundation of basics.'),
        ('logo_text', 'Basics.'),
        ('contact_email', 'qhrud4611@gmail.com');
      `);
    }

    // Seed About
    const { rows: aboutRows } = await client.query('SELECT count(*) as count FROM about');
    if (parseInt(aboutRows[0].count) === 0) {
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

    // Seed Works
    const { rows: worksRows } = await client.query('SELECT count(*) as count FROM works');
    if (parseInt(worksRows[0].count) === 0) {
      await client.query(`
        INSERT INTO works (title, description, content, category, "imageUrl", link, "displayOrder") VALUES
        ($1, $2, $3, $4, $5, $6, 1),
        ($7, $8, $9, $10, $11, $12, 2),
        ($13, $14, $15, $16, $17, $18, 3)
      `, [
        'The Who Official Mall', 'Official online store renewal and UX improvement.', '<p>Detailed content about The Who Official Mall...</p>', 'E-commerce', 'https://picsum.photos/seed/thewho/800/600', '#',
        'Corporate Website Renewal', 'Modernizing the corporate identity and information architecture.', '<p>Detailed content about Corporate Website...</p>', 'Corporate', 'https://picsum.photos/seed/corp/800/600', '#',
        'Belif Universe', 'Immersive brand storytelling experience.', '<p>Detailed content about Belif Universe...</p>', 'Branding', 'https://picsum.photos/seed/belif/800/600', '#'
      ]);
    }

    await client.query('COMMIT');
    console.log('Database initialized successfully');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Failed to initialize database:', e);
    throw e;
  } finally {
    client.release();
  }
};

export default pool;
