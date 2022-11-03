<script setup>
import { ref, watch } from 'vue';
const props = defineProps({
  enteredText: {
    type: String,
    default: '',
    required: true,
  },
  placeholder: {
    type: String,
    default: ''
  },
});
</script>


<template>
  <input
    class="box-border rounded-md border border-black px-2 py-1"
    :value="enteredText"
    :placeholder="placeholder"
    @input="$emit('update:enteredText', $event.target.value)"
  >
  
</template>