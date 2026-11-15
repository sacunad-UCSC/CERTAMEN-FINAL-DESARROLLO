const mongoose = require('mongoose');

const redSocialSchema = new mongoose.Schema(
  {
    plataforma: {
      type: String,
      required: true,
      enum: ['Instagram', 'Facebook', 'LinkedIn', 'TikTok', 'WhatsApp'],
    },
    enlaceUrl: {
      type: String,
      required: true,
      trim: true,
    },
    activa: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: 'redes_sociales',
  }
);

module.exports = mongoose.model('RedSocial', redSocialSchema);
