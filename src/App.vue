<template>
  <div id="app" class="main">
    <!-- Sidebar -->
    <aside class="sidebar">
      <h1 class="logo">Plan&Go</h1>
      <nav class="nav">
        <ul>
          <li :class="{ active: currentView === 'Weltkarte' }">
            <a href="#" @click.prevent="switchView('Weltkarte')">
              <span class="icon">🌍</span> Weltkarte
            </a>
          </li>
          <li :class="{ active: currentView === 'BudgetPlaner' }">
            <a href="#" @click.prevent="switchView('BudgetPlaner')">
              <span class="icon">💰</span> Budget Planer
            </a>
          </li>
          <li :class="{ active: currentView === 'ToDoListe' }">
            <a href="#" @click.prevent="switchView('ToDoListe')">
              <span class="icon">📝</span> To-Do Liste
            </a>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Hauptinhalt -->
    <section class="content">
      <component :is="currentView" />
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Weltkarte from "./components/Weltkarte.vue";
import BudgetPlaner from "./components/BudgetPlaner.vue";
import ToDoListe from "./components/ToDo.vue";

export default defineComponent({
  name: "App",
  components: {
    Weltkarte,
    BudgetPlaner,
    ToDoListe,
  },
  data() {
    return {
      currentView: "Weltkarte", // Standardansicht
    };
  },
  methods: {
    switchView(view: string) {
      console.log("Wechsel zu:", view); // Debugging-Log
      this.currentView = view;
    },
  },
});
</script>

<style scoped>
/* Globale Styles */
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  height: 100vh;
  overflow: hidden; /* Kein Scrollen */
  display: flex;
  background-color: #121212; /* Dunkles Design */
  color: white;
}

.main {
  display: flex;
  height: 100vh; /* Volle Höhe */
  width: 100vw; /* Volle Breite */
}

/* Sidebar */
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: 240px;
  height: 100vh;
  background-color: #1a1a1a; /* Dunkleres Grau */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1rem;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
  z-index: 10; /* Sicherstellen, dass die Sidebar über der Content-Ebene liegt */
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
  text-transform: uppercase;
  text-align: center;
  width: 100%;
}

.nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.nav li {
  margin: 1rem 0;
  width: 100%;
}

.nav a {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.8);
  padding: 0.8rem;
  border-radius: 5px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.nav a:hover {
  background-color: #333333;
  color: white;
}

.nav .icon {
  margin-right: 0.8rem;
  font-size: 1.2rem;
}

.nav .active a {
  background-color: #333333;
  color: white;
}

/* Content */
.content {
  margin-left: 240px; /* Platz für Sidebar */
  flex: 1;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #181818; /* Hintergrund für den Content */
  z-index: 1; /* Stellt sicher, dass Content nicht über Sidebar liegt */
}
</style>
