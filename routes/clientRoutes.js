const express = require('express');
const router = express.Router();
const clientControllers = require('../controllers/clientControllers');
const { isAuthenticated, isAdmin, isAuthorizedAsConsultant, isAuthorizedAsClient } = require('../controllers/authControllers');

// Route to create a client
router.route('/new')
    .get(isAuthenticated, isAuthorizedAsClient, clientControllers.renderCreateForm);
router.route('/')
    .post(isAuthenticated, isAuthorizedAsClient, clientControllers.createClient)
    .get(isAuthenticated, isAuthorizedAsClient, clientControllers.getClients);

// Render form to update a client profile by ID
router.route('/:id/edit')
    .get(isAuthenticated, isAuthorizedAsClient, clientControllers.renderUpdateForm);

router.route('/:id')
    .get(isAuthenticated, clientControllers.getClient)
    .put(isAuthenticated, isAuthorizedAsClient, clientControllers.updateClient)
    .delete(isAuthenticated, isAuthorizedAsClient, clientControllers.deleteClient);

module.exports = router;
