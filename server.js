var express = require('express');
var bodyParser = require('body-parser');//для ПОСТ запросов
// var MongoClient = require('mongodb').MongoClient;
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var dbConfig = require('db');
var mongoose = require('mongoose');
mongoose.connect(dbConfig.url);

var app = express();//наш веб сервер
var db;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));
app.use(cookieParser());






// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

var routes = require('./routes/index')(passport);
app.use('/', routes);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

module.exports = app;

//app.listen(3000, function(){ console.log('YEEEE');});

// MongoClient.connect('mongodb://127.0.0.1:27017/myapi',  { useNewUrlParser: true } ,function (err, database) {
//     if (err){
//         return console.log(err);
//     }
//     db = database.db('myapi');
//     app.listen(3012, function () {
//         console.log('API app started');
//     });
// });
//
//

