const express = require('express');
const router = express.Router();
const grupoController = require('../controllers/grupoController');
const authMiddleware = require('../middleware/auth');

// Buscar grupos por nombre
router.get('/buscar', authMiddleware, grupoController.buscarGrupos);

// Crear un grupo
router.post('/', authMiddleware, grupoController.crearGrupo);

// Obtener todos los grupos
router.get('/', authMiddleware, grupoController.obtenerGrupos);

// Buscar grupo por ID
router.get('/:id', authMiddleware, grupoController.obtenerGrupoPorId);

// Eliminar grupo
router.delete('/:id', authMiddleware, grupoController.eliminarGrupo);

module.exports = router;
