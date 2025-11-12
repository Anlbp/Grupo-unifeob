// ========================================================
// main.js — Configuração principal do Electron
// ========================================================

const { app, BrowserWindow, ipcMain } = require('electron');
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
// IPC: Comunicação entre o Front (preload) e o Backend (Express)
// ========================================================

// 🔹 LOGIN (autenticação via CPF e senha)
ipcMain.handle('auth:login', async (event, { cpf, password }) => {
  try {
    const res = await axios.post('http://localhost:3000/login', { cpf, password });
    console.log('[IPC] Login OK:', res.data);
    return res.data;
  } catch (err) {
    console.error('[IPC] Erro no login:', err.message);
    return { ok: false, message: 'Erro ao conectar com o sistema.' };
  }
});

// 🔹 BUSCAR DADOS DE USUÁRIO (rota protegida /api)
ipcMain.handle('auth:getUser', async (event, { token }) => {
  try {
    const res = await axios.get('http://localhost:3000/api', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('[IPC] Dados de usuário obtidos');
    return res.data;
  } catch (err) {
    console.error('[IPC] Erro ao buscar usuário:', err.message);
    return { ok: false, message: 'Falha ao buscar dados de usuário.' };
  }
});

// 🔹 BUSCAR DADOS DE ADMIN (rota protegida /api/dados)
ipcMain.handle('auth:getAdmin', async (event, { token }) => {
  try {
    const res = await axios.get('http://localhost:3000/api/dados', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('[IPC] Dados de admin obtidos');
    return res.data;
  } catch (err) {
    console.error('[IPC] Erro ao buscar admin:', err.message);
    return { ok: false, message: 'Falha ao buscar dados do admin.' };
  }
});
