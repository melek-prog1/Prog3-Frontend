<template>
  <div class="todo-container">
    <!-- Überschrift -->
    <h1>To-Do Liste</h1>

    <!-- Kategorienfilter -->
    <div class="category-filter">
      <label for="category">Kategorie:</label>
      <select v-model="selectedCategory" id="category">
        <option value="Alle">Alle</option>
        <option value="Vorbereitung">Vorbereitung</option>
        <option value="Packliste">Packliste</option>
        <option value="Aktivitäten">Aktivitäten</option>
        <option value="Sonstiges">Sonstiges</option>
      </select>
    </div>

    <!-- To-Do Liste -->
    <ul class="todo-list">
      <li
        v-for="todo in filteredTodos"
        :key="todo.id"
        class="todo-item"
      >
        <div class="todo-left">
          <input type="checkbox" v-model="todo.completed" />
          <span>{{ todo.text }}</span>
        </div>
        <div class="todo-center">
          <span
            class="badge"
            :class="{
              'category-vorbereitung': todo.category === 'Vorbereitung',
              'category-packliste': todo.category === 'Packliste',
              'category-aktivitaeten': todo.category === 'Aktivitäten',
              'category-sonstiges': todo.category === 'Sonstiges'
            }"
          >
            {{ todo.category }}
          </span>
        </div>
        <div class="todo-right">
          <button class="delete-button" @click="deleteTodo(todo.id)">🗑️</button>
        </div>
      </li>
    </ul>

    <!-- Eingabefelder unten -->
    <div class="todo-input">
      <input
        v-model="newTodoText"
        placeholder="Neuen Eintrag hinzufügen"
        @keyup.enter="addTodo"
      />
      <select v-model="newTodoCategory">
        <option disabled value="">Kategorie auswählen</option>
        <option value="Vorbereitung">Vorbereitung</option>
        <option value="Packliste">Packliste</option>
        <option value="Aktivitäten">Aktivitäten</option>
        <option value="Sonstiges">Sonstiges</option>
      </select>
      <button @click="addTodo">Hinzufügen</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";

interface Todo {
  id: number;
  text: string;
  category: string;
  completed: boolean;
}

export default defineComponent({
  name: "ToDoListe",
  setup() {
    const todos = ref<Todo[]>([]);
    const newTodoText = ref("");
    const newTodoCategory = ref("Sonstiges"); // Standardwert
    const selectedCategory = ref("Alle"); // Standardfilter

    const addTodo = () => {
      if (!newTodoText.value.trim()) return; // Verhindert leere Einträge
      todos.value.push({
        id: Date.now(),
        text: newTodoText.value.trim(),
        category: newTodoCategory.value,
        completed: false,
      });
      newTodoText.value = "";
      newTodoCategory.value = "Sonstiges"; // Setzt die Kategorie nach dem Hinzufügen zurück
    };

    const deleteTodo = (id: number) => {
      todos.value = todos.value.filter((todo) => todo.id !== id);
    };

    const filteredTodos = computed(() => {
      if (selectedCategory.value === "Alle") {
        return todos.value;
      }
      return todos.value.filter((todo) => todo.category === selectedCategory.value);
    });

    return {
      todos,
      newTodoText,
      newTodoCategory,
      selectedCategory,
      addTodo,
      deleteTodo,
      filteredTodos,
    };
  },
});
</script>

<style scoped>
/* Container */
.todo-container {
  font-family: Arial, sans-serif;
  color: white;
  padding: 20px;
  margin-left: 240px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 80px; /* Abstand für die fixe Filterposition */
}

/* Überschrift */
h1 {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 24px;
  margin: 0;
}

/* Kategorien filter */
.category-filter {
  position: fixed; /* Fixe Position */
  top: 80px; /* Abstand unter der Überschrift */
  left: 50%;
  transform: translateX(-50%); /* Zentrieren */
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
  z-index: 10; /* Damit der Filter immer oben bleibt */
  background-color: #222; /* Hintergrundfarbe für den Filterbereich */
  padding: 10px;
  border-radius: 5px;
}

/* Liste */
.todo-list {
  list-style: none;
  padding: 0;
  margin: 0;
  margin-top: 100px; /* Abstand für die fixe Filterleiste */
}

/* Einträge */
.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin: 20px 0;
  padding: 5px;
  background-color: #222;
  border-radius: 5px;
}

/* Linke Spalte */
.todo-left {
  flex: 1.5;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Mittlere Spalte */
.todo-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

/* Rechte Spalte */
.todo-right {
  flex: 0.5;
  display: flex;
  justify-content: flex-end;
}

/* Eingabe */
.todo-input {
  display: flex;
  gap: 10px;
  position: fixed;
  bottom: 20px;
  left: 260px;
  right: 20px;
}

.todo-input input,
.todo-input select {
  flex: 1;
  padding: 10px;
  border-radius: 5px;
  border: none;
  background-color: #333;
  color: white;
}

.todo-input button {
  padding: 10px 20px;
  background-color: #69079d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.todo-input button:hover {
  background-color: #4e056d;
}

/* Kategorien */
.category-vorbereitung {
  background-color: #005f8d;
  color: white;
}

.category-packliste {
  background-color: #ff5733;
  color: white;
}

.category-aktivitaeten {
  background-color: #388e3c;
  color: white;
}

.category-sonstiges {
  background-color: #757575;
  color: white;
}

/* Hover-Effekt für Kategorien */
.todo-item .badge:hover {
  transform: scale(1.1);
  transition: all 0.3s ease;
}
</style>
