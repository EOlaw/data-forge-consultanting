const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    clientID: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    consultantID: { type: Schema.Types.ObjectId, ref: 'ConsultantProfile', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    status: { type: String, enum: ['Planned', 'In Progress', 'Completed'], required: true },
    budget: { type: Number, required: true },
    notes: { type: String }
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project
