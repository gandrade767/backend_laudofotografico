const pool = require('../../db/pool');

//total por empresa
async function getUsageByCompany() {
    const { rows } = await pool.query(
      `SELECT e.id AS empresa_id, e.nome AS empresa_nome,
              COALESCE(SUM(f.size), 0) AS total_bytes
         FROM empresas e
         LEFT JOIN laudos l   ON l.empresa_id = e.id
         LEFT JOIN laudo_fotos f ON f.laudo_id = l.id
     GROUP BY e.id, e.nome
     ORDER BY total_bytes DESC, e.nome ASC`
    );
    return rows;
}

//total só de uma empresa
async function getUsageFor(empresa_id) {
    const { rows } = await pool.query(
      `SELECT e.id AS empresa_id, e.nome AS empresa_nome,
              COALESCE(SUM(f.size), 0) AS total_bytes
         FROM empresas e
         LEFT JOIN laudos l   ON l.empresa_id = e.id
         LEFT JOIN laudo_fotos f ON f.laudo_id = l.id
        WHERE e.id = $1
     GROUP BY e.id, e.nome`,
      [empresa_id]
    );
    return rows[0] || { empresa_id, empresa_nome: null, total_bytes: 0 };
}

module.exports = { getUsageByCompany, getUsageFor };