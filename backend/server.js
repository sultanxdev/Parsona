const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - [${req.method}] ${req.url}`);
    next();
});

// JSON Error Handler
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error('❌ Malformed JSON Request detected!');
        console.error('Body snippet:', req.body);
        return res.status(400).send({ error: 'Malformed JSON' });
    }
    next();
});

// DB Connection
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
    try {
        // Attempt Local Connection
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected (Local)");
    } catch (err) {
        console.log("⚠️ Local MongoDB failed. Starting In-Memory Fallback...");
        try {
            const mongod = await MongoMemoryServer.create();
            const uri = mongod.getUri();
            await mongoose.connect(uri);
            console.log(`✅ MongoDB Connected (In-Memory Fallback at ${uri})`);
            console.log("📝 Note: Data will vanish when server restarts.");
        } catch (memErr) {
            console.error("❌ MongoDB Connection Error:", memErr);
            process.exit(1);
        }
    }
};

connectDB();

// Routes
const mainRoutes = require('./src/api/routes');
const authRoutes = require('./src/api/auth');
const paymentRoutes = require('./src/api/payments');
const authMiddleware = require('./src/middleware/auth');

app.use('/auth', authRoutes);
app.use('/api', authMiddleware, mainRoutes);
app.use('/api/payments', authMiddleware, paymentRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'Parsona Backend' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});