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

// cadastrar pizza
app.post('/pizza', function (req, res) {
    const dados = req.body;

    if (!dados.sabor){
        return res.status(400).json({ erro: 'Sabor é obrigatório' });
    }

    const sql = 'INSERT INTO pizzas (sabor, imagem, ingredientes, preco) VALUES (?, ?, ?, ?)';

    pool.query(sql, [dados.sabor, dados.imagem, dados.ingredientes, dados.preco], function (err) {
        if (err) {
        console.log(err);
        return res.status(500).json({ erro: 'Erro ao cadastrar pizza' });
        }
        res.json({ mensagem: 'Pizza cadastrada com sucesso' });
    });
});

app.get('/consultarPizza', function (req, res) {
    const sabor= req.query.sabor; 
    const preco= req.query.preco;

    const sql = 'SELECT * FROM pizzas WHERE nome = ? AND telefone = ?';

    pool.query(sql, [sabor, preco], function (err, resultados) {
        if (err) {
            console.log(err);
            return res.status(500).json({ erro: 'Erro ao consultar pizza' });
        }
        res.json(resultados);
    });
});

app.patch('/desativarPizza/:id', function (req, res) {
    const id = req.params.id;
    const sql = 'UPDATE pizzas SET status = ? WHERE id = ?';

    pool.query(sql, ['inativo', id], function (err) {
        if (err) {
            console.log(err);
            return res.status(500).json({ erro: 'Erro ao desativar pizza' });
        }
        res.json({ mensagem: 'Pizza desativada com sucesso' });
    });
});

app.put('/alterarPizza/:id', function (req, res) {
    const id = req.params.id;
    const dados = req.body;

    const sql = 'UPDATE pizzas SET sabor = ?,imagem  = ?, ingredientes = ?, preco = ? WHERE id = ?';

    pool.query(sql, [dados.sabor, dados.imagem, dados.ingredientes, dados.preco, id], function (err) {
        if (err) {
            console.log(err);
            return res.status(500).json({ erro: 'Erro ao alterar pizza' });
        }
        res.json({ mensagem: 'Pizza alterada com sucesso' });
    });
}   );

app.get('/allPizzas', function (req, res) {
    const sql = 'SELECT * FROM pizzas';
    
    pool.query(sql, function (err, resultados) {
        if (err) {
            console.log(err);
            return res.status(500).json({ erro: 'Erro ao listar pizzas' });
        }
        res.json(resultados);
    });

});
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
