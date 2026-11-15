const nodemailer = require('nodemailer');

const createTransporter = async () => {
  // Si estamos en entorno de desarrollo y no hay credenciales reales, generamos cuenta de pruebas Ethereal
  if (process.env.NODE_ENV !== 'production' && (!process.env.SMTP_USER || process.env.SMTP_USER === 'ethereal_user')) {
    const testAccount = await nodemailer.createTestAccount();
    console.log('[Email] Modo de prueba activo con Ethereal:', testAccount.user);
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_PORT == 465, // true para 465, false para otros puertos
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

module.exports = createTransporter;
