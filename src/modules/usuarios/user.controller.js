const bcrypt = require('bcryptjs');
const { create, listScoped } = require('./user.model');
const { createUserBySuperadmin, createUserByAdmin } = require('./user.schema');

async function createUser(req, res, next) {
  try {
    // regra por papel
    let data;
    if (req.user.role === 'superadmin') {
      data = createUserBySuperadmin.parse(req.body); // precisa empresa_id e role (admin/usuario)
    } else if (req.user.role === 'admin') {
      // força empresa_id do admin e role = usuario
      const parsed = createUserByAdmin.parse(req.body);
      data = { ...parsed, empresa_id: req.user.empresa_id };
    } else {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const senha_hash = await bcrypt.hash(data.senha, 10);
    const user = await create({
      nome: data.nome,
      email: data.email,
      senha_hash,
      role: data.role,
      empresa_id: data.empresa_id
    });

    res.status(201).json(user);
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: 'ValidationError', issues: err.issues });
    }
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Conflict', message: 'E-mail já existe para esta empresa' });
    }
    next(err);
  }
}

async function listUsers(req, res, next) {
  try {
    const data = await listScoped({ role: req.user.role, empresa_id: req.user.empresa_id });
    res.json(data);
  } catch (err) { next(err); }
}

module.exports = { createUser, listUsers };