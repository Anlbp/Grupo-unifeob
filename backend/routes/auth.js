const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../database/connection');
const authMiddleware = require('../middlewares/authMiddleware');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

// 🔹 LOGIN
router.post('/login', async (req, res) => {
  const { cpf, password } = req.body;
  if (!cpf || !password) {
    return res.status(400).json({ ok: false, message: 'CPF e senha são obrigatórios.' });
  }

  try {
    const [rows] = await db.promise().query('SELECT * FROM usuarios WHERE cpf = ?', [cpf]);
    const user = rows[0];

    if (!user) return res.status(401).json({ ok: false, message: 'Usuário não encontrado.' });

    const match = await bcrypt.compare(password, user.senha);
    if (!match) return res.status(401).json({ ok: false, message: 'Senha incorreta.' });

    const token = jwt.sign(
      { id: user.id, nome: user.nome, role: user.role, cpf: user.cpf },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ ok: true, token, user: { id: user.id, nome: user.nome, role: user.role, cpf: user.cpf } });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ ok: false, message: 'Erro interno no servidor.' });
  }
});

// 🔹 REGISTRO DE USUÁRIO (apenas admin pode criar)
router.post('/register', authMiddleware, async (req, res) => {
  const { nome, cpf, senha, role, username } = req.body;

  // Verificar se o usuário logado é admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ ok: false, message: 'Acesso negado. Apenas administradores podem criar usuários.' });
  }

  if (!nome || !cpf || !senha || !role) {
    return res.status(400).json({ ok: false, message: 'Nome, CPF, senha e função são obrigatórios.' });
  }

  // Validar tipo
  const validRoles = ['admin', 'gerente', 'vendedor'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ ok: false, message: 'Função inválida. Deve ser admin, gerente ou vendedor.' });
  }

  try {
    // Verificar se CPF já existe
    const [existing] = await db.promise().query('SELECT id FROM usuarios WHERE cpf = ?', [cpf]);
    if (existing.length > 0) {
      return res.status(400).json({ ok: false, message: 'CPF já cadastrado.' });
    }

    const usernameValue = (username || cpf || nome).trim();
    if (!usernameValue) {
      return res.status(400).json({ ok: false, message: 'Username inválido.' });
    }

    const [existingUsername] = await db.promise().query('SELECT id FROM usuarios WHERE username = ?', [usernameValue]);
    if (existingUsername.length > 0) {
      return res.status(400).json({ ok: false, message: 'Username já está em uso.' });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Inserir usuário
    await db.promise().query(
      'INSERT INTO usuarios (username, nome, cpf, senha, role) VALUES (?, ?, ?, ?, ?)',
      [usernameValue, nome, cpf, hashedPassword, role]
    );

    res.json({ ok: true, message: 'Usuário criado com sucesso!' });
  } catch (err) {
    console.error('Erro no registro:', err);
    res.status(500).json({ ok: false, message: 'Erro interno no servidor.' });
  }
});

module.exports = router;
