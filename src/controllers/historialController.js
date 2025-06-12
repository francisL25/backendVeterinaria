const { Op } = require('sequelize');
const Historial = require('../models/Historial');
const InformacionMascota = require('../models/InformacionMascota');

exports.createHistorial = async (req, res) => {
  try {
    const { nombreMascota, anamnesis, sintomasSignos, tratamiento, diagnostico, cita, nombreDueño, doctorAtendio, informacionMascota } = req.body;
    
    // Validar campos NOT NULL
    if (!nombreMascota || !anamnesis || !sintomasSignos || !tratamiento || !diagnostico || !nombreDueño || !doctorAtendio) {
      return res.status(400).json({ error: 'Todos los campos (nombreMascota, anamnesis, sintomasSignos, tratamiento, diagnostico, nombreDueño, doctorAtendio) son obligatorios' });
    }
    
    // Validar campos NOT NULL de informacionMascota
    if (informacionMascota && (!informacionMascota.edad || !informacionMascota.peso || !informacionMascota.sexo || informacionMascota.castrado === undefined || informacionMascota.esterilizado === undefined)) {
      return res.status(400).json({ error: 'Todos los campos de informacionMascota (edad, peso, sexo, castrado, esterilizado) son obligatorios' });
    }
    
    const historial = await Historial.create({
      nombreMascota,
      anamnesis,
      sintomasSignos,
      tratamiento,
      diagnostico,
      cita,
      nombreDueño,
      doctorAtendio,
    });
    
    if (informacionMascota) {
      await InformacionMascota.create({
        ...informacionMascota,
        idH: historial.id,
      });
    }
    
    const fullHistorial = await Historial.findByPk(historial.id, {
      include: InformacionMascota,
    });
    res.status(201).json(fullHistorial);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getHistoriales = async (req, res) => {
  try {
    const historiales = await Historial.findAll({
      include: InformacionMascota,
    });
    res.status(200).json(historiales);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getHistorialById = async (req, res) => {
  try {
    const { id } = req.params;
    const historial = await Historial.findByPk(id, {
      include: InformacionMascota,
    });
    if (historial) {
      res.status(200).json(historial);
    } else {
      res.status(404).json({ error: 'Historial no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateHistorial = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombreMascota, anamnesis, sintomasSignos, tratamiento, diagnostico, cita, nombreDueño, doctorAtendio, informacionMascota } = req.body;
    
    // Validar campos NOT NULL
    if (!nombreMascota || !anamnesis || !sintomasSignos || !tratamiento || !diagnostico || !nombreDueño || !doctorAtendio) {
      return res.status(400).json({ error: 'Todos los campos (nombreMascota, anamnesis, sintomasSignos, tratamiento, diagnostico, nombreDueño, doctorAtendio) son obligatorios' });
    }
    
    // Validar campos NOT NULL de informacionMascota
    if (informacionMascota && (!informacionMascota.edad || !informacionMascota.peso || !informacionMascota.sexo || informacionMascota.castrado === undefined || informacionMascota.esterilizado === undefined)) {
      return res.status(400).json({ error: 'Todos los campos de informacionMascota (edad, peso, sexo, castrado, esterilizado) son obligatorios' });
    }
    
    const [updated] = await Historial.update(
      { nombreMascota, anamnesis, sintomasSignos, tratamiento, diagnostico, cita, nombreDueño, doctorAtendio },
      { where: { id } }
    );
    
    if (updated) {
      if (informacionMascota) {
        await InformacionMascota.update(informacionMascota, { where: { idH: id } });
      }
      const updatedHistorial = await Historial.findByPk(id, {
        include: InformacionMascota,
      });
      res.status(200).json(updatedHistorial);
    } else {
      res.status(404).json({ error: 'Historial no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteHistorial = async (req, res) => {
  try {
    const { id } = req.params;

    // Elimina primero la información relacionada
    await InformacionMascota.destroy({ where: { idH: id } });

    // Luego elimina el historial
    const deleted = await Historial.destroy({ where: { id } });

    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Historial no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.searchHistorialByNombreMascota = async (req, res) => {
  try {
    const { nombreMascota } = req.query;
    
    if (!nombreMascota) {
      return res.status(400).json({ error: 'El parámetro nombreMascota es obligatorio' });
    }
    
    const historiales = await Historial.findAll({
      where: {
        nombreMascota: {
          [Op.iLike]: `%${nombreMascota}%` // Búsqueda insensible a mayúsculas/minúsculas
        }
      },
      include: InformacionMascota,
    });
    
    res.status(200).json(historiales);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};