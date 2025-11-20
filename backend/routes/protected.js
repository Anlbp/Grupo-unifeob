const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const db = require('../database/connection');

// 🔹 Rota geral — acessível a qualquer usuário logado
router.get('/', authMiddleware, (req, res) => {
  res.json({
    ok: true,
    message: `Bem-vindo, ${req.user.nome}!`,
    role: req.user.role
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
  if (req.user.role !== 'gerente') {
    return res.status(403).json({ ok: false, message: 'Acesso negado. Apenas gerentes.' });
  }
  res.json({ ok: true, message: 'Bem-vindo à área de gerente!' });
});

// 🔹 Rota só para vendedores
router.get('/vendedor', authMiddleware, (req, res) => {
  if (req.user.role !== 'vendedor') {
    return res.status(403).json({ ok: false, message: 'Acesso negado. Apenas vendedores.' });
  }
  res.json({ ok: true, message: 'Bem-vindo à área de vendedor!' });
});

// 🔹 Confirmação de admin (revalida a senha antes de ações críticas)
router.post('/admin/confirm', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ ok: false, message: 'Apenas administradores podem confirmar credenciais.' });
  }

  const { cpf, password } = req.body;
  if (!cpf || !password) {
    return res.status(400).json({ ok: false, message: 'CPF e senha são obrigatórios para confirmação.' });
  }

  try {
    const [rows] = await db.promise().query('SELECT senha FROM usuarios WHERE cpf = ?', [cpf]);
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ ok: false, message: 'Usuário não encontrado.' });
    }

    const match = await bcrypt.compare(password, user.senha);
    if (!match) {
      return res.status(401).json({ ok: false, message: 'Senha incorreta.' });
    }

    res.json({ ok: true, message: 'Credenciais confirmadas.' });
  } catch (err) {
    console.error('Erro ao confirmar admin:', err);
    res.status(500).json({ ok: false, message: 'Erro interno ao confirmar credenciais.' });
  }
});

module.exports = router;
