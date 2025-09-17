import mysql.connector

def autenticar_usuario(login_digitado, senha_digitada):
    try:
        conexao = mysql.connector.connect(
            host="localhost",
            user="root",
            password="unifeob@123",
            database="aulaseg"
        )

        cursor = conexao.cursor(dictionary=True)
        cursor.execute("SELECT * FROM usuarios WHERE login = %s", (login_digitado,))
        usuario = cursor.fetchone()

        if usuario:
            if usuario['senha'] == senha_digitada:
                print("✅ Login bem-sucedido!")
                print("Dados do usuário:", usuario)
            else:
                print("❌ Senha incorreta.")
        else:
            print("❌ Usuário não encontrado.")

        cursor.close()
        conexao.close()

    except mysql.connector.Error as erro:
        print("Erro na conexão:", erro)

# Entrada do usuário
login = input("Login: ")
senha = input("Senha: ")

# Autenticar
autenticar_usuario(login, senha)