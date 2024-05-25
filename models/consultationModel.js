const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const consultationSchema = new Schema({
    clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    consultantId: { type: Schema.Types.ObjectId, ref: 'ConsultantProfile', required: true },
    date: { type: Date, required: true },
    duration: { type: Number, required: true },
    mode: { type: String, enum: ['In-person', 'Online'], required: true },
    notes: { type: String },
    status: { type: String, enum: ['pending', 'approved'], default: 'pending' }, // Added status field
    requestedDate: { type: Date } // Optional: separate requested date if different from final approved date
});


const Consultation = mongoose.model('Consultation', consultationSchema);
module.exports = Consultation;
