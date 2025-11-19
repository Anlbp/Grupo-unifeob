// ========================================================
// PRELOAD OFICIAL - Ponte segura entre Renderer e Main
// ========================================================
const { contextBridge, ipcRenderer } = require('electron');

// Expõe funções seguras no escopo global (window.api)
contextBridge.exposeInMainWorld('api', {

  // 🔹 LOGIN (compatível com backend)
  login: async (cpf, password) => {
    try {
      const res = await ipcRenderer.invoke('auth:login', { cpf, password });
      return res;
    } catch (err) {
      console.error('[Preload] Erro no login IPC:', err);
      return { ok: false, message: 'Erro ao conectar com o sistema.' };
    }
  },

  // 🔹 Buscar dados do usuário
  getUserData: async (token) => {
    try {
      const res = await ipcRenderer.invoke('auth:getUser', { token });
      return res;
    } catch (err) {
      console.error('[Preload] Erro em getUserData:', err);
      return { ok: false, message: 'Erro ao buscar dados do usuário.' };
    }
  },

  // 🔹 Buscar dados do admin
  getAdminData: async (token) => {
    try {
      const res = await ipcRenderer.invoke('auth:getAdmin', { token });
      return res;
    } catch (err) {
      console.error('[Preload] Erro em getAdminData:', err);
      return { ok: false, message: 'Erro ao buscar dados do admin.' };
    }
  },
    // 🔹 Buscar dados do sistema
  getClientes: async (token) => {
    try {
      return await ipcRenderer.invoke('data:getClientes', token);
    } catch (err) {
      console.error('[Preload] Erro em getClientes:', err);
      return [];
    }
  },

  getProdutos: async (token) => {
    try {
      return await ipcRenderer.invoke('data:getProdutos', token);
    } catch (err) {
      console.error('[Preload] Erro em getProdutos:', err);
      return [];
    }
  },

  getVendas: async (token) => {
    try {
      return await ipcRenderer.invoke('data:getVendas', token);
    } catch (err) {
      console.error('[Preload] Erro em getVendas:', err);
      return [];
    }
  },
    // 🔹 Escolher imagem do avatar
  chooseAvatar: async () => {
    try {
      return await ipcRenderer.invoke('choose-avatar');
    } catch (err) {
      console.error('[Preload] Erro em chooseAvatar:', err);
      return { canceled: true, filePaths: [] };
    }
  },

  // 🔹 Alterar senha
  changePassword: async (cpf, idUser, novaSenha) => {
    try {
      return await ipcRenderer.invoke('auth:changePassword', { cpf, idUser, novaSenha });
    } catch (err) {
      console.error('[Preload] Erro em changePassword:', err);
      return { ok: false, message: 'Erro ao alterar senha.' };
    }
  },

  // 🔹 Criar usuário (apenas admin)
  createUser: async ({ nome, cpf, senha, tipo, token }) => {
    try {
      return await ipcRenderer.invoke('auth:createUser', { nome, cpf, senha, tipo, token });
    } catch (err) {
      console.error('[Preload] Erro em createUser:', err);
      return { ok: false, message: 'Erro ao criar usuário.' };
    }
  }
});

// Log para confirmar carregamento
console.log('[Preload] auth.ipc.js carregado e bridge criada.');