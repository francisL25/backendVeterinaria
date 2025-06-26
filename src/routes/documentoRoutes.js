const express = require('express');
const router = express.Router();
const documentoController = require('../controllers/documentoController');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

// Crear documento con archivos PDF
router.post('/', authMiddleware, upload.array('documentos', 10), documentoController.createDocumento);

// Obtener todos los documentos
router.get('/', authMiddleware, documentoController.getDocumentos);

// Obtener documentos por historial_id
router.get('/historial/:historial_id', authMiddleware, documentoController.getDocumentosPorHistorial);

// NUEVA RUTA: Ver documento en el navegador (inline)
router.get('/ver/:id', authMiddleware, documentoController.verDocumento);

// Descargar archivo PDF por ID (fuerza descarga)
router.get('/descargar/:id', authMiddleware, documentoController.descargarDocumento);

// Obtener un documento por ID
router.get('/:id', authMiddleware, documentoController.getDocumentoById);

// Eliminar documento
router.delete('/:id', authMiddleware, documentoController.deleteDocumento);

module.exports = router;