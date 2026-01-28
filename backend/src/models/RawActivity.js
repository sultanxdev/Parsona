const mongoose = require('mongoose');

const rawActivitySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sourceType: { type: String, default: 'linkedin' },
    rawPayload: { type: mongoose.Schema.Types.Mixed }, // Full JSON from LinkedIn
    contentHash: { type: String, required: true, unique: true }, // Deduplication
    ingestedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RawActivity', rawActivitySchema);
