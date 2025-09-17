# 🏠 Sistema de Vendas – Portas e Janelas

Este projeto tem como objetivo modernizar e automatizar o processo de vendas de uma empresa do ramo de **portas e janelas**, que atualmente realiza seus registros manualmente em blocos de papel.

---

## 🏢 Sobre a Empresa

A empresa possui sede na cidade de **São João da Boa Vista - SP**, e conta com **3 filiais** ativas na região:

- 📍 Vargem Grande do Sul - SP  
- 📍 Aguaí - SP  
- 📍 Espírito Santo do Pinhal - SP  

Seu foco está na comercialização de **portas, janelas e similares**, com atendimento presencial nas unidades.

---

## 💻 Descrição do Sistema

O sistema foi desenvolvido como projeto de Iniciação Científica por alunos do curso de **Ciência da Computação da UNIFEOB**, visando digitalizar os processos comerciais da empresa.

### ⚙️ Funcionalidades

- **Cadastro de Clientes**
  - Nome completo
  - Endereço
  - Cidade
  - CPF/CNPJ
  - Telefone

- **Cadastro de Compras**
  - Nome do cliente
  - Produto comprado
  - Valor
  - Data da compra
  - Data de entrega prevista
  - Forma de pagamento (cartão parcelado ou à vista com desconto)

- **Cadastro de Produtos**
  - Nome do produto
  - Tipo (porta, janela, etc.)
  - Valor

- **Controle de Vendas**
  - Visualização de todas as compras realizadas
  - Consultas por cliente, produto, data e forma de pagamento

- **Gestão de Usuários e Login**
  - **Vendedor**: pode cadastrar clientes, compras e visualizar vendas
  - **Gerente**: acesso completo ao sistema

- **Relatórios e Consultas**
  - Compras realizadas por período
  - Produtos mais vendidos
  - Clientes que mais compraram

---

## 🧱 Tecnologias Utilizadas

| Camada     | Tecnologia                       |
|------------|----------------------------------|
| Front-end  | HTML, CSS, JavaScript (React)    |
| Back-end   | Node.js (API REST)               |
| Banco de Dados | MySQL                        |

---

## 🔒 Armazenamento de Dados

Todas as informações são salvas em um banco de dados **MySQL** com conexões seguras via API Node.js, garantindo **acessibilidade**, **integridade** e **segurança dos dados**.

---

## 🎯 Motivação

Durante entrevista com gerentes e responsáveis das lojas, foi identificado que o método atual de controle é totalmente manual. Com isso, foi apresentada a proposta de digitalização através de um sistema desenvolvido por alunos como projeto de PI – Projeto Integrador.

O cliente aprovou e validou a proposta, permitindo o desenvolvimento do sistema como **projeto real aplicado**.

---

## 👨‍💻 Desenvolvido por

Alunos de Ciência da Computação – UNIFEOB 
Projeto Integrado Desenvolvimento de Aplicação Web
N.032.A - Projeto Desenvolvimento de Aplicação Web - UNIFEOB
Projeto Integrador – 2025

---

---

## 🚀 Como executar

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/seu-projeto.git

# Acesse a pasta do projeto
cd seu-projeto

# Instale as dependências
npm install

# Inicie o servidor
npm run dev

 
