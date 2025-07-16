const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

exports.generateToken = (payload) => jwt.sign(payload, secret, { expiresIn: '1h' });
exports.verifyToken = (token) => jwt.verify(token, secret);
