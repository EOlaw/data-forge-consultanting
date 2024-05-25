const express = require('express');
const router = express.Router();
const consultantControllers = require('../controllers/consultantControllers')
const { isAuthenticated, isAdmin } = require('../controllers/authControllers');

router.route('/')
    .post(consultantControllers.createConsultantProfile)
    .get(consultantControllers.getConsultantsProfile)
router.route('/:id')
    .get(consultantControllers.getConsultantProfile)
    .put(consultantControllers.updateConsultantProfile)
    .delete(consultantControllers.deleteConsultantProfile)

module.exports = router;