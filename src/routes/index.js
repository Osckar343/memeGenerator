const express = require('express');
const router = express.Router();

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const fs = require('fs');

require('../../database/associations.js');
const database = require('../../database/queries.js');

const tools = require('../functionalities.js');

router.get('/', (req, res) => {
    res.render('index.html', { title: 'First Website' }); 
});

router.post('/searching', async (req, res) => {
  const info = await tools.searching(req);
  res.render('searching.html', { info: info }); 
});

router.get('/upload', async function (req, res) {
  const categories = await tools.getCategoriesFromDatabase();
  console.log(categories);
  res.render('upload.html', { info: categories }); 
});

router.post('/upload', upload.array('file', 100), async function (req, res, next) {
  //console.log(req);
  const html = await tools.upload(req);
  res.send(html);
});

router.get('/category', async function (req, res) { 
  res.render('category.html'); 
}); 

router.post('/category', async function (req, res, next) {
  var POST = {}; //This works with AJAX 
    if (req.method == 'POST') {
        req.on('data', async function(data) {
            data = data.toString();
            data = data.split('&');
            for (var i = 0; i < data.length; i++) {
                var _data = data[i].split("=");
                POST[_data[0]] = _data[1];
            }

            const html = await tools.uploadCategory(POST);
            res.send(html);
        })
    }
});

module.exports = router;

