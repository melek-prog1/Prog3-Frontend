<script lang="ts">
import axios from "axios"; // Axios für API-Aufrufe importieren
import { ref, onMounted } from "vue";
import type { Land } from '@/Model/Land' // Vue Composition API verwenden

const apiEndpoint = import.meta.env.VITE_APP_BACKEND_BASE_URL + '/api/land'



export default {
  name: "App",
  setup() {
    const reisen = ref<Land[]>([]); // Daten werden hier gespeichert

    // Reiseliste aus dem Backend holen
    onMounted(() => {
      axios
        .get<Land[]>(apiEndpoint)
        .then((res) => {
          reisen.value = res.data; // Daten vom Backend speichern
        })
        .catch((err) => {
          console.error("Fehler beim Abrufen der Reiseliste:", err); // Fehlerbehandlung
        });
    });

    return {
      reisen,
    };
  },
};
</script>

<style>
h1 {
  text-align: center;
  color: #4CAF50;
  margin-bottom: 20px;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin: 5px 0;
  font-size: 1.2em;
}
</style>

<template>
  <div id="app">
    <h1>Reiseliste</h1>
    <ul>
      <li v-for="land in reisen" :key="land.name">
        {{ land.name }} -
        <span v-if="land.besucht">Besucht</span>
        <span v-else>Nicht besucht</span> -
        <span v-if="land.geplant">Geplant</span>
        <span v-else>Nicht geplant</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
h1 {
  text-align: center;
  color: #4CAF50;
  margin-bottom: 20px;
}

.input-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

input {
  padding: 8px;
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  margin-left: 10px;
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin: 5px 0;
  font-size: 1.2em;
  text-align: center;
}
</style>
