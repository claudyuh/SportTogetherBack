const express = require('express');
const router = express.Router();
const {showEvents, createEvent, showMyEvents, deleteEvent} = require('../controllers/events');
const { isLoggedIn } = require('../middleware/checkIfAuth');

router.route('/events')
        .get(isLoggedIn, showEvents)

router.route('/events/myevents')
        .get(isLoggedIn, showMyEvents)
        .delete(isLoggedIn, deleteEvent)

router.route('/createEvent')
        .post(isLoggedIn, createEvent)


module.exports = router;