const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')
const cors = require('cors')
const bodyParser = require("body-parser");
const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/src', express.static('src'))

const domain = "https://telegra.ph/"

app.get('/', (req, res) => {
  res.sendFile("index.html", { root: '.' })
})

app.get('/api/push-token', (req, res) => {
  console.log(req.body);
})

app.post('/api/post_images', (req, res) => {
  const url = req?.body?.url
  axios(url).then((response) => {
    const $ = cheerio.load(response.data);
    const pic = [];
    const pictures = $('figure');
    const title = folderNamePreprocess($('title').text());
    for (let i = 0; i < pictures.length; i++) {
      let src = domain + pictures[i.toString()].children[0].attribs.src;
      pic.push({ src: src, title: title });
    }
    res.status(400).json({ message: 'success', result: pic })
  }).catch((e) => {
    res.status(400).json({ message: e, result: {} })
  })
})

const folderNamePreprocess = (folder_name) => {
  folder_name = folder_name.replace(/[ |?<\\*:"']/g, '');
  return folder_name;
}

app.listen(process.env.PORT || 3000)
