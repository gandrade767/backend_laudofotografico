const pool = require('../../db/pool');

async function create({ nome, cnpj }) {
  const { rows } = await pool.query(
    `INSERT INTO empresas (nome, cnpj)
     VALUES ($1, NULLIF($2,''))
     RETURNING *`,
    [nome, cnpj ?? null]
  );
  return rows[0];
}

async function list({ page, limit, search }) {
  const offset = (page - 1) * limit;
  const where = [];
  const params = [];
  if (search) {
    params.push(`%${search}%`);
    // se não tiver unaccent, troque por: nome ILIKE $1
    where.push(`(unaccent(nome) ILIKE unaccent($${params.length}))`);
  }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const countSql = `SELECT COUNT(*) FROM empresas ${whereSql}`;
  const dataSql  = `
    SELECT * FROM empresas
    ${whereSql}
    ORDER BY id DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

  const [countRes, dataRes] = await Promise.all([
    pool.query(countSql, params),
    pool.query(dataSql, params),
  ]);

  return {
    total: Number(countRes.rows[0].count),
    data: dataRes.rows
  };
}

async function getById(id) {
  const { rows } = await pool.query(`SELECT * FROM empresas WHERE id = $1`, [id]);
  return rows[0] || null;
}

async function update(id, changes) {
  const fields = [];
  const values = [];
  let idx = 1;

  for (const [k, v] of Object.entries(changes)) {
    fields.push(`${k} = $${idx++}`);
    values.push(v);
  }
  values.push(id);

  const sql = `
    UPDATE empresas
       SET ${fields.join(', ')}, created_at = created_at
     WHERE id = $${idx}
     RETURNING *`;
  const { rows } = await pool.query(sql, values);
  return rows[0] || null;
}

async function remove(id) {
  const res = await pool.query(`DELETE FROM empresas WHERE id = $1`, [id]);
  return res.rowCount > 0;
}

module.exports = { create, list, getById, update, remove };
