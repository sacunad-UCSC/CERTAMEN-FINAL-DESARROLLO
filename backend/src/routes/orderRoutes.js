const express = require('express');
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getMyOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, restrictTo } = require('../middlewares/auth');

// Crear orden (Permitido para visitante o usuario logueado)
router.post('/', createOrder);

// Órdenes del usuario autenticado
router.get('/my-orders', protect, getMyOrders);

// Gestión de órdenes (Solo Administrador)
router.get('/', protect, restrictTo('Administrador'), getAllOrders);
router.put('/:id/status', protect, restrictTo('Administrador'), updateOrderStatus);

module.exports = router;
