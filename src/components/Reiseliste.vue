<template>
  <div>
    <h2>Reiseliste</h2>
    <ul>
      <li v-for="reise in reisen" :key="reise.name">
        {{ reise.name }}
        <span v-if="reise.besucht"> - Besucht</span>
        <span v-else> - Nicht besucht</span>
      </li>
    </ul>
    <div class="add-reise">
      <input
        type="text"
        v-model="newReise"
        placeholder="Neue Reise hinzufügen"
        @keyup.enter="addReise"
      />
      <button @click="addReise">Hinzufügen</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Reiseliste',
  props: {
    reisen: Array,
  },
  data() {
    return {
      newReise: '',
    };
  },
  methods: {
    addReise() {
      if (this.newReise.trim() !== '') {
        this.$emit('add-reise', this.newReise.trim());
        this.newReise = '';
      }
    },
  },
};
</script>

<style>
ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 5px 0;
  font-size: 1.2em;
}

.add-reise {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
}

input[type="text"] {
  padding: 5px 10px;
  font-size: 1em;
  flex: 1;
}

button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 5px 15px;
  font-size: 1em;
  cursor: pointer;
  border-radius: 4px;
}

button:hover {
  background-color: #45a049;
}
</style>
