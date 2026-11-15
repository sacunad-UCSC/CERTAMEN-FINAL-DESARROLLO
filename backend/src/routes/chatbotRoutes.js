const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const {
  getFaqs,
  askChatbot,
  createFaq,
  getAllFaqsAdmin,
  updateFaq,
  deleteFaq,
} = require('../controllers/chatbotController');
const { protect, restrictTo } = require('../middlewares/auth');

// Límite de mensajes al bot para mitigar ataques DoS
const botLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  message: { message: 'Por favor no envíes mensajes tan rápido al chatbot.' },
});

router.get('/faqs', getFaqs);
router.post('/ask', botLimiter, askChatbot);

// Rutas de administración de FAQs
router.get('/admin/faqs', protect, restrictTo('Administrador'), getAllFaqsAdmin);
router.post('/admin/faqs', protect, restrictTo('Administrador'), createFaq);
router.put('/admin/faqs/:id', protect, restrictTo('Administrador'), updateFaq);
router.delete('/admin/faqs/:id', protect, restrictTo('Administrador'), deleteFaq);

module.exports = router;
