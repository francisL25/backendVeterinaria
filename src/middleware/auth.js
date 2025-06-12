const jwt = require('jsonwebtoken');
const authController = require('../controllers/authController');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado, token requerido' });
  }

  // Verificar si el token está en la lista negra
  if (authController.isTokenBlacklisted(token)) {
    return res.status(401).json({ error: 'Token inválido, sesión cerrada' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = authMiddleware;