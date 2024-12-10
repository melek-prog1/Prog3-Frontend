<template>
  <div>
    <h1>Reiseliste</h1>
    <ul>
      <li v-for="land in reisen" :key="land.name">
        {{ land.name }} - {{ land.besucht ? "Besucht" : "Nicht besucht" }}
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Reiseliste",
  data() {
    return {
      reisen: [], // Hier werden die Länder gespeichert
    };
  },
  mounted() {
    axios
      .get("http://localhost:8080/api/laender") // API-Endpunkt aufrufen
      .then((response) => {
        this.reisen = response.data; // Daten speichern
      })
      .catch((error) => {
        console.error("Fehler beim Abrufen der Reiseliste:", error); // Fehlerprotokoll
      });
  },
};
</script>

<style scoped>
h1 {
  text-align: center;
  color: #4CAF50;
  font-family: Arial, sans-serif;
  margin-bottom: 20px;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin: 5px 0;
  font-size: 1.2em;
}
</style>
