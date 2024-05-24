const Consultation = require('../models/consultationModel');
const User = require('../models/userModel');
const Client = require('../models/clientModel');
const ConsultantProfile = require('../models/consultantProfileModel')
const sendEmail = require('../utils/email');

const consultationControllers = {
    // Create a new consultation request (in pending state)
    createConsultation: async (req, res) => {
        try {
            const { clientID, date, duration, mode, notes, specialization } = req.body;
    
            // Verify the client
            const client = await Client.findById(clientID).populate('userID');
            if (!client || client.userID.role !== 'Client') return res.status(404).json({ error: 'Invalid client ID or user is not a Client' });
    
            // Find an available consultant based on the client's needs (e.g., specialization and availability)
            const consultantProfile = await ConsultantProfile.findOne({
                specialization,
                availability: true
            }).populate('userID');
            console.log('Consultant', consultantProfile)
            if (!consultantProfile || consultantProfile.userID.role !== 'Consultant') return res.status(403).json({ error: 'No available consultant matches the specialization or all consultants are unavailable' });

            // Create a new consultation
            const newConsultation = new Consultation({
                clientID,
                consultantID: consultantProfile._id,
                date,
                duration,
                mode,
                notes,
                status: 'pending',
                requestedDate: new Date()
            });
    
            // Save the consultation
            await newConsultation.save();
            res.status(201).json(newConsultation);
    
            // Uncomment and configure the sendEmail function to send an email notification
            /*
            sendEmail(
                newConsultation.clientEmail,
                'New Consultation Requested',
                `Your consultation request with ${consultantProfile.userID.name} has been submitted and is pending approval for ${newConsultation.date}.`
            );
            */
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    // Get all consultations
    getConsultations: async (req, res) => {
        try {
            const consultation = await Consultation.find().populate('clientID').populate('consultantID');
            res.status(200).json(consultation);
        } catch (error) {
            res.status(400).json(error);
        }
    },
    // Get all pending consultations (for consultants to review)
    getPendingConsultations: async (req, res) => {
        try {
            const pendingConsultations = await Consultation.find({ status: 'pending' }).populate('clientID').populate('consultantID');
            res.status(200).json(pendingConsultations);
        } catch (error) {
            res.status(400).json(error);
        }
    },
    // Get a consultation by ID
    getConsultation: async (req, res) => {
        try {
            const consultation = await Consultation.findById(req.params.id).populate('clientID').populate('consultantID');
            if (!consultation) return res.status(404).json('Consultation not found');
            res.status(200).json(consultation);
        } catch (error) {
            res.status(400).json(error);
        }
    },
    // Approve a consultation request and schedule the session
    // Approve a consultation request and schedule the session
    approveConsultation: async (req, res) => {
        try {
            const consultation = await Consultation.findById(req.params.id);
            console.log('Consultation:', consultation); // Log the retrieved consultation
            if (!consultation) return res.status(404).json('Consultation not found');

            // Check if the authenticated consultant is associated with the consultation
            if (!consultation.consultantID.equals(req.user._id)) {
                return res.status(403).json({ error: 'You are not associated with this consultation' });
            }

            // Proceed with approval
            consultation.status = 'approved';
            consultation.date = req.body.approvedDate; // Set the confirmed date

            // Save the consultation directly without pre-save hook checks
            await consultation.save();

            // Send a response indicating success
            res.status(200).json({ message: 'Consultation approved successfully', consultation });
        } catch (err) {
            console.error('Error in approving consultation:', err); // Log the error
            res.status(400).json({ err: err.message });
        }
    },

    
    // Update a consultation by ID
    updateConsultation: async (req, res) => {
        try {
            const consultation = await Consultation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
            if (!consultation) return res.status(404).json('Consultation not found');
            res.status(200).json(consultation);
        } catch (error) {
            res.status(400).json(error);
        }
    },
    // Delete a consultation by ID
    deleteConsultation: async (req, res) => {
        try {
            const consultation = await Consultation.findByIdAndDelete(req.params.id);
            if (!consultation) return res.status(404).json('Consultation not found');
            res.status(200).json('Consultation deleted');
        } catch (error) {
            res.status(400).json(error);
        }
    }
};

module.exports = consultationControllers;
