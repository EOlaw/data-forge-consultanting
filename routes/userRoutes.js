const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/userModel');
const userControllers = require('../controllers/userControllers');
const { isAuthenticated, isAdmin, isAuthorizedAsInstructor, isAuthorizedAsStudent } = require('../controllers/authControllers');

// User Profile
router.route('/register')
    .get(userControllers.renderRegister)
    .post(userControllers.registerUser);

router.route('/login')
   .get(userControllers.renderLogin)
   .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/user/login' }), userControllers.loginUser)

router.route('/logout')
    .get(userControllers.logout)

router.route('/')
    .get(isAuthenticated, userControllers.getUsersProfile)

router.route('/:id')
    .get(isAuthenticated, userControllers.getUserProfile )
    .put(isAuthenticated, userControllers.updateUserAccount)
    .delete(isAuthenticated, userControllers.deleteUserAccount)


// Password Reset
router.route('/request-rest')
    .post(userControllers.requestPasswordReset)
router.route('/reset-password')
    .post(userControllers.resetPassword)


router.route('/enable-2fa')
    .post(isAuthenticated, userControllers.enableTwoFactor)
router.route('/verify-2fa')
    .post(isAuthenticated, userControllers.verifyTwoFactor)

router.route('/activate-subscription')
    .post(isAuthenticated, userControllers.activateSubscription)
router.route('/subscription-status')
    .get(isAuthenticated, userControllers.checkSubscriptionStatus)


module.exports = router;
