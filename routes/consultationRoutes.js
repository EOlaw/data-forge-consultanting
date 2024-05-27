const express = require('express');
const router = express.Router();
const consultationControllers = require('../controllers/consultationControllers');
const { isAuthenticated, isAdmin, isAuthorizedAsConsultant, isAuthorizedAsClient } = require('../controllers/authControllers')

// Create a new consultation request (in pending state)
router.route('/')
    .post(consultationControllers.createConsultation)
    .get(consultationControllers.getConsultations); // Get all consultations

// Get all pending consultations (for consultants to review)
router.route('/pending')
    .get(consultationControllers.getPendingConsultations);

// Approve a consultation request and schedule the session
router.route('/:id/approve')
    .put(consultationControllers.approveConsultation);
router.route('/:id/cancel')
    .put(consultationControllers.cancelConsultation);
router.route('/:id/reschedule')
    .put(consultationControllers.rescheduleConsultation);
router.route('/:id/rating')
    .post(consultationControllers.ratingsConsultation)
router.route('/:id/updateRatings')
    .put(consultationControllers.updateRatingsConsultation)
// Get a consultation by ID
router.route('/:id')
    .get(consultationControllers.getConsultation)
    .put(consultationControllers.updateConsultation) // Update a consultation by ID
    .delete(consultationControllers.deleteConsultation); // Delete a consultation by ID



module.exports = router;
