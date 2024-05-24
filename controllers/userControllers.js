const User = require('../models/userModel')

const userControllers = {
    // Register Page
    renderRegister: (req, res) => {
        res.send('Register Page')
    },
    // Post Register
    registerUser: async (req, res, next) => {
        try {
            const user = new User(req.body);
            await user.setPassword(req.body.password); //Use setPassword method provided by passport-local-mongoose to set the password
            await user.save();
            req.login(user, err => {
                if (err) return next(err);
                console.log(user)
                res.json({ message: 'User registered successfully', user })
            })
        } catch (err) {
            res.json({ message: err.message })
        }
    },
    // Login Page
    renderLogin: (req, res) => {
        res.send('Login Page')
    },
    // Post Login
    loginUser: async (req, res) => {
        //req.flash('success', 'welcome back!');
        const redirectUrl = req.session.returnTo || '/';
        delete req.session.returnTo;
        res.redirect(redirectUrl);
    },
    // Logout
    logout: (req, res) => {
        req.logout((err) => {
            if (err) {
                // Handle any errors that occur during the logout process
                console.log(err);
            }
            res.json('User logged out successfully');
        })
    },
    // Get Users Profile
    getUsersProfile: async (req, res) => {
        try {
            const users = await User.find();
            res.status(200).json({ users: users })
        } catch (err) {
            res.status(400).json({ err: err.message });
        }
    },
    // Get User Profile
    getUserProfile: async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            if (!user) return res.status(404).send('User not found');
            res.status(200).send(user);
        } catch (error) {
            res.status(400).send(error);
        }
    },
    // Update User Account
    updateUserAccount: async (req, res, next) => {
        try {
            const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
            if (!user) return res.status(404).send('User not found');
            res.status(200).send(user);
        } catch (error) {
            res.status(400).send(error);
        }
    },
    // Delete User Account
    deleteUserAccount: async (req, res, next) => {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            if (!user) return res.status(404).send('User not found');
            res.status(200).send('User deleted');
        } catch (error) {
            res.status(400).send(error);
        }
    }
    /*
    // Request Password Reset
    requestPasswordReset: async (req, res, next) => {
        try {
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            const resetToken = user.createPasswordResetToken();
            await user.save();
            // Send resetToken to user's email (implement email sending logic here)
            res.json({ message: 'Password reset token sent to email' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    // Reset Password
    resetPassword: async (req, res, next) => {
        try {
            const hashedToken = crypto.createHash('sha256').update(req.body.token).digest('hex');
            const user = await User.findOne({
                passwordResetToken: hashedToken,
                passwordResetExpires: { $gt: Date.now() }
            });
            if (!user) {
                return res.status(400).json({ error: 'Token is invalid or has expired' });
            }
            user.setPassword(req.body.password, async (err) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                user.passwordResetToken = undefined;
                user.passwordResetExpires = undefined;
                await user.save();
                res.json({ message: 'Password reset successful' });
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    // Enable Two-Factor Authentication
    enableTwoFactor: async (req, res, next) => {
        try {
            const user = await User.findById(req.user._id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const qrCodeUrl = await user.enableTwoFactor();
            res.json({ message: 'Two-Factor Authentication enabled', qrCodeUrl });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    // Verify Two-Factor Authentication
    verifyTwoFactor: async (req, res, next) => {
        try {
            const { token } = req.body;
            const user = req.session.tmpUser;

            if (!user) {
                return res.status(400).json({ error: 'Session expired or user not found' });
            }

            const verified = speakeasy.totp.verify({
                secret: user.twoFactorSecret,
                encoding: 'base32',
                token
            });

            if (!verified) {
                return res.status(400).json({ error: 'Invalid token' });
            }

            req.login(user, err => {
                if (err) return next(err);
                req.session.tmpUser = null; // Clear the temporary user from the session
                req.flash('success', 'welcome back!');
                const redirectUrl = req.session.returnTo || '/';
                delete req.session.returnTo;
                res.redirect(redirectUrl);
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    // Handle Subscription Activation
    activateSubscription: async (req, res, next) => {
        try {
            const { subscriptionType, durationInDays } = req.body;
            const user = await User.findById(req.user._id);
            await user.activateSubscription(subscriptionType, durationInDays);
            res.json({ message: 'Subscription activated' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    // Check Subscription Status
    checkSubscriptionStatus: async (req, res, next) => {
        try {
            const user = await User.findById(req.user._id);
            res.json(user.subscription);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    */

}

module.exports = userControllers