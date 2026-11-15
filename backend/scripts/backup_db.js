/**
 * Script de Respaldo y Exportación de Base de Datos NoSQL (MongoDB)
 * Cumple con el requerimiento 5.7 y Entregable 3 de la rúbrica UCSC.
 * 
 * Uso: node scripts/backup_db.js
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const backupDir = path.join(__dirname, '..', 'backups');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

async function exportarColecciones() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pc_nfactory_db';
  console.log(`[Backup NoSQL] Conectando a ${uri}...`);
  await mongoose.connect(uri);

  const colecciones = await mongoose.connection.db.listCollections().toArray();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFolder = path.join(backupDir, `backup_${timestamp}`);
  fs.mkdirSync(backupFolder, { recursive: true });

  console.log(`[Backup NoSQL] Exportando ${colecciones.length} colecciones hacia: ${backupFolder}`);

  let totalDocs = 0;
  for (const col of colecciones) {
    const nombre = col.name;
    const documentos = await mongoose.connection.db.collection(nombre).find().toArray();
    const filePath = path.join(backupFolder, `${nombre}.json`);
    fs.writeFileSync(filePath, JSON.stringify(documentos, null, 2), 'utf-8');
    console.log(`  ✓ Colección [${nombre}]: ${documentos.length} documentos exportados.`);
    totalDocs += documentos.length;
  }

  console.log(`\n✅ Respaldo completado exitosamente: ${totalDocs} documentos guardados en formato JSON.`);
  console.log(`Ubicación: ${backupFolder}`);
  process.exit(0);
}

exportarColecciones().catch(err => {
  console.error('[Error en Respaldo]:', err.message);
  process.exit(1);
});
