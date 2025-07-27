const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, productoController.crearProducto);
router.get('/', authMiddleware, productoController.obtenerProductos);
router.get('/buscar', authMiddleware, productoController.buscarProductosPorTexto);
router.get('/:id', authMiddleware, productoController.obtenerProductoPorId);
router.delete('/:id', authMiddleware, productoController.eliminarProducto);

module.exports = router;
