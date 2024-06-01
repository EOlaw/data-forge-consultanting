const express = require('express');
const router = express.Router();
const invoiceControllers = require('../controllers/invoiceControllers');
const { isAuthenticated, isAdmin, isAuthorizedAsConsultant, isAuthorizedAsClient } = require('../controllers/authControllers');

router.route('/invoices')
    .post(invoiceControllers.createInvoice)
    .get(invoiceControllers.getAllInvoices)

router.route('/invoices/:id')
    .get(invoiceControllers.getInvoiceById)
    .put(invoiceControllers.updateInvoice)
    .delete(invoiceControllers.deleteInvoice)

router.route('/invoices/:id/send-reminder')
    .post(invoiceControllers.sendPaymentReminder);
router.route('/invoices/:id/mark-as-paid')
    .patch(invoiceControllers.markAsPaid);
router.route('/invoices/overdue')
    .get(invoiceControllers.getOverdueInvoices);

module.exports = router;
