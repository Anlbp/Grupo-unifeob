-- ============================================
-- Banco de Dados: Casa das Portas e Janelas
-- ============================================

-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS casa_portas_janelas
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE casa_portas_janelas;

-- ============================================
-- Tabela: usuarios (apenas admin, gerente e vendedor)
-- ============================================
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  cpf VARCHAR(11) UNIQUE NOT NULL,
  nome VARCHAR(100) NOT NULL,
  senha VARCHAR(255) NOT NULL,
  role ENUM('admin', 'gerente', 'vendedor') NOT NULL DEFAULT 'vendedor',
  avatar_path VARCHAR(500) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_cpf (cpf),
  INDEX idx_username (username),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabela: produtos
-- ============================================
CREATE TABLE IF NOT EXISTS produtos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  categoria VARCHAR(100) NOT NULL,
  preco DECIMAL(10, 2) NOT NULL,
  descricao TEXT NULL,
  estoque INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_categoria (categoria),
  INDEX idx_nome (nome)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ============================================
-- Tabela: clientes
-- ============================================
CREATE TABLE IF NOT EXISTS clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  cpf VARCHAR(11) UNIQUE NULL,
  cnpj VARCHAR(14) UNIQUE NULL,
  email VARCHAR(150) NULL,
  telefone VARCHAR(20) NULL,
  endereco TEXT NULL,
  cidade VARCHAR(100) NULL,
  estado VARCHAR(2) NULL,
  cep VARCHAR(8) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_nome (nome),
  INDEX idx_cpf (cpf),
  INDEX idx_cnpj (cnpj)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabela: vendas
-- ============================================
CREATE TABLE IF NOT EXISTS vendas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  usuario_id INT NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status ENUM('pendente', 'pago', 'cancelado') DEFAULT 'pendente',
  observacoes TEXT NULL,
  forma_pagamento ENUM('dinheiro','cartao_credito','cartao_debito','pix','boleto','transferencia') NULL,
  data_compra DATE NULL,
  data_entrega DATE NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE RESTRICT,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
  INDEX idx_cliente (cliente_id),
  INDEX idx_usuario (usuario_id),
  INDEX idx_status (status),
  INDEX idx_forma_pagamento (forma_pagamento),
  INDEX idx_data_compra (data_compra),
  INDEX idx_data_entrega (data_entrega),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabela: itens_venda
