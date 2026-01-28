const BENCHMARKS = require('../config/benchmarks');

class GapAnalysisService {

    /**
     * Compares user signals against a target persona.
     * @param {Object} computedSignals - { topics, cadence, engagement }
     * @param {String} targetPersona - 'FOUNDER' | 'ENGINEER_LEADER'
     */
    analyze(computedSignals, targetPersona) {
        const benchmark = BENCHMARKS[targetPersona] || BENCHMARKS.FOUNDER;
        const gaps = [];

        // 1. Cadence Gap
        const userGap = computedSignals.cadence.averageGapDays;
        if (userGap > benchmark.maxCadenceGap) {
            gaps.push({
                type: 'CADENCE',
                severity: 'HIGH',
                message: `You are posting every ${userGap} days. Target is every ${benchmark.maxCadenceGap} days.`,
                delta: userGap - benchmark.maxCadenceGap
            });
        }

        // 2. Topic Gap
        const userTopics = computedSignals.topics.map(t => t.name);
        const missingTopics = benchmark.requiredTopics.filter(t => !userTopics.includes(t));
        if (missingTopics.length > 0) {
            gaps.push({
                type: 'TOPIC',
                severity: 'MEDIUM',
                message: `You are missing key topics: ${missingTopics.slice(0, 3).join(', ')}.`,
                missing: missingTopics
            });
        }

        // 3. Engagement Quality Gap
        const userRatio = computedSignals.engagement.ratio;
        if (userRatio < benchmark.minEngagementRatio) {
            gaps.push({
                type: 'QUALITY',
                severity: 'LOW',
                message: `Your engagement is passive. Aim for more comments/discussions relative to likes.`,
                current: userRatio,
                target: benchmark.minEngagementRatio
            });
        }

        return {
            targetPersona,
            gaps,
            benchmarks: benchmark, // Add this for comparison in charts
            score: 100 - (gaps.length * 15) // Simple heuristic for "Gap Score"
        };
    }
}

module.exports = new GapAnalysisService();
