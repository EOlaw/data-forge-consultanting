const express = require('express');
const router = express.Router();
const consultantProfileControllers = require('../controllers/consultantProfileControllers')
const { isAuthenticated, isAdmin } = require('../controllers/authControllers');

router.route('/')
    .post(consultantProfileControllers.createConsultantProfile)
    .get(consultantProfileControllers.getConsultantsProfile)
router.route('/:id')
    .get(consultantProfileControllers.getConsultantProfile)
    .put(consultantProfileControllers.updateConsultantProfile)
    .delete(consultantProfileControllers.deleteConsultantProfile)

module.exports = router;