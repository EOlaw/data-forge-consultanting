const Availability = require('../models/availabilityModel')

const availabilityControllers = {
    // Create availability slots for a consultant
    createAvailability: async (req, res) => {
        try {
            const availability = new Availability({
                consultantID: req.user._id,
                ...req.body
            });
            await availability.save();
            res.status(201).json(availability);
        } catch (err) {
            res.status(400).json(err)
        }
    },
    // Get availability slots for a consultant
    getAvailability: async (req, res) => {
        try {
            const availability = await Availability.find({ consultantID: req.user._id })
            res.json(availability)
        } catch (err) {
            res.status(500).json(err)
        }
    },
    // Book an availability slot
    bookAvailability: async (req, res) => {
        try {
            const availability = await Availability.findOneAndUpdate(
                { 'slots._id': req.params.id, 'slots.booked': false },
                { $set: { 'slots.$.booked': true } },
                { new: true }
            );
            if (!availability) return res.status(404).send();
            res.send(availability);
        } catch (err) {
            res.status(400).send(err);
        }
    }
}

module.exports = availabilityControllers