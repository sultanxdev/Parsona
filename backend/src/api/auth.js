const express = require('express');
const router = express.Router();
const User = require('../models/User');
const AuthService = require('../services/AuthService');
const axios = require('axios');
require('dotenv').config();

// Simulation Helper
const isSimulation = !process.env.LINKEDIN_CLIENT_ID || process.env.LINKEDIN_CLIENT_ID === 'mock_id';
console.log(`[Auth] Mode: ${isSimulation ? 'SIMULATION' : 'REAL'} (ID: ${process.env.LINKEDIN_CLIENT_ID})`);

/**
 * 1. EMAIL SIGNUP
 * POST /auth/signup
 */
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: 'User already exists' });

        const hashedPassword = await AuthService.hashPassword(password);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            credits: 10, // Signup Bonus
            authProvider: 'email'
        });

        const token = AuthService.generateToken(user);
        res.json({ success: true, user: { id: user._id, name: user.name, email: user.email, credits: user.credits }, token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * 2. EMAIL LOGIN
 * POST /auth/login
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !user.password) return res.status(401).json({ error: 'Invalid credentials' });

        const isMatch = await AuthService.comparePassword(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const token = AuthService.generateToken(user);
        user.lastLogin = new Date();
        await user.save();
        res.json({ success: true, user: { id: user._id, name: user.name, email: user.email, credits: user.credits }, token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * 3. GOOGLE AUTH (Simulation)
 * GET /auth/google
 */
router.get('/google', (req, res) => {
    // Simulated Google OAuth Redirect
    const redirectUrl = `http://localhost:5173/auth/google/callback?code=mock_google_code`;
    res.json({ url: redirectUrl });
});

/**
 * POST /auth/google/callback
 */
router.post('/google/callback', async (req, res) => {
    try {
        const { code } = req.body;
        // Mock payload if code is 'mock_google_code'
        const payload = {
            email: 'google_user@example.com',
            name: 'Google User',
            sub: 'g123',
            authProvider: 'google'
        };

        let user = await User.findOne({ email: payload.email });
        if (!user) {
            user = await User.create({
                name: payload.name,
                email: payload.email,
                authProviderId: payload.sub,
                authProvider: 'google',
                credits: 10
            });
        }

        const token = AuthService.generateToken(user);
        res.json({ success: true, user: { id: user._id, name: user.name, email: user.email, credits: user.credits }, token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * 4. LINKEDIN AUTH
 * GET /auth/linkedin
 */
router.get('/linkedin', (req, res) => {
    if (isSimulation) {
        const redirectUrl = `http://localhost:5173/auth/linkedin/callback?code=mock_sim_code`;
        return res.json({ url: redirectUrl });
    }
    const scope = encodeURIComponent('openid profile email');
    const redirectUri = encodeURIComponent('http://localhost:5173/auth/linkedin/callback');
    const state = 'parsona_auth';
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
    res.json({ url: authUrl });
});

router.post('/linkedin/callback', async (req, res) => {
    console.log('--- Incoming LinkedIn Callback ---');
    const { code } = req.body;
    let userData;

    try {
        if (isSimulation || code === 'mock_sim_code') {
            userData = {
                name: "Shekhar Analytics",
                email: "shekhar@parsona.ai",
                authProviderId: "sim_shekhar_123",
                authProvider: 'linkedin',
                avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Shekhar"
            };
        } else {
            console.log(`[LinkedIn] Initiating Handshake with code: ${code.substring(0, 10)}...`);
            console.log(`[LinkedIn] Exchanging code for token...`);

            // 1. Exchange Code for Access Token
            const params = new URLSearchParams();
            params.append('grant_type', 'authorization_code');
            params.append('code', code);
            params.append('client_id', process.env.LINKEDIN_CLIENT_ID);
            params.append('client_secret', process.env.LINKEDIN_CLIENT_SECRET);
            params.append('redirect_uri', 'http://localhost:5173/auth/linkedin/callback');

            const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', params, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                timeout: 15000 // 15s timeout
            });

            const accessToken = tokenResponse.data.access_token;
            console.log(`[LinkedIn] Token received. Fetching user info...`);

            // 2. Fetch User Profile via OIDC userinfo endpoint
            const userResponse = await axios.get('https://api.linkedin.com/v2/userinfo', {
                headers: { Authorization: `Bearer ${accessToken}` },
                timeout: 15000 // 15s timeout
            });
            console.log(`[LinkedIn] User info received:`, userResponse.data);

            const liUser = userResponse.data;
            userData = {
                name: liUser.name || `${liUser.given_name} ${liUser.family_name}`,
                email: liUser.email,
                authProviderId: liUser.sub, // 'sub' is the unique OIDC identifier
                authProvider: 'linkedin',
                avatarUrl: liUser.picture
            };
        }

        let user = await User.findOne({ email: userData.email });
        if (!user) {
            user = await User.create({ ...userData, credits: 10 });
        } else {
            // Update provider info if needed
            user.authProviderId = userData.authProviderId;
            user.authProvider = 'linkedin';
            if (userData.avatarUrl) user.avatarUrl = userData.avatarUrl;
            await user.save();
        }

        const token = AuthService.generateToken(user);
        res.json({ success: true, user: { id: user._id, name: user.name, email: user.email, credits: user.credits }, token });
    } catch (err) {
        console.error('LinkedIn Auth Error:', err.response?.data || err.message);

        let errorMessage = 'LinkedIn authentication failed.';
        if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
            errorMessage = 'LinkedIn API request timed out. Please try again.';
        } else if (err.response?.data?.error === 'invalid_redirect_uri') {
            errorMessage = 'LinkedIn Redirect URI mismatch. Check your app settings.';
        } else if (err.response?.data?.error_description) {
            errorMessage = `LinkedIn Error: ${err.response.data.error_description}`;
        }

        res.status(500).json({ error: errorMessage });
    }
});

const authMiddleware = require('../middleware/auth');

/**
 * 5. GET CURRENT USER
 * GET /auth/me
 */
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ success: true, user: { id: user._id, name: user.name, email: user.email, credits: user.credits, goals: user.goals } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
