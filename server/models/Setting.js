const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    notifications: {
      whatsapp: { type: Boolean, default: false },
      sms: { type: Boolean, default: false },
      email: { type: Boolean, default: true },
    },
    whatsappBusinessNumber: { type: String, trim: true, default: '' },
    apiKey: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Setting', settingSchema);
