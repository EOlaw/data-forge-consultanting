const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const consultationSchema = new Schema({
    clientID: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    consultantID: { type: Schema.Types.ObjectId, ref: 'ConsultantProfile', required: true },
    date: { type: Date, required: true },
    duration: { type: Number, required: true },
    mode: { type: String, enum: ['In-person', 'Online'], required: true },
    notes: { type: String },
    status: { type: String, enum: ['pending', 'approved'], default: 'pending' }, // Added status field
    requestedDate: { type: Date } // Optional: separate requested date if different from final approved date
});

// Pre-save hook to check for existing bookings
consultationSchema.pre('save', async function (next) {
    try {
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);

        const { clientID, consultantID, date } = this;

        // Check if the client has booked the same consultant within the last 24 hours
        const recentClientBookings = await this.model('Consultation').find({
            clientID,
            consultantID,
            date: { $gte: oneDayAgo }
        }).countDocuments();

        if (recentClientBookings >= 1) throw new Error('Client has already booked this consultant within the last 24 hours');

        // Check if the consultant has been booked more than three times in the last 24 hours
        const recentConsultantBookings = await this.model('Consultation').find({
            consultantID,
            date: { $gte: oneDayAgo }
        }).countDocuments();

        if (recentConsultantBookings >= 3) throw new Error('Consultant has reached the maximum number of bookings for the last 24 hours');

        next(); // Continue with the save operation if no errors occur
    } catch (error) {
        next(error); // Pass any errors to the next middleware or error handler
    }
});


const Consultation = mongoose.model('Consultation', consultationSchema);
module.exports = Consultation;
