const bcrypt = require('bcryptjs');
const { create, listScoped } = require('./user.model');
const { createUserBySuperadmin, createUserByAdmin } = require('./user.schema');

async function createUser(req, res, next) {
  try {
    // regra por papel
    let data;

    if (req.user.role === 'superadmin') {
      // superadmin pode criar admin/usuario, mas deve informar empresa_id
      data = createUserBySuperadmin.parse(req.body);
    } else if (req.user.role === 'admin') {
      // admin só cria usuario e SEM empresa_id no body → força sua própria empresa
      const parsed = createUserByAdmin.parse(req.body);
      data = { ...parsed, empresa_id: req.user.empresa_id };
    } else {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // normaliza email para lowercase (único por empresa em lower(email))
    const emailLower = String(data.email).trim().toLowerCase();

    const senha_hash = await bcrypt.hash(data.senha, 10);

    const user = await create({
      nome: data.nome.trim(),
      email: emailLower,
      senha_hash,
      role: data.role,            // admin => 'usuario', superadmin => 'admin'|'usuario'
      empresa_id: data.empresa_id // admin => req.user.empresa_id
    });

    // responde apenas campos seguros
    return res.status(201).json({
      id: user.id,
      nome: user.nome,
      email: user.email,
      role: user.role,
      empresa_id: user.empresa_id,
      created_at: user.created_at
    });
    
  } catch (err) {
    // Violação de unicidade (email por empresa)
    if (err && err.code === '23505') {
      return res.status(409).json({
        error: 'Conflict',
        message: 'E-mail já existe para esta empresa'
      });
    }
    // Violação de chave estrangeira (empresa_id inválido quando superadmin cria)
    if (err && err.code === '23503') {
      return res.status(400).json({
        error: 'BadRequest',
        message: 'empresa_id inválido (empresa não encontrada)'
      });
    }
    // Validação Zod fica no middleware validate, mas deixo um fallback:
    if (err && err.name === 'ZodError') {
      return res.status(400).json({
        error: 'ValidationError',
        issues: err.issues
      });
    }
    return next(err);
  }
}

async function listUsers(req, res, next) {
  try {
    const data = await listScoped({
      role: req.user.role,
      empresa_id: req.user.empresa_id
    });
    return res.json(data);
  } catch (err) {
    return next(err);
  }
}

module.exports = { createUser, listUsers };