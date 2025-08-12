// src/middlewares/auth.js
const jwt = require('jsonwebtoken');
const env = require('../config/env');

function requireAuth(req, res, next) {
  try {
    const authHeader = (req.headers && req.headers.authorization) || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const payload = jwt.verify(token, env.JWT_SECRET);
    // payload: { sub, role, empresa_id, iat, exp }
    req.user = {
      sub: payload.sub,
      role: payload.role,
      empresa_id: payload.empresa_id ?? null
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

module.exports = { requireAuth };
