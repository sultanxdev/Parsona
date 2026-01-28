const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    signalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Signal', required: true },
    modelVersion: { type: String, default: '1.0.0' },
    brandScore: { type: Number, required: true }, // 0-100
    subScores: {
        consistency: Number,
        authority: Number,
        engagement: Number
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Score', scoreSchema);
