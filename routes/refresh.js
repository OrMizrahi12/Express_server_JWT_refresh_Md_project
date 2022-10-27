const express = require('express');
const router = express.Router();
const refreshTokenController = require('../controllers/refreshTokenController'); //#13

router.get('/', refreshTokenController.handleRefreshToken);

module.exports = router;

