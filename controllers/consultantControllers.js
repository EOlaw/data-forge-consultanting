const Consultant = require('../models/consultantModel');
const User = require('../models/userModel');

const consultantControllers = {
    // Render form to create a new consultant profile
    renderCreateForm: async (req, res) => {
        res.render('consultant/createConsultant');
    },

    // Create a new consultant profile
    createConsultant: async (req, res) => {
        try {
            const { userId, ...consultantProfile } = req.body;
            // Create consultant profile with userId
            const consultantData = { userId, ...consultantProfile };
            await Consultant.create(consultantData);
    
            // Redirect to consultant profile page or send a success response
            res.redirect('/consultant/profile');
        } catch (error) {
            res.status(500).send('Error creating consultant profile: ' + error.message);
        }
    },

    // Get all consultant profiles
    getConsultants: async (req, res) => {
        try {
            const consultants = await Consultant.find().populate('userId');
            //res.json({ message: 'Consultant', consultants })
            res.render('consultant/listConsultants', { consultants });
        } catch (err) {
            res.status(400).render('error', { message: err.message });
        }
    },

    // Get a consultant profile by ID
    getConsultant: async (req, res) => {
        try {
            const consultant = await Consultant.findById(req.params.id).populate('userId');
            if (!consultant) return res.status(404).json('error', { message: 'Consultant profile not found' });
            const user = await User.findById(consultant.userId);
            res.render('consultant/consultantProfile', { consultant: { ...consultant._doc, user } });
            //res.json({ message: 'Consultant', consultant })
            //res.render('consultant/viewConsultant', { consultant });
        } catch (err) {
            res.status(400).render('error', { message: err.message });
        }
    },

    // Render form to update a consultant profile by ID
    renderUpdateForm: async (req, res) => {
        try {
            const consultant = await Consultant.findById(req.params.id).populate('userId');
            if (!consultant) return res.status(404).render('error', { message: 'Consultant profile not found' });
            res.render('consultant/updateConsultant', { consultant });
        } catch (err) {
            res.status(400).render('error', { message: err.message });
        }
    },

    // Update a consultant profile by ID
    updateConsultant: async (req, res) => {
        try {
            const consultant = await Consultant.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('userId');
            if (!consultant) return res.status(404).render('error', { message: 'Consultant profile not found' });
            res.redirect(`/consultant/${consultant._id}`);
        } catch (err) {
            res.status(400).render('error', { message: err.message });
        }
    },

    // Delete a consultant profile by ID
    deleteConsultant: async (req, res) => {
        try {
            const consultant = await Consultant.findByIdAndDelete(req.params.id);
            if (!consultant) return res.status(404).render('error', { message: 'Consultant profile not found' });
            res.redirect('/consultants');
        } catch (err) {
            res.status(400).render('error', { message: err.message });
        }
    }
};

module.exports = consultantControllers;

