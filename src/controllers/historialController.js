const { Op } = require('sequelize');
const Historial = require('../models/Historial');
const HistorialFecha = require('../models/HistorialFecha');

exports.createHistorial = async (req, res) => {
  try {
    console.log('Creando nuevo historial con datos:', req.body);
    const { nombreMascota, raza, especie, fechaNacimiento, sexo, nombreDueno, carnetIdentidad, telefono, direccion } = req.body;

    const newHistorial = await Historial.create({ nombreMascota, raza, especie, fechaNacimiento, sexo, nombreDueno, carnetIdentidad, telefono, direccion });
    // Crear un HistorialFecha inicial asociado al nuevo Historial
    const historialFecha = await HistorialFecha.create({
      idH: newHistorial.id,
      nombreMascota,
      raza,
      especie,
      fechaNacimiento,
      sexo,
      nombreDueno,
      carnetIdentidad,
      telefono,
      direccion,
      peso: req.body.peso,
      castrado: req.body.castrado,
      esterilizado: req.body.esterilizado,
      seniaParticular: req.body.seniaParticular,
      anamnesis: req.body.anamnesis,
      sintomasSignos: req.body.sintomasSignos,
      tratamiento: req.body.tratamiento,
      diagnostico: req.body.diagnostico,
      cita: req.body.cita,
      doctorAtendio: req.body.doctorAtendio,
      fechaHistorial: req.body.fechaHistorial,
      receta: req.body.receta,
      recomendacion: req.body.recomendacion
    });
    res.status(201).json({
      historialFechaId: historialFecha.id,
      message: 'Historial creado correctamente'
    });
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
    const historiales = await Historial.findAll({
      order: [['id', 'DESC']]
    });
    res.status(200).json(historiales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchHistorialByText = async (req, res) => {
  try {
    const { texto } = req.query;
    console.log(`Búsqueda de historial con texto: ${texto}`);
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
exports.searchDuenosByText = async (req, res) => {
  try {
    const { texto } = req.query;
    console.log(`Búsqueda de historial con texto: ${texto}`);
    // Validar que se proporcione un texto para buscar
    if (!texto) {
      return res.status(400).json({ error: 'El parámetro texto es obligatorio para la búsqueda' });
    }
    const historiales = await Historial.findAll({
      where: {
        [Op.or]: [
          { nombreDueno: { [Op.iLike]: `%${texto}%` } },
          //{ carnetIdentidad: { [Op.iLike]: `%${texto}%` } },
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