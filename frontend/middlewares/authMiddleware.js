// Simple authentication middleware
// Checks for Authorization: Bearer <token>
// For demo purposes, accepts tokens: "token-user", "token-admin"
// Attaches req.user = { id, role }
module.exports = function(req, res, next) {
  const auth = req.headers['authorization'] || '';
  const m = auth.match(/^Bearer (.+)$/);
  if (!m) return res.status(401).json({ error: 'No token provided' });
  const token = m[1];
  if (token === 'token-user') {
    req.user = { id: 'user-1', role: 'user' };
  } else if (token === 'token-admin') {
    req.user = { id: 'admin-1', role: 'admin' };
  } else {
    return res.status(401).json({ error: 'Invalid token' });
  }
  next();
};