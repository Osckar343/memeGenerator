var Scraper = require('images-scraper');

const google = new Scraper({
    userAgent: 'Mozilla/5.0 (X11; Linux i686; rv:64.0) Gecko/20100101 Firefox/64.0',
    puppeteer: {
      headless: false,
    },
    safe: false,  // enable/disable safe search
    scrollDelay: 250,
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
        console.log('tHIS EKISDE' , google.tbs);

        /*Define the language*/
        if(data.language === 'ES') data.search = `Memes de ${data.topic}`;
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
    const results = await google.scrape(data.search , 1000);

    if (data.filter === 'true') {
        const filteredResults = [];
        for (let i = 0; i < results.length; i++) {
            if( results[i].url.length < 255 && !(results[i].url.includes('lookaside.fbsbx.com') || results[i].url.includes('i.ytimg.com')) ) //These links are filtered
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
           
        html += await storingDataOnDatabase(data);
    }
    return html;
}

function extractData (files, index) {
    const topic = files[index].originalname.slice(3, files[index].originalname.length - 4); //Delete the language 'ES ' and the extension '.txt'
    const codeLanguage = files[index].originalname.slice(0, 2); //Only get the first 2 characters (ES/EN)
    const dataFile = fs.readFileSync(files[index].path,'utf8'); //Gets info from the generated file
    const arrayUrls = dataFile.toString().split(','); //Converts the dataFile in a text (string) and divides each url into an element of an array

    let language = '';
    if(codeLanguage === 'ES') language = 'Spanish';
    else if(codeLanguage === 'EN') language = 'English';
    
    return {
        topic: topic, language: language, codeLanguage: codeLanguage, urls: arrayUrls, originalname: files[index].originalname,
    };
}

async function languages() {
    await database.insertLanguages();
    console.log('Languages has been added');
}

async function storingDataOnDatabase(data) {
    try {
        const databaseLanguage = await database.checkLanguage(data.codeLanguage);

        if(!databaseLanguage)
            return `<p class="error"> <b>${data.originalname}</b> does not have a valid language</p>`;

        if(data.urls.length <= 1)
            return `<p class="warning"> <b>${data.originalname}</b> file is empty</p>`;

        const databaseTopic = await database.verifyTopic(data.topic);
        
        const databaseLanguageTopics = await database.verifyLanguageTopics(databaseLanguage, databaseTopic); //Saves data.
        const amountResults = await database.insertUrls(databaseLanguageTopics, data.urls);

        if(amountResults === 0)
            return `<p class="warning"> <b>${data.topic}</b> (${data.language}) did not have results to upload</p>`;
        else if(amountResults >= 1 )
            return `<p class="uploaded"> <b>${data.topic} (${data.language})</b> uploaded with ${amountResults} results</p>`;

    } catch (error) {
        console.log(error);
        console.log('There was an error uploading the data to the database' + error.name);
        return `<p class="error"> <b>${data.originalname}</b> Failed (Error: ${error.name}, ${error.message}) </p>`;
    }
}



