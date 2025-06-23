const Documento = require('../models/Documento');

const HistorialFecha = require('../models/HistorialFecha');


const createDocumento = async (req, res) => {
  try {
    const { historial_id } = req.body;
    const archivos = req.files;

    console.log('Archivos recibidos:', archivos?.length || 0);
    console.log('Historial ID recibido:', historial_id);
    console.log('Datos del request:', req.body);

    if (!archivos?.length || !historial_id) {
      return res.status(400).json({ error: 'Faltan archivos o historial_id' });
    }

    const historial = await HistorialFecha.findByPk(historial_id);
    if (!historial) {
      return res.status(404).json({ error: 'Historial no encontrado' });
    }
    console.log('Creando documento con historial_id:', historial_id);
    const documentosGuardados = await Promise.all(
      archivos.map((archivo) =>
        Documento.create({
          nombre: archivo.originalname,
          tipo_contenido: archivo.mimetype,
          archivo: archivo.buffer,
          historial_id,
          
        })
      )
    );

    res.status(201).json({
      mensaje: 'Documentos guardados correctamente',
      documentos: documentosGuardados,
    });
  } catch (error) {
    console.error('Error al guardar documentos:', error);
    res.status(500).json({ error: 'Error al guardar documentos' });
  }
};



const getDocumentos = async (req, res) => {
  try {
    const data = await Documento.findAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener documentos' });
  }
};

const getDocumentoById = async (req, res) => {
  try {
    const doc = await Documento.findByPk(req.params.id);
    if (!doc) return res.status(404).json({ error: 'No encontrado' });
    res.json(doc);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar documento' });
  }
};

const descargarDocumento = async (req, res) => {
  try {
    const doc = await Documento.findByPk(req.params.id);
    if (!doc) return res.status(404).json({ error: 'No encontrado' });

    res.setHeader('Content-Disposition', `attachment; filename="${doc.nombre}"`);
    res.setHeader('Content-Type', doc.tipo_contenido);
    res.send(doc.archivo);
  } catch (error) {
    res.status(500).json({ error: 'Error al descargar documento' });
  }
};

const deleteDocumento = async (req, res) => {
  try {
    const rows = await Documento.destroy({ where: { id: req.params.id } });
    if (!rows) return res.status(404).json({ error: 'Documento no encontrado' });
    res.json({ mensaje: 'Documento eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar documento' });
  }
};

module.exports = {
  createDocumento,
  getDocumentos,
  getDocumentoById,
  descargarDocumento,
  deleteDocumento,
};
