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



app.get('/',function (req, res) {
    res.send('<h1>Hello</h1>');
});

//working with database - lists of tasks
app.get('/tasks',function (req, res) {
    db.collection('tasks').find().toArray( function (err, docs) {
        if(err){
            console.log(err);
            return res.sendStatus(500);
        }
        res.send(docs);
    })
});



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

