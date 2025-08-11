const pool = require('../../db/pool');

async function findByEmail(email) {
    const { rows } = await pool.query(
        'SELECT * FROM usuarios WHERE email = $1 AND ativo = true LIMIT 1',
        [email]
    );
    return rows[0] || null;
}

module.exports = { findByEmail };