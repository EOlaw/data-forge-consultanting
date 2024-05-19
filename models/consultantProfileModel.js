const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const consultantProfileSchema = new Schema({
    userID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    specialization: { type: String },
    experienceYears: { type: Number },
    bio: { type: String },
    certifications: { type: [String] },
    linkedInProfile: { type: String },
    availability: { type: Boolean, default: true },
    rating: { type: Number }
});
const ConsultantProfile = mongoose.model('ConsultantProfile', consultantProfileSchema);
module.exports = ConsultantProfile
