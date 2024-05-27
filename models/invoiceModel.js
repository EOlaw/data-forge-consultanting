const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
    clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    consultationId: { type: Schema.Types.ObjectId, ref: 'Consultation', required: true },
    items: [{
        description: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    amount: { type: Number, required: true },
    dateIssued: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ['Paid', 'Unpaid', 'Overdue'], default: 'Unpaid' }
});

invoiceSchema.pre('save', function(next) {
    // Calculate total amount from items
    this.amount = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    next();
});

const Invoice = mongoose.model('Invoice', invoiceSchema);
module.exports = Invoice;

/*
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
    clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    consultationId: { type: Schema.Types.ObjectId, ref: 'Consultation' }, // Adding reference to Consultation
    items: [{
        description: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    amount: { type: Number, required: true },
    tax: { type: Number },
    discount: { type: Number },
    totalAmount: { type: Number, required: true },
    dateIssued: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ['Paid', 'Unpaid', 'Overdue'], required: true },
    paymentHistory: [{
        amountPaid: { type: Number, required: true },
        datePaid: { type: Date, required: true },
        paymentMethod: { type: String }
    }]
}, { timestamps: true });

invoiceSchema.pre('save', function(next) {
    // Calculate total amount including tax and discount
    const taxAmount = this.tax ? (this.amount * this.tax) / 100 : 0;
    const discountAmount = this.discount ? (this.amount * this.discount) / 100 : 0;
    this.totalAmount = this.amount + taxAmount - discountAmount;
    next();
});

const Invoice = mongoose.model('Invoice', invoiceSchema);
module.exports = Invoice;
*/