const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // For Email auth
    authProviderId: { type: String, unique: true, sparse: true }, // LinkedIn/Google ID
    authProvider: { type: String, enum: ['email', 'google', 'linkedin'], default: 'email' },
    avatarUrl: { type: String },
    credits: { type: Number, default: 10 },
    goals: {
        targetPersona: { type: String, default: 'FOUNDER' },
        customGoal: { type: String },
        industry: { type: String }
    },
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
