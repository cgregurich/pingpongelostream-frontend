<script setup>
import { exampleStore } from '../stores/example';
const store = exampleStore();
</script>

<template>
  <h1>Play Match</h1>
  <button @click="store.increment">Increment</button>
</template>