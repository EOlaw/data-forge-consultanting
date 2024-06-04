const express = require('express');
const router = express.Router();
const consultantControllers = require('../controllers/consultantControllers')
const { isAuthenticated, isAdmin, isAuthorizedAsConsultant, isAuthorizedAsClient } = require('../controllers/authControllers');

// Render form to create a new consultant profile
router.route('/new')
    .get(isAuthenticated, isAuthorizedAsConsultant, consultantControllers.renderCreateForm);
router.route('/')
    .post(consultantControllers.createConsultant)
    .get(consultantControllers.getConsultants)

// Render form to update a consultant profile by ID
router.route('/:id/edit')
    .get(isAuthenticated, isAuthorizedAsConsultant, consultantControllers.renderUpdateForm);

router.route('/:id')
    .get(isAuthenticated, isAuthorizedAsConsultant, consultantControllers.getConsultant)
    .put(isAuthenticated, isAuthorizedAsConsultant,consultantControllers.updateConsultant)
    .delete(isAuthenticated, isAuthorizedAsConsultant,consultantControllers.deleteConsultant)

module.exports = router;