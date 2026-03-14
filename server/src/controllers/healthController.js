const getHealth = (req, res) => {
  res.json({
    success: true,
    service: "pay-build-server",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
};

module.exports = {
  getHealth,
};
