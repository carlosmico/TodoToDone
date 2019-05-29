let tasksArray = [];
let taskObj;
let listaTareas;

let taskNameTemp;

document.addEventListener('DOMContentLoaded', () => {
    console.log('Ya he cargado el DOM');

    let input = document.querySelector('.input');

    input.addEventListener('keyup', event => {
        input.placeholder = "Add task...";
        input.classList.remove("inputError");

        if (event.keyCode === 13) {
            listaTareas = document.querySelector('.todo :nth-child(2)');

            let nombreTarea = event.target.value;

            if (nombreTarea === "") {
                if (input.classList[input.classList.item - 1] !== "inputError") {
                    input.classList.add("inputError");
                }

                input.placeholder = "The taskname can't be empty!";
            } else {
                //Creamos y añadimos la tarea al DOM y la BD
                createTask(nombreTarea);

                event.target.value = "";
            }
        }
    });

    //Evento para la ventana modal
    let modal = document.querySelector(".ventanaDetalleOut");

    modal.addEventListener("click", event => {
        if (event.target.className === "ventanaDetalleOut") {
            modal.style.display = "none";
        }
    });
});

const createTask = (taskName) => {
    var task;

    //Creamos la tarea en la BD
    fetch(`http://localhost:2607/addTask`, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(new Task(taskName, new Date().toGMTString()))
        }).then(res => res.json()).then((taskInserted) => {
            console.log('Tarea creada en la BD correctamente!');
            console.log(taskInserted)

            taskObj = taskInserted;

            tasksArray.push(taskObj);

            //Tarjeta/Enlace contenedora de la tarea
            task = document.createElement("a");
            task.classList.add('task');
            task.setAttribute("id", taskObj._id);
            task.setAttribute("href", `#${taskObj._id}`);

            //Evento Drag
            task.setAttribute("draggable", false);
            task.addEventListener("dragstart", event => drag(event))

            //Eliminamos el evento click de la tarea para permitir el drag
            task.addEventListener("click", event => {
                event.preventDefault();
            });


            task.innerHTML = `
                <h3 contentEditable='true' onfocus='titleFocus(event)' onblur='titleBlur(event)' onkeydown='titleKeyDown(event)'>${taskObj.name}</h3>
                <div class="buttoner"></div>
            `;

            //Añadimos la tarea al div lista tareas
            listaTareas.appendChild(task);

            //Evento para la asignación de miembros
            task.onmouseover = event => {
                addMember(event);
            }
        })
        .catch(err => alert(`Error: Fail to create task on the DB. ${err}`));
}

let titleFocus = (event) => {
    taskNameTemp = event.target.innerText;
}

let titleBlur = (event) => {
    if (event.target.innerText === "") {
        event.target.innerText = taskNameTemp;
    } else {
        taskObj.name = event.target.innerText;
        updateTaskObj(taskObj);
        event.target.innerText = taskObj.name;
    }
}

let titleKeyDown = (event) => {
    if (event.keyCode === 13) {
        event.target.blur();
    }
}

let addMember = (event) => {
    event.target.onkeydown = event => {
        let buttoner = document.querySelector(`[id='${event.target.id}'] .buttoner`)

        if (event.keyCode === 32 && buttoner != null) {
            let miembro = document.createElement('img');
            miembro.src = "./img/miembro.png";

            miembro.classList.add("miembro-icon");

            // if (typeof buttoner.childNodes[0] === 'undefined') {
            //     buttoner.appendChild(miembro);
            // } else {
            //     buttoner.childNodes[0].remove();
            // }

            if (taskObj.member === false) {
                buttoner.appendChild(miembro);

            } else {
                buttoner.childNodes[0].remove();

            }

            taskObj.member = !taskObj.member;
        }
    }
}

class Task {
    constructor(name, creationDate) {
        this.name = name;
        this.creationDate = creationDate;
        this.description = "";
        this.member = false;
        this.comments = [];
    }

    addComment(comment) {
        this.comments.push(comment);
    }

    removeComment(index) {
        this.comments.splice(index, 1);
    }
}

function searchTaskObj(id) {
    for (const task of tasksArray) {
        if (task.id === id) return task;
    }
}

function updateTaskObj(taskObj) {
    for (let task of tasksArray) {
        if (task.id === taskObj.id) task = taskObj;
    }
}

const changeBackground = (picker) => {
    let color = picker.toRGBString();

    document.body.style.backgroundColor = color;
    document.querySelector(".menuBar").style.backgroundColor = color;
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    if (ev.target.parentNode.className === "tasksList") {
        ev.dataTransfer.setData("id", ev.target.id);
    }
}

function drop(ev) {
    //Comprobamos que target ha recibido el evento de drop
    if (ev.target.className === "tasksList") {
        ev.preventDefault();

        var data = ev.dataTransfer.getData("id");

        //Comprobamos si el id es !null por si es una subtarea
        if (document.getElementById(data) !== null) {
            let objToDrop = document.getElementById(data);
            ev.target.appendChild(objToDrop);
        }
    }
}