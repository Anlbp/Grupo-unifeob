const fs = require('fs');
const path = require('path');
const logFile = path.join(process.cwd(), 'activity.log');

// Middleware to log user actions: method, path, user id, role, timestamp
module.exports = function(req, res, next) {
  const user = req.user ? `${req.user.id}:${req.user.role}` : 'anonymous';
  const entry = {
    ts: new Date().toISOString(),
    user,
    method: req.method,
    path: req.originalUrl,
    ip: req.ip || req.connection.remoteAddress
  };
  try {
    fs.appendFileSync(logFile, JSON.stringify(entry) + '\\n');
  } catch (e) {
    console.error('Failed to write activity log', e);
  }
  next();
};