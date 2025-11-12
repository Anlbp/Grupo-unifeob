// ========================================================
// PRELOAD OFICIAL - Ponte segura entre o Renderer (frontend)
// e o Processo Principal (main.js) via IPC
// ========================================================
const { contextBridge, ipcRenderer } = require('electron');

// Expõe funções seguras no escopo global (window.api)
contextBridge.exposeInMainWorld('api', {
  // 🔹 LOGIN (agora envia CPF, compatível com backend)
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
  }
});

// ========================================================
// Log para confirmar que o preload foi carregado
// ========================================================
console.log('[Preload] auth.ipc.js carregado e bridge criada.');
