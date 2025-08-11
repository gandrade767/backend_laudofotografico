const model = require('./empresa.model');

async function createEmpresa(req, res, next) {
  try {
    const { nome, cnpj } = req.body;
    const empresa = await model.create({ nome, cnpj });
    res.status(201).json(empresa);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Conflict', message: 'CNPJ já cadastrado' });
    }
    next(err);
  }
}

async function listEmpresas(req, res, next) {
  try {
    const { page, limit, search } = req.query;
    const result = await model.list({ page, limit, search });
    res.json({ page, limit, total: result.total, data: result.data });
  } catch (err) {
    next(err);
  }
}

async function getEmpresa(req, res, next) {
  try {
    const { id } = req.params;
    const empresa = await model.getById(id);
    if (!empresa) return res.status(404).json({ error: 'NotFound' });
    res.json(empresa);
  } catch (err) {
    next(err);
  }
}

async function updateEmpresa(req, res, next) {
  try {
    const { id } = req.params;
    const updated = await model.update(id, req.body);
    if (!updated) return res.status(404).json({ error: 'NotFound' });
    res.json(updated);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Conflict', message: 'CNPJ já cadastrado' });
    }
    next(err);
  }
}

async function deleteEmpresa(req, res, next) {
  try {
    const { id } = req.params;
    const ok = await model.remove(id);
    if (!ok) return res.status(404).json({ error: 'NotFound' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createEmpresa,
  listEmpresas,
  getEmpresa,
  updateEmpresa,
  deleteEmpresa
};
