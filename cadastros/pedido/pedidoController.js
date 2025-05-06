const API = 'http://localhost:3000';

let valorTotal = 0;
let quantidadePizzas = 0;

function adicionarPizza(pizza) {
    // Converte o parâmetro de volta para um objeto, caso seja uma string JSON
    if (typeof pizza === 'string') {
        pizza = JSON.parse(pizza);
    }

    const tabela = document.getElementById('tabelaPizzasSelecionadas');
    const ul = document.createElement('ul');
    ul.className = 'list-group list-group-flush';
    ul.innerHTML = `
        <li class="list-group-item">
            <strong>Código:</strong> ${pizza.id} -
            <strong>Sabor:</strong> ${pizza.sabor} - 
            <strong>Preço:</strong> ${pizza.preco}
        <button type="button" class="btn btn-danger btn-sm" onclick="removerPizza(this, \`${pizza.preco}\`)">Remover</button>
        </li>`;
    tabela.appendChild(ul);

    valorTotal += parseFloat(pizza.preco);
    quantidadePizzas++;
    document.getElementById('valorTotal').value = `R$ ${valorTotal.toFixed(2)}`; 
    document.getElementById('valorTotal').style.display = 'block';
    document.getElementById('tabelaPizzasSelecionadas').style.display = 'block';
}

function removerPizza(elemento, preco) {
    const li = elemento.parentElement;
    valorTotal -= parseFloat(preco); 
    quantidadePizzas--;
    document.getElementById('valorTotal').value = `R$ ${valorTotal.toFixed(2)}`; // Atualiza o valor total
    const ul = li.parentElement; // Obtém o <ul> que contém o <li>
    ul.removeChild(li); // Remove o <li> do <ul>
}

async function cadastrarPedido() {
    const codigoCliente = document.getElementById('codigoCliente').value;
    const pizzasSelecionadas = document.querySelectorAll('#tabelaPizzasSelecionadas li');
    const pizzas = [];

    pizzasSelecionadas.forEach(pizza => {
        const codigo = pizza.querySelector('strong').textContent.split(': ')[1];
        pizzas.push(codigo);
    });

    const pedido = {
        codigoCliente: codigoCliente,
        pizzas: pizzas,
        valorTotal: valorTotal,
        quantidadePizzas: quantidadePizzas
    };

    try {
        const resposta = await fetch(API + '/cadastrarPedido', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedido)
        });
        const dados = await resposta.json();

        if (resposta.ok) {
            alert("Pedido cadastrado com sucesso!");
            window.location.reload(); // Atualiza a página após o cadastro
        } else {
            alert("Erro ao cadastrar pedido: " + dados.erro);
        }
    } catch (err) {
        alert("Erro ao cadastrar pedido: " + err.message);
    }
}

async function consultarCliente() {
    let url = API + '/consultarCliente';
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
                document.getElementById('codigoCliente').value = cliente.id;
                document.getElementById('nomeCliente').value = cliente.nome;
                document.getElementById('telefoneCliente').value = cliente.telefone;
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

async function listarPizzas() {
    try {
        const resposta = await fetch(API + '/allPizzas');
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
                        <strong>Preco:</strong> ${pizza.preco}
                        <button type="button" class="btn btn-success" onclick='adicionarPizza(${JSON.stringify(pizza)})'>Adicionar Pizza</button>
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
    listarPizzas();
});