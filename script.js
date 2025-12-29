let todos = [];
let editingId = null;

const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');

addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

function addTodo() {
    const text = todoInput.value.trim();

    if (text === '') {
        return;
    }

    const todo = {
        id: Date.now(),
        text: text,
        completed: false
    };

    todos.push(todo);
    todoInput.value = '';
    renderTodos();
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    renderTodos();
}

function toggleComplete(id) {
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        renderTodos();
    }
}

function startEdit(id) {
    const todo = todos.find(todo => todo.id === id);
    if (!todo) return;

    editingId = id;
    renderTodos();

    const textElement = document.querySelector(`[data-id="${id}"] .todo-text`);
    if (textElement) {
        textElement.focus();

        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(textElement);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

function saveEdit(id, newText) {
    const todo = todos.find(todo => todo.id === id);
    if (todo && newText.trim() !== '') {
        todo.text = newText.trim();
    }
    editingId = null;
    renderTodos();
}

function renderTodos() {
    todoList.innerHTML = '';

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.setAttribute('data-id', todo.id);

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'todo-checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => toggleComplete(todo.id));

        const textSpan = document.createElement('span');
        textSpan.className = 'todo-text';
        textSpan.textContent = todo.text;

        if (editingId === todo.id) {
            textSpan.contentEditable = true;
            textSpan.classList.add('editing');
            textSpan.addEventListener('blur', (e) => {
                saveEdit(todo.id, e.target.textContent);
            });
            textSpan.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    e.target.blur();
                }
            });
        } else {
            textSpan.addEventListener('dblclick', () => startEdit(todo.id));
        }

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'todo-actions';

        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.textContent = '編集';
        editBtn.addEventListener('click', () => startEdit(todo.id));

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '削除';
        deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);

        li.appendChild(checkbox);
        li.appendChild(textSpan);
        li.appendChild(actionsDiv);

        todoList.appendChild(li);
    });
}

renderTodos();
