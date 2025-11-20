const express = require('express');
const router = express.Router();
const db = require('../database/connection');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const requireRoles = (roles) => roleMiddleware(Array.isArray(roles) ? roles : [roles]);

const respondWithError = (res, err, message) => {
  console.error(message, err);
  return res.status(500).json({ ok: false, message });
};

const BASE_VENDA_SELECT = `
  SELECT
    v.id,
    v.cliente_id,
    c.nome AS cliente,
    v.usuario_id,
    u.nome AS vendedor,
    v.total,
    v.status,
    v.observacoes,
    v.forma_pagamento,
    v.data_compra,
    v.data_entrega,
    v.created_at,
    v.updated_at
  FROM vendas v
  JOIN clientes c ON v.cliente_id = c.id
  JOIN usuarios u ON v.usuario_id = u.id
`;

// ====================== CLIENTES ======================

router.get('/clientes', authMiddleware, async (_req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT id, nome, cpf, cnpj, email, telefone, endereco, cidade, estado, cep, created_at, updated_at
      FROM clientes
      ORDER BY created_at DESC
    `);
    res.json({ ok: true, data: rows });
  } catch (err) {
    respondWithError(res, err, 'Erro ao listar clientes');
  }
});

router.get('/clientes/:id', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT id, nome, cpf, cnpj, email, telefone, endereco, cidade, estado, cep
       FROM clientes
       WHERE id = ?`,
      [req.params.id]
    );
    if (!rows.length) {
      return res.status(404).json({ ok: false, message: 'Cliente não encontrado.' });
  }
    res.json({ ok: true, data: rows[0] });
  } catch (err) {
    respondWithError(res, err, 'Erro ao buscar cliente');
  }
});

router.post('/clientes', authMiddleware, requireRoles(['admin']), async (req, res) => {
  const { nome, cpf, cnpj, email, telefone, endereco, cidade, estado, cep } = req.body;
  if (!nome) {
    return res.status(400).json({ ok: false, message: 'Nome do cliente é obrigatório.' });
  }

  try {
    const [result] = await db.promise().query(
      `INSERT INTO clientes (nome, cpf, cnpj, email, telefone, endereco, cidade, estado, cep)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nome, cpf || null, cnpj || null, email || null, telefone || null, endereco || null, cidade || null, estado || null, cep || null]
    );
    res.status(201).json({ ok: true, message: 'Cliente cadastrado com sucesso!', data: { id: result.insertId } });
  } catch (err) {
    respondWithError(res, err, 'Erro ao cadastrar cliente');
  }
});

router.put('/clientes/:id', authMiddleware, requireRoles(['admin', 'gerente']), async (req, res) => {
  const { nome, cpf, cnpj, email, telefone, endereco, cidade, estado, cep } = req.body;

  const fields = [];
  const values = [];
  const payload = { nome, cpf, cnpj, email, telefone, endereco, cidade, estado, cep };

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined) {
      fields.push(`${key} = ?`);
      values.push(value || null);
    }
  });

  if (!fields.length) {
    return res.status(400).json({ ok: false, message: 'Nenhuma alteração informada para o cliente.' });
  }

  try {
    const [result] = await db.promise().query(
      `UPDATE clientes
       SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [...values, req.params.id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ ok: false, message: 'Cliente não encontrado.' });
    }

    res.json({ ok: true, message: 'Cliente atualizado com sucesso!' });
  } catch (err) {
    respondWithError(res, err, 'Erro ao atualizar cliente');
  }
});

router.delete('/clientes/:id', authMiddleware, requireRoles(['admin']), async (req, res) => {
  try {
    const [result] = await db.promise().query('DELETE FROM clientes WHERE id = ?', [req.params.id]);
    if (!result.affectedRows) {
      return res.status(404).json({ ok: false, message: 'Cliente não encontrado.' });
    }
    res.json({ ok: true, message: 'Cliente removido com sucesso!' });
  } catch (err) {
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({
        ok: false,
        message: 'Não é possível remover o cliente porque existem vendas associadas.'
      });
    }
    respondWithError(res, err, 'Erro ao remover cliente');
  }
});

// ====================== PRODUTOS ======================

router.get('/produtos', authMiddleware, async (_req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT id, nome, categoria, preco, descricao, estoque, created_at, updated_at
      FROM produtos
      ORDER BY created_at DESC
    `);
    res.json({ ok: true, data: rows });
  } catch (err) {
    respondWithError(res, err, 'Erro ao listar produtos');
  }
});

router.get('/produtos/:id', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT id, nome, categoria, preco, descricao, estoque
       FROM produtos
       WHERE id = ?`,
      [req.params.id]
    );
    if (!rows.length) {
      return res.status(404).json({ ok: false, message: 'Produto não encontrado.' });
    }
    res.json({ ok: true, data: rows[0] });
  } catch (err) {
    respondWithError(res, err, 'Erro ao buscar produto');
  }
});

