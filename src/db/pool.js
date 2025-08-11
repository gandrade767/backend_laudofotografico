const { Pool } = require('pg');
const env = require('../config/env');

const pool = new Pool({
  host: env.PGHOST,
  port: env.PGPORT,
  database: env.PGDATABASE,
  user: env.PGUSER,
  password: env.PGPASSWORD,
  ssl: env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : false
});

pool.on('error', (err) => {
  console.error('Erro inesperado no pool do Postgres:', err);
  process.exit(-1);
});

module.exports = pool;
