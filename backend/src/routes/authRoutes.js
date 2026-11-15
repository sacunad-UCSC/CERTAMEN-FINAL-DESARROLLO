const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('El nombre es obligatorio'),
    body('email').isEmail().withMessage('Correo electrónico inválido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Correo electrónico inválido'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria'),
  ],
  login
);

router.get('/me', protect, getMe);

module.exports = router;
