require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

// Rutas
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const contactRoutes = require('./routes/contactRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');
const adminRoutes = require('./routes/adminRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// Conectar a MongoDB
connectDB();

// 1. Cabeceras de seguridad HTTP con Helmet (DevSecOps)
app.use(helmet());

// 2. CORS restrictivo
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:3000',
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin.includes('vercel.app')) {
        callback(null, true);
      } else {
        callback(new Error('Bloqueado por política CORS'));
      }
    },
    credentials: true,
  })
);

// 3. Rate limiting general contra ataques de fuerza bruta / DoS
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiadas solicitudes desde esta IP, por favor intente más tarde.' },
});
app.use(globalLimiter);

// 4. Parseo de JSON y URL encoded con límite de tamaño para evitar desbordamientos
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Health Check (requerido para Render / CI/CD)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Montaje de Rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);

// Manejo de rutas inexistentes (404)
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada en la API' });
});

// Middleware centralizado de errores
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Servidor Activo] Escuchando en puerto ${PORT} en modo ${process.env.NODE_ENV || 'development'}`);
});
