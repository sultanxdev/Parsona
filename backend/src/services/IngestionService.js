const crypto = require('crypto');
const RawActivity = require('../models/RawActivity');
const SignalEngine = require('./SignalEngine');
const ScoringEngine = require('./ScoringEngine');

class IngestionService {

    /**
     * Syncs data for a user.
     * MVP: Accepts a JSON payload directly (simulating a scraper/proxy webhook).
     */
    async syncActivities(userId, activityPayloads) {
        if (!activityPayloads || activityPayloads.length === 0) {
            // Check if we should generate simulation data
            if (!process.env.LINKEDIN_CLIENT_ID || process.env.LINKEDIN_CLIENT_ID === 'mock_id') {
                console.log(`[Ingest] No real data provided. Generating high-fidelity simulation for ${userId}`);
                activityPayloads = this.generateSimulationData();
            } else {
                return { newItems: 0, message: "No activity data provided." };
            }
        }

        console.log(`[Ingest] Processing ${activityPayloads.length} items for ${userId}`);

        let newItems = 0;

        for (const payload of activityPayloads) {
            const contentString = JSON.stringify(payload);
            const contentHash = crypto.createHash('sha256').update(contentString).digest('hex');

            try {
                await RawActivity.create({
                    userId,
                    rawPayload: payload,
                    contentHash
                });
                newItems++;
            } catch (err) {
                if (err.code === 11000) {
                    // Duplicate, ignore
                } else {
                    console.error("Ingestion Error:", err);
                }
            }
        }

        console.log(`[Ingest] Stored ${newItems} new raw activities.`);

        // 3. Trigger Analytics Pipeline
        const result = await this.triggerPipeline(userId);

        return { newItems, ...result };
    }

    async triggerPipeline(userId) {
        const allActivities = await RawActivity.find({ userId });
        if (allActivities.length === 0) return null;

        const signal = await SignalEngine.process(userId, allActivities);
        const score = await ScoringEngine.calculate(userId, signal);

        return { signal, score };
    }

    generateSimulationData() {
        const topics = [
            "distributed systems", "system design", "scalability", "microservices",
            "javascript", "react", "high performance computing", "cloud native"
        ];

        const activities = [];
        const now = Date.now();

        // Generate 12 activities over the last 60 days
        for (let i = 0; i < 12; i++) {
            const daysAgo = Math.floor(Math.random() * 60);
            const date = new Date(now - daysAgo * 24 * 60 * 60 * 1000);

            activities.push({
                text: `Just finished a deep dive into ${topics[Math.floor(Math.random() * topics.length)]}. The tradeoff between consistency and availability is always fascinating!`,
                likes: Math.floor(Math.random() * 50) + 10,
                comments: Math.floor(Math.random() * 10) + 2,
                date: date.toISOString()
            });
        }

        return activities;
    }
}

module.exports = new IngestionService();
