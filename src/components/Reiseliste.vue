<template>
  <div class="todo-list">
    <h2>Reiseliste</h2>
    <ul>
      <li v-for="(item, index) in reisen" :key="index">
        {{ item }}
        <button @click="removeItem(index)">Entfernen</button>
      </li>
    </ul>
    <input v-model="newReise" placeholder="Neues Reiseziel" />
    <button @click="addItem">Hinzufügen</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ReiseListe',
  data() {
    return {
      reisen: ['Deutschland', 'Frankreich', 'Spanien'], // Beispiel-Daten
      newReise: '',
    };
  },
  methods: {
    addItem() {
      if (this.newReise.trim() !== '') {
        this.reisen.push(this.newReise.trim());
        this.newReise = '';
      }
    },
    removeItem(index: number) {
      this.reisen.splice(index, 1);
    },
  },
});
</script>

<style scoped>
.todo-list {
  padding: 2rem;
  font-size: 1rem;
}

.todo-list h2 {
  margin-bottom: 1rem;
}

.todo-list ul {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
}

.todo-list li {
  margin: 0.5rem 0;
  display: flex;
  justify-content: space-between;
}

.todo-list input {
  padding: 0.5rem;
  font-size: 1rem;
  margin-right: 0.5rem;
}

.todo-list button {
  padding: 0.5rem 1rem;
  background-color: #706fd3;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.todo-list button:hover {
  background-color: #575fcf;
}
</style>
