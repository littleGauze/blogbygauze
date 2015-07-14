var express = require('express');
var url = require('url');
var ejs = require('ejs');
var app = express();

var index = require('./routes/index');
var myfallows = require('./routes/myfallows');
var myinfos = require('./routes/myinfos');
var aboutme = require('./routes/aboutme');

app.set('port', (process.env.PORT || 5000));
app.set('views', __dirname + '/views');
app.engine(".html", ejs.__express);
app.set('view engine', 'html');

app.use(express.static(__dirname + '/public'));

app.use('/', index);
app.use('/myfallows', myfallows);
app.use('/myinfos', myinfos);
app.use('/aboutme', aboutme);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});