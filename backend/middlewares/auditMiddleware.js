const db = require('../database/connection');

/**
 * Middleware de auditoria que registra todas as ações dos usuários no banco de dados
 */
async function auditMiddleware(req, res, next) {
  // Capturar informações da requisição antes de processar
  const originalSend = res.json;
  const originalStatus = res.status;
  let responseStatus = 200;
  let responseBody = null;

  // Interceptar a resposta para capturar status e body
  res.status = function(code) {
    responseStatus = code;
    return originalStatus.call(this, code);
  };

  res.json = function(body) {
    responseBody = body;
    return originalSend.call(this, body);
  };

  // Continuar com a requisição
  next();

  // Registrar após a resposta ser enviada (não bloquear a resposta)
  setImmediate(async () => {
    try {
      // Extrair informações da ação baseado na rota e método
      const method = req.method;
      const endpoint = req.originalUrl || req.path;
      
      // Ignorar rotas de login e algumas rotas que não precisam de auditoria
      if (endpoint.includes('/login') || endpoint.includes('/register') || endpoint === '/') {
        return;
      }

      // Se não houver usuário autenticado, não registrar (pode ser rota pública)
      if (!req.user) {
        return;
      }

      // Determinar ação e recurso baseado na rota
      let action = method;
      let resource = 'unknown';
      let resourceId = null;

      // Extrair recurso e ID da rota
      const routeParts = endpoint.split('/').filter(p => p);
      if (routeParts.length >= 2 && routeParts[0] === 'api' && routeParts[1] === 'dados') {
        resource = routeParts[2] || 'unknown';
        resourceId = routeParts[3] ? parseInt(routeParts[3]) || null : null;
      }

      // Mapear métodos HTTP para ações mais descritivas
      const actionMap = {
        'GET': 'Consultar',
        'POST': 'Adicionar',
        'PUT': 'Editar',
        'DELETE': 'Remover',
        'PATCH': 'Atualizar'
      };
      action = actionMap[method] || method;

      // Capturar informações do usuário
      const usuarioId = req.user?.id || null;
      const username = req.user?.username || req.user?.nome || null;
      const ipAddress = req.ip || req.connection?.remoteAddress || null;
      const userAgent = req.get('user-agent') || null;
      
      // Capturar body da requisição (limitado a 1000 caracteres)
      let requestBody = null;
      if (req.body && Object.keys(req.body).length > 0) {
        try {
          requestBody = JSON.stringify(req.body).substring(0, 1000);
        } catch (e) {
          requestBody = null;
        }
      }

      // Capturar mensagem de erro se houver
      let errorMessage = null;
      if (responseStatus >= 400 && responseBody && responseBody.message) {
        errorMessage = responseBody.message.substring(0, 500);
      }

      // Inserir no banco de dados
      await db.promise().query(
        `INSERT INTO audit_logs 
         (usuario_id, username, action, resource, resource_id, method, endpoint, ip_address, user_agent, request_body, response_status, error_message)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          usuarioId,
          username,
          action,
          resource,
          resourceId,
          method,
          endpoint,
          ipAddress,
          userAgent,
          requestBody,
          responseStatus,
          errorMessage
        ]
      );
    } catch (err) {
      // Não bloquear a aplicação se houver erro no log
      console.error('Erro ao registrar auditoria:', err);
    }
  });
}

module.exports = auditMiddleware;

