const express = require('express');
const router = express.Router();

const db = require('../database/connection');
const authMiddleware = require('../middlewares/authMiddleware');
const auditMiddleware = require('../middlewares/auditMiddleware');

const DEFAULT_MARGIN = Number(process.env.LUCRO_PERCENTUAL || 0.25);

const formatNumber = (value) => Number(value || 0);

router.get('/metrics', authMiddleware, auditMiddleware, async (_req, res) => {
  try {
    const connection = db.promise();

    const [[clientesRow]] = await connection.query(
      'SELECT COUNT(*) AS totalClientes FROM clientes'
    );

    const [[vendasRow]] = await connection.query(
      'SELECT COUNT(*) AS totalVendas, COALESCE(SUM(total), 0) AS faturamento FROM vendas'
    );

    const [historicoRows] = await connection.query(
      `SELECT 
        DATE_FORMAT(COALESCE(v.data_compra, DATE(v.created_at)), '%Y-%m') AS mes,
        COALESCE(SUM(v.total), 0) AS faturamento
      FROM vendas v
      GROUP BY mes
      ORDER BY mes DESC
      LIMIT 6`
    );

    const margem = DEFAULT_MARGIN >= 0 && DEFAULT_MARGIN <= 1 ? DEFAULT_MARGIN : 0.25;
    const faturamento = formatNumber(vendasRow.faturamento);
    const lucro = Number((faturamento * margem).toFixed(2));

    const lucroHistorico = historicoRows
      .map((row) => {
        const faturamentoMensal = formatNumber(row.faturamento);
        return {
          mes: row.mes,
          faturamento: faturamentoMensal,
          lucro: Number((faturamentoMensal * margem).toFixed(2))
        };
      })
      .reverse();

    return res.json({
      ok: true,
      data: {
        totalClientes: formatNumber(clientesRow.totalClientes),
        totalVendas: formatNumber(vendasRow.totalVendas),
        faturamento,
        margemLucro: margem,
        lucro,
        lucroHistorico
      }
    });
  } catch (err) {
    console.error('Erro ao calcular métricas do dashboard:', err);
    return res.status(500).json({
      ok: false,
      message: 'Erro ao calcular métricas do dashboard.'
    });
  }
});

module.exports = router;

