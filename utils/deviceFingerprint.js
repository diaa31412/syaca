const crypto = require('crypto');

module.exports = (req) => {
  const deviceData = {
    userAgent: req.headers['user-agent'] || '',
    ip: req.ip,
    accept: req.headers['accept'] || '',
    language: req.headers['accept-language'] || ''
  };

  return crypto
    .createHash('sha256')
    .update(JSON.stringify(deviceData))
    .digest('hex');
};