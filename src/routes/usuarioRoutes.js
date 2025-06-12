const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, usuarioController.createUsuario);
router.get('/', authMiddleware, usuarioController.getUsuarios);
router.put('/:id', authMiddleware, usuarioController.updateUsuario);
router.delete('/:id', authMiddleware, usuarioController.deleteUsuario);

module.exports = router;