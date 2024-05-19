const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const consultationSchema = new Schema({
    clientID: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    consultantID: { type: Schema.Types.ObjectId, ref: 'ConsultantProfile', required: true },
    date: { type: Date, required: true },
    duration: { type: Number, required: true },
    mode: { type: String, enum: ['In-person', 'Online'], required: true },
    notes: { type: String }
});

const Consultation = mongoose.model('Consultation', consultationSchema)
module.exports = Consultation
