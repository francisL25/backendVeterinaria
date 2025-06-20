const Documento = require('../models/Documento');

const HistorialFecha = require('../models/HistorialFecha');


const createDocumento = async (req, res) => {
  try {
    const { historial_id } = req.body;
    const archivo = req.file;
    console.log('Archivo recibido:', archivo);
    console.log('Historial ID:', historial_id);

    if (!archivo || !historial_id) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }
    const historial = await HistorialFecha.findByPk(historial_id);
    console.log(JSON.stringify(historial, null, 2));

    
    if (!historial) {
      return res.status(404).json({ error: 'Historial no encontrado' });
    }

    const nuevo = await Documento.create({
      nombre: archivo.originalname,
      tipo_contenido: archivo.mimetype,
      archivo: archivo.buffer,
      historial_id,
    });

    res.status(201).json({ mensaje: 'Documento guardado', documento: nuevo });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar documento' });
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
