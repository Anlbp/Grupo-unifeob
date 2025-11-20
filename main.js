// ========================================================
// main.js — Configuração principal do Electron
// ========================================================

const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const axios = require('axios');

// ========================================================
// Função que cria a janela principal
// ========================================================
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'frontend', 'electronfront', 'frontEnd', 'app', 'js', 'auth.ipc.js')
    }
  });

    // Maximiza a janela (sem ser fullscreen)
  mainWindow.maximize();

  // Carrega o arquivo HTML do frontend (tela de login)
  mainWindow.loadFile(
    path.join(__dirname, 'frontend', 'electronfront', 'frontEnd', 'app', 'index.html')
  );

  // Fecha a aplicação ao encerrar a janela
  mainWindow.on('closed', () => {
    app.quit();
  });
}

// ========================================================
// Inicialização do Electron
// ========================================================
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// ========================================================
// IPC: Autenticação com o backend (Express)
// ========================================================

// 🔹 LOGIN (autenticação via CPF e senha)
ipcMain.handle('auth:login', async (event, { cpf, password }) => {
  try {
    const res = await axios.post('http://localhost:3000/login', { cpf, password });
    return res.data;
  } catch (err) {
    console.error('[IPC] Erro no login:', err.message);
    return { ok: false, message: 'Erro ao conectar com o sistema.' };
  }
});


// 🔹 BUSCAR DADOS DE USUÁRIO (rota protegida)
ipcMain.handle('auth:getUser', async (event, { token }) => {
  try {
    const res = await axios.get('http://localhost:3000/protected', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (err) {
    console.error('[IPC] Erro ao buscar usuário:', err.message);
    return { ok: false, message: 'Falha ao buscar dados de usuário.' };
  }
});

// 🔹 CRIAR USUÁRIO (apenas admin)
ipcMain.handle('auth:createUser', async (event, { nome, cpf, senha, role, username, token }) => {
  try {
    const res = await axios.post('http://localhost:3000/register', { nome, cpf, senha, role, username }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('[IPC] Usuário criado:', res.data);
    return res.data;
  } catch (err) {
    console.error('[IPC] Erro ao criar usuário:', err.message);
    return { ok: false, message: err.response?.data?.message || 'Erro ao criar usuário.' };
  }
});

// ========================================================
// IPC: Dados do sistema (Clientes, Produtos, Vendas)
// ========================================================

ipcMain.handle('data:getClientes', async (event, token) => {
  try {
    const res = await axios.get('http://localhost:3000/api/dados/clientes', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (err) {
    console.error('[IPC] Erro ao buscar clientes:', err.message);
    return [];
  }
});

ipcMain.handle('data:getProdutos', async (event, token) => {
  try {
    const res = await axios.get('http://localhost:3000/api/dados/produtos', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (err) {
    console.error('[IPC] Erro ao buscar produtos:', err.message);
    return [];
  }
});

ipcMain.handle('data:getVendas', async (event, token) => {
  try {
    const res = await axios.get('http://localhost:3000/api/dados/vendas', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (err) {
    console.error('[IPC] Erro ao buscar vendas:', err.message);
    return [];
  }
});

// ========================================================
// IPC: Utilitários (Avatar, etc.)
// ========================================================

// 🔹 ESCOLHER IMAGEM DO AVATAR
ipcMain.handle('choose-avatar', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Imagens', extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp'] }
    ]
  });
  return result; // { canceled, filePaths }
});