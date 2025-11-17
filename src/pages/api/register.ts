import { NextApiRequest, NextApiResponse } from 'next';
import { hashPassword } from '../../lib/auth';
import { Pool } from 'pg';
import { randomUUID } from 'crypto';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return;
  }

  const { email, password } = req.body;

  if (!email || !email.includes('@') || !password || password.trim().length < 7) {
    res.status(422).json({
      message:
        'Invalid input - password should also be at least 7 characters long.',
    });
    return;
  }

  const client = await pool.connect();

  const existingUser = await client.query('SELECT * FROM users WHERE email = $1', [email]);

  if (existingUser.rows.length > 0) {
    res.status(422).json({ message: 'User exists already!' });
    client.release();
    return;
  }

  const hashedPassword = await hashPassword(password);
  const userId = randomUUID();

  await client.query('INSERT INTO users (id, email, password) VALUES ($1, $2, $3)', [userId, email, hashedPassword]);

  res.status(201).json({ message: 'Created user!' });
  client.release();
}
