const API_PIZZAS = 'http://localhost:3000';


async function cadastrarPizza() {
    const sabor = document.getElementById('sabor').value;
    const imagem = document.getElementById('imagem').value;
    const ingredientes = document.getElementById('ingredientes').value;
    const preco = document.getElementById('preco').value;
   
    var body = {
        sabor: sabor,
        nome_imagem: imagem,
        ingredientes: ingredientes,
        preco: !preco ? 0 : parseFloat(preco),
    }

    const response = await fetch(API_PIZZAS + '/pizza', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    const data = await response.json();

    if (response.ok) {
        document.getElementById('saborPizzas').textContent = data.sabor;
    } else {
        alert('Erro: ' + data.erro);
        document.getElementById('saborPizzas').textContent = '';
    }
}

function alterarPizzaLista(sabor, preco) {
    document.getElementById('sabor').value = sabor;
    document.getElementById('preco').value = preco;
    consultarPizza();
}

async function alterarPizza() {
    const id = document.getElementById('codigo').value;
    const sabor = document.getElementById('sabor').value;
    const imagem = document.getElementById('imagem').value;
    const ingredientes = document.getElementById('ingredientes').value;
    let preco = document.getElementById('preco').value;
    var dados = {
        sabor: sabor,
        nome_imagem: imagem,
        ingredientes: ingredientes,
        preco: !preco ? 0 : parseFloat(preco),
    }

    if (!id) {
        alert("Informe o código da Pizza que deseja alterar.");
        return;
    }

    try {
        const resposta = await fetch(`${API_PIZZAS+'/alterarPizza'}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        if (resposta.ok) {
            alert("Pizza alterada com sucesso!");
            document.getElementById("formPizzas").reset();
        } else {
            const erro = await resposta.json();
            alert("Erro ao alterar: " + (erro.mensagem || erro.erro));
        }
    } catch (err) {
        alert("Erro na requisição: " + err.message);
    }
}

async function desativarPizza(id) {

    if (!id) {
        alert("Informe o código da Pizza que deseja desativar.");
        return;
    }

    try {
        const resposta = await fetch(`${API_PIZZAS+'/desativarPizza'}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (resposta.ok) {
            alert("Pizza desativada com sucesso!");
            document.getElementById("formPizzas").reset();
        } else {
            const erro = await resposta.json();
            alert("Erro ao desativar: " + (erro.mensagem || erro.erro));
        }
    } catch (err) {
        alert("Erro na requisição: " + err.message);
    }
}

async function consultarPizza() {
    let url = API_PIZZAS + '/consultarPizza';
    const queryParams = [];

    const sabor = document.getElementById('sabor').value;
    const preco = document.getElementById('preco').value;

    queryParams.push(`sabor=${encodeURIComponent(sabor)}`);
    queryParams.push(`preco=${encodeURIComponent(preco)}`);

    url += '?' + queryParams.join('&');

    try {
        const resposta = await fetch(url);
        const dados = await resposta.json();

        if (resposta.ok) {
            if (dados.length > 0) {
                const pizza = dados[0];
                document.getElementById('codigo').value = pizza.codigo;
                document.getElementById('sabor').value = pizza.sabor;
                document.getElementById('imagem').value = pizza.nome_imagem;
                document.getElementById('ingredientes').value = pizza.ingredientes;
                document.getElementById('preco').value = pizza.preco;
            } else {
                alert("Pizza não encontrada.");
            }
        } else {
            alert("Erro ao consultar: " + dados.erro);
        }
    } catch (err) {
        alert("Erro ao consultar: " + err.message);
    }
}

async function listarPizzas() {
    try {
        const resposta = await fetch(API_PIZZAS + '/allPizzas');
        const dados = await resposta.json();

        if (resposta.ok) {
            const tabela = document.getElementById('tabelaPizzas');
            tabela.innerHTML = ''; // Limpa a tabela antes de adicionar novos dados

            dados.forEach(pizza => {
                const ul = document.createElement('ul');
                ul.className = 'list-group list-group-flush';
                ul.innerHTML = `
                    <li class="list-group-item">
                        <strong>Sabor:</strong> ${pizza.sabor} -
                        <strong>Preco:</strong> ${pizza.preco} -
                        <strong>Status:</strong> ${pizza.status}
                        <button class="btn btn-warning" onclick="alterarPizzaLista('${pizza.sabor}', '${pizza.preco}')">Alterar</button>
                        <button class="btn btn-danger" onclick="desativarPizza(${pizza.id})">Desativar</button>
                    </li>
                `;
                tabela.appendChild(ul);
            });
        } else {
            alert("Erro ao listar pizzas: " + dados.erro);
        }
    } catch (err) {
        alert("Erro ao listar pizzas: " + err.message);
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
    listarPizzas();
});