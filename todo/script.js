class TodoList {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.filter = 'all';
        this.view = localStorage.getItem('view') || 'list';
        this.init();
    }

    init() {
        // Get DOM elements
        this.form = document.getElementById('todo-form');
        this.input = document.getElementById('todo-input');
        this.dateInput = document.getElementById('todo-date');
        this.list = document.getElementById('todo-list');
        this.tasksLeft = document.getElementById('tasks-left');
        this.clearCompleted = document.getElementById('clear-completed');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.viewButtons = document.querySelectorAll('.view-toggle');

        // Set default date to today
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        this.dateInput.value = now.toISOString().slice(0, 16);

        // Add event listeners
        this.form.addEventListener('submit', (e) => this.addTodo(e));
        this.clearCompleted.addEventListener('click', () => this.clearCompletedTodos());
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => this.setFilter(btn.dataset.filter));
        });
        this.viewButtons.forEach(btn => {
            btn.addEventListener('click', () => this.setView(btn.dataset.view));
        });

        // Initial render
        this.setView(this.view);
        this.render();
    }

    addTodo(e) {
        e.preventDefault();
        const text = this.input.value.trim();
        const date = this.dateInput.value;
        
        if (text) {
            // Add haptic feedback
            if (window.navigator.vibrate) {
                window.navigator.vibrate(50);
            }

            // Animate submit button
            const wrapper = this.form.querySelector('.input-wrapper');
            wrapper.classList.add('submitting');
            
            const todo = {
                id: Date.now(),
                text,
                completed: false,
                date: date || new Date().toISOString()
            };
            
            this.todos.unshift(todo);
            this.save();
            this.input.value = '';
            
            // Reset animation after completion
            setTimeout(() => {
                wrapper.classList.remove('submitting');
                this.render();
            }, 300);
        }
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.save();
            this.render();
        }
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.save();
        this.render();
    }

    clearCompletedTodos() {
        this.todos = this.todos.filter(t => !t.completed);
        this.save();
        this.render();
    }

    setFilter(filter) {
        this.filter = filter;
        this.filterButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        this.render();
    }

    setView(view) {
        this.view = view;
        localStorage.setItem('view', view);
        this.viewButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        this.list.className = `todo-list ${view}-view`;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        // Reset time parts for accurate date comparison
        const stripTime = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
        
        const dateStripped = stripTime(date);
        const todayStripped = stripTime(today);
        const tomorrowStripped = stripTime(tomorrow);
        const yesterdayStripped = stripTime(yesterday);

        if (dateStripped.getTime() === todayStripped.getTime()) {
            return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        } else if (dateStripped.getTime() === tomorrowStripped.getTime()) {
            return `Tomorrow at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        } else if (dateStripped.getTime() === yesterdayStripped.getTime()) {
            return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        } else {
            return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }
    }

    render() {
        const filteredTodos = this.todos.filter(todo => {
            if (this.filter === 'active') return !todo.completed;
            if (this.filter === 'completed') return todo.completed;
            return true;
        });

        this.list.innerHTML = filteredTodos.map(todo => `
            <div class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                <div class="todo-checkbox ${todo.completed ? 'checked' : ''}"
                     onclick="todoList.toggleTodo(${todo.id})"></div>
                <div class="todo-content">
                    <div class="todo-text">${todo.text}</div>
                    <div class="todo-date">${this.formatDate(todo.date)}</div>
                </div>
                <button class="delete-btn" onclick="todoList.deleteTodo(${todo.id})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');

        const activeTodos = this.todos.filter(t => !t.completed);
        this.tasksLeft.textContent = `${activeTodos.length} task${activeTodos.length === 1 ? '' : 's'} left`;
    }

    save() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }
}

const todoList = new TodoList(); 