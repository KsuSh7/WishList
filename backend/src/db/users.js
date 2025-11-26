import { pool } from './index.js';

export async function findUserByUsername(username) {
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE username = ?',
    [username]
  );
  return rows[0] || null;
}

export async function addUser({ username, email, password }) {
  await pool.query(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, password]
  );
}
