const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    phoneNumber: { type: Number, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    dateOfBirth: { type: Date, required: true },
    address: { type: String },
    education: { type: String, required: true },
    employment: { type: String, required: true },
    interest: [String], // Array of interests
    skills: [String], // Array of skills
    socialMediaLinks: {
        linkedin: { type: String },
        twitter: { type: String },
        facebook: { type: String },
        instagram: { type: String },
    },
    preferredCommunicationChannel: { type: String },
    languagePreferences: [ String ], // Array of languages
    emergencyContact: {
        name: { type: String },
        relationship: { type: String },
        phoneNumber: { type: String },
        email: { type: String }
    },
    role: {
        type: String,
        enum: ['client', 'student', 'subscriber']
    },
    profilePicture: String,
    contactInformation: String,
    subscription: {
        status: {
            type: String,
            enum: ['active', 'inactive', 'trial'],
            default: 'inactive'
        },
        type: {
            type: String,
            enum: ['basic', 'premium', 'trial'],
            default: 'basic'
        },
        startDate: Date,
        endDate: Date,
        trialPeriod: Number, // In days
        paymentMethod: String,
        billingInformation: String
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

userSchema.plugin(passportLocalMongoose)

const User = mongoose.model('User', userSchema);
module.exports = User;
