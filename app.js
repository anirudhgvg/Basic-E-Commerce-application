
/**
 * Module dependencies.
 */

var express = require('express');
var session = require('express-session');
var routes = require('./routes');
var newuser = require('./routes/newuser');
var user = require('./routes/user');
var admin = require('./routes/admin');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized:true,
    cookie: {
        path: '/',
        httpOnly: true,
        secure: false,
        maxAge: 15*60*1000
    },
}))
app.use(app.router);

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.loaduserHomepage);
app.get('/login', routes.loadLoginpage);
app.post('/login', newuser.loadPostLoginpage);
app.get('/register', routes.loadSignuppage);
app.post('/register', newuser.loadPostRegisterpage);
app.get('/vp', routes.loadviewProducts);
app.get('/logout', routes.loaduserHomepage);

app.get('/loggedUser', routes.loadLoggedUser);
app.get('/userUP', user.loaduserUpdateProfile);
app.post('/userUP', user.loaduserPostUpdateProfile);
app.get('/userVP', user.loaduserViewProducts);

app.get('/adminHomepage', routes.loadadminHomepage);
app.get('/adminMP', admin.loadadminModifyProducts);
app.post('/adminPostMP', admin.loadadminPostModifyProducts);
app.get('/adminVP', admin.loadadminViewProducts);
app.get('/adminVU', admin.viewUsers);


http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
