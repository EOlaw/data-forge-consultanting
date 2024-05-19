const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    clientID: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    consultantID: { type: Schema.Types.ObjectId, ref: 'ConsultantProfile', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comments: { type: String },
    date: { type: Date, default: Date.now }
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review