const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const crypto = require('crypto');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['Consultant', 'Client'], required: true },
    contactNumber: { type: String },
    profilePicture: { type: String },
    lastLogin: { type: Date },
    isAdmin: { type: Boolean, default: false }
}, { timestamps: true });

userSchema.plugin(passportLocalMongoose);


const User = mongoose.model('User', userSchema);
module.exports = User;
