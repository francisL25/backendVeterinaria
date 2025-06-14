const { Op } = require('sequelize');
const Historial = require('../models/Historial');

exports.createHistorial = async (req, res) => {
  try {
    const { nombreMascota, raza, especie, fechaNacimiento, sexo, nombreDueno, carnetIdentidad, telefono, direccion } = req.body;

    // Validar campos NOT NULL
    if (!nombreMascota || !raza || !especie || !sexo || !nombreDueno || !carnetIdentidad || !telefono || !direccion) {
      return res.status(400).json({ error: 'Los campos nombreMascota, raza, especie, sexo, nombreDueno, carnetIdentidad, telefono y direccion son obligatorios' });
    }

    const newHistorial = await Historial.create({ nombreMascota, raza, especie, fechaNacimiento, sexo, nombreDueno, carnetIdentidad, telefono, direccion });
    res.status(201).json(newHistorial);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getHistorial = async (req, res) => {
  try {
    const historial = await Historial.findByPk(req.params.id);
    if (!historial) return res.status(404).json({ message: 'Historial no encontrado' });
    res.json(historial);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateHistorial = async (req, res) => {
  try {
    const { nombreMascota, raza, especie, fechaNacimiento, sexo, nombreDueno, carnetIdentidad, telefono, direccion } = req.body;
    const historial = await Historial.findByPk(req.params.id);
    if (!historial) return res.status(404).json({ message: 'Historial no encontrado' });

    // Validar campos NOT NULL antes de actualizar
    if (!nombreMascota || !raza || !especie || !sexo || !nombreDueno || !carnetIdentidad || !telefono || !direccion) {
      return res.status(400).json({ error: 'Los campos nombreMascota, raza, especie, sexo, nombreDueno, carnetIdentidad, telefono y direccion son obligatorios' });
    }

    await historial.update({ nombreMascota, raza, especie, fechaNacimiento, sexo, nombreDueno, carnetIdentidad, telefono, direccion });
    res.json(historial);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteHistorial = async (req, res) => {
  try {
    const historial = await Historial.findByPk(req.params.id);
    if (!historial) return res.status(404).json({ message: 'Historial no encontrado' });
    await historial.destroy();
    res.json({ message: 'Historial eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllHistoriales = async (req, res) => {
  try {
    const historiales = await Historial.findAll();
    res.status(200).json(historiales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchHistorialByText = async (req, res) => {
  try {
    const { texto } = req.query;
    console.log('Texto de búsqueda:', texto);

    // Validar que se proporcione un texto para buscar
    if (!texto) {
      return res.status(400).json({ error: 'El parámetro texto es obligatorio para la búsqueda' });
    }
    const historiales = await Historial.findAll({
      where: {
        [Op.or]: [
          { nombreMascota: { [Op.iLike]: `%${texto}%` } },
          { nombreDueno: { [Op.iLike]: `%${texto}%` } },
          { carnetIdentidad: { [Op.iLike]: `%${texto}%` } },
          { telefono: { [Op.iLike]: `%${texto}%` } },
          { direccion: { [Op.iLike]: `%${texto}%` } }
        ]
      }
    });
    if (historiales.length === 0) {
      return res.status(404).json({ message: 'No se encontraron historiales con el texto proporcionado' });
    }
    res.status(200).json(historiales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};