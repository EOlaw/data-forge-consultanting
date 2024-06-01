const express = require('express');
const router = express.Router();
const serviceControllers = require('../controllers/serviceControllers');
const { isAuthenticated, isAdmin, isAuthorizedAsConsultant, isAuthorizedAsClient } = require('../controllers/authControllers');

// Create a new service
router.route('/')
    .post(serviceControllers.createService)
    .get(serviceControllers.getServices);

// Get, update, and delete a service by ID
router.route('/:id')
    .get(serviceControllers.getService)
    .put(serviceControllers.updateService)
    .delete(serviceControllers.deleteService);

module.exports = router;
