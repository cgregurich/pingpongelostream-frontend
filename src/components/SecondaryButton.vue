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

    class="secondary-button flex leading-none justify-center items-start bg-site-color-one text-black border border-site-color-two rounded-lg text-md transition-none px-4 py-3 h-min hover:bg-gray-200 active:bg-gray-300 disabled:bg-gray-400 disabled:text-gray-500"
    :disabled="disabled"
  >
    {{ text }}
  </button>
</template>