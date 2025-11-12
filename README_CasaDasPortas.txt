Sistema da Casa das Portas e Janelas

Esse sistema foi feito pra facilitar o controle interno da Casa das
Portas e Janelas. Ele funciona como um programa de computador (feito em
Electron) que reúne tudo num só lugar. Ao abrir, o usuário entra com seu
CPF e senha, e dependendo da função dele (admin, técnico, gerente ou
funcionário), ele vê opções diferentes.

Depois de fazer login, aparece a tela principal com um menu lateral onde
dá pra acessar partes do sistema como Dashboard, Clientes, Produtos e
Vendas. O menu tem uma barra de busca pra achar rápido o que quiser.

O sistema tem modo claro e escuro, que pode ser trocado até na tela de
login, e ele salva sua preferência automaticamente. Na parte de cima,
aparecem o nome, o cargo e a foto do usuário — clicando nela, abre um
painel de perfil com mais informações e opção de mudar a foto.

Quem é administrador também tem acesso a uma tela especial pra cadastrar
novos usuários, controlando quem pode entrar no sistema. Além disso, há
animações suaves, avisos rápidos na tela (toasts) e uma confirmação
antes de sair, pra evitar fechar sem querer.

É um sistema simples, bonito e funcional, feito pra deixar o dia a dia
mais fácil e organizado.

Credenciais de teste: Administrador — CPF: 11144477735 • Senha: Admin!2025

Gerente (Carlos Ricardo) — CPF: 22255599900 • Senha: Gerente@2025

Vendedor (Felipe Andrade) — CPF: 33388811155 • Senha: Vendas@2025

Dependencias para instalar 
npm install express cors jsonwebtoken bcrypt dotenv mysql2 fs-extra electron axios concurrently nodemon electron-builder
