const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();

app.use(cors());
app.use(express.json());

const port = 3000;

// Conexão com MySQL
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'pizzaria',
  port: 3306  // Alterado para a porta padrão do MySQL
});

// Verificação de conexão com o MySQL
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Erro ao conectar no MySQL:', err);
    return;
  }
  console.log('Conectado ao MySQL');
  connection.release();  // Libera a conexão após o teste
});

// cadastrar cliente
app.post('/cliente', function (req, res) {
    const dados = req.body;

    if (!dados.nome){
        return res.status(400).json({ erro: 'Nome é obrigatório' });
    }

    const sql = 'INSERT INTO clientes (nome, telefone, endereco, status) VALUES (?, ?, ?, ?)';

    pool.query(sql, [dados.nome, dados.telefone, dados.endereco, dados.status], function (err) {
        if (err) {
        console.log(err);
        return res.status(500).json({ erro: 'Erro ao cadastrar cliente' });
        }
        res.json({ mensagem: 'Cliente cadastrado com sucesso' });
    });
});

app.get('/consultarCliente', function (req, res) {
    const nome = req.query.nome; 
    const telefone = req.query.telefone;

    const sql = 'SELECT * FROM clientes WHERE nome = ? AND telefone = ?';

    pool.query(sql, [nome, telefone], function (err, resultados) {
        if (err) {
            console.log(err);
            return res.status(500).json({ erro: 'Erro ao consultar cliente' });
        }
        res.json(resultados);
    });
});

app.patch('/desativarCliente/:id', function (req, res) {
    const id = req.params.id;
    const sql = 'UPDATE clientes SET status = ? WHERE id = ?';

    pool.query(sql, ['inativo', id], function (err) {
        if (err) {
            console.log(err);
            return res.status(500).json({ erro: 'Erro ao desativar cliente' });
        }
        res.json({ mensagem: 'Cliente desativado com sucesso' });
    });
});

app.put('/alterarCliente/:id', function (req, res) {
    const id = req.params.id;
    const dados = req.body;

    const sql = 'UPDATE clientes SET nome = ?, telefone = ?, endereco = ?, status = ? WHERE id = ?';

    pool.query(sql, [dados.nome, dados.telefone, dados.endereco, dados.status, id], function (err) {
        if (err) {
            console.log(err);
            return res.status(500).json({ erro: 'Erro ao alterar cliente' });
        }
        res.json({ mensagem: 'Cliente alterado com sucesso' });
    });
}   );

app.get('/allClientes', function (req, res) {
    const sql = 'SELECT * FROM clientes';

    pool.query(sql, function (err, resultados) {
        if (err) {
            console.log(err);
            return res.status(500).json({ erro: 'Erro ao listar clientes' });
        }
        res.json(resultados);
    });
});


app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
