const express = require('express')
const app = express();
const PORT = 3000;
const path = require('path');
const fs = require('fs');


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.listen(PORT, () => {
    console.log(`Servidor da DevBurger rodando em localhost:${PORT}`);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/index.html'));
});

app.get('/sugestao', (req, res) => {
    const nome = req.query.nome;
    const ingredientes = req.query.ingredientes;

    res.status(200).send(`
      <!DOCTYPE html>
      <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Obrigado pela sugestão! - DevBurger</title>
            <link rel="stylesheet" href="/css/style.css">
        </head>
        <body>
            <div class = "container">
                <h1>Agradecemos muito por sua participação!</h1>
                <p>Sua sugestão já está em nosso sistema: </p>
                <p>Nome - ${nome}</p>
                <p>Ingredientes - ${ingredientes}</p>
                <p>
                    <a href="/">Voltar para a página inicial</a></p>
                </p>
            </div>
        </body>
      </html>
      `
    )
});

app.get('/contato', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '/views/contato.html'));  
})


app.post('/contato',(req, res) => {
  const nome = req.body.nome;
  const email = req.body.email;
  const assunto = req.body.assunto;
  const mensagem = req.body.mensagem;

  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Contato Recebido - DevBurguer</title>
            <link rel="stylesheet" href="/css/style.css">
        </head>
        <body>
            <div class = "container">
                <h1>Mensagem recebida com sucesso!</h1>
                <h2> Ola <strong>${nome}</strong>! Tudo bem?</h2><br>
                <p>Obrigado por entrar em contato conosco!</p><br>
                <p>Recebemos sua mensagem com o assunto de <strong>${assunto}</strong> e vamos analisá-la com carinho. Se necessário, entraremos em contato pelo email <strong>${email}</strong>.</p>
                <p>Caso queira revisar o conteudo de sua mensagem: <br>
                <strong>${mensagem}</strong>
                </p>
                <p>Enquanto isso, que tal voltar para o nosso <strong><a href="/">cardápio</a></strong> e conferir os nossos deliciosos lanches?</p>
            </div>
        </body>

    </html>
  `)
})


app.get('/api/lanches', (req, res) => {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'public', 'data', 'lanches.json'));
    const cardapio = JSON.parse(data);
    return res.status(200).json(cardapio);
  } catch (err) {
    console.error('Erro ao ler o cardápio:', err);
    return res.status(500).json({
      error: 'Não foi possível ler o cardápio de lanches'
    });
  }
});

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public/404.html'));
});
