const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const refreshSecret = process.env.REFRESH_SECRET;

exports.generateAccessToken = (userId) =>
  jwt.sign({ userId }, secret, { expiresIn: '1m' });

exports.generateRefreshToken = (userId) =>
  jwt.sign({ userId }, refreshSecret, { expiresIn: '2m' });

exports.verifyToken = (token, secretKey = secret) =>
  jwt.verify(token, secretKey);
