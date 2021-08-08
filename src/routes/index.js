const express = require('express');
const router = express.Router();

var Scraper = require('images-scraper');

const google = new Scraper({
  puppeteer: {
    headless: false,
  },
  safe: true  // enable/disable safe search
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
      const results = await google.scrape(data.topic, 1000);

      if (data.filter === 'true') {
        console.log('FILTERED');
        const filteredResults = [];

        for (let i = 0; i < results.length; i++) {
          if(results[i].url.includes('lookaside.fbsbx.com') || results[i].url.includes('i.ytimg.com')) {
            console.log('YOUTUBE AND FACEBOOK FOUNDED');
          }
          else {
            if(results[i].url.includes('dopl3r.com'))
              console.log('Dopler Encontrado en ' + results[i].url);
            filteredResults.push(results[i]);
          }
            
        }
        return filteredResults;

      } else {
        console.log('NOT FILTERED');
        return results;
      }
    }

    const urls = await results();

    /*for (let i = 0; i < urls.length; i++) {
      console.log(i + ' ' + urls[i].url);
    }*/

  res.render('searching.html', { results: urls }); 
});

module.exports = router;