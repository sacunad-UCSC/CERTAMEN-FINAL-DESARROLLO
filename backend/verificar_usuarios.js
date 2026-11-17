const mongoose = require('mongoose');
const Usuario = require('./src/models/Usuario');
const argon2 = require('argon2');

async function migrateUsers() {
  await mongoose.connect('mongodb://127.0.0.1:27017/pc_nfactory_db');
  console.log('Conectado a MongoDB...');

  const demoUsers = [
    {
      nombre: 'Administrador NexoPC',
      correo: 'admin@pcnfactory.cl',
      clave: 'AdminPassword2026!',
      rol: 'Administrador',
    },
    {
      nombre: 'Marcelo Oyanedel',
      correo: 'cliente@ucsc.cl',
      clave: 'UserPassword2026!',
      rol: 'Usuario registrado',
    },
  ];

  for (const u of demoUsers) {
    let user = await Usuario.findOne({ correo: u.correo }).select('+clave');
    if (!user) {
      user = new Usuario({
        nombre: u.nombre,
        correo: u.correo,
        clave: u.clave,
        rol: u.rol,
      });
      await user.save();
      console.log(`Usuario creado con Argon2id: ${u.correo} (${u.rol})`);
    } else {
      user.clave = u.clave;
      await user.save();
      console.log(`Usuario actualizado con Argon2id: ${u.correo} (${u.rol})`);
    }
  }

  const all = await Usuario.find().select('+clave');
  console.log('\n--- ESTADO DE USUARIOS Y CIFRADO EN BD ---');
  for (const usr of all) {
    console.log(`Correo: ${usr.correo} | Rol: ${usr.rol}`);
    console.log(`Hash (${usr.clave.startsWith('$argon2') ? 'ARGON2ID OK' : 'BCRYPT'}): ${usr.clave.substring(0, 35)}...`);
  }

  process.exit(0);
}

migrateUsers().catch(err => {
  console.error(err);
  process.exit(1);
});
