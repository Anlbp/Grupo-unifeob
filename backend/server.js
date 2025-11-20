  require('dotenv').config();
  const express = require('express');
  const cors = require('cors');
  const path = require('path');

  const authRoutes = require('./routes/auth');
  const protectedRoutes = require('./routes/protected');
  const dataRoutes = require('./routes/data');
  const authMiddleware = require('./middlewares/authMiddleware');
  const auditMiddleware = require('./middlewares/auditMiddleware');

  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(cors());
  app.use(express.json());

  // Rotas
  app.use('/', authRoutes);            // /register, /login
  app.use('/api', protectedRoutes);    // /api/secret (exemplo)
  // Rotas de dados - o auditMiddleware será aplicado dentro das rotas após authMiddleware
  app.use('/api/dados', dataRoutes);   // CRUD de exemplo

  app.get('/', (req, res) => {
    res.send('Servidor rodando com autenticação por CPF, RBAC e CRUD!');
  });

  app.listen(PORT, () => console.log(`🚀 Backend na porta ${PORT}`));
