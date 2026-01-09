// =====================
// CONSTANTES
// =====================
const STORAGE_KEY = "tasks";

const FILTERS = {
  ALL: "all",
  PENDING: "pending",
  COMPLETED: "completed"
};

// =====================
// SELETORES
// =====================
const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const list = document.querySelector("#task-list");
const counter = document.getElementById("task-counter");
const filterButtons = document.querySelectorAll(".filters button");

// =====================
// ESTADO
// =====================
let tasks = [];
let currentFilter = FILTERS.ALL;

// =====================
// STORAGE
// =====================
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    tasks = Array.isArray(data) ? data : [];
  } catch {
    tasks = [];
  }
}

// =====================
// CONTADOR
// =====================
function updateCounter() {
  const total = tasks.length;
  const completed = tasks.filter(task => task.done).length;

  counter.textContent =
    total === 0
      ? "Nenhuma tarefa adicionada"
      : `${completed} de ${total} tarefas concluídas`;
}

// =====================
// FILTRO
// =====================
function getFilteredTasks() {
  if (currentFilter === FILTERS.PENDING) {
    return tasks.filter(task => !task.done);
  }

  if (currentFilter === FILTERS.COMPLETED) {
    return tasks.filter(task => task.done);
  }

  return tasks;
}

// =====================
// RENDERIZAÇÃO
// =====================
function renderTasks() {
  list.innerHTML = "";

  const filteredTasks = getFilteredTasks();

  filteredTasks.forEach(task => {
    const li = document.createElement("li");

    // Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;

    checkbox.addEventListener("change", () => {
      task.done = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    // Texto
    const span = document.createElement("span");
    span.textContent = task.text;

    if (task.done) {
      span.classList.add("completed");
    }

    // Botão remover
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "✕";

    removeBtn.addEventListener("click", () => {
      li.classList.add("removing");

      setTimeout(() => {
        tasks = tasks.filter(t => t.id !== task.id);
        saveTasks();
        renderTasks();
      }, 250);
    });

    li.append(checkbox, span, removeBtn);
    list.appendChild(li);
  });

  updateCounter();
}

// =====================
// EVENTOS
// =====================
form.addEventListener("submit", event => {
  event.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  const newTask = {
    id: Date.now(),
    text,
    done: false
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();

  input.value = "";
  input.focus();
});

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;

    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    renderTasks();
  });
});

// =====================
// INICIALIZAÇÃO
// =====================
loadTasks();
renderTasks();

