// Função para carregar a página de clientes
async function loadClientes() {
    try {
        const response = await fetch(`${API_URL}/clientes`, {
            headers: getAuthHeader()
        });

        if (!response.ok) {
            if (response.status === 403) {
                document.getElementById('mainArea').innerHTML = '<div class="alert alert-warning">Você precisa estar logado para ver os clientes.</div>';
            } else {
                const errorData = await response.json();
                throw new Error(errorData.erro || response.statusText || 'Erro ao carregar clientes');
            }
            return; // Stop execution if response is not ok
        }

        const clientes = await response.json();

        const mainArea = document.getElementById('mainArea');
        mainArea.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2>Clientes</h2>
                <button class="btn btn-primary" onclick="showNovoClienteModal()">Novo Cliente</button>
            </div>
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Telefone</th>
                            <th>Endereço</th>
                            <th>Cidade</th>
                            <th>CPF/CNPJ</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${clientes.map((cliente, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${cliente.nome}</td>
                                <td>${cliente.telefone}</td>
                                <td>${cliente.endereco || 'N/A'}</td>
                                <td>${cliente.cidade || 'N/A'}</td>
                                <td>${cliente.cpf_cnpj || 'N/A'}</td>
                                <td>
                                    <button class="btn btn-sm btn-info" onclick="editarCliente(${cliente.id})">Editar</button>
                                    <button class="btn btn-sm btn-danger" onclick="deletarCliente(${cliente.id})">Excluir</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (error) {
        alert('Erro ao carregar clientes: ' + error.message);
    }
}

// Função para carregar a página de produtos
async function loadProdutos() {
    try {
        const response = await fetch(`${API_URL}/produtos`, {
            headers: getAuthHeader()
        });

        if (!response.ok) {
            if (response.status === 403) {
                document.getElementById('mainArea').innerHTML = '<div class="alert alert-warning">Você precisa estar logado para ver os produtos.</div>';
            } else {
                const errorData = await response.json();
                throw new Error(errorData.erro || response.statusText || 'Erro ao carregar produtos');
            }
            return; // Stop execution if response is not ok
        }

        const produtos = await response.json();

        const mainArea = document.getElementById('mainArea');
        mainArea.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2>Produtos</h2>
                <button class="btn btn-primary" onclick="showNovoProdutoModal()">Novo Produto</button>
            </div>
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Tipo</th>
                            <th>Valor</th>
                            <th>Preço</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${produtos.map((produto, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${produto.nome}</td>
                                <td>${produto.tipo || 'N/A'}</td>
                                <td>${produto.valor || 'N/A'}</td>
                                <td>R$ ${parseFloat(produto.preco || 0).toFixed(2)}</td>
                                <td>
                                    <button class="btn btn-sm btn-info" onclick="editarProduto(${produto.id})">Editar</button>
                                    <button class="btn btn-sm btn-danger" onclick="deletarProduto(${produto.id})">Excluir</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (error) {
        alert('Erro ao carregar produtos: ' + error.message);
    }
}

// Função para carregar a página de compras (vendas)
async function loadCompras() {
    try {
        const response = await fetch(`${API_URL}/compras`, {
            headers: getAuthHeader()
        });

        if (!response.ok) {
            if (response.status === 403) {
                document.getElementById('mainArea').innerHTML = '<div class="alert alert-warning">Você precisa estar logado para ver as compras.</div>';
            } else {
                const errorData = await response.json();
                throw new Error(errorData.erro || response.statusText || 'Erro ao carregar compras');
            }
            return; // Stop execution if response is not ok
        }

        const compras = await response.json();

        const mainArea = document.getElementById('mainArea');
        mainArea.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2>Compras</h2>
                <button class="btn btn-primary" onclick="showNovaCompraModal()">Nova Compra</button>
            </div>
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>ID Cliente</th>
                            <th>Valor</th>
                            <th>Data Compra</th>
                            <th>Data Entrega</th>
                            <th>Forma Pagamento</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${compras.map((compra, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${compra.cliente_id || 'N/A'}</td>
                                <td>R$ ${parseFloat(compra.valor || 0).toFixed(2)}</td>
                                <td>${new Date(compra.data_compra || compra.data).toLocaleDateString() || 'N/A'}</td>
                                <td>${compra.data_entrega ? new Date(compra.data_entrega).toLocaleDateString() : 'N/A'}</td>
                                <td>${compra.forma_pagamento || 'N/A'}</td>
                                <td>
                                    <button class="btn btn-sm btn-info" onclick="verDetalhesCompra(${compra.id})">Detalhes</button>
                                    <!-- Adicionar botões de editar/excluir se aplicável -->
                                    <!-- <button class="btn btn-sm btn-danger" onclick="cancelarCompra(${compra.id})">Cancelar</button> -->
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (error) {
        alert('Erro ao carregar compras: ' + error.message);
    }
}

// Função para exibir o modal de novo cliente
function showNovoClienteModal() {
    const novoClienteModal = new bootstrap.Modal(document.getElementById('novoClienteModal'));
    novoClienteModal.show();
}

// Função para exibir o modal de novo produto
function showNovoProdutoModal() {
    const novoProdutoModal = new bootstrap.Modal(document.getElementById('novoProdutoModal'));
    // Limpa o formulário antes de mostrar a modal
    document.getElementById('novoProdutoForm').reset();
    novoProdutoModal.show();
}

// Função para exibir o modal de nova compra
function showNovaCompraModal() {
    const novaCompraModal = new bootstrap.Modal(document.getElementById('novaCompraModal'));
    // Limpa o formulário antes de mostrar a modal
    document.getElementById('novaCompraForm').reset();
    novaCompraModal.show();
}

// Função para deletar um cliente
async function deletarCliente(id) {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
        try {
            const response = await fetch(`${API_URL}/clientes/${id}`, {
                method: 'DELETE',
                headers: getAuthHeader()
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.erro || 'Erro ao deletar cliente');
            }

            alert('Cliente deletado com sucesso!');
            loadClientes(); // Recarrega a lista de clientes após a exclusão

        } catch (error) {
            alert(error.message);
        }
    }
}

// Função para deletar um produto
async function deletarProduto(id) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        try {
            const response = await fetch(`${API_URL}/produtos/${id}`, {
                method: 'DELETE',
                headers: getAuthHeader()
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.erro || 'Erro ao deletar produto');
            }

            alert('Produto deletado com sucesso!');
            loadProdutos(); // Recarrega a lista de produtos após a exclusão

        } catch (error) {
            alert(error.message);
        }
    }
}

// Função para editar um cliente (busca dados e preenche modal)
async function editarCliente(id) {
    try {
        const response = await fetch(`${API_URL}/clientes/${id}`, {
            headers: getAuthHeader()
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.erro || 'Erro ao buscar dados do cliente para edição');
        }

        const cliente = await response.json();

        // Preenche o formulário da modal de edição com os dados do cliente
        document.getElementById('clienteIdEdit').value = cliente.id;
        document.getElementById('nomeClienteEdit').value = cliente.nome;
        document.getElementById('telefoneClienteEdit').value = cliente.telefone;
        document.getElementById('enderecoClienteEdit').value = cliente.endereco || '';
        document.getElementById('cidadeClienteEdit').value = cliente.cidade || '';
        document.getElementById('cpfcnpjClienteEdit').value = cliente.cpf_cnpj || '';

        // Exibe a modal de edição
        const editarClienteModal = new bootstrap.Modal(document.getElementById('editarClienteModal'));
        editarClienteModal.show();

    } catch (error) {
        alert(error.message);
    }
}

// Função para editar um produto (busca dados e preenche modal)
async function editarProduto(id) {
    try {
        const response = await fetch(`${API_URL}/produtos/${id}`, {
            headers: getAuthHeader()
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.erro || 'Erro ao buscar dados do produto para edição');
        }

        const produto = await response.json();

        // Preenche o formulário da modal de edição com os dados do produto
        document.getElementById('produtoIdEdit').value = produto.id;
        document.getElementById('nomeProdutoEdit').value = produto.nome;
        document.getElementById('tipoProdutoEdit').value = produto.tipo || '';
        document.getElementById('valorProdutoEdit').value = produto.valor || '';
        document.getElementById('precoProdutoEdit').value = produto.preco || '';

        // Exibe a modal de edição
        const editarProdutoModal = new bootstrap.Modal(document.getElementById('editarProdutoModal'));
        editarProdutoModal.show();

    } catch (error) {
        alert(error.message);
    }
}

// Função para ver detalhes de uma compra
async function verDetalhesCompra(id) {
    try {
        const response = await fetch(`${API_URL}/compras/${id}`, {
            headers: getAuthHeader()
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.erro || 'Erro ao buscar dados da compra');
        }

        const compra = await response.json();

        // Preenche a modal de detalhes da compra
        document.getElementById('detalheCompraId').textContent = compra.id;
        document.getElementById('detalheCompraClienteId').textContent = compra.cliente_id || 'N/A';
        document.getElementById('detalheCompraNomeCliente').textContent = compra.nome_cliente || 'N/A';
        document.getElementById('detalheCompraProdutoId').textContent = compra.produto_id || 'N/A';
        document.getElementById('detalheCompraValor').textContent = `R$ ${parseFloat(compra.valor || 0).toFixed(2)}`;
        document.getElementById('detalheCompraDataCompra').textContent = new Date(compra.data_compra || compra.data).toLocaleDateString() || 'N/A';
        document.getElementById('detalheCompraDataEntrega').textContent = compra.data_entrega ? new Date(compra.data_entrega).toLocaleDateString() : 'N/A';
        document.getElementById('detalheCompraFormaPagamento').textContent = compra.forma_pagamento || 'N/A';

        // Exibe a modal de detalhes
        const detalhesCompraModal = new bootstrap.Modal(document.getElementById('detalhesCompraModal'));
        detalhesCompraModal.show();

    } catch (error) {
        alert(error.message);
    }
}

// Event Listener para o formulário de novo cliente
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link[data-page]');
    const mainArea = document.getElementById('mainArea');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.dataset.page;
            
            // Remove classe active de todos os links
            navLinks.forEach(l => l.classList.remove('active'));
            // Adiciona classe active ao link clicado
            e.target.classList.add('active');

            // Show mainArea when a nav link is clicked
            mainArea.style.display = 'block';
            
            // Carrega a página correspondente
            switch(page) {
                case 'clientes':
                    loadClientes();
                    break;
                case 'produtos':
                    loadProdutos();
                    break;
                case 'compras':
                    loadCompras(); // Chamada para a nova função
                    break;
                case 'relatorios':
                    // Implementar carregamento de relatórios
                    loadRelatorios();
                    break;
                default:
                    mainArea.innerHTML = '<h2>Página não encontrada</h2>';
            }
        });
    });

    const novoClienteForm = document.getElementById('novoClienteForm');
    novoClienteForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nome = document.getElementById('nomeCliente').value;
        const telefone = document.getElementById('telefoneCliente').value;
        const endereco = document.getElementById('enderecoCliente').value;
        const cidade = document.getElementById('cidadeCliente').value;
        const cpf_cnpj = document.getElementById('cpfcnpjCliente').value;

        try {
            const response = await fetch(`${API_URL}/clientes`, {
                method: 'POST',
                headers: getAuthHeader(),
                body: JSON.stringify({ nome, telefone, endereco, cidade, cpf_cnpj })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.erro || 'Erro ao cadastrar cliente');
            }

            // Cliente cadastrado com sucesso
            alert('Cliente cadastrado com sucesso!');
            const novoClienteModal = bootstrap.Modal.getInstance(document.getElementById('novoClienteModal'));
            novoClienteModal.hide();
            novoClienteForm.reset(); // Limpa o formulário
            loadClientes(); // Recarrega a lista de clientes

        } catch (error) {
            alert(error.message);
        }
    });

    const editarClienteForm = document.getElementById('editarClienteForm');
    if (editarClienteForm) {
        editarClienteForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const id = document.getElementById('clienteIdEdit').value;
            const nome = document.getElementById('nomeClienteEdit').value;
            const telefone = document.getElementById('telefoneClienteEdit').value;
            const endereco = document.getElementById('enderecoClienteEdit').value;
            const cidade = document.getElementById('cidadeClienteEdit').value;
            const cpf_cnpj = document.getElementById('cpfcnpjClienteEdit').value;

            try {
                const response = await fetch(`${API_URL}/clientes/${id}`, {
                    method: 'PUT',
                    headers: getAuthHeader(),
                    body: JSON.stringify({ nome, telefone, endereco, cidade, cpf_cnpj })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.erro || 'Erro ao salvar alterações do cliente');
                }

                alert('Cliente atualizado com sucesso!');
                const editarClienteModal = bootstrap.Modal.getInstance(document.getElementById('editarClienteModal'));
                editarClienteModal.hide();
                loadClientes(); // Recarrega a lista de clientes

            } catch (error) {
                alert(error.message);
            }
        });
    }

    const novoProdutoForm = document.getElementById('novoProdutoForm');
    if (novoProdutoForm) {
        novoProdutoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const nome = document.getElementById('nomeProduto').value;
            const preco = document.getElementById('precoProduto').value;
            const tipo = document.getElementById('tipoProduto').value;
            const valor = document.getElementById('valorProduto').value;

            try {
                const response = await fetch(`${API_URL}/produtos`, {
                    method: 'POST',
                    headers: getAuthHeader(),
                    body: JSON.stringify({ nome, preco: parseFloat(preco), tipo, valor: parseFloat(valor) })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.erro || 'Erro ao cadastrar produto');
                }

                alert('Produto cadastrado com sucesso!');
                const novoProdutoModal = bootstrap.Modal.getInstance(document.getElementById('novoProdutoModal'));
                novoProdutoModal.hide();
                loadProdutos(); // Recarrega a lista de produtos

            } catch (error) {
                alert(error.message);
            }
        });
    }

    const editarProdutoForm = document.getElementById('editarProdutoForm');
    if (editarProdutoForm) {
        editarProdutoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const id = document.getElementById('produtoIdEdit').value;
            const nome = document.getElementById('nomeProdutoEdit').value;
            const tipo = document.getElementById('tipoProdutoEdit').value;
            const valor = document.getElementById('valorProdutoEdit').value;
            const preco = document.getElementById('precoProdutoEdit').value;

            try {
                const response = await fetch(`${API_URL}/produtos/${id}`, {
                    method: 'PUT',
                    headers: getAuthHeader(),
                    body: JSON.stringify({ nome, tipo, valor: parseFloat(valor), preco: parseFloat(preco) })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.erro || 'Erro ao salvar alterações do produto');
                }

                alert('Produto atualizado com sucesso!');
                const editarProdutoModal = bootstrap.Modal.getInstance(document.getElementById('editarProdutoModal'));
                editarProdutoModal.hide();
                loadProdutos(); // Recarrega a lista de produtos

            } catch (error) {
                alert(error.message);
            }
        });
    }

    const novaCompraForm = document.getElementById('novaCompraForm');
    if (novaCompraForm) {
        novaCompraForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const cliente_id = document.getElementById('clienteIdCompra').value;
            const valor = document.getElementById('valorCompra').value;
            const data_compra = document.getElementById('dataCompra').value;
            const data_entrega = document.getElementById('dataEntregaCompra').value;
            const forma_pagamento = document.getElementById('formaPagamentoCompra').value;
            const produto_id = document.getElementById('produtoIdCompra').value;

            try {
                const response = await fetch(`${API_URL}/compras`, {
                    method: 'POST',
                    headers: getAuthHeader(),
                    body: JSON.stringify({ cliente_id: parseInt(cliente_id), produto_id: parseInt(produto_id), valor: parseFloat(valor), data_compra, data_entrega, forma_pagamento })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.erro || 'Erro ao cadastrar compra');
                }

                alert('Compra cadastrada com sucesso!');
                const novaCompraModal = bootstrap.Modal.getInstance(document.getElementById('novaCompraModal'));
                novaCompraModal.hide();
                loadCompras(); // Recarrega a lista de compras

            } catch (error) {
                alert(error.message);
            }
        });
    }

    // Verifica se o usuário já está autenticado e carrega clientes por padrão
    if (isAuthenticated()) {
        document.getElementById('authArea').style.display = 'none';
        document.getElementById('mainArea').style.display = 'block';
        loadClientes(); // Carrega a página de clientes por padrão após login
    }
});

