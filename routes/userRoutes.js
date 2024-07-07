const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/userModel');
const userControllers = require('../controllers/userControllers');
const { isAuthenticated, isAdmin, isAuthorizedAsConsultant, isAuthorizedAsClient } = require('../controllers/authControllers');

// User Profile
router.route('/register')
    .post(userControllers.registerUser)
    .get(userControllers.renderRegister);

router.route('/login')
   .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/user/login' }), userControllers.loginUser)
   .get(userControllers.renderLogin);

router.route('/logout')
    .get(isAuthenticated, userControllers.logout);

router.route('/')
    .get(userControllers.getUsers);

router.route('/:id')
    .get(isAuthenticated, userControllers.getUser)
    .put(isAuthenticated, userControllers.updateUserAccount)
    .delete(isAuthenticated, userControllers.deleteUserAccount);

module.exports = router;
