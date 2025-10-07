const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    // Basic Details
    fullName: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    age: {
        type: Number
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    aadhaarNumber: {
        type: String
    },
    phone: {
        type: String
    },
    
    // Family & Income Details
    annualIncome: {
        type: Number,
        required: true
    },
    rationCardType: {
        type: String,
        enum: ['APL', 'BPL', 'Antyodaya', 'None']
    },
    familyMembers: {
        type: Number,
        required: true
    },
    dependents: [{
        type: String,
        enum: ['Children', 'Senior Citizens', 'Disabled Members', 'None']
    }],
    
    // Location & Residence
    district: {
        type: String,
        required: true
    },
    localBodyType: {
        type: String,
        enum: ['Urban', 'Rural', 'Panchayat'],
        required: true
    },
    address: {
        type: String,
        required: true
    },
    pinCode: {
        type: String,
        required: true
    },
    
    // Special Categories
    isWidow: {
        type: Boolean,
        default: false
    },
    isSeniorCitizen: {
        type: Boolean,
        default: false
    },
    isDisabled: {
        type: Boolean,
        default: false
    },
    disabilityType: {
        type: String
    },
    disabilityPercentage: {
        type: Number
    },
    isOrphan: {
        type: Boolean,
        default: false
    },
    casteCategory: {
        type: String,
        enum: ['SC', 'ST', 'OBC', 'General']
    },
    
    // Education & Occupation
    educationLevel: {
        type: String,
        enum: ['SSLC', 'Plus Two', 'Graduate', 'Post Graduate', 'Currently Student'],
        required: true
    },
    occupation: {
        type: String,
        enum: ['Student', 'Job', 'Unemployed', 'Self Employed', 'Retired', 'Other'],
        required: true
    },
    
    // Documents
    documents: [{
        type: String,
        enum: [
            'Aadhaar Card', 'Ration Card', 'Income Certificate', 'Caste Certificate',
            'Disability Certificate', 'Bank Passbook', 'Educational Certificates', 'Other Relevant Documents'
        ]
    }],
    
    // Preferences
    preferredLanguage: {
        type: String,
        enum: ['Malayalam', 'English'],
        default: 'Malayalam'
    },
    notificationPreference: {
        type: String,
        enum: ['SMS', 'Email', 'Both', 'None'],
        default: 'Both'
    },
    
    // Metadata
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
ProfileSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Profile', ProfileSchema);
