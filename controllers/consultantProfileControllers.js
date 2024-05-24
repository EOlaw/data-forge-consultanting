const ConsultantProfile = require('../models/consultantProfileModel')
const User = require('../models/userModel')

const consultantProfileControllers = {
    // Create a new consultant profile
    createConsultantProfile: async (req, res) => {
        try {
            const user = await User.findById(req.body.userID);
            if (!user) return res.status(404).json({ error: 'User not found' });
            if (user.role !== 'Consultant') return res.status(403).json({ error: 'Only users with the role of "Consultant" can create consultant profiles' });
            const profile = new ConsultantProfile(req.body);
            await profile.save();
            res.status(201).json(profile);
        }  catch (err) {
            res.status(400).json(err)
        }
    },
    // Get all consultant profiles
    getConsultantsProfile: async (req, res) => {
        try {
            const profile = await ConsultantProfile.find().populate('userID');
            res.status(200).json(profile);
        } catch (err) {
            res.status(400).json(err)
        }
    },
    // Get a consultant profile by ID
    getConsultantProfile: async (req, res) => {
        try {
            const profile = await ConsultantProfile.findById(req.params.id).populate('userID');
            if (!profile) return res.status(404).json('Consultant profile not found');
            res.status(200).json(profile);
        } catch (err) {
            res.status(400).json(err)
        }
    },
    // Update a consultant profile by ID
    updateConsultantProfile: async (req, res) => {
        try {
            const profile = await ConsultantProfile.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
            if (!profile) return res.status(404).send('Consultant profile not found');
            res.status(200).json(profile);
        } catch (err) {
            res.status(400).json(err);
        }
    },
    // Delete a consultant profile by ID
    deleteConsultantProfile: async (req, res) => {
        try {
            const profile = await ConsultantProfile.findByIdAndDelete(req.params.id);
            if (!profile) return res.status(404).json('Consultant profile not found');
            res.status(200).json('Consultant profile deleted')
        } catch (err) {
            res.status(400).json(err)
        }
    }
}
module.exports = consultantProfileControllers