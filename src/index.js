const express = require('express');
var parser = require('body-parser');
const path = require('path');
const app = express();

app.use(parser.urlencoded({ extended: false }))
app.use(parser.json())


// settings
app.set('port', 3000); 
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

//routes
const indexRoute = require('./routes');

app.use(require('./routes'));

app.use(express.static(path.join(__dirname, 'public')));

app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port') );
})
