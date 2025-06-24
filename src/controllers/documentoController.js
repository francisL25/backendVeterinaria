const fs = require('fs');
const path = require('path');
const Documento = require('../models/Documento');
const HistorialFecha = require('../models/HistorialFecha');

// Crear documento: guarda en disco y registra en DB
const createDocumento = async (req, res) => {
  try {
    const { historial_id } = req.body;
    const archivos = req.files;

    if (!archivos?.length || !historial_id) {
      return res.status(400).json({ error: 'Faltan archivos o historial_id' });
    }

    const historial = await HistorialFecha.findByPk(historial_id);
    if (!historial) {
      return res.status(404).json({ error: 'Historial no encontrado' });
    }

    const documentosGuardados = await Promise.all(
      archivos.map((archivo) => {
        const rutaRelativa = path.relative(
          path.join(__dirname, '..'),
          archivo.path
        ).replace(/\\/g, '/');

        return Documento.create({
          nombre: archivo.originalname,
          tipo_contenido: archivo.mimetype,
          ruta_archivo: rutaRelativa,
          historial_id,
        });
      })
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

// Obtener todos los documentos
const getDocumentos = async (req, res) => {
  try {
    const data = await Documento.findAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener documentos' });
  }
};

// Obtener un documento por ID
const getDocumentoById = async (req, res) => {
  try {
    const doc = await Documento.findByPk(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Documento no encontrado' });
    res.json(doc);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar documento' });
  }
};

// Descargar documento desde disco
const descargarDocumento = async (req, res) => {
  try {
    const doc = await Documento.findByPk(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Documento no encontrado' });

    const rutaAbsoluta = path.join(__dirname, '..', doc.ruta_archivo);

    if (!fs.existsSync(rutaAbsoluta)) {
      return res.status(404).json({ error: 'Archivo no encontrado en el servidor' });
    }

    res.download(rutaAbsoluta, doc.nombre);
  } catch (error) {
    console.error('Error al descargar documento:', error);
    res.status(500).json({ error: 'Error al descargar documento' });
  }
};

// Eliminar documento (DB y archivo físico)
const deleteDocumento = async (req, res) => {
  try {
    const doc = await Documento.findByPk(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Documento no encontrado' });

    const rutaAbsoluta = path.join(__dirname, '..', doc.ruta_archivo);

    // Eliminar archivo físico
    if (fs.existsSync(rutaAbsoluta)) {
      fs.unlinkSync(rutaAbsoluta);
    }

    // Eliminar de la base de datos
    await Documento.destroy({ where: { id: doc.id } });

    res.json({ mensaje: 'Documento eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar documento:', error);
    res.status(500).json({ error: 'Error al eliminar documento' });
  }
};

// Obtener documentos por historial_id
const getDocumentosPorHistorial = async (req, res) => {
  try {
    const { historial_id } = req.params;

    const documentos = await Documento.findAll({
      where: { historial_id },
    });

    if (!documentos.length) {
      return res.status(404).json({ error: 'No se encontraron documentos para este historial' });
    }

    // Devuelve solo los metadatos + ruta de descarga
    const documentosConRuta = documentos.map((doc) => ({
      id: doc.id,
      nombre: doc.nombre,
      ruta_archivo: doc.ruta_archivo,
      tipo_contenido: doc.tipo_contenido,
      url_descarga: `/api/documentos/${doc.id}/descargar`,
    }));

    res.json(documentosConRuta);
  } catch (error) {
    console.error('Error al obtener documentos por historial:', error);
    res.status(500).json({ error: 'Error al obtener documentos del historial' });
  }
};

module.exports = {
  createDocumento,
  getDocumentos,
  getDocumentoById,
  descargarDocumento,
  deleteDocumento,
  getDocumentosPorHistorial,
};
