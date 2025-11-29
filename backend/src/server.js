import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import pinoHttp from 'pino-http';
import cors from 'cors';
import bcrypt from 'bcryptjs';

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

/* ============================
   AUTH
============================ */
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: 'Fill all fields' });

    if (await dbUsers.findUserByEmail(email))
      return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await dbUsers.addUser({ username, email, password: hashedPassword });

    const user = await dbUsers.findUserByEmail(email);
    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
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

/* ============================
   WISHLISTS
============================ */

app.get('/wishlists', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM wishlists WHERE user_id = ?`,
      [req.session.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/wishlists/:id', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM wishlists WHERE id = ? AND user_id = ?`,
      [req.params.id, req.session.user.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: 'Wishlist not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Get wishlist error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/wishlists', requireAuth, async (req, res) => {
  try {
    const { title, description } = req.body;
    const [result] = await pool.query(
      `INSERT INTO wishlists (user_id, title, description) VALUES (?, ?, ?)`,
      [req.session.user.id, title, description]
    );
    res.json({
      id: result.insertId,
      title,
      description,
      user_id: req.session.user.id,
    });
  } catch (err) {
    console.error('Create wishlist ERROR:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.put('/wishlists/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    await pool.query(
      `UPDATE wishlists SET title = ?, description = ? WHERE id = ? AND user_id = ?`,
      [title, description, id, req.session.user.id]
    );
    res.json({ id, title, description });
  } catch (err) {
    console.error('Update wishlist error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/wishlists/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(
      `DELETE FROM wishlists WHERE id = ? AND user_id = ?`,
      [id, req.session.user.id]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error('Delete wishlist error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* ============================
   ITEMS
============================ */


app.get('/items', requireAuth, async (req, res) => {
  try {
    const { wishlist_id } = req.query;
    if (!wishlist_id) return res.status(400).json({ message: 'wishlist_id is required' });

    const [rows] = await pool.query(
      `SELECT * FROM items WHERE wishlist_id = ?`,
      [wishlist_id]
    );

    res.json(rows);
  } catch (err) {
    console.error('Get items error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/items', requireAuth, async (req, res) => {
  try {
    const { name, price, link, wishlist_id } = req.body;

    const [result] = await pool.query(
      `INSERT INTO items (wishlist_id, name, price, link) VALUES (?, ?, ?, ?)`,
      [wishlist_id, name, price, link]
    );

    res.json({
      id: result.insertId,
      name,
      price,
      link,
      wishlist_id,
    });
  } catch (err) {
    console.error('Create item error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


app.delete('/items/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(
      `DELETE FROM items WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ ok: true });
  } catch (err) {
    console.error('Delete item error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


/* ============================
   START SERVER
============================ */
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
