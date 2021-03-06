var express = require('express');
var bodyParser = require('body-parser');//для ПОСТ запросов
var MongoClient = require('mongodb').MongoClient;

var app = express();//наш веб сервер
var db;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

//working with database - task by id
app.get('/tasks/:taskName', function (req, res) {
    db.collection('tasks').findOne({ taskName: req.params.taskName}, function (err, doc) {
        if (err){
            console.log(err);
            return res.sendStatus(500);
        }
        res.send(doc);
    })
});

//working with database - add task
app.post('/tasks/add', function (req, res) {
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
app.get('/tasks/delete/:taskName', function (req, res) {
    db.collection('tasks').deleteOne({taskName: req.params.taskName}, function (err, docs) {
        if (err){
            console.log(err);
            return res.sendStatus(500);
        }
        res.sendStatus(200);
    })
});

//working with database - edit task
app.post('/tasks/:taskName/edit', function (req, res) {
	console.log(req.body.oldTaskName + ' responce');
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

//app.listen(3000, function(){ console.log('YEEEE');});

MongoClient.connect('mongodb://127.0.0.1:27017/myapi',  { useNewUrlParser: true } ,function (err, database) {
    if (err){
        return console.log(err);
    }
    db = database.db('myapi');
    app.listen(3012, function () {
        console.log('API app started');
    });
});




//для работы с массивом
// app.get('/tasks',function (req, res) {
//     res.send(tasks);
// });

//для работы с массивом
// app.get('/tasks/:id', function (req, res) {
//     var task = tasks.find(function (task) {
//         return task.id === Number(req.params.id);
//     });
//     res.send(task);
// });

//для работы с массивом
// app.post('/tasks/add', function (req, res) {
//     console.log(req.body);
//     var task = {
//         id: tid++,
//         title: req.body.title,
//         deadline: req.body.deadline,
//         area: req.body.area
//     };
//     tasks.push(task);
//     res.send(tasks);
// });

//для работы с массивом
// app.post('/tasks/:id/edit', function (req, res) {
//     console.log(req.body);
//     var task = tasks.find(function (task) {
//         return task.id === Number(req.params.id)
//     });
//     task.title = req.body.title;
//     task.deadline = req.body.deadline;
//     task.area = req.body.area;
//     res.send(tasks);
// });

// app.listen(8000, function () {
//    console.log('API app started');
// });

// var tasks = [
//     {
//         id: tid++,
//         title: 'first task',
//         deadline: '20.12.19',
//         area: 'personal'
//     },
//     {
//         id: tid++,
//         title: 'second task',
//         deadline: '02.05.19',
//         area: 'personal'
//     },
//     {
//         id: tid++,
//         title: 'third task',
//         deadline: '11.11.19',
//         area: 'work'
//     },
//     {
//         id: tid++,
//         title: 'forth task',
//         deadline: '01.01.19',
//         area: 'work'
//     }
// ];
