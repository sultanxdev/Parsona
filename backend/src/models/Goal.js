const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetPersona: {
        type: String,
        enum: ['ENGINEER_LEADER', 'FOUNDER', 'CONSULTANT', 'FREELANCER'],
        required: true
    },
    active: { type: Boolean, default: true },
    benchmarks: {
        minCadence: Number,
        requiredTopics: [String]
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Goal', goalSchema);
