const API_CLIENTES = 'http://localhost:3000';

async function cadastrarCliente() {
    const nome = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone').value;
    const endereco = document.getElementById('endereco').value;
    const status = document.getElementById('status').value;

    var body = {
        nome: nome,
        telefone: telefone,
        endereco: endereco,
        status: status
    }

    const response = await fetch(API_CLIENTES + '/cliente', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    const data = await response.json();

    if (response.ok) {
        document.getElementById('nomeCliente').textContent = data.nome;
    } else {
        alert('Erro: ' + data.erro);
        document.getElementById('nomeCliente').textContent = '';
    }
}

function alterarClienteLista(nome, telefone) {
    document.getElementById('nome').value = nome;
    document.getElementById('telefone').value = telefone;
    consultarCliente();
}

async function alterarCliente() {
    const id = document.getElementById('codigo').value;
    const nome = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone').value;
    const endereco = document.getElementById('endereco').value;
    const status = document.getElementById('status').value;

    if (!id) {
        alert("Informe o código do cliente para alterar.");
        return;
    }

    const dados = { nome, telefone, endereco, status };

    try {
        const resposta = await fetch(`${API_CLIENTES+'/alterarCliente'}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        if (resposta.ok) {
            alert("Cliente alterado com sucesso!");
            document.getElementById("formCliente").reset();
        } else {
            const erro = await resposta.json();
            alert("Erro ao alterar: " + (erro.mensagem || erro.erro));
        }
    } catch (err) {
        alert("Erro na requisição: " + err.message);
    }
}

async function desativarCliente(id) {

    if (!id) {
        alert("Informe o código do cliente para desativar.");
        return;
    }

    try {
        const resposta = await fetch(`${API_CLIENTES+'/desativarCliente'}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (resposta.ok) {
            alert("Cliente desativado com sucesso!");
            document.getElementById("formCliente").reset();
        } else {
            const erro = await resposta.json();
            alert("Erro ao desativar: " + (erro.mensagem || erro.erro));
        }
    } catch (err) {
        alert("Erro na requisição: " + err.message);
    }
}

async function consultarCliente() {
    let url = API_CLIENTES + '/consultarCliente';
    const queryParams = [];

    const nome = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone').value;

    queryParams.push(`nome=${encodeURIComponent(nome)}`);
    queryParams.push(`telefone=${encodeURIComponent(telefone)}`);

    url += '?' + queryParams.join('&');

    try {
        const resposta = await fetch(url);
        const dados = await resposta.json();

        if (resposta.ok) {
            if (dados.length > 0) {
                const cliente = dados[0];
                document.getElementById('codigo').value = cliente.id;
                document.getElementById('nome').value = cliente.nome;
                document.getElementById('telefone').value = cliente.telefone;
                document.getElementById('endereco').value = cliente.endereco;
                document.getElementById('status').value = cliente.status;
            } else {
                alert("Cliente não encontrado.");
            }
        } else {
            alert("Erro ao consultar: " + dados.erro);
        }

    } catch (err) {
        alert("Erro ao consultar: " + err.message);
    }
}

async function listarClientes() {
    try {
        const resposta = await fetch(API_CLIENTES + '/allClientes');
        const dados = await resposta.json();

        if (resposta.ok) {
            const tabela = document.getElementById('tabelaClientes');
            tabela.innerHTML = ''; // Limpa a tabela antes de adicionar novos dados

            dados.forEach(cliente => {
                const ul = document.createElement('ul');
                ul.className = 'list-group list-group-flush';
                ul.innerHTML = `
                    <li class="list-group-item">
                    <strong>Nome:</strong> ${cliente.nome} -
                    <strong>Telefone:</strong> ${cliente.telefone} -
                    <strong>Status:</strong> ${cliente.status}
                        <button class="btn btn-warning" onclick="alterarClienteLista('${cliente.nome}', '${cliente.telefone}')">Alterar</button>
                        <button class="btn btn-danger" onclick="desativarCliente(${cliente.id})">Desativar</button>
                    </li>
                `;
                tabela.appendChild(ul);
            });
        } else {
            alert("Erro ao listar clientes: " + dados.erro);
        }
    } catch (err) {
        alert("Erro ao listar clientes: " + err.message);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    fetch('/nav.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector('include[src="/nav.html"]').outerHTML = data;
        })
        .catch(error => console.error('Erro ao carregar o nav.html:', error));
});

document.addEventListener("DOMContentLoaded", function () {
    listarClientes();
});