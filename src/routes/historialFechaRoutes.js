const express = require('express');
const router = express.Router();
const historialFechaController = require('../controllers/historialFechaController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, historialFechaController.createHistorialFecha);
router.get('/:id', authMiddleware, historialFechaController.getHistorialFecha);
router.put('/:id', authMiddleware, historialFechaController.updateHistorialFecha);
router.delete('/:id', authMiddleware, historialFechaController.deleteHistorialFecha);
router.get('/', authMiddleware, historialFechaController.getAllHistorialFechas);
router.get('/idH/:idH', authMiddleware, historialFechaController.getHistorialesByIdH);

module.exports = router;