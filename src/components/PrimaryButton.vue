<script setup>
defineProps({
  text: {
    type: String,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <button
    class="login-btn bg-black text-white rounded-lg text-lg transition-none w-32 h-12 hover:bg-gray-800 active:bg-gray-700 
    disabled:bg-gray-400 disabled:text-gray-500"
    @click="$emit('click')"
    :disabled="disabled"
  >
    {{ text }}
  </button>
</template>