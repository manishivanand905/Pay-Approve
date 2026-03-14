const Setting = require('../models/Setting');
const asyncHandler = require('../utils/asyncHandler');

const DEFAULT_SETTINGS = {
  notifications: { whatsapp: false, sms: false, email: true },
  whatsappBusinessNumber: '',
  apiKey: '',
};

const getOrCreateSettings = async () => {
  let settings = await Setting.findOne();
  if (!settings) settings = await Setting.create(DEFAULT_SETTINGS);
  return settings;
};

const getSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();
  res.json({ success: true, data: settings });
});

const updateSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();
  const current = typeof settings.notifications?.toObject === 'function'
    ? settings.notifications.toObject()
    : settings.notifications;
  settings.notifications = { ...current, ...(req.body.notifications || {}) };
  settings.whatsappBusinessNumber = req.body.whatsappBusinessNumber ?? settings.whatsappBusinessNumber;
  settings.apiKey = req.body.apiKey ?? settings.apiKey;
  const updated = await settings.save();
  res.json({ success: true, data: updated });
});

module.exports = { getSettings, updateSettings };