router.post('/produtos', authMiddleware, requireRoles(['admin']), async (req, res) => {
  const { nome, categoria, preco, descricao, estoque } = req.body;
  if (!nome || !categoria || preco === undefined) {
    return res.status(400).json({ ok: false, message: 'Nome, categoria e preço são obrigatórios.' });
  }

  try {
    const [result] = await db.promise().query(
      `INSERT INTO produtos (nome, categoria, preco, descricao, estoque)
       VALUES (?, ?, ?, ?, ?)`,
      [nome, categoria, preco, descricao || null, estoque ?? 0]
    );
    res.status(201).json({ ok: true, message: 'Produto criado com sucesso!', data: { id: result.insertId } });
  } catch (err) {
    respondWithError(res, err, 'Erro ao criar produto');
  }
});

router.put('/produtos/:id', authMiddleware, requireRoles(['admin', 'gerente']), async (req, res) => {
  const { nome, categoria, preco, descricao, estoque } = req.body;

  const fields = [];
  const values = [];
  const payload = { nome, categoria, preco, descricao, estoque };

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined) {
      fields.push(`${key} = ?`);
      if (key === 'descricao') {
        values.push(value || null);
      } else if (key === 'estoque') {
        values.push(value ?? 0);
      } else {
        values.push(value);
      }
    }
  });

  if (!fields.length) {
    return res.status(400).json({ ok: false, message: 'Nenhuma alteração informada para o produto.' });
  }

  try {
    const [result] = await db.promise().query(
      `UPDATE produtos
       SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [...values, req.params.id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ ok: false, message: 'Produto não encontrado.' });
    }

    res.json({ ok: true, message: 'Produto atualizado com sucesso!' });
  } catch (err) {
    respondWithError(res, err, 'Erro ao atualizar produto');
  }
});

router.delete('/produtos/:id', authMiddleware, requireRoles(['admin']), async (req, res) => {
  try {
    const [result] = await db.promise().query('DELETE FROM produtos WHERE id = ?', [req.params.id]);
    if (!result.affectedRows) {
      return res.status(404).json({ ok: false, message: 'Produto não encontrado.' });
    }
    res.json({ ok: true, message: 'Produto removido com sucesso!' });
  } catch (err) {
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({
        ok: false,
        message: 'Não é possível remover o produto porque existem itens de venda associados.'
      });
    }
    respondWithError(res, err, 'Erro ao remover produto');
  }
});

// ====================== VENDAS ======================

const canCreateVenda = (role) => ['admin', 'gerente', 'vendedor'].includes(role);
const canUpdateVenda = (role) => ['admin', 'gerente'].includes(role);
const canViewVendas = (role) => ['admin', 'gerente', 'vendedor'].includes(role);

router.get('/vendas', authMiddleware, async (req, res) => {
  if (!canViewVendas(req.user.role)) {
    return res.status(403).json({ ok: false, message: 'Acesso negado para visualizar vendas.' });
  }
  try {
    let query = `${BASE_VENDA_SELECT} ORDER BY v.created_at DESC`;
    let params = [];
    if (req.user.role === 'vendedor') {
      query = `${BASE_VENDA_SELECT} WHERE v.usuario_id = ? ORDER BY v.created_at DESC`;
      params = [req.user.id];
    }
    const [rows] = await db.promise().query(query, params);
    res.json({ ok: true, data: rows });
  } catch (err) {
    respondWithError(res, err, 'Erro ao listar vendas');
  }
});

router.get('/vendas/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role === 'vendedor' && req.user.id !== undefined) {
      const [[vendaCheck]] = await db.promise().query('SELECT usuario_id FROM vendas WHERE id = ?', [req.params.id]);
      if (!vendaCheck) {
        return res.status(404).json({ ok: false, message: 'Venda não encontrada.' });
      }
      if (vendaCheck.usuario_id !== req.user.id) {
        return res.status(403).json({ ok: false, message: 'Acesso negado para esta venda.' });
      }
    }

    const [[venda]] = await db.promise().query(`${BASE_VENDA_SELECT} WHERE v.id = ?`, [req.params.id]);
    if (!venda) {
      return res.status(404).json({ ok: false, message: 'Venda não encontrada.' });
    }

    const [itens] = await db.promise().query(
      `SELECT iv.id, iv.produto_id, p.nome AS produto_nome, iv.quantidade, iv.preco_unitario, iv.subtotal, iv.created_at
       FROM itens_venda iv
       JOIN produtos p ON iv.produto_id = p.id
       WHERE iv.venda_id = ?`,
      [req.params.id]
    );

    res.json({ ok: true, data: { ...venda, itens } });
  } catch (err) {
    respondWithError(res, err, 'Erro ao buscar venda');
  }
});

router.post('/vendas', authMiddleware, async (req, res) => {
  if (!canCreateVenda(req.user.role)) {
    return res.status(403).json({ ok: false, message: 'Acesso negado para criar vendas.' });
  }

  const {
    cliente_id,
    total,
    status = 'pendente',
    observacoes,
    forma_pagamento,
    data_compra,
    data_entrega,
    itens = []
  } = req.body;

  if (!cliente_id || total === undefined) {
    return res.status(400).json({ ok: false, message: 'Cliente e valor total são obrigatórios.' });
  }

  const connection = db.promise();
  const compraDate = data_compra || new Date().toISOString().split('T')[0];

  try {
    const [[clienteExiste]] = await connection.query('SELECT id FROM clientes WHERE id = ?', [cliente_id]);
    if (!clienteExiste) {
      return res.status(400).json({ ok: false, message: 'Cliente informado não existe.' });
    }

    await connection.beginTransaction();

    const [vendaResult] = await connection.query(
      `INSERT INTO vendas (cliente_id, usuario_id, total, status, observacoes, forma_pagamento, data_compra, data_entrega)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        cliente_id,
        req.user.id,
        total,
        status,
        observacoes || null,
        forma_pagamento || null,
        compraDate,
        data_entrega || null
      ]
    );

    const vendaId = vendaResult.insertId;
    const itensValidos = Array.isArray(itens)
      ? itens.filter((item) => item && item.produto_id && item.quantidade && item.preco_unitario)
      : [];

    for (const item of itensValidos) {
      const subtotal = item.subtotal ?? Number(item.quantidade) * Number(item.preco_unitario);
      await connection.query(
        `INSERT INTO itens_venda (venda_id, produto_id, quantidade, preco_unitario, subtotal)
         VALUES (?, ?, ?, ?, ?)`,
        [vendaId, item.produto_id, item.quantidade, item.preco_unitario, subtotal]
      );
    }

    await connection.commit();

    const [[novaVenda]] = await connection.query(`${BASE_VENDA_SELECT} WHERE v.id = ?`, [vendaId]);
    res.status(201).json({ ok: true, message: 'Venda criada com sucesso!', data: { ...novaVenda, itens: itensValidos } });
  } catch (err) {
    await connection.rollback();
    respondWithError(res, err, 'Erro ao criar venda');
  }
});

