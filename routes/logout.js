//#16 
// the rouet of logout
// for continue, go to #17 in server.js

const express = require('express');
const router = express.Router();
const logoutController = require('../controllers/logoutController');

router.get('/', logoutController.handleLogout);

module.exports = router;