const Razorpay = require('razorpay');
require('dotenv').config();

class RazorpayService {
    constructor() {
        this.instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_id',
            key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_mock_secret'
        });
    }

    async createOrder(amount, currency = 'INR') {
        const options = {
            amount: amount * 100, // Razorpay works in paise
            currency,
            receipt: `receipt_${Date.now()}`
        };
        return await this.instance.orders.create(options);
    }

    verifySignature(orderId, paymentId, signature) {
        const crypto = require('crypto');
        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'rzp_test_mock_secret');
        hmac.update(orderId + "|" + paymentId);
        const generatedSignature = hmac.digest('hex');
        return generatedSignature === signature;
    }
}

module.exports = new RazorpayService();
