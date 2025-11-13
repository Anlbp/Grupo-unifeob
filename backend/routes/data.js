const express = require('express');
const router = express.Router();
const db = require('../database/connection');
const authMiddleware = require('../middlewares/authMiddleware');

// ====================== CLIENTES ======================

// 🔹 Listar todos os clientes
router.get('/clientes', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM clientes');
    res.json({ ok: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: 'Erro ao listar clientes' });
  }
});

// 🔹 Adicionar novo cliente
router.post('/clientes', authMiddleware, async (req, res) => {
  if (req.user.tipo === 'vendedor') {
    return res.status(403).json({ ok: false, message: 'Acesso negado para vendedores' });
  }

  const { nome, endereco, cidade, cpf_cnpj, telefone } = req.body;
  try {
    await db.promise().query(
      'INSERT INTO clientes (nome, endereco, cidade, cpf_cnpj, telefone) VALUES (?, ?, ?, ?, ?)',
      [nome, endereco, cidade, cpf_cnpj, telefone]
    );
    res.json({ ok: true, message: 'Cliente cadastrado com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: 'Erro ao cadastrar cliente' });
  }
});

// ====================== PRODUTOS ======================

// 🔹 Listar todos os produtos
router.get('/produtos', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM produtos');
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, message: 'Erro ao listar produtos' });
  }
});

// 🔹 Adicionar produto (somente gerente ou admin)
router.post('/produtos', authMiddleware, async (req, res) => {
  if (req.user.tipo === 'vendedor') {
    return res.status(403).json({ ok: false, message: 'Apenas gerentes e administradores podem adicionar produtos.' });
  }

  const { nome, tipo, valor } = req.body;
  try {
    await db.promise().query(
      'INSERT INTO produtos (nome, tipo, valor) VALUES (?, ?, ?)',
      [nome, tipo, valor]
    );
    res.json({ ok: true, message: 'Produto adicionado com sucesso!' });
  } catch (err) {
    res.status(500).json({ ok: false, message: 'Erro ao adicionar produto' });
  }
});

// ====================== COMPRAS ======================

// 🔹 Registrar uma compra (vendedores podem)
router.post('/compras', authMiddleware, async (req, res) => {
  const { cliente_id, produto_id, valor, data_compra, forma_pagamento } = req.body;
  try {
    await db.promise().query(
      'INSERT INTO compras (cliente_id, produto_id, valor, data_compra, forma_pagamento) VALUES (?, ?, ?, ?, ?)',
      [cliente_id, produto_id, valor, data_compra, forma_pagamento]
    );
    res.json({ ok: true, message: 'Compra registrada com sucesso!' });
  } catch (err) {
    res.status(500).json({ ok: false, message: 'Erro ao registrar compra' });
  }
});

// 🔹 Listar todas as compras (apenas gerente e admin)
router.get('/compras', authMiddleware, async (req, res) => {
  if (req.user.tipo === 'vendedor') {
    return res.status(403).json({ ok: false, message: 'Apenas gerentes e administradores podem visualizar compras.' });
  }

  try {
    const [rows] = await db.promise().query(
      `SELECT c.id, cli.nome AS cliente, p.nome AS produto, c.valor, c.data_compra, c.forma_pagamento
       FROM compras c
       JOIN clientes cli ON c.cliente_id = cli.id
       JOIN produtos p ON c.produto_id = p.id`
    );
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, message: 'Erro ao listar compras' });
  }
});

module.exports = router;
