const express = require('express');
const healthRoutes = require('./health.routes');
const empresaRoutes = require('../modules/empresas/empresa.routes'); // <-- aqui

const router = express.Router();

router.use('/', healthRoutes);
router.use('/empresas', empresaRoutes); // <-- aqui

module.exports = router;
