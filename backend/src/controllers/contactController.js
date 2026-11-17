const Contacto = require('../models/Contacto');
const createTransporter = require('../config/mailer');

exports.submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const nuevoContacto = await Contacto.create({
      nombre: name,
      correo: email.toLowerCase(),
      telefono: phone,
      asunto: subject,
      mensaje: message,
    });

    let notifAdmin = false;
    let confCliente = false;

    try {
      const transporter = await createTransporter();
      const correoInstitucional = process.env.INSTITUTIONAL_EMAIL || 'contacto@nexopc.cl';

      // 1. Notificación a la institución/empresa
      await transporter.sendMail({
        from: `"NexoPC Notificaciones" <${process.env.SMTP_USER || 'no-reply@nexopc.cl'}>`,
        to: correoInstitucional,
        replyTo: email,
        subject: `[Consulta Web NexoPC] ${subject}`,
        html: `
          <h2>Nueva Consulta Registrada en Base de Datos NexoPC</h2>
          <p><strong>Cliente:</strong> ${name}</p>
          <p><strong>Correo:</strong> ${email}</p>
          <p><strong>Teléfono:</strong> ${phone || 'No registrado'}</p>
          <p><strong>Asunto:</strong> ${subject}</p>
          <p><strong>Mensaje:</strong></p>
          <blockquote>${message}</blockquote>
        `,
      });
      notifAdmin = true;

      // 2. Confirmación al cliente
      await transporter.sendMail({
        from: `"Soporte Oficial NexoPC" <${correoInstitucional}>`,
        to: email,
        subject: `Confirmación de Recepción: ${subject} - NexoPC`,
        html: `
          <h3>Hola ${name},</h3>
          <p>Hemos recibido tu consulta o cotización en <strong>NexoPC</strong> con el asunto: <em>"${subject}"</em>.</p>
          <p>Un ejecutivo de hardware de nuestro equipo se pondrá en contacto contigo a la brevedad.</p>
          <br>
          <p>Copia de tu mensaje: "${message}"</p>
          <br>
          <small>NexoPC - Los Ángeles, Región del Biobío, Chile</small>
        `,
      });
      confCliente = true;

      nuevoContacto.estadoEnvioCorreo = {
        notificacionAdmin: notifAdmin,
        confirmacionCliente: confCliente,
      };
      await nuevoContacto.save();
    } catch (mailError) {
      console.error('[Error Nodemailer]:', mailError.message);
    }

    res.status(201).json({
      success: true,
      message: 'Mensaje enviado y registrado con éxito. Se enviaron los correos correspondientes.',
      id: nuevoContacto._id,
    });
  } catch (error) {
    next(error);
  }
};

exports.getContacts = async (req, res, next) => {
  try {
    const contactos = await Contacto.find().sort({ createdAt: -1 });
    const contacts = contactos.map((c) => ({
      _id: c._id,
      name: c.nombre,
      email: c.correo,
      phone: c.telefono,
      subject: c.asunto,
      message: c.mensaje,
      status: c.estado,
    }));
    res.json({ success: true, count: contacts.length, contacts });
  } catch (error) {
    next(error);
  }
};

exports.updateContactStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const c = await Contacto.findByIdAndUpdate(req.params.id, { estado: status }, { new: true });
    if (!c) return res.status(404).json({ message: 'Contacto no encontrado' });
    res.json({ success: true, contact: c });
  } catch (error) {
    next(error);
  }
};
