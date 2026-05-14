const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');

dotenv.config();

const DB_HOST = process.env.MYSQL_HOST || '127.0.0.1';
const DB_PORT = Number(process.env.MYSQL_PORT || 3306);
const DB_USER = process.env.MYSQL_USER || 'root';
const DB_PASSWORD = process.env.MYSQL_PASSWORD || '';
const DB_NAME = process.env.MYSQL_DATABASE || 'kudzidzapp';
const PORT = Number(process.env.PORT || 8001);

const app = express();
app.use(express.json());
app.use(cors({ origin: '*', credentials: true }));

let db = null;

async function connectToDatabase() {
  try {
    const bootstrap = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
    });

    await bootstrap.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    await bootstrap.end();

    db = mysql.createPool({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      namedPlaceholders: true,
    });

    await ensureSchema();
    console.log('Connected to MySQL');
  } catch (error) {
    db = null;
    console.error('MySQL connection failed:', error.message);
  }
}

async function ensureSchema() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS status_checks (
      id VARCHAR(64) PRIMARY KEY,
      client_name VARCHAR(255) NOT NULL,
      timestamp DATETIME(3) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS progress (
      user_id VARCHAR(255) PRIMARY KEY,
      stars INT NOT NULL DEFAULT 0,
      level INT NOT NULL DEFAULT 1,
      letters_completed JSON NOT NULL,
      words_completed JSON NOT NULL,
      math_completed JSON NOT NULL,
      tracing_completed JSON NOT NULL,
      language VARCHAR(20) NOT NULL DEFAULT 'both',
      updated_at DATETIME(3) NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
}

function normalizeStatusDoc(doc) {
  return {
    id: doc.id,
    client_name: doc.client_name,
    timestamp: new Date(doc.timestamp).toISOString(),
  };
}

function parseJsonArray(value) {
  if (!value) {
    return [];
  }
  if (Array.isArray(value)) {
    return value;
  }
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
}

function normalizeProgressRow(row) {
  return {
    user_id: row.user_id,
    stars: row.stars,
    level: row.level,
    letters_completed: parseJsonArray(row.letters_completed),
    words_completed: parseJsonArray(row.words_completed),
    math_completed: parseJsonArray(row.math_completed),
    tracing_completed: parseJsonArray(row.tracing_completed),
    language: row.language || 'both',
    updated_at: row.updated_at ? new Date(row.updated_at).toISOString() : null,
  };
}

function defaultProgress(userId) {
  return {
    user_id: userId,
    stars: 0,
    level: 1,
    letters_completed: [],
    words_completed: [],
    math_completed: [],
    tracing_completed: [],
    language: 'both',
  };
}

app.get('/', (_req, res) => {
  res.json({
    app: 'Tanga Kudzidza API',
    version: '1.0.0',
    status: 'running',
  });
});

app.get('/api/', (_req, res) => {
  res.json({ message: 'Hello World' });
});

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    database: db ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/status', async (req, res) => {
  if (!db) {
    return res.status(503).json({ detail: 'Database not available' });
  }

  const { client_name: clientName } = req.body || {};
  if (!clientName || typeof clientName !== 'string') {
    return res.status(400).json({ detail: 'client_name is required' });
  }

  const status = {
    id: uuidv4(),
    client_name: clientName,
    timestamp: new Date().toISOString(),
  };

  await db.query(
    'INSERT INTO status_checks (id, client_name, timestamp) VALUES (?, ?, ?)',
    [status.id, status.client_name, status.timestamp]
  );
  return res.status(201).json(status);
});

app.get('/api/status', async (_req, res) => {
  if (!db) {
    return res.status(503).json({ detail: 'Database not available' });
  }

  const [rows] = await db.query(
    'SELECT id, client_name, timestamp FROM status_checks ORDER BY timestamp DESC LIMIT 1000'
  );
  return res.json(rows.map(normalizeStatusDoc));
});

