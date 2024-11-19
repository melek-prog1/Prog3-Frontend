<template>
  <div id="app">
    <h1> Meine Reisen</h1>
    <Reiseliste :reisen="reisen" @add-reise="addReise" />
  </div>
</template>

<script>
import Reiseliste from './components/Reiseliste.vue';

export default {
  name: 'App',
  components: {
    Reiseliste,
  },
  data() {
    return {
      reisen: [
        { name: 'Deutschland', besucht: true },
        { name: 'Italien', besucht: false },
        { name: 'Japan', besucht: false },
      ],
    };
  },
  methods: {
    addReise(newReise) {
      this.reisen.push({ name: newReise, besucht: false });
    },
  },
};
</script>

<style>
h1 {
  text-align: center;
  color: #4CAF50;
  font-family: Arial, sans-serif;
  margin-bottom: 20px;
}
</style>
