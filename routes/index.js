var express = require('express');
var router = express.Router();
var dbConfig = require('db');
var mongoose = require('mongoose');
mongoose.connect(dbConfig.url);

var isAuthenticated = function (req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/');
};

module.exports = function(passport){

  /* GET login page. */
  router.get('/', function(req, res) {
    // Display the Login page with any flash message, if any
    res.render('index', { message: req.flash('message') });
  });

  /* Handle Login POST */
  router.post('/login', passport.authenticate('login', {
    successRedirect: '/home',
    failureRedirect: '/',
    failureFlash : true
  }));

  /* GET Registration Page */
  router.get('/signup', function(req, res){
    res.render('register',{message: req.flash('message')});
  });

  /* Handle Registration POST */
  router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/home',
    failureRedirect: '/signup',
    failureFlash : true
  }));

  /* GET Home Page */
  router.get('/home', isAuthenticated, function(req, res){
    res.render('home', { user: req.user });
  });

  /* Handle Logout */
  router.get('/signout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  //working with database - task by id
  router.get('/tasks/:taskName', function (req, res) {
    db.collection('tasks').findOne({ taskName: req.params.taskName}, function (err, doc) {
      if (err){
        console.log(err);
        return res.sendStatus(500);
      }
      res.send(doc);
    })
  });

//working with database - add task
  router.post('/tasks/add', function (req, res) {
    var task = {
      taskName: req.body.taskName,
      taskType: req.body.taskType,
      taskDate: req.body.taskDate,
      taskIsComplete: req.body.taskIsComplete
    };

    db.collection('tasks').insertOne(task, function(err, result){
      if (err){
        console.log(err);
        return res.sendStatus(500);
      }
      res.send(task);
    })
  });

//working with database - delete task
  router.get('/tasks/delete/:taskName', function (req, res) {
    db.collection('tasks').deleteOne({taskName: req.params.taskName}, function (err, docs) {
      if (err){
        console.log(err);
        return res.sendStatus(500);
      }
      res.sendStatus(200);
    })
  });

//working with database - edit task
  router.post('/tasks/:taskName/edit', function (req, res) {
    db.collection('tasks').updateOne({ taskName: req.body.oldTaskName},
        { $set: {id: req.body.id, taskName: req.body.taskName, taskType: req.body.taskType, taskDate: req.body.taskDate, taskIsComplete: req.body.taskIsComplete}},
        function (err, doc) {
          if(err){
            console.log(err);
            return res.sendStatus(500);
          }
          res.sendStatus(200);
        })
  });

  router.get('/',function (req, res) {
    res.send('<h1>Hello</h1>');
  });

//working with database - lists of tasks
  router.get('/tasks',function (req, res) {
    db.collection('tasks').find().toArray( function (err, docs) {
      if(err){
        console.log(err);
        return res.sendStatus(500);
      }
      res.send(docs);
    })
  });
  return router;
};