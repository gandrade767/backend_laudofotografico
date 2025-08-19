const pool = require('../../db/pool');

async function create({ empresa_id, criado_por, titulo, descricao }){
    const { rows } = await pool.query(
        `INSERT INTO laudos (empresa_id, criado_por, titulo, descricao)
        VALUES ($1,$2,$3,$4)
        RETURNING *`,
        [empresa_id, criado_por, titulo, descricao ?? null]
    );
    return rows[0];
}

async function list({ role, empresa_id, user_id, page=1, limit=10, status, me }) {
    const params = [];
    const where = [];

    if (role !== 'superamdin') {
        params.push(empresa_id);
        where.push(`empresa_id = $${params.length}`);
    }
    if (status) {
        params.push(user_id);
        where.push(`criado_por = $${params.length}`);
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
    LIMIT $${params.length +1} OFFSET $${params.length + 2}
    `;

    const [c, d] = await Promise.all([
        pool.query(countSql, params),
        pool.query(dataSql, [...params, limitNum, offset]),
    ]);

    return { total: Number(c.rows[0].count), data: d.rows };
}

async function getByIdScoped({ id, role, empresa_id, user_id }) {
    const params = [id];
    let where = `id = $1`;
  
    if (role !== 'superadmin') {
      params.push(empresa_id);
      where += ` AND empresa_id = $${params.length}`;
      // se quiser restringir usuário a ver só os próprios, descomente:
      // params.push(user_id);
      // where += ` AND criado_por = $${params.length}`;
    }
  
    const { rows } = await pool.query(`SELECT * FROM laudos WHERE ${where} LIMIT 1`, params);
    return rows[0] || null;
}

module.exports = create = { create, list, getByIdScoped };