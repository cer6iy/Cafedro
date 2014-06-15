/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http'),
    path = require('path');

var app = express();

/**
 * App configuration.
 */

// development only

app.configure('development', function () {
    app.set('port', process.env.PORT || 9000);
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
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

var office = require('office');
office.parse('spreadsheet.ods', function(err, data) {
    console.log(data.sheets);
});


http.createServer(app).listen(9000, function () {
    console.log('Express server listening on port 9000');
});
