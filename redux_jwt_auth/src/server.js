const express = require('express');
const mariadb = require('mariadb');

const app = express();
const port = 5000;

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'mydatabase',
});

// API 엔드포인트를 만듭니다.
app.get('/api/data', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM test1');
    conn.release();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});