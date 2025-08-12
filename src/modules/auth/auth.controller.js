const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../../config/env');
const { findByEmail } = require('./auth.model');

async function login(req, res) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'ValidationError', message: 'email e senha são obrigatórios' });
    }
    if (!env.JWT_SECRET) {
      return res.status(500).json({ error: 'ServerMisconfigured', message: 'JWT_SECRET ausente no .env' });
    }

    const user = await findByEmail(email);
    if (!user) return res.status(401).json({ error: 'InvalidCredentials' });

    const ok = await bcrypt.compare(senha, user.senha_hash);
    if (!ok) return res.status(401).json({ error: 'InvalidCredentials' });

    const token = jwt.sign(
      { sub: user.id, role: user.role, empresa_id: user.empresa_id ?? null },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN || '1h' }
    );

    return res.json({
      token,
      user: { id: user.id, nome: user.nome, email: user.email, role: user.role, empresa_id: user.empresa_id }
    });
  } catch (err) {
    console.error('[auth.login] erro:', err);
    return res.status(500).json({ error: 'InternalServerError', message: err.message });
  }
}
module.exports = { login };
