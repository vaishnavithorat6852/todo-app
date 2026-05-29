const addTodoBtn = document.getElementById("addTodoBtn");
const inputTag = document.getElementById("todoInput");
const list = document.getElementById("todoList");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");
const itemsLeft = document.getElementById("itemsLeft");

let todos = [];
let currentFilter = "all";

const stored = localStorage.getItem("todos");
if (stored) {
    todos = JSON.parse(stored);
}

const saveTodos = () => {
    localStorage.setItem("todos", JSON.stringify(todos));
};

const updateItemsLeft = () => {
    const count = todos.filter(todo => !todo.isCompleted).length;
    itemsLeft.textContent = `${count} item${count !== 1 ? "s" : ""} left`;
};

const populateTodos = () => {
    list.innerHTML = "";

    const filtered = todos.filter(todo => {
        if (currentFilter === "active") return !todo.isCompleted;
        if (currentFilter === "completed") return todo.isCompleted;
        return true;
    });

    filtered.forEach((todo) => {
        const actualIndex = todos.indexOf(todo);

        const li = document.createElement("li");
        li.className = `todo-item ${todo.isCompleted ? "completed" : ""}`;

        li.innerHTML = `
            <input type="checkbox" class="todo-checkbox" data-index="${actualIndex}" ${todo.isCompleted ? "checked" : ""}>
            <span class="todo-text">${todo.title}</span>
            <button class="delete-btn" data-index="${actualIndex}">×</button>
        `;

        list.appendChild(li);
    });

    updateItemsLeft();
};

addTodoBtn.addEventListener("click", () => {
    const text = inputTag.value.trim();
    if (!text) return;

    todos.push({
        title: text,
        isCompleted: false
    });

    saveTodos();
    populateTodos();
    inputTag.value = "";
});

inputTag.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTodoBtn.click();
});

list.addEventListener("click", (e) => {
    const index = e.target.getAttribute("data-index");

    if (e.target.classList.contains("todo-checkbox")) {
        todos[index].isCompleted = e.target.checked;
        saveTodos();
        populateTodos();
    }

    if (e.target.classList.contains("delete-btn")) {
        const sure = confirm("Delete this todo?");
        if (!sure) return;

        todos.splice(index, 1);
        saveTodos();
        populateTodos();
    }
});

document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.getAttribute("data-filter");
        populateTodos();
    });
});

clearCompletedBtn.addEventListener("click", () => {
    todos = todos.filter(t => !t.isCompleted);
    saveTodos();
    populateTodos();
});

populateTodos();