-- ============================================
CREATE TABLE IF NOT EXISTS itens_venda (
  id INT AUTO_INCREMENT PRIMARY KEY,
  venda_id INT NOT NULL,
  produto_id INT NOT NULL,
  quantidade INT NOT NULL,
  preco_unitario DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (venda_id) REFERENCES vendas(id) ON DELETE CASCADE,
  FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE RESTRICT,
  INDEX idx_venda (venda_id),
  INDEX idx_produto (produto_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabela: audit_logs (Auditoria de ações)
-- ============================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NULL,
  username VARCHAR(50) NULL,
  action VARCHAR(100) NOT NULL,
  resource VARCHAR(100) NOT NULL,
  resource_id INT NULL,
  method VARCHAR(10) NOT NULL,
  endpoint VARCHAR(500) NOT NULL,
  ip_address VARCHAR(45) NULL,
  user_agent TEXT NULL,
  request_body TEXT NULL,
  response_status INT NULL,
  error_message TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_usuario (usuario_id),
  INDEX idx_action (action),
  INDEX idx_resource (resource),
  INDEX idx_created_at (created_at),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir usuários detalhados (senha vazia)
INSERT INTO usuarios (username, cpf, nome, senha, role) VALUES
('admin_carlos',  '11144477735', 'Carlos Alberto da Silva', '$2b$10$5f7kHXSjDg6PyyIpu9R0ReT4UFWtWw8qO6XieosWkC7kjTTJq51ya', 'admin'),
('gerente_maria', '22255588846', 'Maria Fernanda Oliveira', '$2b$10$EF9ll8TnkZMKAAYu9ssjF.PyuRZcVwTiRAGRKeEnAqrDI9dRAurJm', 'gerente'),
('vendedor_joao', '33366699957', 'João Pedro Santos', '$2b$10$fH5eqAjjqas.WtwlksmLheAR47IN1kTpWgR/8j5aKqnJm7wV9Ar.S', 'vendedor');

-- Inserir produtos detalhados (Portas e Janelas)
INSERT INTO produtos (nome, categoria, preco, descricao, estoque) VALUES
('Porta de Madeira Maciça - Modelo Colonial', 'Portas de Madeira', 850.00,  'Porta de madeira maciça com acabamento envernizado, ideal para ambientes internos sofisticados.', 12),
('Porta de Alumínio com Vidro Temperado',     'Portas de Alumínio',1200.00, 'Porta de alumínio resistente com vidro temperado fosco, indicada para áreas externas.', 8),
('Janela de Alumínio 2 Folhas - Linha Suprema','Janelas de Alumínio',650.00,'Janela de alumínio com duas folhas de correr, pintura eletrostática branca.', 20),
('Janela de Madeira com Veneziana',           'Janelas de Madeira', 780.00, 'Janela de madeira com veneziana, excelente para quartos e salas.', 15),
('Porta Pivotante de Vidro Temperado',        'Portas de Vidro',   2500.00, 'Porta pivotante em vidro temperado transparente, indicada para entradas modernas.', 5),
('Janela Basculante de Alumínio',             'Janelas de Alumínio',420.00, 'Janela basculante prática para banheiros e áreas de serviço.', 25),
('Porta de Correr de Alumínio - Linha Gold',  'Portas de Alumínio',1800.00, 'Porta de correr em alumínio anodizado, ideal para varandas e salas amplas.', 10),
('Janela de PVC com Vidro Duplo',             'Janelas de PVC',     950.00, 'Janela de PVC com vidro duplo para isolamento acústico e térmico.', 7);

-- Inserir clientes detalhados
INSERT INTO clientes (nome, cpf, cnpj, email, telefone, endereco, cidade, estado, cep) VALUES
('Roberto Lima', '78945612300', NULL, 'roberto.lima@email.com', '(35) 99999-1111', 'Rua das Acácias, 120', 'Poços de Caldas', 'MG', '37701000'),
('Construtora Alfa Ltda', NULL, '12345678000199', 'contato@construtoraalfa.com', '(11) 98888-2222', 'Av. Paulista, 1500', 'São Paulo', 'SP', '01310000'),
('Fernanda Souza', '85296374100', NULL, 'fernanda.souza@email.com', '(31) 97777-3333', 'Rua das Flores, 45', 'Belo Horizonte', 'MG', '30140000'),
('Madeireira Central Ltda', NULL, '98765432000155', 'vendas@madeireiracentral.com', '(21) 96666-4444', 'Rua do Comércio, 200', 'Rio de Janeiro', 'RJ', '20040000'),
('Cláudia Pereira', '96325874100', NULL, 'claudia.pereira@email.com', '(41) 95555-5555', 'Rua Paraná, 300', 'Curitiba', 'PR', '80020000'),
('Eduardo Martins', '74185296300', NULL, 'eduardo.martins@email.com', '(11) 91234-5678', 'Rua das Palmeiras, 250', 'São Paulo', 'SP', '04543000'),
('Construtora Beta Ltda', NULL, '22334455000188', 'contato@construtorabeta.com', '(21) 99876-5432', 'Av. Rio Branco, 900', 'Rio de Janeiro', 'RJ', '20040002'),
('Patrícia Gomes', '15975348600', NULL, 'patricia.gomes@email.com', '(31) 93456-7890', 'Rua das Hortênsias, 75', 'Belo Horizonte', 'MG', '30220000'),
('Loja de Materiais Delta', NULL, '33445566000177', 'compras@materiaisdelta.com', '(41) 97654-3210', 'Av. Sete de Setembro, 1200', 'Curitiba', 'PR', '80060000'),
('André Carvalho', '25896314700', NULL, 'andre.carvalho@email.com', '(85) 98888-9999', 'Rua das Dunas, 45', 'Fortaleza', 'CE', '60175000'),
('Construtora Horizonte Ltda', NULL, '44556677000166', 'vendas@horizonte.com', '(62) 98765-4321', 'Av. Goiás, 500', 'Goiânia', 'GO', '74000000'),
('Juliana Ribeiro', '35715925800', NULL, 'juliana.ribeiro@email.com', '(51) 97654-1234', 'Rua das Oliveiras, 88', 'Porto Alegre', 'RS', '90040000'),
('Madeireira Sul Ltda', NULL, '55667788000155', 'contato@madeireirasul.com', '(47) 96543-2100', 'Rua XV de Novembro, 300', 'Blumenau', 'SC', '89010000'),
('Marcelo Tavares', '45612378900', NULL, 'marcelo.tavares@email.com', '(71) 93456-1111', 'Rua da Bahia, 60', 'Salvador', 'BA', '40010000'),
('Construtora Pioneira Ltda', NULL, '66778899000144', 'compras@pioneira.com', '(95) 98877-2222', 'Av. Brasil, 700', 'Boa Vista', 'RR', '69300000');

-- Inserir vendas detalhadas
INSERT INTO vendas (cliente_id, usuario_id, total, status, observacoes, forma_pagamento, data_compra, data_entrega) VALUES
(1, 3, 1700.00, 'pago',     'Venda realizada pelo vendedor João para cliente Roberto Lima.', 'pix', '2025-01-10', '2025-01-15'),
(2, 2, 8600.00, 'pendente', 'Venda corporativa realizada pela gerente Maria para Construtora Alfa.', 'boleto', '2025-01-12', NULL),
(3, 2,  950.00, 'pago',     'Venda realizada pela vendedora Maria para cliente Fernanda Souza.', 'cartao_credito', '2025-01-15', '2025-01-20'),
(4, 2, 2500.00, 'pago',     'Venda realizada pela gerente Maria para Madeireira Central.', 'transferencia', '2025-01-18', '2025-01-25'),
(5, 3,  420.00, 'pendente', 'Venda realizada pelo vendedor João para cliente Cláudia Pereira.', 'dinheiro', '2025-01-20', NULL),
(6, 2, 2400.00, 'pago',     'Venda realizada pela gerente Maria para Construtora Beta Ltda.', 'pix', '2025-01-22', '2025-01-28'),
(7, 2,  780.00, 'pendente', 'Venda realizada pela vendedora Maria para cliente Patrícia Gomes.', 'cartao_debito', '2025-01-25', NULL),
(8, 3, 3600.00, 'pago',     'Venda realizada pelo vendedor João para Loja de Materiais Delta.', 'boleto', '2025-01-28', '2025-02-05'),
(9, 2,  950.00, 'pago',     'Venda realizada pela vendedora Maria para cliente André Carvalho.', 'cartao_credito', '2025-02-01', '2025-02-06'),
(10, 2, 5400.00,'pendente', 'Venda realizada pela gerente Maria para Construtora Horizonte Ltda.', 'transferencia', '2025-02-03', NULL),
(11, 3, 1800.00,'pago',     'Venda realizada pelo vendedor João para cliente Juliana Ribeiro.', 'pix', '2025-02-05', '2025-02-10'),
(12, 2, 5000.00,'pago',     'Venda realizada pela gerente Maria para Madeireira Sul Ltda.', 'boleto', '2025-02-07', '2025-02-15'),
(13, 2,  850.00, 'pendente','Venda realizada pela vendedora Maria para cliente Marcelo Tavares.', 'dinheiro', '2025-02-09', NULL),
(14, 2, 7500.00,'pago',     'Venda realizada pela gerente Maria para Construtora Pioneira Ltda.', 'transferencia', '2025-02-12', '2025-02-20');

-- Inserir itens das vendas
INSERT INTO itens_venda (venda_id, produto_id, quantidade, preco_unitario, subtotal) VALUES
(1, 1, 2,  850.00, 1700.00),   -- Roberto comprou 2 portas de madeira
(2, 2, 5, 1200.00, 6000.00),   -- Construtora Alfa comprou 5 portas de alumínio
(2, 3, 4,  650.00, 2600.00),   -- Construtora Alfa comprou 4 janelas de alumínio
(3, 8, 1,  950.00,  950.00),   -- Fernanda comprou 1 janela de PVC
(4, 5, 1, 2500.00, 2500.00),   -- Madeireira Central comprou 1 porta pivotante de vidro
(5, 6, 1,  420.00,  420.00),   -- Cláudia comprou 1 janela basculante
(6, 2, 2, 1200.00, 2400.00),   -- Construtora Beta comprou 2 portas de alumínio
(7, 4, 1,  780.00,  780.00),   -- Patrícia comprou 1 janela de madeira
(8, 7, 2, 1800.00, 3600.00),   -- Loja Delta comprou 2 portas de correr de alumínio
(9, 8, 1,  950.00,  950.00),   -- André comprou 1 janela de PVC
(10, 5, 2, 2500.00, 5000.00),  -- Construtora Horizonte comprou 2 portas pivotantes de vidro
(11, 3, 3,  650.00, 1950.00),  -- Juliana comprou 3 janelas de alumínio
(12, 1, 4,  850.00, 3400.00),  -- Madeireira Sul comprou 4 portas de madeira
(12, 6, 4,  420.00, 1680.00),  -- Madeireira Sul comprou 4 janelas basculantes
(13, 1, 1,  850.00,  850.00),  -- Marcelo comprou 1 porta de madeira
(14, 2, 3, 1200.00, 3600.00),  -- Construtora Pioneira comprou 3 portas de alumínio
(14, 3, 6,  650.00, 3900.00);  -- Construtora Pioneira comprou 6 janelas de alumínio