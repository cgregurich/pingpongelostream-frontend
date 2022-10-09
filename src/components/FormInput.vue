<script setup>
import { ref, watch } from 'vue';
const props = defineProps({
  labelText: String,
  enteredText: {
    type: String,
    default: '',
    required: true,
  },
  isPassword: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
    default: ''
  }
});
</script>


<template>
  <div class="input-container flex flex-col w-4/5 mb-6 relative">
    <font-awesome-icon v-if="icon" :icon="icon" class="absolute top-8 left-2" />
    <label>{{ labelText }}</label>
    <input
      class="box-border rounded-md border border-black pl-8 py-1"
      :type="isPassword ? 'password' : 'text'"
      :value="enteredText"
      @input="$emit('update:enteredText', $event.target.value)"
    >
  </div>
  
</template>