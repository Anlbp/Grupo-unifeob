const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

// 🔹 Rota geral — acessível a qualquer usuário logado
router.get('/', authMiddleware, (req, res) => {
  res.json({
    ok: true,
    message: `Bem-vindo, ${req.user.nome}!`,
    role: req.user.tipo
  });
});

// 🔹 Rota só para administradores
router.get('/admin', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ ok: false, message: 'Acesso negado. Apenas administradores.' });
  }
  res.json({ ok: true, message: 'Bem-vindo à área de administrador!' });
});

// 🔹 Rota só para gerentes
router.get('/gerente', authMiddleware, (req, res) => {
  if (req.user.tipo !== 'gerente') {
    return res.status(403).json({ ok: false, message: 'Acesso negado. Apenas gerentes.' });
  }
  res.json({ ok: true, message: 'Bem-vindo à área de gerente!' });
});

// 🔹 Rota só para vendedores
router.get('/vendedor', authMiddleware, (req, res) => {
  if (req.user.tipo !== 'vendedor') {
    return res.status(403).json({ ok: false, message: 'Acesso negado. Apenas vendedores.' });
  }
  res.json({ ok: true, message: 'Bem-vindo à área de vendedor!' });
});

module.exports = router;
