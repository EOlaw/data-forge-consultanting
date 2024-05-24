const Invoice = require('../models/invoiceModel')

const invoiceControllers = {
    // Create a new invoice
    createInvoice: async (req, res) => {
        try {
            const invoice = new Invoice(req.body);
            await invoice.save();
            res.status(201).json(invoice);
        } catch (error) {
            res.status(400).json(error);
        }
    },
    // Get all invoices
    getInvoices: async (req, res) => {
        try {
            const invoice = await Invoice.find().populate('clientID').populate('projectID');
            res.status(200).json(invoice);
        } catch (error) {
            res.status(400).json(error);
        }
    },
    // Get an invoice by ID
    getInvoice: async (req, res) => {
        try {
            const invoice = await Invoice.findById(req.params.id).populate('clientID').populate('projectID');
            if (!invoice) return res.status(404).json('Invoice not found');
            res.status(200).json(invoice);
        } catch (error) {
            res.status(400).json(error);
        }
    },
    // Update an invoice by ID
    updateInvoice: async (req, res) => {
        try {
            const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
            if (!invoice) return res.status(404).json('Invoice not found');
            res.status(200).json(invoice);
        } catch (error) {
            res.status(400).json(error);
        }
    },
    // Delete an invoice by ID
    deleteInvoice: async (req, res) => {
        try {
            const invoice = await Invoice.findByIdAndDelete(req.params.id);
            if (!invoice) return res.status(404).json('Invoice not found');
            res.status(200).json('Invoice deleted');
        } catch (error) {
            res.status(400).json(error);
        }
    }
}

module.exports = invoiceControllers