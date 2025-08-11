const jwt = require('jsonwebtoken');
const env = require('../config/env');

function require(req, res, next) {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const payload = jwt.verify(token, env.JWT_SECRET);
        req.user = payload; //{ sub, role, empresa_id}
        next();
    } catch {
        return res.status(401).json({ error: 'Unauthorized' });
    }
}

module.exports = { requireAuth };