const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
require('dotenv').config();

// Lista negra en memoria para tokens inválidos (para logout)
const blacklistedTokens = new Set();

exports.login = async (req, res) => {
  try {
    const { usuario, password } = req.body;
    console.log(`Intento de inicio de sesión para el usuario: ${usuario}`);
    console.log(`Contraseña proporcionada: ${password}`);
    
    // Validar campos NOT NULL
    if (!usuario || !password) {
      return res.status(400).json({ error: 'Los campos usuario y password son obligatorios' });
    }
    
    const user = await Usuario.findOne({ where: { usuario } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const token = jwt.sign({ id: user.id, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, nombre: user.nombre });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(400).json({ error: 'No se proporcionó token' });
    }
    
    // Agregar el token a la lista negra
    blacklistedTokens.add(token);
    
    res.status(200).json({ message: 'Sesión cerrada exitosamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Función para verificar si un token está en la lista negra
exports.isTokenBlacklisted = (token) => {
  return blacklistedTokens.has(token);
};