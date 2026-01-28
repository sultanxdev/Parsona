const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class AuthService {
    async hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    async comparePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }

    generateToken(user) {
        return jwt.sign(
            { id: user._id, email: user.email, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
    }

    async verifyGoogleToken(idToken) {
        // Implementation for Google ID Token verification
        // For MVP/Simulation, we'll return a decoded payload
        // In real prod, use google-auth-library
        return { email: 'google_user@example.com', name: 'Google User', sub: 'g123' };
    }
}

module.exports = new AuthService();
