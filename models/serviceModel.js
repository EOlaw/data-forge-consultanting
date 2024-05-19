const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number },
    category: { type: String }
});

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service
