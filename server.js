const express = require('express');
const fs = require('fs');
const ytcomments = require('./_app/youtube-comment');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
var cron = require('node-cron');

cron.schedule('*/14 * * * *', () => {
  axios.get('https://chatreplayapi.onrender.com/')
    .then(response => {
      console.log('Server is up and running');
      // Faça o que desejar com a resposta do servidor aqui
    })
    .catch(error => {
      console.log('Server is down');
      // Faça o que desejar em caso de erro (servidor inacessível) aqui
    });

    axios.post('https://ytjwtlogin.onrender.com/api/users/login', {
      email: 'email',
      password: 'password'
    })
      .then(response => {
        console.log('Login Server is up and running');
        // Faça o que desejar com a resposta do servidor aqui
      })
      .catch(error => {
        console.log('Login Server is down');
        // Faça o que desejar em caso de erro (servidor inacessível) aqui
      });
});

const app = express();
const port = 3338;

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

app.get('/', async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.sendFile(__dirname + '/login.html'); // Redireciona para a página de login se o token não estiver presente nos cookies
  }

  jwt.verify(token, 'randomstring', (err, decoded) => {
    if (err) {
      console.error('Erro na verificação do JWT:', err);
      return res.sendFile(__dirname + '/login.html'); // Redireciona para a página de login se o token for inválido
    }

    console.log('Autenticado!');
    res.sendFile(__dirname + '/index.html'); // Renderiza a página index.html se o token for válido
  });
});

app.post('/auth', (req, res) => {
  const { email, password } = req.body;
  axios.post('https://jwtlogin.onrender.com/api/users/login', {
    email: email,
    password: password
  })
    .then(response => {
      const data = response.data;
      const jwtToken = data; // Recebe o JWT da resposta da API
      res.cookie('token', jwtToken, { httpOnly: true });
      jwt.verify(jwtToken, 'randomstring', (err, decoded) => {
        if (err) {
          console.error('Erro na verificação do JWT:', err);
          return res.status(500).json({ error: 'Erro na autenticação' });
        }
        console.log(email + ' Autenticado!');
        res.json({ jwt: jwtToken });
      });
    })
    .catch(error => {
      console.error('Erro:', error);
      res.status(500).json({ error: 'Erro na requisição de login' });
    });
});

app.get('/getchat', async (req, res) => {
  try {
    axios.get(`https://chatreplay.onrender.com/?id=${req.query.videoId}`)
      .then(response => {
        const data = response.data;
        return res.send(data);
      })
      .catch(error => {
        console.error('Erro na solicitação:', error);
        res.status(500).send('Erro na solicitação');
      });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro interno do servidor');
  }
});

app.get('/getcomment', async (req, res) => {
  try {
    const comments = await ytcomments.getComments(req.query.videoId);
    return res.send(comments);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro interno do servidor');
  }
});

app.get('/essentials', async (req, res) => {
  try {
    const jumentos = await JSON.parse(fs.readFileSync('./_app/_essentials/jumentos.json'));
    const emojis = await JSON.parse(fs.readFileSync('./_app/_essentials/emojis.json'));
    const essentials = {
      'jumentos': jumentos,
      'emojis': emojis
    }
    res.send(essentials);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro interno do servidor');
  }
});

app.use((req, res) => {
  res.status(404).send('Página não encontrada.');
});

app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}.`);
});
