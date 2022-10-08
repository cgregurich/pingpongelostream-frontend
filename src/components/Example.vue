<script setup>
import { exampleStore } from '@/stores/example';
const store = exampleStore();
</script>


<template>
  <h1 class="text-3xl">This is the example</h1>
  <p>username from store: {{ store.username }}</p>
  <div>count from store: {{ store.count }}</div>
</template>