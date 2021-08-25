var Scraper = require('images-scraper');

const google = new Scraper({
    puppeteer: {
      headless: false,
    },
  });

const database = require('../database/queries.js');
const fs = require('fs');

module.exports = {

    searching: async function (req) {
        var data = { //Getting data from form request
            topic : req.body.topic,
            language : req.body.language,
            filter: req.body.filter
          }
          console.log(data);
        
          const urls = await searcher(data);
          return info = {
            topic: data.topic,
            results: urls
          }
    },

    upload: async function (req) {
        return manageData(req);
    }
}

async function searcher(data, index) {
    const results = await google.scrape(data.topic, 1000);
          
    if (data.filter === 'true') {
        const filteredResults = [];
        for (let i = 0; i < results.length; i++) {
            if( !(results[index].url.includes('lookaside.fbsbx.com') || results[i].url.includes('i.ytimg.com')) ) //These links are filtered
                filteredResults.push(results[i]);                   
        }
        return filteredResults;

    } else {
        return results;    
    }                     
}

async function manageData(req) {
    let html = '';
    const files = req.files;

    for (let i = 0; i < files.length; i++) {
       const data = extractData(files, i);

        for (let i = 0; i < data.urls.length; i++) 
            data.urls[i] =  data.urls[i].replace(/¿/g,','); //If an url has a '¿', turns into a ','
           
        await storingDataOnDatabase(data);
        html += '<h2>' + data.topic + '<h2>';
    }
    return html;
}

function extractData (files, index) {
    const topic = files[index].originalname.slice(3, files[index].originalname.length - 4); //Delete the language 'ES ' and the extension '.txt'
    const dataFile = fs.readFileSync(files[index].path,'utf8'); //Gets info from the generated file
    const arrayUrls = dataFile.toString().split(','); //Converts the dataFile in a text (string) and divides each url into an element of an array

    console.log('ExtractData');
    console.log(topic);
    console.log(arrayUrls);
    return {
        topic: topic, urls: arrayUrls 
    };
}

async function storingDataOnDatabase(data) {
    database.verifyTopic(data.topic);
    console.log(`Topic ${data.topic} was uploaded to database`);
    //for (let i = 0; i < arrayUrls.length; i++) {
        //database.verifyTopic(topic);
        //console.log(`Topic ${topic} was uploaded to database`);
    //}
}



