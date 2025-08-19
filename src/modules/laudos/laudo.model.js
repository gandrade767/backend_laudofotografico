const pool = require('../../db/pool');

async function create({ empresa_id, criado_por, titulo, descricao }) {
  const { rows } = await pool.query(
    `INSERT INTO laudos (empresa_id, criado_por, titulo, descricao)
     VALUES ($1,$2,$3,$4)
     RETURNING *`,
    [empresa_id, criado_por, titulo, descricao ?? null]
  );
  return rows[0];
}

async function list({ empresa_id, user_id, page=1, limit=10, status, me }) {
  const p = [];
  const where = [];

  // escopo SEMPRE pela empresa do token (admin/usuario)
  p.push(empresa_id);
  where.push(`empresa_id = $${p.length}`);

  if (status) {
    p.push(status);
    where.push(`status = $${p.length}`);
  }
  if (me === 'true') {
    p.push(user_id);
    where.push(`criado_por = $${p.length}`);
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const pageNum = Number(page) > 0 ? Number(page) : 1;
  const limitNum = Number(limit) > 0 && Number(limit) <= 100 ? Number(limit) : 10;
  const offset = (pageNum - 1) * limitNum;

  const countSql = `SELECT COUNT(*) FROM laudos ${whereSql}`;
  const dataSql = `
    SELECT * FROM laudos
    ${whereSql}
    ORDER BY id DESC
    LIMIT $${p.length + 1} OFFSET $${p.length + 2}
  `;

  const [c, d] = await Promise.all([
    pool.query(countSql, p),
    pool.query(dataSql, [...p, limitNum, offset]),
  ]);

  return { total: Number(c.rows[0].count), data: d.rows };
}

async function getByIdScoped({ id, empresa_id }) {
  const { rows } = await pool.query(
    `SELECT * FROM laudos WHERE id = $1 AND empresa_id = $2 LIMIT 1`,
    [id, empresa_id]
  );
  return rows[0] || null;
}

module.exports = { create, list, getByIdScoped };
