const todos = [];
const RENDER_EVENT = "render-todo";

document.addEventListener("DOMContentLoaded", function () {

    const submitForm = document.getElementById("form");

    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        addTodo();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

function addTodo() {
    const textTodo = document.getElementById("title").value;
    const timestamp = document.getElementById("date").value;

    const generatedID = generateId();
    const todoObject = generateTodoObject(generatedID, textTodo, timestamp, false);
    todos.push(todoObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    alert("Your data has been successfully saved");
}

function generateId() {
    return +new Date();
}


function generateTodoObject(id, task, timestamp, isCompleted) {
    return {
        id,
        task,
        timestamp,
        isCompleted
    }
}

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedTODOList = document.getElementById("todos");
    uncompletedTODOList.innerHTML = "";

    const completedTODOList = document.getElementById("completed-todos");
    completedTODOList.innerHTML = "";

    for (todoItem of todos) {
        const todoElement = makeTodo(todoItem);

        if (todoItem.isCompleted == false)
            uncompletedTODOList.append(todoElement);
        else
            completedTODOList.append(todoElement);
    }
});

function makeTodo(todoObject) {
    const textTitle = document.createElement("h2");
    textTitle.innerText = todoObject.task;

    const textTimestamp = document.createElement("p");
    textTimestamp.innerText = todoObject.timestamp;

    const textContainer = document.createElement("div");
    textContainer.classList.add("inner")
    textContainer.append(textTitle, textTimestamp);

    const container = document.createElement("div");
    container.classList.add("item", "shadow")
    container.append(textContainer);
    container.setAttribute("id", `todo-${todoObject.id}`);

    if (todoObject.isCompleted) {
        const undoButton = document.createElement("button");
        undoButton.innerHTML = '<i class="fas fa-undo"></i>';
        undoButton.classList.add("undo-button");
        undoButton.style.marginRight = "20px";
        undoButton.addEventListener("click", function () {
            undoTaskFromCompleted(todoObject.id);
        });

        const trashButton = document.createElement("button");
        trashButton.innerHTML = '<i class="fas fa-trash"></i>';
        trashButton.classList.add("trash-button");
        trashButton.style.marginRight = "20px";
        trashButton.addEventListener("click", function () {
            removeTaskFromCompleted(todoObject.id);
        });

        container.append(undoButton, trashButton);
    } else {
        const checkButton = document.createElement("button");
        checkButton.innerHTML = '<i class="fas fa-check"></i>';
        checkButton.classList.add("check-button");
        checkButton.style.marginRight = "20px"; // Mengatur jarak antara check button dan edit button ke arah kanan
        checkButton.addEventListener("click", function () {
            addTaskToCompleted(todoObject.id);
        });

        const editButton = document.createElement("button");
        editButton.innerHTML = '<i class="fas fa-edit"></i>';
        editButton.classList.add("edit-button"); // Menambahkan kelas "check-button" agar tampilan mirip dengan tombol check
        editButton.style.marginRight = "20px"; // Mengatur jarak antara check button dan edit button ke arah kanan
        editButton.addEventListener("click", function () {
            editTask(todoObject.id);
        });

        container.append(checkButton, editButton);
    }

    return container;
}

function addTaskToCompleted(todoId) {
    const todoTarget = findTodoIndex(todoId);
    if (todoTarget == -1) return;

    todos[todoTarget].isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findTodoIndex(todoId) {
    for (index in todos) {
        if (todos[index].id === todoId) {
            return index
        }
    }
    return -1
}

function removeTaskFromCompleted(todoId) {
    const todoTarget = findTodoIndex(todoId);
    if (todoTarget === -1) return;
    todos.splice(todoTarget, 1);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    alert("Your data has been successfully deleted");
}


function undoTaskFromCompleted(todoId) {
    const todoTarget = findTodoIndex(todoId);
    if (todoTarget == -1) return;

    todos[todoTarget].isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function editTask(todoId) {
    const todoTarget = findTodoIndex(todoId);
    if (todoTarget === -1) return;

    const newText = prompt("Edit your to-do item:");
    if (newText === null || newText.trim() === "") return;

    todos[todoTarget].task = newText.trim();
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(todos);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

const SAVED_EVENT = "saved-todo";
const STORAGE_KEY = "TODO_APPS";

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert("Your browser does not support local storage");
        return false
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);

    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (todo of data) {
            todos.push(todo);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}
