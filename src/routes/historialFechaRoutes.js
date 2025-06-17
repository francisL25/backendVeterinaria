const express = require('express');
const router = express.Router();
const historialFechaController = require('../controllers/historialFechaController');
const authMiddleware = require('../middleware/auth');

// ✅ Rutas más específicas primero
router.get('/idH/:idH', authMiddleware, historialFechaController.getHistorialesByIdH);
router.get('/', authMiddleware, historialFechaController.getAllHistorialFechas);

// ✅ Rutas con parámetro general al final
router.post('/:idH', authMiddleware, historialFechaController.createHistorialFecha);
router.get('/:id', authMiddleware, historialFechaController.getHistorialFecha);
router.put('/:id', authMiddleware, historialFechaController.updateHistorialFecha);
router.delete('/:id', authMiddleware, historialFechaController.deleteHistorialFecha);

module.exports = router;
