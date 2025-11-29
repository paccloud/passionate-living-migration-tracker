import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const client = await pool.connect();

    if (req.method === 'GET') {
      const result = await client.query('SELECT * FROM milestones ORDER BY id ASC');
      client.release();
      return res.status(200).json(result.rows);
    }

    if (req.method === 'POST') {
      const { title, description, status, targetDate, billingStatus } = req.body;
      const result = await client.query(
        'INSERT INTO milestones (title, description, status, target_date, billing_status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [title, description, status || 'upcoming', targetDate, billingStatus || 'pending']
      );
      client.release();
      return res.status(201).json(result.rows[0]);
    }

    if (req.method === 'PUT') {
      const { id, title, description, status, completedDate, targetDate, billingStatus } = req.body;
      const result = await client.query(
        'UPDATE milestones SET title = $1, description = $2, status = $3, completed_date = $4, target_date = $5, billing_status = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
        [title, description, status, completedDate, targetDate, billingStatus, id]
      );
      client.release();
      return res.status(200).json(result.rows[0]);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      await client.query('DELETE FROM milestones WHERE id = $1', [id]);
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
