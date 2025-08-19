const express = require('express');
const { validate } = require('../../middlewares/validate');
const { requireAuth } = require('../../middlewares/auth');
const { requireRole } = require('../../middlewares/rbac');
const { createLaudoSchema, listLaudosQuerySchema, idParamSchema } = require('./laudo.schema');
const { createLaudo, listLaudos, getLaudo } = require('./laudo.controller');

const router = express.Router();

// apenas admin/usuario
router.post('/', requireAuth, requireRole(['admin','usuario']),
  validate({ body: createLaudoSchema }), createLaudo);

router.get('/', requireAuth, requireRole(['admin','usuario']),
  validate({ query: listLaudosQuerySchema }), listLaudos);

router.get('/:id', requireAuth, requireRole(['admin','usuario']),
  validate({ params: idParamSchema }), getLaudo);

module.exports = router;