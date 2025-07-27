const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventaController');
const authMiddleware = require('../middleware/auth');

router.post('/registrarVenta/:id', authMiddleware, ventaController.registrarVenta);
router.get('/obtenerVentas/:id?', authMiddleware, ventaController.obtenerVentas);
router.get('/reporte-diario', authMiddleware, ventaController.reportePorFecha);

module.exports = router;
