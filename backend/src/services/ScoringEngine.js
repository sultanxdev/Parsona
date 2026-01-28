const Score = require('../models/Score');

class ScoringEngine {
    constructor() {
        this.VERSION = '1.0.0';
    }

    async calculate(userId, signal) {
        const { topics, cadence, engagement } = signal.computedData;

        // 1. Consistency Score (0-100)
        // Ideal gap is 2-4 days. Variance should be low.
        let consistency = 100;
        if (cadence.averageGapDays > 7) consistency -= 20;
        if (cadence.averageGapDays > 14) consistency -= 40;
        if (cadence.variance > 5) consistency -= 20; // Erratic posting
        consistency = Math.max(0, consistency);

        // 2. Authority Score (0-100)
        // Based on topic focus (entropy) and comment quality
        const focusScore = topics.length > 0 ? topics[0].frequency * 200 : 0; // High freq of top topic = focused
        const authority = Math.min(100, (focusScore + (engagement.commentsPerPost * 10)));

        // 3. Engagement Score (0-100)
        const enggScore = Math.min(100, engagement.likesPerPost + (engagement.commentsPerPost * 2));

        // Weighted Brand Score
        // Authority 50%, Consistency 30%, Engagement 20%
        const brandScore = Math.floor(
            (authority * 0.5) + (consistency * 0.3) + (enggScore * 0.2)
        );

        const subScores = {
            consistency: Math.floor(consistency),
            authority: Math.floor(authority),
            engagement: Math.floor(enggScore)
        };

        const score = await Score.findOneAndUpdate(
            { userId, signalId: signal._id, modelVersion: this.VERSION },
            { brandScore, subScores, createdAt: new Date() },
            { upsert: true, new: true }
        );

        return score;
    }
}

module.exports = new ScoringEngine();
