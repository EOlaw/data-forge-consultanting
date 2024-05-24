const ContactInquiry = require('../models/contactInquiryModel')

const contactInquiryControllers = {
    // Create a new contact inquiry
    createContactInquiry: async (req, res) => {
        try {
            const contactInquiry = new ContactInquiry(req.body);
            await contactInquiry.save();
            res.status(201).json(contactInquiry);
        } catch (error) {
            res.status(400).json(error);
        }
    },
    // Get all contact inquiries
    getContactInquiries: async (req, res) => {
        try {
            const contactInquiries = await ContactInquiry.find();
            res.status(200).json(contactInquiries);
        } catch (error) {
            res.status(400).json(error);
        }
    },
    // Get a contact inquiry by ID
    getContactInquiry: async (req, res) => {
        try {
            const contactInquiry = await ContactInquiry.findById(req.params.id);
            if (!contactInquiry) return res.status(404).json('Contact inquiry not found');
            res.status(200).json(contactInquiry);
        } catch (error) {
            res.status(400).json(error);
        }
    },
    // Update a contact inquiry by ID
    updateContactInquiry: async (req, res) => {
        try {
            const contactInquiry = await ContactInquiry.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
            if (!contactInquiry) return res.status(404).json('Contact inquiry not found');
            res.status(200).json(contactInquiry);
        } catch (error) {
            res.status(400).json(error);
        }
    },
    // Delete a contact inquiry by ID
    deleteContactInquiry: async (req, res) => {
        try {
            const contactInquiry = await ContactInquiry.findByIdAndDelete(req.params.id);
            if (!contactInquiry) return res.status(404).json('Contact inquiry not found');
            res.status(200).json('Contact inquiry deleted');
        } catch (error) {
            res.status(400).json(error);
        }
    }
}