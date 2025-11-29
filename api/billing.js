import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const client = await pool.connect();

    if (req.method === 'GET') {
      const result = await client.query('SELECT * FROM billing ORDER BY id ASC');
      client.release();
      return res.status(200).json(result.rows);
    }

    if (req.method === 'POST') {
      const { name, date, amount, status } = req.body;
      const result = await client.query(
        'INSERT INTO billing (name, date, amount, status) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, date, amount, status || 'upcoming']
      );
      client.release();
      return res.status(201).json(result.rows[0]);
    }

    if (req.method === 'PUT') {
      const { id, name, date, amount, status } = req.body;
      const result = await client.query(
        'UPDATE billing SET name = $1, date = $2, amount = $3, status = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
        [name, date, amount, status, id]
      );
      client.release();
      return res.status(200).json(result.rows[0]);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      await client.query('DELETE FROM billing WHERE id = $1', [id]);
      client.release();
      return res.status(204).end();
    }

    client.release();
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: error.message });
  }
}
