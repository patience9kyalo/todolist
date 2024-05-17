let tasks = JSON.parse(localStorage.getItem('tasks')) || [
    {
        id: Math.ceil(Math.random() * 1000),
        text: '',
        task: '',
    }
];

const mainDiv = document.querySelector('.tasks');
const taInput = document.getElementById('task');
const teInput = document.getElementById('text');
const button = document.getElementById('btn');

function displayTasks() {
    let lists = "";

    if (!tasks.length) {
        lists = '<p><i>No tasks found</i></p>';
    } else {
        tasks.forEach(task => {
            lists += `
            <div class="items" data-id="${task.id}">
                <h1 ondblclick="editTask(${task.id}, 'task')">${task.task}</h1>
                <p ondblclick="editTask(${task.id}, 'text')">${task.text}</p>
                <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="toggleCompletion(${task.id})">
                <div class='btn'>
                    <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
                    <button class="update-btn" onclick="updateTask(${task.id})">Update</button>
                </div>
            </div>
            `;
        });
    }
    mainDiv.innerHTML = lists;
}

function upsertTask(id = Math.ceil(Math.random() * 1000)) {
    let task = {
        id: id,
        text: teInput.value,
        task: taInput.value,
        completed:false
    };

    if (button.textContent === 'Add') {
        if (validateInput(task)) {
            tasks.push(task);
        } else {
            alert("Please enter both task and text.");
        }
    } else {
        tasks = tasks.map(t => t.id === id ? { ...t, ...task } : t);
        button.textContent = 'Add'
    }

    taInput.value = '';
    teInput.value = '';
    saveTasks();
    displayTasks();
}

function validateInput(task) {
    return task.task.trim() !== '' && task.text.trim() !== '';
}

function deleteTask(id) {
    if (window.confirm("Do you want to delete this task?")) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        displayTasks();
    }
}

function updateTask(id) {
    let task = tasks.find(task => task.id === id);
    if (task) {
        taInput.value = task.task;
        teInput.value = task.text;
        button.textContent = 'Update';
        button.setAttribute('data-update-id', id);
    }
}
function editTask(id, field) {
    const newValue = prompt("Enter new value:");
    if (newValue) {
        tasks = tasks.map(task => task.id === id ? { ...task, [field]: newValue } : task);
        saveTasks();
        displayTasks();
    }
}
function toggleCompletion(id) {
    tasks = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
    saveTasks();
    displayTasks();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

button.addEventListener('click', () => {
    if (button.textContent === 'Update') {
        const id = parseInt(button.getAttribute('data-update-id'));
        upsertTask(id);
        button.removeAttribute('data-update-id');
    } else {
        upsertTask();
    }
});

displayTasks();
