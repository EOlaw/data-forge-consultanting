const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
    consultantID: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
    },
    date: { type: Date, required: true },
    slots: [{
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        booked: { type: Boolean, default: false }
    }]
}, { timestamps: true })

const Availability = mongoose.model('Availability', availabilitySchema);
module.exports = Availability;