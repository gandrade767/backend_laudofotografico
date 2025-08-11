const express = require('express');
const { health, dbCheck } = require('../controllers/health.controller');

const router = express.Router();

router.get('/health', health);
router.get('/db-check', dbCheck);

module.exports = router;
