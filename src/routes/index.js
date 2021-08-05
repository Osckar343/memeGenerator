const express = require('express');
const router = express.Router();

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
  
    async function results () {
        return google.scrape(data.topic, 250);
    }

    const urls = await results();

    for (let i = 0; i < urls.length; i++) {
      console.log(i + ' ' + urls[i].url);
    }

    console.log(urls);

  res.render('searching.html', { results: urls }); 
});

module.exports = router;