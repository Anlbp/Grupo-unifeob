Nenhum arquivo de servidor foi detectado automaticamente.
    Adicione os três middlewares em seu projeto:
      - middlewares/authMiddleware.js
      - middlewares/roleMiddleware.js
      - middlewares/activityLogger.js

    Em seu arquivo de servidor (por exemplo server.js / app.js), importe e use:
      const authMiddleware = require('./middlewares/authMiddleware');
      const requireRole = require('./middlewares/roleMiddleware');
      const activityLogger = require('./middlewares/activityLogger');

    Exemplo:
      const express = require('express');
      const app = express();
      app.use(activityLogger); // logs all requests
      app.get('/protected', authMiddleware, (req, res) => res.json({ok:true}));
      app.get('/admin', authMiddleware, requireRole('admin'), (req,res)=>res.json({admin:true}));
    Tokens demo: 'token-user' and 'token-admin'