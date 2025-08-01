const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 5000;
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || '2968bca35ffd898c4fdfcbf96f762ffac563e4c0f19f83e59a0395eb05ff7266'; // Use environment variable or fallback

app.use(cors());
app.use(bodyParser.json());

// MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Sagarpalli123@#', // MySQL Password
  database: 'mini_project_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Helper function to query database with promises
const query = (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.execute(sql, values, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

const jwtMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Authorization header missing' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token missing' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please provide username, email and password' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Signup error:', err);  // Added detailed error logging
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ message: 'Username or email already exists' });
  } else {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }
  try {
    const users = await query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// Get all tasks for logged-in user
app.get('/api/tasks', jwtMiddleware, async (req, res) => {
  try {
    const tasks = await query('SELECT * FROM tasks WHERE user_id = ?', [req.user.id]);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Add new task
app.post('/api/tasks', jwtMiddleware, async (req, res) => {
  const { status, portfolio } = req.body;
  if (!portfolio) {
    return res.status(400).json({ message: 'Task portfolio is required' });
  }
  try {
    const result = await query('INSERT INTO tasks (user_id, status, portfolio) VALUES (?, ?, ?)', [req.user.id, status || 'TODO', portfolio]);
    res.status(201).json({ message: 'Task added successfully', taskId: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update task
app.put('/api/tasks/:id', jwtMiddleware, async (req, res) => {
  const taskId = req.params.id;
  const { status, portfolio } = req.body;
  if (!portfolio) {
    return res.status(400).json({ message: 'Task portfolio is required' });
  }
  try {
    const result = await query('UPDATE tasks SET status = ?, portfolio = ? WHERE id = ? AND user_id = ?', [status || 'TODO', portfolio, taskId, req.user.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found or not authorized' });
    }
    res.json({ message: 'Task updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete task
app.delete('/api/tasks/:id', jwtMiddleware, async (req, res) => {
  const taskId = req.params.id;
  try {
    const result = await query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [taskId, req.user.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found or not authorized' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
