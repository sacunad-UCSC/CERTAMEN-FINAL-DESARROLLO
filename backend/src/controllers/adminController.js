const RedSocial = require('../models/RedSocial');
const Usuario = require('../models/Usuario');

exports.getPublicSocialLinks = async (req, res, next) => {
  try {
    const redes = await RedSocial.find({ activa: true });
    const links = redes.map((r) => ({
      _id: r._id,
      platform: r.plataforma,
      url: r.enlaceUrl,
      isActive: r.activa,
    }));
    res.json({ success: true, links });
  } catch (error) {
    next(error);
  }
};

exports.getAllSocialLinksAdmin = async (req, res, next) => {
  try {
    const links = await RedSocial.find();
    res.json({ success: true, links });
  } catch (error) {
    next(error);
  }
};

exports.upsertSocialLink = async (req, res, next) => {
  try {
    const { platform, url, isActive } = req.body;
    let red = await RedSocial.findOne({ plataforma: platform });

    if (red) {
      red.enlaceUrl = url;
      if (isActive !== undefined) red.activa = isActive;
      await red.save();
    } else {
      red = await RedSocial.create({ plataforma: platform, enlaceUrl: url, activa: isActive });
    }

    res.json({ success: true, link: red });
  } catch (error) {
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const usuarios = await Usuario.find().select('-clave').sort({ createdAt: -1 });
    const users = usuarios.map((u) => ({
      _id: u._id,
      name: u.nombre,
      email: u.correo,
      role: u.rol,
      isActive: u.activo,
    }));
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

exports.createUserAdmin = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nombre, correo y clave son obligatorios' });
    }

    const existe = await Usuario.findOne({ correo: email.toLowerCase() });
    if (existe) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }

    const nuevoUsuario = await Usuario.create({
      nombre: name,
      correo: email.toLowerCase(),
      clave: password,
      rol: role || 'Administrador',
    });

    res.status(201).json({
      success: true,
      user: {
        id: nuevoUsuario._id,
        name: nuevoUsuario.nombre,
        email: nuevoUsuario.correo,
        role: nuevoUsuario.rol,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const { role, isActive } = req.body;
    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      { rol: role, activo: isActive },
      { new: true }
    ).select('-clave');
    res.json({ success: true, user: usuario });
  } catch (error) {
    next(error);
  }
};
