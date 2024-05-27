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
    // Get all consultations
    getConsultations: async (req, res) => {
        try {
            const consultation = await Consultation.find();
            res.status(200).json(consultation);
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
    },

    // Approve a consultation request and schedule the session
    approveConsultation: async (req, res) => {
        try {
            const consultantUser = req.user; // Assuming the consultant is logged in
            const consultant = await Consultant.findOne({ userId: consultantUser._id });

            const consultation = await Consultation.findById(req.params.id);
            if (!consultation) return res.status(404).json({ error: 'Consultation not found' });
            if (consultation.status === 'canceled') return res.status(400).json({ error: 'Canceled consultation cannot be approved' });
            if (consultation.consultantId.toString() !== consultant._id.toString()) return res.status(403).json({ error: 'You are not authorized to approve this consultation' });

            consultation.status = 'approved';
            await consultation.save();
            // Implement scheduling logic here if needed
            res.status(200).json(consultation);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
    // Cancel Consultation
    cancelConsultation: async (req, res) => {
        try {
            const consultation = await Consultation.findById(req.params.id);
            if (!consultation) {
                return res.status(404).json({ error: 'Consultation not found' });
            }
    
            consultation.status = 'canceled';
            await consultation.save();
            res.status(200).json({ message: 'Consultation canceled', consultation });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
    // Reschedule Consultation
    rescheduleConsultation: async (req, res) => {
        try {
            const consultation = await Consultation.findById(req.params.id);
            if (!consultation) {
                return res.status(404).json({ error: 'Consultation not found' });
            }
    
            const { date, duration } = req.body;
            consultation.date = date || consultation.date;
            consultation.duration = duration || consultation.duration;
    
            await consultation.save();
            res.status(200).json({ message: 'Consultation rescheduled', consultation });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
    // Add Ratings
    ratingsConsultation: async (req, res) => {
        try {
            const clientUser = req.user; // Assuming the client is logged in
            const client = await Client.findOne({ userId: clientUser._id });
            if (!client) return res.status(404).json({ error: 'Client not found' });

            const consultation = await Consultation.findById(req.params.id).populate('clientId');
            if (!consultation) return res.status(404).json({ error: 'Consultation not found' });

            const { rating, comments } = req.body;
            // Check if the user is the client who booked the consultation
            if (consultation.clientId._id.toString() !== client._id.toString()) return res.status(403).json({ error: 'You are not authorized to rate this consultation' });

            // Add the rating to the consultation
            if (!consultation.ratings) {
                consultation.ratings = [];
            }
            consultation.ratings.push({ client: clientUser._id, rating, comments });
            await consultation.save();
            res.status(200).json({ message: 'Rating added', consultation });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
    // Update Ratings
    updateRatingsConsultation: async (req, res) => {
        try {
            const clientUser = req.user; // Assuming the client is logged in
            const client = await Client.findOne({ userId: clientUser._id });
            if (!client) return res.status(404).json({ error: 'Client not found' });

            const consultation = await Consultation.findById(req.params.id).populate('clientId');
            if (!consultation) return res.status(404).json({ error: 'Consultation not found' });

            const { rating, comments } = req.body;
            // Check if the user is the client who booked the consultation
            if (consultation.clientId._id.toString() !== client._id.toString()) return res.status(403).json({ error: 'You are not authorized to update the rating for this consultation' });
            
            // Check if the consultation has already been rated
            if (!consultation.ratings || consultation.ratings.length === 0) return res.status(400).json({ error: 'Consultation has not been rated yet' });

            // Find the rating index for the current client
            const clientRatingIndex = consultation.ratings.findIndex(rating => rating.client.toString() === clientUser._id.toString());
            if (clientRatingIndex === -1) return res.status(400).json({ error: 'Your rating for this consultation was not found' });

            // Update the rating and comments
            consultation.ratings[clientRatingIndex].rating = rating;
            consultation.ratings[clientRatingIndex].comments = comments;
            await consultation.save();
            res.status(200).json({ message: 'Rating updated', consultation });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
    
    // Get all pending consultations (for consultants to review)
    getPendingConsultations: async (req, res) => {
        try {
            const consultation = await Consultation.find({ status: 'pending' });
            res.status(200).json(consultation);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
    // Get all approved consultations (for consultants to review)
    getApprovedConsultations: async (req, res) => {
        try {
            const consultation = await Consultation.find({ status: 'approved' });
            res.status(200).json(consultation);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
    // Get all canceled consultations (for consultants to review)
    getCanceledConsultations: async (req, res) => {
        try {
            const consultation = await Consultation.find({ status: 'canceled' });
            res.status(200).json(consultation);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
}

module.exports = consultationControllers;