const express = require('express');
const router = express.Router();
const historialController = require('../controllers/historialController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, historialController.createHistorial);
router.get('/:id', authMiddleware, historialController.getHistorial);
router.put('/:id', authMiddleware, historialController.updateHistorial);
router.delete('/:id', authMiddleware, historialController.deleteHistorial);
router.get('/', authMiddleware, historialController.getAllHistoriales);
router.get('/search', authMiddleware, historialController.searchHistorialByText);

module.exports = router;