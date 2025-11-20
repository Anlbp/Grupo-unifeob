const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // LOGIN (mantido como estava)
  login: async (cpf, senha) => {
    const res = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpf, senha })
    });
    return res.json();
  },

  // CADASTRO DE USUÁRIO (mantido como estava)
  createUser: async ({ nome, cpf, senha, role, username }) => {
    const res = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, cpf, senha, role, username })
    });
    return res.json();
  },

  // 🔹 ESCOLHER AVATAR (usa IPC para abrir o diálogo de arquivo)
  chooseAvatar: () => {
    return ipcRenderer.invoke('choose-avatar');
  },

  // 🔹 (OPCIONAL) ALTERAR SENHA – adapte a rota se precisar
  changePassword: async (cpf, idUser, novaSenha) => {
    const res = await fetch('http://localhost:3000/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpf, idUser, novaSenha })
    });
    return res.json();
  }
});
