const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const RegistroAuditoria = require('../models/RegistroAuditoria');

const generarToken = (id, rol) => {
  return jwt.sign({ id, rol }, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '2h',
  });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existe = await Usuario.findOne({ correo: email.toLowerCase() });
    if (existe) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }

    const usuario = await Usuario.create({
      nombre: name,
      correo: email.toLowerCase(),
      clave: password,
      rol: 'Usuario registrado',
    });

    const token = generarToken(usuario._id, usuario.rol);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: usuario._id,
        name: usuario.nombre,
        email: usuario.correo,
        role: usuario.rol,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Por favor ingresa correo y contraseña' });
    }

    const usuario = await Usuario.findOne({ correo: email.toLowerCase() }).select('+clave');
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const esValida = await usuario.compararClave(password);
    if (!esValida) {
      await RegistroAuditoria.create({
        accion: 'INGRESO_FALLIDO',
        realizadoPor: { correo: email },
        direccionIp: req.ip,
      });
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    await RegistroAuditoria.create({
      accion: 'INGRESO_EXITOSO',
      realizadoPor: { usuarioId: usuario._id, correo: usuario.correo, rol: usuario.rol },
      direccionIp: req.ip,
    });

    const token = generarToken(usuario._id, usuario.rol);

    res.json({
      success: true,
      token,
      user: {
        id: usuario._id,
        name: usuario.nombre,
        email: usuario.correo,
        role: usuario.rol,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const usuario = await Usuario.findById(req.user.id);
    res.json({
      success: true,
      user: {
        id: usuario._id,
        name: usuario.nombre,
        email: usuario.correo,
        role: usuario.rol,
      },
    });
  } catch (error) {
    next(error);
  }
};
