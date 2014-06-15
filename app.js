/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http'),
    path = require('path'),
    dbStorage = require('connect-mongo')(express),
    user = require('routes/user/index'),
    auth = require('routes/user/auth'),
    conf = require('config');

var app = express();

/**
 * App configuration.
 */

// development only

app.configure('development', function () {
    app.set('port', process.env.PORT || conf.get("dev:port"));
    app.use(express.logger('dev'));
    app.use(express.errorHandler());
})

// all environments

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.cookieParser());
app.use(express.session({
    secret: 'top_DSCSDFW4RCDSVF45VDSVFFGGVVE5F_secret',
    store: new dbStorage({
        url: conf.get('dev:mongoose:uri'),
         collection : 'sessions'
    })
}))
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


function restrictAccess(req, res, next) {
    auth.LoadUser(req.session.user_id, function (user) {
        if (user) {
            req.currentUser = user;
            return next();
        } else {
            res.redirect('/login');
        }
    });
}

app.get('/', restrictAccess, user.index);
app.get('/login', user.login);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