app.get('/api/progress/:user_id', async (req, res) => {
  if (!db) {
    return res.status(503).json({ detail: 'Database not available' });
  }

  const { user_id: userId } = req.params;
  const [rows] = await db.query('SELECT * FROM progress WHERE user_id = ? LIMIT 1', [userId]);
  const progress = rows[0];

  if (!progress) {
    return res.json(defaultProgress(userId));
  }

  return res.json(normalizeProgressRow(progress));
});

app.post('/api/progress/:user_id', async (req, res) => {
  if (!db) {
    return res.status(503).json({ detail: 'Database not available' });
  }

  const { user_id: userId } = req.params;
  const payload = req.body || {};
  const values = {
    userId,
    stars: payload.stars ?? null,
    level: payload.level ?? null,
    lettersCompleted: payload.letters_completed !== undefined ? JSON.stringify(payload.letters_completed) : null,
    wordsCompleted: payload.words_completed !== undefined ? JSON.stringify(payload.words_completed) : null,
    mathCompleted: payload.math_completed !== undefined ? JSON.stringify(payload.math_completed) : null,
    tracingCompleted: payload.tracing_completed !== undefined ? JSON.stringify(payload.tracing_completed) : null,
    language: payload.language ?? null,
    updatedAt: new Date().toISOString(),
  };

  const [result] = await db.query(
    `INSERT INTO progress (
      user_id, stars, level, letters_completed, words_completed, math_completed, tracing_completed, language, updated_at
    ) VALUES (
      :userId,
      COALESCE(:stars, 0),
      COALESCE(:level, 1),
      COALESCE(:lettersCompleted, JSON_ARRAY()),
      COALESCE(:wordsCompleted, JSON_ARRAY()),
      COALESCE(:mathCompleted, JSON_ARRAY()),
      COALESCE(:tracingCompleted, JSON_ARRAY()),
      COALESCE(:language, 'both'),
      :updatedAt
    )
    ON DUPLICATE KEY UPDATE
      stars = COALESCE(:stars, stars),
      level = COALESCE(:level, level),
      letters_completed = COALESCE(:lettersCompleted, letters_completed),
      words_completed = COALESCE(:wordsCompleted, words_completed),
      math_completed = COALESCE(:mathCompleted, math_completed),
      tracing_completed = COALESCE(:tracingCompleted, tracing_completed),
      language = COALESCE(:language, language),
      updated_at = :updatedAt`,
    values
  );

  return res.json({
    success: true,
    user_id: userId,
    modified: result.affectedRows > 0,
    message: 'Progress saved successfully',
  });
});

app.delete('/api/progress/:user_id', async (req, res) => {
  if (!db) {
    return res.status(503).json({ detail: 'Database not available' });
  }

  const { user_id: userId } = req.params;
  await db.query('DELETE FROM progress WHERE user_id = ?', [userId]);

  return res.json({
    success: true,
    user_id: userId,
    message: 'Progress reset successfully',
  });
});

app.get('/api/stats', async (_req, res) => {
  if (!db) {
    return res.status(503).json({ detail: 'Database not available' });
  }

  const [totalRows] = await db.query('SELECT COUNT(*) AS total_users FROM progress');
  const [statsRows] = await db.query(
    'SELECT COALESCE(SUM(stars), 0) AS total_stars, COALESCE(AVG(level), 1) AS avg_level, COALESCE(MAX(level), 1) AS max_level FROM progress'
  );
  const totalUsers = totalRows[0]?.total_users || 0;

  if (!totalUsers) {
    return res.json({
      total_users: 0,
      total_stars: 0,
      average_level: 1,
      max_level: 1,
    });
  }

  const row = statsRows[0];
  return res.json({
    total_users: totalUsers,
    total_stars: row.total_stars || 0,
    average_level: Number((row.avg_level || 1).toFixed(2)),
    max_level: row.max_level || 1,
  });
});

async function startServer() {
  await connectToDatabase();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend listening on port ${PORT}`);
  });
}

function closeDatabase() {
  if (db) {
    return db.end();
  }
  return Promise.resolve();
}

process.on('SIGINT', async () => {
  await closeDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeDatabase();
  process.exit(0);
});

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
