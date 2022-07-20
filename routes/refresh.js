const express = require('express');
const router = express.Router();
const refreshTokenController = require('../controllers/refreshTokenController'); //#13

// we need GET the token
router.get('/', refreshTokenController.handleRefreshToken);

module.exports = router;

// to #14, go to server,js -->