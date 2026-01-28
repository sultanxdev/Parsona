const mongoose = require('mongoose');

const signalSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    signalVersion: { type: String, default: '1.0.0' },
    computedData: {
        datasetSize: Number, // Number of posts analyzed
        topics: [{
            name: String,
            count: Number,
            frequency: Number // 0-1
        }],
        cadence: {
            averageGapDays: Number,
            variance: Number
        },
        engagement: {
            likesPerPost: Number,
            commentsPerPost: Number,
            ratio: Number
        },
        trends: [{
            date: String,
            likes: Number,
            comments: Number
        }],
        topPosts: [{
            text: String,
            likes: Number,
            comments: Number,
            date: String
        }]
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Signal', signalSchema);
