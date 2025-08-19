const express = require('express');
const { requireAuth } = require('../../middlewares/auth');
const { requireRole } = require('../../middlewares/rbac');
const { usageAll, usageOne } = require('./usage.controller');

const router = express.Router();

// somente superadmin
router.get('/empresas', requireAuth, requireRole(['superadmin']), usageAll);
router.get('/empresas/:empresa_id', requireAuth, requireRole(['superadmin']), usageOne);

module.exports = router;