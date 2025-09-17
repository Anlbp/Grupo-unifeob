const mysql = require('mysql2');

const conexao = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'unifeob@123',
  database: 'sistema_loja'
});

conexao.connect(err => {
  if (err) {
    console.error('Erro ao conectar no banco:', err);
  } else {
    console.log('✅ Conectado ao MySQL');
  }
});

module.exports = conexao;
