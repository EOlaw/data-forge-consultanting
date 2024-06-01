const express = require('express');
const router = express.Router();
const homeControllers = require('../controllers/homeControllers');

router.route('/')
    .get(homeControllers.homepage)
router.route('/about')
    .get(homeControllers.about)
router.route('/services')
    .get(homeControllers.services)
router.route('/portfolio')
    .get(homeControllers.portfolio)
router.route('/team')
    .get(homeControllers.team)
router.route('/contact')
    .get(homeControllers.contact)

module.exports = router