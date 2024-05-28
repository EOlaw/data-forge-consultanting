const express = require('express');
const router = express.Router();
const consultantControllers = require('../controllers/consultantControllers')
const { isAuthenticated, isAdmin, isAuthorizedAsConsultant, isAuthorizedAsClient } = require('../controllers/authControllers');

router.route('/')
    .post(consultantControllers.createConsultant)
    .get(consultantControllers.getConsultants)
router.route('/:id')
    .get(isAuthenticated, isAuthorizedAsConsultant, consultantControllers.getConsultant)
    .put(isAuthenticated, isAuthorizedAsConsultant,consultantControllers.updateConsultant)
    .delete(isAuthenticated, isAuthorizedAsConsultant,consultantControllers.deleteConsultant)

module.exports = router;