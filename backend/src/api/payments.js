const express = require('express');
const router = express.Router();
const RazorpayService = require('../services/RazorpayService');
const User = require('../models/User');

// POST /api/payments/order
router.post('/order', async (req, res) => {
    try {
        const { amount } = req.body; // e.g., 500 for Rs.500
        if (!amount) return res.status(400).json({ error: 'Amount is required' });

        const order = await RazorpayService.createOrder(amount);
        res.json({ success: true, order });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/payments/verify
router.post('/verify', async (req, res) => {
    try {
        const { orderId, paymentId, signature, creditsToUpdate } = req.body;
        const isValid = RazorpayService.verifySignature(orderId, paymentId, signature);

        if (isValid) {
            const user = await User.findById(req.user.id);
            user.credits += (creditsToUpdate || 100);
            await user.save();
            res.json({ success: true, message: 'Payment verified and credits added', credits: user.credits });
        } else {
            res.status(400).json({ error: 'Invalid payment signature' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
