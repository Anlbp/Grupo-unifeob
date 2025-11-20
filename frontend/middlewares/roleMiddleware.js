// Role-based authorization middleware generator
// Usage: const requireRole = require('./roleMiddleware');
// app.get('/admin', authMiddleware, requireRole('admin'), handler);
module.exports = function(requiredRole) {
  return function(req, res, next) {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
    if (req.user.role !== requiredRole) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
};