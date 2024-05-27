const Invoice = require('../models/invoiceModel');
const Client = require('../models/clientModel');
const Consultant = require('../models/consultantModel');
const Consultation = require('../models/consultationModel');

const invoiceControllers = {
    // Create a new invoice (usually done when a consultation is created)
    createInvoice: async (req, res) => {
        try {
            const { clientId, consultationId, items, dueDate } = req.body;

            const client = await Client.findById(clientId);
            if (!client) return res.status(404).json({ error: 'Client not found' });

            const consultation = await Consultation.findById(consultationId);
            if (!consultation) return res.status(404).json({ error: 'Consultation not found' });

            const invoice = new Invoice({
                clientId,
                consultationId,
                items,
                dueDate
            });

            await invoice.save();
            res.status(201).json(invoice);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    // Get all invoices
    getAllInvoices: async (req, res) => {
        try {
            const invoices = await Invoice.find().populate('clientId consultationId');
            res.status(200).json(invoices);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    // Get a single invoice by ID
    getInvoiceById: async (req, res) => {
        try {
            const invoice = await Invoice.findById(req.params.id).populate('clientId consultationId');
            if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
            res.status(200).json(invoice);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    // Update an invoice (e.g., to mark as paid)
    updateInvoice: async (req, res) => {
        try {
            const { status } = req.body;
            const invoice = await Invoice.findById(req.params.id);
            if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

            invoice.status = status || invoice.status;
            await invoice.save();
            res.status(200).json(invoice);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    // Delete an invoice
    deleteInvoice: async (req, res) => {
        try {
            const invoice = await Invoice.findById(req.params.id);
            if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

            await invoice.remove();
            res.status(200).json({ message: 'Invoice deleted' });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    // Send payment reminder (mock implementation)
    sendPaymentReminder: async (req, res) => {
        try {
            const invoice = await Invoice.findById(req.params.id).populate('clientId');
            if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

            if (invoice.status === 'Paid') {
                return res.status(400).json({ message: 'Invoice is already paid' });
            }

            // Mock sending a payment reminder
            const reminderMessage = `Reminder: Your payment for invoice #${invoice._id} is due on ${invoice.dueDate.toDateString()}. Please pay the amount of $${invoice.amount}.`;
            console.log(`Sending payment reminder to ${invoice.clientId.contactPerson} (${invoice.clientId.email}): ${reminderMessage}`);

            res.status(200).json({ message: 'Payment reminder sent', reminderMessage });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    // Mark an invoice as paid
    markAsPaid: async (req, res) => {
        try {
            const invoice = await Invoice.findById(req.params.id);
            if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

            invoice.status = 'Paid';
            await invoice.save();
            res.status(200).json({ message: 'Invoice marked as paid', invoice });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    // Get all overdue invoices
    getOverdueInvoices: async (req, res) => {
        try {
            const currentDate = new Date();
            const overdueInvoices = await Invoice.find({
                dueDate: { $lt: currentDate },
                status: { $ne: 'Paid' }
            }).populate('clientId consultationId');
            res.status(200).json(overdueInvoices);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
};

module.exports = invoiceControllers;

