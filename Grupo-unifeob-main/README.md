# Sistema de Gestão - Casa das Portas

Sistema desenvolvido em Node.js, Express, MySQL e Electron.  
Possui autenticação por CPF e senha com controle de acesso baseado em funções (Administrador, Gerente e Vendedor).

## Sobre o Projeto

O sistema permite:
- Cadastro e controle de clientes, produtos e compras.
- Login seguro com senha criptografada (bcrypt).
- Controle de acesso por função (RBAC).
- Interface com modo claro e escuro.
- Backend em Express e frontend em Electron.

## Credenciais de Login

Esses são os logins padrões configurados no banco de dados:

Administrador  
CPF: 11144477735  
Senha: Admin!2025  

Gerente  
CPF: 22255588846  
Senha: Gerente@2025  

Vendedor  
CPF: 33366699957  
Senha: Vendedor#2025  

## Dependências Necessárias

Instale as dependências antes de executar o projeto:

npm install express cors mysql2 dotenv jsonwebtoken bcrypt axios concurrently electron electron-builder nodemon
## Como Executar

1. Crie o banco de dados no MySQL usando o arquivo `sistema_loja.sql`.

2. Configure o arquivo `.env` na raiz do projeto:
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=sistema_loja
JWT_SECRET=sua_chave_secreta

3. Execute o projeto com:

npm run dev

O backend será iniciado na porta 3000 e o sistema abrirá automaticamente no Electron.
