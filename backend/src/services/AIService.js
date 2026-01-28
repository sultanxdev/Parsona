const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

class AIService {
    constructor() {
        this.client = null;
        if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'mock_key') {
            this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
        }
    }

    async explainGap(gapAnalysis, userSignals, user) {
        if (!this.model) {
            return this.mockExplanation(gapAnalysis);
        }

        try {
            const prompt = this.buildPrompt(gapAnalysis, userSignals, user);
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (err) {
            console.error("AI Service Error (Gemini):", err.message);
            return this.mockExplanation(gapAnalysis);
        }
    }

    buildPrompt(gapAnalysis, userSignals, user) {
        const goal = user.goals || { targetPersona: 'FOUNDER' };

        return `
      SYSTEM PROMPT:
      You are the "Parsona Strategic AI", a deterministic career analyst. 
      Your goal is to provide blunt, data-backed guidance to help humans reach their SPECIFIC career targets.
      
      USER CONTEXT:
      - Current Role/Identity: ${user.name}
      - TARGET CAREER GOAL: ${goal.customGoal || goal.targetPersona}
      - Target Industry: ${goal.industry || 'Tech'}
      
      LINKEDIN DATA SIGNALS:
      - Posting Cadence: Every ${userSignals.cadence.averageGapDays} days (Variance: ${userSignals.cadence.variance}).
      - Topic Focus: ${userSignals.topics.map(t => `${t.name} (${(t.frequency * 100).toFixed(1)}%)`).join(', ')}.
      - Engagement Quality: ${userSignals.engagement.ratio} (Likes per post: ${userSignals.engagement.likesPerPost}, Comments: ${userSignals.engagement.commentsPerPost}).
      
      IDENTIFIED GAPS:
      ${JSON.stringify(gapAnalysis.gaps)}
      
      INSTRUCTION:
      Compare their current "Signals" against the "Target Career Goal". 
      Provide 2-3 powerful, structured sentences. 
      Highlight the mathematical delta (e.g., "You are 40% less consistent than the average Series A CTO").
      Give one direct action to bridge the gap.
    `;
    }

    mockExplanation(gapAnalysis) {
        if (gapAnalysis.gaps.length === 0) {
            return "You are perfectly aligned with your target persona. Your consistency and topic authority are hitting all benchmarks.";
        }
        const topGap = gapAnalysis.gaps[0];
        return `To align with the ${gapAnalysis.targetPersona} persona, you need to address your ${topGap.type} gap. ${topGap.message} Increasing this will directly impact your Authority score.`;
    }
}

module.exports = new AIService();
