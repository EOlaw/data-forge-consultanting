const Notification = require('../models/notificationModel')

const notificationControllers = {
    // Get notifications for the logged-in user
    getNotifications: async (req, res, next) => {
        try {
            const notification = await Notification.find({ userID: req.user._id });
            res.json(notification)
        } catch (err) {
            res.status(500).json(err)
        }
    },
    // Mark a notification as read
    readNotification: async (req, res, next) => {
        try {
            const notification = await Notification.find(
                { _id: req.params.id, userID: req.user._id },
                { read: true },
                { new: true }
            );
            if (!notification) return res.status(404).json();
            res.json(notification)
        } catch (err) {
            res.status(400).send(err)
        }
    }
}

module.exports = notificationControllers