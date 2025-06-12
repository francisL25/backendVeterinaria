const express = require('express');
const router = express.Router();
const historialController = require('../controllers/historialController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, historialController.createHistorial);
router.get('/', authMiddleware, historialController.getHistoriales);
router.get('/search', authMiddleware, historialController.searchHistorialByNombreMascota);
router.get('/:id', authMiddleware, historialController.getHistorialById);
router.put('/:id', authMiddleware, historialController.updateHistorial);
router.delete('/:id', authMiddleware, historialController.deleteHistorial);

module.exports = router;