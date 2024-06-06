const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const crypto = require('crypto');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['Consultant', 'Client'], required: true },
    contactNumber: { type: Number },
    profilePicture: { type: String },
    //consultantProfile: { type: Schema.Types.ObjectId, ref: 'Consultant' },
    //clientProfile: { type: Schema.Types.ObjectId, ref: 'Client' },
    lastLogin: { type: Date },
    isAdmin: { type: Boolean, default: false }
}, { timestamps: true });

userSchema.plugin(passportLocalMongoose);


const User = mongoose.model('User', userSchema);
module.exports = User;
