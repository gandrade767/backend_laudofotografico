// exemplo em src/modules/usuarios/user.routes.js
const express = require('express');
const { requireAuth } = require('../../middlewares/auth');
const { requireRole } = require('../../middlewares/rbac');
const { createUser, listUsers } = require('./user.controller');

const router = express.Router();

router.post('/', requireAuth, requireRole(['superadmin','admin']), createUser);
router.get('/',  requireAuth, requireRole(['superadmin','admin']), listUsers);

module.exports = router;
