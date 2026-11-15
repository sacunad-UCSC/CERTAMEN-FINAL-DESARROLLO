const mongoose = require('mongoose');

const preguntaFrecuenteSchema = new mongoose.Schema(
  {
    categoria: {
      type: String,
      required: true,
      default: 'General',
    },
    pregunta: {
      type: String,
      required: true,
      trim: true,
    },
    palabrasClave: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],
    respuesta: {
      type: String,
      required: true,
    },
    activa: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: 'preguntas_frecuentes',
  }
);

module.exports = mongoose.model('PreguntaFrecuente', preguntaFrecuenteSchema);
