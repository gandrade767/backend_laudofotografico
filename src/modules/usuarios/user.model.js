const pool = require('../../db/pool');

async function create({ nome, email, senha_hash, role, empresa_id }) {
  const { rows } = await pool.query(
    `INSERT INTO usuarios (nome, email, senha_hash, role, empresa_id)
     VALUES ($1,$2,$3,$4,$5) RETURNING id, nome, email, role, empresa_id, created_at`,
    [nome, email, senha_hash, role, empresa_id ?? null]
  );
  return rows[0];
}

async function listScoped({ role, empresa_id }) {
  if (role === 'superadmin') {
    const { rows } = await pool.query(
      `SELECT id, nome, email, role, empresa_id, created_at FROM usuarios ORDER BY id DESC`
    );
    return rows;
  } else {
    const { rows } = await pool.query(
      `SELECT id, nome, email, role, empresa_id, created_at FROM usuarios WHERE empresa_id = $1 ORDER BY id DESC`,
      [empresa_id]
    );
    return rows;
  }
}

module.exports = { create, listScoped };