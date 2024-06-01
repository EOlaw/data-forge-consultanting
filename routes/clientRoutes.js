// Example usage in a route
const express = require('express');
const router = express.Router();
const clientControllers = require('../controllers/clientControllers');
const { isAuthenticated, isAdmin, isAuthorizedAsConsultant, isAuthorizedAsClient } = require('../controllers/authControllers');

// Route to create a client
router.route('/')
    .post(clientControllers.createClient)
    .get(clientControllers.getClients)
    
router.route('/:id')
    .get(clientControllers.getClient)
    .put(clientControllers.updateClient)
    .delete(clientControllers.deleteClient)

module.exports = router;
