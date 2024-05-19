const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactInquirySchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    dateReceived: { type: Date, default: Date.now },
    status: { type: String, enum: ['New', 'In Progress', 'Resolved'], required: true }
});

const ContactInquiry = mongoose.model('ContactInquiry', contactInquirySchema);
module.exports = ContactInquiry
