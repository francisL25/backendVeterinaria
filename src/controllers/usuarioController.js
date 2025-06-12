const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');

exports.createUsuario = async (req, res) => {
  try {
    const { nombre, usuario, password, rol } = req.body;
    
    // Validar campos NOT NULL
    if (!nombre || !usuario || !password || !rol) {
      return res.status(400).json({ error: 'Todos los campos (nombre, usuario, password, rol) son obligatorios' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUsuario = await Usuario.create({ nombre, usuario, password: hashedPassword, rol });
    res.status(201).json({ id: newUsuario.id, nombre: newUsuario.nombre, usuario: newUsuario.usuario, rol: newUsuario.rol });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({ attributes: { exclude: ['password'] } });
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, usuario, password, rol } = req.body;
    
    // Validar campos NOT NULL
    if (!nombre || !usuario || !rol) {
      return res.status(400).json({ error: 'Los campos nombre, usuario y rol son obligatorios' });
    }
    
    const usuarioData = { nombre, usuario, rol };
    if (password) {
      usuarioData.password = await bcrypt.hash(password, 10);
    }
    
    const [updated] = await Usuario.update(usuarioData, { where: { id } });
    if (updated) {
      const updatedUsuario = await Usuario.findByPk(id, { attributes: { exclude: ['password'] } });
      res.status(200).json(updatedUsuario);
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Usuario.destroy({ where: { id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};