const express = require('express');
const router = express.Router();
const documentoController = require('../controllers/documentoController');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

// Crear documento con PDF (POST)
router.post('/', authMiddleware, upload.single('archivo'), documentoController.createDocumento);

// Obtener todos los documentos (GET)
router.get('/', authMiddleware, documentoController.getDocumentos);

// Obtener un documento por ID (GET)
router.get('/:id', authMiddleware, documentoController.getDocumentoById);

// Descargar archivo PDF por ID (GET)
router.get('/descargar/:id', authMiddleware, documentoController.descargarDocumento);

// Eliminar documento (DELETE)
router.delete('/:id', authMiddleware, documentoController.deleteDocumento);

module.exports = router;
