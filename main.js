document.addEventListener('DOMContentLoaded', () => {
    console.log('Ya he cargado el DOM');

    let input = document.querySelector('.input');

    input.addEventListener('keyup', event => {
        input.placeholder = "Add task...";
        input.classList.remove("inputError");

        if (event.keyCode === 13) {
            let listaTareas = document.querySelector('.todo :nth-child(2)');

            let nombreTarea = event.target.value;

            if (nombreTarea === "") {
                if (input.classList[input.classList.item - 1] !== "inputError") {
                    input.classList.add("inputError");
                }

                input.placeholder = "The taskname can't be empty!";
            } else {
                let task = createTask(nombreTarea);

                listaTareas.appendChild(task);

                //Evento DRAG
                if (task.parentElement.className === 'tasksList') {
                    task.setAttribute("draggable", false);
                    task.addEventListener("dragstart", event => {
                        drag(event);
                    })
                }

                event.target.value = "";
            }
        }
    });
});

const createTask = (taskName) => {
    const taskId = "task" + Math.random();

    let task = document.createElement("div");
    task.classList.add('task');
    task.setAttribute("id", taskId);
    //task.setAttribute("href", `#${taskId}`);

    //Titulo de la tarea
    let title = document.createElement("h3");
    title.innerText = `${taskName}`;
    title.setAttribute("contentEditable", true);

    let taskNameTemp;

    title.addEventListener("focus", event => {
        taskNameTemp = event.target.innerText;
    });

    title.addEventListener("blur", event => {
        if (event.target.innerText === "") {
            event.target.innerText = taskNameTemp;
        }
    });

    title.addEventListener("keydown", event => {
        if (event.keyCode === 13) {
            event.target.blur();
        }
    });

    task.appendChild(title);

    //Creamos el div botonera
    let buttoner = document.createElement("div");
    buttoner.classList.toggle("buttoner");

    //Asignacion de miembros
    task.addEventListener("dblclick", event => {
        //Si la clase del padre de la tarea es otra tarea no hacemos nada
        if (event.target.parentNode.parentNode.parentNode.className !== 'subTasks') {
            let miembro = document.createElement('img');
            miembro.src = "./img/miembro.png";

            miembro.classList.add("miembro-icon");



            if (typeof buttoner.childNodes[2] === 'undefined') {
                buttoner.appendChild(miembro);
            } else {
                buttoner.childNodes[2].remove();
            }
        }
    });

    //Boton de completar
    let completeButton = document.createElement("button");
    completeButton.innerText = "✔️";
    completeButton.addEventListener("click", event => {


        if (completeButton.innerText === "✔️") {
            completeButton.innerText = "❌"

            //Si la clase del padre de la tarea es otra tarea la pintamos de verde sino a done
            if (event.target.parentNode.parentNode.parentNode.className === 'subTasks') {
                task.classList.toggle("taskCompleted");
            } else {
                let doing = document.querySelector('.done :nth-child(2)');

                doing.appendChild(task);
            }
        } else {
            completeButton.innerText = "✔️"

            //Si la clase del padre de la tarea es otra tarea la pintamos de verde sino a done
            if (event.target.parentNode.parentNode.parentNode.className === 'subTasks') {
                task.classList.toggle("taskCompleted");
            } else {
                let doing = document.querySelector('.toDo :nth-child(2)');

                doing.appendChild(task);
            }
        }
    })

    //Boton de eliminar
    let removeButton = document.createElement("button");
    removeButton.innerText = "🗑️";
    removeButton.addEventListener('click', event => {
        task.remove();
    });

    buttoner.appendChild(completeButton);
    buttoner.appendChild(removeButton);

    //SUBTAREAS
    let subTasks = document.createElement("div");
    subTasks.classList.add("subTasks");

    let subInput = document.createElement('input');
    subInput.placeholder = "Add subtask...";
    subInput.name = "subTask";
    subInput.classList.add("inputSubTask");

    subInput.addEventListener("keyup", event => {
        if (event.keyCode === 13) {
            event.target.parentNode.appendChild(createTask(subInput.value));
            subInput.value = "";
        }
    });

    subTasks.appendChild(subInput);

    //Reseteo draggable a los hijos de la task


    task.appendChild(subTasks);
    task.appendChild(buttoner);

    return task;
}

const changeBackground = (picker) => {
    let color = picker.toRGBString();

    document.body.style.backgroundColor = color;
    document.querySelector(".menuBar").style.backgroundColor = color;

    console.log(color);
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
    console.log(ev.dataTransfer);


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