var Scraper = require('images-scraper');

const google = new Scraper({
    userAgent: 'Mozilla/5.0 (X11; Linux i686; rv:64.0) Gecko/20100101 Firefox/64.0',
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
            filter: req.body.filter,
            search: ''
        }
        console.log(data);

        /*Define the language*/
        if(data.language === 'ES') data.search = `Memes de ${data.topic} en español`;
        else if(data.language === 'EN') data.search = `Memes of ${data.topic}`;
          
        const urls = await searcher(data);

        return info = {
            topic: data.topic,
            language: data.language,
            results: urls
        }
    },

    upload: async function (req) {
        return manageData(req);
    }
}


async function searcher(data) {
    const results = await google.scrape(data.search, 1000);
    
    if (data.filter === 'true') {
        const filteredResults = [];
        for (let i = 0; i < results.length; i++) {
            if( !(results[i].url.includes('lookaside.fbsbx.com') || results[i].url.includes('i.ytimg.com')) ) //These links are filtered
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
    const language = files[index].originalname.slice(0, 2); //Only get the first 2 characters (ES/EN)
    const dataFile = fs.readFileSync(files[index].path,'utf8'); //Gets info from the generated file
    const arrayUrls = dataFile.toString().split(','); //Converts the dataFile in a text (string) and divides each url into an element of an array


    console.log('ExtractData');
    console.log(topic);
    console.log(arrayUrls);
    console.log(language);
    return {
        topic: topic, language: language, urls: arrayUrls
    };
}


async function languages() {
    await database.insertLanguages();
    console.log('Languages has been added');
    //message.channel.send('Languages has been saved');
}

async function storingDataOnDatabase(data) {

    //await languages();
    try {
        const databaseLanguage = await database.checkLanguage(data.language);
        const databaseTopic = await database.verifyTopic(data.topic);

        const databaseLanguageTopics = await database.verifyLanguageTopics(databaseLanguage, databaseTopic);

        const urls = await database.insertUrls(databaseLanguageTopics, data.urls);

        console.log(databaseTopic);
        console.log(databaseLanguage);
        console.log('Id topic is: ' + databaseTopic.id);
        console.log('Id Language is: ' + databaseLanguage.id);
        console.log(databaseLanguageTopics);
        console.log(urls);
        console.log(`Topic ${data.topic} was uploaded to database`);
    } catch (error) {
        console.log(error.name);
    }

    //Id Topic
    //Id Language

    //for (let i = 0; i < arrayUrls.length; i++) {
        //database.verifyTopic(topic);
        //console.log(`Topic ${topic} was uploaded to database`);
    //}
}



