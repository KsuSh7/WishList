import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import pinoHttp from 'pino-http';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import * as dbUsers from './db/users.js';
import { pool } from './db/index.js';
import { loggerOptions } from './config/logger.js';
import { sessionOptions } from './config/session.js';
import { requireAuth } from './middlewares/auth.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(pinoHttp(loggerOptions));
app.use(session(sessionOptions));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/avatars';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${req.session.user.id}${path.extname(file.originalname)}`);
  },
});

const wishlistCoverStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/wishlist_covers';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.params.id}${ext}`);
  },
});

const itemCoverStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/item_covers';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.params.id}${ext}`);
  },
});

const uploadWishlistCover = multer({ storage: wishlistCoverStorage });
const uploadItemCover = multer({ storage: itemCoverStorage });
const upload = multer({ storage });

// ============================
// AVATAR
// ============================
app.post('/users/avatar', requireAuth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const avatarPath = `/uploads/avatars/${req.file.filename}`;
    await pool.query('UPDATE users SET avatar = $1 WHERE id = $2', [avatarPath, req.session.user.id]);

    res.json({ avatar: avatarPath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============================
// AUTH
// ============================
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: 'Fill all fields' });

    if (await dbUsers.findUserByEmail(email))
      return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUserId = await dbUsers.addUser({ username, email, password: hashedPassword });

    const user = await dbUsers.findUserByEmail(email);
    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    };

    res.json({ ok: true, user: req.session.user });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await dbUsers.findUserByEmail(email);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    };

    res.json({ ok: true, user: req.session.user });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
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

// ============================
// WISHLISTS
// ============================
app.get('/wishlists', async (req, res) => {
  try {
    const { user_id } = req.query;
    let wishlists;

    if (user_id) {
      const { rows } = await pool.query(
        'SELECT id, title, description, user_id, cover FROM wishlists WHERE user_id = $1',
        [user_id]
      );
      wishlists = rows;
    } else {
      if (!req.session.user) return res.status(401).json({ message: 'Not logged in' });
      const { rows } = await pool.query(
        'SELECT id, title, description, user_id, cover FROM wishlists WHERE user_id = $1',
        [req.session.user.id]
      );
      wishlists = rows;
    }

    res.json(wishlists);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/wishlists/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      'SELECT id, title, description, user_id, cover FROM wishlists WHERE id = $1',
      [id]
    );

    if (rows.length === 0) return res.status(404).json({ message: 'Wishlist not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/wishlists', requireAuth, async (req, res) => {
  try {
    const { title, description } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO wishlists (user_id, title, description) VALUES ($1, $2, $3) RETURNING id',
      [req.session.user.id, title, description]
    );

    res.json({
      id: rows[0].id,
      title,
      description,
      user_id: req.session.user.id,
    });
  } catch (err) {
    console.error('Create wishlist ERROR:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Решта маршрутів для items/wishlist cover/item cover — аналогічно: ? → $1, insertId → RETURNING

// ============================
// START SERVER
// ============================
(async () => {
  try {
    await pool.query('SELECT 1');
    console.log('PostgreSQL connected successfully');
  } catch (err) {
    console.error('Error connecting to PostgreSQL:', err);
    process.exit(1);
  }
})();

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
