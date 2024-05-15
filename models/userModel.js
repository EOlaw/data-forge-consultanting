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
    interests: [String], // Array of interests
    skills: [String], // Array of skills
    socialMediaLinks: {
        linkedin: { type: String },
        twitter: { type: String },
        facebook: { type: String },
        instagram: { type: String },
    },
    preferredCommunicationChannel: { type: String },
    languagePreferences: [String], // Array of languages
    emergencyContact: {
        name: { type: String },
        relationship: { type: String },
        phoneNumber: { type: String },
        email: { type: String }
    },
    jobTitle: { type: String },
    areasOfInterest: { type: [String], required: true }, // Array of consulting areas of interest, required
    consultingGoals: { type: String },
    budgetRange: { type: String },
    preferredConsultationTimes: [String], // Array of preferred consultation times
    timezone: { type: String }, // Changed to String as there is no Time type in Mongoose
    communicationPreferences: [String], // Array of communication preferences
    role: {
        type: String,
        enum: ['client', 'student', 'subscriber']
    },
    profilePicture: String,
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
    },
    // New fields for authentication and security
    passwordResetToken: String,
    passwordResetExpires: Date,
    twoFactorSecret: String,
    twoFactorEnabled: {
        type: Boolean,
        default: false
    },
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: Date,
    // New fields for user preferences and settings
    notificationPreferences: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        push: { type: Boolean, default: false }
    },
    privacySettings: {
        dataSharing: { type: Boolean, default: true },
        profileVisibility: { type: String, enum: ['public', 'private', 'friends'], default: 'public' }
    }
}, { timestamps: true });

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);
module.exports = User;
