const express = require('express');
const { weatherData } = require('../controllers/weather');
const { isLoggedIn } = require( '../middleware/checkIfAuth' )
const router = express.Router();

router.route('/weatherdata')
    .get(isLoggedIn ,weatherData)

module.exports = router;