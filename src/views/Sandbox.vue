<script setup>
import { ref } from 'vue';
const input = ref(null);
</script>

<template>
<div class="container bg-red-200" @click.stop.prevent="input.focus()">
  <input ref="input" type="text" class="border border-black">
</div>  
</template>