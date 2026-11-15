const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

      req.user = await Usuario.findById(decoded.id).select('-clave');
      if (!req.user) {
        return res.status(401).json({ message: 'Usuario no encontrado o dado de baja' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token inválido o expirado' });
    }
  } else {
    return res.status(401).json({ message: 'Acceso no autorizado: Token ausente' });
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({
        message: 'Acceso denegado: No cuentas con privilegios para esta acción',
      });
    }
    next();
  };
};

module.exports = { protect, restrictTo };
