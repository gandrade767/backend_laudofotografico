const express = require('express');
const { validate } = require('../../middlewares/validate.js');
const { requireAuth } = require('../../middlewares/auth');
const { requireRole } = require('../../middlewares/rbac');
const {
  createEmpresaSchema,
  updateEmpresaSchema,
  listEmpresasQuerySchema,
  idParamSchema
} = require('./empresa.schema');
const {
  createEmpresa,
  listEmpresas,
  getEmpresa,
  updateEmpresa,
  deleteEmpresa
} = require('./empresa.controller');

const router = express.Router();

router.post(
  '/',
  requireAuth,
  requireRole(['superadmin']), // ✅ só superadmin cria empresa
  validate({ body: createEmpresaSchema }),
  createEmpresa
);

router.get(
  '/',
  validate({ query: listEmpresasQuerySchema }),
  listEmpresas
);

router.get(
  '/:id',
  validate({ params: idParamSchema }),
  getEmpresa
);

router.patch(
  '/:id',
  validate({ params: idParamSchema, body: updateEmpresaSchema }),
  updateEmpresa
);

router.delete(
  '/:id',
  validate({ params: idParamSchema }),
  deleteEmpresa
);

module.exports = router;
