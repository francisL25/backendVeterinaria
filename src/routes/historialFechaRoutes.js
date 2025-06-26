const express = require('express');
const router = express.Router();
const historialFechaController = require('../controllers/historialFechaController');
const authMiddleware = require('../middleware/auth');

// ✅ Rutas específicas primero
router.get('/idH/:idH', authMiddleware, historialFechaController.getHistorialesByIdH);
router.get('/ultimo/:idH', authMiddleware, historialFechaController.getUltimoHistorialFechaByIdH);
router.get('/por-fecha', authMiddleware, historialFechaController.getCitasPorFecha); // 🔹 Nueva ruta

// ✅ Rutas generales después
router.get('/', authMiddleware, historialFechaController.getAllHistorialFechas);
router.post('/:idH', authMiddleware, historialFechaController.createHistorialFecha);
router.get('/:id', authMiddleware, historialFechaController.getHistorialFecha);
router.put('/:id', authMiddleware, historialFechaController.updateHistorialFecha);
router.delete('/:id', authMiddleware, historialFechaController.deleteHistorialFecha);

module.exports = router;
