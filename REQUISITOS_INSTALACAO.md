# Requisitos de Instalação - Casa das Portas e Janelas

## 📦 O que está incluído no executável

O executável gerado pelo Electron Builder **já inclui**:
- ✅ **Node.js** (incluído pelo Electron)
- ✅ **Todas as dependências do Node.js** (express, mysql2, bcryptjs, etc.)
- ✅ **Backend completo** (código e dependências)
- ✅ **Frontend completo** (interface Electron)
- ✅ **Arquivo .env** (configurações)

## 🔧 O que o usuário PRECISA ter instalado

### 1. **MySQL Server** (OBRIGATÓRIO)
   - O MySQL precisa estar **instalado e rodando** no computador
   - Versão recomendada: MySQL 5.7 ou superior / MariaDB 10.3 ou superior
   - O MySQL deve estar acessível em `localhost:3306` (padrão)

### 2. **Banco de Dados** (OBRIGATÓRIO)
   - O banco de dados precisa ser criado antes de usar a aplicação
   - Use o arquivo SQL: `backend/database/casa_portas_janelas.sql`
   - Execute no MySQL Workbench ou linha de comando:
     ```sql
     source backend/database/casa_portas_janelas.sql
     ```

### 3. **Arquivo .env** (OBRIGATÓRIO)
   - O arquivo `.env` está incluído no executável, mas **precisa ser configurado**
   - Localização após instalação: diretório de instalação do aplicativo
   - Edite o arquivo `.env` com suas credenciais do MySQL:
     ```
     PORT=3000
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=sua_senha_mysql
     DB_NAME=casa_portas_janelas
     DB_PORT=3306
     JWT_SECRET=sua_chave_secreta_aleatoria
     ```

## 📋 Passos para instalação (para o usuário final)

1. **Instalar MySQL** (se ainda não tiver)
   - Baixe em: https://dev.mysql.com/downloads/mysql/
   - Ou use: https://mariadb.org/download/

2. **Criar o banco de dados**
   - Abra o MySQL Workbench ou linha de comando
   - Execute o script SQL: `casa_portas_janelas.sql`
   - Ou importe via Workbench

3. **Instalar o aplicativo**
   - Execute o instalador: `Casa das Portas e Janelas Setup 1.0.0.exe`
   - Siga o assistente de instalação
   - Ou use a versão portable: `Casa das Portas e Janelas 1.0.0.exe`

4. **Configurar o .env** (se necessário)
   - Localize o arquivo `.env` no diretório de instalação
   - Edite com suas credenciais do MySQL
   - Salve o arquivo

5. **Executar o aplicativo**
   - Abra o aplicativo pelo atalho ou executável
   - O backend iniciará automaticamente
   - Faça login com as credenciais padrão

## ⚠️ Importante

- **NÃO é necessário instalar Node.js separadamente** - está incluído no Electron
- **NÃO é necessário rodar `npm install`** - dependências já estão incluídas
- **NÃO é necessário compilar nada** - tudo já está pronto
- **SIM, é necessário ter MySQL instalado e rodando**
- **SIM, é necessário criar o banco de dados antes de usar**

## 🔍 Verificação

Se o aplicativo não funcionar, verifique:
1. ✅ MySQL está instalado e rodando?
2. ✅ Banco de dados `casa_portas_janelas` foi criado?
3. ✅ Arquivo `.env` está configurado corretamente?
4. ✅ Porta 3000 não está em uso por outro aplicativo?
5. ✅ Firewall não está bloqueando o MySQL?

## 📞 Suporte

Em caso de problemas, verifique os logs do aplicativo ou entre em contato com o suporte técnico.

