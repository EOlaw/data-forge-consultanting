const Consultant = require('../models/consultantModel');
const User = require('../models/userModel');

const consultantControllers = {
    // Create a new consultant profile
    createConsultant: async (req, res) => {
        try {
            const user = await User.findById(req.body.userId);
            if (!user) return res.status(404).json({ error: 'User not found' });
            if (user.role !== 'Consultant') return res.status(403).json({ error: 'Only users with the role of "Consultant" can create consultant profiles' });
            const consultant = new Consultant(req.body);
            await consultant.save();
            res.status(201).json(consultant);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
    // Get all consultant profiles
    getConsultants: async (req, res) => {
        try {
            const consultants = await Consultant.find().populate('userId');
            res.status(200).json(consultants);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
    // Get a consultant profile by ID
    getConsultant: async (req, res) => {
        try {
            const consultant = await Consultant.findById(req.params.id).populate('userId');
            if (!consultant) return res.status(404).json({ error: 'Consultant profile not found' });
            res.status(200).json(consultant);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
    // Update a consultant profile by ID
    updateConsultant: async (req, res) => {
        try {
            const consultant = await Consultant.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
            if (!consultant) return res.status(404).json({ error: 'Consultant profile not found' });
            res.status(200).json(consultant);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
    // Delete a consultant profile by ID
    deleteConsultant: async (req, res) => {
        try {
            const consultant = await Consultant.findByIdAndDelete(req.params.id);
            if (!consultant) return res.status(404).json({ error: 'Consultant profile not found' });
            res.status(200).json({ message: 'Consultant profile deleted' });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
};

module.exports = consultantControllers;
