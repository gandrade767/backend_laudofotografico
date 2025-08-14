const pool = require('../db/pool');

function health(req, res) {
  res.json({
    ok: true,
    service: 'laudo-backend',
    timestamp: new Date().toISOString()
  });
}

async function dbCheck(req, res) {
  try {
    const result = await pool.query('SELECT 1 as alive');
    res.json({ db: 'ok', result: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ db: 'error', message: err.message });
  }
}

module.exports = { health, dbCheck };