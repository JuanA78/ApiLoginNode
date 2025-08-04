const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET;

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Token no proporcionado' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token malformado' });

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'El token ha expirado' });
      } else {
        return res.status(401).json({ error: 'Token inválido' });
      }
    }
    req.userId = decoded.userId;
    next();
  });
}

module.exports = authMiddleware;
