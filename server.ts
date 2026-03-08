import express from 'express';
import { createServer as createViteServer } from 'vite';
import { Pool } from 'pg';
import cors from 'cors';
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

// Initialize tables
export const initDb = async () => {
  try {
    const client = await pool.connect();
    try {
      console.log('Connected to Postgres DB');

      // Read and execute schema SQL
      const schemaPath = path.resolve('supabase_fixed.sql');
      if (fs.existsSync(schemaPath)) {
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        await client.query(schemaSql);
        console.log('Database schema initialized from supabase_fixed.sql');
      } else {
        console.warn('supabase_fixed.sql not found, skipping schema initialization.');
      }
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Failed to initialize DB:', err);
  }
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cors());

  // Initialize DB
  await initDb();

  // API Routes

  // 1. Contents API (로고, 홈페이지 컨텐츠 등)
  app.get('/api/contents', async (req, res) => {
    try {
      const result = await query('SELECT * FROM contents');
      // 프론트엔드에서 사용하기 편하게 객체로 변환 ({ key: value })
      const contents = result.rows.reduce((acc: any, row: any) => ({ ...acc, [row.key]: row.value }), {});
      res.json(contents);
    } catch (err) {
      res.status(500).json({ error: 'Database error' });
    }
  });

  app.post('/api/contents', async (req, res) => {
    const updates = req.body; // { key: value, ... }
    try {
      await query('BEGIN');
      for (const [key, value] of Object.entries(updates)) {
        // category는 기본값 'common'으로 설정하거나 기존 값 유지
        await query(`
          INSERT INTO contents (key, value, category) 
          VALUES ($1, $2, 'common') 
          ON CONFLICT (key) DO UPDATE SET value = $2
        `, [key, value]);
      }
      await query('COMMIT');
      res.json({ success: true });
    } catch (err) {
      await query('ROLLBACK');
      res.status(500).json({ error: 'Database error' });
    }
  });

  // 2. Work API (프로젝트)
  app.get('/api/work', async (req, res) => {
    try {
      const result = await query('SELECT * FROM work ORDER BY display_order ASC, created_at DESC');
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: 'Database error' });
    }
  });

  app.post('/api/work', async (req, res) => {
    const { id, title, description, content, category, image_url, link, display_order } = req.body;
    try {
      if (id) {
        // Update
        await query(`
          UPDATE work 
          SET title = $1, description = $2, content = $3, category = $4, image_url = $5, link = $6, display_order = $7 
          WHERE id = $8
        `, [title, description, content, category, image_url, link, display_order || 0, id]);
      } else {
        // New Insert (기존 내역 삭제 요청 반영: "어드민에서 work를 새로 게시할때마다 기존에 게시된 내역은 삭제")
        await query('DELETE FROM work');
        
        await query(`
          INSERT INTO work (title, description, content, category, image_url, link, display_order) 
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [title, description, content, category, image_url, link, display_order || 0]);
      }
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    }
  });

  app.delete('/api/work/:id', async (req, res) => {
    try {
      await query('DELETE FROM work WHERE id = $1', [req.params.id]);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Database error' });
    }
  });

  // 3. Inquiries API (문의하기)
  app.post('/api/inquiries', async (req, res) => {
    const { content, author, email } = req.body; // author can be name, email is separate or combined
    // DB 구조: content, author
    // 요청에 따라 author에 "Name (Email)" 형식으로 저장하거나 조정
    const authorInfo = email ? `${author} (${email})` : author;

    try {
      await query('INSERT INTO inquiries (content, author) VALUES ($1, $2)', [content, authorInfo]);
      
      // 이메일 전송 로직 (Mock)
      const configResult = await query("SELECT value FROM contents WHERE key = 'contact_email'");
      const recipientEmail = configResult.rows.length > 0 ? configResult.rows[0].value : 'qhrud4611@gmail.com';
      console.log(`[Email Mock] To: ${recipientEmail}, From: ${authorInfo}, Message: ${content}`);

      res.json({ success: true, message: 'Message sent successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    }
  });

  // Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