router.put('/vendas/:id', authMiddleware, async (req, res) => {
  if (!canUpdateVenda(req.user.role)) {
    return res.status(403).json({ ok: false, message: 'Apenas administradores ou gerentes podem editar vendas.' });
  }

  const {
    cliente_id,
    total,
    status,
    observacoes,
    forma_pagamento,
    data_compra,
    data_entrega,
    itens
  } = req.body;

  const fields = [];
  const values = [];
  const allFields = { cliente_id, total, status, observacoes, forma_pagamento, data_compra, data_entrega };

  Object.entries(allFields).forEach(([key, value]) => {
    if (value !== undefined) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  });

  const connection = db.promise();

  try {
    await connection.beginTransaction();

    if (fields.length) {
      if (cliente_id !== undefined) {
        const [[clienteExiste]] = await connection.query('SELECT id FROM clientes WHERE id = ?', [cliente_id]);
        if (!clienteExiste) {
          await connection.rollback();
          return res.status(400).json({ ok: false, message: 'Cliente informado não existe.' });
        }
      }

      values.push(req.params.id);
      const [result] = await connection.query(
        `UPDATE vendas SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        values
      );

      if (!result.affectedRows) {
        await connection.rollback();
        return res.status(404).json({ ok: false, message: 'Venda não encontrada.' });
      }
    }

    if (Array.isArray(itens)) {
      await connection.query('DELETE FROM itens_venda WHERE venda_id = ?', [req.params.id]);
      for (const item of itens) {
        if (!item || !item.produto_id || !item.quantidade || !item.preco_unitario) continue;
        const subtotal = item.subtotal ?? Number(item.quantidade) * Number(item.preco_unitario);
        await connection.query(
          `INSERT INTO itens_venda (venda_id, produto_id, quantidade, preco_unitario, subtotal)
           VALUES (?, ?, ?, ?, ?)`,
          [req.params.id, item.produto_id, item.quantidade, item.preco_unitario, subtotal]
        );
      }
    }

    await connection.commit();

    const [[updatedVenda]] = await connection.query(`${BASE_VENDA_SELECT} WHERE v.id = ?`, [req.params.id]);
    res.json({ ok: true, message: 'Venda atualizada com sucesso!', data: updatedVenda });
  } catch (err) {
    await connection.rollback();
    respondWithError(res, err, 'Erro ao atualizar venda');
  }
});

router.delete('/vendas/:id', authMiddleware, requireRoles(['admin']), async (req, res) => {
  try {
    const [result] = await db
      .promise()
      .query('DELETE FROM vendas WHERE id = ?', [req.params.id]);

    if (!result.affectedRows) {
      return res.status(404).json({ ok: false, message: 'Venda não encontrada.' });
    }

    res.json({ ok: true, message: 'Venda removida com sucesso!' });
  } catch (err) {
    respondWithError(res, err, 'Erro ao remover venda');
  }
});

module.exports = router;