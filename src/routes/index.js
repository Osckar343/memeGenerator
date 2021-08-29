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

router.get('/upload', (req, res) => {
  res.render('upload.html', { title: 'First Website' }); 
});

router.post('/upload', upload.array('file', 100), async function (req, res, next) {
  const html = await tools.upload(req);
  res.send(html);
});

module.exports = router;

