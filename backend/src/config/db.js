const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pc_nfactory_db');
    console.log(`[MongoDB] Conectado exitosamente a: ${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB Error] Error de conexión: ${error.message}`);
  }
};

module.exports = connectDB;
