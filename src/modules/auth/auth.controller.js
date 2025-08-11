const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require = require('../../config/env');
const { findByEmail } = require('./auth.model');

async function login(req, res) {
    const { email, senha } = req.body;
    const user = await findByEmail(email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(senha, user.senha_hash);
    if(!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
        { sub: user.id, role: user.role, empresa_id: user.empresa_id || null },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRES_IN || '1h' }
    );

    res.json({
        token,
        user: { id: user.id, nome: user.nome, email: user.email, role: user.role, empresa_id: user.empresa_id }
    });
}

module.exports = { login };