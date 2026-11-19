const express = require('express');
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getMyOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, optionalAuth, restrictTo } = require('../middlewares/auth');

// Crear orden (Permitido para visitante o usuario logueado, capturando req.user si viene con token)
router.post('/', optionalAuth, createOrder);

// Órdenes del usuario autenticado
router.get('/my-orders', protect, getMyOrders);

// Gestión de órdenes (Solo Administrador)
router.get('/', protect, restrictTo('Administrador'), getAllOrders);
router.put('/:id/status', protect, restrictTo('Administrador'), updateOrderStatus);

module.exports = router;
