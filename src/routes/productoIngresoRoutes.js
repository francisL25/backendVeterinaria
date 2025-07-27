const express = require('express');
const router = express.Router();
const ingresoController = require('../controllers/productoIngresoController');
const authMiddleware = require('../middleware/auth');

router.post('/registrarIngreso/:id', authMiddleware, ingresoController.registrarIngreso);
router.get('/obtenerIngresos/:id', authMiddleware, ingresoController.obtenerIngresos);

module.exports = router;
