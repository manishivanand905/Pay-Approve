const getHealth = (req, res) => {
  res.json({
    success: true,
    service: 'payapprove-server',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
};

module.exports = { getHealth };
