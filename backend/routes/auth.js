const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../database/connection');

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
      { id: user.id, nome: user.nome, tipo: user.tipo, cpf: user.cpf },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ ok: true, token, user: { id: user.id, nome: user.nome, tipo: user.tipo, cpf: user.cpf } });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ ok: false, message: 'Erro interno no servidor.' });
  }
});

module.exports = router;
