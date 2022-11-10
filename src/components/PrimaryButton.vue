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
    class="primary-button flex leading-none justify-center items-start bg-site-color-two text-white rounded-lg text-md transition-none px-4 py-3 h-min hover:bg-site-color-two-light active:bg-site-color-two-lighter disabled:bg-gray-400 disabled:text-gray-500"
    :disabled="disabled"
  >
    {{ text }}
  </button>
</template>