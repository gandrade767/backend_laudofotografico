const express = require('express');
const healthRoutes = require('./health.routes');
const empresaRoutes = require('../modules/empresas/empresa.routes.js');
const authRoutes = require('../modules/auth/auth.routes.js');      // <-- aqui
const userRoutes = require('../modules/usuarios/user.routes.js');  // se já criou

const router = express.Router();

router.use('/', healthRoutes);
router.use('/auth', authRoutes);        // <-- aqui
router.use('/empresas', empresaRoutes);
router.use('/usuarios', userRoutes);    // se já criou

module.exports = router;
