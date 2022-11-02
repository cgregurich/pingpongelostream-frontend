<script setup>
import { ref, watch } from 'vue';
const props = defineProps({
  enteredText: {
    type: String,
    default: '',
    required: true,
  },
});
</script>


<template>
  <div class="input-container flex flex-col w-4/5 relative">
    <input
      class="box-border rounded-md active:border-0 focus:border-0 outline-0 px-2 py-1"
      :value="enteredText"
      @input="$emit('update:enteredText', $event.target.value)"
    >
  </div>
  
</template>