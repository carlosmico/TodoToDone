const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const Task = require('./model/task');

//Configuración para poder parsear el body de la request
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json())

//Conexión con la bd
mongoose.connect("mongodb://localhost:27017/TasksDB", { useCreateIndex: true, useNewUrlParser: true }).then((() => console.log("Conexión con la BD establecida!"))).catch(err => console.log(`Error al conectar con la BD: ${err}`));

//Evitamos el CORSS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS, PATCH');
    next();
});

//Endpoint para obtener todas las Tasks
app.get('/all', (req, res) => {
    Task.find({}).then(tasks => res.send(tasks)).catch(err => res.status(500).send(err));
});

//Endpoint para crear una nueva Task
app.post('/addTask', (req, res) => {
    let task = req.body;

    new Task(task).save().then(taskInserted => res.send(taskInserted)).catch(err => res.status(500).send(err));
});

//Endpoint para actualizar una Task

//Endpoint para eliminar una Task


app.listen(2607);