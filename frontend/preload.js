const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
  login: async (cpf, senha) => {
    const res = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpf, senha })
    });
    return res.json();
  },
  // se tiver createUser etc., padronize com CPF também:
  createUser: async ({ nome, cpf, senha, role }) => {
    const res = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, cpf, senha, role })
    });
    return res.json();
  }
});
