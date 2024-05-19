const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
    clientID: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    projectID: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    amount: { type: Number, required: true },
    dateIssued: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ['Paid', 'Unpaid', 'Overdue'], required: true }
});

const Invoice = mongoose.model('Invoice', invoiceSchema);
module.exports = Invoice
