const express = require('express');
const router = express.Router();

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const fs = require('fs');

var Scraper = require('images-scraper');

const google = new Scraper({
  puppeteer: {
    headless: false,
  },
});

router.get('/', (req, res) => {
    res.render('index.html', { title: 'First Website' }); 
});

router.post('/searching', async (req, res) => {

  var data = {
    topic : req.body.topic,
    language : req.body.language,
    filter: req.body.filter
  }

    console.log(data);
    console.log(data.file);
    console.log(data.file.content);

    async function results () {
      const results = await google.scrape(data.topic, 1000);

      if (data.filter === 'true') {
        console.log('FILTERED');
        const filteredResults = [];

        for (let i = 0; i < results.length; i++) {
          if(results[i].url.includes(',')) {
            filteredResults.push(results[i]);
          }
          /*if(results[i].url.includes('lookaside.fbsbx.com') || results[i].url.includes('i.ytimg.com')) {
            console.log('YOUTUBE AND FACEBOOK FOUNDED');
          } else {
            if(results[i].url.includes('dopl3r.com'))
              console.log('Dopler Encontrado en ' + results[i].url);
            filteredResults.push(results[i]);
          }*/
            
        }
        return filteredResults;

      } else {
        console.log('NOT FILTERED');
        return results;
      }
    }

    //const urls = await results();

    const info = {
      topic: data.topic,
      //results: urls
    }

  res.render('searching.html', { info: info }); 
});

router.get('/upload', (req, res) => {
  res.render('upload.html', { title: 'First Website' }); 
});

router.post('/upload', upload.array('file', 50), function (req, res, next) {

  var html = '';
  for (let i = 0; i < req.files.length; i++) {
    console.log(req.files[i].originalname);
    let data = fs.readFileSync(req.files[i].path,'utf8');

    const info = data.toString();
    const arrayUrls = info.split(',');

    for (let i = 0; i < arrayUrls.length; i++) {
      arrayUrls[i] =  arrayUrls[i].replace(/¿/g,','); 
    }

    //Upload to database.
    console.log(arrayUrls);
    html += '<h2>' + req.files[i].originalname + '<h2>';
  }

  res.send(html);
});

module.exports = router;