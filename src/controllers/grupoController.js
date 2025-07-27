const Grupo = require('../models/Grupo');
const { Op } = require('sequelize');

// Crear grupo
const crearGrupo = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const grupo = await Grupo.create({ nombre, descripcion });
    res.status(201).json(grupo);
  } catch (error) {
    console.error('Error al crear grupo:', error);
    res.status(500).json({ error: 'Error al crear grupo' });
  }
};

// Obtener todos los grupos
const obtenerGrupos = async (req, res) => {
  try {
    const grupos = await Grupo.findAll();
    res.json(grupos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener grupos' });
  }
};

// Obtener grupo por ID
const obtenerGrupoPorId = async (req, res) => {
  try {
    const grupo = await Grupo.findByPk(req.params.id);
    if (!grupo) return res.status(404).json({ error: 'Grupo no encontrado' });
    res.json(grupo);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar grupo' });
  }
};

// Eliminar grupo
const eliminarGrupo = async (req, res) => {
  try {
    const grupo = await Grupo.findByPk(req.params.id);
    if (!grupo) return res.status(404).json({ error: 'Grupo no encontrado' });

    await grupo.destroy();
    res.json({ mensaje: 'Grupo eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar grupo' });
  }
};
const buscarGrupos = async (req, res) => {
  try {
    const { texto } = req.query;
    console.log(`Buscando grupos con texto: ${texto}`);
    if (!texto || texto.trim() === '') {
      return res.status(400).json({ error: 'Texto de búsqueda requerido' });
    }

    const grupos = await Grupo.findAll({
      where: {
        nombre: {
          [Op.iLike]: `%${texto.trim()}%`, // Busca sin importar mayúsculas/minúsculas
        },
      },
      order: [['nombre', 'ASC']],
    });

    res.json(grupos);
  } catch (error) {
    console.error('Error al buscar grupos:', error);
    res.status(500).json({ error: 'Error al buscar grupos' });
  }
};

module.exports = {
  crearGrupo,
  obtenerGrupos,
  obtenerGrupoPorId,
  eliminarGrupo,
  buscarGrupos,
};
