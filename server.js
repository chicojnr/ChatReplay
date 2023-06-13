const express = require('express');
const fs = require('fs');
const ytcomments = require('./_app/youtube-comment');
// const { spawn } = require('child_process');
// const ytdl = require('./_app/ytdl');
const axios = require('axios');
const app = express();
const port = 3338;




// app.get('/downloadvideo', function (req, res) {
//   ytdl.download('HtDX3hTulVg')
//     .then(video => {
//       return res.status(200).json(video);
//     });
// });

// app.get('/downloadvideomaxres', async (req, res) => {

//   try {
//     const result = await ytdl.downloadMaxRes(req.query.videoId);
//     res.send(result);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ error: 'Something went wrong!' });
//   }
// });

// async function getLiveChatPy(pLiveId, pLiveChatId = null) {
//   try {
//     axios.get(`https://chatreplay.onrender.com/?id=${pLiveId}`)
//       .then(response => {
//         const captionData = response.data;
//         return captionData;
//       })
//       .catch(error => {
//         console.error('Erro na solicitação:', error);
//       });
//     const result = ''
//   } catch (err) {
//     console.error(err);
//   }
// }

// app.get('/chatbyliveid', async (req, res) => {
//   const videos = await JSON.parse(fs.readFileSync(`./_app/_downloads/chat/chat_${req.query.liveId}.json`));
//   res.send(videos)
// })

app.get('/getchat', async (req, res) => {
  try {
    //axios.get(`http://127.0.0.1:5000/?id=${req.query.videoId}`)
    axios.get(`https://chatreplay.onrender.com/?id=${req.query.videoId}`)
      .then(response => {
        const data = response.data;
        return res.send(data);
      })
      .catch(error => {
        console.error('Erro na solicitação:', error);
      });
    const result = ''
  } catch (err) {
    console.error(err);
  }
});

app.get('/getcomment', async (req, res) => {
  const comments = await ytcomments.getComments(req.query.videoId);
  console.log(comments)
  return res.send(comments);
});

app.get('/essentials', async (req, res) => {
  // const dlVideos = await fs.promises.readdir('./public/videos');
  // const videos = await JSON.parse(fs.readFileSync('./_app/_downloads/video_details.json'));
  const jumentos = await JSON.parse(fs.readFileSync('./_app/_essentials/jumentos.json'));
  const emojis = await JSON.parse(fs.readFileSync('./_app/_essentials/emojis.json'));

  // console.log(comments)
  // let chatToImport = []
  // const fileNames = await fs.promises.readdir('./_app/_imports');
  // if (fileNames.length > 0) {
  //   fileNames.forEach((e) => {
  //     chatToImport.push({
  //       'value': e,
  //       'text': e
  //     });
  //   })
  // }
  const essentials = {
    //'videos': videos,
    'jumentos': jumentos,
    'emojis': emojis
    //'chatToImport': chatToImport,
    //'dlVideos': dlVideos
  }
  res.send(essentials)
})

app.get('/', async (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

app.use(express.static('public'));
app.use((req, res) => {
  res.status(404).send('Página não encontrada.');
});

app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}.`);
});