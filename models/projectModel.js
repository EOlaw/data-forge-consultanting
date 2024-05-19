const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    clientID: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    consultantID: { type: Schema.Types.ObjectId, ref: 'ConsultantProfile', required: true },
    title: { type: String },
    description: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    status: { type: String, enum: ['Planned', 'In Progress', 'Completed'], required: true },
    budget: { type: Number },
    notes: { type: String }
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project
