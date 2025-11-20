-- Migração: Alterar foreign key de produto_id em itens_venda para permitir CASCADE DELETE
-- Execute este script no banco de dados para remover a restrição de remoção de produtos
--
-- NOTA: Se o comando DROP FOREIGN KEY falhar, verifique o nome da constraint com:
-- SHOW CREATE TABLE itens_venda;
-- E substitua 'itens_venda_ibfk_2' pelo nome correto da constraint

-- Remover a foreign key antiga
ALTER TABLE itens_venda DROP FOREIGN KEY itens_venda_ibfk_2;

-- Adicionar a nova foreign key com ON DELETE CASCADE
ALTER TABLE itens_venda 
ADD CONSTRAINT fk_itens_venda_produto 
FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE;

