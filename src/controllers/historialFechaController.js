const { Op } = require('sequelize');
const HistorialFecha = require('../models/HistorialFecha');
const Historial = require('../models/Historial');

exports.createHistorialFecha = async (req, res) => {
  try {
    const { idH, nombreMascota, raza, especie, fechaNacimiento, sexo, nombreDueno, carnetIdentidad, telefono, direccion, peso, castrado, esterilizado, seniaParticular, anamnesis, sintomasSignos, tratamiento, diagnostico, cita, doctorAtendio, fechaHistorial } = req.body;
    
    // Validar campos NOT NULL
    if (!idH || !nombreMascota || !raza || !especie || !sexo || !nombreDueno || !carnetIdentidad || !telefono || !direccion || !peso || !castrado || !esterilizado || !cita || !fechaHistorial) {
      return res.status(400).json({ error: 'Los campos idH, nombreMascota, raza, especie, sexo, nombreDueno, carnetIdentidad, telefono, direccion, peso, castrado, esterilizado, cita y fechaHistorial son obligatorios' });
    }
    
    // Verificar que el Historial asociado exista
    const historial = await Historial.findByPk(idH);
    if (!historial) {
      return res.status(404).json({ error: 'Historial asociado no encontrado' });
    }
    
    const newHistorialFecha = await HistorialFecha.create({ idH, nombreMascota, raza, especie, fechaNacimiento, sexo, nombreDueno, carnetIdentidad, telefono, direccion, peso, castrado, esterilizado, seniaParticular, anamnesis, sintomasSignos, tratamiento, diagnostico, cita, doctorAtendio, fechaHistorial });
    res.status(201).json(newHistorialFecha);
  } catch (error) {
    res.status(400).json({ error: error.message });
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
    const { idH, nombreMascota, raza, especie, fechaNacimiento, sexo, nombreDueno, carnetIdentidad, telefono, direccion, peso, castrado, esterilizado, seniaParticular, anamnesis, sintomasSignos, tratamiento, diagnostico, cita, doctorAtendio, fechaHistorial } = req.body;
    const historialFecha = await HistorialFecha.findByPk(req.params.id);
    if (!historialFecha) return res.status(404).json({ message: 'HistorialFecha no encontrado' });
    
    // Validar campos NOT NULL antes de actualizar
    if (!idH || !nombreMascota || !raza || !especie || !sexo || !nombreDueno || !carnetIdentidad || !telefono || !direccion || !peso || !castrado || !esterilizado || !cita || !fechaHistorial) {
      return res.status(400).json({ error: 'Los campos idH, nombreMascota, raza, especie, sexo, nombreDueno, carnetIdentidad, telefono, direccion, peso, castrado, esterilizado, cita y fechaHistorial son obligatorios' });
    }
    
    // Verificar que el Historial asociado exista
    const historial = await Historial.findByPk(idH);
    if (!historial) {
      return res.status(404).json({ error: 'Historial asociado no encontrado' });
    }
    
    await historialFecha.update({ idH, nombreMascota, raza, especie, fechaNacimiento, sexo, nombreDueno, carnetIdentidad, telefono, direccion, peso, castrado, esterilizado, seniaParticular, anamnesis, sintomasSignos, tratamiento, diagnostico, cita, doctorAtendio, fechaHistorial });
    res.json(historialFecha);
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
    
    // Validar que se proporcione un idH
    if (!idH) {
      return res.status(400).json({ error: 'El parámetro idH es obligatorio' });
    }
    
    // Buscar todos los HistorialFecha asociados al idH
    const historialFechas = await HistorialFecha.findAll({
      where: { idH }
    });
    
    if (historialFechas.length === 0) {
      return res.status(404).json({ message: 'No se encontraron historiales para el idH proporcionado' });
    }
    
    res.status(200).json(historialFechas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};