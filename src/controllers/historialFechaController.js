const { Op } = require('sequelize');
const HistorialFecha = require('../models/HistorialFecha');
const Historial = require('../models/Historial');
const Documento = require('../models/Documento');

exports.createHistorialFecha = async (req, res) => {
  try {
    const {
      idH,
      nombreMascota,
      raza,
      especie,
      fechaNacimiento,
      sexo,
      nombreDueno,
      carnetIdentidad,
      telefono,
      direccion,
      peso,
      castrado,
      esterilizado,
      seniaParticular,
      anamnesis,
      sintomasSignos,
      tratamiento,
      diagnostico,
      cita,
      doctorAtendio,
      fechaHistorial,
      receta,
      recomendacion
    } = req.body;
    console.log('Creando nuevo HistorialFecha con datos:', req.body);

    // Validar existencia de historial principal
    const historial = await Historial.findByPk(idH);
    if (!historial) {
      return res.status(404).json({ error: 'Historial asociado no encontrado' });
    }

    // Crear nuevo registro HistorialFecha
    const nuevoHistorialFecha = await HistorialFecha.create({
      idH,
      nombreMascota,
      raza,
      especie,
      fechaNacimiento,
      sexo,
      nombreDueno,
      carnetIdentidad,
      telefono,
      direccion,
      peso,
      castrado,
      esterilizado,
      seniaParticular,
      anamnesis,
      sintomasSignos,
      tratamiento,
      diagnostico,
      cita,
      doctorAtendio,
      fechaHistorial,
      receta,
      recomendacion
    });

    return res.status(201).json({
      historialFechaId: nuevoHistorialFecha.id,
      message: 'Historial creado correctamente'
    });
  } catch (error) {
    console.error('Error al crear HistorialFecha:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};


exports.getHistorialFecha = async (req, res) => {
  try {
    const historialFecha = await HistorialFecha.findByPk(req.params.id);
    if (!historialFecha) return res.status(404).json({ message: 'HistorialFecha no encontrado' });
    res.json(historialFecha);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateHistorialFecha = async (req, res) => {
  try {
    const { idH, nombreMascota, raza, especie, fechaNacimiento, sexo, nombreDueno, carnetIdentidad, telefono, direccion, peso, castrado, esterilizado, seniaParticular, anamnesis, sintomasSignos, tratamiento, diagnostico, cita, doctorAtendio, fechaHistorial, receta, recomendacion } = req.body;
    console.log(fechaHistorial);
    const historialFecha = await HistorialFecha.findByPk(req.params.id);
    if (!historialFecha) return res.status(404).json({ message: 'HistorialFecha no encontrado' });

    // Verificar que el Historial asociado exista
    const historial = await Historial.findByPk(idH);
    if (!historial) {
      return res.status(404).json({ error: 'Historial asociado no encontrado' });
    }

    await historialFecha.update({ idH, nombreMascota, raza, especie, fechaNacimiento, sexo, nombreDueno, carnetIdentidad, telefono, direccion, peso, castrado, esterilizado, seniaParticular, anamnesis, sintomasSignos, tratamiento, diagnostico, cita, doctorAtendio, fechaHistorial, receta, recomendacion });
    await historialFecha.reload();
    console.log('Registro actualizado:', historialFecha.toJSON());

    return res.status(201).json({
      historialFechaId: req.params.id,
      message: 'Historial creado correctamente'
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteHistorialFecha = async (req, res) => {
  try {
    const historialFecha = await HistorialFecha.findByPk(req.params.id);
    if (!historialFecha) return res.status(404).json({ message: 'HistorialFecha no encontrado' });
    await historialFecha.destroy();
    res.json({ message: 'HistorialFecha eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllHistorialFechas = async (req, res) => {
  try {
    const historialFechas = await HistorialFecha.findAll();
    res.status(200).json(historialFechas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getHistorialesByIdH = async (req, res) => {
  try {
    const { idH } = req.params;

    if (!idH) {
      return res.status(400).json({ error: 'El parámetro idH es obligatorio' });
    }

    // 1. Buscás todos los historiales con ese idH
    const historiales = await HistorialFecha.findAll({
      where: { idH },
      order: [['fechaHistorial', 'DESC']],
    });

    if (historiales.length === 0) {
      return res.status(404).json({ message: 'No se encontraron historiales para el idH proporcionado' });
    }

    // 2. Para cada historial, buscás documentos relacionados
    const historialesConDocs = await Promise.all(
      historiales.map(async historial => {
        const documentos = await Documento.findAll({
          where: { historial_id: historial.id },
          attributes: ['nombre'],
        });

        // Convertir a JSON plano para agregar documentos
        const historialJSON = historial.toJSON();
        historialJSON.documentos = documentos;
        return historialJSON;
      })
    );

    res.status(200).json(historialesConDocs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUltimoHistorialFechaByIdH = async (req, res) => {
  try {
    const { idH } = req.params;

    if (!idH) {
      return res.status(400).json({ error: 'El parámetro idH es obligatorio' });
    }

    const ultimoHistorial = await HistorialFecha.findOne({
      where: { idH },
      order: [['fechaHistorial', 'DESC']],
    });

    if (!ultimoHistorial) {
      return res.status(404).json({ message: 'No se encontró historial para el idH proporcionado' });
    }

    res.status(200).json(ultimoHistorial);
  } catch (error) {
    console.error('Error al obtener el último historial:', error);
    res.status(500).json({ error: error.message });
  }
};
exports.getCitasPorFecha = async (req, res) => {
  try {
    const { fecha } = req.query;

    if (!fecha) {
      return res.status(400).json({ error: 'El parámetro "fecha" es obligatorio. Usa el formato YYYY-MM-DD' });
    }

    const fechaInicio = new Date(`${fecha}T00:00:00.000-04:00`);
    const fechaFin = new Date(`${fecha}T23:59:59.999-04:00`);

    const citas = await HistorialFecha.findAll({
      where: {
        cita: {
          [Op.between]: [fechaInicio, fechaFin],
        },
      },
      order: [['cita', 'ASC']],
    });

    res.status(200).json(citas);
  } catch (error) {
    console.error('Error al obtener citas por fecha:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

