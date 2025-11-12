// --- Fallback para quando o preload.js não é carregado ---
if (typeof window.api === 'undefined') {
  console.warn('[AVISO] preload não carregado — ativando fallback');

  const { ipcRenderer } = require('electron');

  window.api = {
    login: (username, password) =>
      ipcRenderer.invoke('auth:login', { username, password }),
    getUserData: (token) =>
      ipcRenderer.invoke('auth:getUser', { token }),
    getAdminData: (token) =>
      ipcRenderer.invoke('auth:getAdmin', { token })
  };
}

// API URL
const API_URL = 'http://localhost:3000/api';

// Função para obter o token do localStorage
function getToken() {
    return localStorage.getItem('token');
}

// Função para obter o nome do vendedor
function getVendorName() {
    return localStorage.getItem('vendorName');
}

// Função para verificar se o usuário está autenticado
function isAuthenticated() {
    return !!getToken();
}

// Função para obter o header de autenticação
function getAuthHeader() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    };
}
console.log('[FRONT] auth.ipc.js carregado');

// Função para fazer login
async function login(email, senha) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erro ao fazer login');
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('vendorName', data.nome); // Armazena o nome do vendedor
        console.log('Vendedor logado:', data.nome); // Exibe o nome do vendedor no console
        return true;
    } catch (error) {
        console.error('Erro no login:', error);
        alert(error.message);
    }
    console.log('[FRONT] Enviando login via window.api', username, password);

}

// Função para registrar novo usuário
async function register(nome, email, senha, tipo) {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, email, senha, tipo })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.erro || 'Erro ao registrar usuário');
        }

        const data = await response.json();
        alert('Usuário registrado com sucesso! Faça login para continuar.');
        showLoginForm();
        return true;
    } catch (error) {
        console.error('Erro no registro:', error);
        alert(error.message);
    }
}

// Função para fazer logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('vendorName'); // Remove o nome do vendedor ao fazer logout
    window.location.reload();
}

// Função para mostrar o formulário de login
function showLoginForm() {
    document.getElementById('loginCard').style.display = 'block';
    document.getElementById('registerCard').style.display = 'none';
}

// Função para mostrar o formulário de registro
function showRegisterForm() {
    document.getElementById('loginCard').style.display = 'none';
    document.getElementById('registerCard').style.display = 'block';
}

// Função para requisições autenticadas com tratamento de token expirado/inválido
async function fetchWithAuth(url, options = {}) {
    const headers = getAuthHeader();
    options.headers = { ...options.headers, ...headers };

    const response = await fetch(url, options);

    if (response.status === 401 || response.status === 403) {
        // Token inválido ou expirado: faz logout automático
        logout();
        return;
    }

    return response;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');
    const btnLogout = document.getElementById('btnLogout');

    // Verificar autenticação ao carregar a página
    if (isAuthenticated()) {
        document.getElementById('authArea').style.display = 'none';
        document.getElementById('mainArea').style.display = 'block';
    }

    // Login form submit
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;

        try {
            await login(email, senha);
            document.getElementById('authArea').style.display = 'none';
            document.getElementById('mainArea').style.display = 'block';
            window.location.reload();
        } catch (error) {
            alert(error.message);
        }
    });

    // Register form submit
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('emailRegistro').value;
        const senha = document.getElementById('senhaRegistro').value;
        const tipo = document.getElementById('tipo').value;

        try {
            await register(nome, email, senha, tipo);
        } catch (error) {
            alert(error.message);
        }
    });

    // Switch to register form
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        showRegisterForm();
    });

    // Switch to login form
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        showLoginForm();
    });

    // Logout button
    btnLogout.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });

    // Exibe o nome do vendedor no console se estiver logado
    if (isAuthenticated()) {
        console.log('Vendedor logado:', getVendorName());
    }
}); 