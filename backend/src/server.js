import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import session from 'express-session';
import pinoHttp from 'pino-http';
import cors from 'cors';
import bcrypt from 'bcryptjs';

import * as db from './db/users.js';
import { pool } from './db/index.js';
import { loggerOptions } from './config/logger.js';
import { sessionOptions } from './config/session.js';
import { requireAuth } from './middlewares/auth.js';

const app = express();
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(pinoHttp(loggerOptions));
app.use(session(sessionOptions));
app.use(express.static(PUBLIC_DIR, { index: 'index.html', maxAge: '1d' }));

app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: 'Fill all fields' });

    if (await db.findUserByEmail(email))
      return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.addUser({ username, email, password: hashedPassword });

    const user = await db.findUserByEmail(email);
    req.session.user = { id: user.id, username: user.username, email: user.email };
    res.json({ ok: true, user: req.session.user });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Fill all fields' });

    const user = await db.findUserByEmail(email);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) return res.status(401).json({ message: 'Invalid credentials' });

    req.session.user = { id: user.id, username: user.username, email: user.email };
    res.json({ ok: true, user: req.session.user });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.get('/api/profile', requireAuth, (req, res) => {
  res.json(req.session.user);
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: 'Logout error' });
    res.json({ ok: true });
  });
});

(async () => {
  try {
    await pool.query('SELECT 1');
    console.log('MySQL connected successfully');
  } catch (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  }
})();

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
