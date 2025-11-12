module.exports = function(requiredRoles = []) {
  return (req, res, next) => {
    const userRole = req.user?.role;
    if (!userRole) {
      return res.status(403).json({ message: 'Função de usuário ausente.' });
    }
    if (!requiredRoles.includes(userRole)) {
      return res.status(403).json({ message: 'Acesso negado: permissão insuficiente.' });
    }
    next();
  };
};
