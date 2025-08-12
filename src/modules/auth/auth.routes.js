const express = require('express');
const { validate } = require('../../middlewares/validate');
const { loginSchema } = require('./auth.schema');
const { login } = require('./auth.controller');

const router = express.Router();

router.post('/login', validate({ body: loginSchema }), login);

module.exports = router;
