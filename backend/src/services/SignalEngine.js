const Signal = require('../models/Signal');

class SignalEngine {
    constructor() {
        this.VERSION = '1.0.0';
    }

    /**
     * Deterministic processing of raw activities into signals.
     * @param {string} userId
     * @param {Array} activities - List of raw activity objects
     */
    async process(userId, activities) {
        if (!activities || activities.length === 0) {
            throw new Error('No activities provided for signal extraction');
        }

        const computedData = {
            datasetSize: activities.length,
            topics: this.analyzeTopics(activities),
            cadence: this.analyzeCadence(activities),
            engagement: this.analyzeEngagement(activities),
            trends: this.analyzeTrends(activities),
            topPosts: this.analyzeTopPosts(activities)
        };

        // Idempotent upsert
        const signal = await Signal.findOneAndUpdate(
            { userId, signalVersion: this.VERSION },
            { computedData, createdAt: new Date() },
            { upsert: true, new: true }
        );

        return signal;
    }

    analyzeTopics(activities) {
        // Mock Topic Extraction (Deterministic based on simple keyword hash/frequency)
        // In production, we'd use a deterministic NLP library or fixed whitelist
        const allText = activities.map(a => a.rawPayload.text || "").join(" ").toLowerCase();
        const words = allText.split(/\s+/).filter(w => w.length > 4);

        const frequency = {};
        words.forEach(w => { frequency[w] = (frequency[w] || 0) + 1; });

        const sorted = Object.entries(frequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5) // Top 5 topics
            .map(([name, count]) => ({
                name,
                count,
                frequency: count / words.length
            }));

        return sorted;
    }

    analyzeCadence(activities) {
        // Sort by date
        const dates = activities
            .map(a => new Date(a.rawPayload.date || a.ingestedAt).getTime())
            .sort((a, b) => a - b);

        if (dates.length < 2) return { averageGapDays: 0, variance: 0 };

        let totalGap = 0;
        const gaps = [];

        for (let i = 1; i < dates.length; i++) {
            const diffDays = (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);
            gaps.push(diffDays);
            totalGap += diffDays;
        }

        const avg = totalGap / gaps.length;
        const variance = gaps.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / gaps.length;

        return {
            averageGapDays: parseFloat(avg.toFixed(2)),
            variance: parseFloat(variance.toFixed(2))
        };
    }

    analyzeEngagement(activities) {
        let totalLikes = 0;
        let totalComments = 0;

        activities.forEach(a => {
            totalLikes += (a.rawPayload.likes || 0);
            totalComments += (a.rawPayload.comments || 0);
        });

        const avgLikes = totalLikes / activities.length;
        const avgComments = totalComments / activities.length;

        // Quality Ratio: Comments are worth 5x likes in "Authority" signal
        const ratio = totalLikes > 0 ? (totalComments * 5) / totalLikes : 0;

        return {
            likesPerPost: parseFloat(avgLikes.toFixed(2)),
            commentsPerPost: parseFloat(avgComments.toFixed(2)),
            ratio: parseFloat(ratio.toFixed(2))
        };
    }

    analyzeTrends(activities) {
        const trends = {};
        activities.forEach(a => {
            const date = new Date(a.rawPayload.date || a.ingestedAt).toISOString().split('T')[0];
            if (!trends[date]) {
                trends[date] = { date, likes: 0, comments: 0 };
            }
            trends[date].likes += (a.rawPayload.likes || 0);
            trends[date].comments += (a.rawPayload.comments || 0);
        });

        // Sort by date and take last 30 days
        return Object.values(trends)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(-30);
    }

    analyzeTopPosts(activities) {
        return activities
            .map(a => ({
                text: a.rawPayload.text,
                likes: a.rawPayload.likes || 0,
                comments: a.rawPayload.comments || 0,
                date: a.rawPayload.date || a.ingestedAt
            }))
            .sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments))
            .slice(0, 5);
    }
}

module.exports = new SignalEngine();
