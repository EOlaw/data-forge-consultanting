const Consultation = require('../models/consultationModel');
const Client = require('../models/clientModel');
const Consultant = require('../models/consultantModel');
//const sendEmail = require('../utils/email');

const consultationControllers = {
    // Create a new consultation request (in pending state)
    createConsultation: async (req, res) => {
        try {
            const { clientId, date, duration, mode, notes, specialization } = req.body;

            if (!specialization || specialization.length === 0) {
                return res.status(400).json({ error: 'Specializations must be provided' });
            }

            // Find an available consultant with the required specializations
            const consultant = await Consultant.findOne({
                specialization: { $in: specialization },
                availability: true
            }).populate('userId');

            if (!consultant) {
                return res.status(404).json({ error: 'No available consultant with the requested specialization(s) found' });
            }

            // Create the consultation with the found consultant
            const consultation = new Consultation({
                clientId,
                consultantId: consultant._id,
                date,
                duration,
                mode,
                notes,
                status: 'pending'
            });

            await consultation.save();
            res.status(201).json(consultation);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
    // Approve a consultation request and schedule the session
    approveConsultation: async (req, res) => {
        try {
            const consultantUser = req.user; // Assuming the consultant is logged in
            const consultant = await Consultant.findOne({ userId: consultantUser._id });
            console.log("Logged-in consultant:", consultant);

            const consultation = await Consultation.findById(req.params.id);
            console.log("Consultation found:", consultation);

            if (!consultation) {
                console.log("Consultation not found");
                return res.status(404).json({ error: 'Consultation not found' });
            }

            if (consultation.consultantId.toString() !== consultant._id.toString()) {
                console.log("Consultant is not authorized to approve this consultation");
                return res.status(403).json({ error: 'You are not authorized to approve this consultation' });
            }

            consultation.status = 'approved';
            await consultation.save();
            console.log("Consultation approved:", consultation);

            // Implement scheduling logic here if needed
            res.status(200).json(consultation);
        } catch (err) {
            console.error("Error:", err);
            res.status(400).json({ error: err.message });
        }
    },
    // Get all consultations
    getConsultations: async (req, res) => {
        try {
            const consultations = await Consultation.find();
            res.status(200).json(consultations);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    // Get all pending consultations (for consultants to review)
    getPendingConsultations: async (req, res) => {
        try {
            const pendingConsultations = await Consultation.find({ status: 'pending' });
            res.status(200).json(pendingConsultations);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    // Get a consultation by ID
    getConsultation: async (req, res) => {
        try {
            const consultation = await Consultation.findById(req.params.id);
            if (!consultation) {
                return res.status(404).json({ error: 'Consultation not found' });
            }
            res.status(200).json(consultation);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
    // Update a consultation by ID
    updateConsultation: async (req, res) => {
        try {
            const consultation = await Consultation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
            if (!consultation) {
                return res.status(404).json({ error: 'Consultation not found' });
            }
            res.status(200).json(consultation);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
    // Delete a consultation by ID
    deleteConsultation: async (req, res) => {
        try {
            const consultation = await Consultation.findByIdAndDelete(req.params.id);
            if (!consultation) {
                return res.status(404).json({ error: 'Consultation not found' });
            }
            res.status(200).json({ message: 'Consultation deleted' });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
}

module.exports = consultationControllers;