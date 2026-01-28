const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Signal = require('../models/Signal');
const Score = require('../models/Score');
const Goal = require('../models/Goal'); // Ensure Model is imported
const IngestionService = require('../services/IngestionService');
const GapAnalysisService = require('../services/GapAnalysisService');
const AIService = require('../services/AIService');

// GET /api/dashboard
router.get('/dashboard', async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        const score = await Score.findOne({ userId }).sort({ createdAt: -1 });
        const signal = await Signal.findOne({ userId }).sort({ createdAt: -1 });
        const goal = user.goals || { targetPersona: 'FOUNDER' };

        if (!score || !signal) {
            return res.json({
                brandScore: 0,
                signals: { consistency: 0, authority: 0, engagement: 0 },
                computedData: { datasetSize: 0, topics: [] },
                credits: user.credits,
                message: "No data yet. Connect LinkedIn."
            });
        }

        const gapAnalysis = GapAnalysisService.analyze(signal.computedData, goal.targetPersona);

        // We no longer call AIService here to save credits.
        // It should be fetched via POST /api/ai/generate explicitly.

        res.json({
            brandScore: score.brandScore,
            signals: score.subScores,
            computedData: signal.computedData,
            trends: signal.computedData.trends,
            topPosts: signal.computedData.topPosts,
            identityAlignmentScore: gapAnalysis.score,
            targetPersona: goal.targetPersona,
            gapAnalysis,
            credits: user.credits,
            insights: [
                `Target: ${goal.targetPersona}`,
                ...gapAnalysis.gaps.map(g => g.message)
            ]
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/ai/generate
router.post('/ai/generate', async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.credits < 1) {
            return res.status(403).json({ error: "Insufficient credits." });
        }

        const signal = await Signal.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
        if (!signal) return res.status(404).json({ error: "No signal data found." });

        const goal = user.goals || { targetPersona: 'FOUNDER' };
        const gapAnalysis = GapAnalysisService.analyze(signal.computedData, goal.targetPersona);

        const aiExplanation = await AIService.explainGap(gapAnalysis, signal.computedData, user);

        // Deduct 1 credit
        user.credits -= 1;
        await user.save();

        res.json({ success: true, aiExplanation, credits: user.credits });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/ingest/sync
router.post('/ingest/sync', async (req, res) => {
    try {
        const userId = req.user.id;
        const { activities } = req.body;

        const mResult = await IngestionService.syncActivities(userId, activities || []);
        res.json({ success: true, ...mResult });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/goals
router.post('/goals', async (req, res) => {
    try {
        const { targetPersona, customGoal, industry } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { goals: { targetPersona, customGoal, industry } },
            { new: true }
        );
        res.json({ success: true, goals: user.goals });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
