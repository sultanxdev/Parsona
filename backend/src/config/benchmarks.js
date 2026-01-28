// Hardcoded benchmarks for MVP. 
// In V2, these could be dynamic based on aggregate data.

const BENCHMARKS = {
    FOUNDER: {
        minCadenceGap: 2, // Every 2 days
        maxCadenceGap: 5,
        requiredTopics: ['vision', 'hiring', 'strategy', 'growth', 'product'],
        minAuthorityScore: 70,
        minEngagementRatio: 0.05 // 5% likes-to-comments/reposts
    },
    ENGINEER_LEADER: {
        minCadenceGap: 5,
        maxCadenceGap: 10,
        requiredTopics: ['architecture', 'engineering', 'teams', 'scale', 'systems'],
        minAuthorityScore: 80,
        minEngagementRatio: 0.02
    },
    FREELANCER: {
        minCadenceGap: 1,
        maxCadenceGap: 3,
        requiredTopics: ['work', 'client', 'design', 'case study', 'available'],
        minAuthorityScore: 60,
        minEngagementRatio: 0.1
    }
};

module.exports = BENCHMARKS;
