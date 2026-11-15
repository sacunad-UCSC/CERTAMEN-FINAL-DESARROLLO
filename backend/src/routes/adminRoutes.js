const express = require('express');
const router = express.Router();
const {
  getPublicSocialLinks,
  getAllSocialLinksAdmin,
  upsertSocialLink,
  getUsers,
  createUserAdmin,
  updateUserRole,
} = require('../controllers/adminController');
const { protect, restrictTo } = require('../middlewares/auth');

// Redes sociales públicas
router.get('/social-links', getPublicSocialLinks);

// Rutas exclusivas de Administrador
router.use(protect, restrictTo('Administrador'));

router.get('/admin/social-links', getAllSocialLinksAdmin);
router.post('/admin/social-links', upsertSocialLink);

router.get('/users', getUsers);
router.post('/users', createUserAdmin);
router.put('/users/:id/role', updateUserRole);

module.exports = router;