// Nova função para carregar e exibir relatórios
async function loadRelatorios() {
    const mainArea = document.getElementById('mainArea');
    mainArea.innerHTML = '<h2>Relatórios</h2><p>Carregando...</p>'; // Placeholder de carregamento

    try {
        // Buscar top clientes
        const responseClientes = await fetch(`${API_URL}/relatorios/clientes-top`, {
            headers: getAuthHeader()
        });

        if (!responseClientes.ok) {
            const errorData = await responseClientes.json();
            throw new Error(errorData.erro || 'Erro ao carregar top clientes');
        }

        const topClientes = await responseClientes.json();

        // Buscar top produtos
        const responseProdutos = await fetch(`${API_URL}/relatorios/produtos-top`, {
            headers: getAuthHeader()
        });

        if (!responseProdutos.ok) {
            const errorData = await responseProdutos.json();
            throw new Error(errorData.erro || 'Erro ao carregar top produtos');
        }

        const topProdutos = await responseProdutos.json();

        // Gerar HTML para exibir os relatórios
        let relatoriosHtml = '<div class="container mt-4"><h2>Relatórios</h2>';

        // Adicionar botão de exportar CSV
        relatoriosHtml += '<button id="exportComprasCsvBtn" class="btn btn-success mb-3">Exportar Compras CSV</button>';

        // Adicionar botão de exportar PDF
        // relatoriosHtml += '<button id="exportComprasPdfBtn" class="btn btn-danger mb-3 ms-2">Exportar Compras PDF</button>'; // Removido

        // Tabela de Top Clientes
        relatoriosHtml += `
            <div class="card mb-4">
                <div class="card-header">
                    <h3>Clientes que Mais Compraram</h3>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>Nome do Cliente</th>
                                    <th>Total de Compras</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${topClientes.map(cliente => `
                                    <tr>
                                        <td>${cliente.nome}</td>
                                        <td>${cliente.total_compras}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        // Tabela de Top Produtos
        relatoriosHtml += `
            <div class="card">
                <div class="card-header">
                    <h3>Produtos Mais Vendidos</h3>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>Nome do Produto</th>
                                    <th>Total Vendido</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${topProdutos.map(produto => `
                                    <tr>
                                        <td>${produto.nome}</td>
                                        <td>${produto.total_vendido}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        relatoriosHtml += '</div>'; // Fecha o container principal

        mainArea.innerHTML = relatoriosHtml;

        // Adicionar botão de exportar CSV e sua lógica
        const exportCsvBtn = document.getElementById('exportComprasCsvBtn');
        if (exportCsvBtn) {
            exportCsvBtn.addEventListener('click', async () => {
                try {
                    const response = await fetch(`${API_URL}/relatorios/compras-csv`, {
                        headers: getAuthHeader()
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.erro || 'Erro ao exportar CSV de compras');
                    }

                    // Obter o conteúdo do arquivo como Blob
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);

                    // Criar um link temporário para download
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = 'relatorio_compras.csv'; // Nome sugerido para o arquivo
                    
                    document.body.appendChild(a);
                    a.click(); // Simular o clique para iniciar o download

                    window.URL.revokeObjectURL(url); // Liberar o URL temporário
                    document.body.removeChild(a); // Remover o link

                } catch (error) {
                    alert('Erro ao exportar CSV: ' + error.message);
                }
            });
        }

        // Adicionar botão de exportar PDF e sua lógica
        // const exportPdfBtn = document.getElementById('exportComprasPdfBtn'); // Removido
        // if (exportPdfBtn) { // Removido
        //     exportPdfBtn.addEventListener('click', async () => { // Removido
        //         try { // Removido
        //             const response = await fetch(`${API_URL}/relatorios/compras-pdf`, { // Removido
        //                 headers: getAuthHeader() // Removido
        //             }); // Removido
        //
        //             if (!response.ok) { // Removido
        //                 const errorData = await response.json(); // Removido
        //                 throw new Error(errorData.erro || 'Erro ao exportar PDF de compras'); // Removido
        //             } // Removido
        //
        //             // Obter o conteúdo do arquivo como Blob // Removido
        //             const blob = await response.blob(); // Removido
        //             const url = window.URL.createObjectURL(blob); // Removido
        //
        //             // Criar um link temporário para download // Removido
        //             const a = document.createElement('a'); // Removido
        //             a.style.display = 'none'; // Removido
        //             a.href = url; // Removido
        //             a.download = 'relatorio_compras.pdf'; // Nome sugerido para o arquivo // Removido
        //             
        //             document.body.appendChild(a); // Removido
        //             a.click(); // Simular o clique para iniciar o download // Removido
        //
        //             window.URL.revokeObjectURL(url); // Liberar o URL temporário // Removido
        //             document.body.removeChild(a); // Remover o link // Removido
        //
        //         } catch (error) { // Removido
        //             alert('Erro ao exportar PDF: ' + error.message); // Removido
        //         } // Removido
        //     }); // Removido
        // } // Removido

    } catch (error) {
        mainArea.innerHTML = `<h2>Relatórios</h2><div class="alert alert-danger">Erro ao carregar relatórios: ${error.message}</div>`;
    }
} 