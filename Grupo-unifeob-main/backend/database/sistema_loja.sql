-- ======================================================
-- CRIAÇÃO DO BANCO DE DADOS
-- ======================================================
CREATE DATABASE IF NOT EXISTS sistema_loja;
USE sistema_loja;

-- ======================================================
-- TABELA: clientes
-- ======================================================
CREATE TABLE IF NOT EXISTS clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  endereco VARCHAR(150),
  cidade VARCHAR(100),
  cpf_cnpj VARCHAR(20),
  telefone VARCHAR(20)
);

-- Dados de exemplo
INSERT INTO clientes (nome, endereco, cidade, cpf_cnpj, telefone) VALUES
('João da Silva', 'Rua A, 123', 'São Paulo', '123.456.789-00', '11999999999'),
('Maria Oliveira', 'Rua B, 456', 'Campinas', '987.654.321-00', '11988888888');

-- ======================================================
-- TABELA: produtos
-- ======================================================
CREATE TABLE IF NOT EXISTS produtos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  tipo VARCHAR(50),
  valor DECIMAL(10,2)
);

-- Dados de exemplo
INSERT INTO produtos (nome, tipo, valor) VALUES
('Porta de Madeira', 'Porta', 250.00),
('Janela de Alumínio', 'Janela', 180.00),
('Porta de Vidro Temperado', 'Porta', 320.00),
('Janela de Madeira', 'Janela', 210.00),
('Porta de Aço Reforçada', 'Porta', 450.00),
('Janela Basculante', 'Janela', 160.00);

-- ======================================================
-- TABELA: compras
-- ======================================================
CREATE TABLE IF NOT EXISTS compras (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  produto_id INT NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  data_compra DATE NOT NULL,
  data_entrega DATE,
  forma_pagamento VARCHAR(50),
  FOREIGN KEY (cliente_id) REFERENCES clientes(id),
  FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

-- Dados de exemplo
INSERT INTO compras (cliente_id, produto_id, valor, data_compra, data_entrega, forma_pagamento)
VALUES (1, 1, 150.75, '2023-10-27', '2023-11-01', 'Cartão de Crédito');

INSERT INTO compras (cliente_id, produto_id, valor, data_compra, forma_pagamento)
VALUES (2, 2, 45.00, '2023-10-27', 'Dinheiro');

INSERT INTO compras (cliente_id, produto_id, valor, data_compra, data_entrega, forma_pagamento)
VALUES (1, 3, 320.00, '2023-11-10', '2023-11-15', 'Pix');

INSERT INTO compras (cliente_id, produto_id, valor, data_compra, data_entrega, forma_pagamento)
VALUES (2, 4, 210.00, '2023-11-12', '2023-11-18', 'Cartão de Débito');

INSERT INTO compras (cliente_id, produto_id, valor, data_compra, data_entrega, forma_pagamento)
VALUES (1, 5, 450.00, '2023-11-14', '2023-11-20', 'Boleto Bancário');

INSERT INTO compras (cliente_id, produto_id, valor, data_compra, forma_pagamento)
VALUES (2, 6, 160.00, '2023-11-16', 'Dinheiro');

-- ======================================================
-- TABELA: usuarios
-- ======================================================
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  cpf VARCHAR(20) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  tipo ENUM('admin', 'gerente', 'vendedor') NOT NULL DEFAULT 'vendedor',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================================================
-- INSERÇÃO DE USUÁRIOS
-- ======================================================
-- Senhas originais (bcrypt):
--   Admin:    Admin!2025
--   Gerente:  Gerente@2025
--   Vendedor: Vendedor#2025

INSERT INTO usuarios (nome, cpf, senha, tipo) VALUES
('Administrador Geral', '11144477735', '$2b$10$OdIGZPYWtXRwAZBnRIhkxuTf5WSNgE6m1BVMPOgHkL0tTPZwoCKAK', 'admin'),
('Carlos Ricardo',       '22255599900', '$2b$10$ZQz/JUKQDOSNwuMXeRdRIeyZnSqkyka9/PrAMsBPY194RMkaUFV8e', 'gerente'),
('Felipe Andrade',       '33388811155', '$2b$10$F1h7OzGpmjdZs4IMThNF2OeIEEf78HkahkpRn2rKULW.EiREXDETS', 'vendedor');

-- ======================================================
-- CONSULTAS DE TESTE (opcionais)
-- ======================================================
-- SELECT * FROM clientes;
-- SELECT * FROM produtos;
-- SELECT * FROM compras;
-- SELECT * FROM usuarios;
