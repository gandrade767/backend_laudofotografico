const express = require('express');
const healthRoutes = require('./health.routes');
const empresaRoutes = require('../modules/empresas/empresa.routes.js');
const authRoutes = require('../modules/auth/auth.routes.js');      // <-- aqui
const userRoutes = require('../modules/usuarios/user.routes.js');  // se já criou
const usageRoutes = require('../modules/usage/usage.routes.js');
const laudoRoutes = require('../modules/laudos/laudo.routes.js');

const router = express.Router();

router.use('/', healthRoutes);
router.use('/auth', authRoutes);        // <-- aqui
router.use('/empresas', empresaRoutes);
router.use('/usuarios', userRoutes);    // se já criou
router.use('/usage', usageRoutes);
router.use('/laudos', laudoRoutes);

module.exports = router;
