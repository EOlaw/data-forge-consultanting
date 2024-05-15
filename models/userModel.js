const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
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
