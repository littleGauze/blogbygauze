var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var url = require('url');
var ejs = require('ejs');
var utils = require('./common/Utils');
var config = require('./common/config');
var app = express();

//routes
var index = require('./routes/index');
var searches = require('./routes/searches');
var myinfos = require('./routes/myinfos');
var aboutme = require('./routes/aboutme');
var register = require('./routes/register');
var settings = require('./routes/settings');
var qiniu = require('./routes/qiniu-api');
var login = require('./routes/login');
var logout = require('./routes/logout');
var publish = require('./routes/publish');
var zone = require('./routes/zone');
var message = require('./routes/message');

app.set('port', (process.env.PORT || 5000));
app.set('views', __dirname + '/views');
app.engine(".html", ejs.__express);
app.set('view engine', 'html');

app.use(session({
	secret: 'nealli',
	resave: false,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next){
	req.auth = utils.getAuth(32, config.token);
	res.locals.bucketLocation = config.qiuiUrl + '/';
	res.locals.userinfo = req.session.userinfo || '';
	res.locals.url = req.path;
	next();
});

app.use('/', index);
app.use('/searches', searches);
app.use('/myinfos', myinfos);
app.use('/aboutme', aboutme);
app.use('/register', register);
app.use('/settings', settings);
app.use('/qiniu', qiniu);
app.use('/login', login);
app.use('/logout', logout);
app.use('/publish', publish);
app.use('/zone', zone);
app.use('/message', message);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});