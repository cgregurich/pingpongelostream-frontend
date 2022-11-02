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
<<<<<<< HEAD
    class="login-btn flex leading-none justify-center items-start bg-black text-white rounded-lg text-md transition-none px-4 py-3 h-min hover:bg-gray-800 active:bg-gray-700 
=======
<<<<<<< HEAD:src/components/SecondaryButton.vue
    class="login-btn bg-white text-black border border-black rounded-lg text-md transition-none px-4 h-12 hover:bg-gray-200 active:bg-gray-700 
=======

    class="login-btn flex leading-none justify-center items-start bg-black text-white rounded-lg text-md transition-none px-4 py-3 h-min hover:bg-gray-800 active:bg-gray-700 

>>>>>>> main:src/components/PrimaryButton.vue
>>>>>>> main
    disabled:bg-gray-400 disabled:text-gray-500"
    :disabled="disabled"
  >
    {{ text }}
  </button>
</template>