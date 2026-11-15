const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, restrictTo } = require('../middlewares/auth');

router.get('/', getProducts);
router.get('/:id', getProductById);

// Rutas protegidas solo para rol Administrador
router.post('/', protect, restrictTo('Administrador'), createProduct);
router.put('/:id', protect, restrictTo('Administrador'), updateProduct);
router.delete('/:id', protect, restrictTo('Administrador'), deleteProduct);

module.exports = router;
