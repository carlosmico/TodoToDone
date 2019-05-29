const mongoose = require('mongoose');

//Esquema para el modelo de las tareas
const taskSchema = new mongoose.Schema({
    name: String,
    creationDate: String,
    description: String,
    member: Boolean,
    comments: []
});

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;