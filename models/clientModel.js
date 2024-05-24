const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
    userID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    companyName: { type: String, required: true },
    industry: { type: String },
    contactPerson: { type: String },
    address: { type: String },
    website: { type: String }
});

const Client = mongoose.model('Client', clientSchema)
module.exports = Client
