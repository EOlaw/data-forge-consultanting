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
    loginUser: async (req, res, next) => {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username });

            // Check if user exists and password is correct
            if (!user || !(await user.isPasswordSame(password))) {
                return res.redirect('/user/login')
            }
            // If user is admin, log them in directly
            if (user.isAdmin) {
                req.login(user, (err) => {
                    if (err) {
                        console.log(err)
                        return next(err);
                    }
                    return res.redirect('/')
                });
                return;
            }
        } catch (err) {
            console.log(err);
            res.redirect('/user/login');
        }
    },
    // Logout
    logout: (req, res) => {
        // Check if the user is authenticated
        if (!req.isAuthenticated()) {
            // If user is not logged in, send a response indicating that the user must be logged in
            return res.status(401).json({ error: 'You must be logged in to perform this action' });
        }
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
            res.status(200).json({ user })
        } catch (err) {
            res.status(400).json({ err: err.message })
        }
    },
    // Update User Account
    updateUserAccount: async (req, res, next) => {
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedUser) {
                return res.status(404).json({ error: 'User not found' })
            }
            res.status(200).json(updatedUser)
        } catch (err) {
            res.status(400).json({ error: err.message })
        }
    },
    // Delete User Account
    deleteUserAccount: async (req, res, next) => {
        try {
            const deletedUser = await User.findByIdAndDelete(req.params.id);
            if (!deletedUser) {
                return res.status(404).json({ error: 'User not found' })
            }
            // Also handle removal of enrolled courses when deleting a user
            await Course.updateMany(
                { _id: { $in: deletedUser.enrolledCourses } },
                { $pull: { students: deletedUser._id } }
            );
            res.status(200).json(deletedUser)
        } catch (err) {
            res.status(400).json({ error: err.message })
        }
    },
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
            // Implement your 2FA logic here (e.g., generate 2FA secret, save to user, etc.)
            res.json({ message: 'Two-Factor Authentication enabled' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    // Verify Two-Factor Authentication
    verifyTwoFactor: async (req, res, next) => {
        try {
            // Implement your 2FA verification logic here
            res.json({ message: 'Two-Factor Authentication verified' });
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

}

module.exports = userControllers