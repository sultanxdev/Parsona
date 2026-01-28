const mongoose = require('mongoose');
const User = require('./src/models/User');
const IngestionService = require('./src/services/IngestionService');
require('dotenv').config();

const MOCK_USER = {
    name: "Demo Founder",
    email: "founder@example.com",
    authProviderId: "demo_123",
    avatarUrl: "https://github.com/shadcn.png"
};

const MOCK_ACTIVITIES = [
    // 1. High Authority Post (Topic: Vision)
    {
        text: "Building the future of AI requires more than just code. It requires a fundamental shift in how we approach systems design. #AI #Vision",
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
        likes: 120,
        comments: 45
    },
    // 2. Engagement Bait (Low Quality)
    {
        text: "Agree or disagree? Remote work is dead.",
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
        likes: 50,
        comments: 100
    },
    // 3. Consistency Check (Gap)
    {
        text: "Hiring engineering managers is the hardest part of scaling.",
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(), // 12 days ago
        likes: 80,
        comments: 12
    }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/parsona');
        console.log("🔌 Connected to DB");

        // Clear old data
        await User.deleteMany({ email: MOCK_USER.email });
        // Note: We aren't clearing RawActivity/Signals to test idempotency, but for a clean seed:
        // await mongoose.connection.db.dropDatabase(); 

        // Create User
        let user = await User.create(MOCK_USER);
        console.log(`👤 Created User: ${user._id}`);

        // Run Ingestion
        console.log("🚀 Starting Ingestion...");
        const result = await IngestionService.syncActivities(user._id, MOCK_ACTIVITIES);

        console.log("✅ Seed Complete. Result:", result);
        process.exit(0);
    } catch (err) {
        console.error("❌ Seed Failed:", err);
        process.exit(1);
    }
}

seed();
