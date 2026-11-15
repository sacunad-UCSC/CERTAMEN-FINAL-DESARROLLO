const mongoose = require('mongoose');

const registroAuditoriaSchema = new mongoose.Schema(
  {
    accion: {
      type: String,
      required: true,
      enum: ['INGRESO_EXITOSO', 'INGRESO_FALLIDO', 'PRODUCTO_CREADO', 'PRODUCTO_ELIMINADO', 'ESTADO_PEDIDO_ACTUALIZADO', 'ROL_MODIFICADO'],
    },
    realizadoPor: {
      usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
      correo: { type: String },
      rol: { type: String },
    },
    direccionIp: {
      type: String,
      default: '',
    },
    agenteUsuario: {
      type: String,
      default: '',
    },
    detalles: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
    collection: 'registros_auditoria',
  }
);

registroAuditoriaSchema.index({ createdAt: -1 });

module.exports = mongoose.model('RegistroAuditoria', registroAuditoriaSchema);
