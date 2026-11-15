const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { body } = require('express-validator');
const {
  submitContact,
  getContacts,
  updateContactStatus,
} = require('../controllers/contactController');
const { protect, restrictTo } = require('../middlewares/auth');

// Rate limiting de seguridad DevSecOps: máximo 5 envíos cada 15 minutos por IP para evitar spam
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    message: 'Has enviado demasiadas consultas recientemente. Por favor espera unos minutos antes de intentar de nuevo.',
  },
});

router.post(
  '/',
  contactLimiter,
  [
    body('name').trim().notEmpty().withMessage('El nombre es obligatorio'),
    body('email').isEmail().withMessage('Correo electrónico inválido'),
    body('subject').trim().notEmpty().withMessage('El asunto es obligatorio'),
    body('message').trim().isLength({ min: 10, max: 1000 }).withMessage('El mensaje debe tener entre 10 y 1000 caracteres'),
  ],
  submitContact
);

router.get('/', protect, restrictTo('Administrador'), getContacts);
router.put('/:id', protect, restrictTo('Administrador'), updateContactStatus);

module.exports = router;
